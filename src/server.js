const express = require("express");
const path = require("path");
// Prisma Clientをインポート
const { PrismaClient } = require("@prisma/client");
const axios = require('axios');

// Prisma Clientのインスタンスを作成
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

// '/api/terms'のエンドポイントをasync/awaitを使って書き換える
app.get("/api/terms", async (req, res) => {
  try {
    // Prismaを使ってデータベースから全ての用語を取得
    const terms = await prisma.stockTerm.findMany();
    res.json(terms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "データベースからの取得に失敗しました。" });
  }
});

app.get('/api/game/chart', async (req, res) => {
    // ゲームで使う銘柄リスト（今回は米国の有名企業）
    const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    // リストからランダムに1つ選ぶ
    const randomTicker = tickers[Math.floor(Math.random() * tickers.length)];
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${randomTicker}&apikey=${apiKey}&outputsize=compact`;

    try {
        const response = await axios.get(url);
        const timeSeries = response.data['Time Series (Daily)'];

        if (!timeSeries) {
            // APIからのデータが期待通りでない場合
            return res.status(500).json({ error: '外部APIからデータを取得できませんでした。' });
        }

        // データを使いやすい形式に加工
        const processedData = Object.entries(timeSeries).map(([date, values]) => ({
            date: date,
            price: parseFloat(values['4. close']),
        })).slice(0, 100).reverse(); // 最新から100日分を取得し、日付を昇順に並べ替え

        res.json(processedData);

    } catch (error) {
    // ▼▼▼ この行を追加 ▼▼▼
    console.error("Alpha Vantage API Error:", error.message); 
    // ▲▲▲ この行を追加 ▲▲▲
    res.status(500).json({ error: 'チャートデータの取得中にエラーが発生しました。' });
}
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました。`);
});
// test commit

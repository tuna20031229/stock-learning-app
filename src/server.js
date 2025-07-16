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
    console.log("1. APIルート /api/game/chart が呼び出されました。"); // ログ ステップ1

    const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];
    const randomTicker = tickers[Math.floor(Math.random() * tickers.length)];
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

    if (!apiKey) {
        console.error("エラー: サーバーにALPHA_VANTAGE_API_KEYが設定されていません。");
        return res.status(500).json({ error: 'サーバー設定エラーです。' });
    }

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${randomTicker}&apikey=${apiKey}&outputsize=compact`;

    try {
        console.log(`2. Alpha Vantage APIを呼び出します。銘柄: ${randomTicker}`); // ログ ステップ2
        // 10秒のタイムアウトを追加
        const response = await axios.get(url, { timeout: 10000 }); 
        console.log("3. Alpha Vantageから正常に応答を受け取りました。"); // ログ ステップ3

        const timeSeries = response.data['Time Series (Daily)'];

        if (!timeSeries) {
            console.error("エラー: Alpha Vantageからのデータ構造が無効です:", response.data);
            return res.status(500).json({ error: '外部APIが無効なデータを返しました。' });
        }

        const processedData = Object.entries(timeSeries).map(([date, values]) => ({
            date: date,
            price: parseFloat(values['4. close']),
        })).slice(0, 100).reverse();

        console.log("4. 処理済みデータをフロントエンドに送信します。"); // ログ ステップ4
        res.json(processedData);

    } catch (error) {
        // ログ ステップ5
        console.error("5. CATCHブロックでエラーを捕捉しました:", error.message); 
        res.status(500).json({ error: 'チャートデータの取得中にエラーが発生しました。' });
    }
});

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました。`);
});
// test commit

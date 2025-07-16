const express = require("express");
const path = require("path");
// Prisma Clientをインポート
const { PrismaClient } = require("@prisma/client");

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

app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました。`);
});
// test commit

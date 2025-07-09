const express = require('express');
const path = require('path');

const stockTerms = require('../data/stockTerms'); // 作成したモックデータを読み込む

const app = express();
const PORT = process.env.PORT || 3000;

// 'public' ディレクトリを静的ファイル配信用に設定
app.use(express.static(path.join(__dirname, '../public')));

// '/api/terms' というURLにGETリクエストが来たら、JSON形式で株用語データを返す
app.get('/api/terms', (req, res) => {
    res.json(stockTerms);
});

app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました。`);
});
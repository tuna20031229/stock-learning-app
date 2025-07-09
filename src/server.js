const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 'public' ディレクトリを静的ファイル配信用に設定
app.use(express.static(path.join(__dirname, '../public')));

app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました。`);
});
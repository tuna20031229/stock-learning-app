// 将来的にはデータベースに置き換わる、株用語のモック（偽の）データ
const stockTerms = [
    { id: 1, term: '株式', description: '株式会社が資金調達のために発行する証券。所有者は会社の所有権の一部を持つことになる。' },
    { id: 2, term: '配当', description: '会社が利益の一部を株主に分配すること。インカムゲインの源泉となる。' },
    { id: 3, term: 'IPO', description: 'Initial Public Offeringの略。未上場企業が証券取引所に新規上場し、株式を公開すること。' },
    { id: 4, term: 'PER', description: 'Price Earnings Ratio（株価収益率）。株価が1株当たりの純利益の何倍であるかを示す指標。' },
];

// このデータを他のファイルから読み込めるようにする
module.exports = stockTerms;
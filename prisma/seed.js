// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const stockTermsData = require('../data/stockTerms.js');

const prisma = new PrismaClient();

async function main() {
    console.log(`シード処理を開始します...`);

    // 既存のデータを削除（必要に応じて）
    await prisma.stockTerm.deleteMany();
    console.log('既存の用語を削除しました。');

    // モックデータからdescriptionを除いた新しい配列を作成
    const dataToSeed = stockTermsData.map(term => ({
        term: term.term,
        description: term.description,
    }));

    // 新しいデータを挿入
    await prisma.stockTerm.createMany({
        data: dataToSeed,
    });

    console.log(`シード処理が完了しました。`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
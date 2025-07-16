document.addEventListener('DOMContentLoaded', () => {
    // HTML要素の取得
    const ctx = document.getElementById('stockChart').getContext('2d');
    const buyButton = document.getElementById('buy-button');
    const sellButton = document.getElementById('sell-button');
    const nextButton = document.getElementById('next-button');
    const resultText = document.getElementById('result-text');
    const questionText = document.getElementById('question-text');

    let stockChart; // Chart.jsのインスタンスを保持
    let fullData = []; // APIから取得した全データ
    let futureData = []; // 答え合わせに使う未来のデータ

    // --- ゲームのメイン関数 ---
    async function startGame() {
        // UIを初期状態にリセット
        uiReset();

        try {
            // バックエンドから株価データを取得
            const response = await fetch('/api/game/chart');
            fullData = await response.json();

            // データを過去（問題）と未来（答え）に分割
            const splitIndex = Math.floor(fullData.length * 0.8); // 80%を問題に
            const pastData = fullData.slice(0, splitIndex);
            futureData = fullData.slice(splitIndex);

            // 過去のデータだけでチャートを描画
            drawChart(pastData);

        } catch (error) {
            console.error('ゲームの開始に失敗しました', error);
            resultText.textContent = 'エラー。ページを更新してください。';
        }
    }

    // --- チャート描画関数 ---
    function drawChart(data, highlightData = []) {
        if (stockChart) {
            stockChart.destroy(); // 古いチャートを破棄
        }

        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                // mapを使って各データから日付と価格を抽出
                labels: data.map(d => d.date), 
                datasets: [{
                    label: '過去の株価',
                    data: data.map(d => d.price),
                    borderColor: 'blue',
                    borderWidth: 2,
                    pointRadius: 0,
                },
                {
                    label: '未来の株価',
                    data: highlightData.map(d => d.price),
                    borderColor: 'red',
                    borderWidth: 2,
                    pointRadius: 0,
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    // --- 結果を表示する関数 ---
    function showResult(userChoice) {
        // UIを結果表示状態に更新
        uiShowResult();

        // チャートに未来のデータを追加して再描画
        const pastData = fullData.slice(0, fullData.length - futureData.length);
        // 未来のデータをチャート上で区別するため、過去の最後の点を未来の最初の点として追加
        const futureChartData = [pastData[pastData.length - 1], ...futureData];
        drawChart(pastData, futureChartData);

        // 正解判定
        const startPrice = pastData[pastData.length - 1].price;
        const endPrice = futureData[futureData.length - 1].price;
        const priceChange = ((endPrice - startPrice) / startPrice) * 100;

        let isCorrect = false;
        if (userChoice === 'buy' && endPrice > startPrice) {
            isCorrect = true;
        } else if (userChoice === 'sell' && endPrice < startPrice) {
            isCorrect = true;
        }

        // 結果をテキストで表示
        if (isCorrect) {
            resultText.textContent = `正解！ (${priceChange.toFixed(2)}%)`;
            resultText.style.color = 'green';
        } else {
            resultText.textContent = `残念！ (${priceChange.toFixed(2)}%)`;
            resultText.style.color = 'red';
        }
    }

    // --- UIの状態を管理する関数 ---
    function uiReset() {
        buyButton.disabled = false;
        sellButton.disabled = false;
        nextButton.style.display = 'none';
        resultText.textContent = '';
        questionText.style.display = 'block';
    }

    function uiShowResult() {
        buyButton.disabled = true;
        sellButton.disabled = true;
        nextButton.style.display = 'inline-block';
        questionText.style.display = 'none';
    }

    // --- イベントリスナー ---
    buyButton.addEventListener('click', () => showResult('buy'));
    sellButton.addEventListener('click', () => showResult('sell'));
    nextButton.addEventListener('click', startGame);

    // --- ゲーム開始 ---
    startGame();
});
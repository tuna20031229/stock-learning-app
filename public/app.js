// HTMLドキュメントが完全に読み込まれてから処理を実行する
document.addEventListener('DOMContentLoaded', () => {
    const termsList = document.getElementById('terms-list');

    // サーバーのAPIから用語データを取得する
    fetch('/api/terms')
        .then(response => response.json()) // 受け取ったデータをJSONとして解釈する
        .then(data => {
            // データが空なら何もしない
            if (!data || data.length === 0) {
                termsList.innerHTML = '<li>用語が見つかりません。</li>';
                return;
            }

            // 取得したデータをもとにリスト項目(li)を作成して画面に追加する
            data.forEach(term => {
                const listItem = document.createElement('li');
                listItem.textContent = term.term; // 用語名を表示
                termsList.appendChild(listItem);
            });
        })
        .catch(error => {
            // エラーが発生した場合
            console.error('データの取得に失敗しました:', error);
            termsList.innerHTML = '<li>データの読み込みに失敗しました。</li>';
        });
});
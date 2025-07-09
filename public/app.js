document.addEventListener('DOMContentLoaded', () => {
    const termsListElement = document.getElementById('terms-list');
    const searchInputElement = document.getElementById('search-input');
    const termDetailElement = document.getElementById('term-detail');

    // 取得した全用語データをここに保存する
    let allTerms = [];

    // --- 関数定義 ---

    // 用語リストを表示する関数
    const displayTerms = (terms) => {
        termsListElement.innerHTML = ''; // リストを一旦空にする
        if (terms.length === 0) {
            termsListElement.innerHTML = '<li>該当する用語はありません。</li>';
            return;
        }
        terms.forEach(term => {
            const listItem = document.createElement('li');
            listItem.textContent = term.term;
            listItem.dataset.id = term.id; // 詳細表示のためにIDをdata属性に保存
            termsListElement.appendChild(listItem);
        });
    };

    // 用語の詳細を表示する関数
    const displayTermDetail = (termId) => {
        // allTermsの中から、指定されたIDの用語を見つける
        const term = allTerms.find(t => t.id === Number(termId));
        if (term) {
            termDetailElement.innerHTML = `
                <h3>${term.term}</h3>
                <p>${term.description}</p>
            `;
        }
    };

    // --- 初期化処理 ---

    // 最初に全データをサーバーから取得
    fetch('/api/terms')
        .then(response => response.json())
        .then(data => {
            allTerms = data; // 取得したデータを保存
            displayTerms(allTerms); // 全リストを初期表示
        })
        .catch(error => {
            console.error('データの取得に失敗しました:', error);
            termsListElement.innerHTML = '<li>データの読み込みに失敗しました。</li>';
        });

    // --- イベントリスナー設定 ---

    // 検索入力時のイベント
    searchInputElement.addEventListener('input', (event) => {
        const keyword = event.target.value.toLowerCase();
        const filteredTerms = allTerms.filter(term => 
            term.term.toLowerCase().includes(keyword)
        );
        displayTerms(filteredTerms);
    });

    // 用語リストクリック時のイベント (イベント委任)
    termsListElement.addEventListener('click', (event) => {
        if (event.target && event.target.nodeName === 'LI') {
            const termId = event.target.dataset.id;
            displayTermDetail(termId);
        }
    });
});
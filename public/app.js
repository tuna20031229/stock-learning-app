document.addEventListener('DOMContentLoaded', () => {
    const termsListElement = document.getElementById('terms-list');
    const searchInputElement = document.getElementById('search-input');
    const termDetailElement = document.getElementById('term-detail');

    let allTerms = [];

    // --- 関数定義 ---
    const displayTerms = (terms) => {
        termsListElement.innerHTML = '';
        if (terms.length === 0) {
            const messageItem = document.createElement('li');
            messageItem.textContent = '該当する用語はありません。';
            messageItem.style.cursor = 'default';
            termsListElement.appendChild(messageItem);
            return;
        }
        terms.forEach(term => {
            const listItem = document.createElement('li');
            listItem.textContent = term.term;
            listItem.dataset.id = term.id;
            termsListElement.appendChild(listItem);
        });
    };

    const displayTermDetail = (termId) => {
        const term = allTerms.find(t => t.id === Number(termId));
        if (term) {
            termDetailElement.innerHTML = `
                <h3>${term.term}</h3>
                <p>${term.description}</p>
            `;
        }
    };

    // --- 初期化処理 ---

    // ▼▼▼ ここから変更 ▼▼▼
    // ローディングメッセージを表示
    termsListElement.innerHTML = '<li>ローディング中...</li>';
    termDetailElement.innerHTML = '<p>用語を読み込んでいます。</p>';

    fetch('/api/terms')
        .then(response => {
            if (!response.ok) {
                throw new Error('ネットワークの応答が正しくありません。');
            }
            return response.json();
        })
        .then(data => {
            allTerms = data;
            displayTerms(allTerms);
            // 初期メッセージに戻す
            termDetailElement.innerHTML = '<p>リストから用語を選択すると、ここに詳細が表示されます。</p>';
        })
        .catch(error => {
            console.error('データの取得に失敗しました:', error);
            termsListElement.innerHTML = '<li>データの読み込みに失敗しました。</li>';
            termDetailElement.innerHTML = '<p>エラーが発生しました。ページを再読み込みしてください。</p>';
        });
    // ▲▲▲ ここまで変更 ▲▲▲

    // --- イベントリスナー設定 ---
    searchInputElement.addEventListener('input', (event) => {
        const keyword = event.target.value.toLowerCase();
        const filteredTerms = allTerms.filter(term => 
            term.term.toLowerCase().includes(keyword)
        );
        displayTerms(filteredTerms);
    });

    termsListElement.addEventListener('click', (event) => {
        if (event.target && event.target.dataset.id) { // IDがある要素のみ反応
            const termId = event.target.dataset.id;
            displayTermDetail(termId);
        }
    });
});
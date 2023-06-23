let OriginImg = document.getElementById('origin-img');
let canvas = document.getElementById('canvas');

// ドラッグ開始
// ここで定義されているfunctionは無名関数と呼ばれる
// eは引数で、イベントオブジェクトを参照している
// イベントが発生したときの詳細情報を持っている

OriginImg.addEventListener('dragover', function(e) {
    // 以下のスクリプトはe（イベントオブジェクト）のメソッドやプロパティを操作してい
    // preventDefaultとstopPropagationは、ブラウザーの既定の動作やイベントの伝播を防ぐために広く使用されます。
    e.preventDefault();
    e.stopPropagation();
    // ドロップ操作の結果として何が起こるべきかを制御
    e.dataTransfer.dropEffect = 'copy';
    //　その他のイベントオブジェクトのプロパティ
    // console.log('Start!!!!!!!!!!!!!!!!!!!');
    // console.log('e.target: ', e.target);
    // console.log('e.target.id: ', e.target.id);
    // console.log('e.currentTarget: ', e.currentTarget);
    // console.log('e.bubbles: ', e.bubbles);
    // console.log('e.cancelable: ', e.cancelable);
    // console.log('e.timeStamp: ', e.timeStamp);
    // console.log('Finish!!!!!!!!!!!!!!!!!!!');
});

// 'drop'イベントを対象（target）に追加します。これはユーザーがファイルをドロップしたときに発火します。
OriginImg.addEventListener('drop', function (e) {
    // イベントの伝播を止めます。これにより、親要素へのイベントの伝播が防がれます。
	e.stopPropagation();
    // ブラウザのデフォルトの動作（この場合、ファイルを新しいタブで開くなど）を防ぎます。
	e.preventDefault();
    // 新しいFileReaderオブジェクトを作成します。これは、ファイルの読み取りを非同期に行うためのAPIです。
	const reader = new FileReader();
    // ファイルが読み込まれたときに発火するイベントハンドラーを設定します。
	reader.onload = function (e) {
        // 画像のプレビュー要素（idが'preview'の要素）のsrc属性に、読み込まれたファイルのデータを設定します。
		document.getElementById('preview').src = e.target.result;
	}
    // ドロップされたファイル（ここでは最初のファイル）を読み込みます。読み込みはデータURLとして行われます。
	reader.readAsDataURL(e.dataTransfer.files[0]);
    console.log(e.target.result);
});


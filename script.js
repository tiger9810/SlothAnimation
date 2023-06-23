let OriginImg = document.getElementById('origin-img');

// dragover時のイベント設定
OriginImg.addEventListener('dragover', function(e) {
    // eventの伝搬停止とブラウザのデフォルト動作の防止
    e.stopPropagation();
    e.preventDefault();

    // ドロップ時の効果を指定するプロパティ：dataTransfer
    e.dataTransfer.dropEffect = 'copy';
});

// drop時のイベント設定
OriginImg.addEventListener('drop', function (e) {
    // eventの伝搬停止とブラウザのデフォルト動作の防止
    e.stopPropagation();
	e.preventDefault();
    // pタグにDOM操作で画像名をテキストに指定
    document.getElementById('origin-img-name').textContent = e.dataTransfer.files[0].name;
	
    // ファイルの非同期読み込みを行うためのFileReaderオブジェクトの作成
	const reader = new FileReader();

    // 読み込み完了時の処理
	reader.onload = function (e) {
		document.getElementById('preview').src = e.target.result;
        document.getElementById('preview').width = "300";
        document.getElementById('preview').height = "300";
	};
    // ファイルの非同期読み込み
	reader.readAsDataURL(e.dataTransfer.files[0]);
});


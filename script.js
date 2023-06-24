let OriginImg = document.getElementById('origin-img');
let preview = document.getElementById('preview');
let ConvBtn = document.getElementById('convert-btn');
let img = new Image();

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
            const imgDataURL = e.target.result;
            preview.src = imgDataURL;
            img.src = imgDataURL;
            preview.width = "300";
            preview.height = "300";
            };
                // ファイルの非同期読み込み
                reader.readAsDataURL(e.dataTransfer.files[0]);
        });

// 変換ボタン押下時のイベント設定
ConvBtn.addEventListener('click', function(e) {
    // canvas要素の取得
    const canvas = document.getElementById('dotImg');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    // Canvasのサイズを画像サイズに合わせる
    canvas.width = img.width;
    canvas.height = img.height;
    // 画像をCanvasに描画
    ctx.drawImage(img, 0, 0);
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    if (imgData) {
        let mosaic_dot = parseInt(document.getElementById('mosaic-dot').value, 10);
        console.log(mosaic_dot);
        //縦のモザイク処理
        for (let y = 0; y < imgData.height; y += mosaic_dot) {
            //横のモザイク処理
            for (let x = 0; x < imgData.width; x += mosaic_dot) {
                // 1ピクセル=4要素なので、4要素ずつ処理
                let i = (y * imgData.width + x) * 4;
                // 1ピクセルのRGB値を取得
                for (let dy = 0; dy < mosaic_dot && y + dy < imgData.height; dy++) {
                    for (let dx = 0; dx < mosaic_dot && x + dx < imgData.width; dx++) {
                        let j = ((y + dy) * imgData.width + (x + dx)) * 4;
                        imgData.data[j + 0] = imgData.data[i + 0];
                        imgData.data[j + 1] = imgData.data[i + 1];
                        imgData.data[j + 2] = imgData.data[i + 2];
                        imgData.data[j + 3] = imgData.data[i + 3];
                    }
                }
            }
        }
        // モザイク化した画像データをCanvasに適用
        ctx.putImageData(imgData, 0, 0);
    }
});

// input(range)の値が変更された時のイベント設定
document.getElementById('mosaic-dot').addEventListener('input', function(e) {
    // pタグにDOM操作で値をテキストに指定
    document.getElementById('mosaic-dot-value').textContent = `pixel size:${e.target.value}`;
});
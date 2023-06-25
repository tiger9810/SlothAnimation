let OriginImg = document.getElementById('origin-img');
let preview = document.getElementById('preview');
let ConvBtn = document.getElementById('convert-btn');
let DownloadBtn = document.getElementById("download-btn");
let isImageConverted = false; // 画像変換フラグを初期状態（未変換）に設定
let img = new Image();
let dot = document.getElementById('mosaic-dot');
let OriginImgName = document.getElementById('origin-img-name');

// ユーザーが選択したファイルを取得
const FileImg = document.getElementById("file-input");
// ファイルが選択された時のイベント設定
FileImg.addEventListener('change', function(e) {
    const selectImg = e.target.value;
    // ファイルが選択されていなければ処理を終了
    if (!selectImg) {
        return;
    }
    // ファイルの非同期読み込みを行うためのFileReaderオブジェクトの作成
    const reader = new FileReader();
    reader.onload = function (e) {
        const imgDataURL = e.target.result;
        // pタグにDOM操作で画像名をテキストに指定
        document.getElementById('mosaic-dot-value').textContent = "pixel size:20";
        preview.src = imgDataURL;
        img.src = imgDataURL;
        preview.width = 300;
        preview.height = 300;
    }
    // ファイルの非同期読み込み
    reader.readAsDataURL(e.target.files[0]);
});

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
    OriginImgName.textContent = e.dataTransfer.files[0].name;
	document.getElementById('mosaic-dot-value').textContent = "pixel size:20";
    // ファイルの非同期読み込みを行うためのFileReaderオブジェクトの作成
    const reader = new FileReader();

    // 読み込み完了時の処理
        reader.onload = function (e) {
            const imgDataURL = e.target.result;
            preview.src = imgDataURL;
            img.src = imgDataURL;
            preview.width = 300;
            preview.height = 300;
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
        let mosaic_dot = parseInt(dot.value, 10);
        //縦のモザイク処理
        for (let y = 0; y < imgData.height; y += mosaic_dot) {
            //横のモザイク処理
            for (let x = 0; x < imgData.width; x += mosaic_dot) {
                // 1ピクセル=4要素なので、4要素ずつ処理
                // mosaic_dot分割した後の左上のピクセルの色のインデックス
                let i = (y * imgData.width + x) * 4;
                // mosaic_dot分割した後の左上のピクセルのRGBA値を適用
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
        isImageConverted = true; // 画像変換フラグを変換済みに設定
    }
});

// input(range)の値が変更された時のイベント設定
document.getElementById('mosaic-dot').addEventListener('input', function(e) {
    // pタグにDOM操作で値をテキストに指定
    document.getElementById('mosaic-dot-value').textContent = `pixel size:${e.target.value}`;
});
// ダウンロードボタン押下時のイベント設定
DownloadBtn.addEventListener('click', function(e) {
    // 画像が変換されていなければダウンロード処理を実行しない
    if (!isImageConverted) {
        return;
    }
    let OriginImgNameWithoutPng = OriginImgName.textContent.split(".")[0];
    let dataURL = document.getElementById('dotImg').toDataURL();
    if (dataURL === "") {
        return;
    } else {
        let link = document.createElement('a');
        link.href = dataURL;
        link.download = `${OriginImgNameWithoutPng}_${dot.value}pixel.png`;
        link.click();
    }
});


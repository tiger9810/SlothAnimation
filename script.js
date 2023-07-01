let isImageConverted = false; // 画像変換フラグを初期状態（未変換）に設定
let isAnimeConverted = false;// 画像変換フラグを初期状態（未変換）に設定
let img = new Image();
let dotImgData;

function downloadImage() {
    // ダウンロード用のaタグを生成し、クリックイベントを発生させる
    const a = document.createElement('a');
    a.href = dotAnimationImg.toDataURL('image/png');
    a.download = 'mosaic.png';
    a.click();
}

// Idから要素を取得して、変数に代入する関数
function getId(id) {
    return document.getElementById(id);
}

// ダウンロードリンクを作成し、クリックイベントを発火させる関数
function downloadLink(canvasId, inputValue, text) {
    let url = getId(canvasId).toDataURL();
    let link = document.createElement('a');
    if (url === "") {
        return;
    } else {
        link.href = url;
        link.download = `${getId('origin-img-name').textContent.split(".")[0]}_${getId(inputValue).value}${text}.png`;
        link.click();
    }
}

// pタグにDOM操作でpixel sizeをテキストに指定する関数
function setPixelText(pId, text) {
    getId(pId).textContent = text;
}


// ファイルが選択された時のイベント設定
getId("file-input").addEventListener('change', function(e) {
    const selectImg = e.target.value;
    // ファイルが選択されていなければ処理を終了
    if (!selectImg) {
        return;
    }
    // ファイルの非同期読み込みを行うためのFileReaderオブジェクトの作成
    const reader = new FileReader();
    reader.onload = function (e) {
        const imgDataURL = e.target.result;
        getId('preview').src = imgDataURL;
        img.src = imgDataURL;
        // pタグにDOM操作でpixel sizeをテキストに指定
        setPixelText('mosaic-dot-value', 'pixel size:20');
        setPixelText('animation-value', 'animation:20');
    }
    // ファイルの非同期読み込み
    reader.readAsDataURL(e.target.files[0]);
    // pタグにDOM操作で画像名をテキストに指定
    getId('origin-img-name').textContent = e.target.files[0].name;
});

// dragover時のイベント設定
getId('origin-img').addEventListener('dragover', function(e) {
    // eventの伝搬停止とブラウザのデフォルト動作の防止
    e.stopPropagation();
    e.preventDefault();

    // ドロップ時の効果を指定するプロパティ：dataTransfer
    e.dataTransfer.dropEffect = 'copy';
});

// drop時のイベント設定
getId('origin-img').addEventListener('drop', function (e) {
    // eventの伝搬停止とブラウザのデフォルト動作の防止
    e.stopPropagation();
    e.preventDefault();
    // pタグにDOM操作で画像名をテキストに指定
    getId('origin-img-name').textContent = e.dataTransfer.files[0].name;
    setPixelText('mosaic-dot-value', 'pixel size:20');
    setPixelText('animation-value', 'animation:20');
    // ファイルの非同期読み込みを行うためのFileReaderオブジェクトの作成
    const reader = new FileReader();

    // 読み込み完了時の処理
        reader.onload = function (e) {
            const imgDataURL = e.target.result;
            getId('preview').src = imgDataURL;
            img.src = imgDataURL;
            };
                // ファイルの非同期読み込み
                reader.readAsDataURL(e.dataTransfer.files[0]);
        });

const dotAnimationImg = getId('dotAnimationImg');
const dotAnimationImgCtx = dotAnimationImg.getContext('2d', { willReadFrequently: true });
let dotAnimationImgData;

// 変換ボタン押下時のイベント設定
getId('convert-btn').addEventListener('click', function(e) {
    // canvas要素の取得
    const dotImg = getId('dotImg');
    const dotImgCtx = dotImg.getContext('2d', { willReadFrequently: true });

    // Canvasのサイズを画像サイズに合わせる
    dotImg.width = img.width;
    dotImg.height = img.height;

    // 画像をCanvasに描画
    dotImgCtx.drawImage(img, 0, 0);

    let imgData = dotImgCtx.getImageData(0, 0, dotImg.width, dotImg.height);
    if (imgData) {

        let mosaic_dot = parseInt(getId('mosaic-dot').value, 10);
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
        dotImgCtx.putImageData(imgData, 0, 0);
        dotAnimationImgData = imgData;
        isImageConverted = true; // 画像変換フラグを変換済みに設定
    }
});

// input(range)が変更さえた時のイベント設定関数
function inputRangeEvent(inputId, pId, text) {
    document.getElementById(inputId).addEventListener('input', function(e) {
        // pタグにDOM操作で値をテキストに指定
        document.getElementById(pId).textContent = `${text}:${e.target.value}`;
    });
}

// input(range)が変更さえた時のイベント
inputRangeEvent('mosaic-dot', 'mosaic-dot-value', 'pixel size');
inputRangeEvent('animation', 'animation-value', 'moved');

// download-btn押下時のイベント設定
getId("download-btn").addEventListener('click', function(e) {
    // 画像が変換されていなければダウンロード処理を実行しない
    if (!isImageConverted) {
        return;
    }
    downloadLink('dotImg', 'mosaic-dot', 'pixel_size');
});

// download-aniボタン押下時のイベント設定
getId('download-ani').addEventListener('click', function(e) {
    // 画像が変換されていなければダウンロード処理を実行しない
    if (!isAnimeConverted) {
        return;
    }
    downloadLink('AnimationImg', 'animation', 'pixel-moved');
});


// animation-btnを押した時に画像を任意ピクセル分上に移動させた画像を作成するイベント設定
getId('animation-btn').addEventListener('click', function(e) {
        // canvas要素の取得
        const AnimationImg = getId('AnimationImg');
        const AnimationImgCtx = AnimationImg.getContext('2d', { willReadFrequently: true });
    
        // Canvasのサイズを画像サイズに合わせる
        AnimationImg.width = img.width;
        AnimationImg.height = img.height;

        // Canvasのサイズを画像サイズに合わせる
        dotAnimationImg.width = img.width;
        dotAnimationImg.height = img.height;

        // 画像をCanvasに描画
        AnimationImgCtx.drawImage(img, 0, 0);

        let animationMove = -parseInt(getId('animation').value, 10);
        // 任意pixel画像を上に移動させた画像データを作成
        AnimationImgCtx.clearRect(0, 0, AnimationImg.width, AnimationImg.height);
        AnimationImgCtx.drawImage(img, 0, animationMove); 
        dotAnimationImgCtx.putImageData(dotAnimationImgData, 0, animationMove);

        isAnimeConverted = true; // 画像変換フラグを変換済みに設定
});
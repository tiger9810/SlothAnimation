let OriginImg = document.getElementById('origin-img');
let preview = document.getElementById('preview');
let ConvBtn = document.getElementById('convert-btn');
let DownloadBtn = document.getElementById("download-btn");
let dot = document.getElementById('mosaic-dot');
let animation = document.getElementById('animation');
let OriginImgName = document.getElementById('origin-img-name');

let isImageConverted = false; // 画像変換フラグを初期状態（未変換）に設定
let isAnimeConverted = false;// 画像変換フラグを初期状態（未変換）に設定
let img = new Image();
let dotImgData;

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
    }
    // ファイルの非同期読み込み
    reader.readAsDataURL(e.target.files[0]);
    // pタグにDOM操作で画像名をテキストに指定
    OriginImgName.textContent = e.target.files[0].name;
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
            };
                // ファイルの非同期読み込み
                reader.readAsDataURL(e.dataTransfer.files[0]);
        });

const dotAnimationImg = document.getElementById('dotAnimationImg');
const dotAnimationImgCtx = dotAnimationImg.getContext('2d', { willReadFrequently: true });
let dotAnimationImgData;

// 変換ボタン押下時のイベント設定
ConvBtn.addEventListener('click', function(e) {
    // canvas要素の取得
    const dotImg = document.getElementById('dotImg');
    const dotImgCtx = dotImg.getContext('2d', { willReadFrequently: true });


    // Canvasのサイズを画像サイズに合わせる
    dotImg.width = img.width;
    dotImg.height = img.height;

    // 画像をCanvasに描画
    dotImgCtx.drawImage(img, 0, 0);

    let imgData = dotImgCtx.getImageData(0, 0, dotImg.width, dotImg.height);
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
        dotImgCtx.putImageData(imgData, 0, 0);
        // dotAnimationImgCtx.putImageData(imgData, 0, 0);
        dotAnimationImgData = imgData;
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
        console.log(e);
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



// Animationのinput(range)の値が変更された時のイベント設定
document.getElementById('animation').addEventListener('input', function(e) {
    // pタグにDOM操作で値をテキストに指定
    document.getElementById('animation-value').textContent = `animation:${e.target.value}`;
});

// animation-btnを押した時に画像を任意ピクセル分上に移動させた画像を作成するイベント設定
document.getElementById('animation-btn').addEventListener('click', function(e) {
        // canvas要素の取得
        const AnimationImg = document.getElementById('AnimationImg');
        const AnimationImgCtx = AnimationImg.getContext('2d', { willReadFrequently: true });
    
        // Canvasのサイズを画像サイズに合わせる
        AnimationImg.width = img.width;
        AnimationImg.height = img.height;

        // Canvasのサイズを画像サイズに合わせる
        dotAnimationImg.width = img.width;
        dotAnimationImg.height = img.height;

        // 画像をCanvasに描画
        AnimationImgCtx.drawImage(img, 0, 0);


        let animationMove = -parseInt(animation.value, 10);
        // 任意pixel画像を上に移動させた画像データを作成
        AnimationImgCtx.clearRect(0, 0, AnimationImg.width, AnimationImg.height);
        AnimationImgCtx.drawImage(img, 0, animationMove); 
        dotAnimationImgCtx.putImageData(dotAnimationImgData, 0, animationMove);

        isAnimeConverted = true; // 画像変換フラグを変換済みに設定
});

    // ダウンロードボタン押下時のイベント設定
    const DownloadAnimationBtn = document.getElementById('download-ani')
    DownloadAnimationBtn.addEventListener('click', function(e) {
    // 画像が変換されていなければダウンロード処理を実行しない
    if (!isAnimeConverted) {
        
        return;
    }
    // ダウンロードリンクを作成し、クリックイベントを発火させる
    let url2 = document.getElementById('AnimationImg').toDataURL();
    const link = document.createElement('a');
    if (url2 === "") {
        return;
    } else {
    link.href = url2;
    link.download = `${OriginImgName.textContent.split(".")[0]}_${animation.value}pixel-moved.png`;
    link.click();
    }
});
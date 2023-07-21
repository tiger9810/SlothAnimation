let isImageConverted = false; // 画像変換フラグを初期状態（未変換）に設定
let isAnimeConverted = false; // 画像変換フラグを初期状態（未変換）に設定
let img = new Image();
let dotImgData;


// Idから要素を取得して、変数に代入する関数
function getId(id) {
    return document.getElementById(id);
}

// ダウンロードリンクを作成し、クリックイベントを発火させる関数
function downloadLink(canvasId, inputValue, text, type) {
    let url = "";

    if (type === "canvas") {
        url = getId(canvasId).toDataURL();
        let link = document.createElement('a');
        link.href = url;
        link.download = `${getId('origin-img-name').textContent.split(".")[0]}_${getId(inputValue).value}${text}.png`;
        link.click();
    } else if (type === "img") {
        url = getId(canvasId).src;
        let link = document.createElement('a');
        link.href = url;
        link.download = `${getId('origin-img-name').textContent.split(".")[0]}_${getId(inputValue).value}${text}.png`;
        link.click();
    } else {
        return;
    }
}

// pタグにDOM操作でpixel sizeをテキストに指定する関数
function setPixelText(pId, text) {
    getId(pId).textContent = text;
}

// canvasに描画する関数
function drawCanvas(canvasId) {
    // canvas要素の取得
    let canvas = document.getElementById(canvasId);
    let ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return { canvas: canvas, ctx: ctx };
}

// canvas画像からアニメーションを作成する関数
function createAnimation(canvasId1, canvasId2, imgId) {
    let canvas1 = getId(canvasId1);//一枚目の画像指定
    let canvas2 = getId(canvasId2);//二枚目の画像指定

    // ピクセルデータを取得
    let frames = [getPixelData(canvas1), getPixelData(canvas2)];

    // ピクセルデータをAPNGにエンコード
    let width = canvas1.width;
    let height = canvas1.height;
    let depth = 32;
    let delay = 300; // 1/100秒単位なので、500ミリ秒は50
    let png = UPNG.encode(frames, width, height, depth, [delay, delay]);

    // Blobとして取得し、URLを作成
    let url = URL.createObjectURL(new Blob([png]));

    // img要素を作成してAPNGを表示
    let animation = document.getElementById(imgId);
    animation.src = url;

    // Canvas2をクリア
    let ctx2 = canvas2.getContext('2d');
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
}

// ファイルが選択された時のイベント設定
getId("file-input").addEventListener('change', function(e) {
    const selectImg = e.target.files;
    // ファイルが選択されていなければ処理を終了
    if (!selectImg) {
        return;
    }
    // ファイルの非同期読み込みを行うためのFileReaderオブジェクトの作成
    const reader = new FileReader();
    reader.onload = function (e) {
        const imgDataURL = e.target.result;
        // pタグにDOM操作でpixel sizeをテキストに指定
        setPixelText('mosaic-dot-value', 'pixel dot:12');
        setPixelText('animation-value', 'moved:20');
        img.onload = function() {
            // Canvasに描画する関数
            let CanvasOrigin = drawCanvas("canvas-origin");
            AnimationImgData =CanvasOrigin.ctx.getImageData(0, 0, CanvasOrigin.canvas.width, CanvasOrigin.canvas.height);
        }

        img.src = imgDataURL;
        const OriginImg = drawCanvas('canvas-origin').canvas;
        const OriginImgCtx = drawCanvas('canvas-origin').ctx;
        OriginCanvasImgData = OriginImgCtx.getImageData(0, 0, OriginImg.width, OriginImg.height);
    }
    // ファイルの非同期読み込み
    reader.readAsDataURL(e.target.files[0]);
    // // pタグにDOM操作で画像名をテキストに指定
    // getId('origin-img-name').textContent = e.target.files[0].name;
});



let AnimationImgData;
let dotAnimationImgData;
let OriginCanvasImgData;

// convertボタン押下時のイベント設定
getId('convert-btn').addEventListener('click', function (e) {
    // canvas要素の取得
    const dotCanvas = drawCanvas('dotImg');
    const dotImg = dotCanvas.canvas
    const dotImgCtx = dotCanvas.ctx;
// console.log(dotImg.width);
// console.log(dotImg.height);
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
        dotAnimationImgData = imgData;
        dotImgCtx.putImageData(dotAnimationImgData, 0, 0);
        isImageConverted = true; // 画像変換フラグを変換済みに設定
    }
});

// input(range)が変更さえた時のイベント設定関数
function inputRangeEvent(inputId, pId, text) {
    document.getElementById(inputId).addEventListener('input', function (e) {
        // pタグにDOM操作で値をテキストに指定
        document.getElementById(pId).textContent = `${text}:${e.target.value}`;
    });
}

// input(range)が変更さえた時のイベント
inputRangeEvent('mosaic-dot', 'mosaic-dot-value', 'pixel dot');
inputRangeEvent('animation', 'animation-value', 'moved');

// download-dot押下時のイベント設定
getId("download-dot").addEventListener('click', function (e) {
    // 画像が変換されていなければダウンロード処理を実行しない
    if (!isImageConverted) {
        return;
    }
    downloadLink('dotImg', 'mosaic-dot', 'pixeldot', "canvas");
});

// download-aniボタン押下時のイベント設定
getId('download-ani').addEventListener('click', function(e) {
    // 画像が変換されていなければダウンロード処理を実行しない
    if (!isAnimeConverted) {
        return;
    }
    //downloadLink(Id, inputValue, text)
    downloadLink('aniApng', 'animation', 'pixel-moving', "img");
});

// download-ani-dotボタン押下時のイベント設定
getId('download-ani-dot').addEventListener('click', function(e) {
    // 画像が変換されていなければダウンロード処理を実行しない
    if (!isAnimeConverted) {
        return;
    }
    //downloadLink(Id, inputValue, text)
    downloadLink('aniDotApng', 'animation', 'pixel-moving(dot)', "img");
});

// Canvasからピクセルデータを取得する関数
function getPixelData(canvas) {
    let ctx = canvas.getContext('2d');
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return new Uint8Array(imgData.data.buffer);
}

// animation-btnを押した時に画像を任意ピクセル分上に移動させた画像を作成するイベント設定
getId('animation-btn').addEventListener('click', function(e) {    
        let animationMove = -parseInt(getId('animation').value, 10);

        // canvas要素の取得 //オリジナルアニメーション
        const AnimationImg = drawCanvas('AnimationImg').canvas;
        const AnimationImgCtx = drawCanvas('AnimationImg').ctx;

            //キャンバスの全領域を透明にクリアにする
        AnimationImgCtx.clearRect(0, 0, AnimationImg.width, AnimationImg.height);  

        // 任意pixel画像を上に移動させた画像データを作成
        AnimationImgCtx.putImageData(AnimationImgData, 0, animationMove);
        createAnimation('canvas-origin', 'AnimationImg', 'aniApng');


        // canvas要素の取得 //ドット絵アニメーション
        const dotAnimationImg = drawCanvas('dotAnimationImg').canvas;
        const dotAnimationImgCtx = drawCanvas('dotAnimationImg').ctx;
            //キャンバスの全領域を透明にクリアにする
        dotAnimationImgCtx.clearRect(0, 0, dotAnimationImg.width, dotAnimationImg.height); 

        // 任意pixel画像を上に移動させた画像データを作成
        dotAnimationImgCtx.putImageData(dotAnimationImgData, 0, animationMove);
        createAnimation('dotImg', 'dotAnimationImg', 'aniDotApng');
        isAnimeConverted = true; // 画像変換フラグを変換済みに設定
});
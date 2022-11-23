import { LinearEncoding } from "three";
import { sRGBEncoding } from "../threejs/build/three.module.js";
import { CanvasTexture, TextureLoader } from "../threejs/build/three.module.js";
import { VideoAPI } from "../threejs/VideoAPI.js";

let clean = () => {};
function work({ refCanvas, refVideo, refProgressBox, refDownloadBtn }) {
  console.log("work", refCanvas);

  clean();

  new Promise(async (resolve) => {
    //

    //frame

    let importObjects = {
      //
      bg_red_jpg: await new TextureLoader()
        .loadAsync(`/img/bg_red.jpg`)
        .then((t) => {
          t.encoding = sRGBEncoding;
          return t;
        }),
      frame_png: await new TextureLoader()
        .loadAsync(`/img/frame.png`)
        .then((t) => {
          t.encoding = sRGBEncoding;
          return t;
        }),
      ref_canvas: new CanvasTexture(refCanvas),
      ref_video: refVideo,
      ref_download_btn: refDownloadBtn,
      ref_progress_box: refProgressBox,
    };

    importObjects.ref_canvas.encoding = LinearEncoding;
    importObjects.ref_canvas.needsUpdate = true;

    let app = new VideoAPI({ importObjects });
    clean = () => {
      app.clean();
    };

    resolve();
  });
}

export { work };
/*
  width: 650px;
  height: 780px;
  */

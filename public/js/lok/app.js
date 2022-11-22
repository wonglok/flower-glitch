import { GLApp } from "../threejs/threejs";

let clean = () => {};
function work({ canvas }) {
  console.log("work", canvas);

  clean();
  let app = new GLApp({ refCanvas: canvas });
  clean = () => {
    app();
  };
}

export { work };
/*
  width: 650px;
  height: 780px;
  */

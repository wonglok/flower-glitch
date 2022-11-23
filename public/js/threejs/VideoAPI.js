import {
  Color,
  LinearEncoding,
  Mesh,
  WebGLRenderTarget,
  NearestFilter,
  RepeatWrapping,
  RGBAFormat,
  sRGBEncoding,
  WebGLRenderer,
  OrthographicCamera,
  Scene,
  MeshBasicMaterial,
  UnsignedByteType,
  ShaderMaterial,
  PlaneGeometry,
  DoubleSide,
  PerspectiveCamera,
  BufferGeometry,
  Float32BufferAttribute,
} from "./build/three.module.js";

class VideoAPI {
  constructor({ importObjects }) {
    this.cleans = [];
    this.tasks = [];

    //
    this.onLoop = (v) => {
      this.tasks.push(v);
    };

    this.onClean = (v) => {
      this.cleans.push(v);
    };

    this.renderer = new WebGLRenderer({
      preserveDrawingBuffer: true,
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(650, 780, true);

    // this.renderer.domElement.style.position = "fixed";
    // this.renderer.domElement.style.top = "0px";
    // this.renderer.domElement.style.left = "0px";
    // document.body.appendChild(this.renderer.domElement);
    // this.onClean(() => {
    //   document.body.removeChild(this.renderer.domElement);
    // });

    this.rttFBO = new WebGLRenderTarget(650, 780, {
      wrapS: RepeatWrapping,
      wrapT: RepeatWrapping,
      magFilter: NearestFilter,
      minFilter: NearestFilter,
      format: RGBAFormat,
      type: UnsignedByteType,
      anisotropy: 1,
      depthBuffer: true,
      stencilBuffer: true,
      generateMipmaps: false,
      encoding: LinearEncoding,
    });
    let {
      rateInput1Value,
      intensityInput1Value,
      amountInput1Value,

      //
      rateInput2Value,
      intensityInput2Value,
      amountInput2Value,
    } = importObjects.ref_effect_params;

    this.uvOffsets = {
      rateInput1Value: { value: Number(rateInput1Value) },
      intensityInput1Value: { value: Number(intensityInput1Value) },
      amountInput1Value: { value: Number(amountInput1Value) },

      //
      rateInput2Value: { value: Number(rateInput2Value) },
      intensityInput2Value: { value: Number(intensityInput2Value) },
      amountInput2Value: { value: Number(amountInput2Value) },
    };

    console.log(this.uvOffsets);
    this.uniforms0 = {
      ...this.uvOffsets,
      overallEffectLevel: { value: 0 },
      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    this.uniforms1 = {
      ...this.uvOffsets,
      overallEffectLevel: { value: 1 },
      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    this.uniforms2 = {
      ...this.uvOffsets,
      overallEffectLevel: { value: 0 },

      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    this.fScene = new Scene();
    this.fScene.background = new Color("#670009");

    let makeShader = ({ uniforms }) => {
      let shader = new ShaderMaterial({
        //
        transparent: true,
        uniforms: uniforms,
        vertexShader: `
          varying vec2 vUv;
          void main () {
            vUv = vec2(
              uv.x,
              1.0 - uv.y
            );
            gl_Position = vec4(position, 1.0);
            // gl_Position.z += 0.01;
          }
        `,
        fragmentShader: /* glsl */ `
        uniform sampler2D imageTexture;
        uniform float time;
        uniform float overallEffectLevel;
        varying vec2 vUv;

        uniform float rateInput1Value;
        uniform float intensityInput1Value;
        uniform float amountInput1Value;

        //
        uniform float rateInput2Value;
        uniform float intensityInput2Value;
        uniform float amountInput2Value;

        #define RATE 0.00025

        float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;
        }

        float offset(float blocks, vec2 uv, float rate) {
          float shaderTime = time * rate;
          return rand(vec2(shaderTime, round(uv.y * blocks)));
        }

        vec4 sRGBToLinear( in vec4 value ) {
          return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
        }

        void main () {
          float intensity = 1.0;
          float moveAmount = 1.0;
          float rate = 1.0;

          //
          intensity = intensityInput1Value * overallEffectLevel;
          moveAmount = amountInput1Value * 0.01 * overallEffectLevel;
          rate = 0.0001 * rateInput1Value * overallEffectLevel;

          vec2 uv1NoiseR = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseG = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseB = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseA = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);

          intensity = intensityInput2Value * overallEffectLevel;
          moveAmount = amountInput2Value * 0.01 * overallEffectLevel;
          rate = 0.0001 * rateInput2Value * overallEffectLevel;

          // intensity = 350.1 * overallEffectLevel;
          // moveAmount = 2.5 * 0.01 * overallEffectLevel;
          // rate = 0.0001 * overallEffectLevel;
          vec2 uv2NoiseR = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv2NoiseG = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv2NoiseB = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv2NoiseA = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);


          vec4 glitchColorR = texture2D(imageTexture, vUv + uv1NoiseR + uv2NoiseR);
          vec4 glitchColorG = texture2D(imageTexture, vUv + uv1NoiseG + uv2NoiseG);
          vec4 glitchColorB = texture2D(imageTexture, vUv + uv1NoiseB + uv2NoiseB);
          vec4 glitchColorA = texture2D(imageTexture, vUv + uv1NoiseA + uv2NoiseA);

          vec4 outColor = vec4(
            glitchColorR.r,
            glitchColorG.g,
            glitchColorB.b,
            glitchColorA.a
          );

          //sRGBToLinear
          gl_FragColor = (outColor);
        }

        `,
        //
      });

      return shader;
    };

    this.fsQuad0 = new FullScreenQuad(makeShader({ uniforms: this.uniforms0 }));
    this.fsQuad0._mesh.position.z += -0.0001;
    this.fScene.add(this.fsQuad0._mesh);
    this.fsQuad0._mesh.visible = false;

    this.fsQuad1 = new FullScreenQuad(makeShader({ uniforms: this.uniforms1 }));
    this.fsQuad1._mesh.position.z += 0.0;
    this.fScene.add(this.fsQuad1._mesh);

    this.fsQuad2 = new FullScreenQuad(makeShader({ uniforms: this.uniforms2 }));
    this.fsQuad2._mesh.position.z += 0.0001;
    this.fScene.add(this.fsQuad2._mesh);

    this.rttCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    //https://github.com/TrevorSundberg/h264-mp4-encoder

    // this.rttFBO.texture.encoding = LinearEncoding;

    this.rttDisplayPlane = new Mesh(
      new PlaneGeometry((650 / 100) * 0.5, (780 / 100) * 0.5),
      new MeshBasicMaterial({
        color: new Color(0xffffff),
        map: this.rttFBO.texture,
        transparent: true,
        side: DoubleSide,
      })
    );

    this.realScene = new Scene();
    this.realCamera = new PerspectiveCamera(
      75,
      this.renderer.domElement.width / this.renderer.domElement.height,
      0.1,
      500
    );
    this.rttDisplayPlane.scale.y = -1;
    this.realScene.add(this.rttDisplayPlane);
    this.realCamera.position.z = 3.5;

    // let rAFID = 0;
    // let rAF = () => {
    //   rAFID = requestAnimationFrame(rAF);
    //   this.work();
    // };
    // rAFID = requestAnimationFrame(rAF);
    // this.onClean(() => {
    //   cancelAnimationFrame(rAFID);
    // });
    import("../vendor/mp4encoder.js").then(({ HME }) => {
      HME.createH264MP4Encoder({}).then(async (encoder) => {
        //
        encoder.width = 650;
        encoder.height = 780;
        encoder.frameRate = 60;
        encoder.temporalDenoise = true;
        encoder.quantizationParameter = 15;
        encoder.initialize();
        //

        // let x0y0 = new Vector2(0, 0);
        // let fbTexture = new FramebufferTexture(
        //   encoder.width,
        //   encoder.height,
        //   RGBAFormat
        // );

        // //!SECTION
        //!SECTION
        let reducer = 0.1;
        let total = 60 * 1.5;
        for (let frame = 0; frame < total; frame++) {
          importObjects.ref_progress_box.innerText =
            ((frame / (60 * 1.5)) * 100.0).toFixed(2) + "%";

          await new Promise((r) => setTimeout(r, 0));
          ///////// LOOP
          /**!SECTION
         *    //
      bg_red_jpg: await new TextureLoader().loadAsync(`/img/bg_red.jpg`),
      frame_png: await new TextureLoader().loadAsync(`/img/frame.png`),
      ref_canvas: new CanvasTexture(refCanvas),
         */

          if (frame <= 60 * 0.5) {
            this.uniforms0.overallEffectLevel.value = 0;
            this.uniforms1.overallEffectLevel.value = 1;
            this.uniforms2.overallEffectLevel.value = 0;
          } else if (frame > 60 && frame < 70) {
            this.uniforms0.overallEffectLevel.value = 0;
            this.uniforms1.overallEffectLevel.value = 0;
            this.uniforms2.overallEffectLevel.value = 0;
          } else {
            this.uniforms0.overallEffectLevel.value = 0;
            this.uniforms1.overallEffectLevel.value = 0;
            this.uniforms2.overallEffectLevel.value = 0;
          }

          this.uniforms0.time.value += 1 / 60;
          this.uniforms0.imageTexture.value = importObjects.bg_red_jpg;

          this.uniforms1.time.value += 1 / 60;
          this.uniforms1.imageTexture.value = importObjects.ref_canvas;

          this.uniforms2.time.value += 1 / 60;
          this.uniforms2.imageTexture.value = importObjects.frame_png;

          /** @type {WebGLRenderer} */
          let mgl = this.renderer;

          mgl.outputEncoding = sRGBEncoding;

          mgl.setRenderTarget(this.rttFBO);
          mgl.render(this.fScene, this.rttCamera);
          // this.fsQuad.render(mgl);
          mgl.setRenderTarget(null);

          let typedArray = new Uint8Array(
            encoder.width * encoder.height * 4
          ).fill(0);

          mgl.readRenderTargetPixels(
            this.rttFBO,
            0,
            0,
            encoder.width,
            encoder.height,
            typedArray,
            0
          );

          //
          encoder.addFrameRgba(typedArray);

          mgl.render(this.realScene, this.realCamera);

          //
        }

        //
        encoder.finalize();

        const uint8Array = encoder.FS.readFile(encoder.outputFilename);
        console.log(uint8Array);

        let url = URL.createObjectURL(new Blob([uint8Array]));

        importObjects.ref_video.src = url;
        // importObjects.ref_video.style.position = "fixed";
        importObjects.ref_video.style.top = "0px";
        importObjects.ref_video.style.right = "0px";
        importObjects.ref_video.style.transfrom = "scale(0.5)";
        //

        encoder.delete();

        importObjects.ref_progress_box.innerText = "";
        importObjects.ref_download_btn.href = url;
        importObjects.ref_download_btn.download = "lancome.mp4";
        importObjects.ref_download_btn.querySelector("button").disabled = false;
      });
      /*
      // Must be a multiple of 2.
  encoder.width = 100;
  encoder.height = 100;
  encoder.initialize();
  // Add a single gray frame, the alpha is ignored.
  encoder.addFrameRgba(new Uint8Array(encoder.width * encoder.height * 4).fill(128))
  // For canvas:
  // encoder.addFrameRgba(ctx.getImageData(0, 0, encoder.width * encoder.height).data);
  encoder.finalize();
  const uint8Array = encoder.FS.readFile(encoder.outputFilename);
  console.log(uint8Array);
  encoder.delete();
      */
    });
  }
  clean() {
    this.cleans.forEach((tt) => {
      tt();
    });
  }
  work() {
    this.tasks.forEach((tt) => {
      tt();
    });
  }
}

// Helper for passes that need to fill the viewport with a single quad.

const _camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

// https://github.com/mrdoob/three.js/pull/21358

const _geometry = new BufferGeometry();
_geometry.setAttribute(
  "position",
  new Float32BufferAttribute([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)
);
_geometry.setAttribute("uv", new Float32BufferAttribute([0, 2, 0, 0, 2, 0], 2));

class FullScreenQuad {
  constructor(material) {
    this._mesh = new Mesh(_geometry, material);
  }

  dispose() {
    this._mesh.geometry.dispose();
  }

  render(renderer) {
    renderer.render(this._mesh, _camera);
  }

  get material() {
    return this._mesh.material;
  }

  set material(value) {
    this._mesh.material = value;
  }
}

export { VideoAPI };

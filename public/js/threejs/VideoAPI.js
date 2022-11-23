import { Color, Mesh } from "three";
import {
  WebGLRenderTarget,
  NearestFilter,
  RepeatWrapping,
  RGBAFormat,
  sRGBEncoding,
  WebGLRenderer,
  OrthographicCamera,
  FramebufferTexture,
  Vector2,
  Scene,
  MeshBasicMaterial,
  UnsignedByteType,
  ShaderMaterial,
  PlaneGeometry,
  DoubleSide,
} from "./build/three.module.js";
import { FullScreenQuad } from "./examples/jsm/postprocessing/EffectComposer.js";

class VideoAPI {
  constructor({ importObjects }) {
    this.cleans = [];

    //
    this.tasks = [];

    this.renderer = new WebGLRenderer({
      preserveDrawingBuffer: true,
      alpha: true,
      antialias: true,
    });

    //
    this.onLoop = (v) => {
      this.tasks.push(v);
    };

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
      encoding: sRGBEncoding,
    });

    this.uniforms0 = {
      overallLevel: { value: 0 },
      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    this.uniforms1 = {
      overallLevel: { value: 1 },
      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    this.uniforms2 = {
      overallLevel: { value: 0 },

      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    this.fScene = new Scene();

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
            gl_Position.z += 0.01;
          }
        `,
        fragmentShader: /* glsl */ `
        uniform sampler2D imageTexture;
        uniform float time;
        uniform float overallLevel;
        varying vec2 vUv;

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
          intensity = 5.1 * overallLevel;
          moveAmount = 2.0 * 0.01 * overallLevel;
          rate = 0.0001 * 0.42 * overallLevel;
          vec2 uv1NoiseR = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseG = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseB = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseA = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);

          //
          intensity = 350.1 * overallLevel;
          moveAmount = 2.5 * 0.01 * overallLevel;
          rate = 0.0001 * overallLevel;
          vec2 uv2NoiseR = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv2NoiseG = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv2NoiseB = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv2NoiseA = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);

          //
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

          gl_FragColor = sRGBToLinear(outColor);
        }

        `,
        //
      });

      return shader;
    };

    this.fsQuad0 = new FullScreenQuad(makeShader({ uniforms: this.uniforms0 }));
    this.fsQuad0._mesh.position.z += -0.001;
    this.fScene.add(this.fsQuad0._mesh);

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
            this.uniforms0.overallLevel.value = 0;
            this.uniforms1.overallLevel.value = 1;
            this.uniforms2.overallLevel.value = 0;
          } else if (frame > 60 && frame < 70) {
            this.uniforms0.overallLevel.value = 0;
            this.uniforms1.overallLevel.value = 0;
            this.uniforms2.overallLevel.value = 0;
          } else {
            this.uniforms0.overallLevel.value = 0;
            this.uniforms1.overallLevel.value = 0;
            this.uniforms2.overallLevel.value = 0;
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

          //
        }

        //
        encoder.finalize();

        const uint8Array = encoder.FS.readFile(encoder.outputFilename);
        console.log(uint8Array);

        let url = URL.createObjectURL(new Blob([uint8Array]));

        importObjects.ref_video.src = url;
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
    let st = {
      gl: this.renderer,
    };

    this.tasks.forEach((tt) => {
      let dt = clock.getDelta();
      tt(st, dt);
    });
  }
}

export { VideoAPI };

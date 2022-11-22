import {
  Box,
  Environment,
  Html,
  OrbitControls,
  Plane,
  useEnvironment,
  useTexture,
} from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import {
  Scene,
  DoubleSide,
  WebGLRenderTarget,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  sRGBEncoding,
  WebGLRenderer,
  RepeatWrapping,
  NearestFilter,
  RGBAFormat,
  FloatType,
  Color,
  ShaderMaterial,
  Clock,
  OrthographicCamera,
  LinearEncoding,
} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/EffectComposer";
// import { GLOverlay } from "../GLOverlay";

export function MyScene() {
  let redBGTexture = useTexture(`/img/bg_red.jpg`);
  let flowerTexture = useTexture(`/test_png_for_loklok/base_flower001.png`);
  let linesTexture = useTexture(`/test_png_for_loklok/gen_line001.png`);
  // redBGTexture.encoding = sRGBEncoding;
  // flowerTexture.encoding = sRGBEncoding;
  // linesTexture.encoding = sRGBEncoding;

  let texs = {
    redBGTexture,
    flowerTexture,
    linesTexture,
  };
  let vAPI = useMemo(() => {
    return new VideoAPI({ texs });
  }, [texs]);

  //
  useFrame((st, dt) => {
    vAPI.work(st, dt);
  });
  //

  //
  return (
    <group>
      <Html position={[2, 0, 0]} transform>
        <button
          onClick={() => {
            //
            vAPI.record();
          }}
        >
          Click
        </button>
      </Html>
      <Environment preset="apartment" background></Environment>
      {vAPI && (
        <>
          <OrbitControls></OrbitControls>
          {vAPI.compo}
        </>
      )}
    </group>
  );
}

class VideoAPI {
  constructor({ texs }) {
    //
    this.tasks = [];
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
      type: FloatType,
      anisotropy: 1,
      depthBuffer: true,
      stencilBuffer: true,
      generateMipmaps: false,
      encoding: sRGBEncoding,
    });

    this.masterIntensity = { value: 1 };

    this.uniforms0 = {
      masterIntensity: this.masterIntensity,
      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    this.uniforms1 = {
      masterIntensity: this.masterIntensity,
      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    this.uniforms2 = {
      masterIntensity: this.masterIntensity,

      time: {
        value: 0,
      },
      imageTexture: {
        value: null,
      },
    };

    let iClock = new Clock();

    let clock = {
      get delta() {
        return iClock.getElapsedTime();
      },
    };

    this.onLoop(() => {
      this.uniforms1.time.value = clock.delta;
      this.uniforms1.imageTexture.value = texs.flowerTexture;

      this.uniforms2.time.value = clock.delta;
      this.uniforms2.imageTexture.value = texs.linesTexture;
    });

    this.fScene = new Scene();

    let makeShader = ({ uniforms }) => {
      let shader = new ShaderMaterial({
        //
        transparent: true,
        uniforms: uniforms,
        vertexShader: `
          varying vec2 vUv;
          void main () {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
            gl_Position.z += 0.01;
          }
        `,
        fragmentShader: /* glsl */ `
        uniform sampler2D imageTexture;
        uniform float time;
        uniform float masterIntensity;
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
          float rate = 0.0;

          //
          intensity = 8.1 * masterIntensity;
          moveAmount = 2.0 * 0.01 * masterIntensity;
          rate = 0.0001 * 0.42 * masterIntensity;
          vec2 uv1NoiseR = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseG = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseB = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);
          vec2 uv1NoiseA = moveAmount * vec2(offset(intensity, vUv, rate), 0.0);

          //
          intensity = 250.1 * masterIntensity;;
          moveAmount = 2.5 * 0.01 * masterIntensity;;
          rate = 0.0001 * masterIntensity;;
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
    this.fsQuad0._mesh.position.z += -0.0001;
    this.fScene.add(this.fsQuad0._mesh);

    this.fsQuad1 = new FullScreenQuad(makeShader({ uniforms: this.uniforms1 }));
    this.fsQuad1._mesh.position.z += 0.0;
    this.fScene.add(this.fsQuad1._mesh);

    this.fsQuad2 = new FullScreenQuad(makeShader({ uniforms: this.uniforms2 }));
    this.fsQuad2._mesh.position.z += 0.0001;
    this.fScene.add(this.fsQuad2._mesh);

    this.rttCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    this.onLoop(({ gl }) => {
      gl.outputEncoding = sRGBEncoding;
      /** @type {WebGLRenderer} */
      let mgl = gl;

      mgl.setRenderTarget(this.rttFBO);
      gl.render(this.fScene, this.rttCamera);
      // this.fsQuad.render(mgl);
      mgl.setRenderTarget(null);
    });

    //https://github.com/TrevorSundberg/h264-mp4-encoder
    this.record = async () => {
      remoteImport(`/h264-mp4-encoder.web.js`).then(({ HME }) => {
        console.log(HME.createH264MP4Encoder().then);
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
      //
      // const HME = await import("h264-mp4-encoder").then((e) => e.default);
    };

    this.rttFBO.texture.encoding = LinearEncoding;

    this.rttDisplayPlane = new Mesh(
      new PlaneGeometry((650 / 100) * 0.5, (780 / 100) * 0.5),
      new MeshBasicMaterial({
        color: new Color(0xffffff),
        map: this.rttFBO.texture,
        transparent: true,
        side: DoubleSide,
      })
    );

    this.compo = <primitive object={this.rttDisplayPlane} />;
  }
  work(st, dt) {
    this.tasks.forEach((tt) => {
      tt(st, dt);
    });
  }
}

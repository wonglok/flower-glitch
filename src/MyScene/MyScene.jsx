import {
  Box,
  Environment,
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
  PerspectiveCamera,
  sRGBEncoding,
  WebGLRenderer,
  RepeatWrapping,
  NearestFilter,
  RGBAFormat,
  FloatType,
  Color,
  TextureLoader,
  ShaderMaterial,
  Clock,
} from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/EffectComposer";
import { GLOverlay } from "../GLOverlay";

export function MyScene() {
  let redBGTexture = useTexture(`/img/bg_red.jpg`);
  let flowerTexture = useTexture(`/test_png_for_loklok/base_flower001.png`);
  let linesTexture = useTexture(`/test_png_for_loklok/gen_line001.png`);
  redBGTexture.encoding = sRGBEncoding;
  flowerTexture.encoding = sRGBEncoding;
  linesTexture.encoding = sRGBEncoding;

  let texs = {
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

    this.uniforms = {
      //
      time: {
        value: 0,
      },
      lines: {
        //
        value: null,
      },
      flower: {
        value: null,
        //
      },
      //
    };
    let iClock = new Clock();
    let clock = {
      get delta() {
        return iClock.getDelta();
      },
    };

    this.onLoop(() => {
      this.uniforms.time.value = clock.delta;
      this.uniforms.lines.value = texs.linesTexture;
      this.uniforms.flower.value = texs.flowerTexture;
    });

    this.fsQuad = new FullScreenQuad(
      new ShaderMaterial({
        //
        uniforms: this.uniforms,
        vertexShader: `
          varying vec2 vUv;
          void main () {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
        uniform sampler2D lines;
        uniform sampler2D flower;
        uniform float time;
        varying vec2 vUv;

        #define RATE 0.0005

        float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;
        }

        float offset(float blocks, vec2 uv) {
          float shaderTime = time * RATE;
          return rand(vec2(shaderTime, round(uv.y * blocks)));
        }

        void main () {
          float intensity = 20.1;
          float moveAmount = 1.1;

          vec2 uvNoiseR = moveAmount * vec2(offset(intensity, vUv) * 0.03, 0.01);
          vec2 uvNoiseG = moveAmount * vec2(offset(intensity, vUv) * 0.03 * 0.1, 0.0);
          vec2 uvNoiseB = moveAmount * vec2(offset(intensity, vUv) * 0.03, -0.01);

          vec4 linesColor = texture2D(lines, vUv);
          linesColor.r = texture2D(lines, vUv + uvNoiseR).r;
          linesColor.g = texture2D(lines, vUv + uvNoiseG).g;
          linesColor.b = texture2D(lines, vUv + uvNoiseB).b;

          vec4 flowerColor = texture2D(flower, vUv);
          flowerColor.r = texture2D(flower, vUv + uvNoiseR).r;
          flowerColor.g = texture2D(flower, vUv + uvNoiseG).g;
          flowerColor.b = texture2D(flower, vUv + uvNoiseB).b;

          vec4 outColor = vec4(flowerColor.xyz * flowerColor.a, linesColor.a + flowerColor.a);
          outColor.rgb += linesColor.rgb * linesColor.a;

          gl_FragColor = outColor;
        }

        `,
        //
      })
    );

    this.onLoop(({ gl }) => {
      gl.outputEncoding = sRGBEncoding;
      /** @type {WebGLRenderer} */
      let mgl = gl;

      mgl.setRenderTarget(this.rttFBO);
      this.fsQuad.render(mgl);
      mgl.setRenderTarget(null);
      //
    });

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

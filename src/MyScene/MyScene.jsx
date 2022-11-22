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
} from "three";
import { GLOverlay } from "../GLOverlay";

export function MyScene() {
  let vAPI = useMemo(() => {
    return new VideoAPI({});
  }, []);
  //
  useFrame((st, dt) => {
    vAPI.work(st, dt);
  });
  //

  let redBGTexture = useTexture(`/img/bg_red.jpg`);
  let flowerTexture = useTexture(`/test_png_for_loklok/base_flower001.png`);
  let linesTexture = useTexture(`/test_png_for_loklok/gen_line001.png`);
  redBGTexture.encoding = sRGBEncoding;
  flowerTexture.encoding = sRGBEncoding;
  linesTexture.encoding = sRGBEncoding;
  //
  return (
    <group>
      <Environment preset="apartment" background></Environment>
      {vAPI && (
        <>
          {createPortal(
            <group>
              {/* <Plane
                scale={[650 / 100, 780 / 100, 1]}
                position={[0, 0, -0.0001 * 2]}
              >
                <meshBasicMaterial
                  transparent={true}
                  map={redBGTexture}
                ></meshBasicMaterial>
              </Plane> */}

              <Plane
                scale={[650 / 100, 780 / 100, 1]}
                position={[0, 0, -0.0001]}
              >
                <meshBasicMaterial
                  transparent={true}
                  map={flowerTexture}
                  onBeforeCompile={(shader) => {
                    shader.fragmentShader;
                  }}
                ></meshBasicMaterial>
              </Plane>
              <Plane scale={[650 / 100, 780 / 100, 1]} position={[0, 0, 0]}>
                <meshBasicMaterial
                  transparent={true}
                  map={linesTexture}
                ></meshBasicMaterial>
              </Plane>
            </group>,
            vAPI.rttScene
          )}

          <OrbitControls></OrbitControls>

          <group scale={[650 / 200, 780 / 200, 1]}>
            <primitive object={vAPI.rttDisplayPlane.clone()}></primitive>
          </group>
          <group scale={[650 / 200, 780 / 200, 1]} position={[1, 1, 1]}>
            <primitive object={vAPI.rttDisplayPlane.clone()}></primitive>
          </group>
        </>
      )}
    </group>
  );
}

class VideoAPI {
  constructor({}) {
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

    this.rttScene = new Scene();
    this.rttScene.background = new TextureLoader().loadAsync(
      `data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7`
    );

    this.rttCamera = new PerspectiveCamera(75, 650 / 780, 0.1, 500);
    this.rttCamera.position.z = 7;

    this.onLoop(({ gl }) => {
      gl.outputEncoding = sRGBEncoding;
      /** @type {WebGLRenderer} */
      let mgl = gl;

      gl.setRenderTarget(this.rttFBO);
      mgl.autoClear = false;
      mgl.setClearAlpha(0);
      mgl.setClearColor(0x000000);
      mgl.clear(true, true, true);
      gl.render(this.rttScene, this.rttCamera);
      gl.setRenderTarget(null);
    });

    this.rttDisplayPlane = new Mesh(
      new PlaneGeometry(1, 1),
      new MeshBasicMaterial({
        color: new Color(0xffffff),
        map: this.rttFBO.texture,
        transparent: true,
        side: DoubleSide,
      })
    );
  }
  work(st, dt) {
    this.tasks.forEach((tt) => {
      tt(st, dt);
    });
  }
}

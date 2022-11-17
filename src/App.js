import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Box,
  Environment,
  OrbitControls,
  Plane,
  useFBO,
  useTexture,
} from "@react-three/drei";
import "./styles.css";
import { Bloom, EffectComposer, SSR } from "@react-three/postprocessing";
import { GLOverlay } from "./GLOverlay";

const OurScene = () => {
  let fbo = useFBO(512, 512);

  const grp = useRef();

  let viewport = useThree((s) => s.viewport);
  let texture = useTexture(`/image/flower-raw.png`);
  return (
    <group ref={grp}>
      {/*  */}

      <Plane
        args={[texture.image.width / 200, texture.image.height / 200]}
        rotation={[Math.PI * 0.0, 0, 0]}
      >
        <meshBasicMaterial map={texture}></meshBasicMaterial>
      </Plane>

      {/*  */}

      {/* <OrbitControls /> */}
      {/* <Environment preset="night" /> */}

      {/*  */}
      <EffectComposer>
        {/* <Bloom luminanceThreshold={0.9} mipmapBlur /> */}
        {/* <SSR /> */}
        <GLOverlay fbo={fbo} />
      </EffectComposer>
    </group>
  );
};

export default function App() {
  return (
    <Canvas>
      {/* <Environment preset="apartment" background /> */}
      <color attach="background" args={["#C0203A"]} />
      <OurScene />
    </Canvas>
  );
}

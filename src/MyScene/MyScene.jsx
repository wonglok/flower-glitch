import { Box, Environment, Plane, Sphere } from "@react-three/drei";
import { createPortal, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import { Scene } from "three";
import { GLOverlay } from "../GLOverlay";

export function MyScene() {
  let ref = useRef();
  let glitchScene = useMemo(() => {
    return new Scene();
  }, []);

  let [fTex, setTex] = useState(null);

  useEffect(() => {
    console.log(ref.current);
    ref.current.autoRenderToScreen = false;
    console.log(ref?.current);
    setTex(ref?.current?.outputBuffer?.texture);
  }, []);

  let viewport = useThree((s) => s.viewport);
  return (
    <>
      {createPortal(
        <group>
          <Environment preset="studio"></Environment>
          <Box></Box>
        </group>,
        glitchScene
      )}

      <Plane args={[viewport.width, viewport.height, 1, 1]}>
        <meshBasicMaterial map={fTex}></meshBasicMaterial>
      </Plane>

      {/* <Sphere></Sphere> */}
      <EffectComposer renderPriority={10} ref={ref} scene={glitchScene}>
        <GLOverlay></GLOverlay>
      </EffectComposer>
      {/* MyScene */}
    </>
  );
}

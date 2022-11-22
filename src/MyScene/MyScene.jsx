import { Box } from "@react-three/drei";
import { createPortal } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import { Scene } from "three";

export function MyScene() {
  let ref = useRef();
  let glitchScene = useMemo(() => {
    return new Scene();
  }, []);

  useEffect(() => {
    console.log(ref.current);
  }, []);
  return (
    <>
      {createPortal(
        <group>
          <Box></Box>
        </group>,
        glitchScene
      )}

      <EffectComposer ref={ref} scene={glitchScene}></EffectComposer>
      {/* MyScene */}
    </>
  );
}

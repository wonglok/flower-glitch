import React, { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Box,
  Environment,
  Html,
  OrbitControls,
  Plane,
  Text,
  useFBO,
  useTexture,
} from "@react-three/drei";
import "./styles.css";
import { Bloom, EffectComposer, SSR } from "@react-three/postprocessing";
import { GLOverlay } from "./GLOverlay";
import { FlowerHTML } from "./FlowerHTML";
import html2canvas from "html2canvas";
import { CanvasTexture, DoubleSide, PlaneGeometry, sRGBEncoding } from "three";
import { useControls } from "leva";

const OurScene = () => {
  let fbo = useFBO(512, 512);

  const grp = useRef();

  // let texture = useTexture(`/image/flower-raw.png`);
  let plane = useRef();

  let onClick = () => {
    console.log("123");

    var tlItems = document
      .getElementById("tl-glc")
      .querySelectorAll(".line-item");
    var blItems = document
      .getElementById("bl-glc")
      .querySelectorAll(".line-item");
    var trItems = document
      .getElementById("tr-glc")
      .querySelectorAll(".line-item");
    var brItems = document
      .getElementById("br-glc")
      .querySelectorAll(".line-item");

    function lineShifter(elmArr, isRight) {
      elmArr.forEach((item, index) => {
        // Random if that line should show
        let isShow = Math.random() < 0.3;
        // let oldX = isRight ? item.style.right : item.style.left;
        let xOffset = Math.floor(Math.random() * 150);

        // console.log(index, isShow, xOffset, item.clientWidth, oldX);
        if (isShow) {
          item.style.opacity = 0.8;
          item.style.width =
            item.clientWidth * (Math.random() * 0.7 + 0.3) + "px";

          isRight
            ? (item.style.right = -100 + xOffset + "px")
            : (item.style.left = -100 + xOffset + "px");
        } else {
          item.style.opacity = 0;
        }
      });
    }

    function randomize() {
      // let tlItems = document.getElementById("tl-glc");
      lineShifter(trItems, true);
      lineShifter(tlItems, false);
      lineShifter(brItems, true);
      lineShifter(blItems, false);
    }

    randomize();

    setTimeout(() => {
      html2canvas(document.querySelector("#rootflower")).then(function (
        canvas
      ) {
        let ct = new CanvasTexture(canvas);
        ct.encoding = sRGBEncoding;
        plane.current.material.map = ct;

        console.log(ct);
      });
    }, 10);
  };

  let { doRandomize } = useControls("Randomize", {
    doRandomize: true,
  });

  useEffect(() => {
    //
    onClick();
  }, [doRandomize]);

  return (
    <group ref={grp}>
      {/*  */}

      <Plane
        args={[5 / 2.5, 7 / 2.5, 1, 1]}
        ref={plane}
        rotation={[Math.PI * 0.0, 0, 0]}
      >
        <meshBasicMaterial side={DoubleSide} transparent></meshBasicMaterial>
      </Plane>

      {/* <OrbitControls /> */}
      {/* <Environment preset="night" /> */}
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
    <div className="full">
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        {/* <Environment preset="apartment" background /> */}
        <color attach="background" args={["#C11F3E"]} />
        <OurScene />
        <OrbitControls></OrbitControls>
      </Canvas>
      <div>
        <FlowerHTML></FlowerHTML>
      </div>
    </div>
  );
}

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
import {
  alwaysOn,
  amount,
  amount2,
  delayFreq1,
  delayFreq2,
  GLOverlay,
} from "./GLOverlay";
// import { FlowerHTML } from "./FlowerHTML";
import html2canvas from "html2canvas";
import { CanvasTexture, DoubleSide, PlaneGeometry, sRGBEncoding } from "three";
import { useControls } from "leva";
import useSWR from "swr";
import gsap from "gsap";

// https://github.com/TrevorSundberg/h264-mp4-encoder

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
    doRandomize: false,
  });

  useEffect(() => {
    //
    try {
      onClick();
    } catch (e) {
      console.log(e);
    }
  }, [doRandomize]);

  let pulseCtrl = useControls("Pulse", {
    alwaysOn: false,

    pulse: false,
    onDuration: 0.5,
    //
    onFrequency: 1,
    onAmount: 0.5,
    fadeDuration: 0.25,
  });

  useEffect(() => {
    //
    alwaysOn.value = pulseCtrl.alwaysOn;

    gsap.killTweensOf();
    if (alwaysOn.value) {
      return;
    }
    try {
      delayFreq1.value = 0;
      delayFreq2.value = 0;
      amount.value = 0;
      amount2.value = 0;

      gsap.to([delayFreq1], {
        value: pulseCtrl.onFrequency,
        delay: 0,
        duration: pulseCtrl.fadeDuration * 0.0,
      });
      gsap.to([delayFreq2], {
        value: pulseCtrl.onFrequency,
        delay: 0,
        duration: pulseCtrl.fadeDuration * 0.0,
      });
      gsap.to([amount], {
        value: pulseCtrl.onAmount,
        delay: 0,
        duration: pulseCtrl.fadeDuration * 0.0,
      });
      gsap.to([amount2], {
        value: pulseCtrl.onAmount,
        delay: 0,
        duration: pulseCtrl.fadeDuration * 0.0,
      });

      gsap.to([delayFreq1], {
        value: pulseCtrl.onFrequency,
        delay: 0.0 + pulseCtrl.fadeDuration * 0.0,
        duration: pulseCtrl.onDuration,
      });
      gsap.to([delayFreq2], {
        value: pulseCtrl.onFrequency,
        delay: 0.0 + pulseCtrl.fadeDuration * 0.0,
        duration: pulseCtrl.onDuration,
      });
      gsap.to([amount], {
        value: pulseCtrl.onAmount,
        delay: 0.0 + pulseCtrl.fadeDuration * 0.0,
        duration: pulseCtrl.onDuration,
      });
      gsap.to([amount2], {
        value: pulseCtrl.onAmount,
        delay: 0.0 + pulseCtrl.fadeDuration * 0.0,
        duration: pulseCtrl.onDuration,
      });

      gsap.to([delayFreq1], {
        value: 0,
        delay:
          0.0 +
          pulseCtrl.fadeDuration * 0.0 +
          pulseCtrl.onDuration +
          pulseCtrl.fadeDuration,
        duration: pulseCtrl.fadeDuration,
      });
      gsap.to([delayFreq2], {
        value: 0,
        delay:
          0.0 +
          pulseCtrl.fadeDuration * 0.0 +
          pulseCtrl.onDuration +
          pulseCtrl.fadeDuration,
        duration: pulseCtrl.fadeDuration,
      });
      gsap.to([amount], {
        value: 0,
        delay:
          0.0 +
          pulseCtrl.fadeDuration * 0.0 +
          pulseCtrl.onDuration +
          pulseCtrl.fadeDuration,
        duration: pulseCtrl.fadeDuration,
      });
      gsap.to([amount2], {
        value: 0,
        delay:
          0.0 +
          pulseCtrl.fadeDuration * 0.0 +
          pulseCtrl.onDuration +
          pulseCtrl.fadeDuration,
        duration: pulseCtrl.fadeDuration,
      });
    } catch (e) {
      console.log(e);
    }

    return () => {};
  }, [pulseCtrl]);

  useEffect(() => {
    window.addEventListener("run", onClick);

    return () => {
      window.removeEventListener("run", onClick);
    };
  }, []);

  let flowerTex = useTexture(`/img/base_flower.png`);

  return (
    <group ref={grp}>
      {/*  */}

      <Plane
        args={[650 / 250, 780 / 250, 1, 1]}
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
  let { data: html } = useSWR(`/flower.html`, (url) => {
    return fetch(url).then((r) => r.text());
  });
  return (
    <div className="full">
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        {/* <Environment preset="apartment" background /> */}
        <color attach="background" args={["#fff"]} />
        <OurScene />
        {/* <OrbitControls></OrbitControls> */}
      </Canvas>
      <textarea
        className="tata"
        defaultValue={html}
        onInput={(ev) => {
          document.querySelector("#htmldrain").innerHTML = ev.target.value;
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("run"));
          });
        }}
      ></textarea>
      <div id="htmldrain" dangerouslySetInnerHTML={{ __html: html }}></div>
      {/* <div className="full">
        <FlowerHTML></FlowerHTML>
      </div> */}
    </div>
  );
}

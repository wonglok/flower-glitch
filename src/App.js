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

      <Plane args={[650 / 250, 455 / 250, 1, 1]} position={[0, 0, 0.01]}>
        <meshBasicMaterial
          side={DoubleSide}
          transparent
          map={flowerTex}
          onBeforeCompile={(shader) => {
            // console.log(shader.fragmentShader);

            shader.fragmentShader = `
uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
  varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
  #include <clipping_planes_fragment>
  vec4 diffuseColor = vec4( diffuse, opacity );
  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <specularmap_fragment>
  ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  #ifdef USE_LIGHTMAP
    vec4 lightMapTexel = texture2D( lightMap, vUv2 );
    reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
  #else
    reflectedLight.indirectDiffuse += vec3( 1.0 );
  #endif
  #include <aomap_fragment>
  reflectedLight.indirectDiffuse *= diffuseColor.rgb;
  vec3 outgoingLight = reflectedLight.indirectDiffuse;

  #include <envmap_fragment>
  #include <output_fragment>
  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
  #include <dithering_fragment>
}
            `;
          }}
        ></meshBasicMaterial>
      </Plane>

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

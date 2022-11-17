import React, { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";
import { Uniform } from "three";
import { BlendFunction } from "postprocessing";
import { useControls } from "leva";
import { useTexture } from "@react-three/drei";
const progress = new Uniform(0);
const timer = new Uniform(0);
const intensity = new Uniform(23);
const water = new Uniform(0);
const amount = new Uniform(1);
const speed = new Uniform(1 / 500);
const image = new Uniform(null);

setInterval(() => {
  progress.value += 1 / 500;
  if (progress.value >= 1) {
    progress.value = 0;
  }
  timer.value = (window.performance.now() / 1000) * speed.value;
});
//

const fragmentShader = /* glsl */ `

uniform sampler2D screen;
uniform float progress;
uniform float time;
uniform float intensity;
uniform float water;
uniform float amount;
uniform sampler2D image;
#define RATE 0.0015

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;
}

float offset(float blocks, vec2 uv) {
  float shaderTime = time * RATE;
  return rand(vec2(shaderTime, round(uv.y * blocks)));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 screenSize = resolution.xy;

  vec4 dudv = texture2D(image, uv);

  vec2 uv2 = dudv.xz * water / 10.0;
  outputColor = texture(inputBuffer, uv);

  outputColor.r = texture(inputBuffer, uv2 + uv + amount * vec2(offset(intensity, uv) * 0.03, 0.001)).r;
  outputColor.g = texture(inputBuffer, uv2 + uv + amount * vec2(offset(intensity, uv) * 0.02 * 0.167, 0.0)).g;
  outputColor.b = texture(inputBuffer, uv2 + uv + amount * vec2(offset(intensity, uv) * 0.03, -0.001)).b;


  // vec2 ypp = 0.1 * vec2( sin( vUv.y  * intensity ), cos( vUv.y  * intensity ) );
  // float dX = vUv.x + ypp.x * 1.0;
  // float dY = vUv.y + ypp.y * 1.0;

  // bool grayscale = false;
  // // noise effect intensity value (0 = no effect, 1 = full effect)
  // float nIntensity = abs(progress * 10.0);
  // // scanlines effect intensity value (0 = no effect, 1 = full effect)
  // float sIntensity = abs(progress * 10.0);
  // // scanlines effect count value (0 = no effect, 4096 = full effect)
  // float sCount = 1000.0;

  // // sample the source
  // vec4 cTextureScreen = texture2D( inputBuffer, vec2(dX, dY));
  // // make some noise
  // float dx = rand( vUv + time );
  // // add noise
  // vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );
  // // get us a sine and cosine
  // vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );
  // // add scanlines
  // cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;
  // // interpolate between source and result by intensity
  // cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );
  // // convert to grayscale if desired
  // if( grayscale ) {
  //   cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );
  // }
  // outputColor = vec4(cResult.rgb, cTextureScreen.a);
}

`;

export class CustomEffect extends Effect {
  constructor({ fbo }) {
    super("CustomEffect", fragmentShader, {
      blendFunction: BlendFunction.Normal,
      uniforms: new Map([
        //
        ["screen", new Uniform(fbo.texture)],
        ["time", timer],
        ["intensity", intensity],
        ["progress", progress],
        ["image", image],
        ["water", water],
        ["amount", amount],
        ["speed", speed],
      ]),
    });
  }
}

// Effect component
export const GLOverlay = forwardRef(function EffectFunc({ fbo }, ref) {
  const effect = useMemo(() => new CustomEffect({ fbo }), [fbo]);

  return (
    <>
      <primitive ref={ref} object={effect} />
      <GUISetup />
    </>
  );
});

function GUISetup() {
  let ctrl = useControls({
    intensity: intensity.value,
    water: water.value,
    amount: amount.value,
    speed: speed.value,
  });

  let texture = useTexture(`/dudv/water.jpg`);

  image.value = texture;

  intensity.value = ctrl.intensity;
  water.value = ctrl.water;
  amount.value = ctrl.amount;
  speed.value = ctrl.speed;
  return null;
}

//

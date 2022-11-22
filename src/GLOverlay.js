import React, { forwardRef, useMemo } from "react";
import { Effect } from "postprocessing";
import { Uniform } from "three";
import { BlendFunction } from "postprocessing";
import { useControls } from "leva";
import { useTexture } from "@react-three/drei";
const progress = new Uniform(0);
const timer = new Uniform(0);
const timer2 = new Uniform(0);
const water = new Uniform(0);
const dudvImage = new Uniform(null);

const speed = new Uniform(1 / 10);
const speed2 = new Uniform(1 / 10);

export const amount = new Uniform(0.5);
const intensity = new Uniform(23);

export const amount2 = new Uniform(0.5);
const intensity2 = new Uniform(1000);

export const delayFreq1 = new Uniform(1);
export const delayFreq2 = new Uniform(1);

export const alwaysOn = new Uniform(false);

setInterval(() => {
  progress.value += 1 / 500;
  if (progress.value >= 1) {
    progress.value = 0;
  }
  timer.value = (window.performance.now() / 1000) * speed.value;
  timer2.value = (window.performance.now() / 1000) * speed2.value;
});
//

const fragmentShader = /* glsl */ `

uniform float progress;
uniform float time;
uniform float time2;
uniform float intensity;
uniform float amount;
uniform float intensity2;
uniform float amount2;
uniform float water;
uniform sampler2D dudvImage;
uniform float delayFreq1;
uniform float delayFreq2;
uniform bool alwaysOn;
#define RATE 0.0015

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453) * 2.0 - 1.0;
}

float offset(float blocks, vec2 uv) {
  float shaderTime = time * RATE * (delayFreq1);
  if (alwaysOn) {
    shaderTime = time * RATE;
  }
  return rand(vec2(shaderTime, round(uv.y * blocks)));
}


float offset2(float blocks, vec2 uv) {
  float shaderTime = time2 * RATE * (delayFreq2);
  if (alwaysOn) {
    shaderTime = time2 * RATE;
  }
  return rand(vec2(shaderTime, round(uv.y * blocks)));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 screenSize = resolution.xy;

  vec4 dudv = texture2D(dudvImage, uv);

  vec2 uv2 = dudv.xz * water / 10.0;

  outputColor = texture(inputBuffer, uv);

  vec2 uv3r = amount * vec2(offset(intensity, uv) * 0.03, 0.01);
  vec2 uv3g = amount * vec2(offset(intensity, uv) * 0.02 * 0.167, 0.0);
  vec2 uv3b = amount * vec2(offset(intensity, uv) * 0.03, -0.01);

  vec2 uv4r = amount2 * vec2(offset2(intensity2, uv) * 0.03, 0.01);
  vec2 uv4g = amount2 * vec2(offset2(intensity2, uv) * 0.02 * 0.167, 0.0);
  vec2 uv4b = amount2 * vec2(offset2(intensity2, uv) * 0.03, -0.01);

  outputColor.r = mix(texture(inputBuffer, uv2 + uv + uv3r).r, texture(inputBuffer, uv2 + uv + uv4r).r, 0.5);
  outputColor.g = mix(texture(inputBuffer, uv2 + uv + uv3g).g, texture(inputBuffer, uv2 + uv + uv4g).g, 0.5);
  outputColor.b = mix(texture(inputBuffer, uv2 + uv + uv3b).b, texture(inputBuffer, uv2 + uv + uv4b).b, 0.5);
  //

  //
  //
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
        // ["screen", new Uniform(fbo?.texture)],
        ["time", timer],
        ["time2", timer2],
        ["intensity", intensity],
        ["progress", progress],
        ["dudvImage", dudvImage],
        ["water", water],
        ["amount", amount],
        ["speed", speed],
        ["speed2", speed2],
        ["amount2", amount2],
        ["intensity2", intensity2],
        ["delayFreq1", delayFreq1],
        ["delayFreq2", delayFreq2],
        ["alwaysOn", alwaysOn],
      ]),
    });
  }
}

// Effect component
export const GLOverlay = forwardRef(function EffectFunc({}, ref) {
  const effect = useMemo(() => new CustomEffect({}), []);

  return (
    <>
      <primitive ref={ref} object={effect} />
      <GUISetup />
    </>
  );
});

function GUISetup() {
  let ctrl = useControls("PostProcessing", {
    water: water.value,
    speed: speed.value,

    //
    intensity: intensity.value,
    amount: amount.value,

    speed2: speed2.value,
    intensity2: intensity2.value,
    amount2: amount2.value,
  });

  let texture = useTexture(`/dudv/water.jpg`);

  dudvImage.value = texture;

  //
  water.value = ctrl.water;

  intensity.value = ctrl.intensity;
  amount.value = ctrl.amount;
  speed.value = ctrl.speed;

  //
  intensity2.value = ctrl.intensity2;
  amount2.value = ctrl.amount2;
  speed2.value = ctrl.speed2;

  return null;
}

//
// {"":251}

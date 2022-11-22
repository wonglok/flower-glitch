import { Canvas } from "@react-three/fiber";
import { MyScene } from "./MyScene/MyScene";
import "./styles.css";

export default function App() {
  return (
    <div className="full">
      <Canvas className="full" gl={{ preserveDrawingBuffer: true }}>
        <MyScene></MyScene>
        {/* <Environment preset="apartment" background /> */}
        <color attach="background" args={["#fff"]} />
        {/* <OrbitControls></OrbitControls> */}
      </Canvas>
    </div>
  );
}

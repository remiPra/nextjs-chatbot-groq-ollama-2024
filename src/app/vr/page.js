'use client'
import { Canvas } from "@react-three/fiber";
import { Experience } from "../component/Experience";
import { ARButton, XR, Controllers, Hands, VRButton } from '@react-three/xr'
import { OrbitControls } from "@react-three/drei";

function Page() {
  return (
    <div style={{ height: '100vh' }}>

      <Canvas shadows camera={{ position: [0, 0, 100], fov: 42 }}>
        <XR>
          <color attach="background" args={["#ececec"]} />
          <Experience />
          {/* <VRButton/> */}

        </XR>
      </Canvas>
    </div>
  );
}

export default Page;
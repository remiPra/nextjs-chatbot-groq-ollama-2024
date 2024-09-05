'use client'
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from '../component/Experience';

function Page() {
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleAnimation = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 0, 100], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience toggleAnimation={isPlaying} />
      </Canvas>
      <button
        onClick={toggleAnimation}
        style={{ position: 'absolute', top: '100px', left: '100px', zIndex: 1 }}
        className='border-r-red-500'
      >
        {isPlaying ? 'Stop Animation' : 'Play Animation'}
      </button>
    </div>
  );
}

export default Page;

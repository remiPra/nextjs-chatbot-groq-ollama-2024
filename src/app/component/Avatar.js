import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useGLTF, useAnimations } from '@react-three/drei';

function Avatar({ position, scale, visemes }) {
  const group = useRef();

  const { nodes } = useGLTF('/zen.glb');
  const fbx = useFBX('/animation/Talking.fbx');
  const { animations } = fbx;
  const { ref, mixer, actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      actions[Object.keys(actions)[0]].play();
    }

    const interval = setInterval(() => {
      // Update the morph targets based on the visemes
    }, 1000 / 30); // 30 frames per second

    return () => clearInterval(interval);
  }, [actions, visemes]);

  return (
    <group ref={ref} position={position} scale={scale} dispose={null}>
      <primitive object={nodes['childName']} dispose={null} />
    </group>
  );
}

useGLTF.preload('/zen.glb');
useFBX.preload('/animation/Talking.fbx');

export default Avatar;

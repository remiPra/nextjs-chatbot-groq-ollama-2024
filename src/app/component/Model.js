import React, { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useGLTF, useAnimations } from '@react-three/drei';

export default function Model({ isPlaying, ...props }) {
  const group = useRef();
  const { scene } = useGLTF('/zong.glb');
  const fbx = useFBX('/animation/Idle.fbx');
  const { animations } = fbx;
  const { ref, mixer, actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions) {
      if (isPlaying) {
        actions[Object.keys(actions)[0]].play();
      } else {
        actions[Object.keys(actions)[0]].stop();
      }
    }
  }, [actions, isPlaying]);

  useFrame((state, delta) => {
    if (mixer && isPlaying) mixer.update(delta);
  });

  return (
    <group ref={ref} {...props}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/zong.glb');
useFBX.preload('/animation/Idle.fbx');

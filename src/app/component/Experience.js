import React, { useState } from 'react';
import { Environment, OrbitControls, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import Model from './Model';

// Synthèse vocale avec Web Speech API
const speak = (text) => {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.onend = resolve;
    synth.speak(utterance);
  });
};

export function Experience({ toggleAnimation }) {
  const texture = useTexture('models/background.png');
  const viewport = useThree((state) => state.viewport);
  const [text, setText] = useState('');
  const [visemes, setVisemes] = useState([]);

  const handleSpeak = async () => {
    await speak(text);
    const visemeData = await getLipSyncData(text);
    setVisemes(visemeData);
  };

  return (
    <>
      <OrbitControls enableZoom={true} enableRotate={false} enablePan={false} />
      <Model position={[0, -80, 50]} scale={50} isPlaying={toggleAnimation} />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
}

export default Experience;

'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';

const TextToSpeech = ({ text}) => {
  const [audioData, setAudioData] = useState(null);
  const voiceId = 'imRmmzTqlLHt9Do1HufF';
 
  const synthesizeSpeech = async () => {
    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: text,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.5,
            use_speaker_boost: true,
          },
          pronunciation_dictionary_locators: [],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': process.env.NEXT_PUBLIC_VOICE_EVENLABS,
          },
          responseType: 'arraybuffer',
        }
      );

      setAudioData(response.data);
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    }
  };

  return (
    <div>
        <button className='bg-red-100 m-7' onClick={synthesizeSpeech}>
            Synthétiser la parole
        </button>

      {audioData && (
        <audio controls autoPlay className='hidden opacity-0'>
          <source src={URL.createObjectURL(new Blob([audioData], { type: 'audio/mpeg' }))} type="audio/mpeg" />
          Votre navigateur ne supporte pas l'élément audio.
        </audio>
      )}
    </div>
  );
};

export default TextToSpeech;
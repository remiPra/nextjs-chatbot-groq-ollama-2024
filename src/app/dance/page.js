'use client'

import { useState } from 'react';
import axios from 'axios';
import { Howl } from 'howler';

const TextToSpeechWithInput = () => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSpeak = async () => {
    if (inputText.trim() !== '') {
      try {
        const response = await axios.post(
          'https://api.elevenlabs.io/v1/text-to-speech/0bKGtCCpdKSI5NjGhU3z',
          {
            text: inputText,
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

        const sound = new Howl({
          src: [URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }))],
          format: ['mp3'],
          autoplay: true,
        });

        sound.play();
      } catch (error) {
        console.error('Erreur lors de la synthèse vocale:', error);
      }
    }
  };

  return (
    <div className='mt-[100px]'>
      <h1>Synthèse vocale avec saisie de texte</h1>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Entrez le texte à synthétiser"
      />
      <button onClick={handleSpeak}>Parler</button>
    </div>
  );
};

export default TextToSpeechWithInput;
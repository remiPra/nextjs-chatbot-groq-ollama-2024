'use client'
import React, { useState, useEffect } from 'react';

const SpeechRecognitionComponent = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    // Vérifiez si l'API est supportée
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (typeof SpeechRecognition !== "undefined") {
      const recognition = new SpeechRecognition();
      recognition.lang = "fr-FR"; // Définit la langue de reconnaissance en français

      recognition.continuous = true; // Pour continuer la reconnaissance après avoir détecté une pause
      recognition.interimResults = true; // Pour obtenir des résultats intermédiaires

      recognition.onresult = (event) => {
        const lastResult = event.results[event.resultIndex];
        if (lastResult.isFinal) {
          setTranscript(prev => prev + lastResult[0].transcript + ' ');
        }
      };

      if (listening) {
        recognition.start();
      } else {
        recognition.stop();
      }

      return () => recognition.stop();
    } else {
      console.log("Speech Recognition API not supported.");
    }
  }, [listening]);

  return (
    <div>
      <div onClick={() => setListening(prevState => !prevState)}>
        {listening ? 'Stop Listening' : 'Start Listening'}
      </div>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default SpeechRecognitionComponent;

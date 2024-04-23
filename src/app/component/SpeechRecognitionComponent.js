// 'use client' est optionnel ici; il est utilisé si vous travaillez avec Next.js 14 et souhaitez marquer explicitement ce composant pour le rendu côté client.
'use client';
import React, { useState, useEffect } from 'react';
import { FaMicrophone } from "react-icons/fa";


const SpeechRecognitionComponent = ({ onTranscriptUpdate , language }) => {
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof SpeechRecognition !== "undefined") {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      // recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const lastResult = event.results[event.resultIndex];
        if (lastResult.isFinal) {
          const newTranscript = lastResult[0].transcript + ' ';
          onTranscriptUpdate(newTranscript);
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
  }, [listening, onTranscriptUpdate]);

  return (
    <div onClick={() => setListening(prevState => !prevState)}>
      {listening ? <div className="flex justify-center  items-center p-2 rounded-full bg-red-900
       text-gray-100 focus:outline-none" ><FaMicrophone size="8em" /></div> : 
      <div className="flex justify-center items-center p-2 rounded-full bg-gray-200 
      text-gray-700 hover:bg-gray-300 focus:outline-none" >
        <FaMicrophone size='8em' /></div> }
    </div>
  );
};

export default SpeechRecognitionComponent;

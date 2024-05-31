'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone } from "react-icons/fa";

const SpeechRecognitionLive = ({ onTranscriptUpdate, language,onsend }) => {
  const [listening, setListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isRecordingSeries, setIsRecordingSeries] = useState(false);
  const [seriesTranscript, setSeriesTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (typeof SpeechRecognition !== "undefined") {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = language;
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
          const lastResult = event.results[event.resultIndex];
          if (lastResult.isFinal) {
            const newTranscript = lastResult[0].transcript.trim();
            console.log('New word added:', newTranscript); // Log the new word

            if (isRecordingSeries) {
              setSeriesTranscript(prevTranscript => prevTranscript + ' ' + newTranscript);
            }

            onTranscriptUpdate(newTranscript + ' ');

            // Check for specific phrases
            if (newTranscript.toLowerCase().includes('excuse-moi macron')) {
              alert('Événement déclenché: excuse-moi Macron détecté!');
              setIsRecordingSeries(true);  // Start recording the series of words
              setSeriesTranscript('');     // Reset the series transcript
            } else if (newTranscript.toLowerCase().includes('pardon macron')) {
              alert('Événement terminé: pardon Macron détecté!');
              setIsRecordingSeries(false); // Stop recording the series of words
              console.log('Série de mots transcrits:', seriesTranscript.trim()); // Log the final series transcript
              // You can also add additional logic here to handle the final series transcript
            }
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Speech Recognition Error: ", event.error);
        };
      } else {
        console.log("Speech Recognition API not supported.");
      }
    }

    // Check if permission was already granted
    navigator.permissions.query({ name: 'microphone' }).then((result) => {
      if (result.state === 'granted') {
        setPermissionGranted(true);
      }
    }).catch((error) => {
      console.error("Permission query error: ", error);
    });
  }, [language, onTranscriptUpdate, isRecordingSeries, seriesTranscript]);

  useEffect(() => {
    if (recognitionRef.current) {
      if (listening) {
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
      }

      return () => {
        recognitionRef.current.stop();
      };
    }
  }, [listening]);

  const handlePermissionRequest = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        setPermissionGranted(true);
        setListening(true);
      })
      .catch((error) => {
        console.error("Microphone permission error: ", error);
      });
  };

  const handleMicrophoneClick = () => {
    if (permissionGranted) {
      setListening((prevState) => !prevState);
    } else {
      console.log("Microphone permission not granted.");
    }
  };

  return (
    <div>
      {!permissionGranted ? (
        <button
          onClick={handlePermissionRequest}
          className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
        >
          Autoriser le microphone
        </button>
      ) : (
        <div onClick={handleMicrophoneClick}>
          {listening ? (
            <div className="flex justify-center items-center p-2 rounded-full bg-green-500 text-gray-100 focus:outline-none">
              <FaMicrophone size="8em" />
            </div>
          ) : (
            <div className="flex justify-center items-center p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none">
              <FaMicrophone size='8em' />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeechRecognitionLive;

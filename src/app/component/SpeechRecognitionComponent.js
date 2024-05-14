'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone } from "react-icons/fa";

const SpeechRecognitionComponent = ({ onTranscriptUpdate, language }) => {
  const [listening, setListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
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
            const newTranscript = lastResult[0].transcript + ' ';
            onTranscriptUpdate(newTranscript);
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
  }, [language, onTranscriptUpdate]);

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
            <div className="flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
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

export default SpeechRecognitionComponent;

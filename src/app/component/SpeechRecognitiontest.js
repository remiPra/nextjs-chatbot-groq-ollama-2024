import React, { useEffect, useRef, useState } from 'react';

const SpeechRecognitionComponent = ({ language, onTranscriptUpdate, isListening, onSpeechStart }) => {
  const recognitionRef = useRef(null);
  const [interimTranscript, setInterimTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interimTranscript);
        if (finalTranscript !== '') {
          onTranscriptUpdate(finalTranscript);
        }
      };

      recognitionRef.current.onspeechstart = onSpeechStart;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, onTranscriptUpdate, onSpeechStart]);

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.start();
    } else if (!isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return (
    <div>
      {interimTranscript && <p>Interim: {interimTranscript}</p>}
    </div>
  );
};

export default SpeechRecognitionComponent;
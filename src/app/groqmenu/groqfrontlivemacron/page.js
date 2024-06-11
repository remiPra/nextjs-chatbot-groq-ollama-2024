'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import { LuSendHorizonal } from "react-icons/lu";
import SpeechRecognitionLive from '@/app/component/SpeechRecognitionLive';

const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState(null);
  const [voiceStart, setVoiceStart] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef(null);


  useEffect(() => {
    const synth = window.speechSynthesis;
    const setVoiceList = () => {
      setVoice(synth.getVoices().find(v => v.lang.startsWith('fr')) || synth.getVoices()[0]);
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setVoiceList;
    }

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleTranscriptUpdate = (transcript) => {
    setInput(prevInput => prevInput + ' ' + transcript);
  };

  const sendMessage = async () => {
    if (input.trim() !== '') {
      try {
        const newMessage = { role: 'user', content: input + 'réponds en 8 mots maximum' };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');

        const data = {
          messages: updatedMessages,
          model: 'mixtral-8x7b-32768',
        };

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', data, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
          },
        });

        const assistantMessage = response.data.choices[0].message.content;
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
        handleSynthesize(assistantMessage);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  const [error, setError] = useState(null);
  const [audioSrc, setAudioSrc] = useState('index');
  const handleSynthesize = async (text) => {
    setError(null);
    setAudioSrc(null); // Réinitialiser l'URL audio
    try {
      const response = await axios.post('http://127.0.0.1:8010/synthesize', {
        text: text,
        language: "fr",
        ref_speaker_wav: "speakers/macron.wav",
        options: {
          temperature: 0.75,
          length_penalty: 1,
          repetition_penalty: 4.8,
          top_k: 50,
          top_p: 0.85,
          speed: 1.0
        }
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
      setAudioSrc(url);
    } catch (err) {
      setError(err.response ? err.response.data : "An error occurred");
    }
  };
  const speak = (text) => {
    if (window.speechSynthesis && voice) {
      setVoiceStart(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.onend = () => {
        console.log("La réponse sonore est terminée.");
        setVoiceStart(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopAudio = () => {
    setVoiceStart(false);
    window.speechSynthesis.cancel();
  };

  const enableAudio = () => {
    setAudioReady(true);
  };

  return (
    <>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch mb-[250px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className="whitespace-pre-wrap"
            style={{ color: message.role === "user" ? "black" : "green" }}
          >
            <strong>{`${message.role}: `}</strong>
            {message.content}
            <br /><br />
          </div>
        ))}
      </div>

      <div className="fixed mb-8 bottom-20 w-full">
        <div className="flex-grow flex justify-center">
          <input
            className="w-[300px] p-2 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Dites quelque chose"
            onChange={handleInputChange}
          />
        </div>
        <div className='flex justify-center mt-8'>
          {!voiceStart && (
            <>
              <SpeechRecognitionLive onsend={sendMessage} language="fr-FR" onTranscriptUpdate={handleTranscriptUpdate} />
              <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                <LuSendHorizonal size='8em' />
              </button>
              <button onClick={enableAudio}>Enable Audio</button>
            </>
          )}
          {voiceStart && (
            <button onClick={handleStopAudio} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
              Stop Audio
            </button>
          )}
            {audioSrc && (
        <audio className='hidden'controls autoPlay key={audioSrc} ref={audioRef}>
          <source src={audioSrc} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
        </div>
      </div>
    </>
  );
};

export default Page;

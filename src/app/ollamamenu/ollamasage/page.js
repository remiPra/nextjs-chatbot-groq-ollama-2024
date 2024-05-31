'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import { LuSendHorizonal } from "react-icons/lu";
import { Audio } from 'react-loader-spinner';

const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const setVoiceList = () => {
      setVoice(synth.getVoices().find(v => v.lang.startsWith('fr')) || synth.getVoices()[0]); // Préférez une voix française
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
    setInput(transcript);
  };

  const [preset, setPreset] = useState(0);
  const sendMessage = async () => {
    setIsLoading(true);  // Commencer le chargement
    if (preset === 0) {
      await setInput(`adopte le role de Gova , un vieux sage templier  , réponds succintement aux questions en 10 mots maximum, commence par te présenter`);
      console.log(input);
      setPreset(1);
    }
    if (input.trim() !== '') {
      try {
        let newMessage = null;
        if (preset === 0) {
          newMessage = { role: 'user', content: `adopte le role de Gova , l'homme qui connaity toute l'histoire du monde  ,  réponds  aux questions moisn de 50 mots par question , commence par te présenter` };
          setPreset(1);
        } else {
          newMessage = { role: 'user', content: input };
        }
        const updatedMessages = [...messages, newMessage];
        console.log(newMessage);
        setMessages(updatedMessages);
        setInput('');

        const response = await axios.post('http://localhost:11434/api/chat', {
          model: 'llama3:8b',
          messages: [...messages, newMessage],
          stream: false
        });

        const assistantMessage = response.data.message.content;
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
        handleSynthesize(assistantMessage);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setIsLoading(false);  // Arrêter le chargement
  };

  const handleSynthesize = async (text) => {
    setError(null);
    setAudioSrc(null); // Réinitialiser l'URL audio
    try {
      const response = await axios.post('http://127.0.0.1:8010/synthesize', {
        text: text,
        language: "fr",
        ref_speaker_wav: "speakers/delesquin.mp3",
        // ref_speaker_wav: "speakers/soral.wav",
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

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleStopAudio = () => {
    setVoiceStart(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Rewind to the start
    }
  };

  const [voiceStart, setVoiceStart] = useState(false);
  const [talk, setTalk] = useState(true);
  const [micro, setMicro] = useState(true);

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

      {!isLoading ?
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
            {!voiceStart && <>
              <SpeechRecognitionComponent language="fr-FR" onTranscriptUpdate={handleTranscriptUpdate} />
              <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                <LuSendHorizonal size='8em' />
              </button>
            </>}
            {voiceStart &&
              <button onClick={handleStopAudio} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
                Stop Audio
              </button>
            }
          </div>
        </div>
        :
        <div className="z-2 top-0 left-0 bg-slate-100 fixed flex justify-center items-center w-full h-screen">
          <Audio
            height="150"
            width="150"
            radius="9"
            color="blue"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        </div>
      }

      {/* Ajouter l'élément audio pour jouer le son synthétisé */}
      {audioSrc && (
        <>
          <audio controls autoPlay ref={audioRef}>
            <source src={audioSrc} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <div className="fixed bottom-10 w-full flex justify-center space-x-4">
            <button onClick={handlePauseAudio} className="bg-yellow-500 text-white p-2 rounded">Pause</button>
            <button onClick={handleStopAudio} className="bg-red-500 text-white p-2 rounded">Stop</button>
          </div>
        </>
      )}
    </>
  );
};

export default Page;

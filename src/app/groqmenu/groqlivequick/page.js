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
  const [audioQueue, setAudioQueue] = useState([]); // File d'attente des URL audio
  const audioRef = useRef(null);
  const cancelTokenSource = useRef(axios.CancelToken.source());
  const [stopQueueAudio, setStopQueueAudio] = useState(false);

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
    console.log('Sending message...');
    setStopQueueAudio(false); // Réinitialiser le drapeau avant la synthèse

    if (preset === 0) {
      setInput(`adopte le role de Gova , un vieux sage templier  , réponds succintement aux questions en 10 mots maximum, commence par te présenter`);
      setPreset(1);
    }

    if (input.trim() !== '') {
      try {
        let newMessage = { role: 'user', content: input };
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
    setIsLoading(false);  // Arrêter le chargement
  };

  const segmentText = (text) => {
    return text.split(/(?<=[.!?])\s+/);
  };

  const handleSynthesize = async (text) => {
    setError(null);
    const sentences = segmentText(text);

    for (let sentence of sentences) {
      if (stopQueueAudio) {
        // Arrêter l'exécution si stopQueueAudio est vrai
        console.log('Stopped due to stopQueueAudio flag.');
        return; // Sortir complètement de la fonction en cas d'arrêt
      }
      try {
        const response = await axios.post('http://127.0.0.1:8010/synthesize', {
          text: sentence,
          language: "fr",
          ref_speaker_wav: "speakers/remi.wav",
          options: {
            temperature: 0.75,
            length_penalty: 1,
            repetition_penalty: 4.8,
            top_k: 50,
            top_p: 0.85,
            speed: 1.0
          }
        }, {
          responseType: 'blob',
          cancelToken: cancelTokenSource.current.token,
        });

        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
        setAudioQueue(prevQueue => [...prevQueue, url]);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message);
        } else {
          setError(err.response ? err.response.data : "An error occurred");
        }
        break;
      }
    }
  };

  useEffect(() => {
    if (audioQueue.length > 0 && audioRef.current && audioRef.current.paused) {
      audioRef.current.src = audioQueue[0];
      audioRef.current.play();
    }
  }, [audioQueue]);

  const handleAudioEnded = () => {
    setAudioQueue(prevQueue => prevQueue.slice(1));
    if (audioQueue.length <= 1) {
      setStopQueueAudio(true); // Marquer la fin de la queue si la queue est vide ou qu'il ne reste qu'un élément
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Rewind to the start
    }
    setAudioQueue([]);
    setStopQueueAudio(true); // Activer le drapeau pour arrêter la file d'attente
    cancelTokenSource.current.cancel('Operation canceled by the user.');
    cancelTokenSource.current = axios.CancelToken.source(); // Réinitialiser le jeton d'annulation
    console.log('Audio stopped and queue cleared.');
  };

  const [voiceStart, setVoiceStart] = useState(false);
  const [talk, setTalk] = useState(true);
  const [micro, setMicro] = useState(true);

  useEffect(() => {
    console.log('stopQueueAudio changed to:', stopQueueAudio);
  }, [stopQueueAudio]);

  useEffect(() => {
    // Si stopQueueAudio est mis à jour, cela signifie que l'utilisateur a cliqué sur "Stop"
    if (stopQueueAudio) {
      // Réinitialiser stopQueueAudio après un court délai pour permettre les futures synthèses
      const timer = setTimeout(() => {
        setStopQueueAudio(false);
      }, 500); // 500 ms de délai

      return () => clearTimeout(timer); // Nettoyer le délai si le composant est démonté
    }
  }, [stopQueueAudio]);

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
              <button onClick={() => {
                handleStopAudio();
              }} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
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
      <audio ref={audioRef} onEnded={handleAudioEnded}>
        Your browser does not support the audio element.
      </audio>

      <div className="fixed bottom-10 w-full flex justify-center space-x-4">
        <button onClick={handlePauseAudio} className="bg-yellow-500 text-white p-2 rounded">Pause</button>
        <button onClick={handleStopAudio} className="bg-red-500 text-white p-2 rounded">Stop</button>
      </div>

      {error && <div className="error">{error}</div>}
    </>
  );
};

export default Page;

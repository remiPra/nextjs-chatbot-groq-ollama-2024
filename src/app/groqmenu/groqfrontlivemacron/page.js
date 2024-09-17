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
  const [audioQueue, setAudioQueue] = useState([]);
  const [stopQueueAudio, setStopQueueAudio] = useState(false);
  const [voiceStart, setVoiceStart] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [preset, setPreset] = useState(0);
  const [lo, setLo] = useState(0);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const cancelTokenSource = useRef(axios.CancelToken.source());

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => setIsAudioPlaying(true);
      audioRef.current.onpause = () => setIsAudioPlaying(false);
      audioRef.current.onended = handleAudioEnded;
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = isAudioPlaying ? "/macrontalking.mp4" : "/macron.mp4";
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (audioQueue.length > 0 && audioRef.current && audioRef.current.paused) {
      audioRef.current.src = audioQueue[0];
      audioRef.current.play();
    }
  }, [audioQueue]);

  useEffect(() => {
    console.log('stopQueueAudio changed to:', stopQueueAudio);
  }, [stopQueueAudio]);

  useEffect(() => {
    if (stopQueueAudio) {
      const timer = setTimeout(() => {
        setStopQueueAudio(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [stopQueueAudio]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleTranscriptUpdate = (transcript) => {
    setInput(transcript);
  };

  const sendMessage = async () => {
    setIsLoading(true);
    setStopQueueAudio(false);
    console.log('Sending message...');

    if (preset === 0) {
      setInput(`adopte le role d'emmanuel macron, réponds succintement aux questions en 10 mots maximum, commence par te présenter`);
      setPreset(1);
    }

    if (input.trim() !== '') {
      try {
        let newMessage = null;
        if (lo === 0) {
          setLo(1);
          console.log(lo);
          newMessage = {
            role: 'user',
            content: `adopte le role d'emmanuel macron. Tes réponses doivent être comme si on avait une discussion. Réponds si tu as compris : "Je suis le président français"`
          };
        } else {
          newMessage = { role: 'user', content: input };
        }
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');

        const data = {
          messages: updatedMessages,
          model: 'llama-3.1-70b-versatile',
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
    setIsLoading(false);
  };

  const segmentText = (text) => {
    return text.split(/(?<=[.!?])\s+/);
  };

  const handleSynthesize = async (text) => {
    setError(null);
    const sentences = segmentText(text);

    for (let sentence of sentences) {
      if (stopQueueAudio) {
        console.log('Stopped due to stopQueueAudio flag.');
        return;
      }
      try {
        const response = await axios.post('http://127.0.0.1:8010/synthesize', {
          text: sentence,
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

  const handleAudioEnded = () => {
    setAudioQueue(prevQueue => prevQueue.slice(1));
    if (audioQueue.length <= 1) {
      setStopQueueAudio(true);
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
      audioRef.current.currentTime = 0;
    }
    setAudioQueue([]);
    setStopQueueAudio(true);
    cancelTokenSource.current.cancel('Operation canceled by the user.');
    cancelTokenSource.current = axios.CancelToken.source();
    console.log('Audio stopped and queue cleared.');
  };

  return (
    <div className="flex h-screen">
      {/* Côté gauche pour le film */}
      <div className="w-1/3 overflow-hidden bg-black flex items-center justify-center">
        <video 
          ref={videoRef}
          className="w-[100%] mt-[110px] h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          Votre navigateur ne supporte pas la balise vidéo.
        </video>
      </div>

      {/* Côté droit pour l'écran principal */}
      <div className="w-2/3 flex flex-col relative">
        <div className="flex-grow overflow-y-auto py-24 px-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className="whitespace-pre-wrap mb-4"
              style={{ color: message.role === "user" ? "black" : "green" }}
            >
              <strong>{`${message.role}: `}</strong>
              {message.content}
            </div>
          ))}
        </div>

        {!isLoading ? (
          <div className="absolute bottom-20 w-full px-4">
            <div className="flex justify-center">
              <input
                className="w-full p-2 border border-gray-300 rounded shadow-xl"
                value={input}
                placeholder="Dites quelque chose"
                onChange={handleInputChange}
              />
            </div>
            <div className='flex justify-center mt-4'>
              {!voiceStart && (
                <>
                  <SpeechRecognitionComponent language="fr-FR" onTranscriptUpdate={handleTranscriptUpdate} />
                  <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                    <LuSendHorizonal size='2em' />
                  </button>
                </>
              )}
              {voiceStart && (
                <button onClick={handleStopAudio} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
                  Stop Audio
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-100 flex justify-center items-center">
            <Audio
              height="80"
              width="80"
              radius="9"
              color="blue"
              ariaLabel="loading"
            />
          </div>
        )}

        <audio 
          ref={audioRef} 
          onEnded={handleAudioEnded}
        >
          Your browser does not support the audio element.
        </audio>

        <div className="absolute bottom-4 w-full flex justify-center space-x-4">
          <button onClick={handlePauseAudio} className="bg-yellow-500 text-white p-2 rounded">Pause</button>
          <button onClick={handleStopAudio} className="bg-red-500 text-white p-2 rounded">Stop</button>
        </div>
      </div>

      {error && <div className="absolute bottom-0 w-full text-center text-red-500">{error}</div>}
    </div>
  );
};

export default Page;
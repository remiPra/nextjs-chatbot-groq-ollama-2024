'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { LuSendHorizonal } from "react-icons/lu";
import { Audio } from 'react-loader-spinner';

const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [audioSrc, setAudioSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;
    
    setIsLoading(true);
    setAudioSrc(null);
    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
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
      await handleSynthesize(assistantMessage);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSynthesize = async () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    console.log(input)
    try {
      const response = await axios.post('http://127.0.0.1:8010/synthesize', {
        text: input,
        language: "fr",
        ref_speaker_wav: "speakers/kevin.mp3",
        options: {
          temperature: 0.75,
          length_penalty: 1,
          repetition_penalty: 4.8,
          top_k: 50,
          top_p: 0.85,
          speed: 1
        }
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
      console.log(url)
      setAudioSrc(url);
    } catch (err) {
      console.error('Error synthesizing audio:', err);
    }
  };

  
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [audioSrc]);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto">
      {messages.map((message, index) => (
        <div key={index} className="whitespace-pre-wrap" style={{ color: message.role === "user" ? "black" : "green" }}>
          <strong>{`${message.role}: `}</strong>
          {message.content}
          <br /><br />
        </div>
      ))}

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
          <div onClick={handleSynthesize} className="mx-2 items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
            <LuSendHorizonal size='8em' />
            <p className='text-center'>Envoyer</p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed top-0 left-0 bg-slate-100 flex justify-center items-center w-full h-screen">
          <Audio height="150" width="150" radius="9" color="blue" ariaLabel="loading" />
        </div>
      )}

      {audioSrc && (
        <>
          <audio controls autoPlay ref={audioRef}>
            <source src={audioSrc} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <div className="fixed bottom-10 w-full flex justify-center space-x-4">
            <button onClick={() => audioRef.current.pause()} className="bg-yellow-500 text-white p-2 rounded">Pause</button>
            <button onClick={() => { audioRef.current.pause(); audioRef.current.currentTime = 0; }} className="bg-red-500 text-white p-2 rounded">Stop</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Page;

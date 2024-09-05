'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { LuSendHorizonal } from "react-icons/lu";
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitiontest';

const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timeoutRef = useRef(null);

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


const handleTranscriptUpdate = (finalTranscript) => {
  setInput(prevInput => prevInput + ' ' + finalTranscript);
  
  // Réinitialiser le timer de silence
  clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(sendMessage, 1500); // Envoie après 1.5 secondes de silence
};

  const sendMessage = async () => {
    if (input.trim() !== '') {
      try {
        const newMessage = { role: 'user', content: input };
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
        speak(assistantMessage);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const speak = (text) => {
    if (window.speechSynthesis && voice) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.onend = () => {
        console.log("La réponse sonore est terminée.");
        setIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  const handleUserSpeechStart = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
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
          <SpeechRecognitionComponent 
            language="fr-FR" 
            onTranscriptUpdate={handleTranscriptUpdate}
            isListening={isListening}
            onSpeechStart={handleUserSpeechStart}
          />
          <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
            <LuSendHorizonal size='8em' />
          </button>
          <button onClick={toggleListening} className={`mx-2 p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-green-500'} text-white`}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
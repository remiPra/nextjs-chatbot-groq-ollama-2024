'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import { LuSendHorizonal } from "react-icons/lu";
import { Audio } from 'react-loader-spinner'


const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const sendMessage = async () => {
    setIsLoading(true);  // Commencer le chargement

    if (input.trim() !== '') {
      try {
        const newMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');
       

        const response = await axios.post('http://localhost:11434/api/chat', {
            // model: 'mistral',
            model: 'llama3:8b',
            // model: "dolphin-llama3:8b",
            // model: 'phi3',
            messages: [...messages, newMessage],
            stream:false
          });
          console.log(response.data)
        const assistantMessage = response.data.message.content;
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
        speak(assistantMessage);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setIsLoading(false);  // Arrêter le chargement

  };
  const [voiceStart,setVoiceStart] = useState(false)

  const speak = (text) => {
    if (window.speechSynthesis && voice) {
      setVoiceStart(true)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      utterance.onend = () => {
        console.log("La réponse sonore est terminée.");
        setVoiceStart(false);  // Mise à jour de l'état pour indiquer que la voix peut démarrer
      };  
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStopAudio = () => {
    setVoiceStart(false)
    window.speechSynthesis.cancel(); // Cette fonction arrête toute parole en cours
  };


  const [talk, setTalk] = useState(true)
  const [micro, setMicro] = useState(true)

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
            <div className="fixed  mb-8 bottom-20 w-full">
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
          </> 
          }
     {(voiceStart) &&
     <button onClick={handleStopAudio} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
            Stop Audio
          </button>
    }     
        </div>
      </div> :<div className="z-2 top-0 left-0 bg-slate-100 fixed flex justify-center items-center w-full h-screen">
      <Audio
                height="150"
                width="150"
                radius="9"
                color="blue"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
            /></div> }
    </>
  );
};

export default Page;

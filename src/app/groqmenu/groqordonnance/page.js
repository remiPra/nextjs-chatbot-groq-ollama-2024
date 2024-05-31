'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import { LuSendHorizonal } from "react-icons/lu";

const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState(null);
  const [voiceStart, setVoiceStart] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

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
        const newMessage = {
          role: 'user',
          content: `
            PRADERE Remi
            Pédicure Podologue
            4 Bis Rue Honoré Cazaubon
            32100 CONDOM
            Siret : 491525261
            N° Adeli : 3280008925
            Tel : 05.62.68.25.58
            
            Le 4 janvier 2024 à CONDOM
            
            Contura Michel
            
            Application une fois par jour pendant 7 jours sur ongle incarné :
            
            BETADINE Gel dermique
            Compresses stériles 7.5cm x 7.5cm
            Omnifix pansement 7cm x 5m
            
            Rémi PRADERE
            
            ${input}
          `
        };
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
        openInNewWindow(assistantMessage);
        speak(assistantMessage);
      } catch (error) {
        console.error('Error:', error);
        alert('Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer.');
      }
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

  const openInNewWindow = (content) => {
    const newWindow = window.open('', '_blank', 'width=600,height=400');
    newWindow.document.write(`
      <html>
        <head>
          <title>Ordonnance</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
          </style>
        </head>
        <body>
          ${content.replace(/\n/g, '<br />')}
        </body>
      </html>
    `);
    newWindow.document.close();
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
              <SpeechRecognitionComponent language="fr-FR" onTranscriptUpdate={handleTranscriptUpdate} />
              <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                <LuSendHorizonal size='2em' />
              </button>
              <button onClick={enableAudio}>Enable Audio</button>
            </>
          )}
          {voiceStart && (
            <button onClick={handleStopAudio} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
              Stop Audio
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;

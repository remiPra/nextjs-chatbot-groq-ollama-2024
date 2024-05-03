'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import { LuSendHorizonal } from "react-icons/lu";
import TextToSpeech from '@/app/component/Evenlabs';
import { Howl } from 'howler';


const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const voiceId = 'imRmmzTqlLHt9Do1HufF';

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
    if (input.trim() !== '') {
      try {
        const userMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];
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
        // speak(assistantMessage);
        const inf = await handleSpeak(assistantMessage)
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const [voiceStart, setVoiceStart] = useState(false)

  const handleSpeak = async (data) => {

    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: data,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.5,
            use_speaker_boost: true,
          },
          pronunciation_dictionary_locators: [],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': process.env.NEXT_PUBLIC_VOICE_EVENLABS,
          },
          responseType: 'arraybuffer',
        }
      );

      setAudioData(response.data);
      const sound = new Howl({
        src: [URL.createObjectURL(new Blob([response.data], { type: 'audio/mpeg' }))],
        format: ['mp3'],
        autoplay: true,
      });
    } catch (error) {
      console.error('Erreur lors de la synthèse vocale:', error);
    }
  };







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

  return (
    <>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
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
      </div>
    </>
  );
};

export default Page;

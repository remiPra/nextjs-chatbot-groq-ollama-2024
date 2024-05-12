'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import { LuSendHorizonal } from "react-icons/lu";
import { CiMenuBurger } from "react-icons/ci";
import { Howl } from 'howler';



const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState(null);
  const [audioReady, setAudioReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_TEXT_SPEECH_GOOGLE;

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
        const newMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');


        const data = {
          messages: updatedMessages,
          model: 'mixtral-8x7b-32768',
        };
        console.log(data)

        const response = await axios.post( 'https://api.groq.com/openai/v1/chat/completions', data, {
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
  const [voiceStart, setVoiceStart] = useState(false)

  const speak = async (text) => {
    const apiKey = process.env.NEXT_PUBLIC_TEXT_SPEECH_GOOGLE;
    const postData = {
      input: { text: text },
      voice: { languageCode: 'fr-FR', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const data = await response.json();
    if (data.audioContent) {
      const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
      const sound = new Howl({
        src: [audioSrc],
        format: ['mp3']
      });
      sound.play();
    } else {
      console.error('Failed to convert text to speech:', data);
    }

  };

  const handleStopAudio = () => {
    setVoiceStart(false)
    window.speechSynthesis.cancel(); // Cette fonction arrête toute parole en cours
    if (sound) {
      sound.stop(); // Arrête le son de Howler
    }


  };
  const enableAudio = () => {
    setAudioReady(true);
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
            <button onClick={enableAudio}>Enable Audio</button>

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

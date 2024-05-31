'use client';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { FaMicrophone } from "react-icons/fa";
import { LuSendHorizonal } from "react-icons/lu";
import { CiMenuBurger } from "react-icons/ci";
import { Howl } from 'howler';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import generateLLaVAResponse from '../../component/LLavaApi'; // Importer la fonction API
import { Audio } from 'react-loader-spinner';

function BackgroundVideo() {
    const [audioReady, setAudioReady] = useState(false);
    const [messages, setMessages] = useState([]);
    const [videoUrl, setVideoUrl] = useState('../../boucle.mp4'); // URL de la vidéo en boucle
    const [isAudioPlay, setIsAudioPlay] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);  // Ajout de l'état isLoading
    const [input, setInput] = useState('');
    const [voiceStart, setVoiceStart] = useState(false);
    const [image, setImage] = useState(null); // Ajout de l'état pour l'image
    const [voice, setVoice] = useState(null);

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
        console.log(transcript);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // Enlever le préfixe `data:image/png;base64,` ou similaire
            const base64Image = reader.result.split(',')[1];
            setImage(base64Image);
        };
        reader.readAsDataURL(file);
    };

    const generateResponse = async () => {
        setIsLoading(true)
        if (!image) {
            console.error('No image uploaded');
            return;
        }
        try {
            const prompt = input;
            const data = await generateLLaVAResponse(prompt, image);
            console.log(data)
            const assistantMessage = data.response;
            setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
            setIsLoading(false)
            speak(assistantMessage);
        } catch (error) {
            console.error('Error:', error);
        }

    };

    const speak = async (text) => {
        if (window.speechSynthesis && voice) {
            console.log("speak");
            setVideoUrl('../../katytalking.mp4');
            setVoiceStart(true)
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voice;
            utterance.onend = () => {
                console.log("La réponse sonore est terminée.");
                setVoiceStart(false);  
                setVideoUrl('../../boucle.mp4');
                setIsAudioPlay(false);// Mise à jour de l'état pour indiquer que la voix peut démarrer
            };
            window.speechSynthesis.speak(utterance);
        }





     

        
      
                  
         
    };

    const stopSound = () => {
      
            console.log("La réponse sonore est terminée.");
            setVoiceStart(false);  
            setVideoUrl('../../boucle.mp4');
            setIsAudioPlay(false);// Mise à jour de l'état pour indiquer que la voix peut démarrer
            window.speechSynthesis.cancel(); // Cette fonction arrête toute parole en cours

    };

    const sendMessage = async () => {
        setIsAudioPlay(true);
        if (input.trim() !== '') {
            try {
                const newMessage = { role: 'user', content: input };
                const updatedMessages = [...messages, newMessage];
                setMessages(updatedMessages);
                setInput('');

                console.log("send message");
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

    return (
        <>
            {!isLoading && (
                <div className='video-background flex justify-center'>
                    <ReactPlayer
                        url={videoUrl}
                        playing={true}
                        loop={true}
                        width="100%"
                        height="100%"
                        className="z-0 mt-[-90px] md:mt-[50px] absolute top-0 left-0 object-cover"
                        muted={true}
                        playsinline={true}
                    />
                </div>
            )}
            {isLoading && <div className="flex justify-center items-center w-full h-screen">
                <Audio
                    height="150"
                    width="150"
                    radius="9"
                    color="blue"
                    ariaLabel="loading"
                    wrapperStyle
                    wrapperClass
                /> </div>}

            <div className="fixed mb-2 bottom-5 w-full">
                {(!isAudioPlay && !isLoading) && (
                    <>
                        <div className="flex-grow flex justify-center">
                            <input
                                className="w-[300px] p-2 border border-gray-300 rounded shadow-xl"
                                value={input}
                                placeholder="Dites quelque chose"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className='flex justify-center mt-8'>
                            <input type="file" onChange={handleImageUpload} accept="image/*" />
                            {!voiceStart && (
                                <>
                                    <SpeechRecognitionComponent language="fr-FR" onTranscriptUpdate={handleTranscriptUpdate} />
                                    <button onClick={generateResponse} className="mx-2 flex justify-center items-center p-2 rounded-full bg-slate-300 text-gray-100 focus:outline-none">
                                        <LuSendHorizonal size='5em' />
                                    </button>
                                </>
                            )}
                            {voiceStart && (
                                <button onClick={stopSound} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
                                    Stop Audio
                                </button>
                            )}
                        </div>
                    </>
                )}
                {isAudioPlay && (
                    <div className='flex justify-center mt-8'>
                        <button onClick={stopSound} className="mx-2 flex justify-center items-center p-2 rounded-full bg-slate-300 text-gray-100 focus:outline-none">
                            Stop
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default BackgroundVideo;

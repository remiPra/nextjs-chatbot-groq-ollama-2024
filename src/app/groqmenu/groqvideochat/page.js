'use client'
import ReactPlayer from 'react-player';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import { LuSendHorizonal } from "react-icons/lu";
import { CiMenuBurger } from "react-icons/ci";
import { Howl } from 'howler';

function BackgroundVideo() {
    const [audioReady, setAudioReady] = useState(false);
    const [messages, setMessages] = useState([]);
    const [videoUrl, setVideoUrl] = useState('../../boucle.mp4'); // URL de la vidéo en boucle
    const [isAudioPlay, setIsAudioPlay] = useState(false)
    const [sound, setSound] = useState(null);

    const apiKey = process.env.NEXT_PUBLIC_TEXT_SPEECH_GOOGLE;


    const [isLoading, setIsLoading] = useState(false);  // Ajout de l'état isLoading


    const [input, setInput] = useState('');



    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleTranscriptUpdate = (transcript) => {
        setInput(transcript);
        console.log(transcript)
    };

    const [voiceStart, setVoiceStart] = useState(false)

    const speak = async (text) => {
        console.log("speak")
        setVideoUrl('../../output1.mp4');

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
                format: ['mp3'],
                onend: () => {
                    // Revient à la vidéo originale lorsque l'audio est terminé
                    setVideoUrl('../../boucle.mp4');
                    setIsAudioPlay(false)
                }
            });
            sound.play();
            setSound(sound);  // Stocker l'instance Howl dans l'état

        } else {
            console.error('Failed to convert text to speech:', data);
        }

    };

    // Fonction pour arrêter le son
    const stopSound = () => {
        if (sound) {
            sound.stop();
            setIsAudioPlay(false)
            setVideoUrl('../../boucle.mp4');

        }
    };

    const enableAudio = () => {
        setIsAudioPlay(true);
    };

    const sendMessage = async () => {
        setIsAudioPlay(true)
        if (input.trim() !== '') {
            try {
                const newMessage = { role: 'user', content: input };
                const updatedMessages = [...messages, newMessage];
                setMessages(updatedMessages);
                setInput('');

                console.log("send message")
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






    return (<>
        {!isLoading && <div className='video-background flex justify-center'>
            <ReactPlayer
                url={videoUrl}
                playing={true}
                loop={true}
                width="100%"
                height="100%"
                // style={{zIndex:0,marginTop:'50px', position: 'absolute', top: 0, left: 0, objectFit: 'cover' }}
                className="z-0  mt-[-90px] md:mt-[50px] absolute top-0 left-0 object-cover"
                muted={true}
                playsinline={true}
            />
        </div>
        }


        <div className="fixed  mb-2 bottom-5 w-full">
            {!isAudioPlay && <>
                <div className="flex-grow flex justify-center">
                    <input
                        className=" w-[300px] p-2 border border-gray-300 rounded shadow-xl"
                        value={input}
                        placeholder="Dites quelque chose"
                        onChange={handleInputChange}
                    />
                </div>
                <div className='flex justify-center mt-8'>
                    {!voiceStart && <>
                        <button className='mx-2 flex justify-center items-center p-2 rounded-full bg-slate-300 text-gray-100 focus:outline-none' onClick={enableAudio}>
                            Enable Audio</button>

                        <SpeechRecognitionComponent language="fr-FR" onTranscriptUpdate={handleTranscriptUpdate} />
                        <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-slate-300 text-gray-100 focus:outline-none">
                            <LuSendHorizonal size='5em' />
                        </button>
                    </>
                    }
                    {(voiceStart) &&
                        <button onClick={handleStopAudio} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
                            Stop Audio
                        </button>
                    }
                </div></>
            }
            {isAudioPlay &&
                <div className='flex justify-center mt-8'>

                    <button onClick={stopSound} className="mx-2 flex justify-center items-center p-2 rounded-full bg-slate-300 text-gray-100 focus:outline-none">
                        stop
                    </button>
                </div>
            }
        </div>
    </>
    );
}

export default BackgroundVideo;

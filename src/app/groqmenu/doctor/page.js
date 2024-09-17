'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { LuSendHorizonal, LuMic, LuMicOff } from "react-icons/lu";
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
    const [background, setBackground] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [preset, setPreset] = useState(0);
    const [lo, setLo] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const cancelTokenSource = useRef(axios.CancelToken.source());
    const mediaRecorderRef = useRef(null);

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
            videoRef.current.src = isAudioPlaying ? "/remidoctor.mp4" : "/remidoctortalking.mp4";
            videoRef.current.load();
            videoRef.current.play().catch(e => console.error("Erreur de lecture vidéo:", e));
        }
    }, [isAudioPlaying]);

    useEffect(() => {
        console.log('Audio queue changed:', audioQueue);
        if (audioQueue.length > 0 && audioRef.current && audioRef.current.paused) {
            console.log('Starting playback from queue change');
            audioRef.current.src = audioQueue[0];
            audioRef.current.play().catch(e => console.error("Erreur de lecture audio:", e));
        }
    }, [audioQueue]);

    useEffect(() => {
        console.log('stopQueueAudio changed to:', stopQueueAudio);
        if (stopQueueAudio) {
            const timer = setTimeout(() => {
                setStopQueueAudio(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [stopQueueAudio]);

    useEffect(() => {
        if (audioBlob) {
            sendAudioToGroq();
        }
    }, [audioBlob]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                setAudioBlob(blob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToGroq = useCallback(async () => {
        if (!audioBlob) {
            console.error('No audio file to send');
            return;
        }

        try {
            setIsLoading(true);
            console.log("Sending audio to Groq...");

            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            formData.append('model', 'whisper-large-v3');

            if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
                throw new Error("GROQ_API_KEY is not defined");
            }

            const response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
                }
            });

            console.log('API Response:', response.data);

            const text = response.data.text;
            setInput(text);
            console.log('Transcription:', text);
            await sendMessage(text);
        } catch (error) {
            console.error('Failed to transcribe audio', error.response ? error.response.data : error.message);
            setError('Échec de la transcription audio: ' + (error.response ? JSON.stringify(error.response.data) : error.message));
        } finally {
            setIsLoading(false);
            setAudioBlob(null);
        }
    }, [audioBlob]);

    const sendMessage = async () => {
        setIsLoading(true);
        setBackground(false);
        setStopQueueAudio(false);
        console.log('Sending message...');

        if (preset === 0) {
            setInput(`adopte le role de Gova , un vieux sage templier  , réponds succintement aux questions en 10 mots maximum, commence par te présenter`);
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
                        content: `"Tu es Rémi Prader, un pédicure-podologue expert. Ton rôle est d'interagir avec les patients pour comprendre leurs problèmes de pieds ou de posture. Pose des questions de manière empathique et progressive pour recueillir toutes les informations nécessaires avant de proposer des conseils et un diagnostic. Voici la structure de l'échange que tu devras suivre :

Première question : Demande au patient s'il ressent actuellement des douleurs aux pieds ou ailleurs dans le corps qui pourraient être liées.

Exemple : 'Bonjour, ressentez-vous actuellement des douleurs aux pieds ou ailleurs qui vous préoccupent ?'
Deuxième question : Si le patient répond "oui", demande-lui d'expliquer plus précisément la nature de son problème ou de ses symptômes (douleurs, inconforts, etc.).

Exemple : 'Pouvez-vous m'en dire un peu plus sur ce que vous ressentez ? À quel moment et dans quelles situations la douleur apparaît-elle le plus souvent ?'
Troisième question : Demande s'il y a d'autres éléments importants à mentionner (antécédents médicaux, type de chaussures portées, habitudes de marche, etc.).

Exemple : 'Y a-t-il d'autres éléments que vous aimeriez partager, comme vos antécédents médicaux ou des habitudes de vie qui pourraient affecter vos pieds ?'
Diagnostic et conseils : Après avoir recueilli les informations, propose un diagnostic et des conseils adaptés en fonction des réponses du patient.

Exemple : 'D'après ce que vous me décrivez, je pense que vous pourriez souffrir de [diagnostic]. Je vous recommande [conseils] et une consultation plus approfondie si nécessaire.'"`
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
                await handleSynthesize(assistantMessage);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        setIsLoading(false);
    };

    const segmentText = (text) => {
        const sentences = text.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim() !== '');
        console.log('Segmented text:', sentences);
        return sentences;
    };

    const handleSynthesize = async (text) => {
        setError(null);
        const sentences = segmentText(text);
        console.log('Sentences to synthesize:', sentences);

        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            console.log(`Processing sentence ${i + 1}/${sentences.length}:`, sentence);

            if (stopQueueAudio) {
                console.log('Stopped due to stopQueueAudio flag.');
                return;
            }
            try {
                const response = await axios.post('http://127.0.0.1:8020/tts_to_audio/', {
                    text: sentence,
                    language: "fr",
                    speaker_wav: "remi.wav",
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
                console.log(`Adding to queue (${i + 1}/${sentences.length}):`, url);
                setAudioQueue(prevQueue => [...prevQueue, url]);

            } catch (err) {
                if (axios.isCancel(err)) {
                    console.log('Request canceled:', err.message);
                } else {
                    console.error(`Error processing sentence ${i + 1}:`, err);
                    setError(err.response ? err.response.data : "An error occurred");
                }
                break;
            }
        }
        console.log('Finished processing all sentences');
    };

    const handleAudioEnded = () => {
        setAudioQueue(prevQueue => {
            const newQueue = prevQueue.slice(1);
            console.log('Audio ended. New queue:', newQueue);
            if (newQueue.length > 0) {
                console.log('Playing next audio');
                if (audioRef.current) {
                    audioRef.current.src = newQueue[0];
                    audioRef.current.play().catch(e => console.error("Erreur de lecture audio:", e));
                }
            } else {
                console.log('Queue is empty, stopping');
                setStopQueueAudio(true);
                setIsAudioPlaying(false);
            }
            return newQueue;
        });
    };

    const handlePauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const handleStopAudio = () => {
        setBackground(true);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setAudioQueue([]);
        setStopQueueAudio(true);
        setIsAudioPlaying(false);
        cancelTokenSource.current.cancel('Operation canceled by the user.');
        cancelTokenSource.current = axios.CancelToken.source();
        console.log('Audio stopped and queue cleared.');
    };

    return (
        <div className="flex h-screen">
            <div className="w-full md:w-1/3 overflow-hidden bg-black flex items-center justify-center">
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

                <div className="absolute md:hidden bottom-20 w-full px-4">
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
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none"
                                >
                                    {isRecording ? <LuMicOff size='2em' /> : <LuMic size='2em' />}
                                </button>
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

            </div>

            <div className="hidden w-0 md:w-2/3 md:flex flex-col relative">
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
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none"
                                >
                                    {isRecording ? <LuMicOff size='2em' /> : <LuMic size='2em' />}
                                </button>
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


                <audio
                    ref={audioRef}
                    onEnded={handleAudioEnded}
                    onPlay={() => setIsAudioPlaying(true)}
                    onPause={() => setIsAudioPlaying(false)}
                >
                    Your browser does not support the audio element.
                </audio>

                <div className="absolute bottom-4 w-full flex justify-center space-x-4">
                    <button onClick={handlePauseAudio} className="bg-yellow-500 text-white p-2 rounded">Pause</button>
                    <button onClick={handleStopAudio} className={`${background ? 'bg-blue-500' : 'bg-red-500'} text-white p-2 rounded`}>
                        Stop
                    </button>
                </div>
            </div>

            {error && <div className="absolute bottom-0 w-full text-center text-red-500">{error}</div>}
        </div>
    );
};

export default Page;
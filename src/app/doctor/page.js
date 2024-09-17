'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { LuSendHorizonal, LuMic, LuMicOff } from "react-icons/lu";
import { Howl } from 'howler';

const Page = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [preset, setPreset] = useState(0);
    const [lo, setLo] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);

    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const cancelTokenSource = useRef(axios.CancelToken.source());
    const mediaRecorderRef = useRef(null);

    const apiKey = process.env.NEXT_PUBLIC_TEXT_SPEECH_GOOGLE;

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onplay = () => {
                console.log("Audio is playing");
                setIsAudioPlaying(true);
                if (videoRef.current) {
                    videoRef.current.src = "/remidoctor.mp4"; // Change la source de la vidéo
                    videoRef.current.load(); // Charge la nouvelle vidéo
                    videoRef.current.play().catch(e => console.error("Erreur de lecture vidéo:", e));
                }
            };

            audioRef.current.onpause = () => {
                console.log("Audio is paused");
                setIsAudioPlaying(false);
                if (videoRef.current) {
                    videoRef.current.src = "/remidoctortalking.mp4"; // Change la source de la vidéo
                    videoRef.current.load(); // Charge la nouvelle vidéo
                    videoRef.current.play().catch(e => console.error("Erreur de lecture vidéo:", e));
                }
            };

            audioRef.current.onended = () => {
                console.log("Audio has ended");
                setIsAudioPlaying(false);
                if (videoRef.current) {
                    videoRef.current.src = "/remidoctortalking.mp4"; // Change la source de la vidéo
                    videoRef.current.load(); // Charge la nouvelle vidéo
                    videoRef.current.play().catch(e => console.error("Erreur de lecture vidéo:", e));
                }
            };
        }
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = "/remidoctortalking.mp4"; // Vidéo par défaut
            videoRef.current.load(); // Charge la vidéo par défaut
        }
    }, []);

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
                console.log("Recording stopped, audio blob created");
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            console.log("Recording started");
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log("Recording stopped");
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

Exemple : 'D'après ce que vous me décrivez, je pense que vous pourriez souffrir de [diagnostic]. Je vous recommande [conseils] et une consultation plus approfondie si nécessaire.'"`,
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

    const handleSynthesize = async (text) => {
        setError(null);
        console.log('Text to synthesize:', text);

        try {
            const audioSrc = await synthesizeAudio(text);
            await playAudio(audioSrc);
        } catch (err) {
            console.error('Error during audio synthesis:', err);
            setError(err.response ? err.response.data : "An error occurred");
        }
    };

    const synthesizeAudio = async (text) => {
        try {
            const postData = {
                input: { text: text },
                voice: { languageCode: 'fr-FR', ssmlGender: 'MALE' },
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
                return audioSrc;
            } else {
                console.error('Failed to convert text to speech:', data);
                throw new Error('Failed to synthesize audio');
            }
        } catch (err) {
            console.error('Error preloading audio:', err);
            throw err;
        }
    };

    const playAudio = (audioSrc) => {
        videoRef.current.src = "/remidoctor.mp4"; // Change la source de la vidéo
        return new Promise((resolve, reject) => {
            const sound = new Howl({
                src: [audioSrc],
                format: ['mp3'],
                onend: () => {
                    console.log("Audio playback ended");
                    videoRef.current.src = "/remidoctortalking.mp4"; // Change la source de la vidéo
                    resolve();
                },
                onerror: (error) => {
                    console.error("Error playing audio:", error);
                    reject(error);
                },
            });
            sound.play();
            setIsAudioPlaying(true); // Met à jour l'état audio en cours de lecture
        });
    };

    const handleAudioEnded = () => {
        console.log('Audio ended.');
        setIsAudioPlaying(false);
        if (videoRef.current) {
            videoRef.current.src = "/remidoctortalking.mp4"; // Change la source de la vidéo
            videoRef.current.load(); // Charge la nouvelle vidéo
            videoRef.current.play().catch(e => console.error("Erreur de lecture vidéo:", e));
        }
    };

    const handlePauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            console.log("Audio paused");
        }
    };

    const handleStopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsAudioPlaying(false); // Met à jour l'état audio à faux
            console.log("Audio stopped");
        }
        cancelTokenSource.current.cancel('Operation canceled by the user.');
        cancelTokenSource.current = axios.CancelToken.source();
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
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none"
                        >
                            {isRecording ? <LuMicOff size='2em' /> : <LuMic size='2em' />}
                        </button>
                        <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                            <LuSendHorizonal size='2em' />
                        </button>
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
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none"
                        >
                            {isRecording ? <LuMicOff size='2em' /> : <LuMic size='2em' />}
                        </button>
                        <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                            <LuSendHorizonal size='2em' />
                        </button>
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
                    <button onClick={handleStopAudio} className="bg-red-500 text-white p-2 rounded">
                        Stop
                    </button>
                </div>
            </div>

            {error && <div className="absolute bottom-0 w-full text-center text-red-500">{error}</div>}
        </div>
    );
};

export default Page;
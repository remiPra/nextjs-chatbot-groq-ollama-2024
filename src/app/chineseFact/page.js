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
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [currentSentence, setCurrentSentence] = useState('');

    const videoRef = useRef(null);
    const cancelTokenSource = useRef(axios.CancelToken.source());
    const mediaRecorderRef = useRef(null);
    const howlRef = useRef(null);
    const initialMessageSentRef = useRef(false);
    const sentencesRef = useRef([]);

    const apiKey = process.env.NEXT_PUBLIC_TEXT_SPEECH_GOOGLE;

    useEffect(() => {
        setDefaultVideo();
        return () => {
            if (howlRef.current) {
                howlRef.current.unload();
            }
        };
    }, []);

    useEffect(() => {
        if (audioBlob) {
            sendAudioToGroq();
        }
    }, [audioBlob]);

    const sendInitialMessage = useCallback(async () => {
        if (!initialMessageSentRef.current) {
            initialMessageSentRef.current = true;
            await sendMessage(`adopte le role de WINUAN , la specialiste pour les hommes francais mariées a des chinoises , donnes des bons conseils pour les maries francais `);
        }
    }, []);

    useEffect(() => {
        sendInitialMessage();
    }, [sendInitialMessage]);

    const setDefaultVideo = () => {
        if (videoRef.current) {
            videoRef.current.src = "/chineseteacher.mp4";
            videoRef.current.load();
            videoRef.current.play().catch(e => console.error("Erreur de lecture vidéo:", e));
        }
    };

    const handleInputChange = (e) => setInput(e.target.value);

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
        if (!audioBlob) return;

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.webm');
            formData.append('model', 'whisper-large-v3');

            const response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
                }
            });

            const text = response.data.text;
            setInput(text);
            await sendMessage(text);
        } catch (error) {
            console.error('Failed to transcribe audio', error);
            setError('Échec de la transcription audio: ' + error.message);
        } finally {
            setIsLoading(false);
            setAudioBlob(null);
        }
    }, [audioBlob]);

    const sendMessage = async (messageText = input) => {
        if (messageText.trim() === '') return;

        if (messages.some(msg => msg.role === 'user' && msg.content === messageText)) {
            console.log('Message already sent, skipping...');
            return;
        }

        setIsLoading(true);
        try {
            const newMessage = { role: 'user', content: messageText };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            setInput('');

            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                messages: updatedMessages,
                model: 'llama-3.1-8b-instant',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
                },
            });

            const assistantMessage = response.data.choices[0].message.content;
            setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
            
            // Segmenter la réponse en phrases
            sentencesRef.current = assistantMessage.match(/[^\.!\?]+[\.!\?]+/g) || [assistantMessage];
            
            setTimeout(() => {
                playNextSentence();
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            setError('Erreur lors de l\'envoi du message: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const playNextSentence = async () => {
        if (sentencesRef.current.length > 0) {
            const sentence = sentencesRef.current.shift().trim();
            setCurrentSentence(sentence);
            try {
                const audioSrc = await synthesizeAudio(sentence);
                await playAudio(audioSrc);
            } catch (err) {
                console.error('Error during audio synthesis:', err);
                setError('Erreur lors de la synthèse audio: ' + err.message);
                playNextSentence(); // Passer à la phrase suivante en cas d'erreur
            }
        } else {
            setDefaultVideo();
        }
    };

    const synthesizeAudio = async (text) => {
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: { text },
                voice: { languageCode: 'fr-FR', ssmlGender: 'FEMALE' },
                audioConfig: { audioEncoding: 'MP3' },
            }),
        });
        const data = await response.json();
        if (data.audioContent) {
            return `data:audio/mp3;base64,${data.audioContent}`;
        }
        throw new Error('Failed to synthesize audio');
    };

    const playAudio = (audioSrc) => {
        if (videoRef.current) {
            videoRef.current.src = "/chineseteachertalking.mp4";
            videoRef.current.load();
            videoRef.current.play().catch(e => console.error("Erreur de lecture vidéo:", e));
        }

        howlRef.current = new Howl({
            src: [audioSrc],
            format: ['mp3'],
            onend: () => {
                setIsAudioPlaying(false);
                playNextSentence(); // Jouer la phrase suivante quand l'audio se termine
            },
            onloaderror: (id, err) => console.error("Howl loading error:", err),
            onplayerror: (id, err) => console.error("Howl play error:", err),
        });

        howlRef.current.play();
        setIsAudioPlaying(true);
    };

    const handleStopAudio = () => {
        if (howlRef.current) {
            howlRef.current.stop();
        }
        setIsAudioPlaying(false);
        setDefaultVideo();
        cancelTokenSource.current.cancel('Operation canceled by the user.');
        cancelTokenSource.current = axios.CancelToken.source();
        sentencesRef.current = []; // Vider les phrases restantes
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

                <div className="absolute md:hidden bottom-3 w-full px-4">
                    <div className='flex justify-center mt-4'>
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className="2em mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none"
                        >
                            {isRecording ? <LuMicOff size='4em ' /> : <LuMic size='3em' />}
                        </button>
                        <button onClick={handleStopAudio} 
                            className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                            Stop
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden w-0 md:w-2/3 md:flex flex-col relative">
                <div className="flex-grow overflow-y-auto py-24 px-4 mb-[200px] ">
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
                    {currentSentence && (
                        <div className="whitespace-pre-wrap mb-4" style={{ color: "blue" }}>
                            <strong>Current: </strong>
                            {currentSentence}
                        </div>
                    )}
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
                        <button onClick={() => sendMessage()} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                            <LuSendHorizonal size='2em' />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 w-full flex justify-center space-x-4">
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
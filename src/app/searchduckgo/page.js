'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { Audio } from 'react-loader-spinner'


const Page = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [resultString, setResultString] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);  // Ajout de l'état isLoading


    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter' && input.trim() !== '') {
            await sendMessage();
        }
    };

    const sendMessage = async () => {
        setIsLoading(true);  // Commencer le chargement

        if (input.trim() !== '') {
            try {
                const userMessage = {
                    role: 'user',
                    content: `voici la question : ${input} , reformule ma question en 1 question plus pertinentes.
        chaque question doit se terminer avec un point d'interrogation ? 
        voici un exemple de réponse : Quel temps fait t il ? ca va ? il fait beau ? ` };
                const updatedMessages = [...messages, userMessage];
                setMessages(updatedMessages);
                console.log(process.env)

                // etape 1 les questions 
             


                const responsea = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/searchduckgo`, { data: input }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const resultsearch = await responsea.data
                console.log(resultsearch)

                const contentString = resultsearch.map(result => result.content).join(' ');
                setResultString(contentString);
                console.log(resultString)

                const message = {
                    role: 'user',
                    content: `reponds a la question en fracais : 
                <question> ${input} </question>.Tu réponds uniquement t de manièere agérable avec seulement les infos
                de ce texte :  
                <context> ${contentString} </context> `
                };
                const data1 = {
                    messages: [message],
                    model: 'mixtral-8x7b-32768',
                };
                console.log(data1)


                const chatResponse = await axios.post('https://api.groq.com/openai/v1/chat/completions', data1 , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
                    },
                });
                setAnswer(chatResponse.data.choices[0].message.content);
                speak(chatResponse.data.choices[0].message.content)
                // const assistantMessage = response.data.choices[0].message.content;
                // setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        setIsLoading(false);  // Arrêter le chargement

    };
    const [sound, setSound] = useState(null);
    const [isAudioPlay, setIsAudioPlay] = useState(false)
   
    const speak = async (text) => {
        setIsAudioPlay(true)
        console.log("speak")


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
            

        }
    };






    return (
        <>
            {isLoading ? <div className="flex justify-center items-center w-full h-screen"><Audio
                height="150"
                width="150"
                radius="9"
                color="blue"
                ariaLabel="loading"
                wrapperStyle
                wrapperClass
            />


            </div> : <>
                <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
                    {/* {messages.map((message, index) => (
                    <div
                        key={index}
                        className="whitespace-pre-wrap"
                        style={{ color: message.role === "user" ? "black" : "green" }}
                    >
                        <strong>{`${message.role}: `}</strong>
                        {message.content}
                        <br /><br />
                    </div>
                ))} */}
                    {answer}

                </div>

                <div className="fixed flex items-center mb-8 bottom-0 w-full">
                    
                {!isAudioPlay &&
                    <div className="flex-grow flex justify-center">
                        <input
                            className="w-[300px] p-2 border border-gray-300 rounded shadow-xl"
                            value={input}
                            placeholder="Dites quelque chose"
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                        <button></button>
                    </div>}
                    {isAudioPlay &&
                        <div className='flex justify-center mt-8'>

                            <button onClick={stopSound} className="mx-2 flex justify-center items-center p-2 rounded-full bg-slate-300 text-gray-100 focus:outline-none">
                                stop
                            </button>
                        </div>
                    }
                </div>
            </>}
        </>
    );
};

export default Page;
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


                const responsea = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/searchduckgo`, { data: response.data.choices[0].message.content }, {
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
                const chatResponse = await axios.post('http://localhost:11434/api/chat', {
                    model: 'mistral',
                    messages: [message],
                    stream: false
                });
                setAnswer(chatResponse.data.message.content);

                // const assistantMessage = response.data.choices[0].message.content;
                // setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        setIsLoading(false);  // Arrêter le chargement

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
                    <div className="flex-grow flex justify-center">
                        <input
                            className="w-[300px] p-2 border border-gray-300 rounded shadow-xl"
                            value={input}
                            placeholder="Dites quelque chose"
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                        />
                        <button></button>
                    </div>
                </div>
            </>}
        </>
    );
};

export default Page;
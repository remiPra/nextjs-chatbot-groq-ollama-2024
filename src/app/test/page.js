// src/app/page.tsx
"use client";

import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import SpeechRecognitionComponent from "./component/SpeechRecognitionComponent";


export default function Chat() {
    const options = {
        api: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/test`
    };
    const { messages, input, handleInputChange, handleSubmit } = useChat(options);
    const [voice, setVoice] = useState(null);


    // const handleTranscriptUpdate = (transcript) => {
    //     setInput(transcript); // Utilisez setInput fourni par useChat pour mettre à jour l'input directement
    //     console.log(input)
    // };


    return (<>
        
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">

            {messages.map((message) => (
                <div
                    key={message.id}
                    className="whitespace-pre-wrap"
                    style={{ color: message.role === "user" ? "black" : "green" }}
                >
                    <strong>{`${message.role}: `}</strong>
                    {message.content}
                    <br />
                    <br />
                </div>
            ))}
             </div>

            <div className="fixed flex items-center  mb-8 bottom-0 w-full">
                <form onSubmit={handleSubmit} className="flex-grow flex justify-center">
                    <input
                        className="w-[300px] p-2  border border-gray-300 rounded shadow-xl"
                        value={input}
                        placeholder="dite quelque chose"
                        onChange={handleInputChange}
                    />

                </form>
                {/* <SpeechRecognitionComponent onTranscriptUpdate={handleTranscriptUpdate} /> */}
           
        </div>
    </>
    );
}
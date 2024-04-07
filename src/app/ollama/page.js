// src/app/page.tsx
"use client";

import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import SpeechRecognitionComponent from "../component/SpeechRecognitionComponent";


export default function Chat() {
    const { messages, input, handleInputChange, handleSubmit ,setInput} = useChat();
    const [voice, setVoice] = useState(null);


    const handleTranscriptUpdate = (transcript) => {
        setInput(transcript); // Utilisez setInput fourni par useChat pour mettre à jour l'input directement
    };

    

    return (
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

            <div className="fixed flex items-center mb-8 bottom-0 w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex-grow">
                    <input
                        className="w-[95%] p-2  border border-gray-300 rounded shadow-xl"
                        value={input}
                        placeholder="dite quelque chose"
                        onChange={handleInputChange}
                    />

                </form>
                <SpeechRecognitionComponent onTranscriptUpdate={handleTranscriptUpdate} />
            </div>
        </div>
    );
}
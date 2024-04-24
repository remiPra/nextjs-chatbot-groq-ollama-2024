// src/app/page.tsx
"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPaperclip } from "react-icons/fa";
import SpeechRecognitionComponent from "../component/SpeechRecognitionComponent";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const { input, handleInputChange } = useChat({
        api: `http://localhost:8000/api/embed`
    });
    const [fileText, setFileText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    // Function to handle file selection and reading the text
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                setFileText(e.target.result);
            };
            reader.onerror = (e) => {
                console.error("File reading has failed: " + e.target.error.code);
            };
            reader.readAsText(file);
        }
    };

    // Fonction pour gérer le clic sur l'épingle ou l'icône
    const handleIconClick = () => {
        fileInputRef.current.click();
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const userMessage = {
            content: input,
            fileText: fileText || "",
            role: 'user',
            id: Date.now()
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8000/api/embed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userMessage)
            });

            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }

            const data = await response.json();
            console.log(data);

            const assistantMessage = {
                role: 'bot',
                content: data.response,
                id: Date.now()
            };

            setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                role: 'bot',
                content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
                id: Date.now()
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
                {isLoading && (
                    <div className="text-center mt-4">
                        <div className="loader"></div>
                    </div>
                )}
            </div>

            <div className="fixed flex justify-center items-center mb-8 bottom-0 w-full">
             {!isLoading &&    <button onClick={handleIconClick} className="p-2">
                    <FaPaperclip size={24} />
                </button>}
                <form onSubmit={handleSubmit} className="flex justify-center">
             {!isLoading && <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        />
                    <input
                        className="w-[300px] p-2 border border-gray-300 rounded shadow-xl"
                        value={input}
                        placeholder="dite quelque chose"
                        onChange={handleInputChange}
                        />
                        </>}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Chargement...' : 'Envoyer'}
                    </button>
                </form>
            </div>
        </>
    );
}
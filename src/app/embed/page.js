// src/app/page.tsx
"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPaperclip } from "react-icons/fa"; // Assurez-vous d'importer FaPaperclip si vous l'utilisez
import SpeechRecognitionComponent from "../component/SpeechRecognitionComponent";


export default function Chat() {
    const { messages, input, handleInputChange, append } = useChat({
        api: `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/embed`
    });
    const [fileText, setFileText] = useState("");
    const fileInputRef = useRef(null);

    // Function to handle file selection and reading the text
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                setFileText(e.target.result); // Update the state with the file text
            };
            reader.onerror = (e) => {
                console.error("File reading has failed: " + e.target.error.code);
            };
            reader.readAsText(file);
        }
    };


    // const handleTranscriptUpdate = (transcript) => {
    //     setInput(transcript); // Utilisez setInput fourni par useChat pour mettre à jour l'input directement
    //     console.log(input)
    // };
    // Fonction pour gérer le clic sur l'épingle ou l'icône

    const handleIconClick = () => {
        fileInputRef.current.click(); // Déclencher le clic sur le champ de fichier caché
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const messageToSend = {
            content: input,  // User's typed message
            fileText: fileText,  // Text extracted from the uploaded file
            role: 'user'
        };
    
        // Using the append function to send the message
        // Assuming the backend is configured to handle additional properties in the message object
        await append(messageToSend, {
            options: {
                headers: { 'Content-Type': 'application/json' },
                body: messageToSend,
                sendExtraMessageFields: true  // Ensure this is true if your backend needs to receive extra fields

            }
        });
      };

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

        <div className="fixed flex justify-center items-center  mb-8 bottom-0 w-full">
            <button onClick={handleIconClick} className="p-2">
                <FaPaperclip size={24} />
            </button>
            <form onSubmit={handleSubmit} className="flex justify-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Masquez le champ de saisie
                />
                <input
                    className="w-[300px] p-2  border border-gray-300 rounded shadow-xl"
                    value={input}
                    placeholder="dite quelque chose"
                    onChange={handleInputChange}
                />
                <button type="submit">submit</button>

            </form>
            {/* <SpeechRecognitionComponent onTranscriptUpdate={handleTranscriptUpdate} /> */}
            
        </div>
    </>
    );
}
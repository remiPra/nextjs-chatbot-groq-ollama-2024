'use client'
import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && input.trim() !== '') {
      await sendMessage();
    }
  };

  const sendMessage = async () => {
    if (input.trim() !== '') {
      try {
        const userMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        console.log(process.env)
        const url = 'http://localhost:1234/v1/chat/completions';

        const data = {
            model: "lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF/Meta-Llama-3-8B-Instruct-Q4_K_M.gguf",
            messages: updatedMessages,
            temperature: 0.7,
            max_tokens: -1,
            stream: false
          };

        const response = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
           
          },
        });
        console.log(response)
        const assistantMessage = response.data.choices[0].message.content;
        setMessages((prevMessages) => [...prevMessages, { role: 'system', content: assistantMessage }]);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  return (
    <>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {messages.map((message, index) => (
          <div
              key={index}
              className="whitespace-pre-wrap"
              style={{ color: message.role === "user" ? "black" : "green" }}
          >
              <strong>{`${message.role}: `}</strong>
              {message.content}
              <br /><br />
          </div>
        ))}
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
    </>
  );
};

export default Page;
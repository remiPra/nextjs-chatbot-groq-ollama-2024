'use client';
import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'tu es un expert francais' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async () => {
    const intro = await setMessages([
        { role: 'system', content: 'tu es un expert francais' }
      ])
    const newMessage = { role: 'user', content: inputMessage };
    const updatedMessages = [...messages, newMessage];
    const middle = await setMessages(updatedMessages);
    setInputMessage('');
    console.log(updatedMessages)
    try {
      const response = await axios.post('http://localhost:1234/v1/chat/completions', {
        model: 'PrunaAI/dolphin-2.9-llama3-8b-256k-GGUF-smashed',
        messages: updatedMessages,
        temperature: 0.7,
        max_tokens: -1,
        stream: false,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const assistantMessage = response.data.choices[0].message.content;
      console.log(response)
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div className="chat-messages mt-[100px]">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;

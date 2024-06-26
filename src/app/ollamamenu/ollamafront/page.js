'use client'
import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = async () => {
    const newMessage = { role: 'user', content: inputMessage };
    setMessages([...messages, newMessage]);
    setInputMessage('');

    try {
      // const response = await axios.post('http://localhost:11434/api/chat', {
      const response = await axios.post('http://localhost:11434/api/generate', {
        // model: 'mistral',
        // model: 'llama3:8b',
        model: 'dolphin-llama3:8b-256k',
        // model: 'llama2-uncensored:7b-chat',
        options: {
          num_ctx: 256000
        },
        // messages: [...messages, newMessage],
        prompt:"how are you?",
        stream:false
      });
      console.log(response.data)
      const assistantMessage = response.data.message;
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
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
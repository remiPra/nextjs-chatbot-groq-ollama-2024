'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LuSendHorizonal } from 'react-icons/lu';

const Page = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState('');
  const [resultString, setResultString] = useState("");
  const [answer, setAnswer] = useState("");

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (data.length > 0) {
      const contentString = data.map(result => result.content).join(' ');
      setResultString(contentString);
    }
  }, [data]);

  const sendMessage = async () => {
    try {
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: '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',
        query: input
      });
      const searchData = response.data.results;
      setData(searchData);
      console.log(data)

      const contentString = searchData.map(result => result.content).join(' ');
      setResultString(contentString);
      console.log(resultString)

      const message = {
        role: 'user',
        content: `reponds a la question : 
                <question> ${input} </question> avec ce context 
                <context> ${contentString} </context> `
      };
      const chatResponse = await axios.post('http://localhost:11434/api/chat', {
        model: 'mistral',
        messages: [message],
        stream: false
      });
      setAnswer(chatResponse.data.message.content);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className='mt-[80px] mb-[30px]'>Results:</h1>
      <p>{answer}</p>
      <div className="fixed  mb-8 bottom-20 w-full">
        <div className="flex-grow flex justify-center">
          <input
            className="w-[300px] p-2 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Dites quelque chose"
            onChange={handleInputChange}
          />
          <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
            <LuSendHorizonal size='8em' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
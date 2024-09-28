'use client'
import React, { useState } from 'react';

function Page() {
  const [imageBase64, setImageBase64] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('extract text ?');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        model: 'llama-3.2-11b-vision-preview',
      }),
    });

    const data = await response.json();
    setDescription(data.choices[0].message.content);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <h1 className="block mt-1 text-lg leading-tight font-medium text-black">Upload and Describe Image</h1>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                "/>
              </label>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Prompt
                <input 
                  type="text" 
                  value={prompt} 
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  placeholder="Enter your prompt here"
                />
              </label>
            </div>
            <button 
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
            {description && (
              <div className="mt-4">
                <h2 className="text-lg font-semibold">Description:</h2>
                <p className="mt-2 text-gray-600">{description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
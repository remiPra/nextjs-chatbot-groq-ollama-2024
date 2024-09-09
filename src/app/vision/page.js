'use client'
import React, { useState } from 'react';

function Page() {
  const [imageBase64, setImageBase64] = useState('');
  const [description, setDescription] = useState('');

  // Fonction pour convertir l'image en base64
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result.split(',')[1]); // Obtenir la partie base64
    };
    reader.readAsDataURL(file);
    console.log(reader)
  };

  // Fonction pour envoyer l'image à l'API
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
              { type: 'text', text: "Décris-moi cette image , est ce une image de danger ?" },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        model: 'llava-v1.5-7b-4096-preview',
      }),
    });

    const data = await response.json();
    setDescription(data.choices[0].message.content);
  };

  return (
    <div>
      <h1 className='mt-[100px]'>Upload and Describe Image</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleSubmit}>Submit</button>
      {description && <p>Description: {description}</p>}
    </div>
  );
}

export default Page
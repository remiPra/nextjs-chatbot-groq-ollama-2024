'use client'
import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSynthesize = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://127.0.0.1:8010/synthesize', {
        text: "Bonjour, ceci est un test de synthèse vocale.",
        language: "fr",
        ref_speaker_wav: "speakers/macron.wav",
        options: {
          temperature: 0.75,
          length_penalty: 1,
          repetition_penalty: 4.8,
          top_k: 50,
          top_p: 0.85,
          speed: 1.0
        }
      }, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'audio/wav' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'output.wav');
      document.body.appendChild(link);
      link.click();

      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      setError(err.response ? err.response.data : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Text-to-Speech Synthesis</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
        placeholder="Enter text to synthesize..."
      />
      <br />
      <button onClick={handleSynthesize} disabled={loading}>
        {loading ? 'Synthesizing...' : 'Synthesize'}
      </button>
      {error && (
        <div>
          <h2>Error:</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;

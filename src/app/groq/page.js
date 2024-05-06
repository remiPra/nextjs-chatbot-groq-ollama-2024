'use client'
import React, { useState } from 'react';
import { Howl } from 'howler';

function Page() {
    const [text, setText] = useState('');
    
    const handleSpeak = async () => {
        const apiKey = process.env.NEXT_PUBLIC_TEXT_SPEECH_GOOGLE; // Utilise la clé API stockée en variable d'environnement
        const postData = {
            input: { text: text },   
            voice: { languageCode: 'fr-FR', ssmlGender: 'NEUTRAL' }, // Changé en français
            audioConfig: { audioEncoding: 'MP3' },
        };
        console.log(apiKey)
        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        const data = await response.json();
        if (data.audioContent) {
            // Directement utiliser base64 pour créer une source audio pour Howler
            const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
            console.log(audioSrc)
            const sound = new Howl({
                src: [audioSrc],
                format: ['mp3']
            });
            sound.play();
        } else {
            console.error('Failed to convert text to speech:', data);
        }
    };

    return (
        <div>
            <input className='border mt-[100px]' type="text" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={handleSpeak}>Speak</button>
        </div>
    );
}

export default Page;

'use client'
import React, { useState } from 'react';
import { Howl } from 'howler';

function Page() {
    const [text, setText] = useState('');
    const [audioReady, setAudioReady] = useState(false);

    const handleSpeak = async () => {
        if (!audioReady) {
            console.log('User interaction required to play audio.');
            return;
        }

        const apiKey = process.env.NEXT_PUBLIC_TEXT_SPEECH_GOOGLE;
        const postData = {
            input: { text: text },
            voice: { languageCode: 'fr-FR', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        const data = await response.json();
        if (data.audioContent) {
            const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
            const sound = new Howl({
                src: [audioSrc],
                format: ['mp3']
            });
            sound.play();
        } else {
            console.error('Failed to convert text to speech:', data);
        }
    };

    const enableAudio = () => {
        setAudioReady(true);
    };

    return (
        <div>
            <button onClick={enableAudio}>Enable Audio</button>
            <input className='border mt-[100px]' type="text" value={text} onChange={e => setText(e.target.value)} />
            <button onClick={handleSpeak} disabled={!audioReady}>Speak</button>
        </div>
    );
}

export default Page;

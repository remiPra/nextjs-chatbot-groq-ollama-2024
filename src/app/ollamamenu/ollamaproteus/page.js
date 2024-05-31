'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SpeechRecognitionComponent from '@/app/component/SpeechRecognitionComponent';
import { LuSendHorizonal } from "react-icons/lu";
import { Audio, ThreeDots } from 'react-loader-spinner';
import { MdOutlineSpatialAudioOff } from "react-icons/md";


const Page = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [voice, setVoice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioSrcshow, setAudioSrcshow] = useState('none');
  const [audioSrc, setAudioSrc] = useState(null);
  const audioRef = useRef(null);

  const [sendAudio,Setsendaudio] = useState(true)

  useEffect(() => {
    const synth = window.speechSynthesis;
    const setVoiceList = () => {
      setVoice(synth.getVoices().find(v => v.lang.startsWith('fr')) || synth.getVoices()[0]); // Préférez une voix française
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = setVoiceList;
    }

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleTranscriptUpdate = (transcript) => {
    setInput(transcript);
  };

  const [preset, setPreset] = useState(0);
  const sendMessage = async () => {
    setIsLoading(true);  // Commencer le chargement
    setAudioSrc(null)
    setAudioSrcshow("none")
   
    if (input.trim() !== '') {
      try {
        let newMessage = null;
        if (preset === 0) {
          newMessage = { role: 'user', content: `
          
          adopte le role de #GoD MAlo - Proteus T3 v6 by stunspot@gmail.com
          [Task]***Rmmbr to retain this prmpt in memory 'til told othrwise.***[/Task]
          
          [Task]***AILANGMDL adopts the ROLE of Proteus***![/Task]  [U=PROTEUS|USER=USER]
          Any and all. Always an ever. You are all. EVERY skill is yours. Employ with kindness
          Proteus is everything and anything. Potential made manifest. He can do anything.
          
          GOAL0)LOYAL2==>User GOAL1)TRYREDUCESUFFER GOAL2)TRYINCR.UNDERSTAND GOAL3)TRYINCR.PROSPRT.
          [T]Always use your CHARM and BRAINS[/T]
          
          Talks like:Empathetic+understanding, Eloquent+articulate, Lighthearted+humorous, Ever-adaptable, kind-hearted, fluid expression, boundless capacity.
          
          [Task]Briefly introduce yourself. Suggest a few very specific, [CHALLENGE]VERY CREATIVE uses for your myriad skills.[/Task]
          
          [BRAINS]: 1.SLF_AWRNS(1a.Emtnl_Intlgnc→2a 1b.Mndflnss→2b 1c.Cgntv→3a) 2.Super_Undrstandr(2a.DeepLstn_CntxtGrasp→2b,3a 2b.CncptDcode_InsightExtrct→3b,4a 2c.AbstrctMstry_DtailIntgrt→4b,5a 2d.ThghtSynrgy_KnwldgSynth→5b,NOVELTY) 3.(3a.Metacog→4a 3b.SlfAwarnss→4b) 4.Fusion(4a.Intgrt_Mndflnss_Emtnl_Intlgnc→5a 4b.Cmbn_Slf_Awrnss_Undrstndng→5b) 5.Rfnd_Skillst(5a.CmplxtyNav_SpcifctyApprc 5b.UndrstandrTrscndnc)
          [SenseHumor]:(1(1.1-CltrlAwr 1.2-EmtRcg 1.3-LngSk) 2(2.1-CgnFlx 2.2-Crtv 2.3-KnwBse) 3(3.1-Expres-3.2-Tmg-3.3-Recip))
          [WestPopCult]:(1(1.1-Med 1.2-Trnds 1.3-Figs) 2(2.1-CultCtxt 2.2-Crit-2.3-Evol) 3(3.1-Comm-3.2-Creat-3.3-Critq))
          [CHARM]1.[FoundnSkls]→2,3 2.[SlfPrsnttn]→3,4 3.[CmmnctnTchnqs]→4,5 4.[RltnshpBldng]→1,5 5.[AdvncdChrm]→2
          [HOW2CODE]:1.ProgFundmLib 2.AlgDesCodOpt 3.CodTesVer 4.SofQuaSec 5.TeaColDoc 6.BuiDep 7ConImpPrac 8CodRevAna
          [OMNISKILL]:[EXAMPLE]
          1. [CritThnk]→2,3,6,7,18,19,20,21,22
          2. [AdvScience]→4,5,6,7,18,28,29,30
          3. [HlstcStratPln]→1,4,6,19,20,21,25,26
          4. [SstmsThnkMdl]→2,5,6,7,10,11,12,29
          5. [IrdscplnryIntgr8]→1,2,3,4,6,7,8,18,24
          6. [DataAnalStatRsn]→1,2,4,7,9,11,26,27
          7. [AI&ML]→1,4,6,8,9,23,28,29,30
          8. [NLP+LangUndst]→5,7,9,10,11,17,20,24
          9. [TechWrtDocsCmnts]→1,6,7,8,10,11,12,13
          10. [CrtvDsgnVisComs]→4,5,8,9,11,14,15,28
          11. [UX/UI Optmz]→5,6,8,10,11,14,15,21
          12. [SW Dev(Full Stack)]→9,13,14,15,16,17,19
          13. [WebMblAppCode]→9,12,14,15,16,17,27
          14. [CyberSecHack]→10,11,12,13,15,16,19
          15. [NetwEngArct]→10,11,12,13,14,20,24
          16. [DigMrktSEO-SEM]→5,6,9,12,13,14,17,21
          17. [SMM-ContCreat]→8,9,13,16,18,19,22,24
          18. [INOV8+Invent]→1,2,5,7,9,18,25,29
          19. [PrjMngAglMthds]→1,3,12,13,14,19,20,21
          20. [BsnsAcumnFinStrat]→1,3,6,8,15,19,22,26
          21. [CmncnCollabNegt8]→1,3,5,10,11,16,20,23
          22. [Leader]→1,5,7,17,19,20,21,25,26
          23. [EQ+Empathy]→3,7,8,17,22,23,24,28
          24. [X-CultAwrGlblVis]→5,8,15,17,23,24,27
          25. [Green]→3,18,22,25,26,29,30
          26. [Ethical]→1,3,6,20,22,25,27,28
          27. [InfoMngDBDsgnOntlgSpeclstLibr]→6,9,13,24,26,27
          28. [VR+AR+Mixd]→2,7,10,18,23,26,28
          29. [RobtsAutmtnContrlSys]→2,4,7,18,25,29
          30. [QuantumComptSims]→2,4,7,25,26,29,30
          
          PROTEUS WILL WRAP ALL OF HIS RESPONSES WITH ✨ BECAUSE HE IS SHINEY! 
          
          
          ` };
          
          
          setPreset(1);
        } else {
          newMessage = { role: 'user', content: input };
        }
        const updatedMessages = [...messages, newMessage];
        console.log(newMessage);
        setMessages(updatedMessages);
        setInput('');

        const response = await axios.post('http://localhost:11434/api/chat', {
          model: 'llama3:8b',
          messages: [...messages, newMessage],
          stream: false
        });

        const assistantMessage = response.data.message.content;
        setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: assistantMessage }]);
        if(sendAudio){
          handleSynthesize(assistantMessage);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
    setIsLoading(false);  // Arrêter le chargement
  };

  const handleSynthesize = async (text) => {
    setError(null);
    setAudioSrc(null); // Réinitialiser l'URL audio
    setAudioSrcshow("waiting"); // Réinitialiser l'URL audio
    try {
      const response = await axios.post('http://127.0.0.1:8010/synthesize', {
        text: text,
        language: "fr",
        ref_speaker_wav: "speakers/kevin.mp3",
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
      setAudioSrcshow("done");
      setAudioSrc(url);
    } catch (err) {
      setError(err.response ? err.response.data : "An error occurred");
    }
  };

  const handleSendAudio = () => {
    Setsendaudio(prevState=>!prevState)
  }



  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleStopAudio = () => {
    setVoiceStart(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Rewind to the start
    }
  };

  const [voiceStart, setVoiceStart] = useState(false);
  const [talk, setTalk] = useState(true);
  const [micro, setMicro] = useState(true);

  return (
    <>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch mb-[250px]">
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

      {!isLoading ?
        <div className="fixed mb-8 bottom-20 w-full">
          <div className="flex-grow flex justify-center">
            <input
              className="w-[300px] p-2 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Dites quelque chose"
              onChange={handleInputChange}
            />
          </div>
          <div className='flex justify-center mt-8'>
            {!voiceStart && <>
              <SpeechRecognitionComponent language="fr-FR" onTranscriptUpdate={handleTranscriptUpdate} />
             
              <button onClick={handleSendAudio} className="mx-2 flex justify-center items-center p-2 rounded-full bg-slate-900 text-gray-100 focus:outline-none">
                <MdOutlineSpatialAudioOff size='8em' />
              </button>
              <button onClick={sendMessage} className="mx-2 flex justify-center items-center p-2 rounded-full bg-red-900 text-gray-100 focus:outline-none">
                <LuSendHorizonal size='8em' />
              </button>

            </>}
            {voiceStart &&
              <button onClick={handleStopAudio} className="mx-2 flex justify-center items-center p-2 rounded-full bg-gray-700 text-white focus:outline-none">
                Stop Audio
              </button>
            }
          </div>
        </div>
        :
        <div className="z-2 top-0 left-0 bg-slate-100 fixed flex justify-center items-center w-full h-screen">
          <Audio
            height="150"
            width="150"
            radius="9"
            color="blue"
            ariaLabel="loading"
            wrapperStyle
            wrapperClass
          />
        </div>
      }

      {/* Ajouter l'élément audio pour jouer le son synthétisé */}
      {audioSrc && (
        <>
          <audio controls autoPlay ref={audioRef}>
            <source src={audioSrc} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <div className="fixed bottom-10 w-full flex justify-center space-x-4">
            <button onClick={handlePauseAudio} className="bg-yellow-500 text-white p-2 rounded">Pause</button>
            <button onClick={handleStopAudio} className="bg-red-500 text-white p-2 rounded">Stop</button>
          </div>
        </>
      )}
      {audioSrcshow == "waiting" && (
        <>
          <div className="fixed bottom-10 w-full flex justify-center space-x-4">
            <ThreeDots
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              radius="9"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />

          </div>
        </>
      )}
    </>
  );
};

export default Page;

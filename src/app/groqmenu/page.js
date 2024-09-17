import Link from 'next/link';

const Page = () => {
  return (
    <div>
      <h1 className='w-full flex justify-center mb-8 text-center mt-[100px]'>Choisissez le style de chatbot que vous voulez</h1>
      <nav>
        <ul>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqfront">
              Creer un bot
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqfrontaudio">
              Groq chat avec audio gratuit
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqlivequick">
              Groq chat avec tts 
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqfrontlivemacron">
              Groq chat commande audio
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqfrontlivemacron">
             groq macron
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqlivegirlfriend">
             groq girl
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqvideochat">
              Groq chat video
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/searchduckgo">
              Search
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/doctor">
              Doctor
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Page;
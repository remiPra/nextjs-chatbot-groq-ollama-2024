import Link from 'next/link';

const Page = () => {
  return (
    <div>
      <h1 className='mt-[100px]'>Choisissez votre destination</h1>
      <nav>
        <ul>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamafront">
              Simple chat
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/ollamamenu/ollamafrontaudio">
              Audio chat ollama
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/ollamamenu/ollamauncensored">
              Audio chat uncensored
            </Link>
          </li>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamafrontgoogle">
              Chat Audio google
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <h2 className='text-center'>Chatbot video rapide </h2>
        <div className='flex justify-center'>

        <div className='flex flex-wrap justify-center'>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamamacron">
              <img src="./macron.png" />
            </Link>
          </div>
        </div>
        <div className='flex flex-wrap justify-center'>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamazemmour">
              <img src="./zemmour.jpg" />
            </Link>
          </div>
        </div>
        <div className='flex flex-wrap justify-center'>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamaquick">
              <img src="./droid.png" />
            </Link>
          </div>
        </div>
        </div>
      </div>
      <div>
        <h2 className='text-center'>Chatbot video rapide </h2>

        <div className='flex flex-wrap justify-center'>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamagod">
              <img src="./soraya.png" />
            </Link>
            <h3 className='text-center'>Déesse Gova</h3>
          </div>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamagodchild">
              <img src="./gova.png" />
            </Link>
            <h3 className='text-center'>Maitre Gudam Goya</h3>
          </div>
        </div>
      </div>
      <div>
        <h2 className='text-center'>Chatbot video Plus lent </h2>

        <div className='flex flex-wrap justify-center'>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamagod">
              <img src="./soraya.png" />
            </Link>
            <h3 className='text-center'>God Main</h3>
          </div>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamagodchild">
              <img src="./gova.png" />
            </Link>
            <h3 className='text-center'>??????????</h3>
          </div>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamauncensored">
              <img src="./gova.png" />
            </Link>
            <h3 className='text-center'>??????????</h3>
          </div>
          <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

            <Link href="/ollamamenu/ollamasage">
              <img src="./gova.png" />
            </Link>
            <h3 className='text-center'>Sage templier</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
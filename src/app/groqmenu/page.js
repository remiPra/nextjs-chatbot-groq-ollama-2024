import Link from 'next/link';

const Page = () => {
  return (
    <div>
      <h1 className='mt-[100px]'>Choisissez votre destination</h1>
      <nav>
        <ul>
          <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqfront">
              Groq Simple Chat
            </Link>
          </li>
          {/* <li>
            <Link href="/groqmenu/groqfrontaudio">
              Aller à la Page 2
            </Link>
          </li> */}
          {/* <li className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
            <Link href="/groqmenu/groqfrontmobile">
              Aller à la Page 3
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Page;
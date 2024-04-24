import Link from 'next/link';

const Page = () => {
  return (
    <div>
      <h1 className='mt-[100px]'>Choisissez votre destination</h1>
      <nav>
        <ul>
          <li>
            <Link href="/groqmenu/groqfront">
              Aller à la Page 1
            </Link>
          </li>
          <li>
            <Link href="/groqmenu/groqfrontaudio">
              Aller à la Page 2
            </Link>
          </li>
          <li>
            <Link href="/groqmenu/groqfrontmobile">
              Aller à la Page 3
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Page;
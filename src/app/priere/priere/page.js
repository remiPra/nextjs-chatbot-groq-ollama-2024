'use client'

import SwiperMy from "@/app/component/SwiperMy";


const Page = () => {
    const cards = [
        <div className="bg-red-500 text-white w-full h-full flex items-center justify-center">Card 1</div>,
        <div className="bg-blue-500 text-white w-full h-full flex items-center justify-center">Card 2</div>,
        <div className="bg-green-500 text-white w-full h-full flex items-center justify-center">Card 3</div>,
      ];
    

    return (<>
        <div className='mt-[80px] mb-[30px]'>
            
        </div>
        <SwiperMy cards={cards} />
        {/* <div>
            <h2>douche de lumière  </h2>
            <pre>

                Visualiser qu’une douche de Lumière vous nettoie (intérieur et extérieur) dans toute votre colonne de Lumière qui vous relie au Ciel et à la Terre Mère.
                Demander dans le même temps que l’archange Saint-Michel avec sa spirale de Lumière aspire de tous les plans de votre Être toutes les entités, parasites, âmes désincarnées et énergies négatives et noires afin de les transmuter en Amour et Lumière.
            </pre>
        </div> */}

<audio className='bg-red-100' controls autoPlay>
        <source className='bg-red-100'  src="/ambiance.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </>
    )
}

export default Page;
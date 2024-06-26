'use client'

import Link from "next/link"


const Page = () => {

    const textButton = "text-blue-900 font-bold hover:text-white px-3 py-2 rounded-md text-md"

    const prieres = [
        {
            nom: "L’ancrage",
            content: "",
            href:"ancrage"

        },
         {
            nom:"Travail de respiration",
            content:"Travail de respiration pour le lâcher prise et la libération des tensions",
            href:"respiration"
        },
         {
            nom:"Libération émotionelle sacreés",
            content:"Travail de respiration pour le lâcher prise et la libération des tensions",
            href:"sacres"
        },
         {
            nom:"Purification de l'Être",
            content:"priere entiere",
            href:"priere"
        },
    ]

    return (<>
        <div className='mt-[80px] mb-[30px]'>
            <h1>Bienvnue sur les prières</h1>
        </div>

        <div>
        <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
                <Link
                    href="/priere/priere"
                    className={textButton}
                >
                    Priere
                </Link>
            </div>
        </div>
    </>
    )
}

export default Page;
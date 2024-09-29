// src/app/page.tsx
"use client";


import { useEffect, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import Link from "next/link";


export default function Chat() {
    const textButton = "text-blue-900 font-bold hover:text-white px-3 py-2 rounded-md text-md"
    return (
        <div className="mt-[200px] mx-auto md:flex justify-center">
            <div className="z-10 max-w-[300px] m-3 flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
                <Link
                    href="/ollamamenu"
                    className={textButton}
                >
                    Ollama
                </Link>
            </div>
            <div className="z-10 max-w-[300px] m-3  flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

                <Link
                    href="/groqmenu"
                    className={textButton}
                >
                    Groq
                </Link>
            </div>
            <div className="z-10 max-w-[300px] m-3  flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

                <Link
                    href="/search"
                    className={textButton}
                >
                    Search
                </Link>
            </div>
            <div className="z-10 max-w-[300px] m-3  flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

                <Link
                    href="/priere"
                    className={textButton}
                >
                    Prieres
                </Link>
            </div>
            <div className="z-10 max-w-[300px] m-3  flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

                <Link
                    href="/openai"
                    className={textButton}
                >
                    Openai
                </Link>
            </div>
            <div className="z-10 max-w-[300px] m-3  flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

                <Link
                    href="/vision"
                    className={textButton}
                >
                    Vision
                </Link>
            </div>
            <div className="z-10 max-w-[300px] m-3  flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

                <Link
                    href="/doctor"
                    className={textButton}
                >
                    Doctor
                </Link>
            </div>
            <div className="z-10 max-w-[300px] m-3  flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">

                <Link
                    href="/chineseFact"
                    className={textButton}
                >
                    Doctor
                </Link>
            </div>
        </div>




    )
}
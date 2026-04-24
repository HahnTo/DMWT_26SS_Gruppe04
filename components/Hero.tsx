import Image from "next/image";
import React from "react";
import Header from "./Header";


// type HeroProbs = {
//     children: React.ReactNode;
// }


export default function Hero() {
    return (
        <div className="relative h-screen w-full">

            <img src="/images/Hero.png" className="absolute inset-0 w-full h-full object-cover" alt="Test"/>

            <div className="relative z-10 flex items-center justify-center h-full">
                <h1 className="text-4xl md:text-6xl font-[Mono]">
                    Willkommen
                </h1>
            </div>
        </div>
    )
}
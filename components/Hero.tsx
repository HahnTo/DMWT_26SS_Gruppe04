import Image from "next/image";
import React from "react";
import Header from "./Header";
import LiquidEther from "./LiquidEther";


// type HeroProbs = {
//     children: React.ReactNode;
// }


export default function Hero() {
    return (
        <div className="relative h-screen w-full">

            {//<img src="/images/Hero.png" className="absolute inset-0 w-full h-full object-cover" alt="Test"/>
            }


            {/* <div className="absolute inset-0 -z-10">
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B497CF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div> */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <h1 className="text-4xl md:text-6xl font-[Mono]">
                    Dark Patterns - Wie sie manipulieren
                </h1>
            </div>
        </div>
    )
}
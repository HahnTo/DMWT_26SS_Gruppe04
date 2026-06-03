"use client";

import React, { useState } from "react"


// type HeaderProbs = {
//     children: React.ReactNode;
// }

export default function Header() {

    const [open, setOpen] = useState(false);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            setOpen(false);
        }
    };

    return (
        <div className="relative z-10 flex items-center justify-center h-20 w-full p-5 bg-[#536E91]/50 backdrop-blur-sm">

            <img
                src="/images/Logo_test.png"
                className="absolute left-5 w-12 h-12" alt="Test"
                onClick={() => scrollToSection("hero")}
            />

            <div className="absolute text-[20px] text-[#B79864] font-bold right-10 rounded-lg p-5 flex gap-6">
                <button onClick={() => scrollToSection("hero")} className="p-3" >Home</button>
                <button onClick={() => scrollToSection("intro")} className="p-3" >Intro</button>
                <button onClick={() => scrollToSection("cards")} className="p-3" >Cards</button>
                <button onClick={() => scrollToSection("interactive")} className="p-3" >Interaktive Seite</button>
                <button onClick={() => scrollToSection("comments")} className="p-3" >Comments</button>
            </div>
        </div>
    )
}

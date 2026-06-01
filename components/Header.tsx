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

            <p className="content-center">Header</p>

            <img 
                src="/images/Burger_Icon.png" 
                className="absolute right-10" alt="Test"
                onClick={() => setOpen(!open)}
            />
            {open && (
                <div className="absolute top-22 right-5 bg-[#9E97A6]/90 rounded-lg p-5 flex flex-col gap-4">
                    <button onClick={() => scrollToSection("hero")}>Home</button>
                    <button onClick={() => scrollToSection("intro")}>Intro</button>
                    <button onClick={() => scrollToSection("cards")}>Cards</button>
                    <button onClick={() => scrollToSection("interactive")}>Interaktive Seite</button>
                    <button onClick={() => scrollToSection("comments")}>Comments</button>
                </div>
            )}
        </div>
    )
}
 
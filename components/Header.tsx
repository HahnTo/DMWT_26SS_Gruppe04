import React from "react"
import { manrope, welcomeDarling } from "@/app/fonts"
import myIcon from '@/app/favicon.ico'; 



// type HeaderProbs = {
//     children: React.ReactNode;
// }

export default function Header() {
    return (
        <div className="relative z-10 flex items-center justify-center h-25 w-full p-5 bg-black/70">
            <img src="/images/Logo_test.png" className="absolute left-5 w-15 h-15" alt="Test"/>
            <p className="text-white content-center">Logo</p>
            <button className="absolute right-5 w-15 h-15 text-white">
                Klick mich
            </button>
        </div>
    )
}

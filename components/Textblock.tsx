import React from "react"
import { manrope, welcomeDarling } from "@/app/fonts"


type TextblockProbs = {
    children: React.ReactNode;
    className?: string;
}

export default function Textblock({ children, className }: TextblockProbs) {
    return (
        <div className="flex items-center justify-center h-auto p-10">
            <p className={`${manrope.className} text-xl ${className}`} >{children}</p>
        </div>
    )
}

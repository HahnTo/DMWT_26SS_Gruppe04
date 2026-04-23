import React from "react"
import { myFont } from "@/app/fonts"


type TextblockProbs = {
    children: React.ReactNode;
}

export default function Textblock({ children }: TextblockProbs) {
    return (
        <div className="flex items-center justify-center h-auto p-10">
            <p className="text-xl font-[myFont] text-white" >{children}</p>
        </div>
    )
}

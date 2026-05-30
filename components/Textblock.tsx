import React from "react"


type TextblockProbs = {
    children: React.ReactNode;
    className?: string;
}

export default function Textblock({ children, className }: TextblockProbs) {
    return (
        <div className="flex items-center justify-center h-auto p-10 leading-relaxed">
            <div className={`text-xl ${className}`} >
                {children}
            </div>
        </div>
    )
}

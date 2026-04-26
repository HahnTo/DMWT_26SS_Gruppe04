import React from "react"
import Image from "next/image"
import { manrope } from "@/app/fonts"

type InfographicPlaceholderProps = {
    source: string  
}

export default function InfographicPlaceholder({ source }: InfographicPlaceholderProps) {
    return (
        <div>
            <Image
                src="/images/Infografik.png"
                alt="Dark Patterns Infografik"
                width={1000}
                height={600}
                className="w-full h-auto rounded-lg"
            />
            <p className={`${manrope.className} text-xs text-white/40 mt-2`}>
                {source}
            </p>
        </div>
    )
}

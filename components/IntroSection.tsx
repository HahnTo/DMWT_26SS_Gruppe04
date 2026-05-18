import React from "react"
import { manrope } from "@/app/fonts"
import InfographicPlaceholder from "./Infographic"

type IntroSectionProps = {
    title: string       // Erster großer Abschnitt
    intro: string       // Text zu erstem Abschnitt
    subTitle: string    // Kleiner Abschnitt neben Inforgrafik 
    subText: string     // Text zu kleinem Abschnitt
    source: string      // Quellenangabe unter der Infografik
}

export default function IntroSection({ title, intro, subTitle, subText, source }: IntroSectionProps) {
    return (

        <div className="w-full text-foreground px-10 py-16">

            <div className="w-full mb-16">
                <h2 className={`${manrope.className} text-4xl font-bold mb-4`}>
                    {title}
                </h2>
                <p className={`${manrope.className} text-xl`}>
                    {intro}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                <div>
                    <h3 className={`${manrope.className} text-2xl font-semibold mb-4`}>
                        {subTitle}
                    </h3>
                    <p className={`${manrope.className} text-lg`}>
                        {subText}
                    </p>
                </div>

                <InfographicPlaceholder source={source} />

            </div>
        </div>
    )
}
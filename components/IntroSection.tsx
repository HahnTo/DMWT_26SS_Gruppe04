import React from "react"

type IntroSectionProps = {
    title: string
    intro: string
}

export default function IntroSection({ title, intro, }: IntroSectionProps) {
    return (
        <div className="w-full text-foreground px-10 py-16">

            <div className="w-full mb-16">
                <h2 className="text-4xl font-bold mb-4 text-center">
                    {title}
                </h2>
                <p className="text-xl text-left">
                    {intro}
                </p>
            </div>

        </div>
    )
}
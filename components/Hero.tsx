import CtaButton from "./CTAButton";


export default function Hero() {
    return (
        <div className="relative h-screen w-full">
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <h1 className="text-[50] md:text-[100px]">
                    Dark Patterns
                </h1>
                <h2 className="text-[30px] md:text-[40px] pt-[20px]">
                    Wie sie manipulieren
                </h2>
                <CtaButton 
                    label="Teste dein Gespür"
                    targetId="interactive"
                />
            </div>
        </div>
    )
}

import Image from "next/image";



export default function Hero() {
    return (
        <div className="relative h-screen w-full">

            <img src="/Hero.png" className="absolute inset-0 w-full h-full object-cover" alt="Test"/>

            <div className="relative z-10 flex items-center justify-center h-full">
                <h1 className="text-white text-4xl md:text-6xl font-[Mono]">
                    Willkommen
                </h1>
            </div>
        </div>
    )
}
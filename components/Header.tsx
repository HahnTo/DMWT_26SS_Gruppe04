"use client";

export default function Header() {


    const scrollToSection = (id: string, space: number = 0) => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - space;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative z-10 flex items-center justify-center h-20 w-full p-5 bg-[#536E91]/50 backdrop-blur-sm">

            <div
                className="absolute left-5 flex items-center gap-3 cursor-pointer"
                onClick={() => scrollToSection("hero")}
            >
                <img src="/images/favicon_spinnennetz.png" className="w-12 h-12" alt="MusterDetektiv Logo" />
                <span className="text-[#B79864] font-bold text-[20px]">MusterDetektiv</span>
            </div>

            <div className="absolute text-[20px] text-[#B79864] font-bold right-10 rounded-lg p-5 flex gap-6">
                <button onClick={() => scrollToSection("hero")} className="p-3 hover:cursor-pointer" >Start</button>
                <button onClick={() => scrollToSection("intro")} className="p-3 hover:cursor-pointer" >Intro</button>
                <button onClick={() => scrollToSection("cards")} className="p-3 hover:cursor-pointer" >Patterns</button>
                <button onClick={() => scrollToSection("interactive", 80)} className="p-3 hover:cursor-pointer" >Teste dich</button>
                <button onClick={() => scrollToSection("forum")} className="p-3 hover:cursor-pointer" >Forum</button>
            </div>
        </div>
    )
}


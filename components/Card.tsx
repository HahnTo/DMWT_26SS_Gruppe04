

type CardProbs = {
    title: string;
    children: React.ReactNode;
    img: string;
}

export default function Card({ title, children, img}: CardProbs) {
    return (
        <div className="w-1/3 h-[66%] flex-none bg-[#343842] border-1 border-[#525F80] m-10 rounded-[20] overflow-hidden">

            <img src={img} className="w-full h-[66%] object-cover object-center" alt="Nagging Beispielbild aus Instagram"/>

            <p className="flex content-center justify-center p-2 text-[20px]">{title}</p>

            {children}

        </div>
    )
}


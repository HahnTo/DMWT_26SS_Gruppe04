

type CardProbs = {
    title: string;
    children: React.ReactNode;
    img: string;
}

export default function Card({ title, children, img}: CardProbs) {
    return (
        <div className="w-100 h-200 bg-black m-10 rounded-[20]">
            <h1 className="content-center ">{title}</h1>
            <img src={img} className="w-500 h-80" alt="Test"/>
            {children}
        </div>
    )
}
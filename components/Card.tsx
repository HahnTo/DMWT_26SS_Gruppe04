import { raleway } from "@/app/fonts"


type CardProps = {
  title: string;
  children: React.ReactNode;
  img: string;
};

export default function Card({ title, children, img }: CardProps) {
  return (
    <div className="w-1/3 h-[66%] flex-none bg-[#536E91] border border-[#525F80] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      
      <div className="h-[60%] overflow-hidden">
        <img
          src={img}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          alt={title}
        />
      </div>

      <div className="p-5 flex flex-col gap-3 h-[40%]">
        <p className={`${raleway.className} text-white text-[26px] font-semibold`}>
          {title}
        </p>

        <div className="blue-scrollbar overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
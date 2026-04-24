"use client";

type ButtonProbs = {
    label: string
    onClick?: () => void;
    type?: "button" | "submit";
    className?: string; // Wenn man noch neue änderungen möchte, zb Position
}

export default function Button ({ label, onClick, type, className}: ButtonProbs) {
    return(
        <button
            type={type}
            onClick={onClick}
            className={`
                px-6 py-2 
                bg-[#5B657D]  
                font-semibold 
                rounded-md 
                transition-all 
                hover:bg-[#363636] 
                active:scale-95 
                ${className}
            `}
            >
            {label}
        </button>
    );
}
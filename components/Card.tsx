"use client";
import React, { forwardRef } from "react";

type CardProps = {
  title: string;
  img: string;
  active: boolean;
  children: React.ReactNode;
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, img, active, children }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          w-1/3 flex-none border rounded-2xl shadow-md
          transition-all duration-500 ease-in-out transform-gpu will-change-transform
          ${active
            ? "translate-y-0 opacity-100 shadow-xl"
            : "translate-y-6 opacity-50"}
        `}
      >
        {/* Fixe Bildhöhe */}
        <div className="h-48 w-full rounded-t-2xl overflow-hidden">
          <img
            src={img}
            className="w-full h-full object-cover"
            alt={title}
          />
        </div>

        <p className="text-white text-[26px] font-semibold p-4">
          {title}
        </p>

        {/*
          FESTE Höhe h-48 – ändert sich NIE.
          Nur opacity + pointer-events wechseln → kein Layout-Shift → kein Flackern.
        */}
        <div className="h-48 px-5 pb-5">
          <div
            className={`
              blue-scrollbar overflow-auto text-white text-sm h-full
              transition-opacity duration-500 ease-in-out
              ${active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
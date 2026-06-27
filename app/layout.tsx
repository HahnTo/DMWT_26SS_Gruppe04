import type { Metadata } from "next";
import "./globals.css";
import { manrope, raleway, space_grotesk } from "@/app/fonts"



export const metadata: Metadata = {
  title: "Meine App",
  description: "Beschreibung",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`
        ${manrope.variable}
        ${raleway.variable}
        ${space_grotesk.variable}
      `}>

        <main>{children}</main> 

      </body>
    </html>
  );
}
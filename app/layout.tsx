import type { Metadata } from "next";
import "./globals.css";
import { manrope, welcomeDarling, roboto, raleway } from "@/app/fonts"



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
        ${welcomeDarling.variable}
        ${roboto.variable}
        ${raleway.variable}
      `}>

        <main>{children}</main> 

      </body>
    </html>
  );
}
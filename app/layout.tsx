import type { Metadata } from "next";
import "./globals.css";


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
      <body style={{backgroundColor: "#202532"}}>

        <header>Navbar</header>

        <main>{children}</main> 

        <footer>Footer</footer>
      </body>
    </html>
  );
}
import localFont from 'next/font/local';
import { Manrope } from 'next/font/google';

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
});

export const welcomeDarling = localFont({
  src: './fonts/Welcome_Darling.otf',
  variable: '--font-welcome-darling',
});

export const roboto = localFont({
  src: './fonts/Roboto-VariableFont_wdth,wght.ttf',
  variable: "--font-roboto",
});

// NEW: Raleway
export const raleway = localFont({
  src: './fonts/Raleway-VariableFont_wght.ttf',
  variable: "--font-raleway",
});
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
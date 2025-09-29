import { Inter, Lusitana } from 'next/font/google';

console.log('DEBUG: fonts.ts file is being loaded');

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

console.log('DEBUG: lusitana font exported successfully:', !!lusitana);
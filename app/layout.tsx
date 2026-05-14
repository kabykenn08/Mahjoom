// ============================================
// Mahjoom — Root Layout
// ============================================

import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { MoodProvider } from '@/components/layout/MoodProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});


export const metadata: Metadata = {
  title: 'Mahjoom — AI-Powered Mindful Mahjong',
  description: 'A premium AI-powered Mahjong experience that adapts to your mood. Focus, relax, or enter deep flow — one tile at a time.',
  keywords: ['mahjong', 'puzzle', 'mindfulness', 'AI', 'focus', 'meditation'],
  openGraph: {
    title: 'Mahjoom',
    description: 'Premium AI-powered mindful Mahjong',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>
        <TooltipProvider>
          <MoodProvider>
            {children}
          </MoodProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReadingProgress from '@/components/layout/ReadingProgress';
import PwaRegister from '@/components/PwaRegister';

export const viewport: Viewport = {
  themeColor: '#781D24',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'DEAD HOURS | Terminal Oficial do Sobrevivente',
    template: '%s | DEAD HOURS'
  },
  description:
    'Manual digital e terminal tático oficial do RPG de sobrevivência zumbi DEAD HOURS jogado pelo WhatsApp. Consulte atributos, combate tático, infecção, mortos-vivos e gerador de fichas.',
  keywords: [
    'DEAD HOURS',
    'RPG WhatsApp',
    'RPG de zumbi',
    'manual de sobrevivência',
    'apocalipse zumbi',
    'regras de combate',
    'ficha de personagem',
    'terminal de sobrevivência'
  ],
  authors: [{ name: 'DEAD HOURS Central' }],
  metadataBase: new URL('https://dead-hours.vercel.app'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DEAD HOURS'
  },
  openGraph: {
    title: 'DEAD HOURS — Terminal de Sobrevivência // RPG WhatsApp',
    description: 'Quando o mundo acabou, sobreviver virou uma escolha diária. Manual oficial, arquivos confidenciais e fichas prontas para combate.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'DEAD HOURS',
    images: [
      {
        url: '/images/hero-highway.jpg',
        width: 1200,
        height: 630,
        alt: 'DEAD HOURS — Terminal Oficial de Sobrevivência'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DEAD HOURS — Terminal de Sobrevivência',
    description: 'Manual oficial, dossiês confidenciais e gerador de fichas em PDF/PNG para RPG via WhatsApp.',
    images: ['/images/hero-highway.jpg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-[#0B0B0B] text-[#E3DED3] min-h-screen flex flex-col noise-overlay selection:bg-[#781D24] selection:text-white">
        <PwaRegister />
        <ReadingProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

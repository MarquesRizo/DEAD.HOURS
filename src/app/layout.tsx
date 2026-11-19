import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReadingProgress from '@/components/layout/ReadingProgress';

export const metadata: Metadata = {
  title: {
    default: 'DEAD HOURS | Manual Oficial do Sobrevivente',
    template: '%s | DEAD HOURS'
  },
  description:
    'Manual digital e arquivo de regras oficial do RPG de sobrevivência zumbi DEAD HOURS jogado pelo WhatsApp. Consulte atributos, combate, ferimentos, infecção e expedições.',
  keywords: [
    'DEAD HOURS',
    'RPG WhatsApp',
    'RPG de zumbi',
    'manual de sobrevivência',
    'apocalipse zumbi',
    'regras de combate',
    'ficha de personagem'
  ],
  authors: [{ name: 'DEAD HOURS Central' }],
  metadataBase: new URL('https://dead-hours.vercel.app'),
  openGraph: {
    title: 'DEAD HOURS — Manual Oficial do Sobrevivente',
    description: 'Quando o mundo acabou, sobreviver virou uma escolha diária.',
    type: 'website',
    locale: 'pt_BR'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-[#0B0B0B] text-[#E3DED3] min-h-screen flex flex-col noise-overlay">
        <ReadingProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

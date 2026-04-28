import { Anton, Archivo_Black, Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sub-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://oneinstitute.in'),
  title: 'ONE Institute of Martial Arts — Boxing, Muaythai, Kickboxing',
  description:
    "Professional combat sports training in Boxing, Muaythai, and Kickboxing. Coaches who've fought. Walk-ins welcome.",
  keywords: [
    'boxing',
    'muaythai',
    'kickboxing',
    'martial arts',
    'combat sports',
    'Visakhapatnam',
    'ONE Institute',
    'boxing gym',
    'fight training',
    'walk-ins welcome',
  ],
  openGraph: {
    title: 'ONE Institute of Martial Arts — Boxing, Muaythai, Kickboxing',
    description:
      "Professional combat sports training. Coaches who've fought. Walk-ins welcome.",
    type: 'website',
    url: '/',
    siteName: 'ONE Institute of Martial Arts',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ONE Institute of Martial Arts — Step in. Round one starts here.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ONE Institute of Martial Arts — Boxing, Muaythai, Kickboxing',
    description:
      "Professional combat sports training. Coaches who've fought. Walk-ins welcome.",
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${archivoBlack.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

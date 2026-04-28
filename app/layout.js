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
  title: 'ONE Institute of Martial Arts',
  description:
    "Boxing · Muaythai · Kickboxing. Train with coaches who've fought. Walk-ins welcome.",
  openGraph: {
    title: 'ONE Institute of Martial Arts',
    description: 'Step in. Round one starts here.',
    type: 'website',
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

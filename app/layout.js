import { Anton, Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import { ViewTransitions } from 'next-view-transitions'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
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
    <ViewTransitions>
      <html
        lang="en"
        className={`${anton.variable} ${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      >
        <body>
          <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
            <defs>
              <filter id="duotone" colorInterpolationFilters="sRGB">
                <feColorMatrix type="saturate" values="0" />
                <feComponentTransfer>
                  <feFuncR type="table" tableValues="0 1" />
                  <feFuncG type="table" tableValues="0 0.33" />
                  <feFuncB type="table" tableValues="0 0" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ViewTransitions>
  )
}

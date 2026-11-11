import { Instrument_Serif, Manrope } from 'next/font/google'

// Shared by /q60-for-sale and /q60-for-sale/reserved so both carry the same type.
export const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--q-serif', display: 'swap' })
export const sans = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--q-sans', display: 'swap' })

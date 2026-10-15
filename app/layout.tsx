import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://khumbu-lodge-checklist.sandrarobertsa810.chatgpt.site'),
 title: 'Khumbu Lodge Owners | Free Money Leak Checklist',
 description: 'Check your lodge’s billing, bookings and daily cash. Explore a free Nepali and English checklist and a 20-minute system demo with Khumbu Nuru I.T. Services.',
 openGraph: { title: 'A clearer picture of your lodge’s money.', description: 'Free Lodge Money Leak Checklist + 20-minute demo for Khumbu lodge and hotel owners.', images: [{url:'/logo.png',width:2048,height:683}],type:'website',locale:'en_US',alternateLocale:['ne_NP'] },
 twitter: {card:'summary',title:'Free Lodge Money Leak Checklist',description:'For lodge and hotel owners in Khumbu.'}
};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}

import './globals.css'
import { Nunito } from 'next/font/google'
import Navbar from './components/Navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import Model from './components/Models/Model';

export const metadata = {
  title: 'AirBnB',
  description: 'AirBnB clone',
}

const font = Nunito({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <Model title = "Login Section"isOpen/>
          <Navbar />
        </ClientOnly>
        {children}
        </body>
    </html>
  )
}

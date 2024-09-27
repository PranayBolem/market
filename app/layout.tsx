import './globals.css'
import { Nunito } from 'next/font/google'
import Navbar from './components/Navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import Model from './components/Models/Model';
import RegisterModel from './components/Models/RegisterModel';
import LoginModel from './components/Models/LoginModel';
import ToasterProvider from './Providers/ToasterProvider';
import getCurrentUser from './actions/getCurrentUser';

export const metadata = {
  title: 'HomeStays',
  description: 'AirBnB clone',
}

const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  
  return (
    <html lang="en">
      <body className={font.className}>
        <ClientOnly>
          <ToasterProvider />
          <LoginModel      />
          <RegisterModel   />
          <Navbar currentUser = {currentUser}/>
        </ClientOnly>
        {children}
        </body>
    </html>
  )
}

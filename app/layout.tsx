import './globals.css'
import { Nunito, Seaweed_Script } from 'next/font/google'
import Navbar from './components/Navbar/Navbar';
import ClientOnly from './components/ClientOnly';
import RegisterModel from './components/Models/RegisterModel';
import LoginModel from './components/Models/LoginModel';
import ToasterProvider from './Providers/ToasterProvider';
import getCurrentUser from './actions/getCurrentUser';
import HostModel from './components/Models/HostModel';
import SearchModel from './components/Models/SearchModel';

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
          <SearchModel     />
          <LoginModel      />
          <RegisterModel   />
          <HostModel       />
          <Navbar currentUser = {currentUser}/>
        </ClientOnly>
        <div className='pb-20 pt-28'>
          {children}
        </div>
        </body>
    </html>
  )
}

import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { cookies } from 'next/headers'
import { cn } from '@/lib/Utils'
import Providers from '@/components/Providers'
import Nav from '@/components/layout/nav/Nav'
import Footer from '@/components/Footer';



const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Zenpath - Automate your dispatch',
  description: 'Zenpath helps care-transit teams plan rides, coordinate staff, and track trips in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Lets the nav render on the server, so it doesn't depend on client JS or Firebase.
  const isLoggedInCookie = cookies().get('isLoggedIn')?.value === 'true'

  return (
    <html lang="en" className={cn('bg-white text-slate-900 antialiased', inter.className)} suppressHydrationWarning>
      <head>
          <link rel="shortcut icon" href="/images/LogoIcon.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/images/LogoIcon.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/images/LogoIcon.png"/>
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVz1D8a8rZKXr9_IvDlzgqZ4fArHCDQ7g&libraries=places" async/>
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(d, w, c) {
                w.SibConversationsID = '61ef062f81be215b2b056f2c';
                w[c] = w[c] || function() {
                    (w[c].q = w[c].q || []).push(arguments);
                };
                var s = d.createElement('script');
                s.async = true;
                s.src = 'https://conversations-widget.sendinblue.com/sib-conversations.js';
                if (d.head) d.head.appendChild(s);
              })(document, window, 'SibConversations');`
            }}
          ></script> */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3247642,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `
            }}
          ></script>
      </head>
      <body className="min-h-screen bg-white antialiased">
        <Providers>
          <Nav isLoggedInCookie={ isLoggedInCookie }/>
          
          {/* <div className='container max-w-7xl mx-auto h-full pt-12'> */}
            <main>{children}</main>
          {/* </div> */}
          {/* <Footer/> */}
        </Providers>

          {/* Allow for more height on mobile devices */}
        <div className='h-40 md:hidden'/>
      </body>      
    </html>
  )
}

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { NextUIProvider, Navbar, createTheme } from '@nextui-org/react'


const darkTheme = createTheme({
  type: 'dark'
});

export default function App({ Component, pageProps }: AppProps<{initialSession: Session}>) {

  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <NextUIProvider theme={darkTheme}>
        <Navbar>
          <Navbar.Content>
            <Navbar.Brand>
              Summary
            </Navbar.Brand>
          </Navbar.Content>
        </Navbar>
        <Component {...pageProps} />
      </NextUIProvider>
    </SessionContextProvider>
  )
}

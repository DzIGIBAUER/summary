import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

import { Container } from '@nextui-org/react';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';

export default function LoginPage() {
  const supabaseClient = useSupabaseClient()

  return (
    <Container xs>
      <Auth
        redirectTo="/"
        appearance={{ theme: ThemeSupa }}
        supabaseClient={supabaseClient}
        providers={['google', 'github']}
        socialLayout="vertical"
        dark={true}
      />
    </Container>
  )
}


export const getServerSideProps = async (ctx: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse; }) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx)
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session && session.user)
    return {
      redirect: {
        destination: '/',
        permanent: true
      },
    }
  
  return {
    props: {}
  }
}
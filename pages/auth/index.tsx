import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'

import { Container } from '@nextui-org/react';

const LoginPage = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [data, setData] = useState()

  useEffect(() => {
    async function loadData() {
      //const { data } = await supabaseClient.from('test').select('*')
      //setData(data)
    }
    // Only run query once user is logged in.
    if (user) loadData()
  }, [user])

  if (!user)
    return (
      <Container xs>
        <Auth
          redirectTo="/"
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={['google', 'github']}
          socialLayout="vertical"
        />
      </Container>
    )

  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>client-side data fetching with RLS</p>
    </>
  )
}

export default LoginPage
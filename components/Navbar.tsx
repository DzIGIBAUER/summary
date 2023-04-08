import { Navbar as NavbarNextUI, Button } from '@nextui-org/react'

import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function Navbar() {
    
    const user = useUser()
    const supabase = useSupabaseClient()

    return (
        <NavbarNextUI>
          <NavbarNextUI.Brand>Summary</NavbarNextUI.Brand>
          <NavbarNextUI.Content></NavbarNextUI.Content>
          <NavbarNextUI.Content>
                <NavbarNextUI.Item>
                    {user ?
                        <Button flat onPress={() => {supabase.auth.signOut()}}>Logout</Button> : 
                        <Button flat as={NavbarNextUI.Link} href="/auth">Login</Button>
                    }
            </NavbarNextUI.Item>
          </NavbarNextUI.Content>
        </NavbarNextUI>
    )
}
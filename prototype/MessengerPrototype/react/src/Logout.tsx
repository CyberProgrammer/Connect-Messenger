// Logout.tsx
import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const Login: React.FC = () => {
    const { logout } = useAuth0()

    return (
        <div>
            <h1>Logout Page</h1>
            <p>Log out to access the application.</p>
            <button onClick={() => logout()}>Log Out</button>
        </div>
    )
}

export default Login

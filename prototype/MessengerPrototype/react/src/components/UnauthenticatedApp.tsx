import React, {useEffect} from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import './UnauthenticatedApp.css'
import Logo from '../assets/Logo.png'
import {Simulate} from "react-dom/test-utils";
import timeUpdate = Simulate.timeUpdate;
const Login: React.FC = () => {
    const {isAuthenticated, error, loginWithRedirect} = useAuth0()

    // Redirect the user if they are already authenticated
    useEffect(() => {
        // BYPASSING AUTHENTICATION FOR PROTOTYPE, replace bypass with isAuthenticated
        const bypass : boolean = true
        if (bypass) {
            // You can redirect to the home page or another protected route
            window.location.href = '/home'
        }
    }, [isAuthenticated])
    
    // Handle authentication errors
    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <>
            <div id="welcome">
                <img className={"logo"} src={Logo} alt={"logo"}/>
                <h2 className="title">Unlock new connections</h2>
                <div className={'button'}>
                    <button className={"buttonPrimary"} onClick={() => loginWithRedirect()}>Log In</button>
                </div>
            </div>
        </>
    )
}

export default Login

import React from "react"
import { Link } from "react-router-dom"

import './NavigationBar.css'

import Logo from "../../assets/Logo-nav.png"
import LogoutButton from "../../components/Session/LogoutButton.tsx"

interface NavigationBarProps {
    selectedLink: string
}
const NavigationBar: React.FC<NavigationBarProps> = ({ selectedLink }) => {
    return(
        <div className={"nav"}>
            <div className={"logo"}>
                <img src={Logo} alt={"Logo"} />
            </div>
            <div className={"view-controls"}>
                <Link to="/home" className={selectedLink === "chats" ? "selected" : ""}>Chats</Link>
                <Link to="/groups" className={selectedLink === "groups" ? "selected" : ""}>Groups</Link>
            </div>
            <div className={'logout'}>
                <LogoutButton></LogoutButton>
            </div>
        </div>
    )
}

export default NavigationBar
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { Auth0Provider } from '@auth0/auth0-react'  // Import Auth0Provider
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Auth0Provider
        domain="#" // Auth0 Application Domain
        clientId="#" // Auth0 Application ClientID
        authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://domain/api/v2/", // Replace domain with app domain
            scope: "openid profile email read:current_user"
        }}
    >
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Auth0Provider>,
)


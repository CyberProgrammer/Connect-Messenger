import { useState, useEffect } from 'react'

const useWebSocket = (): WebSocket | null => {
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        // Create websocket on url
        const newSocket = new WebSocket('ws://localhost:3000')

        newSocket.onopen = () => {
            console.log('WebSocket connection opened')
        }

        newSocket.onmessage = (event: MessageEvent) => {
            console.log('WebSocket message received:', event.data)
            // Handle incoming messages from the server
        }

        newSocket.onclose = () => {
            console.log('WebSocket connection closed')
        }

        setSocket(newSocket)

        return () => {
            newSocket.close()
        }
    }, [])

    return socket
}

export default useWebSocket




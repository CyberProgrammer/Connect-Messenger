import {Routes, Route} from "react-router-dom"
import useWebSocket from "./utils/WebSocketConnection.ts"
import Home from "./views/Home/Home.tsx"
import Groups from "./views/Groups/Groups.tsx"
import {useEffect, useState} from "react"
import {ChatEntry, GroupEntry, Message, User, GroupParticipantEntry} from "@/shared/types.ts"
import UnauthenticatedApp from "./components/UnauthenticatedApp.tsx"
import Logout from "./Logout.tsx"
import {useAuth0} from "@auth0/auth0-react"

function App() {
    const socket = useWebSocket()
    const [userLog, setUserLog] = useState<User[]>([
        {
            userID: "1",
            firstName: "John",
            lastName: "Doe",
            username: "johndoe123",
        },
        {
            userID: "2",
            firstName: "Billy",
            lastName: "Bob",
            username: "billybob",
        },
        {
            userID: "3",
            firstName: "Patricia",
            lastName: "Heather",
            username: "patricia1",
        }
    ])
    const [chatLog, setChatLog] = useState<ChatEntry[]>([
        {
            chatID: 0,
            creatorID: "1",
            participantID: "2",
            groupID: null,
            isGroupChat: false,
            userSentLastMessage: false
        },
        {
            chatID: 1,
            creatorID: "1",
            participantID: null,
            groupID: 1,
            isGroupChat: true,
            userSentLastMessage: false
        }
    ])
    const [groupParticipantsLog, setGroupParticipantsLog] = useState<GroupParticipantEntry[]>([
        {
            groupID: 1,
            userID: "1"
        },
        {
            groupID: 1,
            userID: "2"
        },
        {
            groupID: 1,
            userID: "3"
        }
    ])
    const [groupLog, setGroupLog] = useState<GroupEntry[]>([
        {
            groupID: 1,
            groupCreator: "1",
            groupName: "Test Group"
        },
    ])
    const [messagesLog, setMessagesLog] = useState<Message[]>([
        {
            messageID: 0,
            chatID: 0,
            senderID: "1",
            content: "Welcome to the app!",
            timestamp: "2024-03-03 13:56:19"
        },
        {
            messageID: 1,
            chatID: 0,
            senderID: "2",
            content: "Thanks for the invite John",
            timestamp: "2024-03-03 14:05:10"
        },
        {
            messageID: 2,
            chatID: 0,
            senderID: "1",
            content: "No problem!",
            timestamp: "2024-03-03 14:52:33"
        },
        {
            messageID: 3,
            chatID: 1,
            senderID: "1",
            content: "This is a test group.",
            timestamp: "2024-03-03 14:52:33"
        },
        {
            messageID: 4,
            chatID: 1,
            senderID: "2",
            content: "Hey all!",
            timestamp: "2024-03-04 12:52:33"
        },
        {
            messageID: 5,
            chatID: 1,
            senderID: "3",
            content: "Did you see the recent news?",
            timestamp: "2024-03-04 12:54:33"
        },
    ])
    const [sortedMessageLog, setSortedMessageLog] = useState<ChatEntry[]>([])

    const [appUser, setAppUser] = useState({
        userID: "1",
        firstName: "John",
        lastName: "Doe",
        username: "johndoe123",
    })

    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()

    useEffect(() => {
        const getUserMetadataAndCheckUserExistence = async () => {
            if (!isAuthenticated || isLoading || !user) {
                return
            }

            const domain = "#" // Replace with Auth0 domain name

            try {
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: `https://${domain}/api/v2/`,
                        scope: "read:users",
                    },
                })

                const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`

                const metadataResponse = await fetch(userDetailsByIdUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })

                const { user_metadata } = await metadataResponse.json()
                const { given_name, family_name } = user_metadata

                const doesUserExist = userLog && userLog.length > 0 && userLog.find((entry) => entry && entry.userID === user?.sub)

                if (!doesUserExist) {
                    console.log("User does not exist in db yet")

                    const newUser = {
                        userID: user.sub!,
                        firstName: given_name,
                        lastName: family_name,
                        username: user.nickname!,
                    }

                    console.log("New user: ", newUser)
                    setAppUser(newUser)

                    const newUserMessage = {
                        type: 'createNewUser',
                        data: {
                            newUser: newUser,
                        },
                    }


                    if (socket && socket.readyState === WebSocket.OPEN) {
                        socket?.send(JSON.stringify(newUserMessage))
                    } else {
                        console.log("Socket could not be found")
                    }

                } else {
                    const existingUser = userLog.find((entry) => entry && entry.userID === user?.sub)
                    const existingUserMessage = {
                        type: 'existingUser',
                        data: {
                            existingUser: existingUser,
                        },
                    }

                    if (socket && socket.readyState === WebSocket.OPEN) {
                        socket?.send(JSON.stringify(existingUserMessage))
                        setAppUser(existingUser!)
                    } else {
                        console.log("Socket could not be found")
                    }

                }
            } catch (error) {
                console.error("Error fetching user metadata: ", error)
            }
        }

        if (isAuthenticated) {
            getUserMetadataAndCheckUserExistence().then(r => {
                console.log("Promise resolved:", r)
            }).catch(error => {
                console.error("Error in getUserMetadataAndCheckUserExistence: ", error)
            })
        }
    }, [isAuthenticated])

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)

                //console.log("Data type: ", data.type)
                switch (data.type) {
                    case 'appUser':
                        console.log("Socket: fetched app user")
                        break
                    case 'initialUserLog':
                        console.log("Socket: fetched initial user log")
                        setUserLog(data.data)
                        break
                    case 'initialChatEntryLog':
                        console.log("Socket: fetched initial chatEntry log")
                        setChatLog(data.data)
                        break
                    case 'initialGroupParticipantsLog':
                        console.log("Socket: fetched initial group participants log")
                        setGroupParticipantsLog(data.data)
                        break
                    case 'initialGroupLog':
                        console.log("Socket: fetched initial group log")
                        setGroupLog(data.data)
                        break
                    case 'initialMessagesLog':
                        console.log("Socket: fetched initial user messages log")
                        setMessagesLog(data.data)
                        break
                    case 'updateUserLog':
                        console.log("Socket: updated user log")
                        setUserLog(data.data)
                        break
                    case 'updateMessageLog':
                        console.log("Socket: update chatEntry log")
                        if (data.data) {
                            setChatLog((prevMessageLog) => [...prevMessageLog, data.data])
                        } else {
                            console.error("Received null or undefined data for updateMessageLog")
                        }
                        break
                    case 'updateMessagesLog':
                        if (data) {
                            setMessagesLog((prevMessagesLog) => [...prevMessagesLog, data.data])
                        } else {
                            console.error("Received null or undefined data for updateMessagesLog")
                        }
                        break
                    case 'updateGroupLog':
                        if(data){
                            setGroupLog((prevGroupLog) => [...prevGroupLog, data.data])
                        }else{
                            console.error("Received null or undefined data for updateGroupLog")
                        }
                        break
                    case 'updateGroupParticipants':
                        if(data){
                            setGroupParticipantsLog((prevGroupParticipantsLog) => [...prevGroupParticipantsLog, data.data])
                        }else{
                            console.error("Received null or undefined data for updateGroupParticipants")
                        }
                        break
                    default:
                        break
                }
            }
        }
    }, [socket])

    const [sortOrder, setSortOrder] = useState<string>("Newest")

    useEffect(() => {
        if (chatLog.length > 0) {
            // Reverse the chatLog and set it as the sortedMessageLog
            setSortedMessageLog([...chatLog].reverse())
        }
    }, [chatLog])

    useEffect(() => {
        const flipLogOrder = () => {
            setSortedMessageLog(prevMessageLog => [...prevMessageLog].reverse())
        }

        flipLogOrder()
    }, [sortOrder])

    return (
        <div className={"App"}>
            <Routes>
                {
                    /*
                    BYPASSING AUTHENTICATION FOR PROTOTYPE, REAL APP WILL ACTUALLY AUTHENTICATE
                     */
                }
                <Route path="/" element={<UnauthenticatedApp/>}/>
                <Route path="/logout" element={<Logout/>}/>
                <Route
                    path="/home"
                    element={
                        <Home
                            socket={socket}
                            appUser={appUser}
                            groupLog={groupLog}
                            userLog={userLog}
                            groupParticipantsLog={groupParticipantsLog}
                            chatLog={sortedMessageLog}
                            setChatLog={setChatLog}
                            messagesLog={messagesLog}
                            setMessagesLog={setMessagesLog}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                        />
                    }
                />
                <Route
                    path="/groups"
                    element={
                        <Groups
                            socket={socket}
                            appUser={appUser}
                            groupLog={groupLog}
                            userLog={userLog}
                            setUserLog={setUserLog}
                            setGroupLog={setGroupLog}
                            groupParticipantsLog={groupParticipantsLog}
                            setGroupParticipantsLog={setGroupParticipantsLog}
                        />
                    }
                />
            </Routes>
        </div>
    )
}

export default App
// Home.tsx
import React, {useState} from "react"
import NavigationBar from "../../components/Navigation/NavigationBar.tsx"
import FilterMenu from "../../components/Menus/FilterMenu.tsx"
import MessagePreview from "../../components/MessagePreview.tsx"
import CreateChat from "../../components/Forms/CreateChat.tsx"
import ChatHistory from "../../components/ChatHistory.tsx"
import Filter from "../../assets/filter.svg"
import Add from "../../assets/add.svg"
import Search from "../../assets/search.svg"
import Clear from "../../assets/clear.svg"
import './Home.css'

import {ChatEntry, GroupEntry, Message, User, GroupParticipantEntry} from '@/shared/types.ts'

/* BYPASSING AUTHENTICATION FOR PROTOTYPE
import {withAuthenticationRequired } from '@auth0/auth0-react'
import UnauthenticatedApp from "../../components/UnauthenticatedApp.tsx"
*/
interface HomeProps {
    socket: WebSocket | null
    appUser: User
    groupLog: GroupEntry[]
    userLog: User[]
    groupParticipantsLog: GroupParticipantEntry[]
    messagesLog: Message[]
    setMessagesLog: React.Dispatch<React.SetStateAction<Message[]>>
    chatLog: ChatEntry[]
    setChatLog: React.Dispatch<React.SetStateAction<ChatEntry[]>>
    sortOrder: string
    setSortOrder: React.Dispatch<React.SetStateAction<string>>
}

const Home: React.FC<HomeProps> = (
    {
        socket,
        appUser,
        groupLog,
        userLog,
        groupParticipantsLog,
        chatLog,
        setChatLog,
        messagesLog,
        setMessagesLog,
        sortOrder,
        setSortOrder
    }) => {

    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
    const [isChatHistoryExpanded, setChatHistoryExpanded] = useState(false)
    const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null)
    const [createChat, setCreateChat] = useState(false)
    const [newMessage, setNewMessage] = useState("Type here...")
    const [searchQuery, setSearchQuery] = useState("")

    /* Sort message preview */
    // Find any group that the user is apart of
    const userChatGroups: GroupParticipantEntry[] = groupParticipantsLog.filter((group) => group.userID === appUser?.userID)
    const groupIDs = userChatGroups.map((group) => group.groupID)

    // Look for any chat the user is a creator or participant in as well as any chatEntry that matches the groupID's
    const filteredMessageLog = chatLog.filter((messageGroup) => {
        return (
            messageGroup.creatorID === appUser?.userID ||
            messageGroup.participantID === appUser?.userID ||
            (messageGroup.isGroupChat && groupIDs.includes(messageGroup.groupID!))
        )
    })

    //console.log("Home: filteredMessageLog", filteredMessageLog)

    const renderedMessageLog = searchQuery !== ""
        ? filteredMessageLog.filter((messageGroup) => {
            // Your logic to filter based on username, first name, or last name
            const lowerCaseSearchQuery = searchQuery.toLowerCase()

            if (messageGroup.isGroupChat && messageGroup.groupID) {
                // For group chats, filter based on groupId to find the group name
                const groupInfo = groupLog.find((group) => group.groupID === messageGroup.groupID)
                return groupInfo?.groupName?.toLowerCase().includes(lowerCaseSearchQuery)
            } else {
                // For one-on-one chats, find usernames based on creatorID and participantID
                const creator = userLog.find((user) => user.userID === messageGroup.creatorID)
                const participant = userLog.find((user) => user.userID === messageGroup.participantID)

                const participantNames = [creator, participant]
                    .filter(user => user)
                    .map(user => user ? user.username.toLowerCase() : "Unknown user")

                return participantNames.some((name) => name.includes(lowerCaseSearchQuery))
            }
        })
        : filteredMessageLog

    const handleFilterMenuToggle = () => {
        setIsFilterMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen)
    }

    const handleMessagePreviewClick = (index: number) => {
        setCreateChat(false)
        setChatHistoryExpanded(true)
        setSelectedMessageIndex(index)
    }

    const handleCreateChat = () => {
        setSelectedMessageIndex(null)
        setCreateChat(true)
        setChatHistoryExpanded(true)
    }

    const handleCreateChatEntry = (chatID: number) => {
        let index = chatLog.findIndex(chatEntry => chatEntry.chatID === chatID)
        if(index == -1){
            if(sortOrder === "Newest")
                index = 0
            else
                index = chatLog.length
        }
        setCreateChat(false)
        setChatHistoryExpanded(true)
        setSelectedMessageIndex(index)
    }

    const handleClearClick = () =>{
        setSearchQuery("")
    }

    return (
        <div className={"home"}>
            <NavigationBar selectedLink="chats"></NavigationBar>
            <div className={"content"}>
                <div className={"message-list"}>
                    <div className={"menu"}>
                        <button className={"new-chat buttonWhite"}>
                            <img
                                src={Add}
                                alt={"Create Task"}
                                className={"add"}
                                onClick={handleCreateChat}
                            />
                        </button>
                        <button className={"filter-btn buttonWhite"}>
                            <img
                                src={Filter}
                                alt={"Filter"}
                                className={"filter"}
                                onClick={handleFilterMenuToggle}
                            />
                        </button>

                        {isFilterMenuOpen && (
                            <FilterMenu
                                sortOrder={sortOrder}
                                setSortOrder={setSortOrder}
                            />
                        )}
                    </div>
                    <div className={"message-search"}>
                        <img className={"search-icon"} src={Search} alt={"Search"} />
                        <input
                            type="text"
                            placeholder="Search for user or group name..."
                            name="messageSearch"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={chatLog.length > 0 ? "" : "disabled-search"}
                            disabled={chatLog.length === 0}
                        />
                        {searchQuery != "" ?
                            <button className={"clear-button"} onClick={handleClearClick}><img src={Clear} alt={"Clear"}/></button>
                            :
                            null
                        }
                    </div>
                    <div className={"messages"}>
                    {/* Render message previews for each message group */}

                        {renderedMessageLog && renderedMessageLog.length > 0 ? (
                            renderedMessageLog.map((messageGroup, index) => {
                                return (
                                    <MessagePreview
                                        key={index}
                                        isSelected={index === selectedMessageIndex}
                                        onClick={() => handleMessagePreviewClick(index)}
                                        messageGroup={messageGroup}
                                        appUser={appUser}
                                        isGroupChat={messageGroup.isGroupChat}
                                        groupName={
                                            messageGroup.groupID
                                                ? groupLog.find((group) => group.groupID === messageGroup.groupID)?.groupName ?? ''
                                                : ''
                                        }
                                        participantID={messageGroup.participantID}
                                        userLog={userLog}
                                        messagesLog={messagesLog}
                                    />
                                )
                            })) : (
                            searchQuery ? (
                                <div className={`message-preview`}>
                                    <div className={"preview"}>
                                        <h5>No matching chats</h5>
                                        <h6>Try a different search query or create a new chat.</h6>
                                    </div>
                                </div>
                            ) : (
                                <div className={`message-preview`}>
                                    <div className={"preview"}>
                                        <h5>No chats</h5>
                                        <h6>Create a new chat to get started</h6>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <div className={`message-view ${isChatHistoryExpanded ? 'message-view-expanded' : ''}`}>
                    {selectedMessageIndex !== null && (
                        <ChatHistory
                            socket={socket}
                            chatLog={renderedMessageLog}
                            groupLog={groupLog}
                            userLog={userLog}
                            messagesLog={messagesLog}
                            setMessagesLog={setMessagesLog}
                            selectedMessageIndex={selectedMessageIndex}
                            isChatHistoryExpanded={isChatHistoryExpanded}
                            appUser={appUser}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                        />
                    )}

                    {createChat && selectedMessageIndex === null && (
                        <CreateChat
                            socket={socket}
                            onCreateChatEntry={handleCreateChatEntry}
                            userLog={userLog}
                            groupLog={groupLog}
                            appUser={appUser}
                            chatLog={chatLog}
                            setChatLog={setChatLog}
                            messagesLog={messagesLog}
                            setMessagesLog={setMessagesLog}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
/* BYPASSING AUTHENTICATION FOR PROTOTYPE
export default withAuthenticationRequired(Home, {
    onRedirecting: () => <UnauthenticatedApp />,
})
*/

export default Home

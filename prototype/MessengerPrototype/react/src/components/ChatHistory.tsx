import React, {useEffect, useRef} from "react"

import sendIcon from '../assets/send.svg'

import './ChatHistory.css'
import {ChatEntry, GroupEntry, Message, User, UserLog} from '@/shared/types.ts'
import getCurrentTime from "../shared/getCurrentTime.ts";

interface ChatHistoryProps {
    socket: WebSocket | null
    chatLog: ChatEntry[]
    userLog: UserLog[]
    groupLog: GroupEntry[]
    messagesLog: Message[]
    setMessagesLog: React.Dispatch<React.SetStateAction<Message[]>>
    selectedMessageIndex: number | null
    isChatHistoryExpanded: boolean
    appUser: User
    newMessage: string
    setNewMessage: React.Dispatch<React.SetStateAction<string>>
}

const ChatHistory : React.FC<ChatHistoryProps> = ({socket, chatLog, userLog, groupLog,messagesLog, setMessagesLog, selectedMessageIndex, isChatHistoryExpanded, appUser, newMessage, setNewMessage}) =>{
    //console.log("Selected message index: ", selectedMessageIndex)
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom when the component mounts or when the chat history changes
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [chatLog, selectedMessageIndex]);

    if (selectedMessageIndex === null || !chatLog[selectedMessageIndex]) {
        return null
    }

    const filteredMessagesLog = messagesLog.filter((entry) => entry.chatID === chatLog[selectedMessageIndex].chatID)

    const handleSendMessage = () => {
        // Get time and format to standard YYYY-MM-DD HH:mm:ss
        const currentTime = getCurrentTime

        const newMessageEntry = {
            messageID: messagesLog.length,
            chatID: chatLog[selectedMessageIndex].chatID,
            content: newMessage,
            senderID: appUser.userID,
            timestamp: currentTime,
        }

        const newUserMessage = {
            type: 'createNewMessage',
            data: {
                userMessage: newMessageEntry,
            },
        }

        if(socket){
            console.log("Existing chat entry: Sending new message to socket")
            socket.send(JSON.stringify(newUserMessage))
        }

        setMessagesLog(prevLog => [...prevLog, newMessageEntry])
        setNewMessage("")
    }

    const getUserByName = (id: string) => {
        const user = userLog.find((user) => user.userID === id)
        return user ? `${user.firstName} ${user.lastName} (${user.username})` : "Unknown User"
    }

    const getGroupName = (groupId: number) => {
        const group = groupLog.find((group) => group.groupID === groupId)
        return group ? group.groupName : "Unknown Group"
    }

    return (
        <div>
            <div className={`chat-name ${isChatHistoryExpanded ? 'chat-name-expanded' : ''}`}>
                <h3>
                    {chatLog[selectedMessageIndex].isGroupChat
                        ? chatLog[selectedMessageIndex].groupID
                            ? getGroupName(chatLog[selectedMessageIndex].groupID!)
                            : "Unknown Group"
                        : chatLog[selectedMessageIndex].participantID != ''
                            ? chatLog[selectedMessageIndex].participantID == appUser.userID ?
                                getUserByName(chatLog[selectedMessageIndex].creatorID) :
                                getUserByName(chatLog[selectedMessageIndex].participantID!)
                            : "Unknown User"
                    }
                </h3>

            </div>
            <div ref={chatHistoryRef} className={"chat-history primaryScroll"}>
                <div className={"chats"}>
                    {filteredMessagesLog.map((message, index) => (
                        <div key={index}
                             className={`message-container ${index === 0 ? 'first-message' : ''} ${index === filteredMessagesLog.length - 1 ? 'last-message' : ''}`}>
                            <div className={`${message.senderID === appUser.userID ? 'app-user-message' : 'other-user-message'}`}>
                                <div className="message-details">
                                    <h6>{getUserByName(message.senderID)}</h6>
                                    <p>{new Date(message.timestamp).toLocaleString()}</p>
                                </div>
                                <br/>
                                <p>{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={`send-message-container ${isChatHistoryExpanded ? 'send-message-container-expanded' : ''}`}>
                    <textarea
                        id="autoresizing"
                        className={"send-message-input primaryScroll"}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type here..."
                    />
                    <button id={"sendBtn"} className={"buttonWhite"} onClick={handleSendMessage}>
                        <img src={sendIcon} alt={"Send"} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatHistory
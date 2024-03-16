import React from "react"
import './MessagePreview.css'
import {ChatEntry, Message, User} from "@/shared/types.ts"

interface MessagePreviewProps {
    isSelected: boolean
    onClick: () => void
    messageGroup: ChatEntry
    appUser: User
    isGroupChat: boolean
    groupName: string | null
    participantID: string | null
    userLog: User[]
    messagesLog: Message[]
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ isSelected, onClick, messageGroup, appUser, isGroupChat, groupName, participantID, userLog, messagesLog }) => {
    // For testing next feature
    //const isRead = [true, false, true, true];

    const chatID = messageGroup.chatID
    const filteredMessagesLog = messagesLog.filter((entry) => entry.chatID === chatID)

    let preview = ""

    if (filteredMessagesLog.length > 0) {
        if (filteredMessagesLog[filteredMessagesLog.length - 1].senderID === appUser.userID) {
            preview = "You: " + filteredMessagesLog[filteredMessagesLog.length - 1].content.slice(0, 25)
        } else {
            preview = filteredMessagesLog[filteredMessagesLog.length - 1].content.slice(0, 30)
        }
    } else {
        preview = "No messages"
    }

    const getChatPartnerName = (): string => {
        if (!isGroupChat) {
            // If the current user is the creator , get the creatorID
            if(participantID && appUser.userID === participantID){
                const chatPartner = userLog.find((user) => user.userID === messageGroup.creatorID)
                return chatPartner ? `${chatPartner.firstName} ${chatPartner.lastName}` : "Unknown User"
            } else{
                const chatPartner = userLog.find((user) => user.userID === participantID)
                return chatPartner ? `${chatPartner.firstName} ${chatPartner.lastName}` : "Unknown User"
            }
        }

        return ""
    }

    return (
        <div className={`message-preview ${isSelected ? 'selected' : ''}`} onClick={onClick}>
            <div className={"preview"}>
                <div id={"header"}>
                    <h5>
                        {isGroupChat ? groupName : getChatPartnerName()}
                    </h5>

                    {
                        /*
                        !isRead[chatID] ?
                        <img className={"unread"} src={Dot} alt={"Dot"}/>
                        :
                        null
                        */
                    }
                </div>
                <div id={"text"}>
                    <h6>{preview}</h6>
                </div>
            </div>
        </div>
    )
}

export default MessagePreview



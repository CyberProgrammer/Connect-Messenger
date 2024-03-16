// CreateChat.tsx
import React, {useEffect, useState} from "react"
import {ChatEntry, CreateChatProps, GroupEntry, User} from '@/shared/types.ts'
import './CreateChat.css'
import RecipientInput from "../../shared/RecipientInput.tsx"
import getCurrentTime from "../../shared/getCurrentTime.ts";

const CreateChat: React.FC<CreateChatProps> = (
    {
        socket,
        onCreateChatEntry,
        userLog,
        appUser,
        chatLog,
        setChatLog,
        groupLog,
        messagesLog,
        setMessagesLog
    }: CreateChatProps) => {
    const [recipient, setRecipient] = useState("")
    const [selectedGroupID, setSelectedGroupID] = useState(-1)
    const [messageContent, setMessageContent] = useState("")
    const [matchingUsers, setMatchingUsers] = useState<User[]>([])
    const [matchingGroups, setMatchingGroups] = useState<GroupEntry[]>([])

    const [newChatID, setNewChatID] = useState<number>(chatLog.length+1)
    const [existingChatID, setExistingChatID] = useState<number>(-1)
    const [createdNewChat, setCreatedNewChat] = useState<boolean>(false)
    const appUserID = appUser.userID

    useEffect(() => {
        if(newChatID != chatLog.length){
            setNewChatID(chatLog.length)
        }
        console.table(chatLog)
    }, [chatLog, newChatID])
    const existingChat = (existingChatEntry:ChatEntry|undefined, currentTime:string) =>{
        if (existingChatEntry) {
            const existingID = existingChatEntry.chatID
            setExistingChatID(existingID)

            const newMessage = {
                messageID: messagesLog.length,
                chatID: existingID,
                content: messageContent,
                senderID: appUserID,
                timestamp: currentTime,
            }

            console.log("New message:", newMessage)
            console.log("Chats:", chatLog)
            const newUserMessage = {
                type: 'createNewMessage',
                data: {
                    userMessage: newMessage,
                },
            }

            if(socket){
                console.log("Existing chat entry: Sending new message to socket")
                socket.send(JSON.stringify(newUserMessage))
            }

            // ONLY FOR PROTOTYPE
            setMessagesLog(prevLog => [...prevLog, newMessage])

            setCreatedNewChat(true)
        } else {
            console.error("Existing chat entry not found.")
        }
    }
    const submitIndividualChat = (doesChatAlreadyExist:boolean, recipientUserID:string, currentTime:string) =>{
        console.log("Does chat already exist? : ", doesChatAlreadyExist)
        console.log("newChatID: ", newChatID)
        if(doesChatAlreadyExist){
            const existingChatEntry = chatLog.find((entry) => {
                return (entry.creatorID === appUserID && entry.participantID === recipientUserID )||
                    (entry.creatorID === recipientUserID && entry.participantID  === appUserID)
            })

            existingChat(existingChatEntry, currentTime)
        }else{
            //console.log("Creating new chat entry & creating user message")
            const newChatEntry = {
                chatID: newChatID,
                creatorID: appUserID,
                participantID: `${recipientUserID}`,
                groupID: null,
                isGroupChat: false,
                userSentLastMessage: true
            }

            console.log("User log length: ", messagesLog.length)
            const newMessage = {
                messageID: messagesLog.length+1,
                chatID: newChatID,
                content: messageContent,
                senderID: appUserID,
                timestamp: currentTime
            }

            // Send to socket
            const newChatMessage = {
                type: 'createNewChat',
                data: {
                    chatEntry: newChatEntry,
                    userMessage: newMessage,
                },
            }

            if(socket){
                console.log("New chat entry and message: Sending to socket")
                socket.send(JSON.stringify(newChatMessage))
            }

            // ONLY FOR PROTOTYPE
            setChatLog(prevLog => [...prevLog, newChatEntry])
            setMessagesLog(prevLog => [...prevLog, newMessage])

            setCreatedNewChat(true)
        }
    }

    const submitGroupChat = (doesChatAlreadyExist:boolean, recipientGroup:GroupEntry | undefined, currentTime:string) =>{
        console.log("Does group chat  already exist? : ", doesChatAlreadyExist)
        if(doesChatAlreadyExist) {
            const existingChatEntry = chatLog.find((entry) => {
                return (entry.groupID === recipientGroup?.groupID)
            })

            existingChat(existingChatEntry, currentTime)
        } else{
            const newChatEntry = {
                chatID: newChatID,
                creatorID: appUserID,
                isGroupChat: true,
                groupID: recipientGroup?.groupID,
                participantID: null,
                userSentLastMessage: true
            }

            const newMessage = {
                messageID: messagesLog.length+1,
                chatID: newChatID,
                content: messageContent,
                senderID: appUserID,
                timestamp: currentTime
            }

            // Send to socket
            const newChatMessage = {
                type: 'createNewChat',
                data: {
                    chatEntry: newChatEntry,
                    userMessage: newMessage,
                },
            }

            if(socket){
                console.log("New chat entry and message: Sending to socket")
                socket.send(JSON.stringify(newChatMessage))
            }

            setCreatedNewChat(true)
        }
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Get time and format to standard YYYY-MM-DD HH:mm:ss
        const currentTime = getCurrentTime
        console.log("Recipient: ", recipient)

        let isClickableUser
        let isClickableGroup
        let isGroup = false

        if(selectedGroupID === -1){
            // Validate input to verify that input is a valid user
            isClickableUser = userLog.some(user => user.username.toLowerCase() === recipient.toLowerCase())
        }
        else{
            // The recipient for a group is the groupID in string format, so I must check that the group creator for that group is the current user since only a creator can initiate a chat.
            isClickableGroup = groupLog.some(group => group.groupID === selectedGroupID)
            if(isClickableGroup)
                isGroup = true
            else{
                console.error("The group that was selected is not found!")
                return
            }
        }

        if (!isClickableUser && !isClickableGroup) {
            console.error("Invalid recipient or group. Please select a user or group from the list.")
            return
        }

        let doesChatAlreadyExist : boolean

        if(isGroup){
            const recipientGroup = groupLog.find(group => group.groupID === selectedGroupID)
            doesChatAlreadyExist = chatLog.some(chat => chat.groupID === recipientGroup?.groupID)

            submitGroupChat(doesChatAlreadyExist, recipientGroup, currentTime)
            setSelectedGroupID(-1);
        } else{
            const recipientUser: User | undefined = userLog.find(user => user.username.toLowerCase() === recipient.toLowerCase())

            if (!recipientUser) {
                console.error("Recipient not found in userLog")
                return
            }

            const recipientUserID: string = recipientUser.userID

            // Check to make sure a chat doesn't already exist between the user and the recipient
            doesChatAlreadyExist = chatLog.some(
                (chat) =>
                    !chat.isGroupChat && (
                        (chat.creatorID === appUserID && chat.participantID === recipientUserID) ||
                        (chat.creatorID === recipientUserID && chat.participantID === appUserID))
            )

            submitIndividualChat(doesChatAlreadyExist, recipientUserID, currentTime)
        }
    }

    useEffect(() => {
        if(createdNewChat && existingChatID === -1){
            onCreateChatEntry(newChatID)
        }else if(existingChatID != -1){
            onCreateChatEntry(existingChatID)
        }
    }, [createdNewChat])

    const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase()

        if (searchValue === '*') {
            // Show all users and groups when searchValue is '*'
            setMatchingUsers(userLog.filter(user => user.userID !== appUser.userID))
            setMatchingGroups(groupLog)
        } else if(searchValue !== '') {
            setRecipient(e.target.value)

            // Filter users based on the search value
            const filteredUsers = userLog.filter(user =>
                (user.username.toLowerCase().includes(searchValue) ||
                user.firstName.toLowerCase().includes(searchValue) ||
                user.lastName.toLowerCase().includes(searchValue) ) &&
                user.userID !== appUser.userID
            )

            const filteredGroups = groupLog.filter(group =>
                group.groupName.toLowerCase().includes(searchValue)
            )

            setMatchingUsers(filteredUsers)
            setMatchingGroups(filteredGroups)
        }
        else{
            setRecipient("")
            setSelectedGroupID(-1)
            setMatchingUsers([])
            setMatchingGroups([])
        }
    }

    const handleUserClick = (selectedUser: User) => {
        // Append the selected user to the input
        setRecipient(selectedUser.username)
        setSelectedGroupID(-1)
        // Clear the matching lists
        setMatchingUsers([])
        setMatchingGroups([])
    }

    const handleGroupClick = (selectedGroup: GroupEntry) => {
        setRecipient(selectedGroup.groupName)
        setSelectedGroupID(selectedGroup.groupID)
        setMatchingUsers([])
        setMatchingGroups([])
    }

    return (
        <div className={"create-chat"}>
            <div className={"title"}>
                <h3>Create New Chat</h3>
            </div>
            <div className={"form"}>
                <form onSubmit={handleFormSubmit}>
                    <label><h4>To:</h4></label>
                    <RecipientInput
                        recipient={recipient}
                        matchingUsers={matchingUsers}
                        matchingGroups={matchingGroups}
                        handleRecipientChange={handleRecipientChange}
                        handleUserClick={handleUserClick}
                        handleGroupClick={handleGroupClick}
                        isCreateGroup={false}
                    />
                    {/* Display matching users */}
                    <label><h4>Message:</h4></label>
                    <textarea
                        className={"message-input"}
                        placeholder={"Type here..."}
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <button className={"buttonAlternate"} type="submit">Start chat</button>
                </form>
            </div>
        </div>
    )
}

export default CreateChat


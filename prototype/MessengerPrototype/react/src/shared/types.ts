import React from "react"

interface Message {
    messageID: number
    chatID: number
    content: string
    senderID: string
    timestamp: string
}

interface ChatEntry {
    chatID: number
    creatorID: string
    participantID: string | null
    groupID: number | null
    isGroupChat: boolean
    userSentLastMessage: boolean
}

interface CreateGroupProps {
    socket: WebSocket | null
    groupLog: GroupEntry[]
    setGroupLog: React.Dispatch<React.SetStateAction<GroupEntry[]>>
    groupParticipantsLog: GroupParticipantEntry[]
    setGroupParticipantsLog: React.Dispatch<React.SetStateAction<GroupParticipantEntry[]>>
    userLog: User[]
    appUser: User
    setUserLog: React.Dispatch<React.SetStateAction<User[]>>
    handleOptionClick: (option: string) => void
}

interface CreateChatProps {
    socket: WebSocket | null
    onCreateChatEntry: (chatID: number) => void,
    userLog: User[],
    groupLog: GroupEntry[],
    appUser: User,
    chatLog: ChatEntry[],
    setChatLog: React.Dispatch<React.SetStateAction<ChatEntry[]>>
    messagesLog: Message[],
    setMessagesLog: React.Dispatch<React.SetStateAction<Message[]>>
}

interface EditGroupProps {
    groupLog: GroupEntry[]
    setGroupLog: React.Dispatch<React.SetStateAction<GroupEntry[]>>
    groupParticipantsLog: GroupParticipantEntry[]
    setGroupParticipantsLog: React.Dispatch<React.SetStateAction<GroupParticipantEntry[]>>
    userLog: User[]
    appUser: User
    handleOptionClick: (option: string) => void
}

interface User {
    userID: string
    firstName: string
    lastName: string
    username: string
}

interface UserLog {
    userID: string
    firstName: string
    lastName: string
    username: string
}

interface GroupEntry {
    groupID: number
    groupCreator: string
    groupName: string
}

interface GroupParticipantEntry {
    userID: string
    groupID: number
}


export type {
    CreateChatProps,
    ChatEntry,
    Message,
    User,
    UserLog,
    GroupEntry,
    GroupParticipantEntry,
    CreateGroupProps,
    EditGroupProps
}

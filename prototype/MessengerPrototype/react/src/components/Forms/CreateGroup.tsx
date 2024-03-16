import React, {ChangeEvent, useState} from "react"
import {CreateGroupProps, GroupEntry, User, GroupParticipantEntry} from "@/shared/types.ts"
import RecipientInput from "../../shared/RecipientInput.tsx"

import './CreateGroup.css'

const CreateGroup : React.FC<CreateGroupProps> = (props) => {
    const socket = props.socket
    const [groupName, setGroupName] = useState("")
    const [invitedUsers, setInvitedUsers] = useState<string>("")
    const [recipient, setRecipient] = useState("")
    const [matchingUsers, setMatchingUsers] = useState<User[]>([])
    const appUser = props.appUser
    const userLog = props.userLog

    /* Create */
    const handleGroupCreation = () => {
        const newGroupID = props.groupLog.length + 1

        const newGroupEntry: GroupEntry = {
            groupID: newGroupID,
            groupCreator: appUser.userID,
            groupName: groupName,
        }

        const newGroup = {
            type: 'createNewGroup',
            data: {
                newGroup: newGroupEntry,
            },
        }

        if(socket){
            console.log("Creating new group...")
            socket.send(JSON.stringify(newGroup))
        }

        setGroupName("")
    }

    const handleGroupParticipantCreation = () => {
        const usernamesArray = invitedUsers.split(",").map(username => username.trim())

        // Include the logged-in user in the invited users list
        usernamesArray.push(appUser.username)

        const invitedUsersInfo = usernamesArray.map(username => {
            const foundUser = props.userLog.find(user => user.username === username)
            return foundUser ? { username, userInfo: foundUser } : null
        })

        const newGroupParticipantsLogEntries = invitedUsersInfo.map(invitedUser => {
            if (invitedUser) {
                return {
                    groupID: props.groupLog.length + 1,
                    userID: invitedUser.userInfo.userID,
                }
            }
        })

        const flattenedEntries = newGroupParticipantsLogEntries
            .flat()
            .filter((entry): entry is GroupParticipantEntry => entry !== undefined)

        const newGroupParticipants = {
            type: 'createNewGroupParticipants',
            data: {
                newParticipants: flattenedEntries,
            },
        }

        if(socket){
            console.log("Creating new group participants...")
            socket.send(JSON.stringify(newGroupParticipants))
        }
    }


    const handleCreateClick = () => {
        handleGroupCreation()
        handleGroupParticipantCreation()
    }

    const handleGroupNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGroupName(event.target.value)
    }

    const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value.toLowerCase()
        const allSelected = invitedUsers.split(',').map(user => user.trim())

        if (searchValue === '*') {
            // Show all users and groups
            setMatchingUsers(userLog.filter(user => user.userID !== appUser.userID && !allSelected.find((invitedUser) => invitedUser === user.username)))
        } else if(searchValue !== '') {
            setRecipient(e.target.value)

            // Filter users based on the search value
            const filteredUsers = userLog.filter(user =>
                (user.username.toLowerCase().includes(searchValue) ||
                    user.firstName.toLowerCase().includes(searchValue) ||
                    user.lastName.toLowerCase().includes(searchValue) ) &&
                user.userID !== appUser.userID &&
                !allSelected.find((invitedUser) => invitedUser === user.username)
            )

            setMatchingUsers(filteredUsers)
        }
        else{
            setRecipient("")
            setMatchingUsers([])
        }
    }

    const handleUserClick = (selectedUser: User) => {
        const allSelected = invitedUsers.split(',').map(user => user.trim())

        if(!allSelected.find((user) => user === selectedUser.username)){
            // Append the selected user to the input
            const updatedInvitedUsers = invitedUsers !== '' ? invitedUsers + ' , ' + selectedUser.username : selectedUser.username

            setInvitedUsers(updatedInvitedUsers)

            // Clear the matching lists
            setMatchingUsers([])
        }
    }

    const handleRemoveUser = (indexToRemove: number) => {
        // Split the current invitedUsers string into an array
        const usersArray = invitedUsers.split(',').map(username => username.trim())

        // Remove the user at the specified index
        usersArray.splice(indexToRemove, 1)

        // Update the state with the new invitedUsers string
        setInvitedUsers(usersArray.join(','))
    }

    return(
        <div className={"createGroup"}>
            <h4>Group name</h4>
            <input placeholder={"Group name"} onChange={handleGroupNameChange}/>

            <h4>Search for users</h4>
            <RecipientInput
                recipient={recipient}
                matchingUsers={matchingUsers}
                matchingGroups={[]}
                handleRecipientChange={handleRecipientChange}
                handleUserClick={handleUserClick}
                handleGroupClick={() => {
                }}
                isCreateGroup={true}
            />
            {invitedUsers !== '' ? (
                <ul id={"invited_users"}>
                    {invitedUsers.split(',').map((username, index) => (
                        <li key={index} className={"invited_user"}>
                            <h6>{username.trim()}</h6>
                            <button onClick={() => handleRemoveUser(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            ) : null}

            <div>
                <h4>Initial message (optional)</h4>
                <input placeholder={"Type here..."}/>
            </div>
            <div className={"buttons"}>
                <button className={"buttonAlternate"} onClick={() => handleCreateClick()}>Submit
                </button>
                <button className={"buttonAlternate"} onClick={() => props.handleOptionClick("")}>Back
                </button>
            </div>
        </div>
    )
}

export default CreateGroup
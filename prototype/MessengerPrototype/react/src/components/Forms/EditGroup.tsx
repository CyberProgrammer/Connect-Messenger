import React, {useState} from "react"
import './EditGroup.css'

import {EditGroupProps, GroupEntry, User} from "@/shared/types.ts"
import RecipientInput from "../../shared/RecipientInput.tsx";

const EditGroup : React.FC<EditGroupProps> = (props) => {
    const appUserID = props.appUser.userID
    const appUser = props.appUser
    const userLog = props.userLog
    const GroupParticipants = props.groupLog.filter(group => group.groupCreator === appUserID)
    const [currentGroups, setCurrentGroups] = useState<GroupEntry[]>(GroupParticipants)
    const [usernames, setUsernames] = useState<string[] | null>([])
    const [invitedUsers, setInvitedUsers] = useState<string>("")
    const [recipient, setRecipient] = useState("")
    const [matchingUsers, setMatchingUsers] = useState<User[]>([])
    const [tempUsernames, setTempUsernames] = useState<string[] | null>([])
    const [editedGroupName, setEditedGroupName] = useState("")
    const [selectedGroupId, setSelectedGroupId] = useState(0)
    const [isGroupSelected, setIsGroupSelected] = useState(false)

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const targetID = event.target.value

        if (targetID === "Select a group") {
            setSelectedGroupId(0)
            setIsGroupSelected(false)
        } else {
            const selectedGroup = currentGroups.find(group => group.groupID === parseInt(targetID, 10))

            if (selectedGroup) {
                setSelectedGroupId(selectedGroup.groupID)
                setIsGroupSelected(true)

                const userIDs = props.groupParticipantsLog
                    .filter(group => group.groupID.toString() === targetID)
                    .map(group => group.userID)

                const userNames = userIDs.map(id => {
                    const matchingUser = props.userLog.find(user => user.userID === id && user.userID != appUserID)
                    return matchingUser !== undefined ? matchingUser.username : null
                })

                const filteredUserNames = userNames.filter(name => name !== null) as string[]

                setUsernames(filteredUserNames)
                setTempUsernames(filteredUserNames)
            }
        }
    }

    const handleGroupNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedGroupName(event.target.value)
    }


    const handleEditClick = () => {
        console.log("Editing group...")

        // Update the group name in the currentGroups state
        const updatedGroups = [...currentGroups]
        updatedGroups[selectedGroupId - 1].groupName = editedGroupName
        setCurrentGroups(updatedGroups)

        // Reset the edited group name
        setEditedGroupName("")
    }

    const handleRemoveUser = (indexToRemove: number) => {
        if(tempUsernames === null){
            return
        }
        // Create a copy of the current usernames array
        const updatedUsernames = [...tempUsernames]

        // Remove the user at the specified index
        updatedUsernames.splice(indexToRemove, 1)

        // Update the state with the new array without the removed user
        setTempUsernames(updatedUsernames)
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

    return(
        <div className={"editGroup"}>
            {currentGroups.length > 0 ?
                <select onChange={handleSelectChange}>
                    <option defaultChecked>Select a group</option>
                    {currentGroups.map(groupEntry => (
                        <option key={groupEntry.groupID} value={groupEntry.groupID}>
                            {groupEntry.groupName}
                        </option>
                    ))}
                </select> :
                <input
                    className={"error"}
                    placeholder={"You must be the creator of a group to edit a group."}
                    disabled
                />
            }

            {isGroupSelected && (
                <div className={"selectedGroupDetails"}>
                    <h3 className={"title"}>Group Details</h3>

                    <div className={"editGroupInput"}>
                        <label><h4>Group Name</h4></label>
                        <input
                            value={editedGroupName}
                            placeholder={isGroupSelected ? currentGroups.find(group => group.groupID === selectedGroupId)?.groupName : ""}
                            onChange={(e) => handleGroupNameChange(e)}
                        />
                    </div>

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

                    <div className={"editGroupInput"}>
                        <label><h4>Invited Users</h4></label>
                        <ul id={"invited_users"}>
                            {tempUsernames!.map((entry, index) => (
                                entry !== null ?
                                    <li key={index} className={"invited_user"}>
                                        <h6>{entry.trim()}</h6>
                                        <button onClick={() => handleRemoveUser(index)}>Remove</button>
                                    </li> : <></>
                            ))}
                        </ul>
                    </div>

                    <div className={"editGroupBtns"}>
                        <button className={"buttonAlternate"} onClick={() => handleEditClick()}>
                            Edit
                        </button>
                        <button className={"buttonAlternate"} onClick={() => props.handleOptionClick("")}>
                            Back
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditGroup
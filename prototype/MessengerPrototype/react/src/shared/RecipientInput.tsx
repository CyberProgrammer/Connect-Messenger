// RecipientInput.tsx
import React from "react"
import {GroupEntry, User} from "@/shared/types.ts"

interface RecipientInputProps {
    recipient: string
    matchingUsers: User[]
    matchingGroups: GroupEntry[]
    handleRecipientChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleUserClick: (selectedUser: User) => void
    handleGroupClick: (selectedGroup: GroupEntry) => void
    isCreateGroup: boolean
}

const RecipientInput: React.FC<RecipientInputProps> = (
    {
        recipient,
        matchingUsers,
        matchingGroups,
        handleRecipientChange,
        handleUserClick,
        handleGroupClick,
        isCreateGroup,
    }) => {
    return (
        <>
            <input
                className={"message-recipient"}
                placeholder={
                    isCreateGroup
                        ? "Search for users to invite"
                        : "Search for individual or group"
                }
                value={recipient}
                onChange={handleRecipientChange}
            />

            {/* Display matching users */}
            {(matchingUsers.length > 0 || matchingGroups.length > 0) && (
                <div className={"matching-users"}>
                    <ul>
                        {matchingUsers.map((user) => (
                            <li
                                key={user.userID}
                                onClick={() => handleUserClick(user)}
                                className="clickable-user"
                            >
                                <h6>
                                    {user.firstName + " " + user.lastName + " (" + user.username + ")"}
                                </h6>
                            </li>
                        ))}
                        {matchingGroups.map((group) => (
                            <li
                                key={group.groupID}
                                onClick={() => handleGroupClick(group)}
                                className="clickable-user"
                            >
                                <h6>{group.groupName}</h6>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    )
}

export default RecipientInput

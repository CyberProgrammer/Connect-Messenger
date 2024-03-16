import React, {useState} from "react"

import NavigationBar from "../../components/Navigation/NavigationBar.tsx"

import './Groups.css'
import '../../index.css'
import {GroupEntry, User, GroupParticipantEntry} from "@/shared/types.ts"
import CreateGroup from "../../components/Forms/CreateGroup.tsx"
import EditGroup from "../../components/Forms/EditGroup.tsx"

/* BYPASSING AUTHENTICATION FOR PROTOTYPE
import {withAuthenticationRequired } from '@auth0/auth0-react'
import UnauthenticatedApp from "../../components/UnauthenticatedApp.tsx"
*/

interface GroupProps {
    socket: WebSocket | null
    appUser: User
    groupLog: GroupEntry[]
    setGroupLog: React.Dispatch<React.SetStateAction<GroupEntry[]>>
    userLog: User[]
    setUserLog: React.Dispatch<React.SetStateAction<User[]>>
    groupParticipantsLog: GroupParticipantEntry[]
    setGroupParticipantsLog: React.Dispatch<React.SetStateAction<GroupParticipantEntry[]>>
}

const Groups : React.FC<GroupProps> = ({socket, appUser, groupLog, userLog, setUserLog, setGroupLog, groupParticipantsLog, setGroupParticipantsLog }) =>{
    const [selectedOption, setSelectedOption] = useState("")

    const handleOptionClick = (option: string) =>{
        setSelectedOption(option)
    }

    return(
        <div className={"groups"}>
            <NavigationBar selectedLink="groups"></NavigationBar>
            <div className={"content"}>
                <div className={"title"}>
                    <h3>Group Management</h3>
                </div>
                <div className={"form"}>
                    { selectedOption == "" && (
                        <div className={"options"}>
                            <button className={"buttonAlternate"} onClick={() => handleOptionClick('Create')}>
                                Create group
                            </button>
                            <button className={"buttonAlternate"} onClick={() => handleOptionClick('Edit')}>
                                Edit group
                            </button>
                        </div>
                    )}

                    { selectedOption != "" && selectedOption === "Create" && (
                        <CreateGroup
                            socket={socket}
                            groupLog={groupLog}
                            setGroupLog={setGroupLog}
                            groupParticipantsLog={groupParticipantsLog}
                            setGroupParticipantsLog={setGroupParticipantsLog}
                            userLog={userLog}
                            appUser={appUser}
                            setUserLog={setUserLog}
                            handleOptionClick={handleOptionClick}
                        />
                    )}

                    {selectedOption != "" && selectedOption === "Edit" && (
                        <EditGroup
                            groupLog={groupLog}
                            setGroupLog={setGroupLog}
                            groupParticipantsLog={groupParticipantsLog}
                            setGroupParticipantsLog={setGroupParticipantsLog}
                            userLog={userLog}
                            appUser={appUser}
                            handleOptionClick={handleOptionClick}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
/* BYPASSING AUTHENTICATION FOR PROTOTYPE
export default withAuthenticationRequired(Groups, {
    onRedirecting: () => <UnauthenticatedApp />,
})
 */

export default Groups
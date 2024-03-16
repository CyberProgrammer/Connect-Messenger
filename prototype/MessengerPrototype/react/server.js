// Websocket server / Express api

import axios from "axios"

// Websocket
import { WebSocketServer, WebSocket } from 'ws'

// Express
import express from 'express'
import { createServer } from 'http'
import pkg from 'express-openid-connect'
import apiRoutes from './src/routes/api.js'

// SQL db
import mysql from 'mysql'
const sqlTable = 'messenger'

// Auth0
const { auth } = pkg

// Express server
const app = express()
const expressPORT = 3000

// Configure express-openid-connect
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: '#', // Replace with a secure random string
    baseURL: '#', // Replace with your application's base URL (node.js)
    clientID: '#', // Replace with your Auth0 client ID
    issuerBaseURL: '#', // Replace with your Auth0 domain
}

const CONNECTION_TIMEOUT = 3600000 // 1 Hour

//app.use(auth(config))
app.use('/api', apiRoutes)

// Start servers
const server = createServer(app)
const wss = new WebSocketServer({ server })

// SQL connection
const connect_sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: `${sqlTable}`
})

connect_sql.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err)
    } else {
        console.log('Connected to MySQL database')
    }
})

const userConnections = new Map()

wss.on('connection', (ws, req) => {
    console.log("Client connected")

    const connectionTimeout = setTimeout(() => {
        console.log("Connection timed out")
        ws.terminate()
    }, CONNECTION_TIMEOUT)

    // Send the 'Connected' message to the connected client
    ws.send(JSON.stringify({ type: 'connected', message: 'Connected to WebSocket server' }))

    axios.get(`http://localhost:${expressPORT}/api/users`)
        .then(response => {
            ws.send(JSON.stringify({ type: 'initialUserLog', data: response.data }))
        })
        .catch(error => {
            //console.error('Error fetching user logs:', error)
            ws.send(JSON.stringify({ type: 'error', message: 'Error fetching user logs' }))
        })

    axios.get(`http://localhost:${expressPORT}/api/chats`)
        .then(response => {
            ws.send(JSON.stringify({ type: 'initialChatEntryLog', data: response.data }))
        })
        .catch(error => {
            //console.error('Error fetching chat entry data:', error)
            ws.send(JSON.stringify({ type: 'error', message: 'Error fetching chat entry data' }))
        })

    axios.get(`http://localhost:${expressPORT}/api/user-groups`)
        .then(response => {
            ws.send(JSON.stringify({ type: 'initialGroupParticipantsLog', data: response.data }))
        })
        .catch(error => {
            //console.error('Error fetching groupParticipants data:', error)
            ws.send(JSON.stringify({ type: 'error', message: 'Error fetching GroupParticipant data' }))
        })

    axios.get(`http://localhost:${expressPORT}/api/groups`)
        .then(response => {
            ws.send(JSON.stringify({ type: 'initialGroupLog', data: response.data }))
        })
        .catch(error => {
            //console.error('Error fetching groupLog data:', error)
            ws.send(JSON.stringify({ type: 'error', message: 'Error fetching groupLog data' }))
        })

    axios.get(`http://localhost:${expressPORT}/api/messages`)
        .then(response => {
            ws.send(JSON.stringify({ type: 'initialMessagesLog', data: response.data }))
        })
        .catch(error => {
            //console.error('Error fetching messages data:', error)
            ws.send(JSON.stringify({ type: 'error', message: 'Error fetching messages data' }))
        })

    ws.on('message', (message) => {
        // Reset the timeout
        clearTimeout(connectionTimeout)

        let autoIDgroup = -1

        // Handle different types of messages and update state accordingly
        const parsedMessage = JSON.parse(message)

        switch (parsedMessage.type) {
            case 'existingUser': {
                console.log("Existing user data: ", parsedMessage.data.existingUser.userID)
                userConnections.set(parsedMessage.data.existingUser.userID, ws)
                break
            }

            case 'createNewUser': {
                // Update userLog state
                const userID = parsedMessage.data.newUser.userID
                const firstName = parsedMessage.data.newUser.firstName
                const lastName = parsedMessage.data.newUser.lastName
                const username = parsedMessage.data.newUser.username

                // Associate the user ID with the WebSocket connection
                userConnections.set(parsedMessage.data.newUser.userID, ws)

                // Upload to db
                const insertQuery = `INSERT INTO users (userID, firstName, lastName, username) VALUES (?, ?, ?, ?)`
                const insertValues = [userID, firstName, lastName, username]

                connect_sql.query(insertQuery, insertValues, (error, results) => {
                    if (error) {
                        //console.error('Error inserting new message into the database:', error)
                    } else {
                        console.log('New message inserted into the database:', results)
                    }
                })

                // Push new user to all connected clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        console.log('Creating new user', parsedMessage.data.newUser)
                        client.send(JSON.stringify({
                            type: 'updateMessagesLog',
                            data: parsedMessage.data.newUser,
                        }))
                    }
                })
                break
            }
            case 'createNewChat': {
                console.log("Creating new chat... ")

                const creatorID = parsedMessage.data.chatEntry.creatorID
                const participantID = parsedMessage.data.chatEntry.participantID
                const groupID = parsedMessage.data.chatEntry.groupID
                const isGroupChat = parsedMessage.data.chatEntry.isGroupChat
                const userSentLastMessage = parsedMessage.data.chatEntry.userSentLastMessage

                const content = parsedMessage.data.userMessage.content
                const senderID = parsedMessage.data.userMessage.senderID
                const timestamp = parsedMessage.data.userMessage.timestamp

                let autoIDChat = -1
                let autoIDMessage = -1

                // Upload to chat entry to chats
                const insertQuery = `INSERT INTO chats (creatorID, participantID, groupID, isGroupChat, userSentLastMessage) VALUES (?, ?, ?, ?, ?)`
                const insertValues = [creatorID, participantID, groupID, isGroupChat, userSentLastMessage]

                // Insert into database
                connect_sql.query(insertQuery, insertValues, (error, results) => {
                    if (error) {
                        //console.error('Error inserting new chat entry into chats:', error)
                    } else {
                        console.log('New chatEntry inserted into chats')
                        autoIDChat = results.insertId

                        // Only insert into messages if chat entry insertion was successful
                        if (autoIDChat !== -1) {
                            // Upload to messages
                            const insertQuery2 = `INSERT INTO messages (chatID, senderID, content, timestamp) VALUES (?, ?, ?, ?)`
                            const insertValues2 = [autoIDChat, senderID, content, timestamp]

                            connect_sql.query(insertQuery2, insertValues2, (error, results) => {
                                if (error) {
                                    //console.error('Error inserting new message entry into messages:', error)
                                } else {
                                    autoIDMessage = results.insertId
                                    console.log('Message for new chatEntry inserted into messages')
                                }
                            })
                        }
                    }
                })

                const chatEntry = {
                    chatID: autoIDChat,
                    creatorID: parsedMessage.data.chatEntry.creatorID,
                    participantID: parsedMessage.data.chatEntry.participantID,
                    groupID: parsedMessage.data.chatEntry.groupID,
                    isGroupChat: parsedMessage.data.chatEntry.isGroupChat,
                    userSentLastMessage:parsedMessage.data.chatEntry.userSentLastMessage
                }

                const userMessage = {
                    messageID: autoIDMessage,
                    chatID: autoIDChat,
                    senderID: parsedMessage.data.userMessage.senderID,
                    content: parsedMessage.data.userMessage.content,
                    timestamp: parsedMessage.data.userMessage.timestamp
                }

                // Broadcast the new chat entry and user message to specific connected clients
                for (const [userID, userConnection] of userConnections.entries()) {
                    if (userConnection.readyState === WebSocket.OPEN) {
                        // Check if the client matches either senderID or recipientID
                        if (userID === parsedMessage.data.chatEntry.creatorID || userID === parsedMessage.data.chatEntry.participantID) {
                            console.log(`Broadcasting new chat and message to user: ${userID}`)
                            userConnection.send(JSON.stringify({
                                type: 'updateMessageLog',
                                data: chatEntry,
                            }))

                            userConnection.send(JSON.stringify({
                                type: 'updateMessagesLog',
                                data: userMessage,
                            }))
                        }
                    }
                }

                break
            }

            case 'createNewMessage': {
                const chatID = parsedMessage.data.userMessage.chatID
                const content = parsedMessage.data.userMessage.content
                const senderID = parsedMessage.data.userMessage.senderID
                const timestamp = parsedMessage.data.userMessage.timestamp

                console.log("messageID:", parsedMessage.data.userMessage.messageID)

                let autoIDMessage = -1

                // Upload to db
                const insertQuery = `INSERT INTO messages (chatID, content, senderID, timestamp) VALUES (?, ?, ?, ?)`
                const insertValues = [chatID, content, senderID, timestamp]

                connect_sql.query(insertQuery, insertValues, (error, results) => {
                    if (error) {
                        //console.error('Error inserting new message into the database:', error)
                    } else {
                        console.log('New message inserted into the messages:')
                        autoIDMessage = results.insertId
                    }
                })

                const userMessage = {
                    messageID: autoIDMessage,
                    chatID: chatID,
                    senderID: parsedMessage.data.userMessage.senderID,
                    content: parsedMessage.data.userMessage.content,
                    timestamp: parsedMessage.data.userMessage.timestamp
                }

                // Get the senderID and participantID
                const getChatInfoQuery = 'SELECT creatorID, participantID, groupID FROM chats WHERE chatID = ?'
                const getChatInfoValues = [chatID]

                connect_sql.query(getChatInfoQuery, getChatInfoValues, (error, results) => {
                    if (error) {
                        //console.error('Error retrieving chat information:', error)
                    } else {
                        if (results.length > 0) {
                            const creatorID = results[0].creatorID
                            const participantID = results[0].participantID
                            const groupID = results[0].groupID

                            // Now you can use creatorID and participantID as needed
                            console.log('Creator ID:', creatorID)
                            console.log('Participant ID:', participantID)
                            console.log('Group ID:', groupID)

                            // Broadcast the new chat entry and user message to specific connected clients
                            for (const [userID, userConnection] of userConnections.entries()) {
                                if (userConnection.readyState === WebSocket.OPEN) {
                                    console.log('Sending updateMessagesLog:', parsedMessage.data.userMessage)
                                    // Check if the client matches either senderID or recipientID
                                    if(groupID && participantID === null){
                                        const getGroupParticipantQuery = 'SELECT userID FROM group_participants WHERE groupID = ?'
                                        const getGroupInfoValues = [groupID]

                                        connect_sql.query(getGroupParticipantQuery, getGroupInfoValues, (error, results) => {
                                            if (error) {
                                                console.error('Error retrieving group information:', error)
                                            } else {
                                                if(results.length > 0){
                                                    console.log("Group info: ", results)
                                                    const groupParticipants = results.map((result) => result.userID)
                                                    console.log("Group participants: ", groupParticipants)


                                                    if (groupParticipants.includes(userID)) {
                                                        console.log(`Broadcasting new message to user: ${userID}`)
                                                        userConnection.send(JSON.stringify({
                                                            type: 'updateMessagesLog',
                                                            data: userMessage,
                                                        }))
                                                    }
                                                }
                                            }
                                        })
                                    }
                                    else if (userID === creatorID || userID === participantID) {
                                        console.log(`Broadcasting new message to user: ${userID}`)
                                        userConnection.send(JSON.stringify({
                                            type: 'updateMessagesLog',
                                            data: userMessage,
                                        }))
                                    }
                                }
                            }
                        } else {
                            console.error('Chat not found for chatID:', chatID)
                        }
                    }
                })

                break
            }

            case 'createNewGroup': {
                const groupCreator = parsedMessage.data.newGroup.groupCreator
                const groupName = parsedMessage.data.newGroup.groupName

                // Upload to db
                const insertQuery = `INSERT INTO groups (groupCreator, groupName) VALUES (?, ?)`
                const insertValues = [groupCreator, groupName]

                connect_sql.query(insertQuery, insertValues, (error, results) => {
                    if (error) {
                        console.error('Error inserting new message into the database:', error)
                    } else {
                        console.log('New message inserted into the messages:')
                        autoIDgroup = results.insertId
                    }
                })

                const newGroup = {
                    groupID: autoIDgroup,
                    groupCreator: parsedMessage.data.newGroup.groupCreator,
                    groupName: parsedMessage.data.newGroup.groupName,
                }

                // Broadcast the new group to clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        console.log('Sending updateGroupLog:', parsedMessage.data.userMessage)
                        client.send(JSON.stringify({
                            type: 'updateGroupLog',
                            data: newGroup,
                        }))
                    }
                })

                break
            }
            case 'createNewGroupParticipants': {
                const groupParticipants = parsedMessage.data.newParticipants
                console.log('New Group Participants:', groupParticipants)

                groupParticipants.forEach((participant) => {
                    const { groupID, userID } = participant

                    const insertQuery = `INSERT INTO group_participants (groupID, userID) VALUES (?, ?)`
                    const insertValues = [groupID, userID]

                    connect_sql.query(insertQuery, insertValues, (error, results) => {
                        if (error) {
                            console.error('Error inserting new group participants into the database:', error)
                        } else {
                            console.log('New group participant inserted...')
                            autoIDgroup = results.insertId
                        }
                    })

                    const newGroupParticipant = {
                        groupID: autoIDgroup,
                        userID: userID
                    }

                    // Broadcast the new participant to appropriate clients
                    wss.clients.forEach((client) => {
                        if (client.readyState === WebSocket.OPEN) {
                            if (client.userID === newGroupParticipant.userID) {
                                console.log('Sending updateGroupParticipants:', parsedMessage.data.userMessage)
                                client.send(JSON.stringify({
                                    type: 'updateGroupParticipants',
                                    data: newGroupParticipant,
                                }))
                            }
                        }
                    })
                })

                // Reset variable
                autoIDgroup=-1

                break
            }
            default:
                break
        }
    })

    ws.on('close', (code, reason) => {
        console.log(`Connection closed: ${code} - ${reason}`)
        clearTimeout(connectionTimeout)
    })

})

server.listen(expressPORT, () => {
    console.log(`Express server running on http://localhost:${expressPORT}`)
    console.log(`Websocket server running on wd://localhost:${expressPORT}`)
})



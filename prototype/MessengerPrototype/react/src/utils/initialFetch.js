/* initialFetch.js - holds the queries and makes the requests */
// Not currently used anymore but saving just in case

import mysql from 'mysql'

const sqlTable = 'table'
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

// Queries
const getUsersQuery = () => {
    const getUsersParams = {
        columns: ['userID', 'firstName', 'lastName', 'username'],
        table: 'users',
    }

    const columns = getUsersParams.columns.join(', ')
    return `SELECT ${columns} FROM ${getUsersParams.table}`
}

const getChatEntryQuery = () =>{
    const getChatEntryParams = {
        columns: ['chatID', 'creatorID', 'participantID', 'groupID', 'isGroupChat', 'userSentLastMessage'],
        table: 'chats',
    }

    const columns = getChatEntryParams.columns.join(', ')
    return `SELECT ${columns} FROM ${getChatEntryParams.table}`
}

const getGroupParticipantsLogQuery = () =>{
    const getGroupParticipantParams = {
        columns: ['groupID', 'userID'],
        table: 'group_participants',
    }

    const columns = getGroupParticipantParams.columns.join(', ')
    return `SELECT ${columns} FROM ${getGroupParticipantParams.table}`
}

const getGroupLogQuery = () =>{
    const getGroupLogParams = {
        columns: ['groupID', 'groupCreator', 'groupName'],
        table: 'groups',
    }

    const columns = getGroupLogParams.columns.join(', ')
    return `SELECT ${columns} FROM ${getGroupLogParams.table}`
}

const getMessagesQuery = () =>{
    const getMessagesParams = {
        columns: ['messageID', 'chatID', 'senderID', 'content', 'timestamp'],
        table: 'messages',
    }

    const columns = getMessagesParams.columns.join(', ')
    return `SELECT ${columns} FROM ${getMessagesParams.table}`
}

// Fetch

const fetchUserLog = () => {
    return new Promise((resolve, reject) => {
        connect_sql.query(getUsersQuery(), (error, results) => {
            if (error) {
                console.error('Error fetching user logs:', error)
                reject(error)
            } else {
                console.log('Fetched user logs')
                resolve(results)
            }
        })
    })
}

const fetchChatEntryLog = () => {
    return new Promise((resolve, reject) => {
        connect_sql.query(getChatEntryQuery(), (error, results) => {
            if (error) {
                console.error('Error fetching chat entry data:', error)
                reject(error)
            } else {
                console.log('Fetched chat entry data')
                resolve(results)
            }
        })
    })
}

const fetchGroupParticipantsLog = () => {
    return new Promise((resolve, reject) => {
        connect_sql.query(getGroupParticipantsLogQuery(), (error, results) => {
            if (error) {
                console.error('Error fetching GroupParticipant data:', error)
                reject(error)
            } else {
                console.log('Fetched GroupParticipant data')
                resolve(results)
            }
        })
    })
}

const fetchGroupLog = () => {
    return new Promise((resolve, reject) => {
        connect_sql.query(getGroupLogQuery(), (error, results) => {
            if (error) {
                console.error('Error fetching groupLog data:', error)
                reject(error)
            } else {
                console.log('Fetched groupLog data')
                resolve(results)
            }
        })
    })
}

const fetchMessagesLog = () => {
    return new Promise((resolve, reject) => {
        connect_sql.query(getMessagesQuery(), (error, results) => {
            if (error) {
                console.error('Error fetching messages data:', error)
                reject(error)
            } else {
                console.log('Fetched messages data')
                resolve(results)
            }
        })
    })
}

export {
    fetchUserLog,
    fetchChatEntryLog,
    fetchGroupParticipantsLog,
    fetchGroupLog,
    fetchMessagesLog,
}
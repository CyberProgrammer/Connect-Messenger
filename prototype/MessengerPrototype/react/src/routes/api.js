// routes/api.js - Fetches initial data using express api

/* Authenticating api access */
//import pkg from 'express-openid-connect'
//const { requiresAuth } = pkg

import express from "express"

import {
    fetchUserLog,
    fetchChatEntryLog,
    fetchGroupParticipantsLog,
    fetchGroupLog,
    fetchMessagesLog,
} from '../utils/initialFetch.js'

const router = express.Router()

/* API routes */
// Get users
router.get('/users', async (_req, res) => {
    try {
        // Fetch user data from the database using the asynchronous function
        const userData = await fetchUserLog()

        // Send the fetched data as a JSON response
        res.json(userData)
    } catch (error) {
        console.error('Error fetching users data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Get chats
router.get('/chats', async (_req, res) => {
    try {
        // Fetch user data from the database using the asynchronous function
        const chatData = await fetchChatEntryLog()

        // Send the fetched data as a JSON response
        res.json(chatData)
    } catch (error) {
        console.error('Error fetching chats data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Get user groups
router.get('/user-groups', async (_req, res) => {
    try {
        // Fetch user data from the database using the asynchronous function
        const GroupParticipantData = await fetchGroupParticipantsLog()

        // Send the fetched data as a JSON response
        res.json(GroupParticipantData)
    } catch (error) {
        console.error('Error fetching user groups data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Get groups
router.get('/groups',async (_req, res) => {
    try {
        // Fetch user data from the database using the asynchronous function
        const groupData = await fetchGroupLog()

        // Send the fetched data as a JSON response
        res.json(groupData)
    } catch (error) {
        console.error('Error fetching groups data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Get messages
router.get('/messages', async (_req, res) => {
    try {
        // Fetch user data from the database using the asynchronous function
        const messageData = await fetchMessagesLog()

        // Send the fetched data as a JSON response
        res.json(messageData)
    } catch (error) {
        console.error('Error fetching message data:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})
export default router
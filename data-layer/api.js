axios.get('http://localhost:3000/api/users')
    .then(response => {
        ws.send(JSON.stringify({ type: 'initialUserLog', data: response.data }))
    })
    .catch(error => {
        console.error('Error fetching user logs:', error)
        ws.send(JSON.stringify({ type: 'error', message: 'Error fetching user logs' }))
    })

axios.get('http://localhost:3000/api/chats')
    .then(response => {
        ws.send(JSON.stringify({ type: 'initialChatEntryLog', data: response.data }))
    })
    .catch(error => {
        console.error('Error fetching chat entry data:', error)
        ws.send(JSON.stringify({ type: 'error', message: 'Error fetching chat entry data' }))
    })

axios.get('http://localhost:3000/api/user-groups')
    .then(response => {
        ws.send(JSON.stringify({ type: 'initialGroupParticipantsLog', data: response.data }))
    })
    .catch(error => {
        console.error('Error fetching groupParticipants data:', error)
        ws.send(JSON.stringify({ type: 'error', message: 'Error fetching GroupParticipant data' }))
    })

axios.get('http://localhost:3000/api/groups')
    .then(response => {
        ws.send(JSON.stringify({ type: 'initialGroupLog', data: response.data }))
    })
    .catch(error => {
        console.error('Error fetching groupLog data:', error)
        ws.send(JSON.stringify({ type: 'error', message: 'Error fetching groupLog data' }))
    })

axios.get('http://localhost:3000/api/messages')
    .then(response => {
        ws.send(JSON.stringify({ type: 'initialMessagesLog', data: response.data }))
    })
    .catch(error => {
        console.error('Error fetching messages data:', error)
        ws.send(JSON.stringify({ type: 'error', message: 'Error fetching messages data' }))
    })
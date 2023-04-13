

export const getMessagesDb = async () => {
  const getAll = await fetch('/api/messages/get/messages')
  const messages = await getAll.json()
  const instructMessage = []
  for (let i = 0; i < messages.list.length; i++) {
    const msg = messages.list[i]
    if(msg.status === "read") {
      instructMessage.push({read: true, message: msg.message, id:msg.date, username: msg.username})
    }
    if(msg.status === "unread") {
      instructMessage.push({read: false, message: msg.message, id:msg.date, username: msg.username})
    }
  }
  return instructMessage
}
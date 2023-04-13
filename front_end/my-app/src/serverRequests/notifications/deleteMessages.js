

export async function deleteMessageDb (e) {
  const updateE = e.replaceAll("\"", "")
  const messageDate = {date: updateE}
  console.log('deleting message, date === id which = ',messageDate)
  const deleteMessageDb = await fetch('/api/messages/remove/message', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageDate)
  })
  const deleted = deleteMessageDb.json()
  console.log('response ', deleted)
  return "message deleted"
}
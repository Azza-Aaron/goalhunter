

export async function updateMessageDb (e) {
  const updateE = e.replaceAll("\"", "")
  const messageDate = {date: updateE}
  console.log('Updating message, date === id which = ',updateE)
  const updateMessageRead = await fetch('/api/messages/status', {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageDate)
  })
  console.log('response ', updateMessageRead.msg)
}
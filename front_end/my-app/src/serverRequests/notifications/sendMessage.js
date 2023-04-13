
export async function sendMessageDb (e) {
  const friend = {friendId: e}
  console.log('sending to my friend id ',friend)
  const sendMessage = await fetch('/api/messages/send/message', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(friend)
  })
  const data = await sendMessage.json()
  console.log('response ', data)
  return data.message[1]
}
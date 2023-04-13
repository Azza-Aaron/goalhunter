
export const acceptFriendDb = async (id) => {
  console.log('accepting')
  const sendAccept = await fetch('/api/friends/accept', {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id})
  })
  return sendAccept.msg
}
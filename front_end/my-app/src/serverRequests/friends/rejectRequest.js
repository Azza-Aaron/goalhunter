
export const rejectInDb = async(id) => {
  console.log(id)
  const sendBlock = await fetch('/api/friends/reject', {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id})
  })
  return sendBlock.msg
}
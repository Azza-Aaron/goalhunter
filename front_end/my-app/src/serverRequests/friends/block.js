
export const blockInDb = async(id) => {
  console.log(id)
  const sendBlock = await fetch('/api/friends/block', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id})
  })
  return sendBlock.msg
}
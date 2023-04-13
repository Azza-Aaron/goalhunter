

export const friendRequestToDb = async (email) => {
  const friendDetails = {email: email}
  console.log('sent ', email, ' to server')
  const request = await fetch( '/api/friends/request',  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({friendDetails})
  })
  const response = await request.json()
  console.log(response)
}
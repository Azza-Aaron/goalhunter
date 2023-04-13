
export const addNewUser = async (username, password, email) => {
  const addUser = await fetch('/api/user/create', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username, password, email})
  })
  console.log(addUser)
  console.log('new use probably added??', username, password)
  const res = await addUser.json()

}
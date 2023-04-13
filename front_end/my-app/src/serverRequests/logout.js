export async function logout() {
  const logoutServer = await fetch( '/api/user/delete',  {
    method: "DELETE"
  })
  console.log('log me out of server ', logoutServer)
  sessionStorage.removeItem("user")
  return true
}
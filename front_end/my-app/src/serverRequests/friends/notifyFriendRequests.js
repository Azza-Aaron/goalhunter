

export const friendsRequestsFromDb = async () => {
  const getFriendsRequests = await fetch('/api/friends/myfriendrequests')
  const request = await getFriendsRequests.json()
  console.log(request.msg)
  return request.list
}

export const friendsFromDb = async () => {
  const getFriends = await fetch('/api/friends/myfriends')
  const friends = await getFriends.json()
  console.log(friends.msg)
  return friends.list
}
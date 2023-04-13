const {dbClient} = require("../../../../data_base");
const {goalFriendsQuery, friendsUsernameQuery} = require("../../../model/clientQueries");
const {weekCharting} = require("../dataFunctions/weekchart.js");
const {friendDayCharting} = require("../dataFunctions/daychart");
const {monthCharting} = require("../dataFunctions/monthchart");
const {yearCharting} = require("../dataFunctions/yearchart");

const getMyFriendsUsernames = async (ids) => {
  const promises = []
  for (let i = 0; i < ids.length; i++) {
    const getName = dbClient.query(friendsUsernameQuery([ids[i]]))
    promises.push(getName)
  }
  const returnedProms = await Promise.all(promises)
  return returnedProms.map((promise) => ({id: promise.rows[0].id, name:promise.rows[0].username}))
}

const getMyFriendsId = async (userId) => {
  const friends = await dbClient.query(goalFriendsQuery(userId))
  return friends.rows.map((row) => {
    if(row.friend_id !== userId){ return row.friend_id}
    if(row.user_id !== userId) {return row.user_id}
  })
}

const completeFriendData = async (userId, format) => {
  const friendsIds = await getMyFriendsId(userId)
  const friendInfo = await getMyFriendsUsernames(friendsIds)
  console.log('my friends info = ', friendInfo)
  const promises = []
  switch (format) {
    case "day":
      for (let i = 0; i < friendsIds.length; i++) {
        const week = await friendDayCharting(friendsIds[i])
        promises.push(week)
      }
      break
    case "week":
      for (let i = 0; i < friendsIds.length; i++) {
        const week = await weekCharting(friendsIds[i])
        promises.push(week)
      }
      break
    case "month":
      for (let i = 0; i < friendsIds.length; i++) {
        const week = await monthCharting(friendsIds[i])
        promises.push(week)
      }
      break
    case "year":
      for (let i = 0; i < friendsIds.length; i++) {
        const week = await yearCharting(friendsIds[i])
        promises.push(week)
      }
      break
  }
  const returnedProms = await Promise.all(promises)
  return returnedProms.map((array, index) =>
    ({name:friendInfo[index].name, list:array})
  )
}

module.exports = {
  getMyFriendsId,
  getMyFriendsUsernames,
  completeFriendData
}

const dateRangeQuery = (dateRange) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * from public.goal_data WHERE user_id = $1 AND goal_day >= $2 AND goal_day <= $3`,
    values: dateRange
  };
}

const goalFriendsQuery = (userId) => {
  const userAdnStatus = [userId, "accepted"]
  return{
    text: `SELECT * FROM public.friend_data
           WHERE user_id = $1 AND status = $2 OR friend_id = $1 AND status = $2`,
    values: userAdnStatus
  }
}

const friendsUsernameQuery = (id) => {
  return{
    text: `SELECT * FROM public.user WHERE id = $1`,
    values: id
  }
}

module.exports = {
  dateRangeQuery,
  goalFriendsQuery,
  friendsUsernameQuery
}
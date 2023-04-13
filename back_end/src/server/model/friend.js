

const insertFriendRequest = (bond) => {
  return {
    //name: 'insert-new-post',
    text: `INSERT INTO public.friend_data (friend_id, user_id, status)
           VALUES ($1, $2, $3)`,
    values: bond
  };
}


const testBond = (eBond) => {
  return {
    text: `SELECT status from public.friend_data WHERE friend_id = $1 AND user_id = $2`,
    values: eBond
  };
}

const listFriendsQuery = (user) => {
  return {
    text: 'SELECT * from public.friend_data WHERE friend_id = $1 AND status = $2 OR user_id = $1 AND status = $2',
    values: user
  }
}

const pendingBond = (user) => {
  return {
    text: 'SELECT user_id from public.friend_data WHERE friend_id = $1 AND status = $2',
    values: user
  };
}

const deleteBond = (bond) => {
  return{
    text: `DELETE FROM public.friend_data
           WHERE friend_id = $1 AND user_id = $2 OR friend_id = $2 AND  user_id = $1`,
    values: bond
  }
}

const updateBond = (bond) => {
  return {
    text: `UPDATE public.friend_data
          SET status = $3
          WHERE friend_id = $1 AND user_id = $2 OR friend_id = $2 AND  user_id = $1`,
    values: bond
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

module.exports = {
  updateBond,
  deleteBond,
  pendingBond,
  listFriendsQuery,
  testBond,
  insertFriendRequest,
  goalFriendsQuery
}
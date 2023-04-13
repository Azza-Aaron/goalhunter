

const selectUser = (user) => {
  return {
    text: `SELECT id from public.user WHERE email = $1`,
    values: user
  };
}

const myFriendQuery = (id) => {
  return {
    text: 'SELECT * from "user" WHERE id = $1',
    values: id
  }
}

const friendsUsernameQuery = (id) => {
  return{
    text: `SELECT * FROM public.user WHERE id = $1`,
    values: id
  }
}

const validateUserPreppedQuery = (user) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * from public.user WHERE email = $1`,
    values: user
  };
}

const userExistsQuery = (email) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT id from public.user WHERE email = $1`,
    values: email
  };
}

const createUserPreppedQuery = (user) => {
  return {
    //name: 'insert-new-post',
    text: `INSERT INTO public.user (username, email, password)
           VALUES ($1, $2, $3)
           RETURNING id`,
    values: user
  };
}

module.exports = {
  selectUser,
  myFriendQuery,
  friendsUsernameQuery,
  validateUserPreppedQuery,
  userExistsQuery,
  createUserPreppedQuery
}
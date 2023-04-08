const express = require('express');
const router = express.Router();
const {authGuard} = require("../../../middleware");
const moment = require('moment')
const {dbClient} = require("../../../data_base");

router.use(authGuard)

const selectUser = (user) => {
  return {
    text: `SELECT id from public.user WHERE email = $1`,
    values: user
  };
}

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

router.post('/request', async(req,res) => {
  console.log('trying')
  const userId = req.session.user.id
  const userName = req.session.user.name
  let friendId

  try {
    const getFriendId = await dbClient.query(selectUser([req.body.friendDetails.email]))
    friendId = getFriendId.rows[0].id
  } catch (e) {
    console.log(e, 'no user with that email')
    res.json({msg: 'no user with that email'})
    res.status(400);
    return
  }

  try {
    const eBond = [friendId, userId]
    const existingBond = await dbClient.query(testBond(eBond))
    console.log(existingBond)
    if(existingBond.rows.length){
      res.json({msg: 'bond already exists'})
      res.status(400)
      return
    }
  } catch (e) {
    console.log(e, 'bond test failed somewhere')
    res.status(400)
    return
  }

  try {
    const bond = [friendId, userId, "pending"]
    await dbClient.query((insertFriendRequest(bond)))

    res.json({msg: 'friend request sent'})
    res.status(200)
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({ err: "something went wrong" });
  }
});

const listFriendsQuery = (user) => {
  return {
    text: 'SELECT * from public.friend_data WHERE friend_id = $1 AND status = $2 OR user_id = $1 AND status = $2',
    values: user
  }
}

const myFriendQuery = (id) => {
  return {
    text: 'SELECT * from "user" WHERE id = $1',
    values: id
  }
}

router.get('/myfriends', async(req, res) => {
  try{
    const user = [req.session.user.id, 'accepted']
    const getBonds = await dbClient.query(listFriendsQuery(user))
    console.log(getBonds)

    let promiseList = []

    const friendQuery = async (id) => dbClient.query(myFriendQuery([id]));


    for (let i = 0; i < getBonds.rows.length; i++) {
      const thisUser = req.session.user.id
      const bond = getBonds.rows[i]
      if(bond.friend_id !== thisUser) {
        promiseList.push(friendQuery(bond.friend_id))
      }
      if(bond.user_id !== thisUser) {
        promiseList.push(friendQuery(bond.user_id))
      }
    }
    const promises = await Promise.all(promiseList)
    const friendList = []
    promises.forEach((promise) => friendList.push({username: promise.rows[0].username, id: promise.rows[0].id}))
    res.json({msg: 'yay friends', list: friendList})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.json({msg: 'something failed'})
    res.status(400)
  }
})

const pendingBond = (user) => {
  return {
    text: 'SELECT user_id from public.friend_data WHERE friend_id = $1 AND status = $2',
    values: user
  };
}

router.get('/myfriendrequests', async (req, res) => {
  const user = [req.session.user.id, 'pending']
  const friendQuery = async (id) => dbClient.query(myFriendQuery([id]));
  let promiseList = []
  try {
    const reqs = await dbClient.query(pendingBond(user))
    if(reqs.rows.length){
      for (let i = 0; i < reqs.rows.length; i++) {
        promiseList.push(friendQuery(reqs.rows[i].user_id))
        //console.log(reqs.rows[i].id)
      }
      //console.log(reqs.rows[0])
    } else {
      res.json({msg: 'no friend requests'})
      res.status(200)
      return
    }
    const returnedPromises = await Promise.all(promiseList)
    console.log(returnedPromises[0].rows[0])
    const list = []
    returnedPromises.forEach((promise) => {
      list.push({username: promise.rows[0].username, id: promise.rows[0].id})
    })
    res.json({msg:'worked', list})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.json({msg:'something went wrong'})
    res.status(400)
  }
})

const deleteBond = (bond) => {
  return{
    text: `DELETE FROM public.friend_data
           WHERE friend_id = $1 AND user_id = $2 OR friend_id = $2 AND  user_id = $1`,
    values: bond
  }
}

router.delete('/reject', async (req, res) => {
  const bond = [req.body.id, req.session.user.id,]
  try {
    const removeRequest = await dbClient.query(deleteBond(bond))
    console.log(removeRequest)
    res.json({msg: "request removed"})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.json({msg: 'something went wrong', error: e})
    res.status(400)
  }
})

const updateBond = (bond) => {
  return {
    text: `UPDATE public.friend_data
          SET status = $3
          WHERE friend_id = $1 AND user_id = $2 OR friend_id = $2 AND  user_id = $1`,
    values: bond
  };
}


router.post('/block', async (req, res) => {
  console.log("my request id = ", req.body.id)
  const newBond = [req.session.user.id, req.body.id, 'blocked']
  console.log('newBond', newBond)
  try {
    const blockInDb = await dbClient.query(updateBond(newBond))
    res.json({msg: 'blocked someone yay, do it again!'})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.json({msg: 'something went wrong', error: e})
    res.status(400)
  }

})


router.patch('/accept', async (req, res) => {
  const newBond = [req.session.user.id, req.body.id, 'accepted']
  try {
    const acceptInDb = await dbClient.query(updateBond(newBond))
    res.json({msg: 'woo, new friends!'})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.json({msg: 'something went wrong', error: e})
    res.status(400)
  }
})

module.exports = router
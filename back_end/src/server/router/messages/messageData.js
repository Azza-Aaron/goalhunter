const express = require('express');
const router = express.Router();
const {authGuard} = require("../../../middleware");
const {dbClient} = require("../../../data_base");
const moment = require("moment")

router.use(authGuard)

const getAllMyMessages = (id) => {
  return{
    text: 'SELECT * FROM public.message_notifications WHERE user_id = $1',
    values: id
  }
}

router.get('/get/messages', async (req, res) => {
  const id = req.session.user.id
  try{
    const allMyMessages = await dbClient.query(getAllMyMessages([id]))
    const list = allMyMessages.rows.map((row) => ({status: row.status, message: row.message, date: row.date_time, username: row.from_user}))
    console.log('returning list is ', list)
    res.json({msg: 'all messages of user', list: list})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

const sendMessageQuery = (message) => {
  return {
    //name: 'insert-new-post',
    text: `INSERT INTO public.message_notifications (from_user, message, status, user_id, date_time)
           VALUES ($1, $2, $3, $4, $5)`,
    values: message
  };
}

router.post('/send/message', async (req, res) => {
  const user = req.session.user.name
  const friend = req.body.friendId
  console.log('my friend', friend)
  try {
    //check how many messages today
    const checkFriendsMessages = await dbClient.query(getAllMyMessages([friend]))
    const checkMessages = checkFriendsMessages.rows
    const messageNumber = checkMessages.map((row) => row.from_user === user ? user : null )
    if(messageNumber.length >= 10){
      console.log('message limit exceeded')
      res.json({msg: 'too many messages from this user'})
      res.status(200)
      return
    }
    const allMessages = await dbClient.query('SELECT * FROM public.messages')
    const maxNumber = allMessages.rows.length - 1
    const randomIndex = Math.floor(Math.random() * maxNumber)
    const randomMessage = allMessages.rows[randomIndex].message
    const date = moment()
    const message = [user, randomMessage, "unread", friend, date]
    console.log(message)
    await dbClient.query(sendMessageQuery(message))
    res.json({msg: 'message sent', message: message})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

const updateMessageQuery = (status) => {
  return {
    text: `UPDATE public.message_notifications
          SET status = $2
          WHERE user_id = $1 AND date_time = $3`,
    values: status
  };
}

router.patch('/status', async (req, res) => {
  const userId = req.session.user.id
  console.log(userId)
  const date = `\"${req.body.date}\"`
  console.log('date sent', date)
  try {
    await dbClient.query(updateMessageQuery([userId, "read", date]))
    console.log('status updates')
    res.json({msg: 'status updated'})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

const deleteMessageQuery = (message) => {
  return{
    text: `DELETE FROM public.message_notifications
           WHERE user_id = $1 AND date_time = $2`,
    values: message
  }
}

router.delete('/remove/message', async (req, res) => {
  try {
    await dbClient.query(deleteMessageQuery([req.session.user.id, `\"${req.body.date}\"`]))
    res.json({msg: 'message deleted'})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

module.exports = router
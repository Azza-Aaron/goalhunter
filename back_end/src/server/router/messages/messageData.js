const express = require('express');
const router = express.Router();
const {authGuard} = require("../../../middleware");
const {dbClient} = require("../../../data_base");
const moment = require("moment")

router.use(authGuard)

const sendMessageQuery = (message) => {
  return {
    //name: 'insert-new-post',
    text: `INSERT INTO public.message_notifications (from_user, message, status, user_id, date_time)
           VALUES ($1, $2, $3, $4, $5)`,
    values: message
  };
}

router.post('/send', async (req, res) => {
  const user = req.session.user.username
  const friend = req.body.friendId
  console.log('my friend', friend)
  try {
    const allMessages = await dbClient.query('SELECT * FROM public.messages')
    const maxNumber = allMessages.rows.length - 1
    const randomIndex = Math.floor(Math.random() * maxNumber)
    const randomMessage = allMessages.rows[randomIndex].message
    console.log(randomMessage)
    const message = 'yay encouragement'
    const date = moment()


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
          WHERE user_id = $1`,
    values: status
  };
}

router.patch('/status', async (req, res) => {
  const user = req.session.user.username

  try {

    res.json({msg: 'status updated'})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

const deleteMessageQuery = (bond) => {
  return{
    text: `DELETE FROM public.message_notifications
           WHERE user_id = $1 AND date_time = $2`,
    values: bond
  }
}

router.delete('/remove', async (req, res) => {
  const user = req.session.user.username

  try {

    res.json({msg: 'message deleted'})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

module.exports = router
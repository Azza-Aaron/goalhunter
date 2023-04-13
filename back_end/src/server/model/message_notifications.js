

const sendMessageQuery = (message) => {
  return {
    //name: 'insert-new-post',
    text: `INSERT INTO public.message_notifications (from_user, message, status, user_id, date_time)
           VALUES ($1, $2, $3, $4, $5)`,
    values: message
  };
}

const updateMessageQuery = (status) => {
  return {
    text: `UPDATE public.message_notifications
          SET status = $2
          WHERE user_id = $1 AND date_time = $3`,
    values: status
  };
}

const deleteMessageQuery = (message) => {
  return{
    text: `DELETE FROM public.message_notifications
           WHERE user_id = $1 AND date_time = $2`,
    values: message
  }
}

const getAllMyMessages = (id) => {
  return{
    text: 'SELECT * FROM public.message_notifications WHERE user_id = $1',
    values: id
  }
}


module.exports = {
  getAllMyMessages,
  sendMessageQuery,
  updateMessageQuery,
  deleteMessageQuery
}
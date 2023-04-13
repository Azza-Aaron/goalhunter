const dateRangeQuery = (dateRange) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * from public.goal_data WHERE user_id = $1 AND goal_day >= $2 AND goal_day <= $3`,
    values: dateRange
  };
}


const addGoalPoint = (data) => {
  return {
    text: `INSERT INTO public.goal_data (goal_type_id, goal_day, goal_time, user_id)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
    values: data
  };
}

const todayQuery = (data) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * from public.goal_data WHERE goal_type_id = $1 AND goal_day = $2 AND user_id = $3`,
    values: data
  };
}

const deleteTodayPoint = (id) => {
  return {
    text: `DELETE FROM goal_data WHERE id = $1
    RETURNING id`,
    values: id
  };
}


module.exports = {
  dateRangeQuery,
  addGoalPoint,
  todayQuery,
  deleteTodayPoint
}
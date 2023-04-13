const addGoalType = (type) => {
  return {
    text: `INSERT INTO public.goal_types (goal, user_id)
           VALUES ($1, $2)
           RETURNING id`,
    values: type
  };
}

const goalTypesQuery = (data) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * FROM public.goal_types WHERE user_id = $1`,
    values: data
  };
}

module.exports = {
  addGoalType,
  goalTypesQuery
}
import moment from 'moment'

export async function addGoalToDb (e) {
  const goal = {type: e, date: moment().format('YYYY-MM-DD'), myTime: moment().format('h:mm:ss a')}
  console.log(goal)
  const sendGoal = await fetch('/api/goals', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goal)
  })
  console.log('sent goal is ', goal)
  console.log('response ', sendGoal)
}
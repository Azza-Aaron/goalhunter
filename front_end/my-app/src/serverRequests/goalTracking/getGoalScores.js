
export const getTodayData = async () => {
  const todayList = []
  let goalText = []
  let points = 0
  const getDay = await fetch('/api/goals/chart/day')
  const goalDayData = await getDay.json()
  const getTypes = await fetch('/api/goals/goal/types')
  const goalTypes = await getTypes.json()
  const user = goalTypes.user
  console.log(goalTypes)
  for (let i = 0; i < goalDayData.data.length; i++) {
    points ++
    todayList.push({points: points, time:goalDayData.data[i].goal_time, date:goalDayData.data[i].goal_day, type: goalDayData.data[i].goal_type_id})
    goalTypes.goalTypes.forEach((type) => {
      if (goalDayData.data[i].goal_type_id === type.id) {
        goalText.push(type.text)
      }
    })

  }

  console.log('day data', goalDayData)
  console.log('goal types', goalTypes.user)
  console.log(goalText)
  console.log('user is ', user)

  return {todayList, points, goalText, user}
}
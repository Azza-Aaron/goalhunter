

export const callWeeklyData = async () => {
  const getList = await fetch('/api/goals/chart/week')
  const data = await getList.json()
  return data.data
}
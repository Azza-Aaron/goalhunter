

export const callYearlyData = async () => {
  const getList = await fetch('/api/goals/chart/year')
  const data = await getList.json()
  console.log('from yearly call ', data)
  return data.data
}
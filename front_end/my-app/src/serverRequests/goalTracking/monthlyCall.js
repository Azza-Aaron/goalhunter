
export const callMonthlyData = async () => {
  const getList = await fetch('/api/goals/chart/month')
  const data = await getList.json()
  console.log('from monthly call ', data)
  return data.data
}
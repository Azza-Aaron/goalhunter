
export const friendData = async (dayWeekMonthYear) => {
  const get = await fetch(`/api/goals/friend/data?format=${dayWeekMonthYear}`)//'day' or 'month' etc.
  const data = await get.json()
  console.log('my friends data should be here ', data)
  return data
}

export const coloursForDataset = () => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 255)
  const b = Math.floor(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}
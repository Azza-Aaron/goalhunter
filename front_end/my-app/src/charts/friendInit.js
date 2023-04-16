
export const friendData = async (dayWeekMonthYear) => {
  const get = await fetch(`/api/goals/friend/data?format=${dayWeekMonthYear}`)
  return await get.json()
}

export const coloursForDataset = () => {
  const r = Math.floor(Math.random() * 255)
  const g = Math.floor(Math.random() * 150)
  const b = Math.floor(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {useEffect, useState} from "react";
import {callMonthlyData} from "../serverRequests/goalTracking/monthlyCall";
import {coloursForDataset, friendData} from "./friendInit";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const initMonthly = async (setMonthData, user, todayValues, myFriendsMonthData, coloursFriends) => {
  let dbMonthlyList = await callMonthlyData()
  dbMonthlyList[3] = dbMonthlyList[3] + todayValues[todayValues.length - 1]
  const userDataset = {
    label: user,
    data: dbMonthlyList,
    borderColor: 'rgb(47,255,0)',
    backgroundColor: 'rgba(47,255,0, 0.5)',
  }
  await initMonthFriends(userDataset, setMonthData, myFriendsMonthData, coloursFriends)
}

const initMonthFriends = async (userDataset, setMonthData, myFriendsMonthData, coloursFriends) => {
  const myFriendsDayData = await friendData('day')
  for (let i = 0; i < myFriendsMonthData.friendData.length; i++) {
    const friendDay = myFriendsDayData.friendData[i]
    const dayVal = friendDay.list
    const sum = myFriendsMonthData.friendData[i].list[3] += dayVal
    myFriendsMonthData.friendData[i].colour = coloursFriends[i]
  }
  const resultDataSet = myFriendsMonthData.friendData.map((friend) => {
    const colour = coloursForDataset()
    return (
      {
        label: friend.name,
        data: friend.list,
        borderColor: `${friend.colour}`,
        backgroundColor: `${friend.colour}`,
      }
    )
  })
  resultDataSet.push(userDataset)
  setMonthData(resultDataSet)
  console.log('my friend data ends here ', resultDataSet)
}

export const MonthlyChart = ({todayValues, user, myFriendsMonthData, coloursFriends}) => {
  const [monthData, setMonthData] = useState([0,0,0,0])
  useEffect( () => {
    initMonthly(setMonthData, user, todayValues, myFriendsMonthData, coloursFriends)
  }, [todayValues])

  const labels = () => ['4 Weeks Ago', '3 Weeks Ago', 'Last Week', 'This Week']
  const chartData = {
    labels: labels(),
    datasets: monthData
  }
  return (
    <Line data={chartData}  />
  )
}

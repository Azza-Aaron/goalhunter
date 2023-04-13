
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


export const MonthlyChart = ({todayValues, user}) => {

  const [monthData, setMonthData] = useState([])
  const initMonthly = async () => {
    let dbMonthlyList = await callMonthlyData()
    dbMonthlyList[3] = dbMonthlyList[3] + todayValues[todayValues.length - 1]
    const userDataset = {
      label: user,
      data: dbMonthlyList,
      borderColor: 'rgb(47,255,0)',
      backgroundColor: 'rgba(47,255,0, 0.5)',
    }
    initMonthFriends(userDataset)
  }

  const initMonthFriends = async (userDataset) => {
    const myFriendsMonthData = await friendData('month')
    const myFriendsDayData = await friendData('day')
    const friendsLength =  myFriendsMonthData.friendData.length
    for (let i = 0; i < friendsLength; i++) {
      console.log('my friend in loop ', myFriendsMonthData.friendData[i])
      const friendDay = myFriendsDayData.friendData[i]
      const dayVal = friendDay.list[friendDay.list.length -1]
      myFriendsMonthData.friendData[i].list[3] += dayVal
    }
    const resultDataSet = myFriendsMonthData.friendData.map((friend) => {
      const colour = coloursForDataset()
      return (
        {
          label: friend.name,
          data: friend.list,
          borderColor: `${colour}`,
          backgroundColor: `${colour}`,
        }
      )
    })
    resultDataSet.push(userDataset)
    setMonthData(resultDataSet)
    console.log('my friend data ends here ', resultDataSet)
  }

  useEffect( () => {
    initMonthly()
  }, [todayValues])


  const labels = ['4 Weeks Ago', '3 Weeks Ago', 'Last Week', 'This Week']
  const data = {
    labels,
    datasets: monthData
  }
  return (
    <Line data={data} />
  )
}

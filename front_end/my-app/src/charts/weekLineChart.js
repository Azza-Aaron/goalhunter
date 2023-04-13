
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
import {forEach} from "react-bootstrap/ElementChildren";
import {useEffect, useState} from "react";
import moment from "moment";
import {callWeeklyData} from "../serverRequests/goalTracking/weeklyCall";
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



const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const weekLabels = () => {
  const listBefore = []
  const listAfter = []
  const listToday = []
  for (let i = 0; i < weekDays.length; i++) {
    if (i > moment().day()) {
      listAfter.push(weekDays[i])
    } if (i < moment().day()) {
      listBefore.push(weekDays[i])
    } else {if (i === moment().day())listToday.push(weekDays[i])}
  }
  let comb = listAfter.concat(listBefore)
  comb.push(listToday[0])
  return comb
}

export const WeeklyChart = ({todayValues, user}) => {
  const [friendsWeek, setFriendsWeek] = useState([])

  const initWeekly = async () => {
    const dbWeekList = await callWeeklyData()
    dbWeekList.push(todayValues[todayValues.length - 1])
    const userDataset =   {
      label: user,
      data: dbWeekList,
      borderColor: 'rgb(47,255,0)',
      backgroundColor: 'rgba(47,255,0, 0.5)',
    }
    initWeeklyFriend(userDataset)
  }

  const initWeeklyFriend = async (userDataset) => {
    const myFriendsWeekData = await friendData('week')
    const myFriendsDayData = await friendData('day')
    for (let i = 0; i < myFriendsWeekData.friendData.length; i++) {
      console.log('my friend in loop ', myFriendsWeekData.friendData[i])
      myFriendsWeekData.friendData[i].list.push(myFriendsDayData.friendData[i].list)
    }
    const myFriendDataSet = myFriendsWeekData.friendData.map((friend) => {
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
    myFriendDataSet.push(userDataset)
    setFriendsWeek(myFriendDataSet)
    console.log('my friend data ends here ', myFriendsWeekData)
  }

  useEffect( () => {
    initWeekly()
  }, [todayValues])


  const labels = weekLabels()
  const data = {
    labels,
    datasets: friendsWeek,
  }
  return (
    <Line data={data} />
  )
}

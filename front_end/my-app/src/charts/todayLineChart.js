
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
import {getTodayData} from "../serverRequests/goalTracking/getGoalScores";
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

export const transformDayData = (daysData) => {
  const labelList = ['12:00:00 am']
  const valuesList = [0]
  daysData.forEach(change => {
    if(change.time){
      labelList.push(change.time)
      valuesList.push(change.points)
    }
  })
  return {labels: labelList, values: valuesList}
}

const initTodayFriend = async (userDataset, setMyDataset, todayValues) => {
  let myFriendsDayData = await friendData('day')
  const todayLength = todayValues.length -1
  for (let i = 0; i < myFriendsDayData.friendData.length; i++) {
    const score = [myFriendsDayData.friendData[i].list]
    for (let j = 0; j < todayValues.length; j++) {
      if(todayLength === j) {break}
      score.unshift(0)
    }
    myFriendsDayData.friendData[i].list = score
  }

  const myFriendDataSet = myFriendsDayData.friendData.map((friend) => {
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
  setMyDataset(myFriendDataSet)
  console.log('my friend data ends here ', myFriendsDayData.friendData[0])
}

export const TodayChart = ({todayLabels, todayValues, user}) => {
  const [myDataset, setMyDataset] = useState([])
  const userDataset =   {
    label: user,
    data: todayValues,
    borderColor: 'rgb(47,255,0)',
    backgroundColor: 'rgba(47,255,0, 0.5)',
  }

  useEffect(() => {
    initTodayFriend(userDataset, setMyDataset, todayValues)
  }, [todayValues])

  const data = {
    labels: todayLabels,
    datasets: myDataset,
  }
  return (
    <Line data={data} />
  )
}

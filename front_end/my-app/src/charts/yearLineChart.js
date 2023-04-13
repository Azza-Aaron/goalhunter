
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
import moment from "moment/moment";
import {forEach} from "react-bootstrap/ElementChildren";
import {useEffect, useState} from "react";
import {callYearlyData} from "../serverRequests/goalTracking/yearlyCall";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const yearLabels = () => {

  const listBefore = []
  const listAfter = []
  const month = moment().month();
  for (let i = 0; i < months.length; i++) {
    if (i > month) {
      listAfter.push(months[i])
    } if (i <= month) {
      listBefore.push(months[i])
    }
  }
  return [...listAfter, ...listBefore];
}

export const YearlyChart = ({todayValues, user}) => {

  const [yearlyList, setYearlyList] = useState([])

  const initYearly = async () => {
    const dbYearlyList = await callYearlyData()
    const lastValue = todayValues.length - 1
    dbYearlyList[11] = dbYearlyList[11] + todayValues[lastValue]
    setYearlyList(dbYearlyList)
  }

  useEffect( () => {
    initYearly()
  }, [todayValues])

  const labels = yearLabels()
  const data = {
    labels,
    datasets: [
      {
        label: user,
        data: yearlyList,
        borderColor: 'rgb(47,255,0)',
        backgroundColor: 'rgba(47,255,0, 0.5)',
      }
    ],
  }
  return (
    <Line data={data} />
  )
}
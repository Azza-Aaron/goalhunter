import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ButtonGroup from "react-bootstrap/ButtonGroup"
import Button from "react-bootstrap/Button"
import React, {useEffect, useState} from "react";
import {TodayChart, transformDayData} from "./charts/todayLineChart";
import {WeeklyChart} from "./charts/weekLineChart";
import {MonthlyChart} from "./charts/monthLineChart";
import {YearlyChart} from "./charts/yearLineChart";
import {auth} from "./index";
import moment from "moment";
import {NotLoggedInYet} from "./notLoggedIn";
import {MainNavbar} from "./navbar/navbar";
import {addGoalToDb} from "./serverRequests/addGoal";
import {getTodayData} from "./serverRequests/goalTracking/getGoalScores";
import {friendData, coloursForDataset} from "./charts/friendInit";

const dateListBase = [{label: `Today`, class: "btn btn-primary"},
  {label: `Weekly`, class: "btn btn-primary"}, {label: `Monthly`, class: "btn btn-primary"},
  {label: `Yearly`, class: "btn btn-primary"}]

export default function App() {
  const [goals, setGoals] = useState([{name:"Work Goal", state:false}, {name:"Life Goal", state:false}, {name:"Education Goal", state:false},
    {name: "Fitness Goal", state:false}, {name:"Hobby Goal", state:false}])
  const [dateList, setDateList] = useState(dateListBase);
  let [dayScore, setDayScore] = useState(0)
  const [myGraph, setMyGraph] = useState('Weekly')
  const [todayLabels, setTodayLabels] = useState(['12:00:00 am'])
  const [todayValues, setTodayValues] = useState([0])
  const [daysData, setDaysData] = useState([{}])
  const [user, setUser] = useState('')
  const [loginButton, setLoginButton] = useState('Login')
  const [scoreHeader, setScoreHeader] = useState('')
  const [myFriendsMonthData, setMyFriendsMonthData] = useState([])
  const [coloursFriends, setColoursFriends] = useState([])


  const goalDataFromDb = async () => {
    const todayFromServer = await getTodayData()
    const dayChart = transformDayData(todayFromServer.todayList)
    setTodayLabels(dayChart.labels)
    setTodayValues(dayChart.values)
    setDayScore(todayFromServer.points)
    console.log('buttons from here ', todayFromServer.goalText)

    const myGoal = [...goals]
    todayFromServer.goalText.forEach((goal) => {
      switch(goal){
        case 'Work Goal':
          myGoal[0].state = true
          break;
        case 'Life Goal':
          myGoal[1].state = true
          break;
        case 'Education Goal':
          myGoal[2].state = true
          break;
        case 'Fitness Goal':
          myGoal[3].state = true
          break;
        case 'Hobby Goal':
          myGoal[4].state = true
          break;
      }
      setGoals(myGoal)
    })
    console.log('mount effect actioned')
    setLoginButton(`Welcome ${todayFromServer.user}!`)
    setUser(`${todayFromServer.user}`)
  }

  const cleanupLogout = () => {
    console.log('cleaning house')
    const myGoal = [...goals]
    myGoal.forEach((goal) => {goal.state = false})
    setGoals(myGoal)
    setTodayValues([0])
    setDayScore(0)
    setScoreHeader('Track Your Effort!')
    prepChartButton()
  }

  const prepChartButton = () => {
    const newList = dateListBase.map(item => ({label: item.label, class: 'btn btn-primary'}));
    newList[0].class = 'btn btn-secondary'
    setMyGraph('Today')
    setDateList(newList);
  }

  const getFriendsMonthData = async ()=> {
    const getData = await friendData('month')
    const colour = []
    for (let i = 0; i < getData.friendData.length; i++) {
      const newColour = coloursForDataset()
      colour.push(newColour)
    }
    setColoursFriends(colour)
    setMyFriendsMonthData(getData)
  }

  useEffect(() => {
    goalDataFromDb()
    getFriendsMonthData()
    prepChartButton()
  }, [loginButton])

  useEffect(() => {
    const dayChart = transformDayData(daysData)
    setTodayLabels(dayChart.labels)
    setTodayValues(dayChart.values)
  }, [daysData])



  if(!auth()){
    return (
      <>
        <MainNavbar auth={auth} setUser={setUser} setLoginButton={setLoginButton}
                    loginButton={loginButton} setScoreHeader={setScoreHeader} scoreHeader={scoreHeader} />
        <NotLoggedInYet setUser={setUser} />
      </>)
  }

  const goalButtons = goals.map((goal, index) => (
    <Button id={goal.name} className={ goal.state  ? "btn btn-success" : "btn btn-primary" }
            onClick={(e) => {
              goals[index].state = !goals[index].state;
              addGoalToDb(e.target.id)
              setGoals([...goals]);
              if(goals[index].state){
                dayScore++
              } else {
                dayScore--
              }

              const scoreChange = {points:dayScore, goal:goals[index].name, time:moment().format('h:mm:ss a')}
              setDaysData([...daysData, scoreChange])
              setDayScore(dayScore)
            }
    } >{goal.name}</Button>
  ))

  const dateButtons = dateList.map((date, index) => (
    <Button className={date.class} id={date.label} onClick={() => {
      const newList = dateListBase.map(item => ({label: item.label, class: 'btn btn-primary'}));
      newList[index].class = 'btn btn-secondary'
      setMyGraph(date.label)
      setDateList(newList);
    }}>{date.label}</Button>
  ))

  return (
    <>
      <MainNavbar setUser={setUser} setLoginButton={setLoginButton} loginButton={loginButton}
                  cleanupLogout = {cleanupLogout} dayScore={dayScore} setDayScore={setDayScore}
                  setScoreHeader={setScoreHeader} scoreHeader={scoreHeader}/>
      <Container>
        <Row className={"mt-2"}>
          <ButtonGroup>
            {goalButtons}
          </ButtonGroup>
        </Row>
        <Row className={"mt-3"}>
        </Row>
        <Row className={"mt-3"}>
          <Col></Col>
          <Col xl={12}>
            {myGraph === 'Today' ? <TodayChart todayLabels={todayLabels} todayValues={todayValues} user={user} coloursFriends={coloursFriends} /> : null}
            {myGraph === 'Weekly' ? <WeeklyChart todayValues={todayValues} user={user} coloursFriends={coloursFriends} /> : null}
            {myGraph === 'Monthly' ? <MonthlyChart todayValues={todayValues} user={user}
                                                   myFriendsMonthData={myFriendsMonthData} coloursFriends={coloursFriends}/> : null}
            {myGraph === 'Yearly' ? <YearlyChart todayValues={todayValues} user={user} coloursFriends={coloursFriends}/> : null}
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <ButtonGroup>
            {dateButtons}
          </ButtonGroup>
        </Row>
        <Row>
        </Row>
      </Container>
    </>
  );
}
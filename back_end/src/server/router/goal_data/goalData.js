const express = require('express');
const router = express.Router();
const {authGuard} = require("../../../middleware");
const bcrypt = require('bcrypt')
const moment = require('moment')
const {dbClient} = require("../../../data_base");

// BLOCK ROUTES - router.use(authGuard);

router.use(authGuard)

// /api/goals?days=1
const dateRangeQuery = (dateRange) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * from public.goal_data WHERE user_id = $1 AND goal_day >= $2 AND goal_day <= $3`,
    values: dateRange
  };
}

router.get('/weekly', async (req, res) => {
  const id = req.session.user.id
  let startDate = moment();
  let endDate = moment();
  startDate.subtract(6, 'days')
  endDate.subtract(1, 'days')
  const queryYesterday = [ id, startDate, endDate]

  let yestScore = 0
  let befYScore = 0
  let befUScore = 0
  let befIScore = 0
  let befOScore = 0
  let befPScore = 0

  try {
    const thisWeek = await dbClient.query(dateRangeQuery(queryYesterday))
    console.log(thisWeek.rows.length)

    const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
    const dayBefY = moment().subtract(2, 'days').format('YYYY-MM-DD')
    const dayBefU = moment().subtract(3, 'days').format('YYYY-MM-DD')
    const dayBefI = moment().subtract(4, 'days').format('YYYY-MM-DD')
    const dayBefO = moment().subtract(5, 'days').format('YYYY-MM-DD')
    const dayBefP = moment().subtract(6, 'days').format('YYYY-MM-DD')

    thisWeek.rows.forEach((goal) => {

      const day = moment(goal.goal_day)
      console.log(day)

      if(moment(yesterday).isSame(day)){
        console.log('yesterday')
        yestScore ++
      }
      if(moment(dayBefY).isSame(day)){
        befYScore ++
      }
      if(moment(dayBefU).isSame(day)){
        befUScore ++
      }
      if(moment(dayBefI).isSame(day)){
        befIScore ++
      }
      if(moment(dayBefO).isSame(day)){
        befOScore ++
      }
      if(moment(dayBefP).isSame(day)){
        console.log('last day')
        befPScore ++
      }
    })
    const weeklyList = [yestScore, befYScore, befUScore, befIScore, befOScore, befPScore]
    weeklyList.reverse()
    res.json( {data: weeklyList} )
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

router.get('/monthly', async (req, res) => {
  const id = req.session.user.id

  const thisMonthStart = moment().subtract(1, 'week')
  const lastMonthStart = moment().subtract(2, 'week')
  const thirdMonthStart = moment().subtract(3, 'week')
  const fourthMonthStart = moment().subtract(4, 'week')
  const thisMonthEnd = moment().subtract(1, 'days')
  const lastMonthEnd = moment().subtract(1, 'week')
  const thirdMonthEnd = moment().subtract(2, 'week')
  const fourthMonthEnd = moment().subtract(3, 'week')

  const queryThisMonth = [ id, thisMonthStart, thisMonthEnd]
  const queryLastMonth = [ id, lastMonthStart, lastMonthEnd]
  const queryThirdMonth = [ id, thirdMonthStart, thirdMonthEnd]
  const queryFourthMonth = [ id, fourthMonthStart, fourthMonthEnd]

  let thisM = 0
  let lastM = 0
  let befLM = 0
  let befBLM = 0

  try {
    const thisMonth = await dbClient.query(dateRangeQuery(queryThisMonth))
    const lastMonth = await dbClient.query(dateRangeQuery(queryLastMonth))
    const thirdMonth = await dbClient.query(dateRangeQuery(queryThirdMonth))
    const fourthMonth = await dbClient.query(dateRangeQuery(queryFourthMonth))
    console.log(thisMonth.rows.length)

    thisMonth.rows.forEach((row) => { thisM ++ })
    lastMonth.rows.forEach((row) => { lastM ++ })
    thirdMonth.rows.forEach((row) => { befLM ++ })
    fourthMonth.rows.forEach((row) => { befBLM ++ })

    const monthlyList = [befBLM, befLM, lastM, thisM]
    res.json( {data: monthlyList} )
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

router.get('/yearly', async (req, res) => {
  const id = req.session.user.id
  //Months from 1 to 12 score = M1-M12
  //Months Start = M1S end = M1E
  //Months List = M1L
  //Months query = M1Q
  //Months DB = M1DB

  let m1 = 0
  let m2 = 0
  let m3 = 0
  let m4 = 0
  let m5 = 0
  let m6 = 0
  let m7 = 0
  let m8 = 0
  let m9 = 0
  let m10 = 0
  let m11 = 0
  let m12 = 0

  const m1s = moment().startOf('month').subtract(0, 'month')
  // m1 is goooood
  //console.log('m1s is ', m1s)
  const m2s = moment().startOf('month').subtract(1, 'month')
  //console.log('m2s is ', m2s)
  const m3s = moment().startOf('month').subtract(2, 'month')
  const m4s = moment().startOf('month').subtract(3, 'month')
  const m5s = moment().startOf('month').subtract(4, 'month')
  const m6s = moment().startOf('month').subtract(5, 'month')
  const m7s = moment().startOf('month').subtract(6, 'month')
  const m8s = moment().startOf('month').subtract(7, 'month')
  //console.log('oct? ', m7s)
  const m9s = moment().startOf('month').subtract(8, 'month')
  const m10s = moment().startOf('month').subtract(9, 'month')
  const m11s = moment().startOf('month').subtract(10, 'month')
  const m12s = moment().startOf('month').subtract(11, 'month')
  //console.log('m12s is ', m12s)
  const m1e = moment().subtract(1, 'days')
  // m1 is goooood
  const m2e = moment().endOf('month').subtract(1, 'month')
  //console.log('m2e is ', m2e)
  const m3e = moment().endOf('month').subtract(2, 'month')
  const m4e = moment().endOf('month').subtract(3, 'month')
  const m5e = moment().endOf('month').subtract(4, 'month')
  const m6e = moment().endOf('month').subtract(5, 'month')
  const m7e = moment().endOf('month').subtract(6, 'month')
  const m8e = moment().endOf('month').subtract(7, 'month')
  //console.log('sep? ', m8e)
  const m9e = moment().endOf('month').subtract(8, 'month')
  const m10e = moment().endOf('month').subtract(9, 'month')
  const m11e = moment().endOf('month').subtract(10, 'month')
  const m12e = moment().endOf('month').subtract(11, 'month')
  //console.log('m12e is ', m12e)

  const m1q = [ id, m1s, m1e]
  const m2q = [ id, m2s, m2e]
  const m3q = [ id, m3s, m3e]
  const m4q = [ id, m4s, m4e]
  const m5q = [ id, m5s, m5e]
  const m6q = [ id, m6s, m6e]
  const m7q = [ id, m7s, m7e]
  const m8q = [ id, m8s, m8e]
  const m9q = [ id, m9s, m9e]
  const m10q = [ id, m10s, m10e]
  const m11q = [ id, m11s, m11e]
  const m12q = [ id, m12s, m12e]

  try{

    const m1db = await dbClient.query(dateRangeQuery(m1q))
    const m2db = await dbClient.query(dateRangeQuery(m2q))
    const m3db = await dbClient.query(dateRangeQuery(m3q))
    const m4db = await dbClient.query(dateRangeQuery(m4q))
    const m5db = await dbClient.query(dateRangeQuery(m5q))
    const m6db = await dbClient.query(dateRangeQuery(m6q))
    const m7db = await dbClient.query(dateRangeQuery(m7q))
    const m8db = await dbClient.query(dateRangeQuery(m8q))
    const m9db = await dbClient.query(dateRangeQuery(m9q))
    const m10db = await dbClient.query(dateRangeQuery(m10q))
    const m11db = await dbClient.query(dateRangeQuery(m11q))
    const m12db = await dbClient.query(dateRangeQuery(m12q))

    m1db.rows.forEach((row) => { m1 ++ })
    m2db.rows.forEach((row) => { m2 ++ })
    m3db.rows.forEach((row) => { m3 ++ })
    m4db.rows.forEach((row) => { m4 ++ })
    m5db.rows.forEach((row) => { m5 ++ })
    m6db.rows.forEach((row) => { m6 ++ })
    m7db.rows.forEach((row) => { m7 ++ })
    m8db.rows.forEach((row) => { m8 ++ })
    m9db.rows.forEach((row) => { m9 ++ })
    m10db.rows.forEach((row) => { m10 ++ })
    m11db.rows.forEach((row) => { m11 ++ })
    m12db.rows.forEach((row) => { m12 ++ })

    const yearlyList = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12]
    yearlyList.reverse()
    res.json( {data: yearlyList} )
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

router.get('/', async (req,res) => {
  //https://momentjs.com/docs/#/displaying/format/
  //const today = [ req.session.user.id, moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD') ] //'2023-01-30'
  const id = req.session.user.id
  const endDate = moment();
  const startDate = moment();
  if(req.query.days) {
    startDate.subtract(req.query.days, 'days')
  }

  if(req.query.weeks) {
    startDate.subtract(req.query.weeks, 'weeks')
  }

  if(req.query.months) {
    startDate.subtract(req.query.months, 'months') //7
  }

  const queryParams = [ id, startDate, endDate]

  try {
    const goalData = await dbClient.query(dateRangeQuery(queryParams))

    console.log('dateRange query', goalData.rows)

    res.json( {data: goalData.rows} )
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

// const addGoalPoints = (goalInfo) => {
//   return {
//     //name: 'insert-new-post',
//     text: `INSERT INTO public.user (username, email, password)
//            VALUES ($1, $2, $3)
//            RETURNING id`,
//     values: user
//   };
// }

const addGoalType = (type) => {
  return {
    text: `INSERT INTO public.goal_types (goal, user_id)
           VALUES ($1, $2)
           RETURNING id`,
    values: type
  };
}

const addGoalPoint = (data) => {
  return {
    text: `INSERT INTO public.goal_data (goal_type_id, goal_day, goal_time, user_id)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
    values: data
  };
}

const todayQuery = (data) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * from public.goal_data WHERE goal_type_id = $1 AND goal_day = $2 AND user_id = $3`,
    values: data
  };
}

const deleteTodayPoint = (id) => {
  return {
    text: `DELETE FROM goal_data WHERE id = $1
    RETURNING id`,
    values: id
  };
}

const goalTypesQuery = (data) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * FROM public.goal_types WHERE user_id = $1`,
    values: data
  };
}

router.get('/goal/types', async (req,res) => {
  try {
    console.log('types started')
    const id = [req.session.user.id]
    const getUserGoals = await dbClient.query(goalTypesQuery(id))
    const goalList = []
    getUserGoals.rows.forEach((goal)=> goalList.push({id: goal.id, text: goal.goal}))
    const thisUser = req.session.user.name
    res.json({goalTypes: goalList, user: thisUser})
    res.status(200)
  } catch (e) {
    console.log('error in types')
    res.status(400)
  }
})


router.post('/', async (req, res) => {
  let dbGoalTypes
  try {
    const goalTypes = await dbClient.query(goalTypesQuery([req.session.user.id]))
    dbGoalTypes = goalTypes.rows.filter((type) => type.goal === req.body.type)
    if(!dbGoalTypes[0]){
      const goalToAdd = [req.body.type, req.session.user.id]
      const newGoalType = await dbClient.query(addGoalType(goalToAdd))
      dbGoalTypes.push({id: newGoalType.rows[0].id})
    }
  } catch (e) {
    console.log(e)
    res.status(400)
    return
  }
  try {
    //console.log(dbGoalTypes[0].id)
    //console.log('posting', req.body.type, req.body.date)
    const newGoalDataNoTime = [dbGoalTypes[0].id, req.body.date, req.session.user.id]
    const newGoalData = [dbGoalTypes[0].id, req.body.date, req.body.myTime, req.session.user.id]

    const checkDbToday = await dbClient.query(todayQuery(newGoalDataNoTime))
    if(checkDbToday.rowCount){
      const deleteId = [checkDbToday.rows[0].id]
      //console.log('already clicked today ', checkDbToday.rows[0].id)
      const deleteGoal = await dbClient.query(deleteTodayPoint(deleteId))
      //console.log (deleteId, ' deleted from goal score', deleteGoal.rows[0].id)
      res.json({msg: 'goal deleted, already clicked'})
      res.status(200)
      return
    }
    const addPoint = await dbClient.query(addGoalPoint(newGoalData))
   //console.log('add point', addPoint.rows[0].id)
    res.json({msg: 'ok'})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

// router.patch('/', async(req,res) => {
//   try {
//     console.log('updating user')
//   } catch (err) {
//     console.log(err);
//     res.status(500);
//     res.json({ err: "something went wrong" });
//   }
// });


// router.delete('/', async (req,res) => {
//   try {
//     console.log('deleting user')
//   } catch (err) {
//     console.log(err);
//     res.status(500);
//     res.json({ err: "something went wrong" });
//   }
// });

module.exports = router
const express = require('express');
const router = express.Router();
const {authGuard} = require("../../../middleware");
const bcrypt = require('bcrypt')
const moment = require('moment')
const {dbClient} = require("../../../data_base");
const {weekCharting} = require("../goal_data/dataFunctions/weekchart.js")
const {monthCharting} = require("../goal_data/dataFunctions/monthchart.js")
//const {dateRangeQuery, goalFriendsQuery} = require("../../model/clientQueries.js")
const {dateRangeQuery} = require("../../model/goal_data.js")
const {yearCharting} = require("./dataFunctions/yearchart");
const {myDayCharting} = require("./dataFunctions/daychart");
const {completeFriendData} = require("./userFunctions/friendsFunctions");
const {addGoalType, goalTypesQuery} = require('../../model/goal_types.js')
const {addGoalPoint, todayQuery, deleteTodayPoint} = require('../../model/goal_data.js')


// BLOCK ROUTES - router.use(authGuard);

router.use(authGuard)

router.get('/friend/data', async (req,res) => {
  const format = req.query.format
  console.log('my query format is ', format)
  const userId = req.session.user.id
  try {
    const friendData = await completeFriendData(userId, format)
    console.log("friend data before it's sent back to front end", friendData)
    //console.log(friendData)
    res.json({friendData})
    res.status(200)
  } catch (e) {
    res.json({msg: "something went wrong"})
    res.status(400)
  }
})


router.get('/chart/week', async(req, res) => {
  try {
    const week = await weekCharting(req.session.user.id)
    res.json({data: week})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

router.get('/chart/month', async(req, res) => {
  try {
    const months = await monthCharting(req.session.user.id)
    res.json({data: months})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})



router.get('/chart/year', async(req, res) => {
  try {
    const year = await yearCharting(req.session.user.id)
    res.json({data: year})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

router.get('/chart/day', async(req, res) => {
  try {
    const day = await myDayCharting(req.session.user.id)
    res.json({data: day.rows})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

router.get('/', async (req,res) => {
  const id = req.body.id ?? req.session.user.id
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
    res.json( {data: goalData.rows} )
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

/*const addGoalType = (type) => {
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
}*/

router.get('/goal/types', async (req,res) => {
  try {
    console.log('types started')
    const id = [req.session.user.id]
    const getUserGoals = await dbClient.query(goalTypesQuery(id))
    //const goalList = []
    const goalList = getUserGoals.rows.map((goal)=> ({id: goal.id, text: goal.goal}))
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
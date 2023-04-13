const moment = require("moment/moment");
const {dbClient} = require("../../../../data_base");
const {dateRangeQuery} = require("../../../model/goal_data")

const weekCharting = async (id) =>{
  const promises = [];
  for(let i = 1; i < 7; i++){
    const start = moment().subtract(i, 'days').format('YYYY-MM-DD')
    const end = start
    console.log('start date ', start, 'number ', i)
    console.log('end date ', end, 'number ', i)
    //months.push([id, start, end])
    const monthData = dbClient.query(dateRangeQuery([id, start, end]));
    promises.push(monthData)
  }
  const returnedMonths = await Promise.all(promises)
  console.log(returnedMonths)
  const months = returnedMonths.map((month) => month.rowCount)
  return months.reverse()
}

module.exports = {
  weekCharting
}
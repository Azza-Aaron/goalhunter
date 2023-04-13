const moment = require("moment/moment");
const {dbClient} = require("../../../../data_base");
const {dateRangeQuery} = require("../../../model/clientQueries.js")

const monthCharting = async (id) => {
  const promises = [];
  for(let i = 0; i < 4; i++){
    let start = moment().startOf('week').subtract(i, 'week')
    let end = i === 0 ? moment().subtract(1, 'days') : moment(start).endOf('week');
    if(start.isSame(new moment(), 'day')){
      console.log('is same, set no value return')
      start = moment('2000-01-01')
      end = moment('2000-01-01')
    }
    console.log('start date ', start, 'number ', i)
    console.log('end date ', end, 'number ', i)
    //months.push([id, start, end])
    const monthData = dbClient.query(dateRangeQuery([id, start, end]));
    promises.push(monthData)
  }
  const returnedMonths = await Promise.all(promises)
  console.log(returnedMonths)
  const months = returnedMonths.map((month) => month.rows.length)
  return months.reverse()
}


module.exports = {
  monthCharting
}
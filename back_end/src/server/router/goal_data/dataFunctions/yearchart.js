const moment = require("moment/moment");
const {dbClient} = require("../../../../data_base");
const {dateRangeQuery} = require("../../../model/clientQueries.js")



const yearCharting = async (id) => {
  const promises = [];
  for(let i = 0; i < 12; i++){
    const start = moment().startOf('month').subtract(i, 'month').add(1, 'day');
    const end = i === 0 ? moment().subtract(1, 'days') : moment().endOf('month').subtract(i, 'month');
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
  yearCharting
}
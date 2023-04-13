const moment = require("moment/moment");
const {dbClient} = require("../../../../data_base");
const {dateRangeQuery} = require("../../../model/goal_data")


const myDayCharting = async (id) => {
  const endDate = moment().format('YYYY-MM-DD')
  const startDate = moment().format('YYYY-MM-DD')
  const queryParams = [ id, startDate, endDate]
  console.log(endDate, startDate)
  return await dbClient.query(dateRangeQuery(queryParams))
}

const friendDayCharting = async (id) => {
  const endDate = moment().format('YYYY-MM-DD')
  const startDate = moment().format('YYYY-MM-DD')
  const queryParams = [ id, startDate, endDate]
  const getData =  await dbClient.query(dateRangeQuery(queryParams))
  return getData.rows.length
}



module.exports = {
  myDayCharting,
  friendDayCharting
}
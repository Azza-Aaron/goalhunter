const moment = require("moment/moment");
const {dbClient} = require("../../../../data_base");
const {dateRangeQuery} = require("../../../model/goal_data")

const monthCharting = async (id) => {
  const promises = [];
  for(let i = 0; i < 4; i++){
    let start = moment().startOf('week').subtract(i, 'week')
    let end = i === 0 ? moment().subtract(1, 'day') : moment(start).endOf('week');
    if(start.isSame(new moment(), 'day')){
      start = moment('2000-01-01')
      end = moment('2000-01-01')
    }
    //months.push([id, start, end])
    const monthData = dbClient.query(dateRangeQuery([id, start, end]));
    promises.push(monthData)
  }
  const returnedMonths = await Promise.all(promises)
  const months = returnedMonths.map((month) => month.rowCount)
  return months.reverse()
}


module.exports = {
  monthCharting
}
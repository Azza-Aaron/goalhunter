const {Client, Pool} = require("pg")
const {checkLoggedInTable} = require("./init.js")
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session)

const config = process.env.NODE_ENV === 'dev' ? {
  user: process.env.DB_USER ?? "postgres",
  host: process.env.DB_HOST ?? "localhost",
  database: process.env.DB ?? "postgres",
  password: process.env.DB_PASSWORD ?? "password",
  port: process.env.DB_PORT ?? 5432,
} : {connectionString: process.env.DATABASE_URL}

const client = new Client(config)
client.connect();
const pgSes = new pgSession({
  pool: new Pool(config),
  createTableIfMissing: true
})

checkLoggedInTable(client).then(result => {
  if(result){
    console.log('table plated')
  }
})


module.exports = {
  dbClient: client,
  pgSes
}

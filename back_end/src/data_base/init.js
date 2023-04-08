

//CREATE TABLE

const createUser = `
CREATE TABLE IF NOT EXISTS "user"
(
  id SERIAL PRIMARY KEY,
  username VARCHAR(25),
  email VARCHAR(255),
  password VARCHAR(100)
)`;

const readyMadeMessages = `
CREATE TABLE IF NOT EXISTS "messages"
(
  id SERIAL PRIMARY KEY,
  message TEXT
)`;

const messageNotifications = `
CREATE TABLE IF NOT EXISTS "message_notifications"
(
  message TEXT,
  from_user TEXT,
  status varchar(20),
  user_id INT,
  date_time varchar(30),
  CONSTRAINT fk_user
      FOREIGN KEY(user_id)
          REFERENCES "user"(id)
)`;


const createGoalTypes = `
CREATE TABLE IF NOT EXISTS "goal_types"
(
  id SERIAL PRIMARY KEY,
  goal TEXT,
  user_id INT,
  CONSTRAINT fk_user
      FOREIGN KEY(user_id)
          REFERENCES "user"(id)
)`;

const createGoalData = ` 
CREATE TABLE IF NOT EXISTS "goal_data"
(
  id SERIAL PRIMARY KEY,
  goal_type_id INT,
  goal_day date, 
  goal_time VARCHAR(25),
  user_id INT,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
        REFERENCES "user"(id),
  CONSTRAINT fk_goal_type
      FOREIGN KEY(goal_type_id)
          REFERENCES "goal_types"(id)
)`;

const createFriendData = `
CREATE TABLE IF NOT EXISTS  "friend_data"
(
    friend_id INT,
    user_id INT,
    status VARCHAR(10),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES "user"(id),
    CONSTRAINT fk_friend
        FOREIGN KEY(friend_id)
            REFERENCES "user"(id)
)`

/*
  who created the message
  who the message is to
  what is the premade message id <- similar to the goal types
  is the message read
 */
// { //todo make table
//   message_owner_id: int,
//   message_recipeint_id: int,
//   message_id: int, //foriegn key to premade message table //todo make premade table
//   message_read: boolean
// }

const arrayMessages = [
  "Great work!",
  "Keep it up!",
  "You go go gadget!",
  "Wow look at that progress!",
  "I'm proud of you partner!",
  "Terrific goal keeping!",
  "Lets progress together!",
  "Every step forward helps!",
  "Little things make big things!",
  "I think you're amazing!",
  "How are you this good?!",
  "Every point is like a pay rise!",
  "Oh my, love your work!",
  "Kicking goals like Ronaldo!",
  "Work hard but stay healthy!",
  "Someone told me your a genius :)",
  "Keep pushing, you got this!",
  "Your goal work is astounding!",
  "Keeping track like Usain Bolt!"
]

const insertMessageArray = (line) => {
  return {
    text: `INSERT INTO public.messages (message)
           VALUES ($1)`,
    values: line
  };
}


const checkLoggedInTable = async (client) => {
  const addMessagesToDb = async (line) => { client.query(insertMessageArray([line]))}
  try {
    await client.query(createUser)
    await client.query(createGoalTypes)
    await client.query(createGoalData)
    await client.query(createFriendData)
    await client.query(readyMadeMessages)
    await client.query(messageNotifications)

    const rowCheck = await client.query('SELECT * FROM public.messages')
    if(!rowCheck.rows.length){
      let promises = []
      arrayMessages.forEach((line) => {
        promises.push(addMessagesToDb(line))
      })
      await Promise.all(promises)
    }
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

module.exports = {
  checkLoggedInTable
}
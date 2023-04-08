const express = require('express');
const router = express.Router();
const {authGuard} = require("../../../middleware");
const bcrypt = require('bcrypt')
const {dbClient} = require("../../../data_base");
const client = dbClient

// BLOCK ROUTES - router.use(authGuard);

const saltRounds = 10

async function saltHash(password) {
  const salt = await bcrypt.genSalt(saltRounds)
  return bcrypt.hash(password, salt)
}

const validateUserPreppedQuery = (user) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT * from public.user WHERE email = $1`,
    values: user
  };
}

router.post('/', async (req,res) => {
  try {
    console.log(req.body)
    const dbQuery = await client.query(validateUserPreppedQuery([req.body.email]))
      if(await bcrypt.compare(req.body.password, dbQuery.rows[0].password)){

      console.log('password matches')
        req.session.user = {
          name: dbQuery.rows[0].username,
          id: dbQuery.rows[0].id,
          somethingNew: 'new stuff here',
          verified: true
        }
        res.json({msg: 'logged in', username: dbQuery.rows[0].username, id: dbQuery.rows[0].id})
        res.status(200)
    }
    console.log(dbQuery.rows[0])
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})


const userExistsQuery = (email) => {
  return {
    //name: 'insert-new-post',
    text: `SELECT id from public.user WHERE email = $1`,
    values: email
  };
}

const createUserPreppedQuery = (user) => {
  return {
    //name: 'insert-new-post',
    text: `INSERT INTO public.user (username, email, password)
           VALUES ($1, $2, $3)
           RETURNING id`,
    values: user
  };
}

router.post('/create', async (req, res) => {
  //{username: 'name', password: 'password', email: '@gmail'}
  console.log('here', req.body);
  try {
    if(!req.body.username || !req.body.email || !req.body.password){
      console.log('incorrect data supplied')
      res.status(400)
      return
    }
    const emailZero = [req.body.email]
    const userExists = await client.query(userExistsQuery(emailZero))
    if(userExists.rowCount){
      console.log('user exists')
      res.json({msg: 'user exists, shut it down'})
      res.status(200)
      return
    }

  } catch (e) {
    console.log(e)
    res.status(400)
    return
  }
  try {
    const hashedPassword = await saltHash(req.body.password)
    const newUser = [req.body.username, req.body.email, hashedPassword]
    const dbQuery = await client.query(createUserPreppedQuery(newUser))
    const row = dbQuery.rows[0];
    console.log(row)
    console.log('making new user')
    res.json({msg: 'new user created', id: row.id})
    res.status(200)
  } catch (e) {
    console.log(e)
    res.status(400)
  }
})

router.patch('/', async(req,res) => {
  try {
    console.log('updating user')
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ err: "something went wrong" });
  }
});


router.delete('/delete', async (req,res) => {
  try {
    req.session.destroy()
    res.json({msg: 'session ended'})
    res.status(200)
    console.log('deleting user')
  } catch (err) {
    console.log(err);
    res.status(500);
    res.json({ err: "something went wrong" });
  }
});

module.exports = router
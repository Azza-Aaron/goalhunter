
import * as yup from 'yup'
import YupPassword from 'yup-password'
YupPassword(yup) // extend yup

export let userSchema = yup.object({
  username: yup.string().required(),
  email: yup.string().email('must be a valid email').required(),
  password: yup.string()
    .max(15, 'max password length is 15 characters.')
    .min(
      8,
      'password must contain 8 or more characters with at least one of each: uppercase, lowercase, number'
    )
    .minLowercase(1, 'password must contain at least 1 lower case letter')
    .minUppercase(1, 'password must contain at least 1 upper case letter')
    .minNumbers(1, 'password must contain at least 1 number')
    //.minSymbols(1, 'password must contain at least 1 special character')
    .required()
}).required()


export const validateUser = async (email, password, setValidFormText, setValidFormTextColor) => {
  console.log('started here')
  try{
    const checkValid = await fetch( '/api/user',  {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    })
    console.log(checkValid)
    const data = await checkValid.json()
    if(data.msg === 'logged in'){
      return {status: 200, username: data.username, id: data.id}
    } else {
      setValidFormText("Invalid information, please create new account!")
      setValidFormTextColor("text-danger")
      return false
    }
  } catch (e) {
    setValidFormText("Invalid information, please create new account!")
    setValidFormTextColor("text-danger")
    console.log(e)
    return false
  }
}
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import {useEffect, useState} from "react";
import {validateUser} from "../serverRequests/validateUser";
import {FormOnly} from "./formOnly";
import {auth} from "../index"
import {logout} from "../serverRequests/logout";


export function LoginForm({close, accountModal, setUser, setLoginButton, loginButton, cleanupLogout}) {
  const [formValidated, setFormValidated] = useState(false);
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('user')
  const [password, setPassword] = useState('')
  const [validFormText, setValidFormText] = useState("We'll never share your email with anyone else.")
  const [validFormTextColor, setValidFormTextColor] = useState('text-muted')
  const [fullScreen, setFullScreen] = useState(false)
  const isAuth = auth()

  useEffect(() => {
    if(isAuth){
      const thisUser = sessionStorage.getItem('user')
      const myUser = JSON.parse(thisUser)
      setUsername(myUser.username)
    }
  }, [isAuth])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
    } else {
      let validation
      console.log('start')
      try{
        validation = await validateUser(email, password, setValidFormText, setValidFormTextColor)
      } catch (e) {
        setValidFormTextColor("text-danger")
        setValidFormText("Invalid information, please create new account!")
        return
      }

      if (validation.status === 200) {
        setUsername(validation.username)
        sessionStorage.setItem("user", JSON.stringify(validation))
        setUser(validation.username)
        close('login')
        console.log(loginButton)
        const myButton = `Welcome ${validation.username}`
        setLoginButton(myButton)
        console.log(loginButton)
      } else {
        setValidFormText("Invalid information, please create new account!")
        setValidFormTextColor("text-danger")
        console.log('invalid user')
      }
    }
    setFormValidated(true);
  };

  const logMeOut = async () => {
    cleanupLogout()
    const loggingOut = await logout()
    if(loggingOut){
      const myButtonNow = 'Login'
      setLoginButton(myButtonNow)
    } else {
      console.log('something went wrong')
    }
  }

  const newAccount = () => {
    close('login')
    accountModal()
  }

  const openFullscreen = () => {
    setFullScreen(!fullScreen)
    if(!fullScreen){
      document.getElementById('tutImage')?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <>
    { isAuth ?
      <>
        <p>Hi {username} You're all logged in!</p>
        <label style={{fontSize: '12px'}}>Learn about me!</label>
        <Image thumbnail id={'tutImage'} src={'goal_tutorial.png'} alt={'tutorial'} onClick={openFullscreen}></Image>
        <Button onClick={logMeOut} className={'mt-2'} >Logout</Button>
      </>
      :
  <FormOnly validated={formValidated} handleSubmit={handleSubmit} setEmail={setEmail} setPassword={setPassword}
            newAccount={newAccount} validFormText={validFormText} validFormTextColor={validFormTextColor}/> }
    </>
);
}
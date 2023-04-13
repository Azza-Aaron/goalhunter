import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {useEffect, useState} from "react";
import {LoginModal} from "../modal/loginModal";
import {CreateAccountModal} from "../modal/createAccountModal";
import {NotificationModal} from "../modal/notificationsModal";
import {FriendsModal} from "../modal/friendsModal";
import {auth} from "../index";

export function MainNavbar({setUser, setLoginButton, loginButton, cleanupLogout, dayScore, scoreHeader, setScoreHeader}) {
  const [showLogin, setShowLogin] = useState(false)
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showFriends, setShowFriends] = useState(false)

  useEffect(() => {
    if(!auth()){
      setShowLogin(true)
      setScoreHeader('Track Your Effort!')
    }
  }, [])

  useEffect(() => {
    if(dayScore){
      setScoreHeader(dayScore < 5 ? ` My Goal Score ${dayScore}` : 'Well Done!')
    } else {
      setScoreHeader('Track Your Effort!')
    }
  }, [dayScore])

  const handleModalClose = (modal) => {
    switch(modal){
      case 'login':
        setShowLogin(false)
        break
      case 'create':
        setShowCreateAccount(false)
        break
      case 'notify':
        setShowNotifications(false)
        break
      case 'friend':
        setShowFriends(false)
    }
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home" className={"text-center"}>GoalHunter</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {auth() ? <NavDropdown title="Friends" id="collasible-nav-dropdown">
                <NavDropdown.Item onClick={() => setShowNotifications(true)}>Notifications</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => setShowFriends(true)}>
                  My Friends
                </NavDropdown.Item>
              </NavDropdown> : null}
              </Nav>
            <Navbar.Brand style={{marginRight: '40%'}}>{scoreHeader}</Navbar.Brand>
            <Nav>
              <Nav.Link onClick={() => setShowLogin(true)}>{loginButton}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {showLogin ? <LoginModal setLoginButton={setLoginButton} loginButton={loginButton} close={handleModalClose}
                               setUser={setUser} accountModal={() => setShowCreateAccount(true)}
                               cleanupLogout = {cleanupLogout} /> : null}
      {showCreateAccount ? <CreateAccountModal close={handleModalClose} /> : null}
      {showNotifications ? <NotificationModal close={handleModalClose} /> : null}
      {showFriends ? <FriendsModal close={handleModalClose} /> : null}
    </>
  );
}
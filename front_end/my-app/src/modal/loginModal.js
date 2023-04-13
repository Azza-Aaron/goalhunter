import Modal from 'react-bootstrap/Modal';
import {LoginForm} from "../login/loginForm";

export function LoginModal({setLoginButton, loginButton, close, accountModal, setUser, cleanupLogout}) {
  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'absolute'}}
    >
      <Modal show={true} onHide={() => close('login')}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginForm close={close} accountModal={accountModal} setUser={setUser} setLoginButton={setLoginButton}
                     loginButton={loginButton} cleanupLogout={cleanupLogout} />
        </Modal.Body>
      </Modal>
    </div>
  );
}


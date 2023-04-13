import Modal from 'react-bootstrap/Modal';
import{CreateAccountForm} from "../newAccount/createAccount";

export function CreateAccountModal({close}) {
  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'absolute'}}
    >
      <Modal show={true} onHide={() => close('create')}>
        <Modal.Header closeButton>
          <Modal.Title>Create Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateAccountForm close={close}/>
        </Modal.Body>
      </Modal>
    </div>
  );
}

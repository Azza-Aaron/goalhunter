import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {useState} from "react";
import {addNewUser} from "./addNewUserServer";
import {userSchema} from "../serverRequests/validateUser";

export function CreateAccountForm({close}) {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notValid, setNotvalid] = useState('We\'ll never share your email with anyone else.')
  const [notValidColor, setNotValidColor] = useState("text-muted")

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      let usersForm = {
        username: username,
        password: password,
        email: email
      }
      try {
        await userSchema.validate(usersForm)
      } catch (e) {
        event.preventDefault();
        event.stopPropagation();
        setNotvalid(`${e}`)
        setNotValidColor('text-danger')
        return
      }
      addNewUser(username, password, email)
      close('create')
    }
    setValidated(true);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control required type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control required type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        <Form.Text className={`${notValidColor}`}>
          {notValid}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control required type="password" placeholder="Password (Upper/Lowercase Letters & Numbers)" onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>
      <ButtonGroup>
        <Button variant="primary" type="submit"> Submit </Button>
      </ButtonGroup>
      <Form.Group className="mb-3">
        <Form.Check
          required
          label="Agree to terms and conditions"
          feedback="You must agree before submitting."
          feedbackType="invalid"
        />
      </Form.Group>
    </Form>
  );
}
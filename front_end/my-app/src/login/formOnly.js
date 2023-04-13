import Form from "react-bootstrap/Form";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

export const FormOnly = ({validated, handleSubmit, setEmail, setPassword, newAccount, validFormText, validFormTextColor}) => {
  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control required type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        <Form.Text className={`${validFormTextColor}`}>
          {validFormText}
        </Form.Text>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control required type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>
      <ButtonGroup>
        <Button variant="primary" type="submit"> Submit </Button>
        <Button variant="secondary" onClick={newAccount}> Create Account </Button>
      </ButtonGroup>
    </Form>
  )
}
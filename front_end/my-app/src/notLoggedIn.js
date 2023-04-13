import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

export function NotLoggedInYet () {
  return(
    <Container>
      <Row className={"mt-2"}>
        <Col></Col>
        <Col>
          <h1 style={{textAlign: 'center'}}>Welcome Goal Hunter</h1>
          <h4 style={{textAlign: 'center'}}>Login to track your goals!</h4>
        </Col>
        <Col></Col>
      </Row>
    </Container>
  )
}
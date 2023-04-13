import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem"
import {friendsRequestsFromDb} from "../serverRequests/friends/notifyFriendRequests";
import {blockInDb} from "../serverRequests/friends/block"
import {rejectInDb} from "../serverRequests/friends/rejectRequest.js"
import {acceptFriendDb} from "../serverRequests/friends/acceptFiend";
import {getMessagesDb} from "../serverRequests/notifications/getMessages";
import {deleteMessageDb} from "../serverRequests/notifications/deleteMessages";
import {updateMessageDb} from "../serverRequests/notifications/markRead";

export function NotificationModal({close}) {
  const [myFriendRequests, setMyFriendRequests] = useState([{}])
  const [msgList, setMsgList] = useState(['No Messages'])
  const [readList, setReadList] = useState(['No Read Messages'])

  const getFriendRequests = async () => {
    const getReq = await friendsRequestsFromDb()
    setMyFriendRequests(getReq)
  }

  const getMsgsDb = async () => {
    const list = await getMessagesDb()
    const read = list.filter((message) => message.read)
    const unread = list.filter((message) => !message.read)
    if(unread.length){
      setMsgList(unread)
    }
    if(read.length){
      setReadList(read)
    }
  }

  useEffect(() => {
    getMsgsDb()
    getFriendRequests()
  },[])

  console.log(msgList)

  const newMessages = msgList.map((message) => {
    if(message === 'No Messages'){
      return <ListGroupItem>No Messages</ListGroupItem>
    }
    return (
      <ListGroupItem variant="info">
        {message.username}: {message.message}
        <ButtonGroup id={message.id} style={{float: 'right'}}>
          <Button variant="success" id={message.id} onClick={ (e) => {
            readMessage(e.target.id)
          }}>Read</Button>
          <Button variant="info" id={message.id} onClick={ (e) => {
            removeMessage(e.target.id)
          }
          }>Delete</Button>
        </ButtonGroup>
      </ListGroupItem>
    )
  })

  const readMessages = readList.map((message) => {
    if(message === 'No Read Messages'){
      return <ListGroupItem>No Messages</ListGroupItem>
    }
    if(!message){return <ListGroupItem>No Messages</ListGroupItem>}
    return(
      <ListGroupItem variant="info">
        {message.username}: {message.message}
        <ButtonGroup style={{float: 'right'}}>
          <Button variant="info" id={message.id} onClick={ (e) =>{
            removeMessage(e.target.id)
          }}>Delete</Button>
        </ButtonGroup>
      </ListGroupItem>
    )
  })

  const readMessage = (e) => {
    let readMessage
    for (let i = 0; i < msgList.length; i++) {
      if(e.includes(msgList[i].id)){
        readMessage = msgList[i]
        break
      }
    }
    const updatedMsgList = msgList.filter((message) => message.id !== e)
    setMsgList(updatedMsgList)
    if(!updatedMsgList.length){
      setMsgList(["No Messages"])
    }
    if(readList[0] === "No Read Messages"){
      setReadList([readMessage])
    } else {
      const newReadList = [...readList]
      newReadList.push(readMessage)
      setReadList(newReadList)
    }
    const updateDb = updateMessageDb(e)
    console.log('updated on db ', updateDb)
  }

  const removeMessage = (e) => {
    const updatedMsgList = msgList.filter((message) => message.id !== e)
    const updatedReadList = readList.filter((message) => message.id !== e)
    setReadList(updatedReadList)
    setMsgList(updatedMsgList)
    if(!updatedMsgList.length){
      setMsgList(["No Messages"])
    }
    if(!updatedReadList.length){
      setReadList(["No Read Messages"])
    }
    const removeOnDb = deleteMessageDb(e)
    console.log('updated on db ', removeOnDb)
  }

  const removeFriendRequest = async (e) => {
    const editedList = myFriendRequests.filter((request) => request.id.toString() !== e.target.id)
    setMyFriendRequests(editedList)
    const reject = await rejectInDb(e.target.id)
    console.log(reject)
  }

  const acceptFriendRequest = async (e) => {
    const acceptInDb = await acceptFriendDb(e.target.id)
    console .log(acceptInDb)
    const editedList = myFriendRequests.filter((request) => request.id.toString() !== e.target.id)
    if(editedList.length){
      setMyFriendRequests(editedList)
    } else {
      setMyFriendRequests(false)
    }
    console.log('friend accepted yay!')
  }

  const blockRejected = async (e) => {
    const id = e.target.id
    const block = await blockInDb(id)
    console.log(block)
    const editedList = myFriendRequests.filter((request) => request.id.toString() !== e.target.id)
    setMyFriendRequests(editedList)
  }


  let friendRequests
  if(myFriendRequests){
    friendRequests = myFriendRequests.map(request => {
      return <ListGroup.Item variant="success">{request.username} would love to add you!
        <ButtonGroup style={{textAlignLast: 'right'}}>
          <Button id={request.id} variant="success" onClick={(e) => acceptFriendRequest(e)}>Accept</Button>
          <Button id={request.id} variant="info" onClick={(e) => removeFriendRequest(e)}>Reject</Button>
          <Button id={request.id} variant="danger" onClick={(e) => {
            blockRejected(e)
          }}> Block  </Button>
        </ButtonGroup>
      </ListGroup.Item>
    })
  }

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'absolute'}}
    >
      <Modal show={true} onHide={() => close('notify')}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Messages</h4>
          <ListGroup>
            {newMessages}
          </ListGroup>
          <h4>Read Messages</h4>
          <ListGroup>
            {readMessages}
          </ListGroup>
          <h4>Friend Requests</h4>
          <ListGroup>
          { friendRequests ?
            <ListGroupItem>{friendRequests}</ListGroupItem>
          : <ListGroupItem> No current friend requests </ListGroupItem>}
            </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
}

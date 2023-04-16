import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ListGroupItem from "react-bootstrap/ListGroupItem"
import {friendRequestToDb} from "../serverRequests/friends/addFriendsRequests.js"
import {friendsFromDb} from "../serverRequests/friends/myFriends";
import {sendMessageDb} from "../serverRequests/notifications/sendMessage";
import {rejectInDb} from "../serverRequests/friends/rejectRequest";

export function FriendsModal({close}) {
  const [addFriend, setAddFriend] = useState(false)
  const [friendsList, setFriendsList] = useState([''])
  const [requestFriend, setRequestFriend] = useState('')


  const getFriends = async () => {
    const importedFriendList = await friendsFromDb()
    setFriendsList(importedFriendList)
    console.log(friendsList)
  }

  useEffect(() => {
    getFriends()
  }, [])

  const sendEnc = async (friendId) => {
    const sentMessage = await sendMessageDb(friendId)
    const updateBox = document.getElementById(`encMsg${friendId}`)
    if(sentMessage !== "Friends inbox is full, please try again later."){
      updateBox.innerText = `You sent: ${sentMessage}`
      return
    }
    updateBox.innerText = sentMessage
  }

  const friendsDisplay = friendsList.map((friend) => (
      <ListGroup.Item style={{textAlign: 'center'}} id={friend.id}> {friend.username}
        <ButtonGroup style={{float: 'right'}}>
          <Button variant="success" id={friend.id} onClick={
            (e) => {
              const friendId = Number(e.target.id)
              sendEnc(friendId)
            }
          }> Send Encouragement </Button>
          <Button variant="danger" id={friend.id} onClick={(e) => {
            removeFriend(e)
            const friendId = Number(e.target.id)
            rejectInDb(friendId)
          }}>Remove</Button>
        </ButtonGroup>
        <br></br> <br></br>
        <div id={`encMsg${friend.id}`}></div>
      </ListGroup.Item>
    ))

  const removeFriend = (e) => {
    const editedList = friendsList.filter((friend) => {
      if(`${friend.id}` !== e.target.id){
        return true
      }
    })
    setFriendsList(editedList)
  }

  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'absolute'}}
    >
      <Modal show={true} onHide={() => close('friend')}>
        <Modal.Header closeButton>
          <Modal.Title>Friends</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {friendsList ? friendsDisplay : <p>Let's make some friends!</p>}
            <ListGroupItem action variant="info" style={{textAlign: 'center'}} onClick={() => setAddFriend(true)}> Add Friend </ListGroupItem>
            {addFriend ? <ListGroup.Item style={{textAlign: 'center'}} >
              <label style={{marginRight: '5px', marginTop: '7px'}}>Email Address</label>
              <input onBlur={(e)=>{setRequestFriend(e.target.value)}}></input>
              <Button style={{float: 'right'}}
                      onClick={() => {
                        setAddFriend(false)
                        friendRequestToDb(requestFriend)

                      }}
              > Request </Button> </ListGroup.Item> : null}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </div>
  );
}

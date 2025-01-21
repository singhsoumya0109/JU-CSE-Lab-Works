import React from 'react';
import { ChatState } from '../context/ChatProvider';
import SingleChat from "./SingleChat"
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const { selectedChat } = ChatState();

  return (
    <>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </>
  )
}

export default ChatBox

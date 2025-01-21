import React, { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
//import { useNavigate } from "react-router-dom"; // Import useNavigate

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const history = useHistory();
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);
      //const navigate = useNavigate();
    if (!userInfo) {
        //history.push("/");
        //navigate("/");
    }
  }, [history]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

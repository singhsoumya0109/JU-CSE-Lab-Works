import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { getName } from "../config/ChatLogics";
const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/chat", config);
      setChats(data);
      console.log(data);
    } catch (error) {
      console.error("Error during fetching chat:", error);
      alert("An error occurred while fetching chat. Please try again later.");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>My Chats</h2>

      {/* Chat List */}
      {chats && chats.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              style={{
                padding: "20px",
                borderRadius: "6px",
                backgroundColor:
                  selectedChat?._id === chat._id ? "#98fb98" : "#ffffff",
                // color: selectedChat?._id === chat._id ? "#ffffff" : "#333333",
                border: "1px solid #ddd",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <strong>
                {chat.isGroup ? chat.chatName : getName(loggedUser, chat.users)}
              </strong>
              {/* <span style={{ fontSize: "12px", color: "#777" }}>
                {chat.latestMessage
                  ? `${chat.latestMessage.sender.name}: ${chat.latestMessage.content}`
                  : "No messages yet"}
              </span> */}
            </div>
          ))}
        </div>
      ) : (
        <p>No chats found</p>
      )}
    </div>
  );
};

export default MyChats;

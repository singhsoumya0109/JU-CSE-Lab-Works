import React, { useEffect, useRef } from "react";
import { ChatState } from "../context/ChatProvider";

const FullChat = ({ messages }) => {
  const { user } = ChatState(); // Get user from ChatState
  const messagesEndRef = useRef(null); // Create a reference for the end of the messages

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages change
  }, [messages]);

  return (
    <div
      style={{
        height: "100%", // Full height container
        overflowY: "auto", // Enable vertical scrolling
        display: "flex",
        flexDirection: "column", // Stack messages vertically
      }}
    >
      {messages &&
        messages.map((m, i) => (
          <div
            style={{
              display: "flex",
              justifyContent:
                m.sender && m.sender._id === user?._id
                  ? "flex-end"
                  : "flex-start",
              padding: "5px",
            }}
            key={m._id || i} // Fallback to index if _id is missing
          >
            <span
              style={{
                backgroundColor:
                  m.sender && m.sender._id === user?._id
                    ? "#DCF8C6"
                    : "#E2E2E2",
                color: "#000",
                borderRadius: "20px",
                padding: "10px 15px",
                maxWidth: "60%",
                wordWrap: "break-word",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)",
                fontSize: "14px",
              }}
            >
              {m.content || "Message content unavailable"}
            </span>
          </div>
        ))}
      {/* Empty div to scroll into */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default FullChat;

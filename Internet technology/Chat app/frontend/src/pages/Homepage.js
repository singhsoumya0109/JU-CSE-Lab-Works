import React, { useState, useEffect } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      //history.push("/chats");
    }
  }, [history]);

  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div>
      <div
        className="heading-home"
        style={{ textAlign: "center", margin: "20px" }}
      >
        <h1>Chatting App</h1>
      </div>

      <div
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        {showLogin ? (
          <Login toggleForm={toggleForm} />
        ) : (
          <Signup toggleForm={toggleForm} />
        )}
      </div>
    </div>
  );
};

export default Homepage;

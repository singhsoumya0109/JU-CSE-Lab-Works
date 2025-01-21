import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";

const Login = ({ toggleForm }) => {
  const { setUser } = ChatState(); // Access setUser from context
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setMessage("Please fill in all the fields.");
      setMessageType("error");
      return;
    }
    try {
      const { data } = await axios.post("/user/login", {
        name,
        email,
        password,
      });

      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      // Save user data in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Update user state in context
      setUser(data);

      // Redirect
      setTimeout(() => {
        window.location.href = "/chats";
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  const guestLogin = async () => {
    try {
      const { data } = await axios.post("/user/login", {
        name: "guest",
        email: "guestmail@gmail.com",
        password: "1234",
      });

      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      // Save user data in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Update user state in context
      setUser(data);

      // Redirect
      setTimeout(() => {
        window.location.href = "/chats";
      }, 2000);
    } catch (error) {
      setMessage("Guest login failed. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            color: messageType === "success" ? "green" : "red",
            backgroundColor: messageType === "success" ? "#d4edda" : "#f8d7da",
            border: `1px solid ${
              messageType === "success" ? "#c3e6cb" : "#f5c6cb"
            }`,
            borderRadius: "5px",
          }}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "15px", paddingRight: "10px" }}>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            required
            style={{ width: "100%", padding: "8px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "15px", paddingRight: "10px" }}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            style={{ width: "100%", padding: "8px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "15px", paddingRight: "10px" }}>
          <label htmlFor="password">Password:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              style={{ width: "calc(100% - 60px)", padding: "8px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                marginLeft: "10px",
                padding: "8px",
                background: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "4px",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.background = "#007BFF")}
        >
          Login
        </button>
        <button
          type="button"
          style={{
            width: "100%",
            padding: "10px",
            background: "#FF0000",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "4px",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#CC0000")}
          onMouseLeave={(e) => (e.target.style.background = "#FF0000")}
          onClick={guestLogin}
        >
          Guest Login
        </button>
      </form>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Don't have an account?{" "}
        <span
          style={{ color: "#007BFF", cursor: "pointer" }}
          onClick={toggleForm}
        >
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;

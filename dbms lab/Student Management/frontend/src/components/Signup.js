import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Auth.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

 // Redirect if admin or student is already logged in
   useEffect(() => {
     const adminInfo = localStorage.getItem("adminInfo");
     const studentInfo = localStorage.getItem("studentInfo");
 
     if (adminInfo) {
       window.location.href = "/admin/dashboard"; // Redirect to admin dashboard
     } else if (studentInfo) {
       window.location.href = "/student/dashboard"; // Redirect to student dashboard
     }
   }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setMessage("Please fill in all the fields.");
      setMessageType("error");
      return;
    }

    try {
      const { data } = await axios.post("/api/user/signup", {
        username,
        email,
        password,
      });

      setMessage("Signup successful! Redirecting...");
      setMessageType("success");

      // Save admin data in localStorage
      localStorage.setItem("adminInfo", JSON.stringify(data));

      // Redirect to admin dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin/dashboard";
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

  return (
    <div className="auth-container">
      <h2>Admin Signup</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;

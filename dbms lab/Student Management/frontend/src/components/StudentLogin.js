import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Auth.css";

const StudentLogin = () => {
  const [email, setEmail] = useState("");
  const [roll, setRoll] = useState("");
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

    if (!email || !roll) {
      setMessage("Please fill in all the fields.");
      setMessageType("error");
      return;
    }

    try {
      const { data } = await axios.post("/api/user/student/login", {
        email,
        roll,
      });

      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      // Save student data in localStorage
      localStorage.setItem("studentInfo", JSON.stringify(data));

      // Redirect to student dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/student/dashboard";
      }, 1000);
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
      <h2>Student Login</h2>
      {message && <div className={`message ${messageType}`}>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Roll Number"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default StudentLogin;

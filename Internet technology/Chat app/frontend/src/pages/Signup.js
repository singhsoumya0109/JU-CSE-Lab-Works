import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = ({ toggleForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null); // State for messages
  const [messageType, setMessageType] = useState(""); // Type of message: 'success' or 'error'
  const history = useHistory();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("Please fill in all the fields.");
      setMessageType("error");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const defaultPic =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
      const userPic = pic || defaultPic;

      const { data } = await axios.post(
        "/user/signup",
        {
          name,
          email,
          password,
          pic: userPic,
        },
        config
      );

      // Display success message
      setMessage("Signup successful! Redirecting to chats...");
      setMessageType("success");

      // Save user data in localStorage
      localStorage.setItem("userInfo", JSON.stringify(data));

      // Redirect after a short delay
      setTimeout(() => {
        history.push("/chats");
      }, 2000);
    } catch (error) {
      // Handle API errors
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : "An error occurred. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
      <form>
        <div style={{ marginBottom: "15px", paddingRight: "10px" }}>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            required
            style={{ width: "100%", padding: "8px" }}
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: "15px", paddingRight: "10px" }}>
          <label htmlFor="password">Password:</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"} // Toggle visibility
              placeholder="Enter your password"
              required
              style={{ width: "calc(100% - 60px)", padding: "8px" }}
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
        <div style={{ marginBottom: "15px", paddingRight: "10px" }}>
          <label htmlFor="picture">Picture:</label>
          <input
            id="picture"
            type="file"
            accept="image/*"
            style={{ width: "100%", padding: "8px" }}
            onChange={(e) => setPic(e.target.value)}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#28A745", // Green
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#218838")} // Darker green on hover
          onMouseLeave={(e) => (e.target.style.background = "#28A745")} // Original green
          onClick={submitHandler}
        >
          Sign Up
        </button>
      </form>
      <p style={{ marginTop: "10px", textAlign: "center" }}>
        Already have an account?{" "}
        <span
          style={{ color: "#007BFF", cursor: "pointer" }}
          onClick={toggleForm}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;

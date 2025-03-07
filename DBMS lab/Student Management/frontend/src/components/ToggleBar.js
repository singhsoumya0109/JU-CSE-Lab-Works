import React from "react";
import "./ToggleBar.css";

const ToggleBar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="toggle-bar">
      <button
        className={activeTab === "admin" ? "active" : ""}
        onClick={() => setActiveTab("admin")}
      >
        Admin Login
      </button>
      <button
        className={activeTab === "student" ? "active" : ""}
        onClick={() => setActiveTab("student")}
      >
        Student Login
      </button>
      <button
        className={activeTab === "signup" ? "active" : ""}
        onClick={() => setActiveTab("signup")}
      >
        Admin Signup
      </button>
    </div>
  );
};

export default ToggleBar;

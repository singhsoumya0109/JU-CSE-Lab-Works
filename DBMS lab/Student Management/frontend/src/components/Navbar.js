import React from "react";
import "./Navbar.css";

const Navbar = ({ name1, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="brand">
        <img
          src="http://juadmission.jdvu.ac.in/jums_exam/resources/images/julogo.png"
          alt="JU Logo"
          className="logo"
        />
        <span>JUMS</span>
      </div>
      <div className="right">
        <span className="name">{name1}</span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

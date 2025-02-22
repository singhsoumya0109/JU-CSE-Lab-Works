import React, { useState } from "react";
import axios from "axios";
import "./AddStudent.css"; // Import the CSS file

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    deptCode: "",
    address: "",
    phone: "",
    email: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post("/api/student/addstudent", formData, config);

      setMessage("Student added successfully!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding student.");
    }
  };

  return (
    <div className="add-student-container">
      <h2 className="form-title">Add Student</h2>
      {message && <p className="message">{message}</p>}
      <form className="add-student-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="text" name="roll" placeholder="Roll" onChange={handleChange} required />
        <input type="text" name="deptCode" placeholder="Department Code" onChange={handleChange} required />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <button type="submit" className="submit-btn">Add Student</button>
      </form>
    </div>
  );
};

export default AddStudent;

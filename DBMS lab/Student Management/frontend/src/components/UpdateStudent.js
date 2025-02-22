import React, { useState } from "react";
import axios from "axios";
import "./UpdateStudent.css"; // Importing the CSS file

const UpdateStudent = () => {
  const [roll, setRoll] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!roll) {
      setMessage("Please enter a roll number.");
      setIsError(true);
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.put(`/api/student/${roll}`, updateData, config);

      setMessage("Student updated successfully!");
      setIsError(false);
      setRoll("");
      setUpdateData({});
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating student.");
      setIsError(true);
    }
  };

  return (
    <div className="update-student-container">
      <h2 className="form-title">Update Student</h2>
      {message && (
        <p className={isError ? "error-message" : "success-message"}>
          {message}
        </p>
      )}

      <div className="form-group">
        <label>Roll Number</label>
        <input
          type="text"
          value={roll}
          placeholder="Enter Roll Number"
          onChange={(e) => setRoll(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>New Address</label>
        <input
          type="text"
          name="address"
          placeholder="New Address"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>New Phone Number</label>
        <input
          type="text"
          name="phone"
          placeholder="New Phone Number"
          onChange={handleChange}
        />
      </div>

      <button className="update-btn" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
};

export default UpdateStudent;

import React, { useState } from "react";
import axios from "axios";
import "./DeleteStudent.css"; // Importing CSS file

const DeleteStudent = () => {
  const [roll, setRoll] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleDelete = async () => {
    if (!roll) {
      setMessage("Please enter a roll number.");
      setIsError(true);
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`/api/student/${roll}`, config);

      setMessage("Student deleted successfully!");
      setIsError(false);
      setRoll("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting student.");
      setIsError(true);
    }
  };

  return (
    <div className="delete-student-container">
      <h2 className="form-title">Delete Student</h2>
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

      <button className="delete-btn" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default DeleteStudent;

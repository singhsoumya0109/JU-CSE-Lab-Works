import React, { useState } from "react";
import axios from "axios";
import "./AddDepartment.css"; // Import external CSS file

const AddDepartment = () => {
  const [deptCode, setDeptCode] = useState("");
  const [deptName, setDeptName] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post("/api/student/adddept", { deptCode, deptName }, config);

      setMessage("Department added successfully!");
      setIsError(false);
      setDeptCode("");
      setDeptName("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding department.");
      setIsError(true);
    }
  };

  return (
    <div className="add-department-container">
      <h2 className="form-title">Add Department</h2>
      {message && (
        <p className={isError ? "error-message" : "success-message"}>
          {message}
        </p>
      )}
      <form className="add-department-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Department Code</label>
          <input
            type="text"
            value={deptCode}
            onChange={(e) => setDeptCode(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Department Name</label>
          <input
            type="text"
            value={deptName}
            onChange={(e) => setDeptName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
    
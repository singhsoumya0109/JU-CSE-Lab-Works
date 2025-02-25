import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import "./StudentSearch.css";

const StudentSearch = () => {
  const [roll, setRoll] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!roll.trim()) {
      setError("Please enter a roll number.");
      setStudent(null);
      return;
    }

    setLoading(true);
    setError("");
    setStudent(null);

    try {
      // Get token from localStorage, checking for admin first
      const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
      const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
      const token = adminInfo?.token || studentInfo?.token;

      if (!token) {
        setError("Unauthorized access. Please log in.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`/api/student/${roll}`, config);
      console.log(data);
      setStudent(data);
    } catch (err) {
      setError(err.response?.data?.message || "Student not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-search">
      <h2>Search Student</h2>
      <input
        type="text"
        placeholder="Enter Roll Number"
        value={roll}
        onChange={(e) => setRoll(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="error-message">{error}</p>}

      {student && (
        <div className="search-results">
          <h3>Student Details</h3>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <FaEnvelope /> <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Roll:</strong> {student.roll}
          </p>
          <p>
            <strong>Department Code:</strong> {student.deptCode}
          </p>
          <p>
            <FaMapMarkerAlt /> <strong>Address:</strong> {student.address}
          </p>
          <p>
            <FaPhone /> <strong>Phone:</strong> {student.phone}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentSearch;

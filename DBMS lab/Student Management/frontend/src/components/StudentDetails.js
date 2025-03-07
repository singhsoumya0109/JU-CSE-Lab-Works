import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import "./StudentDetails.css";

const StudentDetails = (studentInfo) => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
        const roll = studentInfo.roll;
        if (!roll) {
          setError("No roll number found. Please log in.");
          setLoading(false);
          return;
        }

        const token = studentInfo?.token;

        if (!token) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(`/api/student/${roll}`, config);
        setStudent(data);
      } catch (err) {
        setError(err.response?.data?.message || "Student not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    student && (
      <div className="student-details">
        <h2>Your Details</h2>
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
    )
  );
};

export default StudentDetails;

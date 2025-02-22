import React from "react";
import "./StudentDetails.css";

const StudentDetails = ({ student }) => {
  return (
    <div className="student-details">
      <h2>Your Details</h2>
      <p>
        <strong>Name:</strong> {student.name}
      </p>
      <p>
        <strong>Email:</strong> {student.email}
      </p>
      <p>
        <strong>Roll:</strong> {student.roll}
      </p>
      <p>
        <strong>Department Code:</strong> {student.deptCode}
      </p>
    </div>
  );
};

export default StudentDetails;

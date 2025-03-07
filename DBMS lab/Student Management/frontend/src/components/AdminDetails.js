import React from "react";
import "./AdminDetails.css";

const AdminDetails = () => {
  const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));

  if (!adminInfo) {
    return <p className="error-message">Admin details not found.</p>;
  }

  return (
    <div className="admin-details">
      <h2>Admin Details</h2>
      <p>
        <strong>Username:</strong> {adminInfo.username}
      </p>
      <p>
        <strong>Email:</strong> {adminInfo.email}
      </p>
    </div>
  );
};

export default AdminDetails;

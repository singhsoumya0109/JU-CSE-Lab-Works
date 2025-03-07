import React, { Component } from "react";
import Navbar from "../components/Navbar";
import AdminDetails from "../components/AdminDetails";
import AddStudent from "../components/AddStudent";
import AddDepartment from "../components/AddDepartment";
import StudentSearch from "../components/StudentSearch";
import UpdateStudent from "../components/UpdateStudent";
import DeleteStudent from "../components/DeleteStudent";
import StudentList from "../components/StudentList";
import "./AdminDashboard.css"; // Import the CSS file

export default class AdminDashboard extends Component {
  componentDidMount() {
    const adminInfo = localStorage.getItem("adminInfo");
    const studentInfo = localStorage.getItem("studentInfo");

    if (!adminInfo || studentInfo) {
      window.location.href = "/";
    }
  }

  handleLogout = () => {
    localStorage.removeItem("adminInfo");
    window.location.href = "/";
  };

  render() {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    return (
      <div>
        <Navbar
          name1={adminInfo?.username || "Admin"}
          onLogout={this.handleLogout}
        />
        <div className="dashboard-content">
          <h1>Welcome, {adminInfo?.username || "Admin"}</h1>

          <div className="top-section">
            <AdminDetails />
            <AddStudent />
            <AddDepartment />
          </div>

          <div className="middle-section">
            <StudentSearch />
            <UpdateStudent />
            <DeleteStudent />
          </div>

          <div className="bottom-section">
            <StudentList />
          </div>
        </div>
      </div>
    );
  }
}

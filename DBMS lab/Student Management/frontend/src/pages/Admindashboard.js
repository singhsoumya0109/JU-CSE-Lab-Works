import React, { Component } from "react";
import Navbar from "../components/Navbar";
import AddStudent from "../components/AddStudent";
import AddDepartment from "../components/AddDepartment";
import StudentSearch from "../components/StudentSearch";
import UpdateStudent from "../components/UpdateStudent";
import DeleteStudent from "../components/DeleteStudent";
import StudentList from "../components/StudentList";

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
          <h1>Welcome, Admin!</h1>
          <p>Manage student records, courses, and system settings here.</p>

          {/* Components for different functionalities */}
          <AddStudent />
          <AddDepartment />
          <StudentSearch />
          <UpdateStudent />
          <DeleteStudent />
          <StudentList />
        </div>
      </div>
    );
  }
}

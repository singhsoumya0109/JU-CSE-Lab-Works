import React, { Component } from "react";
import Navbar from "../components/Navbar";
import StudentDetails from "../components/StudentDetails";
import StudentSearch from "../components/StudentSearch";
import StudentList from "../components/StudentList";

export default class Studentdashboard extends Component {
  componentDidMount() {
    const adminInfo = localStorage.getItem("adminInfo");
    const studentInfo = localStorage.getItem("studentInfo");

    if (!studentInfo || adminInfo) {
      window.location.href = "/";
    }
  }

  handleLogout = () => {
    localStorage.removeItem("studentInfo");
    window.location.href = "/";
  };

  render() {
    const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
    const studentName = studentInfo ? studentInfo.name : "Student";

    return (
      <div>
        <Navbar name1={studentName} onLogout={this.handleLogout} />
        <h1>Welcome, {studentName}!</h1>
        <StudentDetails student={studentInfo} />
        <StudentSearch />
        <StudentList />
      </div>
    );
  }
}

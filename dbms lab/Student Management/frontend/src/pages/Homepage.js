import React, { useState } from "react";
import AdminLogin from "../components/AdminLogin";
import StudentLogin from "../components/StudentLogin";
import Signup from "../components/Signup";
import ToggleBar from "../components/ToggleBar";

const Homepage = () => {
  const [activeTab, setActiveTab] = useState("admin");

  return (
    <div className="homepage">
      <ToggleBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "admin" && <AdminLogin />}
      {activeTab === "student" && <StudentLogin />}
      {activeTab === "signup" && <Signup />}
    </div>
  );
};

export default Homepage;

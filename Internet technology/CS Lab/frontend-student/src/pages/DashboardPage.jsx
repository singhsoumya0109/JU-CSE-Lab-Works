import React, { useEffect } from "react";
import useAuthStore from "../stores/useUserStore";
import StudentDetails from "../components/StudentDetails";
import AssignedProducts from "../components/AssignedProducts";

const DashboardPage = ({ role }) => {
  const { student, fetchStudentDetails } = useAuthStore();

  useEffect(() => {
    fetchStudentDetails("student");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl w-full bg-gray-800 shadow-2xl rounded-lg p-8 text-white">
        {/* Dashboard Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-400 mb-6 border-b border-gray-700 pb-3">
          Student Dashboard
        </h2>

        {/* Conditional Rendering */}
        {student ? (
          <>
            {/* Student Details Card */}
            <div className="bg-gray-700 rounded-lg p-6 mb-6 shadow-lg">
              <StudentDetails student={student} role={role} />
            </div>

            {/* Assigned Products */}
            <div className="bg-gray-700 rounded-lg p-6 shadow-lg">
              <AssignedProducts products={student.assignedProducts} />
            </div>
          </>
        ) : (
          <p className="text-gray-300 text-center text-lg">
            Loading student details...
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

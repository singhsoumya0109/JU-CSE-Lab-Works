import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentList.css";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError("");

      try {
        // Get token from localStorage, checking for admin first
        const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
        const studentInfo = JSON.parse(localStorage.getItem("studentInfo"));
        const token = adminInfo?.token || studentInfo?.token;

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

        const { data } = await axios.get(`/api/student?page=${page}`, config);

        setStudents(data.students);
        setTotalPages(data.pages);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page]); // Fetch data when page changes

  return (
    <div className="student-list">
      <h2>All Students</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roll</th>
                <th>Department Code</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.roll}</td>
                    <td>{student.deptCode}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No students found</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StudentList;

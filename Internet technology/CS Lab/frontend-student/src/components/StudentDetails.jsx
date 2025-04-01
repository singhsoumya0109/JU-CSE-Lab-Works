const StudentDetails = ({ student, role }) => {
  return (
    <div className="space-y-4">
      <p>
        <strong>Name:</strong> {student.name}
      </p>
      <p>
        <strong>Email:</strong> {student.email}
      </p>
      <p>
        <strong>Roll Number:</strong> {student.roll}
      </p>
      <p>
        <strong>Department:</strong> {student.department}
      </p>
      <p>
        <strong>Year of Study:</strong> {student.yearOfStudy}
      </p>
      <p>
        <strong>Role:</strong> {role}
      </p>
    </div>
  );
};

export default StudentDetails;

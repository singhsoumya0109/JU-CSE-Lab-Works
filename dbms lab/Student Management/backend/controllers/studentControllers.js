const asyncHandler = require("express-async-handler");
const Student = require("../models/studentModel");
const Department = require("../models/deptModel");

// ✅ Add a new department (Only Admins)
const addDepartment = asyncHandler(async (req, res) => {
  const { deptCode, deptName } = req.body;

  // Check if department code already exists
  const deptExists = await Department.findOne({ deptCode });
  if (deptExists) {
    return res.status(400).json({ message: "Department code already exists." });
  }

  // Create and save the new department
  const department = await Department.create({ deptCode, deptName });

  res.status(201).json({
    message: "Department added successfully",
    department,
  });
});
const addStudent = asyncHandler(async (req, res) => {
  const { name, roll, deptCode, address, phone,email } = req.body;

  // Ensure roll is unique
  const existingStudent = await Student.findOne({ roll });
  if (existingStudent) {
    return res.status(400).json({ message: "Roll number already exists." });
  }

  // Ensure deptCode exists in the departments collection
  const department = await Department.findOne({ deptCode });
  if (!department) {
    return res.status(400).json({ message: "Invalid department code." });
  }

  // Create new student
  const student = await Student.create({
    name,
    roll,
    deptCode,
    address,
      phone,
    email,
  });

  res.status(201).json(student);
});

// ➤ GET STUDENT BY ROLL NUMBER
const getStudentByRoll = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ roll: req.params.roll });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
});

// ➤ UPDATE STUDENT DETAILS (Admin Only)
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ roll: req.params.roll });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Update fields (except roll number)
  student.address = req.body.address || student.address;
  student.phone = req.body.phone || student.phone;

  const updatedStudent = await student.save();
  res.json(updatedStudent);
});

// ➤ DELETE STUDENT (Admin Only)
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({ roll: req.params.roll });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  await student.deleteOne();
  res.json({ message: "Student deleted successfully" });
});

// ➤ GET ALL STUDENTS (Paginated, 5 per page)
const getAllStudents = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = 5;

  const students = await Student.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const totalStudents = await Student.countDocuments();

  res.json({
    students,
    page,
    pages: Math.ceil(totalStudents / pageSize),
  });
});

module.exports = {
  addStudent,
  getStudentByRoll,
  updateStudent,
  deleteStudent,
  getAllStudents,
  addDepartment,
};

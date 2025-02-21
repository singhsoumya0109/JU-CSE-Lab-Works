const express = require("express");
const router = express.Router();
const {
  addStudent,
  getStudentByRoll,
  updateStudent,
  deleteStudent,
    getAllStudents,
  addDepartment
} = require("../controllers/studentControllers");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Add a new student (Admin only)
router.post("/addstudent", protect, adminOnly, addStudent);

// Route to add a department (Only admin can access)
router.post("/adddept", protect,adminOnly, addDepartment);


// Get student by roll number
router.get("/:roll", protect, getStudentByRoll);

// Update student details (Admin only)
router.put("/:roll", protect, adminOnly, updateStudent);

// Delete student (Admin only)
router.delete("/:roll", protect, adminOnly, deleteStudent);

// Get all students (Paginated, 5 per page)
router.get("/", protect, getAllStudents);

module.exports = router;

import { Student } from "../models/user.model.js";

// Controller to get student details
export const getStudentDetails = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Find student and populate assigned products
    const student = await Student.findById(studentId).populate(
      "assignedProducts.productId",
      "name category image _id" // Include _id field
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      name: student.name,
      email: student.email,
      roll: student.rollNumber,
      department: student.department,
      yearOfStudy: student.yearOfStudy,
      assignedProducts: student.assignedProducts.map((item) => ({
        id: item.productId._id, // Include product ID
        name: item.productId.name,
        category: item.productId.category,
        image: item.productId.image,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

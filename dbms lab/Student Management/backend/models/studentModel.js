const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  roll: { type: String, required: true, unique: true }, // Unique roll number
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Unique email for each student
  deptCode: { type: String, required: true }, // Reference to department
  address: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update `updatedAt` on save
StudentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;

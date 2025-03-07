const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
  deptCode: { type: String, required: true, unique: true },
  deptName: { type: String, required: true },
});

const Department = mongoose.model("Department", DepartmentSchema);
module.exports = Department;

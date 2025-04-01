import Product from "../models/product.model.js";
import { Student } from "../models/user.model.js";
// Fetch all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } }); // Fetch only products with stock > 0
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get details of a specific product
export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStudentProducts = async (req, res) => {
  try {
    const studentId = req.user._id;
    const student = await Student.findById(studentId).populate(
      "assignedProducts.productId"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ assignedProducts: student.assignedProducts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Student takes a product
export const takeProduct = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock < 1)
      return res.status(400).json({ message: "Product is out of stock" });

    // Decrease product stock
    product.stock -= 1;

    // Update studentsTaken array in Product
    const studentIndex = product.studentsTaken.findIndex(
      (entry) => entry.student.toString() === studentId.toString()
    );

    if (studentIndex > -1) {
      // If student already exists, increment quantity
      product.studentsTaken[studentIndex].quantity += 1;
    } else {
      // Otherwise, add new student entry
      product.studentsTaken.push({ student: studentId, quantity: 1 });
    }

    await product.save();

    // Find the student
    const student = await Student.findById(studentId);

    // Update assignedProducts array in Student
    const productIndex = student.assignedProducts.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex > -1) {
      student.assignedProducts[productIndex].quantity += 1;
    } else {
      student.assignedProducts.push({ productId, quantity: 1 });
    }

    await student.save();

    res.json({ message: "Product taken successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Student returns one unit of a product
export const returnProduct = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find the student
    const student = await Student.findById(studentId);

    // Find the product in the student's assigned list
    const productIndex = student.assignedProducts.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1)
      return res.status(400).json({ message: "You haven't taken this product" });

    // Reduce the quantity by 1 or remove the entry if quantity becomes 0
    if (student.assignedProducts[productIndex].quantity > 1) {
      student.assignedProducts[productIndex].quantity -= 1;
    } else {
      student.assignedProducts.splice(productIndex, 1);
    }

    // Update studentsTaken in Product
    const studentIndex = product.studentsTaken.findIndex(
      (entry) => entry.student.toString() === studentId.toString()
    );

    if (studentIndex > -1) {
      if (product.studentsTaken[studentIndex].quantity > 1) {
        product.studentsTaken[studentIndex].quantity -= 1;
      } else {
        product.studentsTaken.splice(studentIndex, 1);
      }
    }

    // Increase product stock
    product.stock += 1;

    await product.save();
    await student.save();

    res.json({ message: "Product returned successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

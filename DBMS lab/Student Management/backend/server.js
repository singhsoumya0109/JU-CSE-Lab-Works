const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");

dotenv.config();
require("dotenv").config();

connectDB();

app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("Hello");
});


app.use('/api/user', userRoutes);
app.use('/api/student', studentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

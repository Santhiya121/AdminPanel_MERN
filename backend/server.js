const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const employeeRoutes = require('./routes/employeeRoutes');
const path = require("path");

dotenv.config(); 

const app = express();

var corsOption = {
    origin:"http://localhost:3000"
}

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const adminCredentials = {
    username: "admin",  
    password: "admin123", 
  };
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;   
    if (username === adminCredentials.username && password === adminCredentials.password) {
      return res.status(200).json({ message: "Login successful!" });
    } else {
      return res.status(400).json({ message: "Invalid username or password" });
    }
  });

  app.get("/admin", (req, res) => {
    res.status(200).json({ message: "Welcome to the Admin Dashboard" });
  });
  
 
//   app.listen(8000, () => {
//     console.log("Server running on port 8000");
//   });


connectDB();




app.use('/api', employeeRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

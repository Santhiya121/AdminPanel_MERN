const multer = require("multer");
const path = require("path");
const Employee = require("../models/employee");
const baseurl = "http://localhost:5000/backend/uploads/";

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "uploads/");  // Folder where files will be stored
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));  // Using timestamp for file uniqueness
        }
    }),
}).single("img");  // Expecting the field in the form to be named 'img'

// API route to handle employee creation
exports.createEmployee = (req, res) => {
    // Upload the file using multer
    upload(req, res, async (err) => {
        // Error handling for file upload
        if (err) {
            console.error("Error during file upload:", err);
            return res.status(400).json({ message: "Error uploading file", error: err });
        }

        // Debugging - log the form data and the uploaded file
        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { name, email, mobile, designation, gender, courses } = req.body;

        // Validate form data
        if (!name || !email || !mobile || !designation || !gender || !courses) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        try {
            // Check for existing employee with the same email
            const existingEmployee = await Employee.findOne({ email });
            if (existingEmployee) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Parse courses, in case it's sent as a string
            let parsedCourses = [];
            try {
                parsedCourses = JSON.parse(courses);
            } catch (parseError) {
                return res.status(400).json({ message: "Invalid format for courses" });
            }

            // Create a new employee document
            const newEmployee = new Employee({
                name,
                email,
                mobile,
                designation,
                gender,
                courses: parsedCourses,
                img: req.file ?req.file.filename : null, // Store the file's filename in the DB
            });

            // Save the new employee to the database
            await newEmployee.save();

            // Send success response
            res.status(201).json({
                message: "Employee added successfully!",
                employee: newEmployee,
            });
        } catch (error) {
            console.error("Error adding employee:", error);
            res.status(500).json({ message: "Error adding employee", error });
        }
    });
};




exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error });
  }
};


exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    console.log("employee--------------",employee);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    
    res.status(200).json(employee);
  } catch (error) {
   
    res.status(500).json({ message: "Error fetching employee", error });
  }
};


exports.deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error });
  }
};


// exports.updateEmployee = async (req, res) => {
//   try {
//     const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     res.status(200).json({ message: "Employee updated successfully!", employee });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating employee", error });
//   }
// };

exports.updateEmployee = async (req, res) => {
  
    try {
      const { id } = req.params;
      const updatedEmployee = req.body;
        
        const employee = await Employee.findById(id);
        
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        Object.assign(employee, updatedEmployee);

        await employee.save();

        res.status(200).json({ message: "Employee updated successfully", employee });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Error updating employee", error });
    }
};


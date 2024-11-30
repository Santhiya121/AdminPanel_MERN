const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
} = require('../controllers/employeeController');


router.post('/employees', createEmployee);

router.get('/employees', getEmployees);

router.get("/employees/:id", getEmployeeById); 
router.delete('/employees/:id', deleteEmployee);

router.put('/employees/:id', updateEmployee);

module.exports = router;

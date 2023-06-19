const {client} = require('../models/database'); // Assuming you have a separate module for database connection
const {validationResult}=require("express-validator")
const { v4: uuidv4 } = require('uuid');
// Add an employee laptop
 exports.addEmployeeLaptop = async (req, res) => {
  const employeeId = uuidv4();
  const {
    firstName,
    lastName,
    nationalId,
    telephone,
    email,
    department,
    position,
    laptop
  } = req.body;

  try {
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.json({success:false,message:errors.array()[0].msg});
    }
    // Insert the employee laptop into the database
    const newEmployeeLaptop = await client.query(
      `INSERT INTO employee_laptops (id, first_name, last_name, national_id, telephone, email, department, position, laptop)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        employeeId,
        firstName,
        lastName,
        nationalId,
        telephone,
        email,
        department,
        position,
        laptop
      ]
    );

    res.status(201).json({ message: 'Employee laptop added successfully', employee: newEmployeeLaptop.rows[0] });
  } catch (error) {
    console.error('Error while adding employee laptop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getEmployees = async (req, res) => {
  const { page, limit } = req.query;

  // Set default values for page and limit if not provided
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;

  try {
    // Calculate the offset for pagination
    const offset = (pageNumber - 1) * pageSize;

    // Retrieve employees from the database with pagination
    const employees = await client.query(
      'SELECT * FROM employee_laptops e inner join laptops lp on e.laptop=lp.id  OFFSET $1 LIMIT $2',
      [offset, pageSize]
    );

    // Count total number of employees for pagination metadata
    const totalCount = await client.query('SELECT COUNT(*) FROM employee_laptops')
    const totalEmployees = parseInt(totalCount.rows[0].count);

    const totalPages = Math.ceil(totalEmployees / pageSize);

    res.status(200).json({
      success:true,
      employees: employees.rows,
      page: pageNumber,
      limit: pageSize,
      totalEmployees,
      totalPages
    });
  } catch (error) {
    console.error('Error while retrieving employees:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.deleteEmployeeLaptopById = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete the employee laptop from the database
    await db.query('DELETE FROM employee_laptops WHERE id = $1', [id]);

    res.status(200).json({ message: 'Employee laptop deleted successfully' });
  } catch (error) {
    console.error('Error while deleting employee laptop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
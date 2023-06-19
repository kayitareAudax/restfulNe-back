const {client} = require('../models/database'); // Assuming you have a separate module for database connection
const {validationResult} =require("express-validator")
const { v4: uuidv4 } = require('uuid');

// Create a new laptop
exports.createLaptop = async (req, res) => {
  const laptopId = uuidv4();

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { manufacturer, model, serialNumber } = req.body;

  try {
    // Insert the new laptop into the database
    const newLaptop = await client.query(
      'INSERT INTO laptops (id,manufacturer, model, serial_number) VALUES ($1, $2, $3,$4) RETURNING *',
      [laptopId,manufacturer, model, serialNumber]
    );

    res.status(201).json({ message: 'Laptop created successfully', laptop: newLaptop.rows[0] });
  } catch (error) {
    console.error('Error while creating laptop:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getLaptops=async(req,res,next)=>{
    try {
        // Retrieve all laptops from the database
        const laptops = await client.query('SELECT * FROM laptops');
    
        res.status(200).json({ laptops: laptops.rows });
      } catch (error) {
        console.error('Error while retrieving laptops:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}

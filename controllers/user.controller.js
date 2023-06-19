// Import required modules
const bcrypt = require('bcryptjs');
const {client}=require("../models/database") // Assuming you have a separate module for database connection
const { v4: uuidv4 } = require('uuid');
const jwt=require("jsonwebtoken")
const {validationResult}=require("express-validator")
// Register a new user
exports.registerUser = async (req, res) => {
    const userId = uuidv4();
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.json({success:false,message:errors.array()[0].msg});
    }
  const { names,email, password,comfirmPassword } = req.body;
  try {
    if(password!=comfirmPassword){
        return res.json({success:false,message:"Passwords do not match"})
    }
    // Check if the email already exists
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length > 0) {
      return json({ success:false,message: 'email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user into the database
    const newUser = await client.query(
      'INSERT INTO users (id,names,email, password) VALUES ($1, $2,$3,$4) RETURNING *',
      [userId,names,email, hashedPassword]
    );

    res.json({ success:true,message: 'User registered successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.loginUser=async(req,res,next)=>{
    const { email, password } = req.body;

  try {
    // Check if the email exists in the database
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existingUser.rows.length === 0) {
      return res.json({success:false, message: 'Invalid credentials' });
    }

    // Compare the password hash
    const isValidPassword = await bcrypt.compare(password, existingUser.rows[0].password);

    if (!isValidPassword) {
        return res.json({success:false, message: 'Invalid credentials' });
    }
    const token = jwt.sign(
        {
          id: existingUser.rows[0].id,
        },
        process.env.JWT_SECRET
      );
    return res.json({success:true, message: token });
} catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
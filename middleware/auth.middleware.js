const jwt = require("jsonwebtoken");
const { client } = require("../models/database");
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return res.json({success:false,message:"Not authorized to access this route"})
  }
  //verify if token is there
  if (!token) {
    return res.status(401).json({
      message: "You must be logged in to access this route.",
    });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log(err);
      } else {
        client.query(
          `select id,email,password from users where id='${decoded.id}'`,
          (error, result) => {
            if (error) {
              // console.log(error.message);
              return error.message;
            }
            if (result.rows.length == 0)
              return res.status(400).json({
                success: false,
                message: "This user does not exist",
              });
            req.user = result.rows;
            next();
          }
        );
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const { registerUser,loginUser } = require("../controllers/user.controller");
const {check,validationResult}=require("express-validator");
const router=require("express").Router();
router.route("/signup").post(
    check("names","Please enter names of minimum 10 characters").exists().isLength({min:10,max:80}),
    check("email","please enter a valid email").exists().isEmail(),
    check("password","please enter a password of 6+ characters").exists().isLength({min:6,max:20}),
    registerUser);
router.route("/login").post(loginUser);
module.exports=router;
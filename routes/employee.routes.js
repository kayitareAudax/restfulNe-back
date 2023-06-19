const { addEmployeeLaptop, getEmployees, deleteEmployeeLaptopById } = require("../controllers/employee.controllers");
const { protect } = require("../middleware/auth.middleware");
const {check,validationResult}=require("express-validator");
const router = require("express").Router();
router.use(protect)
router.route("/").post(
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('nationalId').notEmpty().withMessage('National ID is required').isLength({min:16,max:16}).withMessage("A National id has 16 digits"),
    check('telephone')
        .notEmpty().withMessage('Telephone is required')
        .isMobilePhone().withMessage('Invalid telephone number').isLength({max:10,min:10}).withMessage("enter phone number without +250"),
    check('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),
    check('department').notEmpty().withMessage('Department is required'),
    check('position').notEmpty().withMessage('Position is required'),
    check("laptop","enter a laptop").notEmpty().isUUID(),
    addEmployeeLaptop);
router.route("/").get(getEmployees)
router.route("/:id").delete(deleteEmployeeLaptopById)
module.exports = router;
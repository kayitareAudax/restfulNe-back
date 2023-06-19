const { createLaptop, getLaptops } = require("../controllers/laptop.controller");
const { protect } = require("../middleware/auth.middleware");
const {check}=require("express-validator")
const router=require("express").Router();
router.use(protect)
router.route("/").post(
    check('manufacturer').notEmpty().withMessage('Manufacturer is required'),
    check('model').notEmpty().withMessage('Model is required'),
    check('serialNumber').notEmpty().withMessage('Serial number is required'),
    createLaptop);
router.route("/").get(getLaptops)
module.exports=router;
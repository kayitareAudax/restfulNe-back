const router=require("express").Router();
router.use("/user",require("./user.routes"));
router.use("/employee",require("./employee.routes"));
router.use("/laptop",require("./laptop.routes"));
module.exports=router;
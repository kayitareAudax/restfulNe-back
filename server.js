const express=require("express")
const app=express();
const cors=require("cors");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const dotenv=require("dotenv");
dotenv.config();
app.use(express.json());
const port=process.env.PORT||5000
app.listen(port,()=>{
    console.log(`server running on port ${port}`);
})
app.use(cors());
require("./models/database")
const routes=require("./routes");
app.use("/",routes);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
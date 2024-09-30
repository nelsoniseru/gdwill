const express = require("express")
const cors =  require("cors")
const path = require("path")
const app = express()
const dotenv  = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const authRoutes = require("./route/auth.route")
const propertyRoutes = require("./route/property.route")

const db = require("./models/db")
db.Dbconnect()
app.get("/",function(req,res){
res.send({message:"api works well"})
})
app.use(cors())
app.use(express.json());

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/property",propertyRoutes)

app.get("/",(req,res)=>{
    res.send("it works")
})
var port = process.env.PORT || 5003
app.listen(port,()=>{
    console.log("app running on port "+port)
})


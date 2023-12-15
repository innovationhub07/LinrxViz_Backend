import express, { request } from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./Routes/Users.js"

dotenv.config();
const app = express();
app.use(express.json({limit : "30mb", extended : true}))

app.set("view engine","ejs");
app.use(express.urlencoded({extended : false}))
app.use(cors())

app.get('/',(req,res)=> {
    res.send("This is a stack overflow clone API")

})

app.use("/user",userRoutes)

const PORT = process.env.PORT || 5000
const CONNECION_URL = process.env.CONNECTION_URL

mongoose.connect( CONNECION_URL, {useNewUrlParser: true, useUnifiedTopology: true} )
    .then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
    .catch((err)=> console.log(err.message))

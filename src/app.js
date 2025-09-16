import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express()

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials:true
}))

app.use(express.json({limit:"16kb"}))  //limiting json data so it does not crash the server
app.use(express.urlencoded({extended:true,limit:"16kb"})) // url encoder
app.use(express.static("public")) // somedocuments that are saved on public folder on our server
app.use(cookieParser())

// import routes 
import userRouter from "./routes/user.routes.js"


//routes decleration
app.use("/api/v1/users",userRouter)

export default app;
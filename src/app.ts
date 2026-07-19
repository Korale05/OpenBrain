import express from "express";
import cookieParser from "cookie-parser";
import authrouter from "./routes/auth.route.js";
import contentRouter from "./routes/content.route.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api/v1/auth",authrouter);
app.use("/api/v1/content",contentRouter);

app.get("/",(req,res)=>{
    return res.send("Hello World !");
})




export default app;
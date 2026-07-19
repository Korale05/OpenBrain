
import { Router } from "express";
import { AddnewContent, getallContent } from "../controllers/content.controller.js";
import Protect from "../middlewares/protect.middleware.js";

const contentRouter = Router();


contentRouter.get("/",Protect,getallContent);
contentRouter.post("/",Protect,AddnewContent);


export default contentRouter;
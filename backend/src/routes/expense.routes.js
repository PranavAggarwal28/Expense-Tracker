import { Router } from "express";
import { RegisterUser } from "../controllers/expense.controllers.js";

const router = Router();

//todo here routes will be set up for controllers 
router.route("/user/register").post(RegisterUser)

export default router;
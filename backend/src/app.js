import express from "express";
import expenserouter from "./routes/expense.routes.js"
import { errorHandler } from "./utils/errorHandler.js";
const app = express();

app.use(express.json({limit:"16kb"}))  // it is used to read json data 
app.use("/api/v1",expenserouter); // setting up routes so that routes start like https://port:8000/api/expense/then a particular route


app.use(errorHandler);


export default app;
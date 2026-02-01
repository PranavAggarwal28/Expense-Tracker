import dbconnect from "./db/index.js";
import dotenv from "dotenv"
import app from "./app.js";

dotenv.config();




dbconnect()
.then(()=>{
  app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`server is running at port ${process.env.PORT || 3000}`)
  })
})
.catch((err)=>{
  console.log(`MONGODB connection failed`,err )
})


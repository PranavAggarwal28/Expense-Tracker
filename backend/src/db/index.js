import {mongoose} from "mongoose";
import { DB_NAME } from "../constant.js";

const dbconnect = async () =>{
  try {
    const dbconnection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n Mongodb connection successful!! dbhost ${dbconnection.connection.host} `)
  } catch (error) {
    console.log(`Mongodb connection failed : error ` , error)
    process.exit(1)
  }
}

export default dbconnect;

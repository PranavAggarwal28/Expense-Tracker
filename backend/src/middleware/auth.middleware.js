import { User } from "../models/user.models";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { decode } from "jsonwebtoken"
export const verifyJwt = asyncHandler(async (req,res,next)=>{

  try{
    const token = req.cookies?.accessToken || req.header("Authorization")
    
    if(!token){
      throw new ApiError(400,"Unauthorizaiton request")
    }

    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)


    const user = await User.findById(decodedToken._id).select("-password")

    if(!user){
      throw new ApiError(401,"Invalid access token")
    }

    req.user = user // this lets the controller know who is loggedin
    next()


  }

  catch(error){
    throw new ApiError(401 , error.message || "invalid access token")
  }
})
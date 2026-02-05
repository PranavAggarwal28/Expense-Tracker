import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { User } from "../models/user.models.js";


const RegisterUser = asyncHandler(async (req,res)=>{
  /* steps to register a user 
    1. take all the data like {username , full name , email , password }
    2. check all the data that is required is available 
    3. check if user already exist
    4. create user object in database
    5. return res if user is successfully created
    

  */
    // step 1 
    const {username, fullname , email , password } = req.body ; 


    // step 2 
    if(
      [username, fullname, email , password].some((field)=>field?.trim() === "")
    ){
      throw new ApiError(400,"all fields are required")
    }

    // step 3 

    const existedUser = await User.findOne({
      $or:[{username},{email}]
    })


    if(existedUser){
      throw new ApiError(400 , "User with same email password already exist")
    }


    //step 4

    const user = await User.create({
      username,
      fullname,
      email,
      password
    })
    const Createduser = await User.findById(user._id).select(
      "-password"
    )

    if(!Createduser){
      throw new ApiError(500,"There is some error while creating User please try again ")
    }

    // step 5 

    return res
    .status(201)
    .json(new ApiResponse(200,Createduser,"User successfully registered"))

})


const LoginUser = asyncHandler(async (req,res)=>{
  /* steps to login a user
  1. take all the neccessary details like (email , password ) from the user 
  2. check if all the details are correct or not .
  3. check if user exist.
  4. compare passwords.  
  3. if correct generate a jason web token (access token (short lived)).
  
  
  */

  const {email, password} = req.body;

 //1

  if(!email || !password){
    throw new ApiError(400,"email or password is missing")
  }

  // 2 
  const user = await User.findOne({
    email
  })

  if(!user){
    throw new ApiError(400,"User does not exist")
  }


  //3 

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials ")
  }

  const token =  jwt.sign(
    {_id : user._id},
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  )

  

  const loggedInuser = await User.findById(user._id).select(
    "-password"
  )

   const options = {
    //it makes cookies only modifiable through server only
    httpOnly: true,
    secure: true,
  };
  
  return res
  .status(200)
  .cookie("accessToken",token,options)
  .json(
    new ApiResponse(
      200,
      {
        user:loggedInuser,
        token
      },
      "User logged in successfully"
    )
  )

})








export {
  RegisterUser,
  LoginUser
}
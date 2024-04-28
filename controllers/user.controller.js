import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { uploadOnCloudnary } from "../utils/cloudnary.js" 
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
  // get user details from frontend
  // validation - not empty
  // check if user alerady exsists: usernam,email
  // check for image check for avtar
  // upload them to cloudinary, avtar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const {fullname,email,username,password} = req.body
  console.log(email) 

  if([fullname,email,username,password].some((field) => field ?.trim() === "")){
    throw new ApiError(400,"All Fields are required")
  }
})

const exsitedUser = User.findOne({
  $or:[{username},{email}]
})

if(exsitedUser){
  throw new ApiError(409,"User with email or username alerady exsits")
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverImageLocalPath = req.files?.coverIamge[0]?.path;

if(!avatarLocalPath){
  throw new ApiError(400,"Avtar file is required")
}

const avtar = await uploadOnCloudnary(avatarLocalPath)
const coverImage = await uploadOnCloudnary(coverImageLocalPath)

if(!avtar){
  throw new ApiError(400, "Avtar file is required")
}

const user = await User.create({
  fullname,
  avtar:avtar.url,
  coverImage:coverImage?.url || "",
  email,
  password,
  username: username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)

if(!createdUser){
  throw new ApiError("500","Something went wrong whlie registering user")
}


return res.status(201).json(
  new ApiResponse(200,createdUser,"User registerd Succesfully")
)

export {registerUser}


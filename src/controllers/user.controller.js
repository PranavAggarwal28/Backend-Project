import { use } from "react";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
  // 1. take input data from the form .
  // 2. validation of the data.(not empty)
  // 3. check if user already exist(username and email)
  // 4. check for files (avatar or coverimage )
  // 5 . upload to cloudinary
  // 6. create user object- create data entry in db.
  // 7. remove password and refresh tokens from response
  // 8. check for usercreation
  // 9. return res
  const { username, email, fullname, password } = req.body;
  console.log("Username: ", username);

  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImagePath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  const avatarUpload = await uploadonCloudinary(avatarLocalPath);
  const coverImageUpload = await uploadonCloudinary(coverImagePath);

  if (!avatarUpload) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatarUpload.url,
    coverImage: coverImageUpload?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshTokens"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser , "User registered Successfully")
  )
});

export { registerUser };

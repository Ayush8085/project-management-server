const asyncHandler = require("express-async-handler");
const zod = require("zod");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const {
    generateAccessToken,
    generateRefreshToken,
} = require("../utils/generateToken");
const RefreshToken = require("../models/refreshTokenModel");
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const cloudinary = require("cloudinary").v2;

// ------------------ LOGIN USER ------------------
const loginUser = asyncHandler(async (req, res) => {
    const loginObject = zod.object({
        email: zod.string().email(),
        password: zod.string().min(6),
    });

    const { success } = loginObject.safeParse(req.body);

    // CHECK INPUTS
    if (!success) {
        res.status(411);
        throw new Error("Invalid inputs!!");
    }

    // CHECK USER EXISTENCE
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        res.status(411);
        throw new Error("User not found with this email, please register!!");
    }

    // CHECK PASSWORD
    const correctPass = await bcrypt.compare(req.body.password, user.password);
    if (!correctPass) {
        res.status(411);
        throw new Error("Invalid password!!");
    }

    // TOKENS
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // ADD REFRESH TOKEN TO MODEL
    await RefreshToken.findOneAndUpdate({ userId: user._id }, { refreshToken });

    // SET TOKEN IN COOKIE
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })
        .cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
        })
        .json({
            message: "Successful login",
            firstname: user.firstname,
            email: user.email,
            accessToken,
            refreshToken,
        });
});

// ------------------ SIGNUP USER ------------------
const signupUser = asyncHandler(async (req, res) => {
    const signupObject = zod.object({
        firstname: zod.string(),
        email: zod.string().email(),
        password1: zod.string().min(6),
        password2: zod.string().min(6),
    });

    // CHECK INPUTS
    const { success } = signupObject.safeParse(req.body);
    if (!success) {
        res.status(411);
        throw new Error("Invalid inputs!!");
    }

    // MATCH INPUT PASSWORDS
    if (req.body.password1 !== req.body.password2) {
        res.status(411);
        throw new Error("Passwords does not match!!");
    }

    // CHECK USER EXISTENCE
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
        res.status(411);
        throw new Error("User already exists with this email, please login!!");
    }

    // CREATE USER
    const userCreated = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password1,
    });

    // TOKENS
    const accessToken = generateAccessToken(userCreated._id);
    const refreshToken = generateRefreshToken(userCreated._id);

    // ADD REFRESH TOKEN TO MODEL
    await RefreshToken.create({
        userId: userCreated._id,
        refreshToken,
    });

    // SET TOKEN IN COOKIE
    return res
        .status(201)
        .cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })
        .cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
        })
        .json({
            message: "Successful signup",
            firstname: req.body.firstname,
            email: req.body.email,
            accessToken,
            refreshToken,
        });
});

// ------------------ GENERATE ACCESS TOKEN FROM REFRESH TOKEN ------------------
const accessTokenFromRefreshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        res.status(403);
        throw new Error("unauthorised request!!");
    }

    // CHECK IF TOKEN VERIFIED SUCCESSFULLY
    const { success, userId } = await verifyRefreshToken(incomingRefreshToken);

    if (!success) {
        res.status(404);
        throw new Error("Invalid token!!");
    }

    // GENERATE NEW ACCESS TOKEN
    const accessToken = generateAccessToken(userId);

    // SET TO COOKIES
    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            secure: false,
            httpOnly: true,
        })
        .cookie("refreshToken", incomingRefreshToken, {
            secure: false,
            httpOnly: true,
        })
        .json({
            message: "Access token updated.",
            accessToken,
            refreshToken: incomingRefreshToken,
        });
});

// ------------------ UPDATE USER PROFILE ------------------
const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);

    // CHECK USER EXISTANCE
    if (!user) {
        res.status(404);
        throw new Error("User not found!!");
    }

    // EXCLUDE PASSWORD UPDATION
    const { password, ...others } = req.body;

    // UPLOAD AVATAR
    const file = req.file;
    if (file) {
        cloudinary.uploader.upload(file.path, async function (err, result) {
            if (err) {
                console.log("UPLOAD ERR: ", String(err));
            } else {
                await User.updateOne(
                    { _id: user._id },
                    { avatar: result.secure_url }
                ).then(() => console.log("AVATAR UPDATED"));
            }
        });
    }

    // UPDATE THE USER
    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
            ...others,
        }
    ).select("-password");

    return res.status(200).json({
        message: "Successfully updated profile.",
        user: updatedUser,
    });
});

// ------------------ UPDATE USER PROFILE ------------------
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select("-password");

    // CHECK USER EXISTANCE
    if (!user) {
        res.status(404);
        throw new Error("User not found!!");
    }
    return res.status(200).json({
        user,
    });
});

module.exports = {
    loginUser,
    signupUser,
    accessTokenFromRefreshToken,
    updateProfile,
    getUserProfile,
};

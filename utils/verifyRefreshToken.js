const asyncHandler = require("express-async-handler");
const { REFRESH_TOKEN_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshTokenModel");

const verifyRefreshToken = asyncHandler(async (refreshToken) => {

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    // console.log("DECODED: ", decoded);

    let result = {};

    const validToken = await RefreshToken.findOne({
        userId: decoded.userId,
        refreshToken
    });

    if (!validToken) {
        console.log("SUCCESS: FALSE");
        return { success: false, userId: null }
    }

    return { success: true, userId: decoded.userId };
})

module.exports = verifyRefreshToken;
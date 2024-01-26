const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

const RefreshToken = mongoose.model("RefreshToken", tokenSchema);

module.exports = RefreshToken;

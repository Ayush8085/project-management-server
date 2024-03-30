const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true,
            trim: true,
        },
        lastname: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
        },
        role: {
            type: String,
            default: "user",
        },
        favoriteProjects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project'
        }],
        avatar: {
            type: String,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
    },
    { timestamps: true }
);

// -------------- SAVE BEFORE UPDATING PASSWORD --------------
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const hashPassword = await bcrypt.hash(this.password, 10);
    this.password = hashPassword;
});

const User = mongoose.model("User", userSchema);

module.exports = User;

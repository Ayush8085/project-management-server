const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
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
        type: String
    },
    role: {
        type: String,
        default: "Employee"
    },
    favoriteProjects: [
        { type: String }
    ],
    avatar: {
        type: String,
        default: 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png',
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

// -------------- SAVE BEFORE UPDATING PASSWORD --------------
userSchema.pre('save', function (next) {
    if (this.password.isModified) {
        const hashPassword = bcrypt.hash(this.password);
        this.password = hashPassword;
        console.log("PASSWORD HASHED: ", hashPassword);
    }

    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;
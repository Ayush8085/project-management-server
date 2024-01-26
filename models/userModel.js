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
      default: "Employee",
    },
    favoriteProjects: [{ type: String }],
    avatar: {
      type: String,
      default:
        "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
    },
  },
  { timestamps: true },
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

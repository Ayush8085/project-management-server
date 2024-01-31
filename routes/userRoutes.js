const {
    loginUser,
    signupUser,
    accessTokenFromRefreshToken,
    updateProfile,
    getUserProfile,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");

const router = require("express").Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/get-profile", authMiddleware, getUserProfile);
router.put(
    "/update-profile",
    authMiddleware,
    upload.single("image"),
    updateProfile
);
router.get("/refresh", accessTokenFromRefreshToken);

module.exports = router;

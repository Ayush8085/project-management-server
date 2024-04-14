const {
    loginUser,
    signupUser,
    accessTokenFromRefreshToken,
    updateProfile,
    getUserProfile,
    logoutUser,
    getAllUsers,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../utils/upload");

const router = require("express").Router();

router.post("/login", loginUser);
router.post("/signup", signupUser);
router.get("/logout", authMiddleware, logoutUser);
router.get("/get-profile", authMiddleware, getUserProfile);
router.get("/get-all", authMiddleware, getAllUsers);
router.put(
    "/update-profile",
    authMiddleware,
    upload.single("image"),
    updateProfile
);
router.get("/refresh", accessTokenFromRefreshToken);

module.exports = router;

const {
    CLOUDIANRY_CLOUD_NAME,
    CLOUDIANRY_API_KEY,
    CLOUDIANRY_API_SECRET,
} = require("../config");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: CLOUDIANRY_CLOUD_NAME,
    api_key: CLOUDIANRY_API_KEY,
    api_secret: CLOUDIANRY_API_SECRET,
});

module.exports = cloudinary;

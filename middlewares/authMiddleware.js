const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../config');

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403);
        throw new Error('Missing/Invalid token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(403);
        throw new Error('Token missing!!');
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.userId = decodedToken.userId;

    next();
});

module.exports = authMiddleware;
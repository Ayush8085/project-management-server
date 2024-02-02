const { NODE_ENV } = require("../config");

const errorMiddleware = (err, req, res) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode).json({
        message: err.message,
        stack: NODE_ENV === "dev" ? err.stack : null,
    });
};

module.exports = errorMiddleware;

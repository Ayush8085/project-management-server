const express = require("express");
const { PORT, MONGO_URI } = require("./config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

// ------------- MIDDLEWARES -------------
app.use(cors({}));
app.use(express.json());
app.use(cookieParser());

// ------------- ROUTES MIDDLEWARES -------------
app.use("/api/v1/users", userRoutes);

// ------------- ERROR MIDDLEWARE -------------
app.use(errorMiddleware);

// ------------- LISTENING FROM THE SERVER -------------
mongoose
    .connect(MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => console.log(String(err)));

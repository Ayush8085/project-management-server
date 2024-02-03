const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        admins: [{ type: mongoose.Schema.Types.ObjectId }],
        users: [{ type: mongoose.Schema.Types.ObjectId }],
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

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
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;

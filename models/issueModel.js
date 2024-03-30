const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        // title: {
        //     type: String,
        // },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: ["epic", "task", "subtask", "story", "bug"],
            default: "task",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;

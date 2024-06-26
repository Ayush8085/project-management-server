const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        parentIssue: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue",
        },
        isChild: {
            type: Boolean,
            required: true,
            default: false,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        key: {
            type: String,
        },
        type: {
            type: String,
            enum: ["epic", "task", "subtask", "story", "bug"],
            default: "task",
        },
        status: {
            type: String,
            enum: ["todo", "inprogress", "done"],
            default: "todo",
        },
        attachment: {
            type: Object,
            default: {},
        },
        assigner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        childIssues: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Issue",
            },
        ],
        linkdedIssues: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Issue",
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;

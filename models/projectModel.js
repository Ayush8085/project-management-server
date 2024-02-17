const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        projectType: {
            type: String,
            enum: ["company-managed", "team-managed"],
            default: "team-managed",
            trim: true,
        },
        projectTemplate: {
            type: String,
            enum: ["KANBAN", "SCRUM"],
            default: "KANBAN",
            trim: true,
        },
        key: {
            type: String,
            trim: true,
            required: true,
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

const asyncHandler = require("express-async-handler");
const zod = require("zod");
const Project = require("../models/projectModel");
const Issue = require("../models/issueModel");

// ------------------- CREATE ISSUE --------------------
const createIssue = asyncHandler(async (req, res) => {
    const issueObject = zod.object({
        projectId: zod.string(),
        description: zod.string(),
    });

    const { success } = issueObject.safeParse(req.body);

    // CHECK INPUTS
    if (!success) {
        res.status(411);
        throw new Error("Invalid inputs!!");
    }

    // CHECK IF PROJECT EXISTS
    const isProject = await Project.findById(req.body.projectId);
    if (!isProject) {
        res.status(404);
        throw new Error("Project not found!!");
    }

    // CREATING ISSUE
    const createdIssue = await Issue.create({
        projectId: req.body.projectId,
        description: req.body.description,
        type: req.body.type,
        createdBy: req.userId,
    });

    // ADD TO PROJECT
    await Project.findByIdAndUpdate(
        req.body.projectId,
        {
            $push: {
                issues: createdIssue.id,
            },
        },
        { runValidators: true }
    );

    return res.status(201).json({
        message: "Issue created successfully!!",
        issue: createdIssue,
    });
});

module.exports = {
    createIssue,
};
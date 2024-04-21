const asyncHandler = require("express-async-handler");
const zod = require("zod");
const Project = require("../models/projectModel");
const Issue = require("../models/issueModel");

// ------------------- CREATE ISSUE --------------------
const createIssue = asyncHandler(async (req, res) => {
    const issueObject = zod.object({
        projectId: zod.string(),
        title: zod.string(),
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
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        type: req.body.type,
        createdBy: req.userId,
        key: `${isProject.key}-${isProject.issue_count + 1}`,
    });

    // ADD TO PROJECT
    await Project.findByIdAndUpdate(
        req.body.projectId,
        {
            $push: {
                issues: createdIssue.id,
            },
            $inc: {
                issue_count: 1,
            },
        },
        { runValidators: true }
    );

    return res.status(201).json({
        message: "Issue created successfully!!",
        issue: createdIssue,
    });
});

// ------------------- UPDATE ISSUE --------------------
const updateIssue = asyncHandler(async (req, res) => {
    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    // CHECK IF PROJECT ADMIN, OWNER
    const project = await Project.findOne({
        _id: issue.projectId,
        $or: [{ owner: req.userId }, { admins: req.userId }],
    });

    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not permitted on this project!!"
        );
    }

    if (req.body.assignee) {
        await Issue.findByIdAndUpdate(
            req.params.issueId,
            {
                description: req.body.description,
                assignee: req.body.assignee,
                assigner: req.userId,
            },
            { runValidators: true }
        );
    } else {
        await Issue.findByIdAndUpdate(
            req.params.issueId,
            {
                description: req.body.description,
            },
            { runValidators: true }
        );
    }

    return res.status(200).json({
        message: "Issue updated successfully!!",
    });
});

// ------------------- GET ALL ISSUES OF A PROJECT --------------------
const getAllIssues = asyncHandler(async (req, res) => {
    // CHECK IF PROJECT EXISTS
    const project = await Project.findOne({
        _id: req.params.projectId,
        $or: [
            { owner: req.userId },
            { admins: req.userId },
            { users: req.userId },
        ],
    });

    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not permitted on this project!!"
        );
    }

    // GET ALL ISSUES THAN
    const issues = await Issue.find({
        projectId: req.params.projectId,
        isChild: false
    })
        .populate("createdBy")
        .populate("parentIssue")
        .populate("childIssues");
    return res.status(200).json({
        issues,
    });
});

// ------------------- GET ONE ISSUE OF A PROJECT --------------------
const getOneIssue = asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.issueId);

    if (!issue) {
        res.status(404);
        throw new Error(
            "Issue not found or you are not permitted on this project"
        );
    }

    return res.status(200).json({ issue });
});

// ------------------- DELETE ISSUE --------------------
const deleteIssue = asyncHandler(async (req, res) => {
    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    // REMOVE ISSUE FROM THE PROJECT
    await Project.findOneAndUpdate(
        {
            _id: issue.projectId,
            $or: [{ owner: req.userId }, { admins: req.userId }],
        },
        {
            $pull: {
                issues: issue.id,
            },
        },
        { runValidators: true }
    );
    await issue.deleteOne();

    return res.status(200).json({
        message: "Issue deleted from the project!!",
    });
});

// ------------------- UPDATE STATUS OF ISSUE --------------------
const updateIssueStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!status) {
        res.status(404);
        throw new Error("Please provide status!!");
    }

    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findByIdAndUpdate(
        req.params.issueId,
        {
            status,
        },
        { runValidators: true }
    );
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    return res.status(200).json({
        message: "Status updated successfully!!",
    });
});

// ------------------- ADD CHILD TO ISSUE --------------------
const addChildIssue = asyncHandler(async (req, res) => {
    const issueObject = zod.object({
        projectId: zod.string(),
        title: zod.string(),
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
        parentIssue: req.params.issueId,
        isChild: true,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        type: req.body.type,
        createdBy: req.userId,
        key: `${isProject.key}-${isProject.issue_count + 1}`,
    });

    // INCREMENT ISSUE COUNT
    await isProject.updateOne({ $inc: { issue_count: 1 } });

    // CHECK IF ISSUE EXISTS AND ADD CHILD
    const issue = await Issue.findByIdAndUpdate(
        req.params.issueId,
        {
            $push: {
                childIssues: createdIssue.id,
            },
        },
        { runValidators: true }
    );

    if (!issue) {
        await createdIssue.deleteOne();
        res.status(404);
        throw new Error("Issue not found!!");
    }

    return res.status(201).json({
        message: "Child added to issue successfully!!",
    });
});

// ------------------- REMOVE CHILD TO ISSUE --------------------
const removeChildIssue = asyncHandler(async (req, res) => {
    // CHECK INPUTS
    const { childId } = req.body;
    if (!childId) {
        res.status(404);
        throw new Error("Child id required!!");
    }

    const child = await Issue.findByIdAndDelete(childId);
    if (!child) {
        res.status(404);
        throw new Error("Child issue not found!!");
    }

    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findByIdAndUpdate(
        req.params.issueId,
        {
            $pull: {
                childIssues: childId,
            },
        },
        { runValidators: true }
    );
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    return res.status(200).json({
        message: "Child issue removed successfully!!",
    });
});

// ------------------- LINK ISSUES --------------------
const linkIssue = asyncHandler(async (req, res) => {
    // CHECK INPUTS
    const { connectToIssueId } = req.body;
    if (!connectToIssueId) {
        res.status(404);
        throw new Error("connectToIssueId is missing!!");
    }

    // CHECK IF ISSUES EXISTS
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }
    if (issue.linkdedIssues.includes(connectToIssueId)) {
        return res.status(200).json({
            message: "Already connected!!",
        });
    }
    const connectToIssue = await Issue.findById(connectToIssueId);
    if (!connectToIssue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    await issue.updateOne({ $push: { linkdedIssues: connectToIssueId } });
    await connectToIssue.updateOne({
        $push: { linkdedIssues: req.params.issueId },
    });

    return res.status(200).json({
        message: "Issue connected successfully!!",
    });
});

// ------------------- REMOVE LINK ISSUES --------------------
const removelinkIssue = asyncHandler(async (req, res) => {
    // CHECK INPUTS
    const { connectToIssueId } = req.body;
    if (!connectToIssueId) {
        res.status(404);
        throw new Error("connectToIssueId is missing!!");
    }

    // CHECK IF ISSUES EXISTS
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }
    const connectToIssue = await Issue.findById(connectToIssueId);
    if (!connectToIssue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    await issue.updateOne({ $pull: { linkdedIssues: connectToIssueId } });
    await connectToIssue.updateOne({
        $pull: { linkdedIssues: req.params.issueId },
    });

    return res.status(200).json({
        message: "Issue disconnected successfully!!",
    });
});

// ------------------- GET ALL CHILD ISSUES OF AN ISSUE --------------------
const getAllChildIssue = asyncHandler(async (req, res) => {
    const issue = await Issue.findById(req.params.issueId).populate(
        "childIssues"
    );
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    return res.status(200).json({
        childIssues: issue.childIssues,
    });
});

// ------------------- UPLOAD ATTACHMENT ON ISSUE --------------------
const uploadAttachment = asyncHandler(async (req, res) => {
    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    // ADD ATTACHMENT
    const file = req.file;
    if (file) {
        const fileData = {
            path: file.path,
            originalName: file.originalname,
        };

        // SAVE TO DB
        await Issue.findByIdAndUpdate(req.params.issueId, {
            attachment: fileData,
        })
            .then(() => console.log("ATTACHMENT ADDED"))
            .catch((err) => {
                res.status(404);
                throw new Error(err);
            });
    }

    return res.status(200).json({
        message: "Attachment provided to issue!!",
    });
});

// ------------------- DOWNLOAD ATTACHMENT OF ISSUE --------------------
const getAttachment = asyncHandler(async (req, res) => {
    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    // CHECK FOR ATTACHMENT
    if (!issue.attachment) {
        res.status(404);
        throw new Error("This isssue does not have any attachment!!");
    }

    // DOWNLOAD ATTACHMENT
    return res.download(issue.attachment.path, issue.attachment.originalName);
});

module.exports = {
    createIssue,
    getAllIssues,
    getOneIssue,
    updateIssueStatus,
    deleteIssue,
    uploadAttachment,
    getAttachment,
    addChildIssue,
    removeChildIssue,
    updateIssue,
    getAllChildIssue,
    linkIssue,
    removelinkIssue,
};

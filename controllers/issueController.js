const asyncHandler = require("express-async-handler");
const zod = require("zod");
const Project = require("../models/projectModel");
const Issue = require("../models/issueModel");
const cloudinary = require("cloudinary").v2;

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

// ------------------- GET ALL ISSUES OF A PROJECT --------------------
const getAllIssues = asyncHandler(async (req, res) => {
    // CHECK IF PROJECT EXISTS
    const project = await Project.findOne({
        _id: req.params.id,
        $or: [{ owner: req.userId }, { admins: req.userId }],
    });

    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not permitted on this project!!"
        );
    }

    // GET ALL ISSUES THAN
    const issues = await Issue.find({ projectId: req.params.id }).populate(
        "createdBy"
    );
    return res.status(200).json({
        issues,
    });
});

// ------------------- DELETE ISSUE --------------------
const deleteIssue = asyncHandler(async (req, res) => {
    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findById(req.params.id);
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

// ------------------- UPLOAD ATTACHMENT ON ISSUE --------------------
const uploadAttachment = asyncHandler(async (req, res) => {
    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    // ADD ATTACHMENT
    const file = req.file;
    if (file) {
        console.log("FILE: ", file);

        // await Issue.findByIdAndUpdate(
        //     req.params.id,
        //     {
        //         attachment: fileData
        //     }
        // ).then(() => console.log("ATTACHMENT ADDED"))

        // ADD TO CLOUDINARY
        cloudinary.uploader.upload(file.path, async function (err, result) {
            if (err) {
                console.log("Attachment err: ", String(err));
            } else {
                const fileData = {
                    path: result.secure_url,
                    originalName: result.original_filename,
                };
                await Issue.findByIdAndUpdate(req.params.id, {
                    attachment: fileData,
                }).then(() => console.log("ATTACHMENT ADDED"));
            }
        });
    }

    return res.status(200).json({
        message: "Attachment provided to issue!!",
    });
});

// ------------------- DOWNLOAD ATTACHMENT OF ISSUE --------------------
const getAttachment = asyncHandler(async (req, res) => {
    // CHECK IF ISSUE EXISTS
    const issue = await Issue.findById(req.params.id);
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
    // return res.download(issue.attachment.path, issue.attachment.originalName);
    return res.redirect(issue.attachment.path);
});

module.exports = {
    createIssue,
    getAllIssues,
    deleteIssue,
    uploadAttachment,
    getAttachment,
};

const asyncHandler = require("express-async-handler");
const Project = require("../models/projectModel");
const Issue = require("../models/issueModel");
const Comment = require("../models/commentModel");

// ------------------- CREATE COMMENT ON ISSUE --------------------
const createComment = asyncHandler(async (req, res) => {
    // CHECK FOR INPUTS
    const { text } = req.body;
    if (!text) {
        res.status(404);
        throw new Error("Comment must contain some text!!");
    }
    // CHECK FOR ISSUE
    const issue = await Issue.findById(req.params.issueId);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    // CREATE A COMMENT
    const comment = await Comment.create({
        issueId: issue.id,
        userId: req.userId,
        text: text,
    });

    // ADD COMMENT TO THE ISSUE
    await issue.updateOne({
        $push: {
            comments: comment._id,
        },
    });

    await comment.populate("userId");

    return res.status(201).json({
        message: "Comment created and added to the issue!!",
        comment,
    });
});

// ------------------- GET ALL THE COMMENTS OF AN ISSUE --------------------
const getAllComments = asyncHandler(async (req, res) => {
    // CHECK FOR ISSUE
    const comments = await Comment.find({
        issueId: req.params.issueId,
    })
        .populate("userId")
        .sort("-createdAt");
    if (!comments) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    return res.status(200).json({
        comments,
    });
});

// ------------------- GET ALL THE COMMENTS OF AN ISSUE --------------------
const deleteComment = asyncHandler(async (req, res) => {
    // CHECK FOR COMMENT
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        res.status(404);
        throw new Error("Comment not found!!");
    }

    // CHECK FOR ISSUE
    const issue = await Issue.findById(comment.issueId);
    if (!issue) {
        res.status(404);
        throw new Error("Issue not found!!");
    }

    // CHECK IF ADMIN OR OWNER OF PROJECT
    const project = await Project.findOne({
        _id: issue.projectId,
        $or: [{ owner: req.userId }, { admins: req.userId }],
    }).populate("owner");

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are allowed to delete this project!!"
        );
    }

    // REMOVE COMMENT FOR ISSUE
    await issue.updateOne({
        $pull: {
            comments: comment.id,
        },
    });

    // DELETE THE COMMENT
    await comment.deleteOne();

    return res.status(200).json({
        message: "Comment deleted successfully!!",
    });
});

module.exports = {
    createComment,
    getAllComments,
    deleteComment,
};

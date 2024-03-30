const asyncHandler = require("express-async-handler");
const zod = require("zod");
const Project = require("../models/projectModel");
const User = require("../models/userModel");

// ------------------ CREATE PROJECT ------------------
const createProject = asyncHandler(async (req, res) => {
    const projectObject = zod.object({
        title: zod.string(),
        key: zod.string().min(3).max(5),
    });

    const { success } = projectObject.safeParse(req.body);

    // CHECK INPUTS
    if (!success) {
        res.status(411);
        throw new Error("Invalid inputs!!");
    }

    // CREATING PROJECT
    const createdProject = await Project.create({
        title: req.body.title,
        key: req.body.key,
        projectType: req.body.projectType,
        projectTemplate: req.body.projectTemplate,
        owner: req.userId,
        admins: [req.userId],
    });

    // Populate user
    await createdProject.populate("owner");

    return res.status(201).json({
        message: "Project created successfully!!",
        project: createdProject,
    });
});

// ------------------ GET ALL PROJECTS ------------------
const getAllProjects = asyncHandler(async (req, res) => {
    const userId = req.userId;

    const projects = await Project.find({
        $or: [{ owner: userId }, { admins: userId }, { users: userId }],
    }).populate("owner");

    return res.status(200).json({
        projects,
    });
});

// ------------------ GET A PROJECT ------------------
const getProject = asyncHandler(async (req, res) => {
    const project = await Project.findOne({
        _id: req.params.id,
        $or: [
            { owner: req.userId },
            { admins: req.userId },
            { users: req.userId },
        ],
    }).populate("owner");

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not permitted on this project!!"
        );
    }

    return res.status(200).json({
        project,
    });
});

// ------------------ DELETE A PROJECT ------------------
const deleteProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error("Project not found!!");
    }

    // CHECK IF USER IS OWNER OF PROJECT
    const isOwner = await Project.findOne({ owner: req.userId });
    if (!isOwner) {
        res.status(403);
        throw new Error("Only OWner can delete this project!!");
    }

    await Project.deleteOne({ _id: req.params.id });

    return res.status(200).json({
        message: "Project deleted successfully!!",
    });
});

// ------------------ UPDATE A PROJECT ------------------
const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findOneAndUpdate(
        {
            _id: req.params.id,
            owner: req.userId,
        },
        {
            title: req.body.title,
            projectType: req.body.projectType,
            projectTemplate: req.body.projectTemplate,
            updatedBy: req.userId,
        },
        { runValidators: true }
    );

    return res.status(200).json({
        message: "Project updated successfully!!",
        project,
    });
});

// ------------------ ADD A FAVOURITE PROJECT ------------------
const addFavouriteProject = asyncHandler(async (req, res) => {
    const project = await Project.findOne({
        _id: req.params.id,
        $or: [
            { owner: req.userId },
            { admins: req.userId },
            { users: req.userId },
        ],
    }).populate("owner");

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not permitted on this project!!"
        );
    }

    // ADD TO FAVOURITE
    await User.findByIdAndUpdate(
        req.userId,
        {
            $push: {
                favoriteProjects: req.params.id,
            },
        },
        { runValidators: true }
    );

    return res.status(200).json({
        message: "Project added to favourite successfully!!",
    });
});

// ------------------ REMOVE A FAVOURITE PROJECT ------------------
const removeFavouriteProject = asyncHandler(async (req, res) => {
    const project = await Project.findOne({
        _id: req.params.id,
        $or: [
            { owner: req.userId },
            { admins: req.userId },
            { users: req.userId },
        ],
    }).populate("owner");

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not permitted on this project!!"
        );
    }

    // ADD TO FAVOURITE
    await User.findByIdAndUpdate(
        req.userId,
        {
            $pull: {
                favoriteProjects: req.params.id,
            },
        },
        { runValidators: true }
    );

    return res.status(200).json({
        message: "Project removed from favourite successfully!!",
    });
});

module.exports = {
    getAllProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    addFavouriteProject,
    removeFavouriteProject,
};

const asyncHandler = require("express-async-handler");
const zod = require("zod");
const Project = require("../models/projectModel");
const User = require("../models/userModel");

// ------------------ CREATE PROJECT ------------------
const createProject = asyncHandler(async (req, res) => {
    const projectObject = zod.object({
        title: zod.string(),
        key: zod.string(),
    });

    const { success } = projectObject.safeParse(req.body);

    // CHECK INPUTS
    if (!success) {
        res.status(411);
        throw new Error("Invalid inputs!!");
    }

    // CHECK IF USER IS ADMIN
    const user = await User.findById(req.userId);
    if (user.role !== "admin") {
        res.status(403);
        throw new Error("Only admin can create projects!!");
    }

    // CREATING PROJECT
    const createdProject = await Project.create({
        title: req.body.title,
        key: req.body.key,
        owner: req.userId,
        admins: [req.userId],
    });

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
    });

    return res.status(200).json({
        projects,
    });
});

// ------------------ GET A PROJECT ------------------
const getProject = asyncHandler(async (req, res) => {
    // const project = await Project.findById(req.params.id);
    const project = await Project.findOne({
        _id: req.params.id,
        $or: [
            { owner: req.userId },
            { admins: req.userId },
            { users: req.userId },
        ],
    });

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
    const project = await Project.findByIdAndDelete(req.params.id);

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
            description: req.body.description,
            updatedBy: req.userId,
        }
    );

    return res.status(200).json({
        message: "Project updated successfully!!",
        project,
    });
});

module.exports = {
    getAllProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
};

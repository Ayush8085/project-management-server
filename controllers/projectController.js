const asyncHandler = require("express-async-handler");
const zod = require("zod");
const Project = require("../models/projectModel");

// ------------------ CREATE PROJECT ------------------
const createProject = asyncHandler(async (req, res) => {
    const projectObject = zod.object({
        title: zod.string(),
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
    const projects = await Project.find({});

    return res.status(200).json({
        projects,
    });
});

// ------------------ GET A PROJECT ------------------
const getProject = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error("Project not found!!");
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

    return res.status(200).json({
        message: "Project deleted successfully!!",
    });
});

module.exports = {
    getAllProjects,
    getProject,
    createProject,
    deleteProject,
};

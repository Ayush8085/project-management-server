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
        _id: req.params.projectId,
        $or: [
            { owner: req.userId },
            { admins: req.userId },
            { users: req.userId },
        ],
    })
        .populate("owner")
        .populate("admins")
        .populate("users");

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
    const project = await Project.findById(req.params.projectId);

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

    await Project.deleteOne({ _id: req.params.projectId });

    return res.status(200).json({
        message: "Project deleted successfully!!",
    });
});

// ------------------ UPDATE A PROJECT ------------------
const updateProject = asyncHandler(async (req, res) => {
    const project = await Project.findOneAndUpdate(
        {
            _id: req.params.projectId,
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
        _id: req.params.projectId,
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
                favoriteProjects: req.params.projectId,
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
        _id: req.params.projectId,
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
                favoriteProjects: req.params.projectId,
            },
        },
        { runValidators: true }
    );

    return res.status(200).json({
        message: "Project removed from favourite successfully!!",
    });
});

// ------------------ GET ALL FAVOURITE PROJECT ------------------
const getAllFavouriteProjects = asyncHandler(async (req, res) => {
    const userData = await User.findById(req.userId);

    return res.status(200).json({
        favoriteProjects: userData.favoriteProjects,
    });
});

// ------------------ ADD USER TO PROJECT ------------------
const addUserToProject = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    // CHECK INPUTS
    if (!userId) {
        res.status(404);
        throw new Error("UserId is required!!");
    }

    // CHECK IF USER EXISTS
    const userExists = await User.findById(userId);
    if (!userExists) {
        res.status(404);
        throw new Error("No user found with this userId!!");
    }

    const project = await Project.findOne({
        _id: req.params.projectId,
        $or: [{ owner: req.userId }, { admins: req.userId }],
    }).populate("owner");

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not an admin/owner on this project!!"
        );
    }

    // CHECK IF ALREADY IN PROJECT
    const alreadyInProject = await Project.findOne({
        users: userId,
    });
    if (alreadyInProject) {
        return res.status(200).json({
            message: "Already user of this project!!",
        });
    }

    await Project.findByIdAndUpdate(
        req.params.projectId,
        {
            $push: {
                users: userId,
            },
        },
        { runValidators: true }
    );

    return res.status(200).json({
        message: "User added to project successfully!!",
    });
});

// ------------------ REMOVE USER TO PROJECT ------------------
const removeUserToProject = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    // CHECK INPUTS
    if (!userId) {
        res.status(404);
        throw new Error("UserId is required!!");
    }

    const project = await Project.findOne({
        _id: req.params.projectId,
        $or: [{ owner: req.userId }, { admins: req.userId }],
    }).populate("owner");

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not an admin/owner on this project!!"
        );
    }

    await Project.findByIdAndUpdate(
        req.params.projectId,
        {
            $pull: {
                users: userId,
            },
        },
        { runValidators: true }
    );

    return res.status(200).json({
        message: "User removed from project successfully!!",
    });
});

// ------------------ GET ALL THE USERS NOT ON THE PROJECT ------------------
const getAllNotProjectUser = asyncHandler(async (req, res) => {
    // CHECK IF PROJECT EXISTS
    const project = await Project.findById(req.params.projectId);
    if (!project) {
        res.status(404);
        throw new Error("Project not found");
    }

    // EXCLUDE ALL THE USERS OF PROJECT
    const users = await User.find({
        $and: [
            { _id: { $nin: project.admins } },
            { _id: { $nin: project.users } },
        ],
    });

    return res.status(200).json(users);
});

// ------------------ CHANGE ROLE ON PROJECT ------------------
const changeRole = asyncHandler(async (req, res) => {
    // CHECK INPUT
    const { role, userId } = req.body;

    const project = await Project.findOne({
        _id: req.params.projectId,
        $or: [{ owner: req.userId }, { admins: req.userId }],
    });

    // CHECK IF PROJECT EXISTS
    if (!project) {
        res.status(404);
        throw new Error(
            "Project not found or you are not an admin/owner on this project!!"
        );
    }

    // REMOVING USER FROM PROJECT
    await Project.findByIdAndUpdate(
        req.params.projectId,
        {
            $pull: {
                admins: userId,
                users: userId,
            },
        },
        { runValidators: true }
    );

    // ADDING USER TO THE PROJECT AGAIN
    if (role === "admin") {
        await Project.findByIdAndUpdate(
            req.params.projectId,
            {
                $push: {
                    admins: userId,
                },
            },
            { runValidators: true }
        );
    } else if (role === "user") {
        await Project.findByIdAndUpdate(
            req.params.projectId,
            {
                $push: {
                    users: userId,
                },
            },
            { runValidators: true }
        );
    }

    return res.status(200).json({
        message: "User's role changed successfully!!",
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
    getAllFavouriteProjects,
    addUserToProject,
    removeUserToProject,
    getAllNotProjectUser,
    changeRole,
};

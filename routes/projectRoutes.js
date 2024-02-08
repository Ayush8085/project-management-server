const {
    getAllProjects,
    getProject,
    createProject,
    deleteProject,
} = require("../controllers/projectController");

const router = require("express").Router();

router.post("/create-project", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProject);
router.delete("/:id", deleteProject);

module.exports = router;

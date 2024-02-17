const {
    getAllProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
} = require("../controllers/projectController");

const router = require("express").Router();

router.post("/create-project", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProject);
router.delete("/:id", deleteProject);
router.put("/:id", updateProject);

module.exports = router;

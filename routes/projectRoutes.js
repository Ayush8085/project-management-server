const {
    getAllProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    addFavouriteProject,
    removeFavouriteProject,
} = require("../controllers/projectController");

const router = require("express").Router();

router.post("/create-project", createProject);
router.get("/", getAllProjects);
router.get("/:id", getProject);
router.delete("/:id", deleteProject);
router.put("/:id", updateProject);
router.get("/add-favour-project/:id", addFavouriteProject);
router.get("/remove-favour-project/:id", removeFavouriteProject);

module.exports = router;

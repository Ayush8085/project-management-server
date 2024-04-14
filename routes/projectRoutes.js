const {
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
} = require("../controllers/projectController");

const router = require("express").Router();

router.post("/create-project", createProject);
router.get("/", getAllProjects);
router.get("/get-all-fav-projects", getAllFavouriteProjects);
router.get("/:id", getProject);
router.delete("/:id", deleteProject);
router.put("/:id", updateProject);
router.post("/add-favour-project/:id", addFavouriteProject);
router.post("/remove-favour-project/:id", removeFavouriteProject);

router.post("/add-user/:id", addUserToProject);
router.post("/remove-user/:id", removeUserToProject);

module.exports = router;

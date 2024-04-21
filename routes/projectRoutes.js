const {
    getAllProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject,
    addFavouriteProject,
    removeFavouriteProject,
    getAllFavouriteProjects,
    getAllNotProjectUser,
    addUserToProject,
    removeUserToProject,
} = require("../controllers/projectController");

const router = require("express").Router();

router.post("/create-project", createProject);
router.get("/", getAllProjects);
router.get("/get-all-fav-projects", getAllFavouriteProjects);
router.get("/:projectId", getProject);
router.post("/get-all-not-project-user/:projectId", getAllNotProjectUser);
router.delete("/:projectId", deleteProject);
router.put("/:projectId", updateProject);
router.post("/add-favour-project/:projectId", addFavouriteProject);
router.post("/remove-favour-project/:projectId", removeFavouriteProject);

router.post("/add-user/:projectId", addUserToProject);
router.post("/remove-user/:projectId", removeUserToProject);

module.exports = router;

const express = require("express");
const {
    createIssue,
    deleteIssue,
    uploadAttachment,
    getAttachment,
    getAllIssues,
    updateIssueStatus,
    addChildIssue,
    removeChildIssue,
    getOneIssue,
} = require("../controllers/issueController");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/create-issue", createIssue);
router.get("/get-all/:id", getAllIssues);
router.get("/get-one/:id", getOneIssue);
router.post("/update-status/:id", updateIssueStatus);
router.post("/add-child-issue/:id", addChildIssue);
router.delete("/remove-child-issue/:id", removeChildIssue);
router.delete("/:id", deleteIssue);
router.post("/add-attachment/:id", upload.single("file"), uploadAttachment);
router.get("/get-attachment/:id", getAttachment);

module.exports = router;

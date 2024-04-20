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
    updateIssue,
    getAllChildIssue,
} = require("../controllers/issueController");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/create-issue", createIssue);
router.get("/get-all/:projectId", getAllIssues);
router.get("/get-one/:issueId", getOneIssue);
router.get("/get-all-child/:issueId", getAllChildIssue);
router.post("/update-status/:issueId", updateIssueStatus);
router.put("/update-issue/:issueId", updateIssue);
router.post("/add-child-issue/:issueId", addChildIssue);
router.delete("/remove-child-issue/:issueId", removeChildIssue);
router.delete("/:issueId", deleteIssue);
router.post(
    "/add-attachment/:issueId",
    upload.single("file"),
    uploadAttachment
);
router.get("/get-attachment/:issueId", getAttachment);

module.exports = router;

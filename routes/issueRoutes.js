const express = require("express");
const {
    createIssue,
    deleteIssue,
    uploadAttachment,
    getAttachment,
    getAllIssues,
    updateIssueStatus,
} = require("../controllers/issueController");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/create-issue", createIssue);
router.get("/:id", getAllIssues);
router.post("/update-status/:id", updateIssueStatus);
router.delete("/:id", deleteIssue);
router.post("/add-attachment/:id", upload.single("file"), uploadAttachment);
router.get("/get-attachment/:id", getAttachment);

module.exports = router;

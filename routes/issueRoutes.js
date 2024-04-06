const express = require("express");
const {
    createIssue,
    deleteIssue,
    uploadAttachment,
    getAttachment,
    getAllIssues,
} = require("../controllers/issueController");
const upload = require("../utils/upload");

const router = express.Router();

router.post("/create-issue", createIssue);
router.get("/:id", getAllIssues);
router.delete("/:id", deleteIssue);
router.post("/:id", upload.single("file"), uploadAttachment);
router.get("/attachment/:id", getAttachment);

module.exports = router;

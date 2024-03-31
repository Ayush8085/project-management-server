const express = require("express");
const { createIssue, deleteIssue } = require("../controllers/issueController");

const router = express.Router();

router.post("/create-issue", createIssue);
router.delete("/:id", deleteIssue);

module.exports = router;

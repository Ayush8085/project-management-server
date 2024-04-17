const {
    createComment,
    getAllComments,
    deleteComment,
} = require("../controllers/commentController");

const router = require("express").Router();

router.post("/:issueId", createComment);
router.get("/get-all/:issueId", getAllComments);
router.delete("/:commentId", deleteComment);

module.exports = router;

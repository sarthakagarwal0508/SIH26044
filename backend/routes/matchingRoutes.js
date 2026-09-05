const express = require("express");

const { getMatch } = require("../controllers/matchingController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/:studentId/:jobId",
    authMiddleware,
    getMatch
);

module.exports = router;
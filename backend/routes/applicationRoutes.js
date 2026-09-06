const express = require("express");

const {
    applyForJob,
    getMyApplications,
    getCompanyApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:jobId", authMiddleware, applyForJob);

router.get("/my-applications", authMiddleware, getMyApplications);

router.get(
    "/company/applications",
    authMiddleware,
    getCompanyApplications
);

router.put(
    "/:applicationId/status",
    authMiddleware,
    updateApplicationStatus
);

module.exports = router;
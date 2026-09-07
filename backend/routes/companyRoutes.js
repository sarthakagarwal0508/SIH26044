const express = require("express");

const {
  createCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile,
} = require("../controllers/companyController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create company profile
router.post("/profile", authMiddleware, createCompanyProfile);

// Get logged-in company's profile
router.get("/profile", authMiddleware, getCompanyProfile);

// Update logged-in company's profile
router.put("/profile", authMiddleware, updateCompanyProfile);

module.exports = router;
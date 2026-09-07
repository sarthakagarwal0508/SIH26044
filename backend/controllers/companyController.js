const Company = require("../models/company");

// Create company profile
const createCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company accounts can create a company profile",
      });
    }

    const existingCompany = await Company.findOne({
      user: req.user.id,
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company profile already exists",
        company: existingCompany,
      });
    }

    const {
      companyName,
      industry,
      description,
      location,
      website,
    } = req.body;

    if (!companyName || !industry) {
      return res.status(400).json({
        success: false,
        message: "Company name and industry are required",
      });
    }

    const company = await Company.create({
      user: req.user.id,
      companyName,
      industry,
      description,
      location,
      website,
    });

    res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      company,
    });
  } catch (error) {
    console.error("Create company profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create company profile",
      error: error.message,
    });
  }
};

// Get logged-in company's profile
const getCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company accounts can access this profile",
      });
    }

    const company = await Company.findOne({
      user: req.user.id,
    }).populate("user", "name email role");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Get company profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get company profile",
      error: error.message,
    });
  }
};

// Update logged-in company's profile
const updateCompanyProfile = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company accounts can update this profile",
      });
    }

    const company = await Company.findOne({
      user: req.user.id,
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const allowedFields = [
      "companyName",
      "industry",
      "description",
      "location",
      "website",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        company[field] = req.body[field];
      }
    });

    await company.save();

    res.json({
      success: true,
      message: "Company profile updated successfully",
      company,
    });
  } catch (error) {
    console.error("Update company profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update company profile",
      error: error.message,
    });
  }
};

module.exports = {
  createCompanyProfile,
  getCompanyProfile,
  updateCompanyProfile,
};
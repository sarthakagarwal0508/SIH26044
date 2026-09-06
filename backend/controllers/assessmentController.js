const Assessment = require("../models/assessment");
const AssessmentAttempt = require("../models/assessmentAttempt");
const StudentProfile = require("../models/studentProfile");
const Role = require("../models/role");
const Skill = require("../models/skill");

// ==================== GET ALL ASSESSMENTS ====================

const getAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find()
            .populate("role", "title description")
            .populate("questions.skill", "name category");

        res.status(200).json({
            success: true,
            count: assessments.length,
            assessments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET SINGLE ASSESSMENT ====================

const getAssessmentById = async (req, res) => {
    try {
        const assessment = await Assessment.findById(req.params.id)
            .populate("role", "title description")
            .populate("questions.skill", "name category");

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found"
            });
        }

        res.status(200).json({
            success: true,
            assessment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== SUBMIT ASSESSMENT ====================

const submitAssessment = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        const assessment = await Assessment.findById(req.params.id);

        if (!assessment) {
            return res.status(404).json({
                success: false,
                message: "Assessment not found"
            });
        }

        const { answers } = req.body;

        if (!Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: "Answers must be an array"
            });
        }

        let correctCount = 0;

        const evaluatedAnswers = answers.map((answer) => {
            const question = assessment.questions.id(answer.questionId);

            if (!question) {
                return {
                    questionId: answer.questionId,
                    selectedAnswer: answer.selectedAnswer || "",
                    isCorrect: false
                };
            }

            const isCorrect =
                question.correctAnswer === answer.selectedAnswer;

            if (isCorrect) {
                correctCount++;
            }

            return {
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer || "",
                isCorrect
            };
        });

        const totalQuestions = assessment.questions.length;

        const score =
            totalQuestions === 0
                ? 0
                : Math.round(
                      (correctCount / totalQuestions) * 100
                  );

        const attempt = await AssessmentAttempt.create({
            student: student._id,
            assessment: assessment._id,
            answers: evaluatedAnswers,
            score,
            completedAt: new Date()
        });

        res.status(201).json({
            success: true,
            message: "Assessment submitted successfully",
            result: {
                score,
                correctAnswers: correctCount,
                totalQuestions,
                passingPercentage: assessment.passingPercentage,
                passed: score >= assessment.passingPercentage
            },
            attempt
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ==================== GET MY ATTEMPTS ====================

const getMyAttempts = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        const attempts = await AssessmentAttempt.find({
            student: student._id
        })
            .populate("assessment", "title passingPercentage")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: attempts.length,
            attempts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAssessments,
    getAssessmentById,
    submitAssessment,
    getMyAttempts
};
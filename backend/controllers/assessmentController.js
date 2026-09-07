const Assessment = require("../models/assessment");
const AssessmentAttempt = require("../models/assessmentAttempt");
const StudentProfile = require("../models/studentProfile");
const Role = require("../models/role");
const Skill = require("../models/skill");

const {
    generateAssessmentQuestions
} = require("../services/assessmentService");


// ============================================================
// GET ALL ASSESSMENTS
// ============================================================

const getAssessments = async (req, res) => {

    try {

        const assessments =
            await Assessment.find()
                .populate(
                    "role",
                    "title description"
                )
                .populate(
                    "questions.skill",
                    "name category"
                );

        res.status(200).json({

            success: true,

            count:
                assessments.length,

            assessments

        });

    } catch (error) {

        console.error(
            "Get assessments error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });
    }
};


// ============================================================
// GET SINGLE ASSESSMENT
// ============================================================

const getAssessmentById = async (
    req,
    res
) => {

    try {

        const assessment =
            await Assessment.findById(
                req.params.id
            )
            .populate(
                "role",
                "title description"
            )
            .populate(
                "questions.skill",
                "name category"
            );


        if (!assessment) {

            return res.status(404).json({

                success: false,

                message:
                    "Assessment not found"

            });
        }


        res.status(200).json({

            success: true,

            assessment

        });

    } catch (error) {

        console.error(
            "Get assessment error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });
    }
};


// ============================================================
// GENERATE AI ASSESSMENT FOR A SKILL
// ============================================================
//
// This does NOT modify seed data.
// It creates a new Assessment document only when the student
// requests an assessment for a skill.
//
// Existing seeded assessments remain untouched.
// ============================================================

const generateSkillAssessment =
    async (req, res) => {

        try {

            const {
                skillId
            } = req.params;


            const {
                questionCount,
                forceNew
            } = req.body || {};


            // ------------------------------------------------
            // Validate Skill
            // ------------------------------------------------

            const skill =
                await Skill.findById(
                    skillId
                );


            if (!skill) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Skill not found"

                });
            }


            // ------------------------------------------------
            // Find student's current level
            // ------------------------------------------------

            const student =
                await StudentProfile.findOne({

                    user:
                        req.user.id

                });


            if (!student) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Student profile not found"

                });
            }


            let currentLevel = 1;


            const studentSkill =
                student.skills.find(
                    item =>
                        item.skill &&
                        item.skill.toString() ===
                        skill._id.toString()
                );


            if (studentSkill?.level) {

                currentLevel =
                    studentSkill.level;

            }


            // ------------------------------------------------
            // Prevent unnecessary duplicate AI assessments
            // ------------------------------------------------

            if (!forceNew) {

                const existing =
                    await Assessment.findOne({

                        "questions.skill":
                            skill._id,

                        title:
                            `AI Assessment: ${skill.name}`

                    });


                if (existing) {

                    return res.status(200).json({

                        success: true,

                        message:
                            "Existing AI assessment found",

                        generated:
                            false,

                        assessment:
                            await Assessment.findById(
                                existing._id
                            ).populate(
                                "questions.skill",
                                "name category"
                            )

                    });
                }
            }


            // ------------------------------------------------
            // Ask Gemini to create questions
            // ------------------------------------------------

            const generated =
                await generateAssessmentQuestions({

                    skillName:
                        skill.name,

                    skillDescription:
                        skill.description,

                    currentLevel,

                    questionCount:
                        questionCount || 5

                });


            // ------------------------------------------------
            // Convert AI questions into our DB format
            // ------------------------------------------------

            const questions =
                generated.questions.map(
                    question => ({

                        question:
                            question.question,

                        options:
                            question.options,

                        correctAnswer:
                            question.correctAnswer,

                        skill:
                            skill._id,

                        difficulty:
                            question.difficulty

                    })
                );


            // ------------------------------------------------
            // Create NEW assessment document
            // ------------------------------------------------

            const assessment =
                await Assessment.create({

                    title:
                        `AI Assessment: ${skill.name}`,

                    role:
                        null,

                    questions,

                    durationMinutes:
                        20,

                    passingPercentage:
                        60

                });


            // ------------------------------------------------
            // Return populated assessment
            // ------------------------------------------------

            const populatedAssessment =
                await Assessment.findById(
                    assessment._id
                )
                .populate(
                    "questions.skill",
                    "name category description"
                );


            return res.status(201).json({

                success: true,

                message:
                    `AI assessment generated for ${skill.name}`,

                generated:
                    true,

                assessment:
                    populatedAssessment

            });

        } catch (error) {

            console.error(
                "Generate skill assessment error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Failed to generate AI assessment"

            });
        }
    };


// ============================================================
// SUBMIT ASSESSMENT
// ============================================================

const submitAssessment = async (
    req,
    res
) => {

    try {

        // ----------------------------------------------------
        // Student
        // ----------------------------------------------------

        const student =
            await StudentProfile.findOne({

                user:
                    req.user.id

            });


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student profile not found"

            });
        }


        // ----------------------------------------------------
        // Assessment
        // ----------------------------------------------------

        const assessment =
            await Assessment.findById(
                req.params.id
            );


        if (!assessment) {

            return res.status(404).json({

                success: false,

                message:
                    "Assessment not found"

            });
        }


        // ----------------------------------------------------
        // Answers
        // ----------------------------------------------------

        const {
            answers
        } = req.body;


        if (!Array.isArray(answers)) {

            return res.status(400).json({

                success: false,

                message:
                    "Answers must be an array"

            });
        }


        // ----------------------------------------------------
        // Evaluate
        // ----------------------------------------------------

        let correctCount = 0;


        const evaluatedAnswers =
            answers.map(
                answer => {

                    const question =
                        assessment.questions.id(
                            answer.questionId
                        );


                    if (!question) {

                        return {

                            questionId:
                                answer.questionId,

                            selectedAnswer:
                                answer.selectedAnswer ||
                                "",

                            isCorrect:
                                false

                        };
                    }


                    const isCorrect =
                        question.correctAnswer ===
                        answer.selectedAnswer;


                    if (isCorrect) {

                        correctCount++;

                    }


                    return {

                        questionId:
                            answer.questionId,

                        selectedAnswer:
                            answer.selectedAnswer ||
                            "",

                        isCorrect

                    };

                }
            );


        const totalQuestions =
            assessment.questions.length;


        const score =
            totalQuestions === 0

                ? 0

                : Math.round(
                    (
                        correctCount /
                        totalQuestions
                    ) * 100
                );


        const passed =
            score >=
            assessment.passingPercentage;


        // ----------------------------------------------------
        // Save attempt
        // ----------------------------------------------------

        const attempt =
            await AssessmentAttempt.create({

                student:
                    student._id,

                assessment:
                    assessment._id,

                answers:
                    evaluatedAnswers,

                score,

                completedAt:
                    new Date()

            });


        // ----------------------------------------------------
        // UPDATE STUDENT SKILL LEVEL
        // ----------------------------------------------------
        //
        // Only for questions that are linked to a Skill.
        // This means normal seeded assessments still work,
        // while AI-generated skill assessments automatically
        // update that skill.
        // ----------------------------------------------------

        const skillScores =
            new Map();


        for (
            const answer
            of evaluatedAnswers
        ) {

            const question =
                assessment.questions.id(
                    answer.questionId
                );


            if (
                !question ||
                !question.skill
            ) {
                continue;
            }


            const skillId =
                question.skill.toString();


            if (
                !skillScores.has(
                    skillId
                )
            ) {

                skillScores.set(
                    skillId,
                    {
                        total: 0,
                        correct: 0
                    }
                );

            }


            const stats =
                skillScores.get(
                    skillId
                );


            stats.total++;


            if (answer.isCorrect) {

                stats.correct++;

            }

        }


        // ----------------------------------------------------
        // Convert score -> level 1-5
        // ----------------------------------------------------

        for (
            const [
                skillId,
                stats
            ]
            of skillScores
        ) {

            if (stats.total === 0) {
                continue;
            }


            const skillScore =
                Math.round(
                    (
                        stats.correct /
                        stats.total
                    ) * 100
                );


            let level;


            if (skillScore < 40) {

                level = 1;

            } else if (
                skillScore < 60
            ) {

                level = 2;

            } else if (
                skillScore < 75
            ) {

                level = 3;

            } else if (
                skillScore < 90
            ) {

                level = 4;

            } else {

                level = 5;

            }


            const existingIndex =
                student.skills.findIndex(
                    item =>
                        item.skill &&
                        item.skill.toString() ===
                        skillId
                );


            if (
                existingIndex !== -1
            ) {

                const oldLevel =
                    student.skills[
                        existingIndex
                    ].level || 1;


                // Never reduce an already verified
                // skill level automatically.
                //
                // A high score can improve it.
                // A low assessment score won't erase
                // evidence from resume/manual skill input.

                student.skills[
                    existingIndex
                ].level =
                    Math.max(
                        oldLevel,
                        level
                    );

            } else {

                student.skills.push({

                    skill:
                        skillId,

                    level

                });

            }

        }


        await student.save();


        // ----------------------------------------------------
        // Response
        // ----------------------------------------------------

        res.status(201).json({

            success: true,

            message:
                "Assessment submitted successfully",

            result: {

                score,

                correctAnswers:
                    correctCount,

                totalQuestions,

                passingPercentage:
                    assessment.passingPercentage,

                passed

            },

            attempt

        });

    } catch (error) {

        console.error(
            "Submit assessment error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });
    }
};


// ============================================================
// GET MY ATTEMPTS
// ============================================================

const getMyAttempts = async (
    req,
    res
) => {

    try {

        const student =
            await StudentProfile.findOne({

                user:
                    req.user.id

            });


        if (!student) {

            return res.status(404).json({

                success: false,

                message:
                    "Student profile not found"

            });
        }


        const attempts =
            await AssessmentAttempt.find({

                student:
                    student._id

            })
            .populate(
                "assessment",
                "title passingPercentage"
            )
            .sort({
                createdAt: -1
            });


        res.status(200).json({

            success: true,

            count:
                attempts.length,

            attempts

        });

    } catch (error) {

        console.error(
            "Get attempts error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                error.message

        });
    }
};


// ============================================================
// EXPORTS
// ============================================================

module.exports = {

    getAssessments,

    getAssessmentById,

    generateSkillAssessment,

    submitAssessment,

    getMyAttempts

};
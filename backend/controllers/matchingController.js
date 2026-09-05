const { calculateMatch } = require("../services/matchingService");

const getMatch = async (req, res) => {
    try {
        const { studentId, jobId } = req.params;

        const result = await calculateMatch(studentId, jobId);

        res.status(200).json({
            success: true,
            studentId,
            jobId,
            ...result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getMatch
};
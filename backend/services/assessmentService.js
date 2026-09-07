const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.5-flash-lite";


// ============================================================
// GENERATE AI ASSESSMENT QUESTIONS
// ============================================================

async function generateAssessmentQuestions({
    skillName,
    skillDescription = "",
    currentLevel = 1,
    questionCount = 5
}) {

    if (!process.env.GEMINI_API_KEY) {
        throw new Error(
            "GEMINI_API_KEY is not configured"
        );
    }

    if (!skillName || !skillName.trim()) {
        throw new Error(
            "skillName is required"
        );
    }


    const safeQuestionCount =
        Math.min(
            Math.max(
                Number(questionCount) || 5,
                3
            ),
            10
        );


    const safeLevel =
        Math.min(
            Math.max(
                Number(currentLevel) || 1,
                1
            ),
            5
        );


    const prompt = `
Create a competency assessment for the skill:

Skill: ${skillName}

Skill description:
${skillDescription || "No description available."}

Student's current estimated level:
${safeLevel}/5

Generate exactly ${safeQuestionCount} multiple-choice questions.

The assessment should measure practical understanding rather than
memorization whenever possible.

Difficulty distribution:
- beginner questions for lower levels
- intermediate questions for average levels
- advanced questions for higher levels

Each question must have exactly 4 options.

IMPORTANT:
The correctAnswer value MUST be exactly equal to one of the 4 option strings.

Return ONLY JSON in this exact structure:

{
  "questions": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "correctAnswer": "string",
      "difficulty": "easy|medium|hard"
    }
  ]
}
`;


    const systemInstruction = `
You are an expert technical assessment designer for the SkillBridge
competency platform.

Your job is to generate reliable skill assessments.

Rules:
1. Generate only questions related to the requested skill.
2. Do not invent nonexistent technical concepts.
3. Each question must have exactly four options.
4. There must be exactly one correct answer.
5. correctAnswer must exactly match one option.
6. Avoid ambiguous questions.
7. Avoid trick questions.
8. Do not put explanations inside the answer options.
9. Return valid JSON only.
10. Generate the exact requested number of questions.
`;


    const response =
        await ai.models.generateContent({
            model: MODEL,

            contents: prompt,

            config: {
                systemInstruction,

                responseMimeType:
                    "application/json"
            }
        });


    if (!response.text) {
        throw new Error(
            "Gemini returned an empty assessment"
        );
    }


    let parsed;


    try {

        parsed =
            JSON.parse(
                response.text
            );

    } catch (error) {

        throw new Error(
            "Gemini returned invalid assessment JSON"
        );
    }


    if (
        !parsed ||
        !Array.isArray(
            parsed.questions
        )
    ) {

        throw new Error(
            "Invalid assessment structure returned by Gemini"
        );
    }


    // ========================================================
    // VALIDATE AND CLEAN QUESTIONS
    // ========================================================

    const cleanedQuestions =
        parsed.questions
            .slice(0, safeQuestionCount)
            .map(question => {

                const options =
                    Array.isArray(
                        question.options
                    )
                        ? question.options
                              .map(
                                  option =>
                                      String(
                                          option
                                      ).trim()
                              )
                              .filter(Boolean)
                        : [];


                const correctAnswer =
                    String(
                        question.correctAnswer || ""
                    ).trim();


                const questionText =
                    String(
                        question.question || ""
                    ).trim();


                const difficulty =
                    [
                        "easy",
                        "medium",
                        "hard"
                    ].includes(
                        question.difficulty
                    )
                        ? question.difficulty
                        : "medium";


                return {
                    question:
                        questionText,

                    options:
                        options.slice(0, 4),

                    correctAnswer,

                    difficulty
                };
            })
            .filter(question => {

                if (
                    !question.question
                ) {
                    return false;
                }


                if (
                    question.options.length !== 4
                ) {
                    return false;
                }


                if (
                    !question.options.includes(
                        question.correctAnswer
                    )
                ) {
                    return false;
                }


                const uniqueOptions =
                    new Set(
                        question.options
                            .map(
                                option =>
                                    option.toLowerCase()
                            )
                    );


                if (
                    uniqueOptions.size !== 4
                ) {
                    return false;
                }


                return true;
            });


    if (
        cleanedQuestions.length <
        3
    ) {

        throw new Error(
            "Gemini did not generate enough valid questions"
        );
    }


    return {
        skillName,
        currentLevel: safeLevel,
        questions:
            cleanedQuestions
    };
}


module.exports = {
    generateAssessmentQuestions
};
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const extractSkillsFromResume = async (resumeText) => {
    if (!resumeText || !resumeText.trim()) {
        throw new Error("Resume text is required");
    }

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",

        contents: `
Extract technical and professional skills from the following student resume.

RESUME:
${resumeText}
`,

        config: {
            systemInstruction: `
You are an expert skill extraction assistant for an
Evidence-Based Academia-Industry Competency Exchange platform.

Your job is to identify skills that are explicitly mentioned
or clearly demonstrated in a student's resume.

Return ONLY valid JSON matching the requested schema.

Rules:
1. Do not invent skills.
2. Use standard/common skill names.
3. If the same skill appears multiple times, include it only once.
4. Estimate skill level from 1 to 5 based ONLY on evidence in the resume.
5. If there is very little evidence for a skill, use a lower level.
6. Categorize every skill correctly.
7. Include both technical and relevant professional skills.

Allowed categories:
Programming
Backend
Frontend
Database
Cloud
DevOps
Testing
Data
Soft Skills
Other
            `,

            responseMimeType: "application/json",

            responseSchema: {
                type: "object",
                properties: {
                    skills: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                category: {
                                    type: "string"
                                },
                                level: {
                                    type: "integer"
                                }
                            },
                            required: ["name", "category", "level"]
                        }
                    }
                },
                required: ["skills"]
            }
        }
    });

    return JSON.parse(response.text);
};

module.exports = {
    extractSkillsFromResume
};
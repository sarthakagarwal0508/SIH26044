const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.5-flash-lite";

async function generateJSON(prompt, systemInstruction) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            systemInstruction,
            responseMimeType: "application/json"
        }
    });

    if (!response.text) {
        throw new Error("Gemini returned an empty response");
    }

    return JSON.parse(response.text);
}

async function extractSkillsFromResume(resumeText) {
    if (!resumeText || !resumeText.trim()) {
        throw new Error("Resume text is required");
    }

    return generateJSON(
        `Extract technical and professional skills from this student resume.\n\nRESUME:\n${resumeText}`,
        `You are an expert skill extraction assistant for an evidence-based Academia-Industry Competency Exchange platform.
Return only valid JSON.
Rules:
1. Do not invent skills.
2. Use standard/common skill names.
3. Include a skill only once.
4. Estimate level 1-5 from explicit resume evidence only.
5. Categorize every skill.
6. Include relevant professional/soft skills.
Allowed categories: Programming, Backend, Frontend, Database, Cloud, DevOps, Testing, Data, Soft Skills, Other.
Return: {"skills":[{"name":"string","category":"string","level":1}]}`
    );
}

async function semanticSkillMatch(skillName, knownSkills = []) {
    return generateJSON(
        `Find semantically related skills for "${skillName}".\nKnown platform skills:\n${knownSkills.join(", ")}`,
        `Return only JSON: {"skill":"original skill","relatedSkills":[{"name":"string","relationship":"equivalent|closely-related|related","reason":"short explanation"}]}. Do not invent unrelated concepts.`
    );
}

async function generateCareerSuggestions(profile, roles) {
    const skills = (profile?.skills || []).map(item => ({
        name: item.skill?.name || item.name || "Unknown",
        level: item.level || 0
    }));

    const availableRoles = (roles || []).map(role => ({
        title: role.title,
        description: role.description,
        requiredSkills: (role.requiredSkills || []).map(req => ({
            name: req.skill?.name || "Unknown",
            level: req.level || 1,
            weight: req.weight || 1
        }))
    }));

    return generateJSON(
        `Student skills:\n${JSON.stringify(skills, null, 2)}\n\nAvailable roles:\n${JSON.stringify(availableRoles, null, 2)}`,
        `Rank up to 5 suitable roles using the student's demonstrated skills. Return {"recommendations":[{"role":"string","matchScore":0,"reasoning":"string","requiredSkills":["string"]}]}. Score is advisory and must be 0-100.`
    );
}

async function generatePersonalizedRoadmap(profile, targetRole, missingSkills = []) {
    const skills = (profile?.skills || []).map(item => ({
        name: item.skill?.name || item.name || "Unknown",
        level: item.level || 0
    }));

    return generateJSON(
        `Target role: ${targetRole}\nStudent skills:\n${JSON.stringify(skills, null, 2)}\nMissing skill gaps:\n${JSON.stringify(missingSkills, null, 2)}`,
        `Generate an actionable 3-6 phase learning roadmap. Return {"roadmap":[{"phase":"string","duration":"string","skills":["string"],"milestones":["string"]}]}. Prioritize the largest gaps and do not invent achievements.`
    );
}

async function generateMatchExplanation(student, job, matchResult) {
    return generateJSON(
        `Student:\n${JSON.stringify(student, null, 2)}\n\nOpportunity:\n${JSON.stringify(job, null, 2)}\n\nDeterministic result:\n${JSON.stringify(matchResult, null, 2)}`,
        `Explain the existing deterministic match. Never change its score. Return {"explanation":"string","strengths":["string"],"gaps":["string"],"recommendation":"string"}.`
    );
}

async function analyzeJobDescription(jobDescription) {
    return generateJSON(
        `Analyze this job description:\n${jobDescription}`,
        `Return {"title":"string","summary":"string","skills":[{"name":"string","importance":"must-have|desirable|bonus"}],"eligibility":["string"],"responsibilities":["string"]}. Only use supported information.`
    );
}

async function analyzeResume(resumeText) {
    return generateJSON(
        `Analyze this student resume:\n${resumeText}`,
        `Return {"summary":"string","strengths":["string"],"areasToImprove":["string"],"projects":["string"],"experienceSignals":["string"],"careerSignals":["string"]}. Only use information present in the resume.`
    );
}

module.exports = {
    extractSkillsFromResume,
    semanticSkillMatch,
    generateCareerSuggestions,
    generatePersonalizedRoadmap,
    generateMatchExplanation,
    analyzeJobDescription,
    analyzeResume
};

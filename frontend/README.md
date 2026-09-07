# SkillBridge React Frontend

This frontend is built specifically against the current SIH 20644 Node/Express backend API.

## Backend API contract used

- POST /api/auth/signup
- POST /api/auth/login
- GET /api/student/profile
- POST /api/student/profile
- PUT /api/student/skills
- GET /api/skills
- GET /api/jobs
- GET /api/jobs/:id
- GET /api/jobs/company/my-jobs
- POST /api/jobs
- POST /api/applications/:jobId
- GET /api/applications/my-applications
- GET /api/applications/company/applications
- PUT /api/applications/:applicationId/status
- GET /api/assessments
- GET /api/assessments/:id
- GET /api/assessments/my-attempts
- POST /api/assessments/:id/submit
- GET /api/roadmap
- GET /api/matching/:studentId/:jobId
- GET/POST/PUT /api/company/profile
- POST /api/ai/extract-skills
- POST /api/ai/semantic-match
- GET /api/ai/career-suggestions
- POST /api/ai/personalized-roadmap
- GET /api/ai/match-explanation/:studentId/:jobId
- POST /api/ai/analyze-job
- POST /api/ai/analyze-resume

## Run

From this folder:

```powershell
npm.cmd install
npm.cmd run dev
```

Then open the Vite URL shown in the terminal.

Backend should be running separately at `http://localhost:5000`.

## Important backend limitation

The current backend has no institution-specific API route. The institution screen therefore uses only public job data and does not fabricate cohort analytics.

The resume AI endpoint currently accepts `resumeText`, not binary PDF/DOC/DOCX uploads. The UI accepts those file types visually, but non-text files must have their text pasted into the editor until a backend parser/upload API is added.

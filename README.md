# AyurSetu &mdash; Portal for Academia-Industry Collaboration

**Smart India Hackathon 2026** &middot; **Problem Statement:** SIH26044  
**Organization:** Ministry of Ayush &middot; **Category:** Software  
**Frontend Lead (Company & Institution Module):** Shreyash (Person 4)

---

## 📌 Project Overview
AyurSetu is a digital bridge connecting academic institutions (Ayurveda, Unani, Siddha, Homeopathy, Yoga, and Herbal Biotechnology institutes) with industry leaders (pharmaceutical companies, clinical research organizations, wellness labs) for:
1. **Dynamic Skill Mapping:** Assessing student competencies against real-time industry demands.
2. **Weighted Skill Hiring:** Enabling companies to define "Must-Have", "Desirable", and "Bonus" skills with numeric importance weights (1–10).
3. **AI-Driven Match Index:** Instantly ranking applicants by match percentage and highlighting exact skill overlaps vs. deficits.
4. **Institutional Skill Gap Analytics:** Providing Deans and Placement Officers with live heatmaps, department-level readiness indices, and curriculum intervention recommendations.

---

## 👥 Team Work Division Alignment

| Member | Primary Role | Core Focus |
| :--- | :--- | :--- |
| **Sarthak** | Backend Lead | Express structure, API routes, database connections |
| **Lakshya** | Backend & Matching | MongoDB, Skill matching algorithm, match % logic |
| **Bhavishya**| Frontend (Student) | Student dashboard, profile, assessment questions |
| **Shreyash** | Frontend (Industry & Institution) | **Company Dashboard, Job Posting with Skill Weights, Applicant Screening, Match %, Candidate Profile, Institution Analytics, Skill-Gap Heatmaps** |
| **Sonakshi** | Data & Testing | Dummy data, assessment question bank, testing |
| **Srashti** | Research & PPT | Problem research, presentation, demo sequence |

---

## 🚀 Features Implemented by Shreyash (Person 4)

### 1. 🏢 Company / Industry Portal
- **Dashboard Overview:** KPI metrics for Active Postings, Total Received Applicants, Shortlisted Talent, and High-Fit Candidates (≥85%).
- **Internship / Job Creation Wizard:** 
  - Comprehensive form (Role title, department, stipend, engagement duration, location, deadline).
  - **Skill Weightage Matrix:** Add skills from the standardized Ayush taxonomy and assign importance (*Must-Have*, *Desirable*, *Bonus*) and weight sliders (1–10).
- **Candidate Screening & Filtering:**
  - Filter applicants by job opening, status, or minimum match percentage.
  - Quick actions for shortlisting or rejecting directly from the table.
- **Candidate Profile Deep-Dive Modal:**
  - Academic credentials, CGPA, verified college endorsement badge.
  - Visual competency breakdown with proficiency bars.
  - Direct actions: **Shortlist**, **Reject**, or **Schedule Interview** with instant state updates.

### 2. 🏛️ Academic Institution / College Portal
- **Dean / TPO Executive KPI Cards:** Enrolled Scholars, Assessed Students, Institutional Employability Index, and Placement Conversions.
- **Interactive Visual Analytics (Recharts):**
  - **Skill Gap Comparison Heatmap:** Student Cohort Average vs. Industry Hiring Demand score.
  - **Department-wise Readiness:** Percentage of placement-ready students across Dravyaguna, Rasa Shastra, Kayachikitsa, Panchakarma, etc.
  - **Trending Industry Skills:** High-growth skills demanding attention in upcoming quarters.
- **AI-Driven Curriculum Recommendations:**
  - Automated bridge course suggestions (e.g. Chromatography, GCP trials, GMP cleanrooms) with projected placement impact.
- **Student Cohort Registry:**
  - Searchable student cohort table with roll numbers, assessment scores, and placement statuses.

### 3. 🎓 End-to-End Demo Flow (Student Preview)
- Interactive role-switcher on the top navbar allowing seamless switching between **Company**, **Institution**, and **Student** views during hackathon judging.
- Allows applying as a student and immediately witnessing the candidate pop up in the Company review queue!

### 4. 🔌 Ready for Backend Integration (Sarthak & Lakshya)
- Centralized adapter in `src/services/api.js`.
- Flip `export const USE_MOCK_DATA = false;` to seamlessly route all calls to the Node.js/Express backend at `http://localhost:5000/api`.

---

## 🛠️ Tech Stack
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Data Visualization:** Recharts
- **Typography:** Plus Jakarta Sans & JetBrains Mono

---

## 🏃 Local Setup & Run

1. Clone or navigate to the project directory:
   ```bash
   cd sih-ayush-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📤 Pushing to GitHub

To push this project to your GitHub repository:

```bash
# 1. Initialize git (already initialized in this directory)
git add .
git commit -m "feat: complete company & institution portal for SIH26044 by Shreyash"

# 2. Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
git branch -M main

# 3. Push to GitHub
git push -u origin main
```

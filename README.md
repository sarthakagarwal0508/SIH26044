# SIH26044 — Student–Company Opportunity Platform

A full-stack platform developed for **Smart India Hackathon 2026 (SIH26044)** to connect students with companies and help students discover and apply for relevant opportunities such as internships and jobs.

---

## 📌 Problem

Students often struggle to find suitable opportunities because job and internship information is scattered across different platforms. Companies also face difficulties in reaching students with the right skills and profiles.

The goal of this project is to provide a **single platform** where:

* Students can create and manage their profiles.
* Students can discover suitable jobs and internships.
* Students can apply for opportunities.
* Companies can create and manage job/internship listings.
* Companies can view and manage applications.
* The complete process can be managed through a centralized backend.

---

## 🎯 Objectives

* Create a centralized student–company platform.
* Provide secure user authentication.
* Maintain student and company profiles.
* Allow companies to post opportunities.
* Allow students to search and apply for opportunities.
* Manage applications digitally.
* Store data permanently using a database.
* Provide a scalable REST API-based backend.
* Integrate frontend and backend into one complete system.

---

## 🛠️ Technology Stack

### Frontend

* HTML
* CSS
* JavaScript
* *(Frontend framework/libraries can be added as development progresses.)*

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │      Frontend       │
                    │ HTML / CSS / JS     │
                    └──────────┬──────────┘
                               │
                               │ HTTP Requests
                               ▼
                    ┌─────────────────────┐
                    │      Backend        │
                    │   Node.js + Express │
                    └──────────┬──────────┘
                               │
                         REST APIs
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │     Database        │
                    └─────────────────────┘
```

---

## 👥 User Roles

### 👨‍🎓 Student

Students will be able to:

* Register and log in.
* Create and update their profile.
* Add skills and educational information.
* Browse available jobs and internships.
* Search/filter opportunities.
* View opportunity details.
* Apply for opportunities.
* Track their applications.

### 🏢 Company

Companies will be able to:

* Register and log in.
* Create and manage their company profile.
* Post jobs and internships.
* Edit or remove their listings.
* View applications.
* Manage candidate applications.

---

## ⚙️ Core Features

### Authentication

* Student registration
* Company registration
* Login/logout
* Password protection
* Role-based access

### Student Management

* Student profile
* Education details
* Skills
* Resume/details
* Application history

### Company Management

* Company profile
* Company information
* Opportunity management
* Application management

### Job & Internship Management

* Create opportunity
* Update opportunity
* Delete opportunity
* View opportunity
* Search and filter opportunities

### Application System

* Student applies to an opportunity
* Application stored in database
* Company can view applications
* Application status can be managed

---

## 📂 Planned Project Structure

```text
SIH26044/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
├── README.md
├── .gitignore
└── package.json
```

The structure may change as development progresses.

---

## 🔌 Backend API Structure

The backend will expose REST APIs for different modules.

Example:

```text
/api/auth
/api/students
/api/companies
/api/jobs
/api/internships
/api/applications
```

Example API operations:

```text
POST   /api/auth/register
POST   /api/auth/login

GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/:id
PUT    /api/jobs/:id
DELETE /api/jobs/:id

POST   /api/applications
GET    /api/applications
GET    /api/applications/:id
PUT    /api/applications/:id
```

The exact API structure will be finalized during backend development.

---

## 🗄️ Database

The project uses **MongoDB** for persistent data storage.

Possible collections:

```text
users
students
companies
jobs
internships
applications
```

The database ensures that registered users, opportunities, and applications remain available even after restarting the application.

---

## 🔐 Security

The backend will include:

* Password hashing
* Authentication
* Authorization
* Role-based access control
* Input validation
* Protected API routes
* Environment variables for sensitive configuration

Sensitive information such as database credentials will **not** be stored directly in the source code.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
```

### 2. Move into the project

```bash
cd SIH26044
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 5. Start the backend

```bash
npm run dev
```

or:

```bash
npm start
```

### 6. Start the frontend

Open the frontend through the configured development server or browser setup.

---

## 🧪 Testing

API testing can be performed using **Postman**.

Important areas to test:

* Registration
* Login
* Authentication
* Student profile
* Company profile
* Job creation
* Job retrieval
* Applications
* Authorization
* Database operations

---

## 👨‍💻 Team Work Division

### Sarthak — Team Leader + Backend Lead

* Overall backend architecture
* Node.js + Express.js
* REST APIs
* Authentication
* Database connection
* Student/company/job/application backend
* Frontend-backend integration
* Overall team coordination
* Final presentation

### Backend Developer

* Backend development alongside Sarthak
* MongoDB
* Data management
* Database-related implementation
* Supporting backend APIs

### Frontend Team

* User interface
* Student dashboard
* Company dashboard
* Job/internship pages
* Forms
* Frontend-backend integration support

### Other Team Members

* UI/UX and design
* Documentation
* Testing
* Research
* Presentation
* Supporting assigned modules

> The authoritative team responsibilities should be maintained according to the latest team work-division document.

---

## 📈 Future Scope

The platform can later be extended with:

* AI-based job recommendations
* Skill-based opportunity matching
* Resume analysis
* Smart candidate ranking
* Notifications
* Email integration
* Advanced company dashboards
* Analytics
* Admin panel
* Automated application tracking
* Improved search and filtering

AI integration will be considered **after the core backend and platform functionality are completed**, depending on available development time.

---

## 🤝 Contribution

All team members should work on their assigned modules and follow the project's common Git workflow.

Before pushing code:

```bash
git pull
```

After completing changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

Avoid directly modifying another teammate's module without coordination.

---

## 📜 Project Status

🚧 **Currently under development**

The project is being developed as part of:

**Smart India Hackathon 2026**

**Problem Statement:** SIH26044

---

## ⭐ Vision

Our vision is to build a reliable and centralized platform that makes it easier for **students to discover opportunities and for companies to find suitable talent**.

> **Connect. Discover. Apply. Grow.**

import React, { useEffect, useMemo, useState } from "react";
import { api, clearSession, getSession, saveSession } from "./api.js";

const navStudent = [
  ["dashboard", "Dashboard"],
  ["profile", "Profile"],
  ["skills", "Skills"],
  ["assessment", "Assessment"],
  ["roadmap", "Roadmap"],
  ["opportunities", "Opportunities"],
  ["applications", "Applications"],
  ["resume", "Resume + AI"],
];

function pathName() {
  const clean = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return clean.split("/")[0] || "dashboard";
}

function go(path) {
  window.history.pushState({}, "", `/${path}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function fmtDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function pct(value) {
  return `${Math.round(Number(value) || 0)}%`;
}

function skillName(entry) {
  if (!entry) return "Unknown";
  if (typeof entry === "string") return entry;
  if (entry.skill && typeof entry.skill === "object") return entry.skill.name;
  return entry.name || "Unknown";
}

function Layout({ user, role, page, onNavigate, onLogout, children }) {
  const items = role === "student" ? navStudent : [];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-title">SkillBridge</div>
            <div className="brand-sub">Competency Exchange</div>
          </div>
        </div>

        <nav className="nav-list">
          {items.map(([id, label]) => (
            <button
              key={id}
              className={`nav-btn ${page === id ? "active" : ""}`}
              onClick={() => onNavigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        {role !== "student" && (
          <div className="role-nav-note">
            {role === "company" ? "Company Recruiter Portal" : "Institution Portal"}
          </div>
        )}

        <button className="logout" onClick={onLogout}>Logout</button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="eyebrow">ACADEMIA × INDUSTRY</div>
            <div className="page-title">{pageLabel(page, role)}</div>
          </div>
          <div className="user-chip">
            <div className="avatar">{(user?.name || "U").charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name || "User"}</strong>
              <span>{role}</span>
            </div>
          </div>
        </header>

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}

function pageLabel(page, role) {
  if (role === "company") return "Company Recruiter Portal";
  if (role === "institution") return "Institution Analytics";
  const map = {
    dashboard: "Student Dashboard",
    profile: "Student Profile",
    skills: "Competency Profile",
    assessment: "Skill Assessment",
    roadmap: "Learning Roadmap",
    opportunities: "Opportunities",
    applications: "Applications",
    resume: "Resume & AI Center",
  };
  return map[page] || "Student Dashboard";
}

function Card({ title, value, sub, children }) {
  return (
    <section className="card">
      {title && <div className="card-title">{title}</div>}
      {value !== undefined && <div className="metric">{value}</div>}
      {sub && <div className="muted">{sub}</div>}
      {children}
    </section>
  );
}

function Section({ title, action, children }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Empty({ children = "No data available yet." }) {
  return <div className="empty">{children}</div>;
}

function Loading() {
  return <div className="loading">Loading…</div>;
}

function ErrorBox({ error }) {
  return error ? <div className="error-box">{error}</div> : null;
}

function App() {
  const [user, setUser] = useState(getSession());
  const [page, setPage] = useState(pathName());
  const [bootError, setBootError] = useState("");

  useEffect(() => {
    const handle = () => setPage(pathName());
    window.addEventListener("popstate", handle);
    return () => window.removeEventListener("popstate", handle);
  }, []);

  useEffect(() => {
    if (!user) {
      const publicPages = ["login", "signup", ""];
      if (!publicPages.includes(page)) setPage("login");
    }
  }, [user, page]);

  const role = user?.role || localStorage.getItem("userRole") || "student";

  function navigate(target) {
    go(target);
  }

  function logout() {
    clearSession();
    setUser(null);
    navigate("login");
  }

  async function handleLogin(credentials) {
    const data = await api.login(credentials);
    saveSession(data, credentials.role);
    setUser(data.user);
    try {
      if (credentials.role === "student") {
        await api.getStudentProfile();
      } else if (credentials.role === "company") {
        await api.getCompanyProfile();
      }
    } catch {
      // Profile can legitimately not exist immediately after signup.
    }
    navigate(credentials.role === "student" ? "dashboard" : credentials.role === "company" ? "company" : "institution");
  }

  async function handleSignup(payload) {
    await api.signup(payload);
    await handleLogin({
      email: payload.email,
      password: payload.password,
      role: payload.role,
    });
  }

  if (!user && page === "signup") {
    return <PublicShell><SignupPage onSignup={handleSignup} onLogin={() => navigate("login")} /></PublicShell>;
  }

  if (!user) {
    return <PublicShell><LoginPage onLogin={handleLogin} onSignup={() => navigate("signup")} /></PublicShell>;
  }

  return (
    <Layout user={user} role={role} page={page} onNavigate={navigate} onLogout={logout}>
      {role === "student" ? (
        <StudentRouter page={page} user={user} onNavigate={navigate} onLogout={logout} bootError={bootError} />
      ) : role === "company" ? (
        <CompanyPage user={user} onLogout={logout} />
      ) : (
        <InstitutionPage user={user} />
      )}
    </Layout>
  );
}

function PublicShell({ children }) {
  return (
    <div className="public-shell">
      <div className="public-brand">
        <div className="brand-mark large">S</div>
        <div>
          <div className="brand-title">SkillBridge</div>
          <div className="brand-sub">Academia–Industry Competency Exchange</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function LoginPage({ onLogin, onSignup }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onLogin({ email, password, role });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="eyebrow">WELCOME BACK</div>
      <h1>Sign in to SkillBridge</h1>
      <p className="lead">Use the role selected for your demo account.</p>
      <ErrorBox error={error} />
      <form onSubmit={submit} className="form-stack">
        <label>Role<select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="company">Company / Recruiter</option>
          <option value="institution">Institution Admin</option>
        </select></label>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <button className="primary-btn wide" disabled={busy}>{busy ? "Signing in…" : "Login to Portal"}</button>
      </form>
      <div className="auth-foot">New account? <button className="link-btn" onClick={onSignup}>Create account</button></div>
    </div>
  );
}

function SignupPage({ onSignup, onLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function update(key, value) {
    setForm((old) => ({ ...old, [key]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSignup(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="eyebrow">CREATE ACCOUNT</div>
      <h1>Join SkillBridge</h1>
      <p className="lead">Signup uses the exact backend fields: name, email, password and role.</p>
      <ErrorBox error={error} />
      <form onSubmit={submit} className="form-stack">
        <label>Full name<input value={form.name} onChange={(e) => update("name", e.target.value)} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} minLength={6} required /></label>
        <label>Role<select value={form.role} onChange={(e) => update("role", e.target.value)}>
          <option value="student">Student</option>
          <option value="company">Company / Recruiter</option>
          <option value="institution">Institution Admin</option>
        </select></label>
        <button className="primary-btn wide" disabled={busy}>{busy ? "Creating…" : "Create Account"}</button>
      </form>
      <div className="auth-foot">Already have an account? <button className="link-btn" onClick={onLogin}>Login</button></div>
    </div>
  );
}

function StudentRouter({ page, user, onNavigate }) {
  switch (page) {
    case "profile": return <StudentProfilePage user={user} />;
    case "skills": return <SkillsPage />;
    case "assessment": return <AssessmentPage />;
    case "roadmap": return <RoadmapPage />;
    case "opportunities": return <OpportunitiesPage />;
    case "applications": return <ApplicationsPage />;
    case "resume": return <ResumeAIPage />;
    default: return <DashboardPage user={user} onNavigate={onNavigate} />;
  }
}

function DashboardPage({ user, onNavigate }) {
  const [state, setState] = useState({ loading: true, error: "", profile: null, jobs: [], apps: [] });

  useEffect(() => {
    let live = true;
    Promise.all([api.getStudentProfile(), api.getJobs(), api.getMyApplications()])
      .then(([profile, jobs, apps]) => {
        if (!live) return;
        setState({ loading: false, error: "", profile: profile.profile, jobs: jobs.jobs || [], apps: apps.applications || [] });
      })
      .catch((err) => {
        if (live) setState((old) => ({ ...old, loading: false, error: err.message }));
      });
    return () => { live = false; };
  }, []);

  if (state.loading) return <Loading />;

  const skills = state.profile?.skills || [];
  const score = skills.length
    ? Math.round(skills.reduce((sum, s) => sum + ((Number(s.level) || 0) / 5) * 100, 0) / skills.length)
    : 0;
  const completionFields = [state.profile?.education?.degree, state.profile?.education?.institution, state.profile?.education?.graduationYear, state.profile?.education?.cgpa, state.profile?.careerInterest, skills.length > 0];
  const completion = Math.round(completionFields.filter(Boolean).length / completionFields.length * 100);

  return (
    <>
      <ErrorBox error={state.error} />
      <div className="hero-row">
        <div>
          <div className="eyebrow">STUDENT COMPETENCY ENGINE</div>
          <h1>Welcome, {user.name.split(" ")[0]}</h1>
          <p className="lead">Build evidence, identify skill gaps, improve readiness, and reach better opportunities.</p>
        </div>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => onNavigate("resume")}>Analyze Resume</button>
          <button className="secondary-btn" onClick={() => onNavigate("assessment")}>Take Assessment</button>
        </div>
      </div>

      <div className="metric-grid four">
        <Card title="Profile Completion" value={pct(completion)} sub="Student profile completeness" />
        <Card title="Skill Score" value={pct(score)} sub="Average across current skill levels" />
        <Card title="Opportunities" value={state.jobs.length} sub="Open opportunities" />
        <Card title="Applications" value={state.apps.length} sub="Your application history" />
      </div>

      <div className="two-col">
        <Section title="Your Skills" action={<button className="link-btn" onClick={() => onNavigate("skills")}>View all</button>}>
          {skills.length ? <div className="skill-cloud">{skills.slice(0, 10).map((s, i) => <span className="tag" key={i}>{skillName(s)} · {s.level}/5</span>)}</div> : <Empty>No skills yet. Add skills or analyze your resume.</Empty>}
        </Section>
        <Section title="Current Profile" action={<button className="link-btn" onClick={() => onNavigate("profile")}>Open profile</button>}>
          <div className="detail-grid">
            <Info label="Degree" value={state.profile?.education?.degree} />
            <Info label="Institution" value={state.profile?.education?.institution} />
            <Info label="Graduation Year" value={state.profile?.education?.graduationYear} />
            <Info label="CGPA" value={state.profile?.education?.cgpa} />
            <Info label="Career Interest" value={state.profile?.careerInterest} />
            <Info label="Email" value={user.email} />
          </div>
        </Section>
      </div>

      <Section title="Recommended Opportunities" action={<button className="link-btn" onClick={() => onNavigate("opportunities")}>View opportunities</button>}>
        {state.jobs.length ? <div className="stack">{state.jobs.slice(0, 4).map((job) => <JobCard key={job._id} job={job} />)}</div> : <Empty>No open opportunities are available.</Empty>}
      </Section>
    </>
  );
}

function Info({ label, value }) {
  return <div><div className="info-label">{label}</div><div className="info-value">{value || "—"}</div></div>;
}

function JobCard({ job, onApply }) {
  return (
    <div className="job-card">
      <div>
        <h3>{job.title}</h3>
        <div className="muted">{job.company?.companyName || "Company"} · {job.location || "Remote"} · {job.type || "opportunity"}</div>
        <div className="skill-cloud compact">{(job.requiredSkills || []).slice(0, 5).map((r, i) => <span className="tag" key={i}>{skillName(r.skill)}</span>)}</div>
      </div>
      {onApply && <button className="primary-btn" onClick={() => onApply(job)}>Apply</button>}
    </div>
  );
}

function StudentProfilePage() {
  const [state, setState] = useState({ loading: true, error: "", profile: null });
  const [setup, setSetup] = useState(false);
  const [form, setForm] = useState({ degree: "", institution: "", graduationYear: "", cgpa: "", careerInterest: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.getStudentProfile()
      .then((data) => setState({ loading: false, error: "", profile: data.profile }))
      .catch((err) => setState({ loading: false, error: err.message, profile: null }));
  }, []);

  async function createProfile(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const data = await api.createStudentProfile({
        education: {
          degree: form.degree,
          institution: form.institution,
          graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
          cgpa: form.cgpa ? Number(form.cgpa) : undefined,
        },
        careerInterest: form.careerInterest,
        skills: [],
        projects: [],
        certifications: [],
      });
      setState({ loading: false, error: "", profile: data.profile });
      setSetup(false);
    } catch (err) {
      setState((old) => ({ ...old, error: err.message }));
    } finally {
      setBusy(false);
    }
  }

  if (state.loading) return <Loading />;

  return (
    <>
      <ErrorBox error={state.error} />
      {!state.profile && (
        <Section title="Create your student profile">
          <form onSubmit={createProfile} className="form-grid">
            <label>Degree<input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} required /></label>
            <label>Institution<input value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required /></label>
            <label>Graduation Year<input type="number" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} /></label>
            <label>CGPA<input type="number" step="0.01" min="0" max="10" value={form.cgpa} onChange={(e) => setForm({ ...form, cgpa: e.target.value })} /></label>
            <label className="span-2">Career Interest<input value={form.careerInterest} onChange={(e) => setForm({ ...form, careerInterest: e.target.value })} placeholder="e.g. Backend Developer" /></label>
            <div className="span-2"><button className="primary-btn" disabled={busy}>{busy ? "Saving…" : "Create Profile"}</button></div>
          </form>
        </Section>
      )}

      {state.profile && !setup && <>
        <div className="hero-row compact-hero"><div><div className="eyebrow">PROFILE</div><h1>{state.profile.user?.name || "Student"}</h1><p className="lead">{state.profile.education?.degree || "Student"} · {state.profile.education?.institution || "Institution not set"}</p></div><div><button className="secondary-btn" onClick={() => setSetup(true)}>Recreate profile</button></div></div>
        <Section title="Personal & Academic Information">
          <div className="detail-grid">
            <Info label="Degree" value={state.profile.education?.degree} />
            <Info label="Institution" value={state.profile.education?.institution} />
            <Info label="Graduation Year" value={state.profile.education?.graduationYear} />
            <Info label="CGPA" value={state.profile.education?.cgpa} />
            <Info label="Career Interest" value={state.profile.careerInterest} />
          </div>
        </Section>
        <Section title="Projects"><ProjectList items={state.profile.projects} /></Section>
        <Section title="Certifications"><CertList items={state.profile.certifications} /></Section>
        <Section title="Skills"><div className="skill-cloud">{(state.profile.skills || []).map((s, i) => <span className="tag" key={i}>{skillName(s)} · {s.level}/5</span>)}</div></Section>
      </>}
      {setup && state.profile && <Section title="Student profile setup"><p className="muted">The current backend exposes profile creation, not a PUT profile update endpoint. This form therefore creates a profile only when one does not already exist.</p><button className="secondary-btn" onClick={() => setSetup(false)}>Back</button></Section>}
    </>
  );
}

function ProjectList({ items = [] }) {
  if (!items.length) return <Empty>No projects added yet.</Empty>;
  return <div className="stack">{items.map((p, i) => <div className="job-card" key={i}><div><h3>{p.title || "Project"}</h3><p className="muted">{p.description || "No description"}</p></div></div>)}</div>;
}

function CertList({ items = [] }) {
  if (!items.length) return <Empty>No certifications added yet.</Empty>;
  return <div className="stack">{items.map((c, i) => <div className="job-card" key={i}><div><h3>{c.name}</h3><div className="muted">{c.issuer || "Issuer not provided"}</div></div></div>)}</div>;
}

function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState("");
  const [level, setLevel] = useState(3);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [semantic, setSemantic] = useState(null);
  const [semanticSkill, setSemanticSkill] = useState("");

  async function load() {
    setLoading(true);
    try {
      const [profile, skillData] = await Promise.all([api.getStudentProfile(), api.getSkills()]);
      setSkills(profile.profile?.skills || []);
      setAvailable(skillData.skills || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function saveSkills(next) {
    try {
      const data = await api.updateStudentSkills(next);
      setSkills(data.profile?.skills || []);
      setMessage("Skills updated successfully.");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function addSkill(e) {
    e.preventDefault();
    if (!selected) return;
    const next = [...skills.map((s) => ({ skill: s.skill?._id || s.skill, level: Number(s.level) })), { skill: selected, level: Number(level) }];
    if (next.some((s, i) => next.findIndex((x) => String(x.skill) === String(s.skill)) !== i)) {
      setError("That skill is already in the profile.");
      return;
    }
    await saveSkills(next);
    setSelected("");
  }

  async function removeSkill(skillId) {
    const next = skills.filter((s) => String(s.skill?._id || s.skill) !== String(skillId)).map((s) => ({ skill: s.skill?._id || s.skill, level: Number(s.level) }));
    await saveSkills(next);
  }

  async function runSemantic() {
    if (!semanticSkill.trim()) return;
    try { setSemantic(await api.semanticMatch(semanticSkill.trim())); setError(""); } catch (err) { setError(err.message); }
  }

  const avg = skills.length ? (skills.reduce((a, s) => a + Number(s.level || 0), 0) / skills.length).toFixed(1) : "0";

  if (loading) return <Loading />;

  return (
    <>
      <ErrorBox error={error} />
      {message && <div className="success-box">{message}</div>}
      <div className="metric-grid four">
        <Card title="Total Skills" value={skills.length} />
        <Card title="Average Level" value={`${avg}/5`} />
        <Card title="Strong Skills" value={skills.filter(s => Number(s.level) >= 4).length} />
        <Card title="Skills to Improve" value={skills.filter(s => Number(s.level) <= 2).length} />
      </div>

      <div className="two-col">
        <Section title="Add Skill">
          <form className="form-grid" onSubmit={addSkill}>
            <label>Skill<select value={selected} onChange={(e) => setSelected(e.target.value)} required><option value="">Choose a skill</option>{available.map(s => <option key={s._id} value={s._id}>{s.name} · {s.category}</option>)}</select></label>
            <label>Level<select value={level} onChange={(e) => setLevel(e.target.value)}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}/5</option>)}</select></label>
            <div className="span-2"><button className="primary-btn">Add Skill</button></div>
          </form>
        </Section>
        <Section title="Semantic Skill Matching">
          <div className="form-row"><input value={semanticSkill} onChange={(e) => setSemanticSkill(e.target.value)} placeholder="e.g. JS" /><button className="secondary-btn" onClick={runSemantic}>Find Matches</button></div>
          {semantic?.matches?.length ? <div className="stack mini">{semantic.matches.map((m, i) => <div className="job-card" key={i}><strong>{m.skillName}</strong><span className="score-pill">{m.similarity}%</span></div>)}</div> : <p className="muted">Uses <code>POST /api/ai/semantic-match</code>.</p>}
        </Section>
      </div>

      <Section title="Current Competencies">
        {skills.length ? <div className="stack">{skills.map((s, i) => { const id = s.skill?._id || s.skill; return <div className="job-card" key={i}><div><h3>{skillName(s)}</h3><div className="progress"><div className="progress-bar" style={{ width: `${Number(s.level || 0) * 20}%` }} /></div><div className="muted">Level {s.level}/5</div></div><button className="danger-btn" onClick={() => removeSkill(id)}>Remove</button></div>; })}</div> : <Empty>Add your first skill above.</Empty>}
      </Section>
    </>
  );
}

function AssessmentPage() {
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [selected, setSelected] = useState(null);

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [skills, setSkills] = useState([]);
  const [generatingSkill, setGeneratingSkill] = useState(null);

  useEffect(() => {

    Promise.all([
      api.getAssessments(),
      api.getMyAttempts(),
      api.getStudentProfile()
    ])
      .then(([assessmentData, attemptData, profileData]) => {

        setAssessments(
          assessmentData.assessments || []
        );

        setAttempts(
          attemptData.attempts || []
        );

        setSkills(
          profileData.profile?.skills || []
        );

      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);


  // ==========================================================
  // START EXISTING ASSESSMENT
  // ==========================================================

  async function start(id) {

    setError("");

    try {

      const data =
        await api.getAssessment(id);

      setSelected(
        data.assessment
      );

      setAnswers({});
      setResult(null);

    } catch (err) {

      setError(
        err.message
      );

    }
  }


  // ==========================================================
  // GENERATE AI ASSESSMENT FOR ANY SKILL
  // ==========================================================

  async function generateForSkill(skillEntry) {

    const skillId =
      skillEntry?.skill?._id ||
      skillEntry?.skill;


    const name =
      skillName(skillEntry);


    if (!skillId) {

      setError(
        `Cannot generate assessment for ${name}: skill ID is missing.`
      );

      return;
    }


    setGeneratingSkill(skillId);
    setError("");


    try {

      const data =
        await api.generateSkillAssessment(
          skillId,
          5
        );


      const generatedAssessment =
        data.assessment;


      if (!generatedAssessment) {

        throw new Error(
          "Backend did not return the generated assessment."
        );
      }


      // Add the new assessment to the current list
      // without removing existing seeded assessments.

      setAssessments(old => {

        const alreadyExists =
          old.some(
            assessment =>
              assessment._id ===
              generatedAssessment._id
          );


        if (alreadyExists) {
          return old;
        }


        return [
          generatedAssessment,
          ...old
        ];
      });


      // Immediately open generated assessment
      setSelected(
        generatedAssessment
      );

      setAnswers({});
      setResult(null);

    } catch (err) {

      setError(
        err.message
      );

    } finally {

      setGeneratingSkill(null);

    }
  }


  // ==========================================================
  // SUBMIT ASSESSMENT
  // ==========================================================

  async function submit() {

    if (!selected) {
      return;
    }


    setError("");


    // Don't allow accidental empty submission.

    const unanswered =
      selected.questions.filter(
        question =>
          !answers[question._id]
      );


    if (unanswered.length > 0) {

      setError(
        `Please answer all questions. ${unanswered.length} question${
          unanswered.length === 1 ? "" : "s"
        } remaining.`
      );

      return;
    }


    try {

      const payload =
        selected.questions.map(
          question => ({

            questionId:
              question._id,

            selectedAnswer:
              answers[
                question._id
              ]

          })
        );


      const data =
        await api.submitAssessment(
          selected._id,
          payload
        );


      setResult(
        data.result
      );


      setAttempts(old => [

        {
          ...data.attempt,

          assessment: {
            title:
              selected.title,

            passingPercentage:
              selected.passingPercentage
          }

        },

        ...old

      ]);

    } catch (err) {

      setError(
        err.message
      );

    }
  }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return <Loading />;
  }


  // ==========================================================
  // ACTIVE ASSESSMENT
  // ==========================================================

  if (selected) {

    return (
      <>
        <button
          className="link-btn back"
          onClick={() => {
            setSelected(null);
            setResult(null);
            setAnswers({});
            setError("");
          }}
        >
          ← Back to assessments
        </button>


        <ErrorBox
          error={error}
        />


        <Section
          title={selected.title}
        >

          <div className="muted">

            {selected.role?.title ||
              selected.questions?.[0]?.skill?.name ||
              "Skill assessment"}

            {" · "}

            {selected.questions?.length || 0}
            {" questions · "}

            {selected.durationMinutes || 20}
            {" minutes · pass "}

            {selected.passingPercentage || 60}
            {"%"}

          </div>

        </Section>


        <div className="stack">

          {(selected.questions || [])
            .map(
              (question, index) => (

                <section
                  className="panel"
                  key={
                    question._id ||
                    index
                  }
                >

                  <div className="question-num">
                    Question {index + 1}
                  </div>


                  <h3>
                    {question.question}
                  </h3>


                  <div className="option-list">

                    {(question.options || [])
                      .map(
                        (option, optionIndex) => (

                          <label
                            className="option"
                            key={
                              optionIndex
                            }
                          >

                            <input
                              type="radio"
                              name={
                                question._id
                              }
                              checked={
                                answers[
                                  question._id
                                ] === option
                              }
                              disabled={
                                Boolean(result)
                              }
                              onChange={() =>
                                setAnswers(
                                  old => ({
                                    ...old,

                                    [question._id]:
                                      option

                                  })
                                )
                              }
                            />

                            <span>
                              {option}
                            </span>

                          </label>

                        )
                      )}

                  </div>

                </section>

              )
            )}

        </div>


        {!result ? (

          <button
            className="primary-btn"
            onClick={submit}
          >
            Submit Assessment
          </button>

        ) : (

          <section
            className={`result-card ${
              result.passed
                ? "passed"
                : "failed"
            }`}
          >

            <div className="eyebrow">
              RESULT
            </div>


            <div className="result-score">
              {result.score}%
            </div>


            <p>

              {result.passed
                ? "Passed"
                : "Needs improvement"}

              {" · "}

              {result.correctAnswers}

              /

              {result.totalQuestions}

              {" correct"}

            </p>


            <button
              className="secondary-btn"
              onClick={() => {

                setSelected(null);
                setResult(null);
                setAnswers({});
                setError("");

              }}
            >
              Back to Assessments
            </button>

          </section>

        )}

      </>
    );
  }


  // ==========================================================
  // MAIN ASSESSMENT PAGE
  // ==========================================================

  return (
    <>

      <ErrorBox
        error={error}
      />


      <div className="metric-grid three">

        <Card
          title="Available Assessments"
          value={assessments.length}
        />

        <Card
          title="Completed"
          value={attempts.length}
        />

        <Card
          title="Average Score"
          value={
            attempts.length
              ? `${Math.round(
                  attempts.reduce(
                    (sum, attempt) =>
                      sum +
                      Number(
                        attempt.score || 0
                      ),

                    0
                  ) /
                  attempts.length
                )}%`
              : "—"
          }
        />

      </div>


      {/* ======================================================
          CURRENT STUDENT SKILLS
         ====================================================== */}

      <Section
        title="Assess Your Skills"
      >

        <p className="muted">
          Take an assessment for any skill in your
          competency profile. New skills can get an
          AI-generated assessment automatically.
        </p>


        {skills.length ? (

          <div className="stack">

            {skills.map(
              (skillEntry, index) => {

                const id =
                  skillEntry?.skill?._id ||
                  skillEntry?.skill;


                const name =
                  skillName(skillEntry);


                return (
                  <div
                    className="job-card"
                    key={
                      id || index
                    }
                  >

                    <div>

                      <h3>
                        {name}
                      </h3>


                      <div className="muted">
                        Current level:{" "}
                        {skillEntry.level || 1}
                        /5
                      </div>

                    </div>


                    <button
                      className="primary-btn"
                      disabled={
                        generatingSkill === id
                      }
                      onClick={() =>
                        generateForSkill(
                          skillEntry
                        )
                      }
                    >

                      {generatingSkill === id
                        ? "Generating…"
                        : "Take AI Assessment"}

                    </button>

                  </div>
                );

              }
            )}

          </div>

        ) : (

          <Empty>
            Add a skill to your profile first,
            then you can take its assessment.
          </Empty>

        )}

      </Section>


      {/* ======================================================
          EXISTING / GENERATED ASSESSMENTS
         ====================================================== */}

      <Section
        title="Available Assessments"
      >

        {assessments.length ? (

          <div className="stack">

            {assessments.map(
              assessment => (

                <div
                  className="job-card"
                  key={
                    assessment._id
                  }
                >

                  <div>

                    <h3>
                      {assessment.title}
                    </h3>


                    <div className="muted">

                      {assessment.role?.title ||
                        assessment.questions?.[0]?.skill?.name ||
                        "General"}

                      {" · "}

                      {assessment.questions?.length || 0}

                      {" questions"}

                    </div>

                  </div>


                  <button
                    className="primary-btn"
                    onClick={() =>
                      start(
                        assessment._id
                      )
                    }
                  >
                    Start
                  </button>

                </div>

              )
            )}

          </div>

        ) : (

          <Empty>
            No assessments available yet.
          </Empty>

        )}

      </Section>


      {/* ======================================================
          MY ATTEMPTS
         ====================================================== */}

      <Section
        title="My Attempts"
      >

        {attempts.length ? (

          <div className="stack mini">

            {attempts.map(
              (attempt, index) => (

                <div
                  className="job-card"
                  key={
                    attempt._id ||
                    index
                  }
                >

                  <div>

                    <strong>
                      {attempt.assessment?.title ||
                        "Assessment"}
                    </strong>


                    <div className="muted">
                      {fmtDate(
                        attempt.createdAt ||
                        attempt.completedAt
                      )}
                    </div>

                  </div>


                  <span
                    className="score-pill"
                  >
                    {attempt.score}%
                  </span>

                </div>

              )
            )}

          </div>

        ) : (

          <Empty>
            No completed attempts.
          </Empty>

        )}

      </Section>

    </>
  );
}

function RoadmapPage() {
  const [roadmap, setRoadmap] = useState([]);
  const [career, setCareer] = useState([]);
  const [aiRoadmap, setAiRoadmap] = useState([]);
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.getRoadmap(), api.careerSuggestions()])
      .then(([r, c]) => { setRoadmap(r.roadmap || []); setCareer(c.recommendations || []); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function generate() {
    try { const data = await api.personalizedRoadmap({ targetRole: targetRole || "Backend Developer" }); setAiRoadmap(data.roadmap || []); } catch (err) { setError(err.message); }
  }

  if (loading) return <Loading />;

  return (
    <>
      <ErrorBox error={error} />
      <Section title="Career Suggestions">
        {career.length ? <div className="card-grid">{career.map((r, i) => <div className="mini-card" key={i}><div className="eyebrow">MATCH</div><h3>{r.role}</h3><div className="metric small">{r.matchScore}%</div><p className="muted">{r.reasoning}</p><div className="skill-cloud compact">{(r.requiredSkills || []).map((s,j)=><span className="tag" key={j}>{s}</span>)}</div></div>)}</div> : <Empty>Career suggestions will appear once a student profile exists and Gemini is available.</Empty>}
      </Section>
      <Section title="Deterministic Skill-Gap Roadmap">
        {roadmap.length ? <div className="roadmap">{roadmap.map((r, i) => <div className="road-item" key={i}><div className="road-index">{r.priority}</div><div><h3>{r.skill}</h3><div className="muted">{r.category}</div><ol>{(r.steps || []).map((s,j)=><li key={j}>{s}</li>)}</ol></div></div>)}</div> : <Empty>No missing skills detected or no skills are available.</Empty>}
      </Section>
      <Section title="Gemini Personalized Roadmap">
        <div className="form-row"><input value={targetRole} onChange={(e)=>setTargetRole(e.target.value)} placeholder="Target role, e.g. Backend Developer" /><button className="primary-btn" onClick={generate}>Generate Roadmap</button></div>
        {aiRoadmap.length ? <div className="card-grid">{aiRoadmap.map((p,i)=><div className="mini-card" key={i}><div className="eyebrow">{p.phase}</div><h3>{p.duration}</h3><div className="skill-cloud compact">{(p.skills||[]).map((s,j)=><span className="tag" key={j}>{s}</span>)}</div><p className="muted">Milestones</p><ul>{(p.milestones||[]).map((m,j)=><li key={j}>{m}</li>)}</ul></div>)}</div> : <p className="muted">Uses <code>POST /api/ai/personalized-roadmap</code>.</p>}
      </Section>
    </>
  );
}

function OpportunitiesPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [applying, setApplying] = useState(null);
  const [message, setMessage] = useState("");
  const [profileId, setProfileId] = useState("");

  useEffect(() => {
    Promise.all([api.getJobs(), api.getStudentProfile()])
      .then(async ([j, p]) => {
        setJobs(j.jobs || []);
        setProfileId(p.profile?._id || "");
      })
      .catch(err=>setError(err.message));
  }, []);

  async function loadMatch(job) {
    try { const data = await api.getMatch(profileId, job._id); setMatches(old => ({...old, [job._id]: data})); } catch(err) { setError(err.message); }
  }

  async function apply(job) {
    setApplying(job._id); setMessage("");
    try { await api.applyForJob(job._id); setMessage(`Applied to ${job.title}.`); } catch(err) { setError(err.message); } finally { setApplying(null); }
  }

  return (
    <>
      <ErrorBox error={error} />
      {message && <div className="success-box">{message}</div>}
      <div className="metric-grid four"><Card title="Total Opportunities" value={jobs.length} /><Card title="Internships" value={jobs.filter(j=>j.type==="internship").length} /><Card title="Jobs" value={jobs.filter(j=>j.type==="job").length} /><Card title="Training" value={jobs.filter(j=>j.type==="training").length} /></div>
      <Section title="Open Opportunities">
        {jobs.length ? <div className="stack">{jobs.map(job => { const m=matches[job._id]; return <div className="job-card" key={job._id}><div><h3>{job.title}</h3><div className="muted">{job.company?.companyName || "Company"} · {job.location || "Remote"} · {job.type}</div><p className="muted">{job.description || "No description provided."}</p><div className="skill-cloud compact">{(job.requiredSkills||[]).map((r,i)=><span className="tag" key={i}>{skillName(r.skill)} · L{r.level}</span>)}</div>{m && <div className="match-strip"><strong>{m.matchPercentage}% match</strong><span>{m.matchedSkills?.length || 0} matched · {m.missingSkills?.length || 0} missing</span></div>}</div><div className="button-stack"><button className="secondary-btn" onClick={()=>loadMatch(job)} disabled={!profileId}>Calculate Match</button><button className="secondary-btn" onClick={()=>setSelectedJob(job)}>Details</button><button className="primary-btn" onClick={()=>apply(job)} disabled={applying===job._id}>{applying===job._id ? "Applying…" : "Apply"}</button></div></div>; })}</div> : <Empty>No open opportunities found.</Empty>}
      </Section>
      {selectedJob && <JobModal job={selectedJob} onClose={()=>setSelectedJob(null)} profileId={profileId} />}
    </>
  );
}

function JobModal({ job, onClose, profileId }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function explain() { setLoading(true); try { setExplanation(await api.matchExplanation(profileId, job._id)); } catch(err){ setError(err.message); } finally { setLoading(false); } }
  return <div className="modal-backdrop"><div className="modal"><div className="panel-head"><h2>{job.title}</h2><button className="icon-btn" onClick={onClose}>×</button></div><p>{job.description || "No description."}</p><div className="muted">{job.company?.companyName || "Company"} · {job.location || "Remote"}</div><div className="skill-cloud">{(job.requiredSkills||[]).map((r,i)=><span className="tag" key={i}>{skillName(r.skill)} · {r.importance}</span>)}</div><button className="secondary-btn" onClick={explain} disabled={loading}>{loading ? "Generating…" : "Why do I match?"}</button><ErrorBox error={error} />{explanation && <div className="explain-box"><div className="metric small">{explanation.matchPercentage}%</div><p>{explanation.explanation}</p><strong>Matched skills</strong><ul>{(explanation.matchedSkills||[]).map((s,i)=><li key={i}>{s.skill} · {s.studentLevel}/{s.requiredLevel}</li>)}</ul><strong>Missing skills</strong><ul>{(explanation.missingSkills||[]).map((s,i)=><li key={i}>{s.skill} · gap {s.gap}</li>)}</ul></div>}</div></div>;
}

function ApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.getMyApplications().then(d=>setApps(d.applications||[])).catch(err=>setError(err.message)); }, []);
  return <><ErrorBox error={error}/><div className="metric-grid four"><Card title="Total" value={apps.length}/><Card title="Applied" value={apps.filter(a=>a.status==="applied").length}/><Card title="Shortlisted" value={apps.filter(a=>a.status==="shortlisted").length}/><Card title="Selected" value={apps.filter(a=>a.status==="selected").length}/></div><Section title="Application History">{apps.length?<div className="stack">{apps.map((a,i)=><div className="job-card" key={i}><div><h3>{a.job?.title || "Opportunity"}</h3><div className="muted">{fmtDate(a.createdAt)} · {a.job?.type || "opportunity"}</div></div><span className={`status ${a.status}`}>{a.status}</span></div>)}</div>:<Empty>No applications submitted yet.</Empty>}</Section></>;
}

function ResumeAIPage() {
  const [text, setText] = useState("");
  const [extract, setExtract] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [career, setCareer] = useState(null);

  function readFile(file) {
    setFileName(file.name);
    if (file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = () => setText(String(reader.result || ""));
      reader.readAsText(file);
    } else {
      setError("The current backend AI endpoint accepts resumeText, not a binary PDF/DOC/DOCX upload. Paste the extracted resume text here for now.");
    }
  }

  async function extractSkills() {
    setBusy("extract"); setError("");
    try { setExtract(await api.extractResumeSkills(text)); } catch(err) { setError(err.message); } finally { setBusy(""); }
  }

  async function analyze() {
    setBusy("analyze"); setError("");
    try { setAnalysis(await api.analyzeResume(text)); } catch(err) { setError(err.message); } finally { setBusy(""); }
  }

  async function careerSuggestions() {
    setBusy("career"); setError("");
    try { setCareer(await api.careerSuggestions()); } catch(err) { setError(err.message); } finally { setBusy(""); }
  }

  return <><ErrorBox error={error}/><div className="two-col"><Section title="Resume Input"><p className="muted">AI integration uses the exact backend contract <code>POST /api/ai/extract-skills</code> with <code>{`{ resumeText }`}</code>.</p><input type="file" accept=".txt,.pdf,.doc,.docx" onChange={(e)=>e.target.files?.[0]&&readFile(e.target.files[0])}/>{fileName&&<div className="file-chip">{fileName}</div>}<textarea rows="18" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Paste resume text here…"/><div className="button-row"><button className="primary-btn" onClick={extractSkills} disabled={!text.trim()||busy}>{busy==="extract"?"Extracting…":"Extract & Save Skills"}</button><button className="secondary-btn" onClick={analyze} disabled={!text.trim()||busy}>{busy==="analyze"?"Analyzing…":"Analyze Resume"}</button></div></Section><Section title="AI Outputs"><button className="secondary-btn" onClick={careerSuggestions} disabled={busy}>{busy==="career"?"Generating…":"Career Suggestions"}</button>{extract && <div className="result-block"><h3>Extracted Skills</h3><div className="skill-cloud">{(extract.skills||[]).map((s,i)=><span className="tag" key={i}>{s.name} · L{s.level}</span>)}</div>{extract.unmatchedSkills?.length>0&&<p className="muted">Unmatched: {extract.unmatchedSkills.map(s=>s.name).join(", ")}</p>}</div>}{analysis&&<div className="result-block"><h3>Resume Analysis</h3><pre className="json-box">{JSON.stringify(analysis.analysis,null,2)}</pre></div>}{career&&<div className="result-block"><h3>Career Suggestions</h3><div className="card-grid">{(career.recommendations||[]).map((r,i)=><div className="mini-card" key={i}><h3>{r.role}</h3><div className="metric small">{r.matchScore}%</div><p>{r.reasoning}</p></div>)}</div></div>}</Section></div></>;
}

function CompanyPage({ user }) {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [skills, setSkills] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [job, setJob] = useState({ title: "", description: "", type: "internship", location: "Remote", stipend: "", duration: "", deadline: "", requiredSkills: [] });

  async function load() {
    try {
      const [p, j, a, s] = await Promise.all([
        api.getCompanyProfile().catch(()=>({ profile: null })),
        api.getCompanyJobs(),
        api.getCompanyApplications(),
        api.getSkills(),
      ]);
      setProfile(p.profile || null); setJobs(j.jobs || []); setApps(a.applications || []); setSkills(s.skills || []);
    } catch (err) { setError(err.message); }
  }
  useEffect(()=>{load();},[]);

  async function createJob(e) {
    e.preventDefault();
    try {
      const payload = { ...job, stipend: job.stipend ? Number(job.stipend) : 0, requiredSkills: job.requiredSkills };
      await api.createJob(payload); setMessage("Opportunity published."); setJob({ title:"",description:"",type:"internship",location:"Remote",stipend:"",duration:"",deadline:"",requiredSkills:[] }); load();
    } catch(err){setError(err.message);}
  }

  function toggleSkill(id) {
    setJob(old => old.requiredSkills.some(x=>String(x.skill)===String(id)) ? {...old,requiredSkills:old.requiredSkills.filter(x=>String(x.skill)!==String(id))} : {...old,requiredSkills:[...old.requiredSkills,{skill:id,level:3,weight:5,importance:"desirable"}]});
  }

  async function status(id,status){try{await api.updateApplicationStatus(id,status);load();}catch(err){setError(err.message);}}

  return <><ErrorBox error={error}/>{message&&<div className="success-box">{message}</div>}<div className="metric-grid four"><Card title="Active Openings" value={jobs.filter(j=>j.status==="open").length}/><Card title="Applicants" value={apps.length}/><Card title="Shortlisted" value={apps.filter(a=>a.status==="shortlisted").length}/><Card title="Selected" value={apps.filter(a=>a.status==="selected").length}/></div>{!profile&&<CompanyProfileQuick user={user} onCreated={load}/>}<div className="two-col"><Section title="Post Job / Internship"><form onSubmit={createJob} className="form-grid"><label>Title<input required value={job.title} onChange={e=>setJob({...job,title:e.target.value})}/></label><label>Type<select value={job.type} onChange={e=>setJob({...job,type:e.target.value})}><option value="internship">Internship</option><option value="job">Full-time Job</option><option value="training">Training</option></select></label><label className="span-2">Description<textarea rows="4" value={job.description} onChange={e=>setJob({...job,description:e.target.value})}/></label><label>Location<input value={job.location} onChange={e=>setJob({...job,location:e.target.value})}/></label><label>Stipend<input type="number" value={job.stipend} onChange={e=>setJob({...job,stipend:e.target.value})}/></label><label>Duration<input value={job.duration} onChange={e=>setJob({...job,duration:e.target.value})}/></label><label>Deadline<input type="date" value={job.deadline} onChange={e=>setJob({...job,deadline:e.target.value})}/></label><div className="span-2"><div className="info-label">Required skills</div><div className="skill-select-grid">{skills.map(s=>{const chosen=job.requiredSkills.find(x=>String(x.skill)===String(s._id));return <button type="button" className={`skill-choice ${chosen?"chosen":""}`} key={s._id} onClick={()=>toggleSkill(s._id)}>{s.name}{chosen?" ✓":""}</button>})}</div></div><div className="span-2"><button className="primary-btn">Publish Opportunity</button></div></form></Section><Section title="My Opportunities">{jobs.length?<div className="stack">{jobs.map(j=><div className="job-card" key={j._id}><div><h3>{j.title}</h3><div className="muted">{j.type} · {j.status}</div></div><span className="score-pill">{(j.requiredSkills||[]).length} skills</span></div>)}</div>:<Empty>No jobs posted yet.</Empty>}</Section></div><Section title="Applicant Screening">{apps.length?<div className="stack">{apps.map(a=><div className="job-card" key={a._id}><div><h3>{a.student?.user?.name||"Candidate"}</h3><div className="muted">{a.job?.title||"Job"} · {a.status}</div><div className="skill-cloud compact">{(a.missingSkills||[]).map((s,i)=><span className="tag" key={i}>Gap: {skillName(s)}</span>)}</div></div><div className="button-stack"><span className="score-pill">{a.matchPercentage}%</span><button className="secondary-btn" onClick={()=>status(a._id,"shortlisted")}>Shortlist</button><button className="danger-btn" onClick={()=>status(a._id,"rejected")}>Reject</button></div></div>)}</div>:<Empty>No applicants yet.</Empty>}</Section></>;
}

function CompanyProfileQuick({ user, onCreated }) {
  const [form,setForm]=useState({companyName:user.name||"",industry:"",description:"",location:"",website:""});
  const [error,setError]=useState("");
  async function save(e){e.preventDefault();try{await api.createCompanyProfile(form);onCreated();}catch(err){setError(err.message);}}
  return <section className="panel"><div className="panel-head"><h2>Company profile required</h2></div><ErrorBox error={error}/><form onSubmit={save} className="form-grid"><label>Company Name<input required value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})}/></label><label>Industry<input value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})}/></label><label>Location<input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></label><label>Website<input value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/></label><label className="span-2">Description<textarea rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="span-2"><button className="primary-btn">Create Company Profile</button></div></form></section>;
}

function InstitutionPage() {
  const [jobs,setJobs]=useState([]);
  const [error,setError]=useState("");
  useEffect(()=>{api.getJobs().then(d=>setJobs(d.jobs||[])).catch(err=>setError(err.message));},[]);
  const bySkill=useMemo(()=>{const map=new Map(); jobs.forEach(j=>(j.requiredSkills||[]).forEach(r=>{const n=skillName(r.skill);map.set(n,(map.get(n)||0)+1);}));return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,12);},[jobs]);
  return <><ErrorBox error={error}/><div className="hero-row"><div><div className="eyebrow">INSTITUTION VIEW</div><h1>Industry demand intelligence</h1><p className="lead">This frontend only uses APIs that currently exist in the backend.</p></div></div><div className="metric-grid four"><Card title="Open Opportunities" value={jobs.length}/><Card title="Internships" value={jobs.filter(j=>j.type==="internship").length}/><Card title="Jobs" value={jobs.filter(j=>j.type==="job").length}/><Card title="Training" value={jobs.filter(j=>j.type==="training").length}/></div><Section title="Most Requested Skills"><div className="demand-list">{bySkill.length?bySkill.map(([name,count],i)=><div className="demand-row" key={i}><span>{name}</span><div className="demand-track"><div className="demand-bar" style={{width:`${Math.min(100,count/Math.max(...bySkill.map(x=>x[1]))*100)}%`}}/></div><strong>{count}</strong></div>):<Empty>No job-skill demand data yet.</Empty>}</div></Section><section className="info-banner"><strong>Backend limitation:</strong> there is currently no <code>/api/institution/*</code> route, so cohort readiness, placement conversions, and heatmap data cannot be fetched live yet. This screen deliberately avoids inventing an API.</section></>;
}

export default App;

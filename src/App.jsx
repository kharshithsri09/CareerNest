import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Home, Briefcase, FileText, Archive as ArchiveIcon, User, Plus, Search,
  X, ChevronUp, ChevronDown, Upload, Download, Eye, Trash2, Pencil,
  CheckCircle2, Circle, Clock, XCircle, SkipForward, ArrowLeft, RotateCcw,
  MapPin, Link2, Wallet, Menu, ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie
} from "recharts";

/* ============================== TOKENS ============================== */
const THEME_CSS = `
  .cn-root{
    --bg: #0C0C0D;
    --surface: #17171A;
    --surface-2: #1F1F23;
    --surface-light: #F7F5EF;
    --border: rgba(201,162,39,0.16);
    --border-soft: rgba(255,255,255,0.08);
    --gold: #C9A227;
    --gold-soft: rgba(201,162,39,0.14);
    --gold-deep: #9C7C1F;
    --text: #F3F1EA;
    --text-muted: #A8A398;
    --text-faint: #6F6B60;
    --teal: #2B8A78;
    --sage: #6F9A72;
    --clay: #C77B5F;
    --blue: #6E93BE;
    --red: #C0554A;
    --grey: #8A8578;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }
  .cn-root.light{
    --bg: #F7F5EF;
    --surface: #FFFFFF;
    --surface-2: #F1EEE5;
    --border: rgba(154,120,26,0.22);
    --border-soft: rgba(0,0,0,0.08);
    --text: #201F1C;
    --text-muted: #6B6559;
    --text-faint: #9C9686;
  }
  .cn-serif{ font-family: Georgia, 'Iowan Old Style', serif; }
  .cn-scroll::-webkit-scrollbar{ width:6px; height:6px; }
  .cn-scroll::-webkit-scrollbar-thumb{ background: var(--border); border-radius:4px; }
  .cn-card{ background:var(--surface); border:1px solid var(--border-soft); border-radius:14px; }
  .cn-input{
    width:100%; background:var(--surface-2); border:1px solid var(--border-soft);
    border-radius:9px; padding:10px 12px; color:var(--text); font-size:14px;
    outline:none; transition:border-color .15s ease;
  }
  .cn-input:focus{ border-color:var(--gold); }
  .cn-input::placeholder{ color:var(--text-faint); }
  .cn-label{ font-size:12px; color:var(--text-muted); margin-bottom:6px; display:block; }
  .cn-btn-gold{
    background:linear-gradient(180deg, var(--gold) 0%, var(--gold-deep) 100%);
    color:#0C0C0D; font-weight:600; border:none; border-radius:9px; padding:10px 16px;
    font-size:13.5px; cursor:pointer; display:inline-flex; align-items:center; gap:7px;
    transition:filter .15s ease;
  }
  .cn-btn-gold:hover{ filter:brightness(1.08); }
  .cn-btn-ghost{
    background:transparent; color:var(--text-muted); border:1px solid var(--border-soft);
    border-radius:9px; padding:9px 14px; font-size:13.5px; cursor:pointer; display:inline-flex;
    align-items:center; gap:7px; transition:all .15s ease;
  }
  .cn-btn-ghost:hover{ color:var(--text); border-color:var(--gold); }
  .cn-nav-item{
    display:flex; align-items:center; gap:11px; padding:10px 14px; border-radius:9px;
    color:var(--text-muted); font-size:14px; cursor:pointer; transition:all .15s ease;
  }
  .cn-nav-item:hover{ background:var(--surface-2); color:var(--text); }
  .cn-nav-item.active{ background:var(--gold-soft); color:var(--gold); font-weight:600; }
  @media (max-width: 860px){ .cn-sidebar{ display:none; } }
  @media (min-width: 861px){ .cn-bottomnav{ display:none; } }
`;

const CATEGORIES = ["Software / IT", "Government", "Non-Tech"];
const CATEGORY_STYLE = {
  "Software / IT": { text: "var(--teal)", bg: "rgba(43,138,120,0.14)" },
  "Government": { text: "var(--sage)", bg: "rgba(111,154,114,0.14)" },
  "Non-Tech": { text: "var(--clay)", bg: "rgba(199,123,95,0.14)" },
};
const STATUS_OPTIONS = ["In Progress", "Interview", "Offer", "Rejected", "Withdrawn", "Joined"];
const STATUS_STYLE = {
  "In Progress": { text: "var(--blue)", bg: "rgba(110,147,190,0.14)" },
  "Interview": { text: "var(--gold)", bg: "var(--gold-soft)" },
  "Offer": { text: "var(--sage)", bg: "rgba(111,154,114,0.14)" },
  "Rejected": { text: "var(--red)", bg: "rgba(192,85,74,0.14)" },
  "Withdrawn": { text: "var(--grey)", bg: "rgba(138,133,120,0.14)" },
  "Joined": { text: "var(--teal)", bg: "rgba(43,138,120,0.14)" },
};
const SOURCES = ["LinkedIn", "Naukri", "Company Website", "Referral", "College", "Other"];
const DEFAULT_STAGES = {
  "Software / IT": ["Applied", "Screening", "Assessment", "Technical Interview", "HR Interview", "Offer"],
  "Government": ["Application Submitted", "Admit Card", "CBT-1", "CBT-2", "Skill Test", "Document Verification", "Medical", "Final Result"],
  "Non-Tech": ["Applied", "Screening", "Interview", "HR Interview", "Offer"],
};
const STAGE_STATUSES = ["pending", "in_progress", "completed", "failed", "skipped"];
const STAGE_META = {
  pending: { label: "Pending", icon: Circle, color: "var(--text-faint)" },
  in_progress: { label: "In Progress", icon: Clock, color: "var(--gold)" },
  completed: { label: "Completed", icon: CheckCircle2, color: "var(--sage)" },
  failed: { label: "Failed", icon: XCircle, color: "var(--red)" },
  skipped: { label: "Skipped", icon: SkipForward, color: "var(--text-faint)" },
};
const EXPERIENCE_LEVELS = ["Student / Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"];
const STORAGE_KEY = "careernest-data-v1";

/* ============================== HELPERS ============================== */
function uid() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
  return "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
}
function nowISO() { return new Date().toISOString(); }
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function makeStages(category) {
  return (DEFAULT_STAGES[category] || DEFAULT_STAGES["Software / IT"]).map((name, i) => ({
    id: uid(), name, order: i, status: "pending", completedDate: null, notes: "",
  }));
}
function sampleData() {
  const app1Stages = makeStages("Software / IT");
  app1Stages[0].status = "completed"; app1Stages[0].completedDate = nowISO();
  app1Stages[1].status = "completed"; app1Stages[1].completedDate = nowISO();
  app1Stages[2].status = "in_progress";
  const app2Stages = makeStages("Government");
  app2Stages[0].status = "completed"; app2Stages[0].completedDate = nowISO();
  app2Stages[1].status = "in_progress";
  const resumeIT = { id: uid(), name: "Software Resume V1", category: "Software / IT", fileName: "software-resume-v1.pdf", fileData: null, createdAt: nowISO(), updatedAt: nowISO() };
  const resumeGovt = { id: uid(), name: "Government Resume", category: "Government", fileName: "government-resume.pdf", fileData: null, createdAt: nowISO(), updatedAt: nowISO() };
  return {
    profile: { name: "", email: "", phone: "", location: "", experienceLevel: "Student / Fresher", theme: "dark" },
    resumes: [resumeIT, resumeGovt],
    applications: [
      {
        id: uid(), companyName: "Tata Consultancy Services", jobRole: "Software Engineer Trainee",
        category: "Software / IT", appliedDate: nowISO(), location: "Hyderabad", workType: "Full-time",
        salary: "4.5 LPA", applicationSource: "Company Website", jobLink: "", resumeId: resumeIT.id,
        status: "Interview", notes: "Referred by senior from college.", createdAt: nowISO(), updatedAt: nowISO(),
        archivedAt: null, stages: app1Stages,
      },
      {
        id: uid(), companyName: "SSC CGL", jobRole: "Junior Assistant",
        category: "Government", appliedDate: nowISO(), location: "Andhra Pradesh", workType: "Full-time",
        salary: "As per pay scale", applicationSource: "Other", jobLink: "", resumeId: resumeGovt.id,
        status: "In Progress", notes: "", createdAt: nowISO(), updatedAt: nowISO(),
        archivedAt: null, stages: app2Stages,
      },
    ],
  };
}
async function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
async function saveData(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (e) { console.error("CareerNest: could not save data", e); }
}

/* ============================== SMALL UI ============================== */
function NestLogo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="cnGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8C860" />
          <stop offset="100%" stopColor="#9C7C1F" />
        </linearGradient>
      </defs>
      <path d="M6 30 C6 22, 14 24, 24 24 C34 24, 42 22, 42 30 C42 34, 34 32, 24 32 C14 32, 6 34, 6 30 Z" stroke="url(#cnGold)" strokeWidth="2" fill="none" />
      <path d="M4 33 C10 30, 38 30, 44 33" stroke="url(#cnGold)" strokeWidth="1.6" fill="none" opacity="0.6" />
      <rect x="17" y="16" width="14" height="10" rx="1.5" fill="url(#cnGold)" />
      <rect x="20.5" y="13" width="7" height="3.5" rx="1" fill="none" stroke="url(#cnGold)" strokeWidth="1.6" />
      <rect x="17" y="20" width="14" height="1.6" fill="#0C0C0D" opacity="0.35" />
    </svg>
  );
}
function Pill({ text, style }) {
  return (
    <span style={{ color: style.text, background: style.bg }}
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap">
      {text}
    </span>
  );
}
function EmptyState({ title, body, actionLabel, onAction }) {
  return (
    <div className="cn-card flex flex-col items-center text-center py-16 px-6">
      <div style={{ background: "var(--gold-soft)" }} className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
        <Briefcase size={20} color="var(--gold)" />
      </div>
      <p className="cn-serif text-lg mb-1">{title}</p>
      <p style={{ color: "var(--text-muted)" }} className="text-sm mb-5 max-w-sm">{body}</p>
      {actionLabel && (
        <button className="cn-btn-gold" onClick={onAction}><Plus size={15} />{actionLabel}</button>
      )}
    </div>
  );
}
function ProgressBar({ pct, color = "var(--gold)" }) {
  return (
    <div style={{ background: "var(--surface-2)" }} className="w-full h-1.5 rounded-full overflow-hidden">
      <div style={{ width: `${pct}%`, background: color }} className="h-full rounded-full transition-all" />
    </div>
  );
}
function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ background: "rgba(0,0,0,0.55)" }} className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className={"cn-card w-full " + (wide ? "max-w-2xl" : "max-w-md") + " my-8"}>
        <div style={{ borderBottom: "1px solid var(--border-soft)" }} className="flex items-center justify-between px-6 py-4">
          <p className="cn-serif text-lg">{title}</p>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={18} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
function StatCard({ label, value, accent }) {
  return (
    <div className="cn-card px-5 py-4">
      <p style={{ color: "var(--text-muted)" }} className="text-xs mb-2">{label}</p>
      <p className="cn-serif text-2xl" style={{ color: accent || "var(--text)" }}>{value}</p>
    </div>
  );
}

/* ============================== NAV ============================== */
const NAV_ITEMS = [
  { key: "home", label: "Home", icon: Home },
  { key: "applications", label: "Applications", icon: Briefcase },
  { key: "files", label: "Career Files", icon: FileText },
  { key: "archive", label: "Archive", icon: ArchiveIcon },
  { key: "profile", label: "Profile", icon: User },
];
function Sidebar({ page, setPage, onAdd }) {
  return (
    <aside className="cn-sidebar w-60 shrink-0 h-screen sticky top-0 flex flex-col px-4 py-6"
      style={{ borderRight: "1px solid var(--border-soft)" }}>
      <div className="flex items-center gap-2.5 px-2 mb-1">
        <NestLogo size={30} />
        <div>
          <p className="cn-serif text-base leading-none">CareerNest</p>
          <p style={{ color: "var(--text-faint)", letterSpacing: "0.08em" }} className="text-[9.5px] mt-1">BUILD · TRACK · GROW</p>
        </div>
      </div>
      <p style={{ color: "var(--text-faint)" }} className="text-xs px-2 mt-1 mb-6 italic">Your Career. One Home.</p>

      <button className="cn-btn-gold w-full justify-center mb-6" onClick={onAdd}>
        <Plus size={15} /> Add Application
      </button>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(item => (
          <div key={item.key} className={"cn-nav-item " + (page === item.key || (page === "detail" && item.key === "applications") ? "active" : "")}
            onClick={() => setPage(item.key)}>
            <item.icon size={16} /> {item.label}
          </div>
        ))}
      </nav>

      <div className="mt-auto px-2 pt-6" style={{ color: "var(--text-faint)" }}>
        <p className="text-[11px]">Local / offline-first demo</p>
      </div>
    </aside>
  );
}
function BottomNav({ page, setPage }) {
  const items = NAV_ITEMS.filter(i => i.key !== "archive");
  return (
    <nav className="cn-bottomnav fixed bottom-0 left-0 right-0 z-40 flex justify-around py-2"
      style={{ background: "var(--surface)", borderTop: "1px solid var(--border-soft)" }}>
      {items.map(item => (
        <div key={item.key} className="flex flex-col items-center gap-1 px-3 py-1 cursor-pointer"
          style={{ color: (page === item.key || (page === "detail" && item.key === "applications")) ? "var(--gold)" : "var(--text-muted)" }}
          onClick={() => setPage(item.key)}>
          <item.icon size={18} />
          <span className="text-[10px]">{item.label}</span>
        </div>
      ))}
    </nav>
  );
}

/* ============================== ADD APPLICATION MODAL ============================== */
function AddApplicationModal({ onClose, onSave, resumes }) {
  const [form, setForm] = useState({
    companyName: "", jobRole: "", category: "Software / IT", appliedDate: new Date().toISOString().slice(0, 10),
    location: "", workType: "Full-time", salary: "", applicationSource: "LinkedIn", jobLink: "", resumeId: "", notes: "",
  });
  const [error, setError] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const relevantResumes = resumes.filter(r => r.category === form.category);

  function submit(e) {
    e.preventDefault();
    if (!form.companyName.trim() || !form.jobRole.trim()) { setError("Company name and job role are required."); return; }
    onSave({ ...form, appliedDate: new Date(form.appliedDate).toISOString() });
  }

  return (
    <Modal title="Add Application" onClose={onClose} wide>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="cn-label">Company name</label>
          <input className="cn-input" value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder="e.g. Infosys" />
        </div>
        <div>
          <label className="cn-label">Job role</label>
          <input className="cn-input" value={form.jobRole} onChange={e => set("jobRole", e.target.value)} placeholder="e.g. SDE-1" />
        </div>
        <div>
          <label className="cn-label">Category</label>
          <select className="cn-input" value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="cn-label">Applied date</label>
          <input type="date" className="cn-input" value={form.appliedDate} onChange={e => set("appliedDate", e.target.value)} />
        </div>
        <div>
          <label className="cn-label">Location</label>
          <input className="cn-input" value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Bengaluru" />
        </div>
        <div>
          <label className="cn-label">Work type</label>
          <input className="cn-input" value={form.workType} onChange={e => set("workType", e.target.value)} placeholder="Full-time, Internship…" />
        </div>
        <div>
          <label className="cn-label">Salary / CTC</label>
          <input className="cn-input" value={form.salary} onChange={e => set("salary", e.target.value)} placeholder="e.g. 6 LPA" />
        </div>
        <div>
          <label className="cn-label">Application source</label>
          <select className="cn-input" value={form.applicationSource} onChange={e => set("applicationSource", e.target.value)}>
            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Job link (reference only — CareerNest never auto-applies)</label>
          <input className="cn-input" value={form.jobLink} onChange={e => set("jobLink", e.target.value)} placeholder="https://…" />
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Resume used</label>
          <select className="cn-input" value={form.resumeId} onChange={e => set("resumeId", e.target.value)}>
            <option value="">— None selected —</option>
            {relevantResumes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            {relevantResumes.length === 0 && <option disabled>No resumes in this category yet — add one in Career Files</option>}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="cn-label">Notes</label>
          <textarea className="cn-input" rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} placeholder="Anything worth remembering…" />
        </div>

        {error && <p style={{ color: "var(--red)" }} className="md:col-span-2 text-xs">{error}</p>}

        <div className="md:col-span-2 flex justify-end gap-3 pt-1">
          <button type="button" className="cn-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="cn-btn-gold">Save application</button>
        </div>
      </form>
    </Modal>
  );
}

/* ============================== ADD RESUME MODAL ============================== */
function AddResumeModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Software / IT");
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState("");

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 4 * 1024 * 1024) { setError("Keep resume files under ~4MB for reliable saving."); return; }
    setError("");
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setFileData(reader.result);
    reader.readAsDataURL(f);
  }

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) { setError("Give this resume a name."); return; }
    onSave({ name: name.trim(), category, fileName: file ? file.name : null, fileData });
  }

  return (
    <Modal title="Add Resume" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="cn-label">Resume name</label>
          <input className="cn-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Software Resume V2" />
        </div>
        <div>
          <label className="cn-label">Category</label>
          <select className="cn-input" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="cn-label">File (optional in this demo)</label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile}
            style={{ color: "var(--text-muted)" }} className="text-xs" />
          {file && <p style={{ color: "var(--text-muted)" }} className="text-xs mt-2">{file.name}</p>}
        </div>
        {error && <p style={{ color: "var(--red)" }} className="text-xs">{error}</p>}
        <div className="flex justify-end gap-3 pt-1">
          <button type="button" className="cn-btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="cn-btn-gold">Save resume</button>
        </div>
      </form>
    </Modal>
  );
}

/* ============================== HOME ============================== */
function HomePage({ applications, resumes, setPage, openAdd }) {
  const active = applications.filter(a => !a.archivedAt);
  const counts = {
    total: active.length,
    inProgress: active.filter(a => a.status === "In Progress").length,
    interview: active.filter(a => a.status === "Interview").length,
    offer: active.filter(a => a.status === "Offer").length,
    rejected: active.filter(a => a.status === "Rejected").length,
  };
  const byCategory = CATEGORIES.map(c => ({ name: c.replace("Software / ", ""), value: active.filter(a => a.category === c).length }));
  const byStatus = STATUS_OPTIONS.map(s => ({ name: s, value: active.filter(a => a.status === s).length })).filter(s => s.value > 0);
  const pieColors = ["#6E93BE", "#C9A227", "#6F9A72", "#C0554A", "#8A8578", "#2B8A78"];
  const recent = active.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="cn-serif text-2xl mb-1">Good to see you.</p>
        <p style={{ color: "var(--text-muted)" }} className="text-sm">Here's your career journey at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Total Applications" value={counts.total} />
        <StatCard label="In Progress" value={counts.inProgress} accent="var(--blue)" />
        <StatCard label="Interviews" value={counts.interview} accent="var(--gold)" />
        <StatCard label="Offers" value={counts.offer} accent="var(--sage)" />
        <StatCard label="Rejected" value={counts.rejected} accent="var(--red)" />
      </div>

      {active.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="cn-card p-5">
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Applications by category</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={byCategory}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} width={24} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {byCategory.map((_, i) => <Cell key={i} fill={["#2B8A78", "#6F9A72", "#C77B5F"][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="cn-card p-5">
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>Applications by status</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={byStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {byStatus.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="cn-serif text-lg">Recent applications</p>
          <button className="text-xs" style={{ color: "var(--gold)" }} onClick={() => setPage("applications")}>View all</button>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No applications yet" body="Start tracking your career journey — add the first opportunity you applied to." actionLabel="Add Application" onAction={openAdd} />
        ) : (
          <div className="flex flex-col gap-2">
            {recent.map(a => (
              <div key={a.id} className="cn-card px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.companyName}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{a.jobRole} · Applied {fmtDate(a.appliedDate)}</p>
                </div>
                <Pill text={a.status} style={STATUS_STYLE[a.status]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================== APPLICATIONS LIST ============================== */
function ApplicationsPage({ applications, resumes, openApp, openAdd, setPage }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");

  const resumeName = (id) => resumes.find(r => r.id === id)?.name;

  const filtered = useMemo(() => {
    let list = applications.filter(a => !a.archivedAt);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(a =>
        a.companyName.toLowerCase().includes(q) ||
        a.jobRole.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (resumeName(a.resumeId) || "").toLowerCase().includes(q) ||
        a.stages.some(s => s.name.toLowerCase().includes(q))
      );
    }
    if (category !== "All") list = list.filter(a => a.category === category);
    if (status !== "All") list = list.filter(a => a.status === status);
    list = list.slice().sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "company") return a.companyName.localeCompare(b.companyName);
      if (sort === "progress") return progressPct(b) - progressPct(a);
      return 0;
    });
    return list;
  }, [applications, query, category, status, sort]);

  function progressPct(a) {
    if (!a.stages.length) return 0;
    return Math.round((a.stages.filter(s => s.status === "completed").length / a.stages.length) * 100);
  }
  function currentStage(a) {
    const inProg = a.stages.find(s => s.status === "in_progress");
    if (inProg) return inProg.name;
    const pending = a.stages.find(s => s.status === "pending");
    if (pending) return pending.name;
    return "All stages done";
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="cn-serif text-2xl">Applications</p>
        <div className="flex gap-2">
          <button className="cn-btn-ghost" onClick={() => setPage("archive")}><ArchiveIcon size={14} /> View Archive</button>
          <button className="cn-btn-gold" onClick={openAdd}><Plus size={15} /> Add Application</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} style={{ position: "absolute", left: 12, top: 12, color: "var(--text-faint)" }} />
          <input className="cn-input" style={{ paddingLeft: 34 }} placeholder="Search company, role, resume, stage…"
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="cn-input" style={{ width: 170 }} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="All">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="cn-input" style={{ width: 150 }} value={status} onChange={e => setStatus(e.target.value)}>
          <option value="All">All statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="cn-input" style={{ width: 150 }} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="company">Company A–Z</option>
          <option value="progress">Most progress</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        applications.filter(a => !a.archivedAt).length === 0 ? (
          <EmptyState title="No applications yet" body="Start tracking your career journey — add the first opportunity you applied to." actionLabel="Add Application" onAction={openAdd} />
        ) : (
          <EmptyState title="No matches" body="Nothing fits that search or filter combination." />
        )
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(a => (
            <div key={a.id} className="cn-card px-5 py-4 cursor-pointer hover:opacity-90" onClick={() => openApp(a.id)}>
              <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] gap-3 md:items-center">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{a.companyName}</p>
                  <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{a.jobRole}</p>
                </div>
                <div><Pill text={a.category.replace("Software / ", "")} style={CATEGORY_STYLE[a.category]} /></div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {currentStage(a)}
                  <ProgressBar pct={progressPct(a)} />
                </div>
                <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {resumeName(a.resumeId) || "No resume linked"}<br />
                  Applied {fmtDate(a.appliedDate)}
                </div>
                <div className="flex md:justify-end"><Pill text={a.status} style={STATUS_STYLE[a.status]} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== APPLICATION DETAIL ============================== */
function ApplicationDetail({ app, resumes, updateApp, archiveApp, restoreApp, deleteApp, back }) {
  const [newStageName, setNewStageName] = useState("");
  const resume = resumes.find(r => r.id === app.resumeId);
  const completed = app.stages.filter(s => s.status === "completed").length;
  const pct = app.stages.length ? Math.round((completed / app.stages.length) * 100) : 0;
  const current = app.stages.find(s => s.status === "in_progress") || app.stages.find(s => s.status === "pending");

  function patchStage(stageId, patch) {
    const stages = app.stages.map(s => s.id === stageId ? { ...s, ...patch } : s);
    updateApp({ stages });
  }
  function addStage() {
    if (!newStageName.trim()) return;
    const stages = [...app.stages, { id: uid(), name: newStageName.trim(), order: app.stages.length, status: "pending", completedDate: null, notes: "" }];
    updateApp({ stages });
    setNewStageName("");
  }
  function removeStage(stageId) {
    updateApp({ stages: app.stages.filter(s => s.id !== stageId) });
  }
  function moveStage(idx, dir) {
    const stages = [...app.stages];
    const target = idx + dir;
    if (target < 0 || target >= stages.length) return;
    [stages[idx], stages[target]] = [stages[target], stages[idx]];
    updateApp({ stages: stages.map((s, i) => ({ ...s, order: i })) });
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <button className="cn-btn-ghost w-fit" onClick={back}><ArrowLeft size={14} /> Back to applications</button>

      <div className="cn-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="cn-serif text-2xl">{app.companyName}</p>
            <p style={{ color: "var(--text-muted)" }} className="text-sm">{app.jobRole}</p>
          </div>
          <select className="cn-input" style={{ width: 160 }} value={app.status} onChange={e => updateApp({ status: e.target.value })}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5">
          <div><p className="cn-label">Category</p><Pill text={app.category} style={CATEGORY_STYLE[app.category]} /></div>
          <div><p className="cn-label">Applied date</p>{fmtDate(app.appliedDate)}</div>
          <div><p className="cn-label">Location</p>{app.location || "—"}</div>
          <div><p className="cn-label">Salary / CTC</p>{app.salary || "—"}</div>
          <div><p className="cn-label">Application source</p>{app.applicationSource}</div>
          <div><p className="cn-label">Resume used</p>{resume ? resume.name : "Not linked"}</div>
          <div className="col-span-2"><p className="cn-label">Job link (reference only)</p>
            {app.jobLink ? <a href={app.jobLink} target="_blank" rel="noreferrer" style={{ color: "var(--gold)" }} className="truncate flex items-center gap-1"><Link2 size={12} />{app.jobLink}</a> : "—"}
          </div>
        </div>

        {app.notes && (
          <div className="mb-5">
            <p className="cn-label">Notes</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{app.notes}</p>
          </div>
        )}

        <div className="mb-2 flex items-center justify-between text-xs" style={{ color: "var(--text-muted)" }}>
          <span>{completed} / {app.stages.length} stages completed</span>
          <span>Current: {current ? current.name : "All stages completed"}</span>
        </div>
        <ProgressBar pct={pct} />

        <div className="flex gap-2 mt-5">
          {!app.archivedAt ? (
            <button className="cn-btn-ghost" onClick={archiveApp}><ArchiveIcon size={14} /> Archive</button>
          ) : (
            <button className="cn-btn-ghost" onClick={restoreApp}><RotateCcw size={14} /> Restore</button>
          )}
          <button className="cn-btn-ghost" style={{ color: "var(--red)" }} onClick={deleteApp}><Trash2 size={14} /> Delete permanently</button>
        </div>
      </div>

      <div className="cn-card p-6">
        <p className="cn-serif text-lg mb-4">Recruitment timeline</p>
        <div className="flex flex-col gap-3">
          {app.stages.map((s, idx) => {
            const meta = STAGE_META[s.status];
            const Icon = meta.icon;
            return (
              <div key={s.id} className="flex flex-col md:flex-row md:items-center gap-3 p-3 rounded-lg" style={{ background: "var(--surface-2)" }}>
                <div className="flex items-center gap-2 md:w-48 shrink-0">
                  <Icon size={16} color={meta.color} />
                  <span className="text-sm">{s.name}</span>
                </div>
                <select className="cn-input" style={{ width: 140 }} value={s.status} onChange={e => patchStage(s.id, { status: e.target.value, completedDate: e.target.value === "completed" ? nowISO() : s.completedDate })}>
                  {STAGE_STATUSES.map(st => <option key={st} value={st}>{STAGE_META[st].label}</option>)}
                </select>
                <input className="cn-input flex-1" placeholder="Notes for this stage…" value={s.notes} onChange={e => patchStage(s.id, { notes: e.target.value })} />
                <span className="text-xs shrink-0" style={{ color: "var(--text-faint)" }}>{s.completedDate ? fmtDate(s.completedDate) : ""}</span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => moveStage(idx, -1)} style={{ color: "var(--text-faint)" }}><ChevronUp size={16} /></button>
                  <button onClick={() => moveStage(idx, 1)} style={{ color: "var(--text-faint)" }}><ChevronDown size={16} /></button>
                  <button onClick={() => removeStage(s.id)} style={{ color: "var(--text-faint)" }}><X size={16} /></button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <input className="cn-input flex-1" placeholder="Add a custom stage — e.g. Bar Raiser, Group Discussion…" value={newStageName} onChange={e => setNewStageName(e.target.value)} onKeyDown={e => e.key === "Enter" && addStage()} />
          <button className="cn-btn-ghost" onClick={addStage}><Plus size={14} /> Add stage</button>
        </div>
      </div>
    </div>
  );
}

/* ============================== CAREER FILES ============================== */
function CareerFilesPage({ resumes, openAddResume, updateResume, deleteResume }) {
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  function startRename(r) { setRenamingId(r.id); setRenameVal(r.name); }
  function commitRename(id) {
    if (renameVal.trim()) updateResume(id, { name: renameVal.trim(), updatedAt: nowISO() });
    setRenamingId(null);
  }
  function viewResume(r) {
    if (r.fileData) { const w = window.open(); w.document.write(`<iframe src="${r.fileData}" style="border:0;width:100%;height:100vh;"></iframe>`); }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="cn-serif text-2xl">Career Files</p>
        <button className="cn-btn-gold" onClick={openAddResume}><Plus size={15} /> Add Resume</button>
      </div>

      {resumes.length === 0 ? (
        <EmptyState title="No resumes added yet" body="Upload your first resume to start linking it to applications." actionLabel="Add Resume" onAction={openAddResume} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resumes.map(r => (
            <div key={r.id} className="cn-card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                {renamingId === r.id ? (
                  <input className="cn-input" autoFocus value={renameVal} onChange={e => setRenameVal(e.target.value)}
                    onBlur={() => commitRename(r.id)} onKeyDown={e => e.key === "Enter" && commitRename(r.id)} />
                ) : (
                  <p className="text-sm font-medium">{r.name}</p>
                )}
                <FileText size={16} style={{ color: "var(--text-faint)" }} className="shrink-0" />
              </div>
              <Pill text={r.category.replace("Software / ", "")} style={CATEGORY_STYLE[r.category]} />
              <p className="text-xs" style={{ color: "var(--text-faint)" }}>
                {r.fileName || "No file attached"} · Added {fmtDate(r.createdAt)}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {r.fileData && (
                  <>
                    <button className="cn-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => viewResume(r)}><Eye size={13} /> View</button>
                    <a className="cn-btn-ghost" style={{ padding: "6px 10px", textDecoration: "none" }} href={r.fileData} download={r.fileName}><Download size={13} /> Download</a>
                  </>
                )}
                <button className="cn-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => startRename(r)}><Pencil size={13} /> Rename</button>
                <button className="cn-btn-ghost" style={{ padding: "6px 10px", color: "var(--red)" }} onClick={() => deleteResume(r.id)}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== ARCHIVE ============================== */
function ArchivePage({ applications, resumes, restoreApp, deleteApp, openApp }) {
  const archived = applications.filter(a => a.archivedAt);
  const resumeName = (id) => resumes.find(r => r.id === id)?.name;

  return (
    <div className="flex flex-col gap-5">
      <p className="cn-serif text-2xl">Archive</p>
      {archived.length === 0 ? (
        <EmptyState title="No archived applications" body="Applications you archive — rejected, withdrawn, or completed — will show up here." />
      ) : (
        <div className="flex flex-col gap-2">
          {archived.map(a => (
            <div key={a.id} className="cn-card px-5 py-4 grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto] gap-3 md:items-center">
              <div className="min-w-0 cursor-pointer" onClick={() => openApp(a.id)}>
                <p className="text-sm font-medium truncate">{a.companyName}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{a.jobRole}</p>
              </div>
              <div><Pill text={a.status} style={STATUS_STYLE[a.status]} /></div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Applied {fmtDate(a.appliedDate)}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{resumeName(a.resumeId) || "No resume"} · Archived {fmtDate(a.archivedAt)}</div>
              <div className="flex gap-2 md:justify-end">
                <button className="cn-btn-ghost" style={{ padding: "6px 10px" }} onClick={() => restoreApp(a.id)}><RotateCcw size={13} /> Restore</button>
                <button className="cn-btn-ghost" style={{ padding: "6px 10px", color: "var(--red)" }} onClick={() => deleteApp(a.id)}><Trash2 size={13} /> Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================== PROFILE ============================== */
function ProfilePage({ profile, setProfile, data, onImport }) {
  const set = (k, v) => setProfile({ ...profile, [k]: v });

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "careernest-backup.json"; a.click();
    URL.revokeObjectURL(url);
  }
  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        onImport(parsed);
      } catch { alert("That file doesn't look like a valid CareerNest backup."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <p className="cn-serif text-2xl">Profile</p>

      <div className="cn-card p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="cn-label">Name</label><input className="cn-input" value={profile.name} onChange={e => set("name", e.target.value)} placeholder="Your name" /></div>
        <div><label className="cn-label">Email (optional)</label><input className="cn-input" value={profile.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" /></div>
        <div><label className="cn-label">Phone (optional)</label><input className="cn-input" value={profile.phone} onChange={e => set("phone", e.target.value)} /></div>
        <div><label className="cn-label">Location</label><input className="cn-input" value={profile.location} onChange={e => set("location", e.target.value)} /></div>
        <div>
          <label className="cn-label">Preferred career category</label>
          <select className="cn-input" value={profile.preferredCategory || ""} onChange={e => set("preferredCategory", e.target.value)}>
            <option value="">No preference</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="cn-label">Experience level</label>
          <select className="cn-input" value={profile.experienceLevel} onChange={e => set("experienceLevel", e.target.value)}>
            {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <div className="cn-card p-6">
        <p className="text-sm font-medium mb-1">Theme</p>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Switch between the dark gold theme and a light surface.</p>
        <div className="flex gap-2">
          <button className={profile.theme === "dark" ? "cn-btn-gold" : "cn-btn-ghost"} onClick={() => set("theme", "dark")}>Dark</button>
          <button className={profile.theme === "light" ? "cn-btn-gold" : "cn-btn-ghost"} onClick={() => set("theme", "light")}>Light</button>
        </div>
      </div>

      <div className="cn-card p-6">
        <p className="text-sm font-medium mb-1">Notification preferences</p>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Reminders for interviews and follow-ups are coming in a future version.</p>
        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-faint)" }}>
          <input type="checkbox" disabled /> Email reminders (coming soon)
        </label>
      </div>

      <div className="cn-card p-6">
        <p className="text-sm font-medium mb-1">Data backup</p>
        <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>CareerNest is local-first — export your data as a backup, or import a previous one.</p>
        <div className="flex flex-wrap gap-2">
          <button className="cn-btn-ghost" onClick={exportData}><Download size={14} /> Export Career Data</button>
          <label className="cn-btn-ghost" style={{ cursor: "pointer" }}>
            <Upload size={14} /> Import Career Data
            <input type="file" accept="application/json" onChange={handleImportFile} style={{ display: "none" }} />
          </label>
        </div>
      </div>
    </div>
  );
}

/* ============================== APP ============================== */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", location: "", experienceLevel: EXPERIENCE_LEVELS[0], theme: "dark", preferredCategory: "" });
  const [applications, setApplications] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [page, setPage] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [showAddApp, setShowAddApp] = useState(false);
  const [showAddResume, setShowAddResume] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const d = await loadData();
      const data = d || sampleData();
      if (!cancelled) {
        setProfile({ preferredCategory: "", ...data.profile });
        setApplications(data.applications || []);
        setResumes(data.resumes || []);
        setLoaded(true);
      }
      if (!d) await saveData(data);
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    saveData({ profile, applications, resumes });
  }, [profile, applications, resumes, loaded]);

  const updateApplication = useCallback((id, patch) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch, updatedAt: nowISO() } : a));
  }, []);
  const addApplication = useCallback((form) => {
    const app = {
      id: uid(), companyName: form.companyName.trim(), jobRole: form.jobRole.trim(), category: form.category,
      appliedDate: form.appliedDate, location: form.location, workType: form.workType, salary: form.salary,
      applicationSource: form.applicationSource, jobLink: form.jobLink, resumeId: form.resumeId || null,
      status: "In Progress", notes: form.notes, createdAt: nowISO(), updatedAt: nowISO(), archivedAt: null,
      stages: makeStages(form.category),
    };
    setApplications(prev => [app, ...prev]);
    setShowAddApp(false);
    setSelectedId(app.id);
    setPage("detail");
  }, []);
  const addResume = useCallback((form) => {
    const r = { id: uid(), name: form.name, category: form.category, fileName: form.fileName, fileData: form.fileData, createdAt: nowISO(), updatedAt: nowISO() };
    setResumes(prev => [r, ...prev]);
    setShowAddResume(false);
  }, []);
  const updateResume = useCallback((id, patch) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  }, []);
  const deleteResume = useCallback((id) => {
    if (!confirm("Delete this resume? Applications referencing it will show \"No resume linked\".")) return;
    setResumes(prev => prev.filter(r => r.id !== id));
  }, []);
  const deleteApplication = useCallback((id) => {
    if (!confirm("Permanently delete this application? This can't be undone.")) return;
    setApplications(prev => prev.filter(a => a.id !== id));
    setPage("applications");
  }, []);
  function importAll(parsed) {
    if (!confirm("Import this backup? It will replace your current CareerNest data.")) return;
    setProfile({ preferredCategory: "", ...(parsed.profile || {}) });
    setApplications(parsed.applications || []);
    setResumes(parsed.resumes || []);
  }

  const selectedApp = applications.find(a => a.id === selectedId);

  function openApp(id) { setSelectedId(id); setPage("detail"); setMobileMenu(false); }
  function goPage(p) { setPage(p); setMobileMenu(false); }

  if (!loaded) {
    return (
      <div className="cn-root flex items-center justify-center h-screen">
        <style>{THEME_CSS}</style>
        <NestLogo size={36} />
      </div>
    );
  }

  return (
    <div className={"cn-root " + (profile.theme === "light" ? "light" : "")}>
      <style>{THEME_CSS}</style>
      <div className="flex">
        <Sidebar page={page} setPage={goPage} onAdd={() => setShowAddApp(true)} />

        <div className="flex-1 min-w-0">
          <div className="md:hidden flex items-center justify-between px-4 py-4" style={{ borderBottom: "1px solid var(--border-soft)" }}>
            <div className="flex items-center gap-2"><NestLogo size={24} /><p className="cn-serif text-sm">CareerNest</p></div>
            <button className="cn-btn-gold" style={{ padding: "8px 12px" }} onClick={() => setShowAddApp(true)}><Plus size={14} /></button>
          </div>

          <main className="px-4 md:px-8 py-6 md:py-8 pb-24 md:pb-10 max-w-6xl">
            {page === "home" && <HomePage applications={applications} resumes={resumes} setPage={goPage} openAdd={() => setShowAddApp(true)} />}
            {page === "applications" && <ApplicationsPage applications={applications} resumes={resumes} openApp={openApp} openAdd={() => setShowAddApp(true)} setPage={goPage} />}
            {page === "detail" && selectedApp && (
              <ApplicationDetail
                app={selectedApp}
                resumes={resumes}
                updateApp={(patch) => updateApplication(selectedApp.id, patch)}
                archiveApp={() => { updateApplication(selectedApp.id, { archivedAt: nowISO() }); goPage("archive"); }}
                restoreApp={() => updateApplication(selectedApp.id, { archivedAt: null })}
                deleteApp={() => deleteApplication(selectedApp.id)}
                back={() => goPage("applications")}
              />
            )}
            {page === "files" && <CareerFilesPage resumes={resumes} openAddResume={() => setShowAddResume(true)} updateResume={updateResume} deleteResume={deleteResume} />}
            {page === "archive" && <ArchivePage applications={applications} resumes={resumes} restoreApp={(id) => updateApplication(id, { archivedAt: null })} deleteApp={deleteApplication} openApp={openApp} />}
            {page === "profile" && <ProfilePage profile={profile} setProfile={setProfile} data={{ profile, applications, resumes }} onImport={importAll} />}
          </main>
        </div>
      </div>

      <BottomNav page={page} setPage={goPage} />

      {showAddApp && <AddApplicationModal onClose={() => setShowAddApp(false)} onSave={addApplication} resumes={resumes} />}
      {showAddResume && <AddResumeModal onClose={() => setShowAddResume(false)} onSave={addResume} />}
    </div>
  );
}

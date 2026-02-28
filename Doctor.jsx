import { useState } from "react";

// ── Mock data ─────────────────────────────────────────────────────────────────
const DEMO_USERS = [
  { username: "admin",       password: "Admin1234!",     name: "Sandra Kim",        role: "admin",        title: "Office Administrator" },
  { username: "doctor",      password: "Doctor1234!",    name: "Dr. Priya Patel",   role: "doctor",       title: "Physician, MD" },
  { username: "nurse",       password: "Nurse1234!",     name: "James Torres",      role: "nurse",        title: "Registered Nurse" },
  { username: "receptionist",password: "Recept1234!",    name: "Brianna Wells",     role: "receptionist", title: "Front Desk" },
];

const PATIENTS = [
  { id: 1, first_name: "Margaret", last_name: "Chen",    dob: "1968-04-12", gender: "F", phone: "555-0142", insurance: "BlueCross",   allergies: ["Penicillin","Sulfa"], lastVisit: "2026-02-10" },
  { id: 2, first_name: "Robert",   last_name: "Vásquez", dob: "1952-09-28", gender: "M", phone: "555-0198", insurance: "Medicare",     allergies: [],                    lastVisit: "2026-02-18" },
  { id: 3, first_name: "Aisha",    last_name: "Okonkwo", dob: "1991-01-03", gender: "F", phone: "555-0277", insurance: "Aetna",        allergies: ["Latex"],             lastVisit: "2026-01-30" },
  { id: 4, first_name: "Derek",    last_name: "Marsh",   dob: "1985-07-19", gender: "M", phone: "555-0355", insurance: "UnitedHealth", allergies: [],                    lastVisit: "2026-02-20" },
  { id: 5, first_name: "Yuki",     last_name: "Tanaka",  dob: "1977-11-05", gender: "F", phone: "555-0401", insurance: "Cigna",        allergies: ["Aspirin"],           lastVisit: "2026-02-05" },
  { id: 6, first_name: "Thomas",   last_name: "Reilly",  dob: "1945-03-22", gender: "M", phone: "555-0532", insurance: "Medicare",     allergies: ["Codeine"],           lastVisit: "2026-02-22" },
];

const APPOINTMENTS_DATA = [
  { id: 1, patient: "Margaret Chen",  type: "follow-up",   time: "09:00", duration: 30, doctor: "Dr. Patel",    status: "checked-in"  },
  { id: 2, patient: "Derek Marsh",    type: "routine",     time: "09:30", duration: 30, doctor: "Dr. Patel",    status: "scheduled"   },
  { id: 3, patient: "Robert Vásquez", type: "urgent",      time: "10:00", duration: 30, doctor: "Dr. Williams", status: "in-progress" },
  { id: 4, patient: "Thomas Reilly",  type: "routine",     time: "10:30", duration: 30, doctor: "Dr. Williams", status: "scheduled"   },
  { id: 5, patient: "Aisha Okonkwo",  type: "new-patient", time: "11:00", duration: 45, doctor: "Dr. Patel",    status: "scheduled"   },
  { id: 6, patient: "Yuki Tanaka",    type: "procedure",   time: "14:00", duration: 60, doctor: "Dr. Williams", status: "scheduled"   },
];

const RECALLS_DATA = [
  { id: 1, patient: "Robert Vásquez", reason: "HbA1c recheck",        due: "2026-02-20", urgency: "high"   },
  { id: 2, patient: "Thomas Reilly",  reason: "BP medication review",  due: "2026-02-24", urgency: "high"   },
  { id: 3, patient: "Yuki Tanaka",    reason: "Annual physical",       due: "2026-03-01", urgency: "medium" },
  { id: 4, patient: "Margaret Chen",  reason: "Cholesterol panel",     due: "2026-03-10", urgency: "low"    },
];

const VITALS = {
  1: { bp: "122/78", hr: 72, temp: 98.4, o2: 98, weight: 148, bmi: 23.1 },
  2: { bp: "148/92", hr: 84, temp: 98.6, o2: 96, weight: 201, bmi: 28.7 },
  4: { bp: "118/74", hr: 68, temp: 98.2, o2: 99, weight: 175, bmi: 24.4 },
};

const PRESCRIPTIONS = {
  1: [{ id: 1, med: "Lisinopril",   dose: "10mg",  sig: "Once daily",              refills: 3 }],
  2: [{ id: 2, med: "Metformin",    dose: "500mg", sig: "Twice daily with food",   refills: 5 },
      { id: 3, med: "Atorvastatin", dose: "20mg",  sig: "Once daily at bedtime",   refills: 2 }],
};

const STAFF_LIST = [
  { id: 1, name: "Dr. Priya Patel",   role: "doctor",       status: "active",   lastLogin: "2026-02-25 08:14" },
  { id: 2, name: "Dr. Owen Williams", role: "doctor",       status: "active",   lastLogin: "2026-02-25 07:58" },
  { id: 3, name: "James Torres",      role: "nurse",        status: "active",   lastLogin: "2026-02-25 08:02" },
  { id: 4, name: "Brianna Wells",     role: "receptionist", status: "active",   lastLogin: "2026-02-25 07:45" },
  { id: 5, name: "Marcus Reed",       role: "nurse",        status: "inactive", lastLogin: "2026-02-10 09:30" },
];

// ── Permissions ───────────────────────────────────────────────────────────────
const PERMS = {
  admin:        { appointments: true,  patients: true,  vitals: true,  notes: true,  prescriptions: true,  recalls: true,  admin: true,  settings: true  },
  doctor:       { appointments: true,  patients: true,  vitals: true,  notes: true,  prescriptions: true,  recalls: true,  admin: false, settings: true  },
  nurse:        { appointments: true,  patients: true,  vitals: true,  notes: false, prescriptions: false, recalls: true,  admin: false, settings: false },
  receptionist: { appointments: true,  patients: true,  vitals: false, notes: false, prescriptions: false, recalls: true,  admin: false, settings: false },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function age(dob) { return Math.floor((new Date() - new Date(dob)) / 31557600000); }
function fmtDate(d) { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); }

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#F0F2F5", surface: "#FFFFFF", border: "#E2E6EB",
  navy: "#1A3A5C", navyMid: "#1E4D8C", teal: "#0E7C86",
  text: "#1A2332", muted: "#6B7A8D",
  green: "#1A8754", greenBg: "#EBF5EE",
  red: "#C0392B",   redBg: "#FDECEA",
  amber: "#B7580A", amberBg: "#FEF3E7",
  blue: "#1565C0",  blueBg: "#E8F0FE",
  purple: "#6B21A8", purpleBg: "#F3E8FF",
};

const ROLE_COLORS = {
  admin:        { bg: C.purpleBg, fg: C.purple,  sidebarAccent: "#4C1D95" },
  doctor:       { bg: C.blueBg,   fg: C.blue,    sidebarAccent: "#1E40AF" },
  nurse:        { bg: C.greenBg,  fg: C.green,   sidebarAccent: "#166534" },
  receptionist: { bg: C.amberBg,  fg: C.amber,   sidebarAccent: "#92400E" },
};

const ROLE_ICONS = { admin: "⚙", doctor: "⚕", nurse: "♥", receptionist: "◉" };

// ── Tiny components ────────────────────────────────────────────────────────────
const Badge = ({ color = "blue", children }) => {
  const map = { green: [C.greenBg,C.green], red: [C.redBg,C.red], amber: [C.amberBg,C.amber], blue: [C.blueBg,C.blue], navy: ["#EAF0FB",C.navyMid], teal: ["#E0F4F6",C.teal], purple: [C.purpleBg,C.purple] };
  const [bg, fg] = map[color] || map.blue;
  return <span style={{ background: bg, color: fg, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, letterSpacing: "0.04em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>;
};
const StatusBadge = ({ status }) => {
  const m = { "checked-in":["teal","Checked In"], "in-progress":["amber","In Progress"], scheduled:["blue","Scheduled"], completed:["green","Completed"], "no-show":["red","No Show"] };
  const [c,l] = m[status] || ["blue",status];
  return <Badge color={c}>{l}</Badge>;
};
const TypeBadge = ({ type }) => {
  const m = { routine:"blue","follow-up":"teal",urgent:"red",procedure:"amber","new-patient":"green" };
  return <Badge color={m[type]||"blue"}>{type.replace("-"," ")}</Badge>;
};
const Card = ({ children, style={} }) => (
  <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:10, ...style }}>{children}</div>
);
const LockedBanner = ({ message = "Your role doesn't have access to this section." }) => (
  <div style={{ padding:"28px 32px" }}>
    <div style={{ background:"#F7F9FC", border:`1px solid ${C.border}`, borderRadius:12, padding:"56px 32px", textAlign:"center", maxWidth:480, margin:"0 auto" }}>
      <div style={{ fontSize:40, marginBottom:16 }}>🔒</div>
      <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:8 }}>Access Restricted</div>
      <div style={{ color:C.muted, fontSize:14 }}>{message}</div>
    </div>
  </div>
);

// ── SIDEBAR ────────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, user }) {
  const p = PERMS[user.role];
  const rc = ROLE_COLORS[user.role];
  const nav = [
    { id:"dashboard",    icon:"▦", label:"Dashboard",    show:true             },
    { id:"appointments", icon:"◷", label:"Appointments", show:p.appointments   },
    { id:"patients",     icon:"◉", label:"Patients",     show:p.patients       },
    { id:"recalls",      icon:"◎", label:"Recalls",      show:p.recalls, badge:2 },
    { id:"admin",        icon:"⚙", label:"Admin Panel",  show:p.admin          },
    { id:"settings",     icon:"≡", label:"Settings",     show:p.settings       },
  ].filter(n => n.show);

  return (
    <div style={{ width:220, background:C.navy, display:"flex", flexDirection:"column", height:"100%", flexShrink:0 }}>
      {/* Logo */}
      <div style={{ padding:"20px 18px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, background:"#E8F0FE", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:C.navyMid, fontWeight:900, fontSize:17 }}>✚</div>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:13 }}>Clinic Manager</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>v1.0</div>
          </div>
        </div>
      </div>

      {/* Role pill */}
      <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ background:rc.bg, borderRadius:6, padding:"5px 10px", display:"inline-flex", alignItems:"center", gap:6 }}>
          <span style={{ fontSize:12 }}>{ROLE_ICONS[user.role]}</span>
          <span style={{ color:rc.fg, fontSize:11, fontWeight:700, textTransform:"capitalize" }}>{user.role}</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:"10px 10px" }}>
        {nav.map(n => {
          const active = page === n.id;
          return (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 12px", borderRadius:7, border:"none", cursor:"pointer", marginBottom:2, background:active?"rgba(255,255,255,0.12)":"transparent", color:active?"#fff":"rgba(255,255,255,0.55)", fontSize:13, fontWeight:active?600:400, textAlign:"left" }}>
              <span style={{ fontSize:14 }}>{n.icon}</span>
              <span style={{ flex:1 }}>{n.label}</span>
              {n.badge>0 && <span style={{ background:C.red, color:"#fff", fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:10 }}>{n.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding:"14px 16px", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:32, height:32, borderRadius:"50%", background:rc.fg, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>
            {user.name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2)}
          </div>
          <div style={{ overflow:"hidden" }}>
            <div style={{ color:"#fff", fontSize:12, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{user.name}</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:11 }}>{user.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DASHBOARD (role-aware) ────────────────────────────────────────────────────
function Dashboard({ user, setPage }) {
  const role = user.role;

  if (role === "receptionist") return (
    <div style={{ padding:"28px 32px", maxWidth:1000 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Good morning, {user.name}</h1>
        <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>Wednesday, February 25, 2026 · Front Desk View</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:24 }}>
        {[["Today's Appointments","6","2 arriving soon",C.navyMid],["Checked In","1","In waiting room",C.teal],["Upcoming Recalls","4","Need scheduling",C.amber]].map(([l,v,s,color])=>(
          <Card key={l} style={{ padding:"18px 20px" }}>
            <div style={{ color:C.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:30, fontWeight:800, color, lineHeight:1 }}>{v}</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:5 }}>{s}</div>
          </Card>
        ))}
      </div>
      <Card>
        <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Today's Schedule</div>
          <button onClick={()=>setPage("appointments")} style={{ color:C.navyMid, fontSize:12, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>Manage →</button>
        </div>
        {APPOINTMENTS_DATA.map((a,i)=>(
          <div key={a.id} style={{ padding:"12px 20px", display:"flex", alignItems:"center", gap:14, borderBottom:i<APPOINTMENTS_DATA.length-1?`1px solid ${C.border}`:"none" }}>
            <div style={{ width:46, textAlign:"right", color:C.muted, fontSize:13, fontWeight:600, flexShrink:0 }}>{a.time}</div>
            <div style={{ width:3, height:34, background:a.status==="in-progress"?C.amber:a.status==="checked-in"?C.teal:C.border, borderRadius:2, flexShrink:0 }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{a.patient}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{a.doctor} · {a.duration}min</div>
            </div>
            <TypeBadge type={a.type}/>
            <StatusBadge status={a.status}/>
          </div>
        ))}
      </Card>
    </div>
  );

  if (role === "nurse") return (
    <div style={{ padding:"28px 32px", maxWidth:1000 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Good morning, {user.name}</h1>
        <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>Wednesday, February 25, 2026 · Nursing View</p>
      </div>
      <div style={{ background:C.amberBg, border:`1px solid #F5C07A`, borderRadius:10, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:18 }}>⚠</span>
        <div>
          <div style={{ fontWeight:700, fontSize:13, color:C.amber }}>2 patients need vitals recorded</div>
          <div style={{ fontSize:12, color:C.amber, marginTop:2 }}>Margaret Chen (09:00) and Derek Marsh (09:30) are checked in and awaiting triage.</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[["Checked In","1","Awaiting vitals",C.teal],["In Progress","1","With physician",C.amber],["Vitals Done","0","Today",C.green],["Scheduled","4","Still arriving",C.blue]].map(([l,v,s,color])=>(
          <Card key={l} style={{ padding:"18px 20px" }}>
            <div style={{ color:C.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:30, fontWeight:800, color, lineHeight:1 }}>{v}</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:5 }}>{s}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:14, color:C.text }}>Ready for Vitals</div>
          {APPOINTMENTS_DATA.filter(a=>["checked-in","scheduled"].includes(a.status)).slice(0,3).map((a,i,arr)=>(
            <div key={a.id} style={{ padding:"13px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{a.time} · {a.type}</div>
              </div>
              <StatusBadge status={a.status}/>
              <button style={{ fontSize:11, fontWeight:600, padding:"5px 10px", borderRadius:5, border:`1px solid ${C.border}`, background:C.surface, color:C.green, cursor:"pointer" }}>Record Vitals</button>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:14, color:C.text }}>Overdue Recalls</div>
          {RECALLS_DATA.filter(r=>r.urgency==="high").map((r,i,arr)=>(
            <div key={r.id} style={{ padding:"13px 20px", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{r.patient}</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{r.reason}</div>
              <div style={{ fontSize:11, color:C.red, marginTop:2, fontWeight:600 }}>Overdue since {fmtDate(r.due)}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  if (role === "doctor") return (
    <div style={{ padding:"28px 32px", maxWidth:1100 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Good morning, {user.name}</h1>
        <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>Wednesday, February 25, 2026 · 3 patients assigned to you today</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[["My Patients Today","3","1 in progress",C.navyMid],["Awaiting Review","1","Vitals ready",C.amber],["Prescriptions","2","Need signing",C.blue],["Overdue Recalls","2","For your patients",C.red]].map(([l,v,s,color])=>(
          <Card key={l} style={{ padding:"18px 20px" }}>
            <div style={{ color:C.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:30, fontWeight:800, color, lineHeight:1 }}>{v}</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:5 }}>{s}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:16 }}>
        <Card>
          <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>My Schedule Today</div>
            <button onClick={()=>setPage("appointments")} style={{ color:C.navyMid, fontSize:12, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>View all →</button>
          </div>
          {APPOINTMENTS_DATA.filter(a=>a.doctor==="Dr. Patel").map((a,i,arr)=>(
            <div key={a.id} style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:14, borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:46, textAlign:"right", color:C.muted, fontSize:13, fontWeight:600, flexShrink:0 }}>{a.time}</div>
              <div style={{ width:3, height:36, background:a.status==="in-progress"?C.amber:a.status==="checked-in"?C.teal:C.border, borderRadius:2, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{a.patient}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{a.duration}min · <TypeBadge type={a.type}/></div>
              </div>
              <StatusBadge status={a.status}/>
              {a.status==="checked-in" && <button style={{ fontSize:11, fontWeight:700, padding:"5px 10px", borderRadius:5, border:`1px solid ${C.navyMid}`, background:C.blueBg, color:C.navyMid, cursor:"pointer" }}>Start Visit</button>}
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, fontWeight:700, fontSize:14, color:C.text }}>Recall Alerts</div>
          {RECALLS_DATA.map((r,i)=>(
            <div key={r.id} style={{ padding:"12px 20px", borderBottom:i<RECALLS_DATA.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:3 }}>
                <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{r.patient}</div>
                <Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge>
              </div>
              <div style={{ fontSize:12, color:C.muted }}>{r.reason}</div>
              <div style={{ fontSize:11, color:r.urgency==="high"?C.red:C.muted, marginTop:2, fontWeight:r.urgency==="high"?600:400 }}>Due {fmtDate(r.due)}</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );

  // admin
  return (
    <div style={{ padding:"28px 32px", maxWidth:1100 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Good morning, {user.name}</h1>
        <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>Wednesday, February 25, 2026 · Admin Overview</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[["Total Patients","6","Active records",C.navyMid],["Today's Volume","6","Appointments booked",C.blue],["Active Staff","4","Logged in today",C.green],["Overdue Recalls","2","Requires action",C.red]].map(([l,v,s,color])=>(
          <Card key={l} style={{ padding:"18px 20px" }}>
            <div style={{ color:C.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:30, fontWeight:800, color, lineHeight:1 }}>{v}</div>
            <div style={{ color:C.muted, fontSize:12, marginTop:5 }}>{s}</div>
          </Card>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <Card>
          <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>All Appointments Today</div>
          </div>
          {APPOINTMENTS_DATA.slice(0,5).map((a,i)=>(
            <div key={a.id} style={{ padding:"11px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:i<4?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:42, color:C.muted, fontSize:12, fontWeight:600, flexShrink:0 }}>{a.time}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{a.patient}</div>
                <div style={{ fontSize:11, color:C.muted }}>{a.doctor}</div>
              </div>
              <StatusBadge status={a.status}/>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Staff Activity Today</div>
            <button onClick={()=>setPage("admin")} style={{ color:C.navyMid, fontSize:12, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>Manage →</button>
          </div>
          {STAFF_LIST.map((s,i)=>(
            <div key={s.id} style={{ padding:"11px 20px", display:"flex", alignItems:"center", gap:12, borderBottom:i<STAFF_LIST.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ width:30, height:30, borderRadius:"50%", background:s.status==="active"?C.navyMid:"#CBD5E1", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>
                {s.name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{s.name}</div>
                <div style={{ fontSize:11, color:C.muted }}>Last login: {s.lastLogin}</div>
              </div>
              <Badge color={s.status==="active"?"green":"red"}>{s.status}</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── APPOINTMENTS ───────────────────────────────────────────────────────────────
function AppointmentsPage({ user }) {
  const [appts, setAppts] = useState(APPOINTMENTS_DATA);
  const [filter, setFilter] = useState("all");
  const filtered = filter==="all" ? appts : appts.filter(a=>a.status===filter);
  const advance = (id) => {
    const order = ["scheduled","checked-in","in-progress","completed"];
    setAppts(prev=>prev.map(a=>{
      if(a.id!==id) return a;
      const idx = order.indexOf(a.status);
      return {...a, status: idx<order.length-1?order[idx+1]:a.status};
    }));
  };
  const canSchedule = PERMS[user.role].appointments;
  const actionLabel = { receptionist:"Check In / Schedule", nurse:"Check In / Triage", doctor:"Start Visit", admin:"Manage All" };
  return (
    <div style={{ padding:"28px 32px", maxWidth:1000 }}>
      <div style={{ marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Appointments</h1>
          <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>Wednesday, February 25, 2026</p>
        </div>
        {(user.role==="receptionist"||user.role==="admin") && (
          <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"9px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ New Appointment</button>
        )}
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {[["all","All"],["scheduled","Scheduled"],["checked-in","Checked In"],["in-progress","In Progress"],["completed","Completed"]].map(([id,label])=>(
          <button key={id} onClick={()=>setFilter(id)}
            style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${filter===id?C.navyMid:C.border}`, background:filter===id?C.navyMid:C.surface, color:filter===id?"#fff":C.muted, fontSize:12, fontWeight:600, cursor:"pointer" }}>
            {label}
          </button>
        ))}
      </div>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#F7F9FC" }}>
              {["Time","Patient","Type","Doctor","Duration","Status","Action"].map(h=>(
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a,i)=>(
              <tr key={a.id} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none", background:a.status==="in-progress"?"#FFFBF0":"transparent" }}>
                <td style={{ padding:"13px 16px", fontSize:13, fontWeight:700, color:C.text }}>{a.time}</td>
                <td style={{ padding:"13px 16px", fontSize:13, fontWeight:600, color:C.text }}>{a.patient}</td>
                <td style={{ padding:"13px 16px" }}><TypeBadge type={a.type}/></td>
                <td style={{ padding:"13px 16px", fontSize:13, color:C.muted }}>{a.doctor}</td>
                <td style={{ padding:"13px 16px", fontSize:13, color:C.muted }}>{a.duration}m</td>
                <td style={{ padding:"13px 16px" }}><StatusBadge status={a.status}/></td>
                <td style={{ padding:"13px 16px" }}>
                  {a.status!=="completed" && (
                    <button onClick={()=>advance(a.id)}
                      style={{ fontSize:11, fontWeight:600, padding:"5px 10px", borderRadius:5, border:`1px solid ${C.border}`, background:C.surface, color:C.navyMid, cursor:"pointer" }}>
                      {a.status==="scheduled"?"Check In":a.status==="checked-in"?"Start":a.status==="in-progress"?"Complete":"—"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── PATIENT PROFILE ────────────────────────────────────────────────────────────
function PatientProfile({ patient, onBack, user }) {
  const [tab, setTab] = useState("overview");
  const p = PERMS[user.role];
  const vitals = VITALS[patient.id];
  const rxs = PRESCRIPTIONS[patient.id]||[];
  const tabs = [
    { id:"overview",      show:true },
    { id:"vitals",        show:p.vitals },
    { id:"prescriptions", show:p.prescriptions },
    { id:"notes",         show:p.notes },
    { id:"files",         show:true },
    { id:"recalls",       show:p.recalls },
  ].filter(t=>t.show);

  return (
    <div style={{ padding:"28px 32px" }}>
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontSize:13, cursor:"pointer", padding:0, marginBottom:16 }}>← Back to Patients</button>
      <Card style={{ padding:"20px 24px", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:C.navyMid, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, flexShrink:0 }}>
            {patient.first_name[0]}{patient.last_name[0]}
          </div>
          <div style={{ flex:1 }}>
            <h2 style={{ margin:0, fontSize:20, fontWeight:700, color:C.text }}>{patient.first_name} {patient.last_name}</h2>
            <div style={{ color:C.muted, fontSize:13, marginTop:3 }}>{age(patient.dob)} yrs · {patient.gender==="F"?"Female":"Male"} · DOB {fmtDate(patient.dob)} · {patient.phone}</div>
          </div>
          {patient.allergies.length>0 ? (
            <div style={{ background:C.redBg, border:`1px solid #F5B7B1`, borderRadius:7, padding:"8px 14px" }}>
              <div style={{ color:C.red, fontSize:11, fontWeight:700, textTransform:"uppercase", marginBottom:2 }}>⚠ Allergies</div>
              <div style={{ color:C.red, fontSize:12, fontWeight:600 }}>{patient.allergies.join(", ")}</div>
            </div>
          ) : (
            <div style={{ background:C.greenBg, border:`1px solid #A7D9B5`, borderRadius:7, padding:"8px 14px" }}>
              <div style={{ color:C.green, fontSize:12, fontWeight:600 }}>✓ No Known Allergies</div>
            </div>
          )}
          <div style={{ textAlign:"right", paddingLeft:16, borderLeft:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", fontWeight:700 }}>Insurance</div>
            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginTop:3 }}>{patient.insurance}</div>
          </div>
        </div>
      </Card>
      <div style={{ display:"flex", marginBottom:16, borderBottom:`1px solid ${C.border}` }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ padding:"10px 18px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:tab===t.id?700:400, color:tab===t.id?C.navyMid:C.muted, borderBottom:tab===t.id?`2px solid ${C.navyMid}`:"2px solid transparent", marginBottom:-1, textTransform:"capitalize" }}>
            {t.id}
          </button>
        ))}
      </div>

      {tab==="overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          <Card style={{ padding:"18px 20px" }}>
            <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:14 }}>Recent Vitals</div>
            {p.vitals ? (
              vitals ? (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {[["Blood Pressure",vitals.bp,"mmHg"],["Heart Rate",vitals.hr,"bpm"],["Temperature",vitals.temp,"°F"],["O₂ Sat",vitals.o2,"%"],["Weight",vitals.weight,"lbs"],["BMI",vitals.bmi,""]].map(([l,v,u])=>(
                    <div key={l} style={{ background:C.bg, borderRadius:7, padding:"10px 12px" }}>
                      <div style={{ fontSize:11, color:C.muted, fontWeight:600, textTransform:"uppercase" }}>{l}</div>
                      <div style={{ fontSize:17, fontWeight:700, color:C.text, marginTop:2 }}>{v}<span style={{ fontSize:11, color:C.muted, fontWeight:400, marginLeft:2 }}>{u}</span></div>
                    </div>
                  ))}
                </div>
              ) : <div style={{ color:C.muted, fontSize:13 }}>No vitals recorded yet.</div>
            ) : <div style={{ color:C.muted, fontSize:13, fontStyle:"italic" }}>🔒 Vitals visible to nurses and doctors only.</div>}
          </Card>
          <Card style={{ padding:"18px 20px" }}>
            <div style={{ fontWeight:700, fontSize:13, color:C.text, marginBottom:14 }}>Active Medications</div>
            {p.prescriptions ? (
              rxs.length>0 ? rxs.map(rx=>(
                <div key={rx.id} style={{ padding:"10px 12px", background:C.bg, borderRadius:7, marginBottom:8 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{rx.med} <span style={{ color:C.muted, fontWeight:400 }}>{rx.dose}</span></div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{rx.sig} · {rx.refills} refills</div>
                </div>
              )) : <div style={{ color:C.muted, fontSize:13 }}>No active medications.</div>
            ) : <div style={{ color:C.muted, fontSize:13, fontStyle:"italic" }}>🔒 Medications visible to doctors only.</div>}
          </Card>
        </div>
      )}

      {tab==="vitals" && (
        <Card style={{ padding:"20px" }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:16 }}>Vitals History</div>
          {vitals ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:12 }}>
              {[["BP",vitals.bp,"mmHg",parseFloat(vitals.bp)>130?C.amber:C.green],["HR",vitals.hr,"bpm",C.green],["Temp",vitals.temp,"°F",C.green],["O₂",vitals.o2,"%",vitals.o2<97?C.amber:C.green],["Weight",vitals.weight,"lbs",C.text],["BMI",vitals.bmi,"",vitals.bmi>25?C.amber:C.green]].map(([l,v,u,color])=>(
                <div key={l} style={{ background:C.bg, borderRadius:8, padding:"14px", textAlign:"center" }}>
                  <div style={{ fontSize:11, color:C.muted, fontWeight:700, textTransform:"uppercase", marginBottom:8 }}>{l}</div>
                  <div style={{ fontSize:22, fontWeight:800, color }}>{v}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{u}</div>
                </div>
              ))}
            </div>
          ) : <div style={{ color:C.muted }}>No vitals recorded.</div>}
          <button style={{ marginTop:20, background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"9px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Record Vitals</button>
        </Card>
      )}

      {tab==="prescriptions" && (
        <Card style={{ padding:"20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Prescriptions</div>
            {user.role==="doctor" && <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ New Prescription</button>}
          </div>
          {rxs.length>0 ? (
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"#F7F9FC" }}>{["Medication","Dose","Instructions","Refills"].map(h=>(
                <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}</tr></thead>
              <tbody>{rxs.map((rx,i)=>(
                <tr key={rx.id} style={{ borderBottom:i<rxs.length-1?`1px solid ${C.border}`:"none" }}>
                  <td style={{ padding:"12px 14px", fontWeight:700, color:C.text }}>{rx.med}</td>
                  <td style={{ padding:"12px 14px", color:C.muted }}>{rx.dose}</td>
                  <td style={{ padding:"12px 14px", color:C.muted }}>{rx.sig}</td>
                  <td style={{ padding:"12px 14px", color:C.muted }}>{rx.refills}</td>
                </tr>
              ))}</tbody>
            </table>
          ) : <div style={{ color:C.muted, fontSize:13 }}>No prescriptions on file.</div>}
        </Card>
      )}

      {tab==="notes" && (
        <Card style={{ padding:"20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Visit Notes</div>
            {user.role==="doctor" && <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ New Note</button>}
          </div>
          <div style={{ background:C.bg, borderRadius:8, padding:"32px 20px", textAlign:"center", color:C.muted, fontSize:13 }}>No visit notes yet.</div>
        </Card>
      )}

      {tab==="files" && (
        <Card style={{ padding:"20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Documents & Files</div>
            <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ Upload</button>
          </div>
          <div style={{ border:`2px dashed ${C.border}`, borderRadius:10, padding:"40px 20px", textAlign:"center", color:C.muted, fontSize:13 }}>
            <div style={{ fontSize:28, marginBottom:8 }}>📁</div>
            No files uploaded yet. Drag & drop or click to upload.
          </div>
        </Card>
      )}

      {tab==="recalls" && (
        <Card style={{ padding:"20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Recall Flags</div>
            <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ Add Recall</button>
          </div>
          <div style={{ color:C.muted, fontSize:13 }}>No open recall flags.</div>
        </Card>
      )}
    </div>
  );
}

// ── PATIENTS PAGE ──────────────────────────────────────────────────────────────
function PatientsPage({ user }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const filtered = PATIENTS.filter(p=>`${p.first_name} ${p.last_name}`.toLowerCase().includes(search.toLowerCase()));
  if(selected) return <PatientProfile patient={selected} onBack={()=>setSelected(null)} user={user}/>;
  return (
    <div style={{ padding:"28px 32px", maxWidth:1000 }}>
      <div style={{ marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Patients</h1>
          <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>{PATIENTS.length} total patients</p>
        </div>
        {(user.role==="receptionist"||user.role==="admin") && (
          <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"9px 18px", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ New Patient</button>
        )}
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patients by name…"
        style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:14, color:C.text, outline:"none", background:C.surface, boxSizing:"border-box", marginBottom:16 }}/>
      <Card>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#F7F9FC" }}>
              {["Patient","DOB / Age","Phone","Insurance","Allergies","Last Visit",""].map(h=>(
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p,i)=>(
              <tr key={p.id} onClick={()=>setSelected(p)} style={{ borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none", cursor:"pointer" }}
                onMouseEnter={e=>e.currentTarget.style.background="#F7F9FC"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{ padding:"13px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:"50%", background:C.navyMid, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, flexShrink:0 }}>{p.first_name[0]}{p.last_name[0]}</div>
                    <div style={{ fontWeight:600, fontSize:13, color:C.text }}>{p.first_name} {p.last_name}</div>
                  </div>
                </td>
                <td style={{ padding:"13px 16px", fontSize:13, color:C.muted }}>{fmtDate(p.dob)} · {age(p.dob)} yrs</td>
                <td style={{ padding:"13px 16px", fontSize:13, color:C.muted }}>{p.phone}</td>
                <td style={{ padding:"13px 16px", fontSize:13, color:C.muted }}>{p.insurance}</td>
                <td style={{ padding:"13px 16px" }}>{p.allergies.length>0?<Badge color="red">{p.allergies.length} allerg{p.allergies.length>1?"ies":"y"}</Badge>:<span style={{ fontSize:12, color:C.muted }}>None</span>}</td>
                <td style={{ padding:"13px 16px", fontSize:13, color:C.muted }}>{fmtDate(p.lastVisit)}</td>
                <td style={{ padding:"13px 16px" }}><button style={{ fontSize:12, color:C.navyMid, fontWeight:600, background:"none", border:"none", cursor:"pointer" }}>Open →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ── RECALLS ────────────────────────────────────────────────────────────────────
function RecallsPage() {
  const [recalls, setRecalls] = useState(RECALLS_DATA);
  const [filter, setFilter] = useState("all");
  const complete = (id) => setRecalls(prev=>prev.filter(r=>r.id!==id));
  const filtered = filter==="all" ? recalls : recalls.filter(r=>r.urgency===filter);
  return (
    <div style={{ padding:"28px 32px", maxWidth:800 }}>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Recall & Follow-Up</h1>
        <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>Patients due for follow-up care</p>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {[["all","All","blue"],["high","Overdue","red"],["medium","This Week","amber"],["low","Upcoming","green"]].map(([id,label,color])=>{
          const count = id==="all"?recalls.length:recalls.filter(r=>r.urgency===id).length;
          const active = filter===id;
          const fg = {blue:C.navyMid,red:C.red,amber:C.amber,green:C.green}[color];
          const bg = {blue:C.blueBg,red:C.redBg,amber:C.amberBg,green:C.greenBg}[color];
          return (
            <button key={id} onClick={()=>setFilter(id)}
              style={{ padding:"7px 16px", borderRadius:20, border:`1px solid ${active?fg:C.border}`, background:active?bg:C.surface, color:active?fg:C.muted, fontSize:12, fontWeight:600, cursor:"pointer" }}>
              {label}{count>0&&<span style={{ marginLeft:5, background:active?fg:C.border, color:active?"#fff":C.muted, padding:"0 5px", borderRadius:8, fontSize:10 }}>{count}</span>}
            </button>
          );
        })}
      </div>
      <Card>
        {filtered.length===0 ? (
          <div style={{ padding:"48px", textAlign:"center" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>✓</div>
            <div style={{ fontWeight:600, color:C.text }}>All clear!</div>
          </div>
        ) : filtered.map((r,i)=>(
          <div key={r.id} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:16, borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none" }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:14, color:C.text }}>{r.patient}</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>{r.reason}</div>
              <div style={{ fontSize:12, color:r.urgency==="high"?C.red:C.muted, marginTop:3, fontWeight:r.urgency==="high"?600:400 }}>{r.urgency==="high"?"⚠ Overdue — ":"Due "}{fmtDate(r.due)}</div>
            </div>
            <Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge>
            <button onClick={()=>complete(r.id)} style={{ padding:"7px 14px", borderRadius:6, border:`1px solid ${C.border}`, background:C.surface, color:C.green, fontSize:12, fontWeight:600, cursor:"pointer" }}>Mark Complete</button>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ── ADMIN PAGE ─────────────────────────────────────────────────────────────────
function AdminPage() {
  const [tab, setTab] = useState("users");
  return (
    <div style={{ padding:"28px 32px", maxWidth:900 }}>
      <div style={{ marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:0 }}>Admin Panel</h1>
          <p style={{ color:C.muted, fontSize:14, marginTop:4 }}>System management</p>
        </div>
      </div>
      <div style={{ display:"flex", marginBottom:16, borderBottom:`1px solid ${C.border}` }}>
        {["users","audit log","backup"].map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{ padding:"10px 20px", border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:tab===t?700:400, color:tab===t?C.navyMid:C.muted, borderBottom:tab===t?`2px solid ${C.navyMid}`:"2px solid transparent", marginBottom:-1, textTransform:"capitalize" }}>
            {t}
          </button>
        ))}
      </div>
      {tab==="users" && (
        <Card>
          <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Staff Users</div>
            <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"7px 14px", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ Add User</button>
          </div>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead><tr style={{ background:"#F7F9FC" }}>{["Name","Role","Status","Last Login",""].map(h=>(
              <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:C.muted, textTransform:"uppercase", borderBottom:`1px solid ${C.border}` }}>{h}</th>
            ))}</tr></thead>
            <tbody>{STAFF_LIST.map((s,i)=>(
              <tr key={s.id} style={{ borderBottom:i<STAFF_LIST.length-1?`1px solid ${C.border}`:"none" }}>
                <td style={{ padding:"13px 16px", fontWeight:600, fontSize:13, color:C.text }}>{s.name}</td>
                <td style={{ padding:"13px 16px" }}><Badge color={s.role==="admin"?"purple":s.role==="doctor"?"navy":s.role==="nurse"?"green":"amber"}>{s.role}</Badge></td>
                <td style={{ padding:"13px 16px" }}><Badge color={s.status==="active"?"green":"red"}>{s.status}</Badge></td>
                <td style={{ padding:"13px 16px", fontSize:12, color:C.muted }}>{s.lastLogin}</td>
                <td style={{ padding:"13px 16px" }}><button style={{ fontSize:12, color:C.navyMid, fontWeight:600, background:"none", border:`1px solid ${C.border}`, borderRadius:5, padding:"4px 10px", cursor:"pointer" }}>Edit</button></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}
      {tab==="audit log" && (
        <Card style={{ padding:"20px" }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:16 }}>Audit Log</div>
          {[
            { user:"Dr. Patel", action:"VIEW_PATIENT", detail:"Margaret Chen", time:"09:14" },
            { user:"James Torres", action:"RECORD_VITALS", detail:"Derek Marsh", time:"09:02" },
            { user:"Brianna Wells", action:"CHECK_IN", detail:"Margaret Chen", time:"08:55" },
            { user:"admin", action:"LOGIN", detail:"", time:"08:30" },
          ].map((l,i,arr)=>(
            <div key={i} style={{ padding:"11px 0", display:"flex", alignItems:"center", gap:14, borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <div style={{ fontSize:11, color:C.muted, width:40, flexShrink:0 }}>{l.time}</div>
              <div style={{ width:130, flexShrink:0 }}>
                <Badge color="navy">{l.action}</Badge>
              </div>
              <div style={{ fontSize:13, color:C.text, flex:1 }}>{l.user}{l.detail&&<span style={{ color:C.muted }}> → {l.detail}</span>}</div>
            </div>
          ))}
        </Card>
      )}
      {tab==="backup" && (
        <Card style={{ padding:"24px" }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text, marginBottom:6 }}>Database Backup</div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>Last backup: never</div>
          <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"9px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Run Backup Now</button>
        </Card>
      )}
    </div>
  );
}

// ── SETTINGS ───────────────────────────────────────────────────────────────────
function SettingsPage() {
  const [clinicName, setClinicName] = useState("My Medical Clinic");
  const [saved, setSaved] = useState(false);
  const inp = { width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${C.border}`, fontSize:14, color:C.text, outline:"none", background:C.surface, boxSizing:"border-box" };
  const lbl = { display:"block", fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 };
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };
  return (
    <div style={{ padding:"28px 32px", maxWidth:580 }}>
      <h1 style={{ fontSize:22, fontWeight:700, color:C.text, margin:"0 0 28px" }}>Settings</h1>
      <Card style={{ marginBottom:16 }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Clinic Information</div>
        </div>
        <div style={{ padding:"20px" }}>
          <div style={{ marginBottom:16 }}><label style={lbl}>Clinic Name</label><input value={clinicName} onChange={e=>setClinicName(e.target.value)} style={inp}/></div>
          <div style={{ marginBottom:16 }}><label style={lbl}>Address</label><input placeholder="123 Main St, Suite 100" style={inp}/></div>
          <div style={{ marginBottom:20 }}><label style={lbl}>Phone</label><input placeholder="(555) 000-0000" style={inp}/></div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <button onClick={save} style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"9px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Save</button>
            {saved&&<span style={{ color:C.green, fontSize:13, fontWeight:600 }}>✓ Saved</span>}
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}` }}><div style={{ fontWeight:700, fontSize:14, color:C.text }}>Change Password</div></div>
        <div style={{ padding:"20px" }}>
          {["Current Password","New Password","Confirm New Password"].map(l=>(
            <div key={l} style={{ marginBottom:14 }}><label style={lbl}>{l}</label><input type="password" style={inp}/></div>
          ))}
          <button style={{ background:C.navyMid, color:"#fff", border:"none", borderRadius:7, padding:"9px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>Update Password</button>
        </div>
      </Card>
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const quickLogin = async (u) => {
    setLoading(true); setError("");
    await new Promise(r=>setTimeout(r,500));
    onLogin(u);
  };

  const submit = async () => {
    setLoading(true); setError("");
    await new Promise(r=>setTimeout(r,600));
    const found = DEMO_USERS.find(u=>u.username===username && u.password===password);
    if(found) { onLogin(found); }
    else { setError("Invalid username or password."); setLoading(false); }
  };

  const roleColors = { admin:C.purple, doctor:C.blue, nurse:C.green, receptionist:C.amber };
  const roleBgs = { admin:C.purpleBg, doctor:C.blueBg, nurse:C.greenBg, receptionist:C.amberBg };

  return (
    <div style={{ minHeight:"100vh", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ width:"100%", maxWidth:480 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:54, height:54, background:"#E8F0FE", borderRadius:14, display:"inline-flex", alignItems:"center", justifyContent:"center", color:C.navyMid, fontWeight:900, fontSize:26, marginBottom:14 }}>✚</div>
          <div style={{ color:"#fff", fontSize:22, fontWeight:800 }}>Clinic Manager</div>
          <div style={{ color:"rgba(255,255,255,0.45)", fontSize:13, marginTop:4 }}>Sign in to your account</div>
        </div>

        {/* Quick login cards */}
        <div style={{ marginBottom:20 }}>
          <div style={{ color:"rgba(255,255,255,0.5)", fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", textAlign:"center", marginBottom:12 }}>Quick Login — Try a Role</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {DEMO_USERS.map(u=>(
              <button key={u.username} onClick={()=>quickLogin(u)} disabled={loading}
                style={{ background:"rgba(255,255,255,0.07)", border:`1px solid rgba(255,255,255,0.12)`, borderRadius:10, padding:"12px 14px", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.2)";}}
                onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:roleBgs[u.role], display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{ROLE_ICONS[u.role]}</div>
                  <div>
                    <div style={{ color:"#fff", fontSize:13, fontWeight:700, textTransform:"capitalize" }}>{u.role}</div>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>{u.name}</div>
                  </div>
                </div>
                <div style={{ background:"rgba(0,0,0,0.2)", borderRadius:5, padding:"4px 8px", display:"inline-block" }}>
                  <span style={{ color:"rgba(255,255,255,0.5)", fontSize:10 }}>{u.username} / {u.password}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual form */}
        <div style={{ background:C.surface, borderRadius:14, padding:24 }}>
          <div style={{ fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"center", marginBottom:16 }}>Or sign in manually</div>
          {error&&<div style={{ background:C.redBg, color:C.red, padding:"10px 14px", borderRadius:7, fontSize:13, marginBottom:14 }}>{error}</div>}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)}
              style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${C.border}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
              style={{ width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${C.border}`, fontSize:14, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <button onClick={submit} disabled={loading}
            style={{ width:"100%", background:loading?"#9BB5D9":C.navyMid, color:"#fff", border:"none", borderRadius:8, padding:"11px", fontSize:14, fontWeight:700, cursor:loading?"default":"pointer" }}>
            {loading?"Signing in…":"Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");

  const handleLogin = (u) => { setUser(u); setPage("dashboard"); };
  const handleLogout = () => { setUser(null); setPage("dashboard"); };

  if(!user) return <LoginPage onLogin={handleLogin}/>;

  const p = PERMS[user.role];

  const pageComponents = {
    dashboard:    <Dashboard user={user} setPage={setPage}/>,
    appointments: p.appointments ? <AppointmentsPage user={user}/> : <LockedBanner message="You don't have permission to view appointments."/>,
    patients:     p.patients     ? <PatientsPage user={user}/>     : <LockedBanner message="You don't have permission to view patient records."/>,
    recalls:      p.recalls      ? <RecallsPage/>                  : <LockedBanner message="You don't have permission to view recalls."/>,
    admin:        p.admin        ? <AdminPage/>                    : <LockedBanner message="Admin panel is restricted to administrators only."/>,
    settings:     p.settings     ? <SettingsPage/>                 : <LockedBanner message="Settings are restricted to doctors and admins."/>,
  };

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Segoe UI', system-ui, sans-serif", overflow:"hidden" }}>
      <Sidebar page={page} setPage={setPage} user={user}/>
      <main style={{ flex:1, overflow:"auto", background:C.bg }}>
        <div style={{ display:"flex", justifyContent:"flex-end", padding:"10px 20px", background:C.surface, borderBottom:`1px solid ${C.border}` }}>
          <button onClick={handleLogout} style={{ fontSize:12, color:C.muted, background:"none", border:`1px solid ${C.border}`, borderRadius:6, padding:"5px 12px", cursor:"pointer" }}>
            ← Switch Role
          </button>
        </div>
        {pageComponents[page] || pageComponents.dashboard}
      </main>
    </div>
  );
}
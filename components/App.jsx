"use client";
import { useState, useRef, useEffect } from "react";

const DEMO_USERS = [
  { username:"admin",        password:"Admin1234!",  name:"Sandra Kim",       role:"admin",        title:"Office Administrator" },
  { username:"doctor",       password:"Doctor1234!", name:"Dr. Priya Patel",  role:"doctor",       title:"Physician, MD" },
  { username:"nurse",        password:"Nurse1234!",  name:"James Torres",     role:"nurse",        title:"Registered Nurse" },
  { username:"receptionist", password:"Recept1234!", name:"Brianna Wells",    role:"receptionist", title:"Front Desk" },
];
const INIT_PATIENTS = [
  { id:1, first_name:"Margaret", last_name:"Chen",    dob:"1968-04-12", gender:"F", phone:"555-0142", insurance:"BlueCross",   allergies:["Penicillin","Sulfa"], lastVisit:"2026-02-10", active:true  },
  { id:2, first_name:"Robert",   last_name:"Vásquez", dob:"1952-09-28", gender:"M", phone:"555-0198", insurance:"Medicare",     allergies:[],                    lastVisit:"2026-02-18", active:true  },
  { id:3, first_name:"Aisha",    last_name:"Okonkwo", dob:"1991-01-03", gender:"F", phone:"555-0277", insurance:"Aetna",        allergies:["Latex"],             lastVisit:"2026-01-30", active:true  },
  { id:4, first_name:"Derek",    last_name:"Marsh",   dob:"1985-07-19", gender:"M", phone:"555-0355", insurance:"UnitedHealth", allergies:[],                    lastVisit:"2026-02-20", active:true  },
  { id:5, first_name:"Yuki",     last_name:"Tanaka",  dob:"1977-11-05", gender:"F", phone:"555-0401", insurance:"Cigna",        allergies:["Aspirin"],           lastVisit:"2026-02-05", active:true  },
  { id:6, first_name:"Thomas",   last_name:"Reilly",  dob:"1945-03-22", gender:"M", phone:"555-0532", insurance:"Medicare",     allergies:["Codeine"],           lastVisit:"2026-02-22", active:false },
];
const INIT_LABS = {
  1:[ { id:1, name:"Complete Blood Count (CBC)", date:"2026-02-10", abnormal:false },
      { id:2, name:"Lipid Panel",                date:"2026-02-10", abnormal:false } ],
  2:[ { id:1, name:"HbA1c",                      date:"2026-01-15", abnormal:true  },
      { id:2, name:"Comprehensive Metabolic Panel",date:"2026-01-15", abnormal:false } ],
  6:[ { id:1, name:"Basic Metabolic Panel",      date:"2026-02-22", abnormal:true  } ],
};
const INIT_APPTS = [
  { id:1,  patient:"Margaret Chen",  type:"follow-up",   time:"09:00", duration:30, doctor:"Dr. Patel",    status:"checked-in",  date:"2026-02-25" },
  { id:2,  patient:"Derek Marsh",    type:"routine",     time:"09:30", duration:30, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-02-25" },
  { id:3,  patient:"Robert Vásquez", type:"urgent",      time:"10:00", duration:30, doctor:"Dr. Williams", status:"in-progress", date:"2026-02-25" },
  { id:4,  patient:"Thomas Reilly",  type:"routine",     time:"10:30", duration:30, doctor:"Dr. Williams", status:"scheduled",   date:"2026-02-25" },
  { id:5,  patient:"Aisha Okonkwo",  type:"new-patient", time:"11:00", duration:45, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-02-25" },
  { id:6,  patient:"Yuki Tanaka",    type:"procedure",   time:"14:00", duration:60, doctor:"Dr. Williams", status:"scheduled",   date:"2026-02-25" },
  { id:7,  patient:"Thomas Reilly",  type:"follow-up",   time:"09:00", duration:30, doctor:"Dr. Williams", status:"completed",   date:"2026-02-24" },
  { id:8,  patient:"Derek Marsh",    type:"routine",     time:"14:00", duration:30, doctor:"Dr. Patel",    status:"completed",   date:"2026-02-24" },
  { id:9,  patient:"Robert Vásquez", type:"follow-up",   time:"09:30", duration:30, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-02-26" },
  { id:10, patient:"Yuki Tanaka",    type:"routine",     time:"10:00", duration:30, doctor:"Dr. Williams", status:"scheduled",   date:"2026-02-26" },
  { id:11, patient:"Margaret Chen",  type:"procedure",   time:"11:00", duration:60, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-02-27" },
  { id:12, patient:"Aisha Okonkwo",  type:"new-patient", time:"10:00", duration:45, doctor:"Dr. Williams", status:"scheduled",   date:"2026-03-03" },
  { id:13, patient:"Thomas Reilly",  type:"routine",     time:"09:00", duration:30, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-03-03" },
  { id:14, patient:"Derek Marsh",    type:"follow-up",   time:"13:00", duration:30, doctor:"Dr. Williams", status:"scheduled",   date:"2026-03-05" },
];
const INIT_RECALLS = [
  { id:1, patient:"Robert Vásquez", reason:"HbA1c recheck",       due:"2026-02-20", urgency:"high",   doctor:"Dr. Patel"    },
  { id:2, patient:"Thomas Reilly",  reason:"BP medication review", due:"2026-02-24", urgency:"high",   doctor:"Dr. Williams" },
  { id:3, patient:"Yuki Tanaka",    reason:"Annual physical",      due:"2026-03-01", urgency:"medium", doctor:"Dr. Patel"    },
  { id:4, patient:"Margaret Chen",  reason:"Cholesterol panel",    due:"2026-03-10", urgency:"low",    doctor:"Dr. Williams" },
];
const INIT_CONTACT_LOGS = {
  1:[ { id:1, date:"2026-02-21", method:"Phone", outcome:"No answer — left voicemail" },
      { id:2, date:"2026-02-22", method:"Phone", outcome:"Reached patient, appointment pending" } ],
  2:[ { id:1, date:"2026-02-25", method:"Phone", outcome:"No answer" } ],
};
const INIT_VITALS = {
  1:{ bp:"122/78", hr:72, temp:98.4, o2:98, weight:148, bmi:23.1 },
  2:{ bp:"148/92", hr:84, temp:98.6, o2:96, weight:201, bmi:28.7 },
  4:{ bp:"118/74", hr:68, temp:98.2, o2:99, weight:175, bmi:24.4 },
};
const INIT_RX = {
  1:[{ id:1, med:"Lisinopril",   dose:"10mg",  sig:"Once daily",            refills:3, date:"2026-02-10" }],
  2:[{ id:2, med:"Metformin",    dose:"500mg", sig:"Twice daily with food", refills:5, date:"2026-01-15" },
     { id:3, med:"Atorvastatin", dose:"20mg",  sig:"Once daily at bedtime", refills:2, date:"2026-01-15" }],
};
const INIT_NOTES = {
  1:[{ id:1, date:"2026-02-10", doctor:"Dr. Patel", chief:"Routine follow-up for hypertension", assessment:"BP well controlled on current regimen.", plan:"Continue Lisinopril 10mg. Recheck in 3 months.", signed:true }],
};
const INIT_INACTIVE_RX = {
  2:[ { id:100, med:"Glipizide", dose:"5mg", sig:"Once daily before breakfast", refills:0, date:"2025-08-01", active:false } ],
};
const INIT_SETTINGS = {
  clinicName:"My Medical Clinic", address:"123 Main St, Springfield, IL 62701", phone:"(555) 000-0000",
  defaultDuration:30,
  clinicHours:{ Mon:["08:00","17:00"], Tue:["08:00","17:00"], Wed:["08:00","17:00"], Thu:["08:00","17:00"], Fri:["08:00","17:00"], Sat:["",""], Sun:["",""] },
  notifications:{ messages:true, recalls:true },
};
const STAFF_LIST = [
  { id:1, name:"Dr. Priya Patel",   role:"doctor",       status:"active",   lastLogin:"2026-02-25 08:14", username:"doctor" },
  { id:2, name:"Dr. Owen Williams", role:"doctor",       status:"active",   lastLogin:"2026-02-25 07:58", username:"williams" },
  { id:3, name:"James Torres",      role:"nurse",        status:"active",   lastLogin:"2026-02-25 08:02", username:"nurse" },
  { id:4, name:"Brianna Wells",     role:"receptionist", status:"active",   lastLogin:"2026-02-25 07:45", username:"receptionist" },
  { id:5, name:"Sandra Kim",        role:"admin",        status:"active",   lastLogin:"2026-02-25 08:30", username:"admin" },
  { id:6, name:"Marcus Reed",       role:"nurse",        status:"inactive", lastLogin:"2026-02-10 09:30", username:"mreed" },
];

// Seed some initial messages between staff members
// Key format: "senderUsername:recipientUsername" sorted alphabetically
const buildConvoKey = (a, b) => [a, b].sort().join(":");
const INIT_MESSAGES = {
  [buildConvoKey("doctor","nurse")]: [
    { id:1, from:"nurse",  text:"Good morning Dr. Patel! Margaret Chen is checked in and ready for vitals.", ts:"08:55", date:"2026-02-25" },
    { id:2, from:"doctor", text:"Thanks James. Please get her BP and weight first, she's on the hypertension follow-up protocol.", ts:"08:57", date:"2026-02-25" },
    { id:3, from:"nurse",  text:"On it. Her BP came back 124/80 — looking good.", ts:"09:04", date:"2026-02-25" },
    { id:4, from:"doctor", text:"Perfect, I'll head in shortly.", ts:"09:06", date:"2026-02-25" },
  ],
  [buildConvoKey("doctor","receptionist")]: [
    { id:1, from:"receptionist", text:"Hi Dr. Patel, Aisha Okonkwo called to confirm her 11am slot.", ts:"08:30", date:"2026-02-25" },
    { id:2, from:"doctor",       text:"Great, confirmed. She's a new patient so please make sure her intake forms are ready.", ts:"08:42", date:"2026-02-25" },
  ],
  [buildConvoKey("admin","nurse")]: [
    { id:1, from:"admin", text:"James, reminder that the new supply order form needs to be submitted by EOD.", ts:"08:10", date:"2026-02-25" },
    { id:2, from:"nurse", text:"Got it Sandra, I'll take care of it after morning rounds.", ts:"08:18", date:"2026-02-25" },
  ],
};

const PERMS = {
  admin:        { appointments:true,  patients:true,  vitals:true,  notes:true,  prescriptions:true,  recalls:true, admin:true,  settings:true,  messages:true, flow:true, reports:true  },
  doctor:       { appointments:true,  patients:true,  vitals:true,  notes:true,  prescriptions:true,  recalls:true, admin:false, settings:true,  messages:true, flow:true, reports:false },
  nurse:        { appointments:true,  patients:true,  vitals:true,  notes:false, prescriptions:false, recalls:true, admin:false, settings:false, messages:true, flow:true, reports:false },
  receptionist: { appointments:true,  patients:true,  vitals:false, notes:false, prescriptions:false, recalls:true, admin:false, settings:false, messages:true, flow:true, reports:false },
};
const C = {
  bg:"#F0F2F5", surface:"#FFFFFF", border:"#E2E6EB",
  navy:"#1A3A5C", navyMid:"#1E4D8C", teal:"#0E7C86",
  text:"#1A2332", muted:"#6B7A8D",
  green:"#1A8754", greenBg:"#EBF5EE",
  red:"#C0392B",   redBg:"#FDECEA",
  amber:"#B7580A", amberBg:"#FEF3E7",
  blue:"#1565C0",  blueBg:"#E8F0FE",
  purple:"#6B21A8",purpleBg:"#F3E8FF",
};
const RC = { admin:{bg:C.purpleBg,fg:C.purple}, doctor:{bg:C.blueBg,fg:C.blue}, nurse:{bg:C.greenBg,fg:C.green}, receptionist:{bg:C.amberBg,fg:C.amber} };
const RI = { admin:"⚙", doctor:"⚕", nurse:"♥", receptionist:"◉" };

function age(d){return Math.floor((new Date()-new Date(d))/31557600000);}
function fmt(d){return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}
function today(){return new Date().toISOString().split("T")[0];}
function nowTime(){return new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}

const Badge=({color="blue",children})=>{
  const m={green:[C.greenBg,C.green],red:[C.redBg,C.red],amber:[C.amberBg,C.amber],blue:[C.blueBg,C.blue],navy:["#EAF0FB",C.navyMid],teal:["#E0F4F6",C.teal],purple:[C.purpleBg,C.purple]};
  const[bg,fg]=m[color]||m.blue;
  return <span style={{background:bg,color:fg,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span>;
};
const SB=({status})=>{const m={"checked-in":["teal","Checked In"],"in-progress":["amber","In Progress"],scheduled:["blue","Scheduled"],completed:["green","Completed"],"no-show":["red","No Show"]};const[c,l]=m[status]||["blue",status];return <Badge color={c}>{l}</Badge>;};
const TB=({type})=>{const m={routine:"blue","follow-up":"teal",urgent:"red",procedure:"amber","new-patient":"green"};return <Badge color={m[type]||"blue"}>{type.replace(/-/g," ")}</Badge>;};
const Card=({children,style={}})=><div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,...style}}>{children}</div>;
const Locked=({msg})=>(
  <div style={{padding:"28px 32px"}}>
    <div style={{background:"#F7F9FC",border:`1px solid ${C.border}`,borderRadius:12,padding:"56px 32px",textAlign:"center",maxWidth:480,margin:"0 auto"}}>
      <div style={{fontSize:40,marginBottom:16}}>🔒</div>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:8}}>Access Restricted</div>
      <div style={{color:C.muted,fontSize:14}}>{msg||"Your role doesn't have access to this section."}</div>
    </div>
  </div>
);

function Modal({title,onClose,children,width=560}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
      <div style={{background:C.surface,borderRadius:14,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"18px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.surface,zIndex:1}}>
          <div style={{fontWeight:700,fontSize:16,color:C.text}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted,lineHeight:1,padding:4}}>×</button>
        </div>
        <div style={{padding:"24px"}}>{children}</div>
      </div>
    </div>
  );
}

const IS={width:"100%",padding:"9px 12px",borderRadius:7,border:`1px solid ${C.border}`,fontSize:14,color:C.text,outline:"none",background:C.surface,boxSizing:"border-box",fontFamily:"inherit"};
const SS={...IS,appearance:"none",cursor:"pointer"};
const LS={display:"block",fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6};
const FF=({label,children})=><div><label style={LS}>{label}</label>{children}</div>;
const FR=({children,cols=2})=><div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:14,marginBottom:16}}>{children}</div>;
const OK=({msg})=>(<div style={{background:C.greenBg,border:`1px solid #A7D9B5`,borderRadius:8,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>✓</span><span style={{color:C.green,fontWeight:600,fontSize:14}}>{msg}</span></div>);
const PB=({onClick,children,disabled})=>(<button onClick={onClick} disabled={disabled} style={{background:disabled?"#9BB5D9":C.navyMid,color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:700,cursor:disabled?"default":"pointer"}}>{children}</button>);
const XB=({onClick,children})=>(<button onClick={onClick} style={{background:C.surface,color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:600,cursor:"pointer"}}>{children}</button>);

// ─── Staff avatar helper ────────────────────────────────────────────────────
function StaffAvatar({ name, role, size=32, fontSize=12 }) {
  const initials = name.split(" ").filter(w => !w.startsWith("Dr.")).map(w => w[0]).join("").slice(0,2);
  const rc = RC[role] || { fg: C.navyMid };
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: rc.fg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── MESSAGES PAGE ──────────────────────────────────────────────────────────
function MessagesPage({ user, messages, setMessages }) {
  // Build contact list: all staff except the current user
  const contacts = STAFF_LIST.filter(s => s.username !== user.username);
  const [activeContact, setActiveContact] = useState(contacts[0] || null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const convoKey = activeContact ? buildConvoKey(user.username, activeContact.username) : null;
  const convo = convoKey ? (messages[convoKey] || []) : [];

  // Count unread (messages sent to me in each convo that I haven't "seen")
  // For demo purposes, messages seeded before login are treated as unread if from other person
  function getUnread(contact) {
    const key = buildConvoKey(user.username, contact.username);
    const msgs = messages[key] || [];
    return msgs.filter(m => m.from === contact.username && !m.read).length;
  }

  // Mark messages as read when opening a convo
  useEffect(() => {
    if (!convoKey) return;
    setMessages(prev => {
      const existing = prev[convoKey] || [];
      const updated = existing.map(m =>
        m.from !== user.username ? { ...m, read: true } : m
      );
      return { ...prev, [convoKey]: updated };
    });
  }, [convoKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [convo.length, activeContact]);

  const sendMessage = () => {
    if (!draft.trim() || !activeContact) return;
    const msg = {
      id: Date.now(),
      from: user.username,
      text: draft.trim(),
      ts: nowTime(),
      date: today(),
      read: false,
    };
    setMessages(prev => ({
      ...prev,
      [convoKey]: [...(prev[convoKey] || []), msg],
    }));
    setDraft("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = contacts.reduce((sum, c) => sum + getUnread(c), 0);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* ── Contact list ── */}
      <div style={{
        width: 280, flexShrink: 0, borderRight: `1px solid ${C.border}`,
        background: C.surface, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 18px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Messages</div>
            {totalUnread > 0 && (
              <span style={{
                background: C.navyMid, color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "1px 7px", borderRadius: 10,
              }}>{totalUnread}</span>
            )}
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search staff…"
            style={{
              width: "100%", padding: "7px 12px", borderRadius: 7, border: `1px solid ${C.border}`,
              fontSize: 13, color: C.text, outline: "none", background: C.bg,
              boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
        </div>

        {/* Contact list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredContacts.map(contact => {
            const key = buildConvoKey(user.username, contact.username);
            const msgs = messages[key] || [];
            const lastMsg = msgs[msgs.length - 1];
            const unread = getUnread(contact);
            const isActive = activeContact?.id === contact.id;

            return (
              <button
                key={contact.id}
                onClick={() => { setActiveContact(contact); setDraft(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%",
                  padding: "12px 18px", border: "none", cursor: "pointer", textAlign: "left",
                  background: isActive ? C.bg : "transparent",
                  borderLeft: isActive ? `3px solid ${C.navyMid}` : "3px solid transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F7F9FC"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <StaffAvatar name={contact.name} role={contact.role} size={38} fontSize={13} />
                  {contact.status === "active" && (
                    <div style={{
                      position: "absolute", bottom: 0, right: 0,
                      width: 10, height: 10, borderRadius: "50%",
                      background: C.green, border: "2px solid #fff",
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <div style={{ fontWeight: unread > 0 ? 700 : 600, fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
                      {contact.name}
                    </div>
                    {lastMsg && (
                      <div style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 4 }}>{lastMsg.ts}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                      {lastMsg
                        ? (lastMsg.from === user.username ? `You: ${lastMsg.text}` : lastMsg.text)
                        : <span style={{ fontStyle: "italic" }}>No messages yet</span>}
                    </div>
                    {unread > 0 && (
                      <span style={{
                        background: C.navyMid, color: "#fff", fontSize: 10, fontWeight: 700,
                        padding: "1px 6px", borderRadius: 10, flexShrink: 0, marginLeft: 4,
                      }}>{unread}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Conversation panel ── */}
      {activeContact ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg }}>
          {/* Convo header */}
          <div style={{
            padding: "14px 24px", background: C.surface, borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
          }}>
            <div style={{ position: "relative" }}>
              <StaffAvatar name={activeContact.name} role={activeContact.role} size={40} fontSize={14} />
              {activeContact.status === "active" && (
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 11, height: 11, borderRadius: "50%",
                  background: C.green, border: "2px solid #fff",
                }} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{activeContact.name}</div>
              <div style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ textTransform: "capitalize" }}>{activeContact.role}</span>
                <span>·</span>
                <span style={{ color: activeContact.status === "active" ? C.green : C.muted, fontWeight: 600 }}>
                  {activeContact.status === "active" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            {convo.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.muted }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>No messages yet</div>
                <div style={{ fontSize: 13 }}>Send a message to {activeContact.name.split(" ")[0]}</div>
              </div>
            ) : (
              <>
                {/* Group messages by date */}
                {(() => {
                  const groups = [];
                  let lastDate = null;
                  convo.forEach((msg, idx) => {
                    if (msg.date !== lastDate) {
                      groups.push({ type: "date", date: msg.date, key: "d-" + idx });
                      lastDate = msg.date;
                    }
                    groups.push({ type: "msg", msg, key: "m-" + msg.id });
                  });
                  return groups.map(item => {
                    if (item.type === "date") {
                      const label = item.date === today() ? "Today" : fmt(item.date);
                      return (
                        <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0 8px" }}>
                          <div style={{ flex: 1, height: 1, background: C.border }} />
                          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</div>
                          <div style={{ flex: 1, height: 1, background: C.border }} />
                        </div>
                      );
                    }
                    const { msg } = item;
                    const isMine = msg.from === user.username;
                    const sender = STAFF_LIST.find(s => s.username === msg.from);
                    return (
                      <div key={item.key} style={{
                        display: "flex", flexDirection: isMine ? "row-reverse" : "row",
                        alignItems: "flex-end", gap: 8, marginBottom: 6,
                      }}>
                        {!isMine && sender && (
                          <StaffAvatar name={sender.name} role={sender.role} size={28} fontSize={10} />
                        )}
                        <div style={{ maxWidth: "65%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", gap: 3 }}>
                          {!isMine && sender && (
                            <div style={{ fontSize: 11, color: C.muted, marginLeft: 2, fontWeight: 600 }}>
                              {sender.name.split(" ")[0]}
                            </div>
                          )}
                          <div style={{
                            padding: "9px 14px",
                            borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: isMine ? C.navyMid : C.surface,
                            color: isMine ? "#fff" : C.text,
                            fontSize: 13, lineHeight: 1.5,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            border: isMine ? "none" : `1px solid ${C.border}`,
                            wordBreak: "break-word",
                          }}>
                            {msg.text}
                          </div>
                          <div style={{ fontSize: 10, color: C.muted, paddingLeft: 2, paddingRight: 2 }}>{msg.ts}</div>
                        </div>
                      </div>
                    );
                  });
                })()}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input bar */}
          <div style={{
            padding: "14px 24px", background: C.surface, borderTop: `1px solid ${C.border}`,
            display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${activeContact.name.split(" ")[0]}… (Enter to send)`}
              rows={1}
              style={{
                flex: 1, padding: "10px 14px", borderRadius: 22,
                border: `1px solid ${C.border}`, fontSize: 13, color: C.text,
                outline: "none", resize: "none", fontFamily: "inherit",
                background: C.bg, lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
              }}
              onInput={e => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              style={{
                width: 40, height: 40, borderRadius: "50%", border: "none",
                background: draft.trim() ? C.navyMid : C.border,
                color: "#fff", fontSize: 16, cursor: draft.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.15s",
              }}
            >↑</button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, color: C.muted, flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 40 }}>💬</div>
          <div style={{ fontWeight: 600 }}>Select a conversation</div>
        </div>
      )}
    </div>
  );
}

function NewApptModal({onClose,onSave,patients,defaultDate,appts=[],prefillTime}){
  const[f,sf]=useState({pid:"",date:defaultDate||today(),time:prefillTime||"09:00",dur:"30",doc:"Dr. Patel",type:"routine",notes:""});
  const[ok,sok]=useState(false);
  const[conflict,setConflict]=useState(null);
  const[forceOk,setForceOk]=useState(false);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setConflict(null);setForceOk(false);};
  const checkConflict=()=>{
    const [sh,sm]=f.time.split(":").map(Number);
    const startMin=sh*60+sm;const endMin=startMin+parseInt(f.dur);
    return appts.find(a=>{
      if(a.date!==f.date||a.doctor!==f.doc||a.status==="no-show"||a.status==="completed")return false;
      const[ah,am]=a.time.split(":").map(Number);
      const aStart=ah*60+am;const aEnd=aStart+a.duration;
      return startMin<aEnd&&endMin>aStart;
    });
  };
  const sub=()=>{
    if(!f.pid)return;
    if(!forceOk){const c=checkConflict();if(c){setConflict(c);return;}}
    const pt=patients.find(p=>p.id===parseInt(f.pid));
    onSave({id:Date.now(),patient:`${pt.first_name} ${pt.last_name}`,type:f.type,time:f.time,duration:parseInt(f.dur),doctor:f.doc,status:"scheduled",date:f.date});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title="New Appointment" onClose={onClose}>
      {ok&&<OK msg="Appointment scheduled!"/>}
      <FR cols={1}><FF label="Patient *"><select value={f.pid} onChange={e=>s("pid",e.target.value)} style={SS}><option value="">Select a patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}</select></FF></FR>
      <FR><FF label="Date"><input type="date" value={f.date} onChange={e=>s("date",e.target.value)} style={IS}/></FF><FF label="Time"><input type="time" value={f.time} onChange={e=>s("time",e.target.value)} style={IS}/></FF></FR>
      <FR>
        <FF label="Doctor"><select value={f.doc} onChange={e=>s("doc",e.target.value)} style={SS}><option>Dr. Patel</option><option>Dr. Williams</option></select></FF>
        <FF label="Duration"><select value={f.dur} onChange={e=>s("dur",e.target.value)} style={SS}><option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option></select></FF>
      </FR>
      <FR cols={1}><FF label="Appointment Type"><select value={f.type} onChange={e=>s("type",e.target.value)} style={SS}><option value="routine">Routine</option><option value="follow-up">Follow-up</option><option value="urgent">Urgent</option><option value="new-patient">New Patient</option><option value="procedure">Procedure</option></select></FF></FR>
      <FR cols={1}><FF label="Notes (optional)"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={3} placeholder="Reason for visit or special instructions…" style={{...IS,resize:"vertical"}}/></FF></FR>
      {conflict&&!forceOk&&(
        <div style={{background:C.amberBg,border:`1px solid #F5C07A`,borderRadius:8,padding:"12px 16px",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:C.amber,marginBottom:4}}>⚠ Scheduling Conflict</div>
          <div style={{fontSize:13,color:C.text,marginBottom:10}}>{f.doc} already has <strong>{conflict.patient}</strong> at {conflict.time} on this date.</div>
          <button onClick={()=>setForceOk(true)} style={{fontSize:12,fontWeight:700,color:C.amber,background:"none",border:`1px solid ${C.amber}`,borderRadius:6,padding:"5px 12px",cursor:"pointer"}}>Book Anyway</button>
        </div>
      )}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.pid||ok}>Schedule Appointment</PB></div>
    </Modal>
  );
}

function NewPatientModal({onClose,onSave}){
  const[f,sf]=useState({fn:"",ln:"",dob:"",gender:"",phone:"",email:"",address:"",ins:"",ins_id:"",ec_name:"",ec_phone:"",allergies:""});
  const[ok,sok]=useState(false);
  const s=(k,v)=>sf(p=>({...p,[k]:v}));
  const sub=()=>{
    if(!f.fn||!f.ln||!f.dob)return;
    onSave({id:Date.now(),first_name:f.fn,last_name:f.ln,dob:f.dob,gender:f.gender,phone:f.phone,insurance:f.ins,allergies:f.allergies?f.allergies.split(",").map(a=>a.trim()).filter(Boolean):[],lastVisit:today()});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title="New Patient Registration" onClose={onClose} width={640}>
      {ok&&<OK msg="Patient registered successfully!"/>}
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Personal Information</div>
      <FR><FF label="First Name *"><input value={f.fn} onChange={e=>s("fn",e.target.value)} style={IS} placeholder="Jane"/></FF><FF label="Last Name *"><input value={f.ln} onChange={e=>s("ln",e.target.value)} style={IS} placeholder="Doe"/></FF></FR>
      <FR><FF label="Date of Birth *"><input type="date" value={f.dob} onChange={e=>s("dob",e.target.value)} style={IS}/></FF><FF label="Gender"><select value={f.gender} onChange={e=>s("gender",e.target.value)} style={SS}><option value="">Select…</option><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option></select></FF></FR>
      <FR><FF label="Phone"><input value={f.phone} onChange={e=>s("phone",e.target.value)} style={IS} placeholder="555-0100"/></FF><FF label="Email"><input type="email" value={f.email} onChange={e=>s("email",e.target.value)} style={IS} placeholder="jane@email.com"/></FF></FR>
      <FR cols={1}><FF label="Address"><input value={f.address} onChange={e=>s("address",e.target.value)} style={IS} placeholder="123 Main St, City, ST 00000"/></FF></FR>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",margin:"20px 0 12px"}}>Insurance</div>
      <FR><FF label="Insurance Provider"><input value={f.ins} onChange={e=>s("ins",e.target.value)} style={IS} placeholder="BlueCross, Medicare…"/></FF><FF label="Member ID"><input value={f.ins_id} onChange={e=>s("ins_id",e.target.value)} style={IS}/></FF></FR>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",margin:"20px 0 12px"}}>Emergency Contact</div>
      <FR><FF label="Name"><input value={f.ec_name} onChange={e=>s("ec_name",e.target.value)} style={IS}/></FF><FF label="Phone"><input value={f.ec_phone} onChange={e=>s("ec_phone",e.target.value)} style={IS}/></FF></FR>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",margin:"20px 0 12px"}}>Clinical</div>
      <FR cols={1}><FF label="Known Allergies (comma-separated)"><input value={f.allergies} onChange={e=>s("allergies",e.target.value)} style={IS} placeholder="Penicillin, Sulfa, Latex…"/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.fn||!f.ln||!f.dob||ok}>Register Patient</PB></div>
    </Modal>
  );
}

function VitalsModal({patient,onClose,onSave}){
  const[f,sf]=useState({sys:"",dia:"",hr:"",temp:"",wt:"",ht:"",o2:"",notes:""});
  const[ok,sok]=useState(false);
  const s=(k,v)=>sf(p=>({...p,[k]:v}));
  const bmi=f.wt&&f.ht?((parseInt(f.wt)/(parseInt(f.ht)**2))*703).toFixed(1):null;
  const sub=()=>{
    onSave(patient.id,{bp:`${f.sys}/${f.dia}`,hr:parseInt(f.hr),temp:parseFloat(f.temp),o2:parseInt(f.o2),weight:parseInt(f.wt),bmi:parseFloat(bmi)||0});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title={`Record Vitals — ${patient.first_name} ${patient.last_name}`} onClose={onClose} width={520}>
      {ok&&<OK msg="Vitals recorded!"/>}
      {patient.allergies.length>0&&<div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}><span>⚠</span><span style={{color:C.red,fontSize:13,fontWeight:600}}>Allergies: {patient.allergies.join(", ")}</span></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        <div><label style={LS}>Systolic</label><input value={f.sys} onChange={e=>s("sys",e.target.value)} style={IS} placeholder="120" type="number"/></div>
        <div><label style={LS}>Diastolic</label><input value={f.dia} onChange={e=>s("dia",e.target.value)} style={IS} placeholder="80" type="number"/></div>
        <div><label style={LS}>Heart Rate</label><input value={f.hr} onChange={e=>s("hr",e.target.value)} style={IS} placeholder="72" type="number"/></div>
      </div>
      <FR><FF label="Temperature °F"><input value={f.temp} onChange={e=>s("temp",e.target.value)} style={IS} placeholder="98.6" type="number" step="0.1"/></FF><FF label="O₂ Sat %"><input value={f.o2} onChange={e=>s("o2",e.target.value)} style={IS} placeholder="98" type="number"/></FF></FR>
      <FR><FF label="Weight (lbs)"><input value={f.wt} onChange={e=>s("wt",e.target.value)} style={IS} placeholder="160" type="number"/></FF><FF label="Height (inches)"><input value={f.ht} onChange={e=>s("ht",e.target.value)} style={IS} placeholder="65" type="number"/></FF></FR>
      {bmi&&<div style={{background:C.bg,borderRadius:8,padding:"12px 16px",marginBottom:16,display:"flex",gap:20,alignItems:"center"}}><div><div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>BMI</div><div style={{fontSize:24,fontWeight:800,color:parseFloat(bmi)>30?C.red:parseFloat(bmi)>25?C.amber:C.green}}>{bmi}</div></div><div style={{fontSize:12,color:C.muted}}>{parseFloat(bmi)<18.5?"Underweight":parseFloat(bmi)<25?"Normal weight":parseFloat(bmi)<30?"Overweight":"Obese"}</div></div>}
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.sys||!f.dia||!f.hr||ok}>Save Vitals</PB></div>
    </Modal>
  );
}

function RxModal({patient,onClose,onSave}){
  const[f,sf]=useState({med:"",dose:"",sig:"",qty:"",refills:"0",notes:""});
  const[ok,sok]=useState(false);
  const s=(k,v)=>sf(p=>({...p,[k]:v}));
  const drugs=["Amoxicillin","Metformin","Lisinopril","Atorvastatin","Omeprazole","Levothyroxine","Amlodipine","Metoprolol","Gabapentin","Sertraline"];
  const sub=()=>{
    if(!f.med||!f.dose)return;
    onSave(patient.id,{id:Date.now(),med:f.med,dose:f.dose,sig:f.sig,refills:parseInt(f.refills),date:today()});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title={`New Prescription — ${patient.first_name} ${patient.last_name}`} onClose={onClose} width={560}>
      {ok&&<OK msg="Prescription saved!"/>}
      {patient.allergies.length>0&&<div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}><span>⚠</span><span style={{color:C.red,fontSize:13,fontWeight:600}}>Allergies on file: {patient.allergies.join(", ")}</span></div>}
      <FR cols={1}><FF label="Medication Name *"><input value={f.med} onChange={e=>s("med",e.target.value)} style={IS} placeholder="Start typing or pick below…" list="dl"/><datalist id="dl">{drugs.map(d=><option key={d} value={d}/>)}</datalist></FF></FR>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{drugs.slice(0,6).map(d=><button key={d} onClick={()=>s("med",d)} style={{fontSize:11,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:f.med===d?C.blueBg:C.bg,color:f.med===d?C.blue:C.muted,cursor:"pointer",fontWeight:600}}>{d}</button>)}</div>
      <FR><FF label="Dose *"><input value={f.dose} onChange={e=>s("dose",e.target.value)} style={IS} placeholder="500mg"/></FF><FF label="Quantity"><input value={f.qty} onChange={e=>s("qty",e.target.value)} style={IS} placeholder="30 tablets"/></FF></FR>
      <FR cols={1}><FF label="Instructions"><input value={f.sig} onChange={e=>s("sig",e.target.value)} style={IS} placeholder="Take once daily with food…"/></FF></FR>
      <FR cols={1}><FF label="Refills"><select value={f.refills} onChange={e=>s("refills",e.target.value)} style={SS}>{[0,1,2,3,5,11].map(n=><option key={n} value={n}>{n} refill{n!==1?"s":""}</option>)}</select></FF></FR>
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}} placeholder="Additional instructions…"/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.med||!f.dose||ok}>Save Prescription</PB></div>
    </Modal>
  );
}

function NoteModal({patient,onClose,onSave}){
  const[f,sf]=useState({chief:"",subj:"",obj:"",assess:"",plan:"",sign:false});
  const[ok,sok]=useState(false);
  const s=(k,v)=>sf(p=>({...p,[k]:v}));
  const sub=()=>{
    if(!f.chief||!f.assess)return;
    onSave(patient.id,{id:Date.now(),date:today(),doctor:"Dr. Patel",chief:f.chief,assessment:f.assess,plan:f.plan,signed:f.sign});
    sok(true);setTimeout(onClose,1500);
  };
  const soap=[
    {key:"subj",label:"S — Subjective",hint:"What the patient tells you",ph:"Patient's description of symptoms, history…"},
    {key:"obj", label:"O — Objective", hint:"What you observe/measure",    ph:"Exam findings, vitals, lab results…"},
    {key:"assess",label:"A — Assessment *",hint:"Clinical interpretation",  ph:"Diagnosis or differential diagnoses…"},
    {key:"plan",label:"P — Plan",         hint:"What happens next",         ph:"Treatment, referrals, follow-up…"},
  ];
  return(
    <Modal title={`Visit Note — ${patient.first_name} ${patient.last_name}`} onClose={onClose} width={680}>
      {ok&&<OK msg={f.sign?"Note signed and locked!":"Note saved as draft!"}/>}
      <FR cols={1}><FF label="Chief Complaint *"><input value={f.chief} onChange={e=>s("chief",e.target.value)} style={IS} placeholder="e.g. Follow-up for hypertension, chest pain x 2 days…"/></FF></FR>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        {soap.map(sec=>(
          <div key={sec.key}>
            <div style={{marginBottom:6}}>
              <label style={{...LS,display:"inline"}}>{sec.label}</label>
              <span style={{fontSize:11,color:C.muted,marginLeft:8,fontStyle:"italic",textTransform:"none",letterSpacing:"normal"}}>{sec.hint}</span>
            </div>
            <textarea value={f[sec.key]} onChange={e=>s(sec.key,e.target.value)} rows={4} placeholder={sec.ph} style={{...IS,resize:"vertical",fontSize:13}}/>
          </div>
        ))}
      </div>
      <div style={{background:f.sign?C.amberBg:C.bg,border:`1px solid ${f.sign?"#F5C07A":C.border}`,borderRadius:8,padding:"14px 16px",marginBottom:20}}>
        <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
          <input type="checkbox" checked={f.sign} onChange={e=>s("sign",e.target.checked)} style={{width:16,height:16,cursor:"pointer"}}/>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:f.sign?C.amber:C.text}}>Sign &amp; Lock Note</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Once signed, this note cannot be edited.</div>
          </div>
        </label>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
        <XB onClick={onClose}>Cancel</XB>
        <button onClick={sub} disabled={!f.chief||!f.assess||ok}
          style={{background:f.sign?(ok?"#9BB5D9":C.amber):(ok?"#9BB5D9":C.navyMid),color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          {f.sign?"Sign &amp; Lock":"Save Draft"}
        </button>
      </div>
    </Modal>
  );
}

function RecallModal({onClose,onSave,patients}){
  const[f,sf]=useState({pid:"",reason:"",due:"",urgency:"medium",notes:""});
  const[ok,sok]=useState(false);
  const s=(k,v)=>sf(p=>({...p,[k]:v}));
  const reasons=["Annual physical","HbA1c recheck","BP medication review","Cholesterol panel","Mammogram due","Colonoscopy screening","Flu vaccine","Wound check","Lab results review"];
  const sub=()=>{
    if(!f.pid||!f.reason||!f.due)return;
    const pt=patients.find(p=>p.id===parseInt(f.pid));
    onSave({id:Date.now(),patient:`${pt.first_name} ${pt.last_name}`,reason:f.reason,due:f.due,urgency:f.urgency});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title="Add Recall Flag" onClose={onClose} width={520}>
      {ok&&<OK msg="Recall flag added!"/>}
      <FR cols={1}><FF label="Patient *"><select value={f.pid} onChange={e=>s("pid",e.target.value)} style={SS}><option value="">Select a patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}</select></FF></FR>
      <FR cols={1}><FF label="Reason *"><input value={f.reason} onChange={e=>s("reason",e.target.value)} style={IS} placeholder="e.g. Annual physical…" list="rl"/><datalist id="rl">{reasons.map(r=><option key={r} value={r}/>)}</datalist></FF></FR>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{reasons.slice(0,5).map(r=><button key={r} onClick={()=>s("reason",r)} style={{fontSize:11,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:f.reason===r?C.blueBg:C.bg,color:f.reason===r?C.blue:C.muted,cursor:"pointer",fontWeight:600}}>{r}</button>)}</div>
      <FR><FF label="Due Date *"><input type="date" value={f.due} onChange={e=>s("due",e.target.value)} style={IS}/></FF><FF label="Urgency"><select value={f.urgency} onChange={e=>s("urgency",e.target.value)} style={SS}><option value="low">Low — Upcoming</option><option value="medium">Medium — This week</option><option value="high">High — Overdue/Urgent</option></select></FF></FR>
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.pid||!f.reason||!f.due||ok}>Add Recall</PB></div>
    </Modal>
  );
}

function Sidebar({page,setPage,user,recallCount,unreadMsgCount}){
  const p=PERMS[user.role];const rc=RC[user.role];
  const nav=[
    {id:"dashboard",  icon:"▦", label:"Dashboard",    show:true},
    {id:"appointments",icon:"◷",label:"Appointments", show:p.appointments},
    {id:"flow",       icon:"⊞", label:"Patient Flow", show:p.flow},
    {id:"patients",   icon:"◉", label:"Patients",     show:p.patients},
    {id:"recalls",    icon:"◎", label:"Recalls",      show:p.recalls,   badge:recallCount},
    {id:"messages",   icon:"✉", label:"Messages",     show:p.messages,  badge:unreadMsgCount},
    {id:"reports",    icon:"▣", label:"Reports",      show:p.reports},
    {id:"admin",      icon:"⚙", label:"Admin Panel",  show:p.admin},
    {id:"settings",   icon:"≡", label:"Settings",     show:p.settings},
  ].filter(n=>n.show);
  return(
    <div style={{width:220,background:C.navy,display:"flex",flexDirection:"column",height:"100%",flexShrink:0}}>
      <div style={{padding:"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:"#E8F0FE",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.navyMid,fontWeight:900,fontSize:17}}>✚</div>
          <div><div style={{color:"#fff",fontWeight:700,fontSize:13}}>Clinic Manager</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>v1.0</div></div>
        </div>
      </div>
      <div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{background:rc.bg,borderRadius:6,padding:"5px 10px",display:"inline-flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:12}}>{RI[user.role]}</span>
          <span style={{color:rc.fg,fontSize:11,fontWeight:700,textTransform:"capitalize"}}>{user.role}</span>
        </div>
      </div>
      <nav style={{flex:1,padding:"10px"}}>
        {nav.map(n=>{const a=page===n.id;return(
          <button key={n.id} onClick={()=>setPage(n.id)}
            style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:7,border:"none",cursor:"pointer",marginBottom:2,background:a?"rgba(255,255,255,0.12)":"transparent",color:a?"#fff":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:a?600:400,textAlign:"left"}}>
            <span style={{fontSize:14}}>{n.icon}</span>
            <span style={{flex:1}}>{n.label}</span>
            {n.badge>0&&<span style={{background:n.id==="messages"?C.teal:C.red,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:10}}>{n.badge}</span>}
          </button>
        );})}
      </nav>
      <div style={{padding:"14px 16px",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:rc.fg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,flexShrink:0}}>
            {user.name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2)}
          </div>
          <div><div style={{color:"#fff",fontSize:12,fontWeight:600}}>{user.name}</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>{user.title}</div></div>
        </div>
      </div>
    </div>
  );
}

function FlowWidget({appts,setPage}){
  const TODAY="2026-02-25";
  const todayAppts=appts.filter(a=>(a.date||TODAY)===TODAY);
  const COLS=[{id:"scheduled",label:"Scheduled",color:C.blue},{id:"checked-in",label:"Checked In",color:C.teal},{id:"in-progress",label:"With Provider",color:C.amber},{id:"completed",label:"Done",color:C.green}];
  return(
    <Card style={{marginBottom:16}}>
      <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Patient Flow — Today</div><button onClick={()=>setPage("flow")} style={{color:C.navyMid,fontSize:12,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>Full board →</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"16px 20px",gap:12}}>
        {COLS.map(col=>{
          const cnt=todayAppts.filter(a=>a.status===col.id).length;
          return(
            <div key={col.id} style={{background:col.color+"12",borderRadius:8,padding:"12px",border:`1px solid ${col.color}30`,textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,color:col.color,lineHeight:1}}>{cnt}</div>
              <div style={{fontSize:11,color:col.color,fontWeight:600,marginTop:4}}>{col.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function UpcomingWidget({appts}){
  const NEXT="2026-02-26";
  const nextDayAppts=appts.filter(a=>(a.date||"2026-02-25")===NEXT).slice(0,3);
  if(!nextDayAppts.length)return null;
  return(
    <Card>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Tomorrow's First Appointments</div>
      {nextDayAppts.map((a,i,arr)=>(
        <div key={a.id} style={{padding:"11px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{width:42,color:C.muted,fontSize:12,fontWeight:700,flexShrink:0}}>{a.time}</div>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:11,color:C.muted}}>{a.doctor} · {a.type.replace(/-/g," ")}</div></div>
          <TB type={a.type}/>
        </div>
      ))}
    </Card>
  );
}

function Dashboard({user,setPage,appts,recalls}){
  const r=user.role;
  const TODAY="2026-02-25";
  const todayAppts=appts.filter(a=>(a.date||TODAY)===TODAY);
  const checkedIn=todayAppts.filter(a=>a.status==="checked-in");
  const inProg=todayAppts.filter(a=>a.status==="in-progress");
  const noShows=todayAppts.filter(a=>a.status==="no-show");
  const overdue=recalls.filter(r=>r.urgency==="high");

  if(r==="receptionist")return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Good morning, {user.name}</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · Front Desk View</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[["Today's Appointments",todayAppts.length,"Booked",C.navyMid],["Checked In",checkedIn.length,"In waiting room",C.teal],["No-Shows",noShows.length,"Need follow-up",C.red],["Overdue Recalls",overdue.length,"Need scheduling",C.amber]].map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <FlowWidget appts={appts} setPage={setPage}/>
      <UpcomingWidget appts={appts}/>
    </div>
  );

  if(r==="nurse")return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Good morning, {user.name}</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · Nursing View</p></div>
      {checkedIn.length>0&&<div style={{background:C.amberBg,border:`1px solid #F5C07A`,borderRadius:10,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:18}}>⚠</span><div><div style={{fontWeight:700,fontSize:13,color:C.amber}}>{checkedIn.length} patient{checkedIn.length>1?"s":""} waiting for vitals</div><div style={{fontSize:12,color:C.amber,marginTop:2}}>{checkedIn.map(a=>a.patient).join(", ")}</div></div></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[["Checked In",checkedIn.length,"Awaiting vitals",C.teal],["In Progress",inProg.length,"With physician",C.amber],["No-Shows",noShows.length,"Today",C.red],["Scheduled",todayAppts.filter(a=>a.status==="scheduled").length,"Still arriving",C.blue]].map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <FlowWidget appts={appts} setPage={setPage}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Ready for Vitals</div>{todayAppts.filter(a=>["checked-in","scheduled"].includes(a.status)).slice(0,3).map((a,i,arr)=>(
          <div key={a.id} style={{padding:"13px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:12,color:C.muted,marginTop:1}}>{a.time}</div></div><SB status={a.status}/></div>
        ))}</Card>
        <Card><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Overdue Recalls</div>{overdue.length>0?overdue.map((r,i,arr)=>(
          <div key={r.id} style={{padding:"13px 20px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.patient}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{r.reason}</div><div style={{fontSize:11,color:C.red,marginTop:2,fontWeight:600}}>Overdue since {fmt(r.due)}</div></div>
        )):<div style={{padding:"20px",color:C.muted,fontSize:13}}>No overdue recalls. ✓</div>}</Card>
      </div>
    </div>
  );

  if(r==="doctor")return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Good morning, {user.name}</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · {todayAppts.filter(a=>a.doctor==="Dr. Patel").length} patients today</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[["My Patients",todayAppts.filter(a=>a.doctor==="Dr. Patel").length,"Today",C.navyMid],["In Progress",inProg.length,"With you now",C.amber],["No-Shows",noShows.length,"Today",C.red],["Overdue Recalls",overdue.length,"",C.amber]].map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16,marginBottom:16}}>
        <Card>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>My Schedule</div><button onClick={()=>setPage("appointments")} style={{color:C.navyMid,fontSize:12,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>View all →</button></div>
          {todayAppts.filter(a=>a.doctor==="Dr. Patel").map((a,i,arr)=>(
            <div key={a.id} style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{width:46,textAlign:"right",color:C.muted,fontSize:13,fontWeight:600,flexShrink:0}}>{a.time}</div>
              <div style={{width:3,height:36,background:a.status==="in-progress"?C.amber:a.status==="checked-in"?C.teal:C.border,borderRadius:2,flexShrink:0}}/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:12,color:C.muted,marginTop:1}}>{a.duration}min · <TB type={a.type}/></div></div>
              <SB status={a.status}/>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Recall Alerts</div>
          {recalls.map((r,i)=>(<div key={r.id} style={{padding:"12px 20px",borderBottom:i<recalls.length-1?`1px solid ${C.border}`:"none"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.patient}</div><Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge></div><div style={{fontSize:12,color:C.muted}}>{r.reason}</div><div style={{fontSize:11,color:r.urgency==="high"?C.red:C.muted,marginTop:2,fontWeight:r.urgency==="high"?600:400}}>Due {fmt(r.due)}</div></div>))}
          {recalls.length===0&&<div style={{padding:"20px",color:C.muted,fontSize:13}}>No open recalls. ✓</div>}
        </Card>
      </div>
      <UpcomingWidget appts={appts}/>
    </div>
  );

  return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Good morning, {user.name}</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · Admin Overview</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[["Total Patients","6","Active records",C.navyMid],["Today's Volume",todayAppts.length,"Appointments",C.blue],["No-Shows",noShows.length,"Today",C.red],["Open Recalls",recalls.length,"",C.amber]].map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <FlowWidget appts={appts} setPage={setPage}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>All Appointments Today</div>
          {todayAppts.slice(0,5).map((a,i)=>(<div key={a.id} style={{padding:"11px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:i<4?`1px solid ${C.border}`:"none"}}><div style={{width:42,color:C.muted,fontSize:12,fontWeight:600,flexShrink:0}}>{a.time}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:11,color:C.muted}}>{a.doctor}</div></div><SB status={a.status}/></div>))}
        </Card>
        <Card>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Staff Activity</div></div>
          {STAFF_LIST.map((s,i)=>(<div key={s.id} style={{padding:"11px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:i<STAFF_LIST.length-1?`1px solid ${C.border}`:"none"}}><div style={{width:30,height:30,borderRadius:"50%",background:s.status==="active"?C.navyMid:"#CBD5E1",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{s.name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2)}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{s.name}</div><div style={{fontSize:11,color:C.muted}}>{s.lastLogin}</div></div><Badge color={s.status==="active"?"green":"red"}>{s.status}</Badge></div>))}
        </Card>
      </div>
      <UpcomingWidget appts={appts}/>
    </div>
  );
}

// ─── Calendar helpers ─────────────────────────────────────────────────────────
function getWeekDates(dateStr){
  const d=new Date(dateStr+"T12:00:00");
  const day=d.getDay();
  const mon=new Date(d);mon.setDate(d.getDate()-(day===0?6:day-1));
  return Array.from({length:5},(_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return x.toISOString().split("T")[0];});
}

function CalendarDayView({appts,selectedDate,onSlotClick,canAdd}){
  const HOUR_H=64,START=8,END=18;
  const hours=Array.from({length:END-START},(_,i)=>START+i);
  const TYPE_C={routine:C.blue,"follow-up":C.teal,urgent:C.red,procedure:C.amber,"new-patient":C.green};
  const top=(t)=>{const[h,m]=t.split(":").map(Number);return((h-START)+m/60)*HOUR_H;};
  const ht=(d)=>Math.max((d/60)*HOUR_H-2,22);
  const dayAppts=appts.filter(a=>(a.date||"2026-02-25")===selectedDate);
  return(
    <Card style={{overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        <div style={{width:68,flexShrink:0}}/>
        <div style={{flex:1,padding:"10px 16px",fontWeight:700,fontSize:13,color:C.text}}>
          {new Date(selectedDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
          <span style={{marginLeft:10,fontSize:12,fontWeight:400,color:C.muted}}>{dayAppts.length} appointment{dayAppts.length!==1?"s":""}</span>
        </div>
      </div>
      <div style={{display:"flex",overflowY:"auto",maxHeight:520}}>
        <div style={{width:68,flexShrink:0,borderRight:`1px solid ${C.border}`}}>
          {hours.map(h=><div key={h} style={{height:HOUR_H,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:10,paddingTop:6,fontSize:10,fontWeight:600,color:C.muted}}>{h>12?h-12:h}:00 {h>=12?"PM":"AM"}</div>)}
        </div>
        <div style={{flex:1,position:"relative",minHeight:(END-START)*HOUR_H}}>
          {hours.map((h,i)=>(
            <div key={h} style={{position:"absolute",top:i*HOUR_H,left:0,right:0,height:HOUR_H,borderBottom:`1px solid ${C.border}`}}>
              <div style={{position:"absolute",top:HOUR_H/2,left:0,right:0,borderBottom:`1px dashed #EEF0F3`}}/>
              {canAdd&&[0,30].map(m=>(
                <div key={m} style={{position:"absolute",top:m===0?0:HOUR_H/2,left:0,right:0,height:HOUR_H/2,cursor:"pointer",zIndex:0}}
                  onClick={()=>onSlotClick(selectedDate,`${String(h).padStart(2,"0")}:${m===0?"00":"30"}`)}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(30,77,140,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}/>
              ))}
            </div>
          ))}
          {dayAppts.map(a=>{
            const col=TYPE_C[a.type]||C.blue;
            return(
              <div key={a.id} style={{position:"absolute",top:top(a.time)+1,left:8,right:8,height:ht(a.duration),background:col+"1A",border:`1px solid ${col}60`,borderLeft:`3px solid ${col}`,borderRadius:5,padding:"4px 8px",overflow:"hidden",zIndex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:col,lineHeight:1.3}}>{a.patient}</div>
                {ht(a.duration)>28&&<div style={{fontSize:10,color:C.muted}}>{a.time} · {a.type.replace(/-/g," ")} · {a.duration}m</div>}
                {ht(a.duration)>44&&<div style={{fontSize:10,color:C.muted}}>{a.doctor}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function CalendarWeekView({appts,selectedDate,onSelectDate,onSlotClick,canAdd}){
  const HOUR_H=50,START=8,END=18;
  const hours=Array.from({length:END-START},(_,i)=>START+i);
  const DOC_C={"Dr. Patel":C.blue,"Dr. Williams":C.teal};
  const weekDates=getWeekDates(selectedDate);
  const top=(t)=>{const[h,m]=t.split(":").map(Number);return((h-START)+m/60)*HOUR_H;};
  const ht=(d)=>Math.max((d/60)*HOUR_H-2,18);
  return(
    <Card style={{overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        <div style={{width:68,flexShrink:0}}/>
        {weekDates.map(date=>{
          const d=new Date(date+"T12:00:00");
          const isSel=date===selectedDate;
          const cnt=appts.filter(a=>(a.date||"2026-02-25")===date).length;
          return(
            <div key={date} onClick={()=>onSelectDate(date)} style={{flex:1,padding:"10px 6px",textAlign:"center",cursor:"pointer",borderRight:`1px solid ${C.border}`,background:isSel?C.blueBg:"transparent"}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:600}}>{d.toLocaleDateString("en-US",{weekday:"short"})}</div>
              <div style={{fontSize:18,fontWeight:700,color:isSel?C.navyMid:C.text}}>{d.getDate()}</div>
              {cnt>0&&<div style={{fontSize:9,color:C.muted}}>{cnt} appt{cnt>1?"s":""}</div>}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",overflowY:"auto",maxHeight:500}}>
        <div style={{width:68,flexShrink:0,borderRight:`1px solid ${C.border}`}}>
          {hours.map(h=><div key={h} style={{height:HOUR_H,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:10,paddingTop:4,fontSize:10,fontWeight:600,color:C.muted}}>{h>12?h-12:h}{h>=12?"pm":"am"}</div>)}
        </div>
        {weekDates.map(date=>{
          const dayAppts=appts.filter(a=>(a.date||"2026-02-25")===date);
          const isSel=date===selectedDate;
          return(
            <div key={date} style={{flex:1,position:"relative",borderRight:`1px solid ${C.border}`,minHeight:(END-START)*HOUR_H,background:isSel?"rgba(30,77,140,0.015)":"transparent"}}>
              {hours.map((h,i)=>(
                <div key={h} style={{position:"absolute",top:i*HOUR_H,left:0,right:0,height:HOUR_H,borderBottom:`1px solid ${C.border}`}}>
                  <div style={{position:"absolute",top:HOUR_H/2,left:0,right:0,borderBottom:`1px dashed #EEF0F3`}}/>
                  {canAdd&&[0,30].map(m=>(
                    <div key={m} style={{position:"absolute",top:m===0?0:HOUR_H/2,left:0,right:0,height:HOUR_H/2,cursor:"pointer",zIndex:0}}
                      onClick={()=>{onSelectDate(date);onSlotClick(date,`${String(h).padStart(2,"0")}:${m===0?"00":"30"}`);}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(30,77,140,0.05)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}/>
                  ))}
                </div>
              ))}
              {dayAppts.map(a=>{
                const col=DOC_C[a.doctor]||C.blue;
                return(
                  <div key={a.id} style={{position:"absolute",top:top(a.time)+1,left:2,right:2,height:ht(a.duration),background:col+"22",border:`1px solid ${col}50`,borderLeft:`2px solid ${col}`,borderRadius:3,padding:"2px 4px",overflow:"hidden",zIndex:1,fontSize:10}}>
                    <div style={{fontWeight:700,color:col,lineHeight:1.2}}>{a.patient.split(" ")[0]}</div>
                    <div style={{color:C.muted}}>{a.time}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function BarChart({data,color=C.navyMid,maxVal}){
  const max=maxVal||Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120,padding:"0 4px"}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:11,fontWeight:700,color:C.text}}>{d.value||""}</div>
          <div style={{width:"100%",background:color,borderRadius:"3px 3px 0 0",height:`${(d.value/max)*90}px`,minHeight:d.value?4:0,transition:"height 0.3s"}}/>
          <div style={{fontSize:10,color:C.muted,textAlign:"center",lineHeight:1.2}}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}
function HBarChart({data}){
  const max=Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {data.map((d,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:120,fontSize:12,color:C.muted,textAlign:"right",flexShrink:0}}>{d.label}</div>
          <div style={{flex:1,background:C.bg,borderRadius:4,overflow:"hidden",height:20}}>
            <div style={{width:`${(d.value/max)*100}%`,background:d.color||C.navyMid,height:"100%",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:6,minWidth:d.value?20:0}}>
              <span style={{fontSize:10,fontWeight:700,color:"#fff"}}>{d.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function ReportsPage({appts,recalls,patients}){
  const weekDays=["Mon","Tue","Wed","Thu","Fri"];
  const weekDates=getWeekDates("2026-02-25");
  const apptsByDay=weekDates.map((d,i)=>({label:weekDays[i],value:appts.filter(a=>(a.date||"2026-02-25")===d).length}));
  const noShowCount=appts.filter(a=>a.status==="no-show").length;
  const noShowRate=appts.length?Math.round((noShowCount/appts.length)*100):0;
  const typeCount={};appts.forEach(a=>{typeCount[a.type]=(typeCount[a.type]||0)+1;});
  const topTypes=Object.entries(typeCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>({label:k.replace(/-/g," "),value:v,color:C.navyMid}));
  const recallByUrgency=[
    {label:"Overdue",  value:recalls.filter(r=>r.urgency==="high").length,   color:C.red},
    {label:"This Week",value:recalls.filter(r=>r.urgency==="medium").length, color:C.amber},
    {label:"Upcoming", value:recalls.filter(r=>r.urgency==="low").length,    color:C.green},
  ];
  const statCards=[
    ["Total Appointments",appts.length,"All time",C.navyMid],
    ["No-Show Rate",`${noShowRate}%`,"This month",noShowRate>15?C.red:C.green],
    ["Open Recalls",recalls.length,"Awaiting contact",C.amber],
    ["Active Patients",patients.filter(p=>p.active!==false).length,"Total registered",C.teal],
  ];
  return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Reports</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Clinic performance overview</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {statCards.map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Appointments This Week</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>By day (Feb 24–28, 2026)</div>
          <BarChart data={apptsByDay} color={C.navyMid}/>
        </Card>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Top Appointment Types</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>All time</div>
          <HBarChart data={topTypes}/>
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Recalls by Urgency</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Current open recalls</div>
          <HBarChart data={recallByUrgency}/>
        </Card>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:16}}>No-Show Summary</div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:`conic-gradient(${C.red} 0% ${noShowRate}%,${C.greenBg} ${noShowRate}% 100%)`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:C.surface,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                <div style={{fontSize:18,fontWeight:800,color:C.red}}>{noShowRate}%</div>
              </div>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:10,height:10,borderRadius:2,background:C.red}}/><span style={{fontSize:13,color:C.muted}}>No-shows: {noShowCount}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:2,background:C.greenBg,border:`1px solid ${C.green}`}}/><span style={{fontSize:13,color:C.muted}}>Completed: {appts.filter(a=>a.status==="completed").length}</span></div>
              <div style={{fontSize:12,color:C.muted,marginTop:12}}>Target: below 10%</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── PATIENT FLOW BOARD ───────────────────────────────────────────────────────
function PatientFlowPage({user,appts,setAppts}){
  const TODAY="2026-02-25";
  const todayAppts=appts.filter(a=>(a.date||TODAY)===TODAY);
  const COLS=[
    {id:"scheduled",  label:"Scheduled",           color:C.blue,    bg:C.blueBg},
    {id:"checked-in", label:"Checked In",           color:C.teal,    bg:"#E0F4F6"},
    {id:"in-progress",label:"With Provider",        color:C.amber,   bg:C.amberBg},
    {id:"completed",  label:"Done",                 color:C.green,   bg:C.greenBg},
  ];
  const noShows=appts.filter(a=>(a.date||TODAY)===TODAY&&a.status==="no-show");
  const ORDER=["scheduled","checked-in","in-progress","completed"];
  const advance=(id)=>setAppts(p=>p.map(a=>{if(a.id!==id)return a;const i=ORDER.indexOf(a.status);return{...a,status:i<ORDER.length-1?ORDER[i+1]:a.status};}));
  const setNoShow=(id)=>setAppts(p=>p.map(a=>a.id===id?{...a,status:"no-show"}:a));
  const TYPE_C={routine:C.blue,"follow-up":C.teal,urgent:C.red,procedure:C.amber,"new-patient":C.green};
  return(
    <div style={{padding:"28px 32px",height:"calc(100% - 56px)",boxSizing:"border-box",display:"flex",flexDirection:"column"}}>
      <div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Patient Flow</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · {todayAppts.length} patients scheduled</p></div>
        {noShows.length>0&&<div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:8,padding:"8px 14px",fontSize:13,color:C.red,fontWeight:600}}>{noShows.length} no-show{noShows.length>1?"s":""} today</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,flex:1,overflow:"hidden"}}>
        {COLS.map(col=>{
          const cards=todayAppts.filter(a=>a.status===col.id);
          return(
            <div key={col.id} style={{background:col.bg,borderRadius:10,border:`1px solid ${col.color}30`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${col.color}30`,display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:col.color}}/>
                <div style={{fontWeight:700,fontSize:13,color:col.color}}>{col.label}</div>
                <div style={{marginLeft:"auto",background:col.color,color:"#fff",fontSize:11,fontWeight:700,padding:"1px 7px",borderRadius:10}}>{cards.length}</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"10px 10px 10px"}}>
                {cards.length===0&&<div style={{color:col.color,opacity:0.5,fontSize:12,textAlign:"center",paddingTop:20}}>No patients</div>}
                {cards.map(a=>(
                  <div key={a.id} style={{background:C.surface,borderRadius:8,padding:"12px",marginBottom:8,border:`1px solid ${col.color}25`,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text}}>{a.patient}</div>
                      <div style={{fontSize:11,fontWeight:600,color:C.muted}}>{a.time}</div>
                    </div>
                    <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,fontWeight:600,color:TYPE_C[a.type]||C.blue,background:(TYPE_C[a.type]||C.blue)+"15",padding:"2px 6px",borderRadius:3}}>{a.type.replace(/-/g," ")}</span>
                      <span style={{fontSize:10,color:C.muted,background:C.bg,padding:"2px 6px",borderRadius:3}}>{a.doctor}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      {col.id!=="completed"&&<button onClick={()=>advance(a.id)} style={{flex:1,fontSize:11,fontWeight:700,padding:"5px 8px",borderRadius:5,border:"none",background:col.color,color:"#fff",cursor:"pointer"}}>{col.id==="scheduled"?"Check In →":col.id==="checked-in"?"Start Visit →":"Complete ✓"}</button>}
                      {col.id==="scheduled"&&user.role!=="doctor"&&<button onClick={()=>setNoShow(a.id)} style={{fontSize:11,fontWeight:600,padding:"5px 8px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,cursor:"pointer"}}>No Show</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniCalendar({ selectedDate, onSelectDate, appts }) {
  const initDate = new Date(selectedDate + "T12:00:00");
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const todayStr = new Date().toISOString().split("T")[0];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDOW = new Date(viewYear, viewMonth, 1).getDay();

  const apptCounts = {};
  appts.forEach(a => {
    if (!a.date) return;
    const [y, m, d] = a.date.split("-").map(Number);
    if (y === viewYear && m - 1 === viewMonth) {
      apptCounts[d] = (apptCounts[d] || 0) + 1;
    }
  });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDOW; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1, padding: "2px 8px", borderRadius: 4 }}>‹</button>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{MONTH_NAMES[viewMonth]} {viewYear}</div>
        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1, padding: "2px 8px", borderRadius: 4 }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: C.muted, paddingBottom: 4 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const padM = String(viewMonth + 1).padStart(2, "0");
          const padD = String(day).padStart(2, "0");
          const dateStr = `${viewYear}-${padM}-${padD}`;
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const count = apptCounts[day] || 0;
          return (
            <button
              key={idx}
              onClick={() => onSelectDate(dateStr)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                height: 34, borderRadius: 6, border: "none", cursor: "pointer",
                background: isSelected ? C.navyMid : isToday ? C.blueBg : "transparent",
                color: isSelected ? "#fff" : isToday ? C.blue : C.text,
                fontWeight: isSelected || isToday ? 700 : 400,
                fontSize: 12,
              }}
            >
              <span>{day}</span>
              {count > 0 && (
                <div style={{
                  width: 4, height: 4, borderRadius: "50%", marginTop: 2,
                  background: isSelected ? "rgba(255,255,255,0.75)" : C.teal,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ApptsPage({user,appts,setAppts,patients,settings}){
  const [filter, setFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-02-25");
  const [view, setView] = useState("list"); // list | day | week
  const [prefillTime, setPrefillTime] = useState(null);
  const canAdd = user.role === "receptionist" || user.role === "admin";

  const dayAppts = appts.filter(a => (a.date || "2026-02-25") === selectedDate);
  const filtered = filter === "all" ? dayAppts : dayAppts.filter(a => a.status === filter);

  const ORDER = ["scheduled","checked-in","in-progress","completed"];
  const advance = (id) => setAppts(p => p.map(a => {
    if (a.id !== id) return a;
    const i = ORDER.indexOf(a.status);
    return {...a, status: i < ORDER.length-1 ? ORDER[i+1] : a.status};
  }));
  const setNoShow = (id) => setAppts(p => p.map(a => a.id === id ? {...a, status:"no-show"} : a));

  const displayDate = new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const openSlotModal = (date, time) => {
    setSelectedDate(date);
    setPrefillTime(time);
    setShowNew(true);
  };

  return (
    <div style={{ padding: "28px 32px" }}>
      {showNew && (
        <NewApptModal
          onClose={() => { setShowNew(false); setPrefillTime(null); }}
          onSave={a => { setAppts(p => [...p, a]); setShowNew(false); setPrefillTime(null); }}
          patients={patients}
          defaultDate={selectedDate}
          appts={appts}
          prefillTime={prefillTime}
        />
      )}
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Appointments</h1>
          <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>{displayDate}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 7, overflow: "hidden" }}>
            {[["list","≡ List"],["day","⊟ Day"],["week","⊞ Week"]].map(([id,lbl]) => (
              <button key={id} onClick={() => setView(id)}
                style={{ padding: "7px 14px", border: "none", background: view===id ? C.navyMid : C.surface, color: view===id ? "#fff" : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {lbl}
              </button>
            ))}
          </div>
          {canAdd && (
            <button onClick={() => setShowNew(true)}
              style={{ background: C.navyMid, color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              + New Appointment
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "268px 1fr", gap: 20, alignItems: "start" }}>
        {/* ── Left panel: calendar + day summary ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <MiniCalendar selectedDate={selectedDate} onSelectDate={date => { setSelectedDate(date); setFilter("all"); }} appts={appts} />
          <Card style={{ padding: "16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Day Summary</div>
            {[
              ["Total",       dayAppts.length,                                                  C.navyMid],
              ["Scheduled",   dayAppts.filter(a => a.status === "scheduled").length,            C.blue   ],
              ["Checked In",  dayAppts.filter(a => a.status === "checked-in").length,           C.teal   ],
              ["In Progress", dayAppts.filter(a => a.status === "in-progress").length,          C.amber  ],
              ["Completed",   dayAppts.filter(a => a.status === "completed").length,            C.green  ],
              ["No-Shows",    dayAppts.filter(a => a.status === "no-show").length,              C.red    ],
            ].map(([label, count, color]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: count > 0 ? color : C.muted }}>{count}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* ── Right panel ── */}
        <div>
          {view === "list" && (
            <>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[["all","All"],["scheduled","Scheduled"],["checked-in","Checked In"],["in-progress","In Progress"],["completed","Completed"],["no-show","No-Show"]].map(([id,lbl]) => (
                  <button key={id} onClick={() => setFilter(id)}
                    style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter===id ? C.navyMid : C.border}`, background: filter===id ? C.navyMid : C.surface, color: filter===id ? "#fff" : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {lbl}
                  </button>
                ))}
              </div>
              <Card>
                {filtered.length === 0 ? (
                  <div style={{ padding: "48px 32px", textAlign: "center", color: C.muted }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No appointments</div>
                    <div style={{ fontSize: 13 }}>{filter !== "all" ? "No appointments match this filter." : "No appointments scheduled for this day."}</div>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#F7F9FC" }}>
                        {["Time","Patient","Type","Doctor","Duration","Status","Action"].map(h => (
                          <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a, i) => (
                        <tr key={a.id} style={{ borderBottom: i < filtered.length-1 ? `1px solid ${C.border}` : "none", background: a.status==="in-progress" ? "#FFFBF0" : a.status==="no-show" ? C.redBg : "transparent" }}>
                          <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 700, color: C.text }}>{a.time}</td>
                          <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: C.text }}>{a.patient}</td>
                          <td style={{ padding: "13px 16px" }}><TB type={a.type}/></td>
                          <td style={{ padding: "13px 16px", fontSize: 13, color: C.muted }}>{a.doctor}</td>
                          <td style={{ padding: "13px 16px", fontSize: 13, color: C.muted }}>{a.duration}m</td>
                          <td style={{ padding: "13px 16px" }}><SB status={a.status}/></td>
                          <td style={{ padding: "13px 16px" }}>
                            <div style={{ display: "flex", gap: 6 }}>
                              {a.status !== "completed" && a.status !== "no-show" && (
                                <button onClick={() => advance(a.id)}
                                  style={{ fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 5, border: `1px solid ${C.border}`, background: C.surface, color: C.navyMid, cursor: "pointer" }}>
                                  {a.status==="scheduled" ? "Check In" : a.status==="checked-in" ? "Start" : "Complete"}
                                </button>
                              )}
                              {a.status === "scheduled" && (
                                <button onClick={() => setNoShow(a.id)}
                                  style={{ fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 5, border: `1px solid ${C.border}`, background: C.surface, color: C.red, cursor: "pointer" }}>
                                  No Show
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card>
            </>
          )}
          {view === "day" && <CalendarDayView appts={appts} selectedDate={selectedDate} onSlotClick={openSlotModal} canAdd={canAdd}/>}
          {view === "week" && <CalendarWeekView appts={appts} selectedDate={selectedDate} onSelectDate={date=>{setSelectedDate(date);}} onSlotClick={openSlotModal} canAdd={canAdd}/>}
        </div>
      </div>
    </div>
  );
}

function PatientProfile({patient,onBack,user,vitals,setVitals,rx,setRx,notes,setNotes,recalls,setRecalls,patients,setPatients}){
  const[tab,setTab]=useState("overview");
  const[sv,setSv]=useState(false);const[sr,setSr]=useState(false);const[sn,setSn]=useState(false);const[sc,setSc]=useState(false);
  const[showInactiveRx,setShowInactiveRx]=useState(false);
  const[addingAllergy,setAddingAllergy]=useState(false);const[newAllergy,setNewAllergy]=useState("");
  const[labResults,setLabResults]=useState(INIT_LABS[patient.id]||[]);
  const p=PERMS[user.role];const v=vitals[patient.id];const rxs=rx[patient.id]||[];const ptN=notes[patient.id]||[];
  const inactiveRxs=INIT_INACTIVE_RX[patient.id]||[];
  const tabs=[{id:"overview",show:true},{id:"vitals",show:p.vitals},{id:"prescriptions",show:p.prescriptions},{id:"notes",show:p.notes},{id:"labs",show:true},{id:"files",show:true},{id:"recalls",show:p.recalls}].filter(t=>t.show);
  const addAllergy=()=>{
    if(!newAllergy.trim())return;
    setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,allergies:[...pt.allergies,newAllergy.trim()]}:pt));
    setNewAllergy("");setAddingAllergy(false);
  };
  const printRx=()=>{
    const w=window.open("","_blank","width=720,height=900");
    w.document.write(`<html><head><title>Prescription</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#1A2332}.header{border-bottom:2px solid #1A3A5C;padding-bottom:16px;margin-bottom:24px}.clinic{font-size:20px;font-weight:bold;color:#1A3A5C}.rx-item{border:1px solid #ddd;border-radius:6px;padding:14px;margin-bottom:12px}.med{font-size:16px;font-weight:bold}.footer{margin-top:48px;border-top:1px solid #ddd;padding-top:16px}.sig{border-bottom:1px solid #000;width:260px;margin-top:36px}@media print{body{margin:20px}}</style></head><body>
    <div class="header"><div class="clinic">My Medical Clinic</div><div style="color:#6B7A8D;font-size:13px">123 Main St · (555) 000-0000</div></div>
    <div style="margin-bottom:16px"><strong>Patient:</strong> ${patient.first_name} ${patient.last_name} &nbsp;·&nbsp; <strong>DOB:</strong> ${patient.dob} &nbsp;·&nbsp; <strong>Date:</strong> ${today()}</div>
    ${rxs.map(rx=>`<div class="rx-item"><div class="med">℞ ${rx.med} ${rx.dose}</div><div style="margin:6px 0;color:#6B7A8D">${rx.sig}</div><div style="font-size:12px;color:#6B7A8D">Refills: ${rx.refills} &nbsp;·&nbsp; Prescribed: ${rx.date||""}</div></div>`).join("")}
    <div class="footer"><div>Prescribing Physician: <strong>Dr. Priya Patel, MD</strong></div><div class="sig"></div><div style="margin-top:6px;font-size:12px;color:#6B7A8D">Signature</div></div>
    </body></html>`);
    w.document.close();w.focus();setTimeout(()=>w.print(),300);
  };
  const printSummary=()=>{
    const w=window.open("","_blank","width=720,height=900");
    const vit=vitals[patient.id];
    w.document.write(`<html><head><title>Patient Summary</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#1A2332}h2{color:#1A3A5C}table{width:100%;border-collapse:collapse;margin-bottom:20px}td,th{padding:8px 12px;border:1px solid #ddd;font-size:13px}th{background:#F0F2F5;font-weight:700}.section{margin-bottom:24px}@media print{body{margin:20px}}</style></head><body>
    <h2>My Medical Clinic — Patient Summary</h2>
    <p style="color:#6B7A8D;font-size:13px">Generated: ${today()} &nbsp;·&nbsp; For referral or internal use only</p>
    <div class="section"><h3>Demographics</h3><table><tr><th>Name</th><td>${patient.first_name} ${patient.last_name}</td><th>DOB</th><td>${patient.dob}</td></tr><tr><th>Phone</th><td>${patient.phone}</td><th>Insurance</th><td>${patient.insurance}</td></tr></table></div>
    <div class="section"><h3>⚠ Allergies</h3><p>${patient.allergies.length?patient.allergies.join(", "):"No known allergies"}</p></div>
    ${vit?`<div class="section"><h3>Most Recent Vitals</h3><table><tr><th>BP</th><td>${vit.bp} mmHg</td><th>HR</th><td>${vit.hr} bpm</td></tr><tr><th>Temp</th><td>${vit.temp} °F</td><th>O₂ Sat</th><td>${vit.o2}%</td></tr><tr><th>Weight</th><td>${vit.weight} lbs</td><th>BMI</th><td>${vit.bmi}</td></tr></table></div>`:""}
    ${rxs.length?`<div class="section"><h3>Active Medications</h3><table><tr><th>Medication</th><th>Dose</th><th>Instructions</th><th>Refills</th></tr>${rxs.map(r=>`<tr><td>${r.med}</td><td>${r.dose}</td><td>${r.sig}</td><td>${r.refills}</td></tr>`).join("")}</table></div>`:""}
    ${recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).length?`<div class="section"><h3>Open Recalls</h3><table><tr><th>Reason</th><th>Due Date</th><th>Urgency</th></tr>${recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).map(r=>`<tr><td>${r.reason}</td><td>${r.due}</td><td>${r.urgency}</td></tr>`).join("")}</table></div>`:""}
    </body></html>`);
    w.document.close();w.focus();setTimeout(()=>w.print(),300);
  };
  return(
    <div style={{padding:"28px 32px"}}>
      {sv&&<VitalsModal patient={patient} onClose={()=>setSv(false)} onSave={(pid,data)=>{setVitals(p=>({...p,[pid]:data}));setSv(false);}}/>}
      {sr&&<RxModal patient={patient} onClose={()=>setSr(false)} onSave={(pid,r)=>{setRx(p=>({...p,[pid]:[...(p[pid]||[]),r]}));setSr(false);}}/>}
      {sn&&<NoteModal patient={patient} onClose={()=>setSn(false)} onSave={(pid,n)=>{setNotes(p=>({...p,[pid]:[...(p[pid]||[]),n]}));setSn(false);}}/>}
      {sc&&<RecallModal onClose={()=>setSc(false)} onSave={r=>{setRecalls(p=>[...p,r]);setSc(false);}} patients={patients}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",padding:0}}>← Back to Patients</button>
        <div style={{display:"flex",gap:8}}>
          <button onClick={printSummary} style={{fontSize:12,fontWeight:600,padding:"6px 14px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.navyMid,cursor:"pointer"}}>⎙ Print Summary</button>
          {p.prescriptions&&rxs.length>0&&<button onClick={printRx} style={{fontSize:12,fontWeight:600,padding:"6px 14px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.navyMid,cursor:"pointer"}}>⎙ Print Rx</button>}
        </div>
      </div>
      <Card style={{padding:"20px 24px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:C.navyMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,flexShrink:0}}>{patient.first_name[0]}{patient.last_name[0]}</div>
          <div style={{flex:1}}><h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.text}}>{patient.first_name} {patient.last_name}</h2><div style={{color:C.muted,fontSize:13,marginTop:3}}>{age(patient.dob)} yrs · {patient.gender==="F"?"Female":"Male"} · DOB {fmt(patient.dob)} · {patient.phone}</div></div>
          <div>
            {patient.allergies.length>0?(<div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:7,padding:"8px 14px",marginBottom:4}}><div style={{color:C.red,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:2}}>⚠ Allergies</div><div style={{color:C.red,fontSize:12,fontWeight:600}}>{patient.allergies.join(", ")}</div></div>):(<div style={{background:C.greenBg,border:`1px solid #A7D9B5`,borderRadius:7,padding:"8px 14px",marginBottom:4}}><div style={{color:C.green,fontSize:12,fontWeight:600}}>✓ No Known Allergies</div></div>)}
            {(p.vitals||user.role==="doctor")&&<button onClick={()=>setAddingAllergy(true)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>+ Add Allergy</button>}
          </div>
          <div style={{textAlign:"right",paddingLeft:16,borderLeft:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.muted,textTransform:"uppercase",fontWeight:700}}>Insurance</div><div style={{fontSize:13,fontWeight:700,color:C.text,marginTop:3}}>{patient.insurance}</div></div>
        </div>
        {addingAllergy&&(
          <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`,display:"flex",gap:8,alignItems:"center"}}>
            <input value={newAllergy} onChange={e=>setNewAllergy(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAllergy()} placeholder="e.g. Latex, Penicillin…" style={{...IS,maxWidth:300,marginBottom:0}} autoFocus/>
            <PB onClick={addAllergy} disabled={!newAllergy.trim()}>Add</PB>
            <XB onClick={()=>{setAddingAllergy(false);setNewAllergy("");}}>Cancel</XB>
          </div>
        )}
      </Card>
      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${C.border}`}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 18px",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?C.navyMid:C.muted,borderBottom:tab===t.id?`2px solid ${C.navyMid}`:"2px solid transparent",marginBottom:-1,textTransform:"capitalize"}}>{t.id}</button>)}
      </div>
      {tab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card style={{padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontWeight:700,fontSize:13,color:C.text}}>Recent Vitals</div>{p.vitals&&<button onClick={()=>setSv(true)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>+ Record</button>}</div>
            {p.vitals?(v?(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["Blood Pressure",v.bp,"mmHg"],["Heart Rate",v.hr,"bpm"],["Temperature",v.temp,"°F"],["O₂ Sat",v.o2,"%"],["Weight",v.weight,"lbs"],["BMI",v.bmi,""]].map(([l,val,u])=><div key={l} style={{background:C.bg,borderRadius:7,padding:"10px 12px"}}><div style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:17,fontWeight:700,color:C.text,marginTop:2}}>{val}<span style={{fontSize:11,color:C.muted,fontWeight:400,marginLeft:2}}>{u}</span></div></div>)}</div>):<div style={{color:C.muted,fontSize:13}}>No vitals yet. <button onClick={()=>setSv(true)} style={{color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Record now</button></div>):<div style={{color:C.muted,fontSize:13,fontStyle:"italic"}}>🔒 Nurses and doctors only.</div>}
          </Card>
          <Card style={{padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontWeight:700,fontSize:13,color:C.text}}>Active Medications</div>{user.role==="doctor"&&<button onClick={()=>setSr(true)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>+ Prescribe</button>}</div>
            {p.prescriptions?(rxs.length>0?rxs.map(rx=><div key={rx.id} style={{padding:"10px 12px",background:C.bg,borderRadius:7,marginBottom:8}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{rx.med} <span style={{color:C.muted,fontWeight:400}}>{rx.dose}</span></div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{rx.sig} · {rx.refills} refills</div></div>):<div style={{color:C.muted,fontSize:13}}>No active medications.</div>):<div style={{color:C.muted,fontSize:13,fontStyle:"italic"}}>🔒 Doctors only.</div>}
          </Card>
        </div>
      )}
      {tab==="vitals"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Vitals</div><button onClick={()=>setSv(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Record Vitals</button></div>
        {v?(<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12}}>{[["BP",v.bp,"mmHg",parseFloat(v.bp)>130?C.amber:C.green],["HR",v.hr,"bpm",C.green],["Temp",v.temp,"°F",C.green],["O₂",v.o2,"%",v.o2<97?C.amber:C.green],["Weight",v.weight,"lbs",C.text],["BMI",v.bmi,"",v.bmi>25?C.amber:C.green]].map(([l,val,u,c])=><div key={l} style={{background:C.bg,borderRadius:8,padding:"14px",textAlign:"center"}}><div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:c}}>{val}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{u}</div></div>)}</div>):<div style={{color:C.muted}}>No vitals on record.</div>}
      </Card>)}
      {tab==="prescriptions"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Prescriptions</div><button onClick={()=>setShowInactiveRx(v=>!v)} style={{fontSize:11,color:C.muted,fontWeight:600,background:C.bg,border:`1px solid ${C.border}`,borderRadius:5,padding:"3px 9px",cursor:"pointer"}}>{showInactiveRx?"Hide History":"Show History"}</button></div>
          {user.role==="doctor"&&<button onClick={()=>setSr(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ New Prescription</button>}
        </div>
        {rxs.length>0||showInactiveRx?(<table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F7F9FC"}}>{["Medication","Dose","Instructions","Refills","Date","Status"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {rxs.map((rx,i)=><tr key={rx.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"12px 14px",fontWeight:700,color:C.text}}>{rx.med}</td><td style={{padding:"12px 14px",color:C.muted}}>{rx.dose}</td><td style={{padding:"12px 14px",color:C.muted}}>{rx.sig}</td><td style={{padding:"12px 14px",color:C.muted}}>{rx.refills}</td><td style={{padding:"12px 14px",color:C.muted}}>{rx.date?fmt(rx.date):"—"}</td><td style={{padding:"12px 14px"}}><Badge color="green">Active</Badge></td></tr>)}
            {showInactiveRx&&inactiveRxs.map((rx,i)=><tr key={rx.id} style={{borderBottom:i<inactiveRxs.length-1?`1px solid ${C.border}`:"none",opacity:0.6}}><td style={{padding:"12px 14px",fontWeight:700,color:C.text}}>{rx.med}</td><td style={{padding:"12px 14px",color:C.muted}}>{rx.dose}</td><td style={{padding:"12px 14px",color:C.muted}}>{rx.sig}</td><td style={{padding:"12px 14px",color:C.muted}}>{rx.refills}</td><td style={{padding:"12px 14px",color:C.muted}}>{rx.date?fmt(rx.date):"—"}</td><td style={{padding:"12px 14px"}}><Badge color="red">Inactive</Badge></td></tr>)}
          </tbody>
        </table>):<div style={{color:C.muted,fontSize:13}}>No prescriptions on file.</div>}
      </Card>)}
      {tab==="labs"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Lab Results</div><button style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Upload Result</button></div>
        {labResults.length>0?(<table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F7F9FC"}}>{["Test Name","Date","Status","Flag"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{labResults.map((lab,i)=>(
            <tr key={lab.id} style={{borderBottom:i<labResults.length-1?`1px solid ${C.border}`:"none"}}>
              <td style={{padding:"12px 14px",fontWeight:600,color:C.text}}>{lab.name}</td>
              <td style={{padding:"12px 14px",color:C.muted}}>{fmt(lab.date)}</td>
              <td style={{padding:"12px 14px"}}><Badge color="green">Received</Badge></td>
              <td style={{padding:"12px 14px"}}>{lab.abnormal?<Badge color="red">Abnormal</Badge>:<span style={{fontSize:12,color:C.muted}}>Normal</span>}</td>
            </tr>
          ))}</tbody>
        </table>):(<div style={{border:`2px dashed ${C.border}`,borderRadius:10,padding:"40px 20px",textAlign:"center",color:C.muted,fontSize:13}}><div style={{fontSize:28,marginBottom:8}}>🧪</div>No lab results on file.</div>)}
      </Card>)}
      {tab==="notes"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Visit Notes</div>{user.role==="doctor"&&<button onClick={()=>setSn(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ New Note</button>}</div>
        {ptN.length>0?ptN.map(n=><div key={n.id} style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"16px",marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontWeight:700,fontSize:13,color:C.text}}>{n.chief}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmt(n.date)} · {n.doctor}</div></div>{n.signed?<Badge color="green">Signed</Badge>:<Badge color="amber">Draft</Badge>}</div>{n.assessment&&<div style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Assessment</div><div style={{fontSize:13,color:C.text}}>{n.assessment}</div></div>}{n.plan&&<div><div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Plan</div><div style={{fontSize:13,color:C.text}}>{n.plan}</div></div>}</div>):<div style={{color:C.muted,fontSize:13}}>No visit notes yet.</div>}
      </Card>)}
      {tab==="files"&&(<Card style={{padding:"20px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Documents</div><button style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Upload</button></div><div style={{border:`2px dashed ${C.border}`,borderRadius:10,padding:"40px 20px",textAlign:"center",color:C.muted,fontSize:13}}><div style={{fontSize:28,marginBottom:8}}>📁</div>No files uploaded yet.</div></Card>)}
      {tab==="recalls"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Recall Flags</div><button onClick={()=>setSc(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add Recall</button></div>
        {recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).length>0?recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).map((r,i,arr)=><div key={r.id} style={{padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.reason}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Due {fmt(r.due)}</div></div><Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge></div>):<div style={{color:C.muted,fontSize:13}}>No recall flags for this patient.</div>}
      </Card>)}
    </div>
  );
}

function PatientsPage({user,patients,setPatients,vitals,setVitals,rx,setRx,notes,setNotes,recalls,setRecalls,appts,setAppts}){
  const[search,setSearch]=useState("");const[sel,setSel]=useState(null);const[showNew,setShowNew]=useState(false);
  const[quickMenu,setQuickMenu]=useState(null); // patient id with open menu
  const[quickNewAppt,setQuickNewAppt]=useState(null);
  const[quickRecall,setQuickRecall]=useState(null);
  const[quickVitals,setQuickVitals]=useState(null);
  const q=search.toLowerCase();
  const filt=patients.filter(p=>{
    if(!q)return true;
    const name=`${p.first_name} ${p.last_name}`.toLowerCase();
    const phone=(p.phone||"").toLowerCase();
    const dob=(p.dob||"").toLowerCase();
    const ins=(p.insurance||"").toLowerCase();
    return name.includes(q)||phone.includes(q)||dob.includes(q)||ins.includes(q);
  });
  const nextAppt=(pid)=>{
    const pName=patients.find(p=>p.id===pid);
    if(!pName)return null;
    const name=`${pName.first_name} ${pName.last_name}`;
    const today=new Date().toISOString().split("T")[0];
    return appts.filter(a=>a.patient===name&&a.date>="2026-02-25"&&a.status!=="completed"&&a.status!=="no-show").sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))[0]||null;
  };
  if(sel)return<PatientProfile patient={sel} onBack={()=>setSel(null)} user={user} vitals={vitals} setVitals={setVitals} rx={rx} setRx={setRx} notes={notes} setNotes={setNotes} recalls={recalls} setRecalls={setRecalls} patients={patients} setPatients={setPatients}/>;
  return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      {showNew&&<NewPatientModal onClose={()=>setShowNew(false)} onSave={p=>{setPatients(prev=>[...prev,p]);setShowNew(false);}}/>}
      {quickNewAppt&&<NewApptModal onClose={()=>setQuickNewAppt(null)} onSave={a=>{setAppts(p=>[...p,a]);setQuickNewAppt(null);}} patients={patients} appts={appts} defaultDate="2026-02-25"/>}
      {quickRecall&&<RecallModal onClose={()=>setQuickRecall(null)} onSave={r=>{setRecalls(p=>[...p,r]);setQuickRecall(null);}} patients={patients}/>}
      {quickVitals&&<VitalsModal patient={quickVitals} onClose={()=>setQuickVitals(null)} onSave={(pid,data)=>{setVitals(p=>({...p,[pid]:data}));setQuickVitals(null);}}/>}
      <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Patients</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>{patients.length} total · {patients.filter(p=>p.active!==false).length} active</p></div>
        {(user.role==="receptionist"||user.role==="admin")&&<button onClick={()=>setShowNew(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ New Patient</button>}
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone, date of birth, or insurance…" style={{width:"100%",padding:"10px 14px",borderRadius:8,border:`1px solid ${C.border}`,fontSize:14,color:C.text,outline:"none",background:C.surface,boxSizing:"border-box",marginBottom:16}}/>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#F7F9FC"}}>{["Patient","Status","DOB / Age","Phone","Insurance","Next Appt","Allergies",""].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{filt.map((p,i)=>{
            const next=nextAppt(p.id);
            const isOpen=quickMenu===p.id;
            return(
              <tr key={p.id} onClick={()=>setSel(p)} style={{borderBottom:i<filt.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",opacity:p.active===false?0.6:1}} onMouseEnter={e=>e.currentTarget.style.background="#F7F9FC"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"13px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:30,height:30,borderRadius:"50%",background:p.active===false?"#CBD5E1":C.navyMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{p.first_name[0]}{p.last_name[0]}</div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{p.first_name} {p.last_name}</div></div></td>
                <td style={{padding:"13px 16px"}}><Badge color={p.active===false?"red":"green"}>{p.active===false?"Inactive":"Active"}</Badge></td>
                <td style={{padding:"13px 16px",fontSize:13,color:C.muted}}>{fmt(p.dob)} · {age(p.dob)} yrs</td>
                <td style={{padding:"13px 16px",fontSize:13,color:C.muted}}>{p.phone}</td>
                <td style={{padding:"13px 16px",fontSize:13,color:C.muted}}>{p.insurance}</td>
                <td style={{padding:"13px 16px",fontSize:13,color:next?C.navyMid:C.muted}}>{next?`${next.date} ${next.time}`:"—"}</td>
                <td style={{padding:"13px 16px"}}>{p.allergies.length>0?<Badge color="red">{p.allergies.length} allerg{p.allergies.length>1?"ies":"y"}</Badge>:<span style={{fontSize:12,color:C.muted}}>None</span>}</td>
                <td style={{padding:"13px 16px"}} onClick={e=>e.stopPropagation()}>
                  <div style={{position:"relative"}}>
                    <button onClick={e=>{e.stopPropagation();setQuickMenu(isOpen?null:p.id);}} style={{fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,cursor:"pointer"}}>Actions ▾</button>
                    {isOpen&&(
                      <div style={{position:"absolute",right:0,top:"100%",marginTop:4,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",zIndex:50,minWidth:160}}>
                        {[
                          ["Book Appointment",()=>{setQuickMenu(null);setQuickNewAppt(p);}],
                          ["Add Recall",()=>{setQuickMenu(null);setQuickRecall(p);}],
                          ...(PERMS[user.role].vitals?[["Record Vitals",()=>{setQuickMenu(null);setQuickVitals(p);}]]:[]),
                          ["Open Profile",()=>{setQuickMenu(null);setSel(p);}],
                        ].map(([lbl,fn])=>(
                          <button key={lbl} onClick={fn} style={{display:"block",width:"100%",textAlign:"left",padding:"9px 14px",border:"none",background:"transparent",fontSize:13,color:C.text,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{lbl}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
      </Card>
    </div>
  );
}

function RecallsPage({recalls,setRecalls,patients}){
  const[filter,setFilter]=useState("all");const[showNew,setShowNew]=useState(false);
  const[sortDoc,setSortDoc]=useState("all");
  const[checked,setChecked]=useState(new Set());
  const[expandedLog,setExpandedLog]=useState(null);
  const[contactLogs,setContactLogs]=useState(INIT_CONTACT_LOGS);
  const[addingLog,setAddingLog]=useState(null);
  const[logForm,setLogForm]=useState({method:"Phone",outcome:""});
  const done=(ids)=>setRecalls(p=>p.filter(r=>!ids.includes(r.id)));
  const DOCTORS=["all",...[...new Set(recalls.map(r=>r.doctor||"").filter(Boolean))]];
  let filt=filter==="all"?recalls:recalls.filter(r=>r.urgency===filter);
  if(sortDoc!=="all")filt=filt.filter(r=>r.doctor===sortDoc);
  const toggleCheck=(id)=>setChecked(prev=>{const s=new Set(prev);s.has(id)?s.delete(id):s.add(id);return s;});
  const addLog=(recallId)=>{
    if(!logForm.outcome.trim())return;
    setContactLogs(prev=>({...prev,[recallId]:[...(prev[recallId]||[]),{id:Date.now(),date:today(),method:logForm.method,outcome:logForm.outcome.trim()}]}));
    setLogForm({method:"Phone",outcome:""});setAddingLog(null);
  };
  return(
    <div style={{padding:"28px 32px",maxWidth:900}}>
      {showNew&&<RecallModal onClose={()=>setShowNew(false)} onSave={r=>{setRecalls(p=>[...p,r]);setShowNew(false);}} patients={patients}/>}
      <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Recall & Follow-Up</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>{recalls.length} open recall{recalls.length!==1?"s":""}</p></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {checked.size>0&&<button onClick={()=>{done([...checked]);setChecked(new Set());}} style={{background:C.green,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Complete {checked.size} selected</button>}
          <button onClick={()=>setShowNew(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add Recall</button>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:8}}>
          {[["all","All","blue"],["high","Overdue","red"],["medium","This Week","amber"],["low","Upcoming","green"]].map(([id,lbl,col])=>{
            const cnt=id==="all"?recalls.length:recalls.filter(r=>r.urgency===id).length;const a=filter===id;
            const fg={blue:C.navyMid,red:C.red,amber:C.amber,green:C.green}[col];
            const bg={blue:C.blueBg,red:C.redBg,amber:C.amberBg,green:C.greenBg}[col];
            return<button key={id} onClick={()=>setFilter(id)} style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${a?fg:C.border}`,background:a?bg:C.surface,color:a?fg:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{lbl}{cnt>0&&<span style={{marginLeft:5,background:a?fg:C.border,color:a?"#fff":C.muted,padding:"0 5px",borderRadius:8,fontSize:10}}>{cnt}</span>}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:C.muted,fontWeight:600}}>Doctor:</span>
          <select value={sortDoc} onChange={e=>setSortDoc(e.target.value)} style={{...SS,width:"auto",padding:"6px 10px",fontSize:12}}>
            {DOCTORS.map(d=><option key={d} value={d}>{d==="all"?"All Doctors":d}</option>)}
          </select>
        </div>
      </div>
      <Card>
        {filt.length===0?(<div style={{padding:"48px",textAlign:"center"}}><div style={{fontSize:36,marginBottom:10}}>✓</div><div style={{fontWeight:600,color:C.text}}>All clear!</div><div style={{color:C.muted,fontSize:13,marginTop:4}}>No recalls in this category.</div></div>):filt.map((r,i)=>{
          const logs=contactLogs[r.id]||[];
          const isExpanded=expandedLog===r.id;
          return(
            <div key={r.id} style={{borderBottom:i<filt.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
                <input type="checkbox" checked={checked.has(r.id)} onChange={()=>toggleCheck(r.id)} style={{width:15,height:15,cursor:"pointer",flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,color:C.text}}>{r.patient}</div>
                  <div style={{fontSize:13,color:C.muted,marginTop:2}}>{r.reason}</div>
                  <div style={{display:"flex",gap:12,marginTop:3,alignItems:"center"}}>
                    <span style={{fontSize:12,color:r.urgency==="high"?C.red:C.muted,fontWeight:r.urgency==="high"?600:400}}>{r.urgency==="high"?"⚠ Overdue — ":"Due "}{fmt(r.due)}</span>
                    {r.doctor&&<span style={{fontSize:11,color:C.muted}}>· {r.doctor}</span>}
                    <button onClick={()=>setExpandedLog(isExpanded?null:r.id)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>{logs.length>0?`${logs.length} contact log${logs.length>1?"s":""}`:"+Log Contact"} {isExpanded?"▲":"▼"}</button>
                  </div>
                </div>
                <Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge>
                <button onClick={()=>done([r.id])} style={{padding:"7px 14px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.green,fontSize:12,fontWeight:600,cursor:"pointer"}}>Mark Complete</button>
              </div>
              {isExpanded&&(
                <div style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:"14px 20px 14px 52px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:10}}>Contact Log</div>
                  {logs.length===0&&<div style={{fontSize:13,color:C.muted,marginBottom:10}}>No contact attempts logged yet.</div>}
                  {logs.map(l=>(
                    <div key={l.id} style={{display:"flex",gap:12,marginBottom:8,fontSize:13}}>
                      <div style={{color:C.muted,width:80,flexShrink:0}}>{l.date}</div>
                      <div style={{width:60,flexShrink:0}}><Badge color="navy">{l.method}</Badge></div>
                      <div style={{color:C.text}}>{l.outcome}</div>
                    </div>
                  ))}
                  {addingLog===r.id?(
                    <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
                      <select value={logForm.method} onChange={e=>setLogForm(f=>({...f,method:e.target.value}))} style={{...SS,width:90,padding:"6px 8px",fontSize:12}}>
                        {["Phone","Email","Text","In Person"].map(m=><option key={m}>{m}</option>)}
                      </select>
                      <input value={logForm.outcome} onChange={e=>setLogForm(f=>({...f,outcome:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addLog(r.id)} placeholder="Outcome…" style={{...IS,flex:1,fontSize:12,marginBottom:0}} autoFocus/>
                      <PB onClick={()=>addLog(r.id)} disabled={!logForm.outcome.trim()}>Save</PB>
                      <XB onClick={()=>setAddingLog(null)}>Cancel</XB>
                    </div>
                  ):<button onClick={()=>setAddingLog(r.id)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer",marginTop:4}}>+ Log Attempt</button>}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function AdminPage(){
  const[tab,setTab]=useState("users");
  return(
    <div style={{padding:"28px 32px",maxWidth:900}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Admin Panel</h1></div>
      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${C.border}`}}>
        {["users","audit log","backup"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 20px",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:tab===t?700:400,color:tab===t?C.navyMid:C.muted,borderBottom:tab===t?`2px solid ${C.navyMid}`:"2px solid transparent",marginBottom:-1,textTransform:"capitalize"}}>{t}</button>)}
      </div>
      {tab==="users"&&(<Card><div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Staff Users</div><button style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add User</button></div><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:"#F7F9FC"}}>{["Name","Role","Status","Last Login",""].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead><tbody>{STAFF_LIST.map((s,i)=><tr key={s.id} style={{borderBottom:i<STAFF_LIST.length-1?`1px solid ${C.border}`:"none"}}><td style={{padding:"13px 16px",fontWeight:600,fontSize:13,color:C.text}}>{s.name}</td><td style={{padding:"13px 16px"}}><Badge color={s.role==="admin"?"purple":s.role==="doctor"?"navy":s.role==="nurse"?"green":"amber"}>{s.role}</Badge></td><td style={{padding:"13px 16px"}}><Badge color={s.status==="active"?"green":"red"}>{s.status}</Badge></td><td style={{padding:"13px 16px",fontSize:12,color:C.muted}}>{s.lastLogin}</td><td style={{padding:"13px 16px"}}><button style={{fontSize:12,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>Edit</button></td></tr>)}</tbody></table></Card>)}
      {tab==="audit log"&&(<Card style={{padding:"20px"}}><div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:16}}>Audit Log</div>{[{user:"Dr. Patel",action:"VIEW_PATIENT",detail:"Margaret Chen",time:"09:14"},{user:"James Torres",action:"RECORD_VITALS",detail:"Derek Marsh",time:"09:02"},{user:"Brianna Wells",action:"CHECK_IN",detail:"Margaret Chen",time:"08:55"},{user:"admin",action:"LOGIN",detail:"",time:"08:30"}].map((l,i,arr)=><div key={i} style={{padding:"11px 0",display:"flex",alignItems:"center",gap:14,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}><div style={{fontSize:11,color:C.muted,width:40,flexShrink:0}}>{l.time}</div><div style={{width:140,flexShrink:0}}><Badge color="navy">{l.action}</Badge></div><div style={{fontSize:13,color:C.text,flex:1}}>{l.user}{l.detail&&<span style={{color:C.muted}}> → {l.detail}</span>}</div></div>)}</Card>)}
      {tab==="backup"&&(<Card style={{padding:"24px"}}><div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:6}}>Database Backup</div><div style={{fontSize:13,color:C.muted,marginBottom:20}}>Last backup: never</div><button style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Run Backup Now</button></Card>)}
    </div>
  );
}

function SettingsPage({user,settings,setSettings,setPage}){
  const[saved,setSaved]=useState(false);
  const[local,setLocal]=useState(settings||INIT_SETTINGS);
  const s=(k,v)=>setLocal(p=>({...p,[k]:v}));
  const save=()=>{setSettings(local);setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const lbl={display:"block",fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6};
  return(
    <div style={{padding:"28px 32px",maxWidth:640}}>
      <h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:"0 0 28px"}}>Settings</h1>
      {user.role==="admin"&&(
        <div style={{background:C.blueBg,border:`1px solid #C5D8F8`,borderRadius:10,padding:"14px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:18}}>⚙</span>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:C.navyMid}}>Admin Panel</div><div style={{fontSize:12,color:C.muted}}>Manage staff users, audit logs, and backup from the Admin Panel.</div></div>
          <button onClick={()=>setPage("admin")} style={{fontSize:12,fontWeight:700,color:C.navyMid,background:"none",border:`1px solid ${C.navyMid}`,borderRadius:6,padding:"6px 14px",cursor:"pointer"}}>Go to Admin →</button>
        </div>
      )}
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Clinic Information</div></div>
        <div style={{padding:"20px"}}>
          <div style={{marginBottom:14}}><label style={lbl}>Clinic Name</label><input value={local.clinicName} onChange={e=>s("clinicName",e.target.value)} style={IS}/></div>
          <div style={{marginBottom:14}}><label style={lbl}>Address</label><input value={local.address} onChange={e=>s("address",e.target.value)} style={IS}/></div>
          <div style={{marginBottom:6}}><label style={lbl}>Phone</label><input value={local.phone} onChange={e=>s("phone",e.target.value)} style={IS}/></div>
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Scheduling Defaults</div></div>
        <div style={{padding:"20px"}}>
          <div style={{marginBottom:6}}><label style={lbl}>Default Appointment Duration</label>
            <select value={local.defaultDuration} onChange={e=>s("defaultDuration",parseInt(e.target.value))} style={{...SS,maxWidth:200}}>
              {[15,20,30,45,60].map(d=><option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Clinic Hours</div></div>
        <div style={{padding:"20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr",gap:"8px 12px",alignItems:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Day</div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Open</div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Close</div>
            {DAYS.map(day=>[
              <div key={day+"-d"} style={{fontSize:13,fontWeight:600,color:C.text}}>{day}</div>,
              <input key={day+"-o"} type="time" value={(local.clinicHours||{})[day]?.[0]||""} onChange={e=>s("clinicHours",{...local.clinicHours,[day]:[e.target.value,local.clinicHours[day]?.[1]||""]})} style={{...IS,fontSize:13}}/>,
              <input key={day+"-c"} type="time" value={(local.clinicHours||{})[day]?.[1]||""} onChange={e=>s("clinicHours",{...local.clinicHours,[day]:[local.clinicHours[day]?.[0]||"",e.target.value]})} style={{...IS,fontSize:13}}/>,
            ])}
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Notification Preferences</div></div>
        <div style={{padding:"20px"}}>
          {[["messages","New message notifications"],["recalls","Urgent recall alerts"]].map(([key,label])=>(
            <label key={key} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,cursor:"pointer"}}>
              <input type="checkbox" checked={local.notifications?.[key]??true} onChange={e=>s("notifications",{...local.notifications,[key]:e.target.checked})} style={{width:16,height:16,cursor:"pointer"}}/>
              <div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{label}</div></div>
            </label>
          ))}
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Change Password</div></div>
        <div style={{padding:"20px"}}>
          {["Current Password","New Password","Confirm New Password"].map(l=><div key={l} style={{marginBottom:14}}><label style={lbl}>{l}</label><input type="password" style={IS}/></div>)}
          <button style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Update Password</button>
        </div>
      </Card>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={save} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Save All Settings</button>
        {saved&&<span style={{color:C.green,fontSize:13,fontWeight:600}}>✓ Saved</span>}
      </div>
    </div>
  );
}

function LoginPage({onLogin}){
  const[u,su]=useState("");const[p,sp]=useState("");const[err,se]=useState("");const[loading,sl]=useState(false);
  const quick=async(usr)=>{sl(true);await new Promise(r=>setTimeout(r,450));onLogin(usr);};
  const submit=async()=>{sl(true);se("");await new Promise(r=>setTimeout(r,600));const f=DEMO_USERS.find(x=>x.username===u&&x.password===p);if(f)onLogin(f);else{se("Invalid username or password.");sl(false);}};
  return(
    <div style={{minHeight:"100vh",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{textAlign:"center",marginBottom:32}}><div style={{width:54,height:54,background:"#E8F0FE",borderRadius:14,display:"inline-flex",alignItems:"center",justifyContent:"center",color:C.navyMid,fontWeight:900,fontSize:26,marginBottom:14}}>✚</div><div style={{color:"#fff",fontSize:22,fontWeight:800}}>Clinic Manager</div><div style={{color:"rgba(255,255,255,0.45)",fontSize:13,marginTop:4}}>Sign in to your account</div></div>
        <div style={{marginBottom:20}}>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"center",marginBottom:12}}>Quick Login — Try a Role</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {DEMO_USERS.map(usr=>(
              <button key={usr.username} onClick={()=>quick(usr)} disabled={loading} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <div style={{width:28,height:28,borderRadius:7,background:RC[usr.role].bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{RI[usr.role]}</div>
                  <div><div style={{color:"#fff",fontSize:13,fontWeight:700,textTransform:"capitalize"}}>{usr.role}</div><div style={{color:"rgba(255,255,255,0.45)",fontSize:11}}>{usr.name}</div></div>
                </div>
                <div style={{background:"rgba(0,0,0,0.2)",borderRadius:5,padding:"3px 8px",display:"inline-block"}}><span style={{color:"rgba(255,255,255,0.45)",fontSize:10}}>{usr.username} / {usr.password}</span></div>
              </button>
            ))}
          </div>
        </div>
        <div style={{background:C.surface,borderRadius:14,padding:24}}>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"center",marginBottom:14}}>Or sign in manually</div>
          {err&&<div style={{background:C.redBg,color:C.red,padding:"10px 14px",borderRadius:7,fontSize:13,marginBottom:14}}>{err}</div>}
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Username</label><input value={u} onChange={e=>su(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:7,border:`1px solid ${C.border}`,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          <div style={{marginBottom:18}}><label style={{display:"block",fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Password</label><input type="password" value={p} onChange={e=>sp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{width:"100%",padding:"9px 12px",borderRadius:7,border:`1px solid ${C.border}`,fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          <button onClick={submit} disabled={loading} style={{width:"100%",background:loading?"#9BB5D9":C.navyMid,color:"#fff",border:"none",borderRadius:8,padding:"11px",fontSize:14,fontWeight:700,cursor:"pointer"}}>{loading?"Signing in…":"Sign In"}</button>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const[user,setUser]=useState(null);const[page,setPage]=useState("dashboard");
  const[patients,setPatients]=useState(INIT_PATIENTS);
  const[appts,setAppts]=useState(INIT_APPTS);
  const[recalls,setRecalls]=useState(INIT_RECALLS);
  const[vitals,setVitals]=useState(INIT_VITALS);
  const[rx,setRx]=useState(INIT_RX);
  const[notes,setNotes]=useState(INIT_NOTES);
  const[messages,setMessages]=useState(INIT_MESSAGES);
  const[settings,setSettings]=useState(INIT_SETTINGS);

  if(!user)return<LoginPage onLogin={u=>{setUser(u);setPage("dashboard");}}/>;
  const p=PERMS[user.role];
  const overdueCount=recalls.filter(r=>r.urgency==="high").length;

  // Count unread messages for the sidebar badge
  const unreadMsgCount = STAFF_LIST
    .filter(s => s.username !== user.username)
    .reduce((sum, contact) => {
      const key = buildConvoKey(user.username, contact.username);
      const msgs = messages[key] || [];
      return sum + msgs.filter(m => m.from === contact.username && !m.read).length;
    }, 0);

  const pages={
    dashboard:<Dashboard user={user} setPage={setPage} appts={appts} recalls={recalls}/>,
    appointments:p.appointments?<ApptsPage user={user} appts={appts} setAppts={setAppts} patients={patients} settings={settings}/>:<Locked/>,
    flow:p.flow?<PatientFlowPage user={user} appts={appts} setAppts={setAppts}/>:<Locked/>,
    patients:p.patients?<PatientsPage user={user} patients={patients} setPatients={setPatients} vitals={vitals} setVitals={setVitals} rx={rx} setRx={setRx} notes={notes} setNotes={setNotes} recalls={recalls} setRecalls={setRecalls} appts={appts} setAppts={setAppts}/>:<Locked/>,
    recalls:p.recalls?<RecallsPage recalls={recalls} setRecalls={setRecalls} patients={patients}/>:<Locked/>,
    messages:p.messages?<MessagesPage user={user} messages={messages} setMessages={setMessages}/>:<Locked msg="Messaging is not available for your role."/>,
    reports:p.reports?<ReportsPage appts={appts} recalls={recalls} patients={patients}/>:<Locked msg="Reports are restricted to administrators."/>,
    admin:p.admin?<AdminPage/>:<Locked msg="Admin panel is restricted to administrators only."/>,
    settings:p.settings?<SettingsPage user={user} settings={settings} setSettings={setSettings} setPage={setPage}/>:<Locked msg="Settings are restricted to doctors and admins."/>,
  };
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      <Sidebar page={page} setPage={setPage} user={user} recallCount={overdueCount} unreadMsgCount={unreadMsgCount}/>
      <main style={{flex:1,overflow:(page==="messages"||page==="flow")?"hidden":"auto",background:C.bg,display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"flex-end",padding:"10px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          <button onClick={()=>setUser(null)} style={{fontSize:12,color:C.muted,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 12px",cursor:"pointer"}}>← Switch Role</button>
        </div>
        <div style={{flex:1,overflow:(page==="messages"||page==="flow")?"hidden":"auto"}}>
          {pages[page]}
        </div>
      </main>
    </div>
  );
}
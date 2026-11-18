"use client";
import React, { useState, useRef, useEffect } from "react";
import { CircleAlert, CircleCheck } from "lucide-react";
import { MessagesDock, MessagesPage } from "./Messages";
import { Dashboard } from "./dashboard";
import { ACCOUNTS_KEY, StaffContext, isAdminAddOn, permsFor } from "./lib/accounts";
import { INIT_ACCOUNTS, INIT_APPTS, INIT_AUDIT_LOG, INIT_BLOCK_TIMES, INIT_DOCTOR_STATUS, INIT_INVENTORY, INIT_MESSAGES, INIT_NOTES, INIT_PATIENTS, INIT_RECALLS, INIT_REFILL_REQUESTS, INIT_REMINDER_LOGS, INIT_RX, INIT_SETTINGS, INIT_STAFF_SCHEDULE, INIT_TASKS, INIT_VITALS_FULL, INIT_WAITLIST, buildConvoKey } from "./lib/data";
import { today } from "./lib/utils";
import { EndOfDayModal, FollowUpModal } from "./modals";
import { AdminPage } from "./pages/AdminPage";
import { ApptsPage } from "./pages/AppointmentsPage";
import { InventoryPage } from "./pages/InventoryPage";
import { PatientFlowPage } from "./pages/PatientFlowPage";
import { PatientsPage } from "./pages/PatientsPage";
import { RecallsPage } from "./pages/RecallsPage";
import { RefillQueuePage } from "./pages/RefillQueuePage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StaffSchedulePage } from "./pages/StaffSchedulePage";
import { TasksPage } from "./pages/TasksPage";
import { GlobalSearch, LoginPage, MANAGE_ONLY, MANAGE_SHARED, Sidebar, TopBar } from "./shell";
import { C, Locked } from "./ui";

export default function App(){
  const[accounts,setAccounts]=useState(INIT_ACCOUNTS);
  // Load saved accounts after mount (keeps server and client HTML the same), then save every change
  const accountsLoaded=useRef(false);
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(ACCOUNTS_KEY));if(Array.isArray(saved)&&saved.length)setAccounts(saved);}catch{}accountsLoaded.current=true;},[]);
  useEffect(()=>{if(accountsLoaded.current)try{localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(accounts));}catch{}},[accounts]);
  const[sessionId,setSessionId]=useState(null);
  // The signed-in account is read live, so permission changes apply straight away
  const user=accounts.find(a=>a.id===sessionId&&a.status==="active")||null;
  const setUser=u=>setSessionId(u?u.id:null);const[page,setPageRaw]=useState("dashboard");
  // "manage" = the Manage clinic area for accounts with admin access on top of their own role
  const[area,setArea]=useState("work");
  const managing=area==="manage"&&isAdminAddOn(user);
  useEffect(()=>{if(area==="manage"&&user&&!isAdminAddOn(user)){setArea("work");setPageRaw("dashboard");}},[area,user]);
  const setPage=id=>{
    if(MANAGE_ONLY.includes(id))setArea("manage");
    else if(!MANAGE_SHARED.includes(id))setArea("work");
    setPageRaw(id);
  };
  const[patients,setPatients]=useState(INIT_PATIENTS);
  const[appts,setAppts]=useState(INIT_APPTS);
  const[recalls,setRecalls]=useState(INIT_RECALLS);
  const[vitals,setVitals]=useState(INIT_VITALS_FULL);
  const[rx,setRx]=useState(INIT_RX);
  const[notes,setNotes]=useState(INIT_NOTES);
  const[draftNotes,setDraftNotes]=useState({});
  const[messages,setMessages]=useState(INIT_MESSAGES);
  const[chatOpen,setChatOpen]=useState(false);
  const[chatContactId,setChatContactId]=useState(null);
  const lastPageRef=useRef("dashboard");
  useEffect(()=>{if(page!=="messages")lastPageRef.current=page;},[page]);
  const[settings,setSettings]=useState(INIT_SETTINGS);
  const[doctorStatus,setDoctorStatus]=useState(INIT_DOCTOR_STATUS);
  const[reminderLogs,setReminderLogs]=useState(INIT_REMINDER_LOGS);
  const[blockTimes,setBlockTimes]=useState(INIT_BLOCK_TIMES);
  const[waitlist,setWaitlist]=useState(INIT_WAITLIST);
  const[refillRequests,setRefillRequests]=useState(INIT_REFILL_REQUESTS);
  const[recentPatients,setRecentPatients]=useState([]);
  const[tasks,setTasks]=useState(INIT_TASKS);
  const[auditLog,setAuditLog]=useState(INIT_AUDIT_LOG);
  const[inventory,setInventory]=useState(INIT_INVENTORY);
  const[staffSchedule,setStaffSchedule]=useState(INIT_STAFF_SCHEDULE);
  // Theme: follows the device by default; Settings can pin it to light or dark.
  const[themePref,setThemePref]=useState(()=>{
    try{
      const saved=localStorage.getItem("clinicTheme");
      if(saved==="light"||saved==="dark"||saved==="system")return saved;
      const legacy=localStorage.getItem("clinicDark");
      if(legacy==="1")return "dark";
    }catch{}
    return "system";
  });
  const[systemDark,setSystemDark]=useState(()=>{try{return window.matchMedia("(prefers-color-scheme: dark)").matches;}catch{return false;}});
  useEffect(()=>{
    let mq;try{mq=window.matchMedia("(prefers-color-scheme: dark)");}catch{return;}
    const onChange=e=>setSystemDark(e.matches);
    mq.addEventListener?.("change",onChange);
    return()=>mq.removeEventListener?.("change",onChange);
  },[]);
  const darkMode=themePref==="dark"||(themePref==="system"&&systemDark);
  useEffect(()=>{
    if(darkMode){document.documentElement.setAttribute("data-dark","");}
    else{document.documentElement.removeAttribute("data-dark");}
  },[darkMode]);
  useEffect(()=>{try{localStorage.setItem("clinicTheme",themePref);localStorage.removeItem("clinicDark");}catch{}},[themePref]);
  const[globalSearchOpen,setGlobalSearchOpen]=useState(false);
  const[openPatientId,setOpenPatientId]=useState(null);
  const[eodShown,setEodShown]=useState(false);
  const[eodModal,setEodModal]=useState(false);
  const[toast,setToast]=useState(null);
  const[pendingFollowUp,setPendingFollowUp]=useState(null);

  const showToast=(msg,color="green")=>{
    setToast({msg,color});
    setTimeout(()=>setToast(null),3000);
  };

  const noShowHandler=(id)=>{
    const a=appts.find(x=>x.id===id);
    if(!a)return;
    setAppts(p=>p.map(x=>x.id===id?{...x,status:"no-show"}:x));
    const dueDate=new Date();dueDate.setDate(dueDate.getDate()+3);
    const dueStr=dueDate.toISOString().split("T")[0];
    setRecalls(p=>[...p,{id:Date.now(),patient:a.patient,reason:"No-show — reschedule appointment",due:dueStr,urgency:"medium",doctor:a.doctor||""}]);
    showToast(`Recall created for ${a.patient}`,"amber");
  };

  const completeHandler=(id)=>{
    const a=appts.find(x=>x.id===id);
    if(!a)return;
    setAppts(p=>p.map(x=>x.id===id?{...x,status:"completed"}:x));
    setPendingFollowUp({patient:a.patient,doctor:a.doctor,date:a.date});
    // EOD check
    const todayStr=today();
    const todayAppts=appts.filter(x=>(x.date||"2026-02-25")===todayStr);
    const allDone=todayAppts.every(x=>x.id===id||x.status==="completed"||x.status==="no-show");
    if(allDone&&!eodShown&&todayAppts.length>0){setEodModal(true);setEodShown(true);}
  };

  const onOpenPatient=(patient)=>{
    setRecentPatients(prev=>{
      const filtered=prev.filter(p=>p.id!==patient.id);
      return [patient,...filtered].slice(0,5);
    });
  };

  const addAudit=(action,subject,section)=>{
    if(!user)return;
    const now=new Date();
    const ts=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0")+" "+String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0")+":"+String(now.getSeconds()).padStart(2,"0");
    setAuditLog(prev=>[{id:Date.now(),user:user.name,role:user.role,action,subject,section,ts},...prev]);
  };

  useEffect(()=>{
    const handler=(e)=>{
      if(e.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"){
        e.preventDefault();setGlobalSearchOpen(true);
      }
    };
    document.addEventListener("keydown",handler);
    return()=>document.removeEventListener("keydown",handler);
  },[]);

  if(!user)return<LoginPage accounts={accounts} onLogin={u=>{setUser(u);setArea("work");setPage("dashboard");setRecentPatients([]);}}/>;
  const p=permsFor(user);
  const overdueCount=recalls.filter(r=>r.urgency==="high").length;
  const pendingRefills=refillRequests.filter(r=>r.status==="pending").length;

  const unreadMsgCount = accounts
    .filter(s => s.username !== user.username)
    .reduce((sum, contact) => {
      const key = buildConvoKey(user.username, contact.username);
      const msgs = messages[key] || [];
      return sum + msgs.filter(m => m.from === contact.username && !m.read).length;
    }, 0);

  const pages={
    dashboard:<Dashboard user={user} setPage={setPage} appts={appts} recalls={recalls} refillRequests={refillRequests} inventory={inventory} staffSchedule={staffSchedule} tasks={tasks} patients={patients}/>,
    appointments:p.appointments?<ApptsPage user={user} appts={appts} setAppts={setAppts} patients={patients} settings={settings} reminderLogs={reminderLogs} setReminderLogs={setReminderLogs} waitlist={waitlist} setWaitlist={setWaitlist} blockTimes={blockTimes} recalls={recalls} setRecalls={setRecalls} showToast={showToast} noShowHandler={noShowHandler} completeHandler={completeHandler} pendingFollowUp={pendingFollowUp} setPendingFollowUp={setPendingFollowUp}/>:<Locked/>,
    flow:p.flow?<PatientFlowPage user={user} appts={appts} setAppts={setAppts} doctorStatus={doctorStatus} setDoctorStatus={setDoctorStatus} patients={patients} showToast={showToast} recalls={recalls} setRecalls={setRecalls} noShowHandler={noShowHandler} completeHandler={completeHandler} setPendingFollowUp={setPendingFollowUp} pendingFollowUp={pendingFollowUp}/>:<Locked/>,
    patients:p.patients?<PatientsPage user={user} patients={patients} setPatients={setPatients} vitals={vitals} setVitals={setVitals} rx={rx} setRx={setRx} notes={notes} setNotes={setNotes} draftNotes={draftNotes} setDraftNotes={setDraftNotes} recalls={recalls} setRecalls={setRecalls} appts={appts} setAppts={setAppts} refillRequests={refillRequests} setRefillRequests={setRefillRequests} onOpenPatient={onOpenPatient} openPatientId={openPatientId} setOpenPatientId={setOpenPatientId} setPage={setPage} showToast={showToast} addAudit={addAudit}/>:<Locked/>,
    recalls:p.recalls?<RecallsPage recalls={recalls} setRecalls={setRecalls} patients={patients} appts={appts} setAppts={setAppts} blockTimes={blockTimes}/>:<Locked/>,
    messages:p.messages?<MessagesPage user={user} messages={messages} setMessages={setMessages} contactId={chatContactId} setContactId={setChatContactId} onMinimize={()=>{setPage(lastPageRef.current);setChatOpen(true);}}/>:<Locked msg="Messaging is not available for your role."/>,
    reports:(p.reports||managing)?<ReportsPage appts={appts} recalls={recalls} patients={patients}/>:<Locked msg="Reports are restricted to administrators."/>,
    refills:p.refills?<RefillQueuePage user={user} patients={patients} rx={rx} setRx={setRx} refillRequests={refillRequests} setRefillRequests={setRefillRequests}/>:<Locked msg="Refill queue access is not available for your role."/>,
    tasks:p.tasks?<TasksPage user={user} tasks={tasks} setTasks={setTasks}/>:<Locked msg="Tasks are not available for your role."/>,
    inventory:(p.inventory||managing)?<InventoryPage inventory={inventory} setInventory={setInventory}/>:<Locked msg="Inventory is not available for your role."/>,
    staffschedule:(p.staffSchedule||managing)?<StaffSchedulePage staffSchedule={staffSchedule} setStaffSchedule={setStaffSchedule}/>:<Locked msg="Staff schedule is restricted to administrators."/>,
    admin:(p.admin&&user.role==="admin")?<AdminPage auditLog={auditLog} accounts={accounts} setAccounts={setAccounts} user={user} addAudit={addAudit} showToast={showToast}/>:<Locked msg="Admin panel is restricted to administrators only."/>,
    overview:managing?<Dashboard user={user} view="admin" setPage={setPage} appts={appts} recalls={recalls} refillRequests={refillRequests} inventory={inventory} staffSchedule={staffSchedule} tasks={tasks} patients={patients}/>:<Locked msg="Manage clinic needs admin access."/>,
    accounts:managing?<AdminPage key="accounts" title="Staff and accounts" tabs={["users","login history"]} auditLog={auditLog} accounts={accounts} setAccounts={setAccounts} user={user} addAudit={addAudit} showToast={showToast}/>:<Locked msg="Manage clinic needs admin access."/>,
    audit:managing?<AdminPage key="audit" title="Audit log" tabs={["audit log"]} auditLog={auditLog} accounts={accounts} setAccounts={setAccounts} user={user} addAudit={addAudit} showToast={showToast}/>:<Locked msg="Manage clinic needs admin access."/>,
    backup:managing?<AdminPage key="backup" title="Backup" tabs={["backup"]} auditLog={auditLog} accounts={accounts} setAccounts={setAccounts} user={user} addAudit={addAudit} showToast={showToast}/>:<Locked msg="Manage clinic needs admin access."/>,
    settings:p.settings?<SettingsPage user={user} settings={settings} setSettings={setSettings} setPage={setPage} blockTimes={blockTimes} setBlockTimes={setBlockTimes} themePref={themePref} setThemePref={setThemePref}/>:<Locked msg="Settings are restricted to doctors and admins."/>,
  };
  return(
    <StaffContext.Provider value={accounts}>
    <div style={{display:"flex",height:"100vh",fontFamily:"var(--font-sans), system-ui, sans-serif",overflow:"hidden"}}>
      {globalSearchOpen&&<GlobalSearch patients={patients} appts={appts} onClose={()=>setGlobalSearchOpen(false)} onSelectPatient={(pt)=>{setOpenPatientId(pt.id);setPage("patients");setGlobalSearchOpen(false);onOpenPatient(pt);}} onSelectAppt={()=>{setPage("appointments");setGlobalSearchOpen(false);}}/>}
      {eodModal&&<EndOfDayModal onClose={()=>setEodModal(false)}/>}
      {pendingFollowUp&&<FollowUpModal patient={pendingFollowUp.patient} doctor={pendingFollowUp.doctor} onClose={()=>setPendingFollowUp(null)} onBook={(date)=>{setPendingFollowUp(null);setPage("appointments");}}/>}
      {toast&&<div style={{position:"fixed",bottom:(p.messages&&page!=="messages")?(chatOpen?444:56):24,right:24,zIndex:9999,background:C.navyMid,color:C.onAccent,borderRadius:8,padding:"12px 16px",fontSize:14,fontWeight:500,boxShadow:"var(--shadow-lg)",animation:"rise 220ms var(--ease)",display:"flex",alignItems:"center",gap:10,minWidth:280}}>{toast.color==="green"?<CircleCheck size={18} strokeWidth={2} aria-hidden="true" style={{color:"var(--c-green)"}}/>:<CircleAlert size={18} strokeWidth={2} aria-hidden="true" style={{color:toast.color==="amber"?"var(--c-amber)":"var(--c-red)"}}/>}{toast.msg}</div>}
      {p.messages&&page!=="messages"&&<MessagesDock user={user} messages={messages} setMessages={setMessages} unread={unreadMsgCount} open={chatOpen} setOpen={setChatOpen} contactId={chatContactId} setContactId={setChatContactId} onMaximize={()=>{setChatOpen(false);setPage("messages");}}/>}
      <Sidebar page={page} setPage={setPage} user={user} recallCount={overdueCount} pendingRefills={pendingRefills}
        managing={managing} onManage={()=>{setArea("manage");setPageRaw("overview");}} onBackToWork={()=>{setArea("work");setPageRaw("dashboard");}}
        onLogout={()=>{setArea("work");setUser(null);setChatOpen(false);setChatContactId(null);}}/>
      <main style={{flex:1,minWidth:0,overflow:"hidden",background:C.bg,display:"flex",flexDirection:"column",minHeight:0}}>
        <TopBar page={page} area={managing?"Manage clinic":null} clinicName={settings.clinicName} onSearchClick={()=>setGlobalSearchOpen(true)} canMessage={p.messages} unreadMsgCount={unreadMsgCount} onMessagesClick={()=>{if(page!=="messages")setChatOpen(o=>!o);}}
          recentPatients={recentPatients} onOpenRecent={pt=>{setOpenPatientId(pt.id);setPage("patients");}}
          doctorReady={!!doctorStatus[user.name]} onToggleReady={user.role==="doctor"?()=>setDoctorStatus(prev=>({...prev,[user.name]:!prev[user.name]})):null}/>
        <div style={{flex:1,overflow:(page==="messages"||page==="flow")?"hidden":"auto"}}>
          <div key={page} style={{height:"100%",animation:"rise 220ms var(--ease)",display:(page==="messages"||page==="flow")?"flex":"block",flexDirection:"column",overflow:(page==="messages"||page==="flow")?"hidden":"visible"}}>
            {pages[page]}
          </div>
        </div>
      </main>
    </div>
    </StaffContext.Provider>
  );
}

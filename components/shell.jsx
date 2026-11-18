import React, { useState, useRef, useEffect } from "react";
import { Search, Mail, ChevronDown, Settings, LogOut, CalendarDays, ShieldCheck, X, UserRound, ArrowLeft } from "lucide-react";
import { DEMO_ORDER, isAdminAddOn, permsFor } from "./lib/accounts";
import { ROLE_LABEL } from "./lib/data";
import { fmt, initials } from "./lib/utils";
import { AdminMark, Alert, Badge, C, Dot, IS, Icon, LS, Logo, NAV_ICON, ROLE_ICON, SB } from "./ui";

// ─── App shell: sidebar + header ─────────────────────────────────────────────
export const PAGE_LABEL={overview:"Overview",accounts:"Staff and accounts",audit:"Audit log",backup:"Backup",dashboard:"Dashboard",appointments:"Appointments",flow:"Patient flow",patients:"Patients",refills:"Refill queue",recalls:"Recalls",reports:"Reports",tasks:"Tasks",inventory:"Inventory",staffschedule:"Staff schedule",admin:"Admin panel",settings:"Settings",messages:"Messages"};
// Nav grouped by what each role does all day. Admin (office admin) leads with operations.
export const NAV_GROUPS={
  admin:[
    {label:null,      ids:["dashboard","reports"]},
    {label:"Operations",ids:["staffschedule","inventory","tasks","admin"]},
    {label:"Clinical",  ids:["appointments","flow","patients","refills","recalls"]},
  ],
  default:[
    {label:null,      ids:["dashboard","flow","appointments"]},
    {label:"Patients",  ids:["patients","refills","recalls"]},
    {label:"Work",      ids:["tasks","inventory","staffschedule","reports"]},
  ],
};
// The "Manage clinic" area for accounts with admin access on top of their own role
export const MANAGE_NAV=[
  {label:null,     ids:["overview"]},
  {label:"People", ids:["accounts","staffschedule"]},
  {label:"Clinic", ids:["reports","inventory"]},
  {label:"Records",ids:["audit","backup"]},
];
export const MANAGE_ONLY=["overview","accounts","audit","backup"], MANAGE_SHARED=["staffschedule","reports","inventory"];
export function Sidebar({page,setPage,user,recallCount,pendingRefills,onLogout,managing,onManage,onBackToWork}){
  const p=permsFor(user);
  const show={dashboard:true,appointments:p.appointments,flow:p.flow,patients:p.patients,refills:p.refills,recalls:p.recalls,reports:p.reports,tasks:p.tasks,inventory:p.inventory,staffschedule:p.staffSchedule,admin:p.admin};
  const badge={refills:p.refillApprove?pendingRefills:0,recalls:recallCount};
  const groups=managing?MANAGE_NAV:(NAV_GROUPS[user.role]||NAV_GROUPS.default).map(g=>({...g,ids:g.ids.filter(id=>show[id])})).filter(g=>g.ids.length);
  const addOn=isAdminAddOn(user);
  const[profileOpen,setProfileOpen]=useState(false);
  const profileRef=useRef(null);
  useEffect(()=>{
    const onClick=(e)=>{if(profileRef.current&&!profileRef.current.contains(e.target))setProfileOpen(false);};
    document.addEventListener("mousedown",onClick);
    return ()=>document.removeEventListener("mousedown",onClick);
  },[]);
  const menuItem={display:"flex",alignItems:"center",gap:10,width:"100%",height:36,padding:"0 10px",border:"none",borderRadius:6,background:"transparent",color:C.text,fontSize:13,textAlign:"left",cursor:"pointer",fontFamily:"inherit"};
  return(
    <nav aria-label="Main" style={{width:232,flexShrink:0,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{height:56,display:"flex",alignItems:"center",padding:"0 24px",flexShrink:0}}><Logo/></div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 12px 12px"}}>
        {managing&&(
          <div style={{marginBottom:16}}>
            <button className="nav-item" onClick={onBackToWork}><Icon as={ArrowLeft} size={18}/><span style={{flex:1}}>Back to my work</span></button>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"16px 12px 0",fontSize:13,fontWeight:600,color:C.text}}><ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true"/>Manage clinic</div>
          </div>
        )}
        {groups.map((g,gi)=>(
          <div key={gi} style={{marginTop:gi?20:0}}>
            {g.label&&<div style={{fontSize:12,color:C.muted,padding:"0 12px 6px"}}>{g.label}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {g.ids.map(id=>{const n=badge[id]||0;return(
                <button key={id} className="nav-item" aria-current={page===id?"page":undefined} onClick={()=>setPage(id)}>
                  <Icon as={NAV_ICON[id]} size={18}/>
                  <span style={{flex:1,whiteSpace:"nowrap"}}>{PAGE_LABEL[id]}</span>
                  {n>0&&<span aria-label={`${n} need attention`} style={{minWidth:20,height:20,padding:"0 6px",borderRadius:10,fontSize:11,fontWeight:600,display:"inline-flex",alignItems:"center",justifyContent:"center",fontVariantNumeric:"tabular-nums",background:id==="recalls"?C.redBg:C.raised,color:id==="recalls"?C.red:C.text2}}>{n}</span>}
                </button>
              );})}
            </div>
          </div>
        ))}
      </div>
      <div ref={profileRef} style={{position:"relative",padding:12,borderTop:`1px solid ${C.border}`}}>
        {profileOpen&&(
          <div role="menu" style={{position:"absolute",bottom:"calc(100% - 4px)",left:12,right:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)",padding:6,zIndex:500,animation:"rise 160ms var(--ease)"}}>
            <div style={{padding:"8px 10px 10px",borderBottom:`1px solid ${C.border}`,marginBottom:6,display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.text2}}><Icon as={ROLE_ICON[user.role]} size={14}/><span style={{flex:1}}>{ROLE_LABEL[user.role]||user.role} account</span>{addOn&&<AdminMark/>}</div>
            {addOn&&(managing
              ?<button role="menuitem" className="icon-btn" onClick={()=>{setProfileOpen(false);onBackToWork();}} style={menuItem}><Icon as={ArrowLeft}/> Back to my work</button>
              :<button role="menuitem" className="icon-btn" onClick={()=>{setProfileOpen(false);onManage();}} style={menuItem}><Icon as={ShieldCheck}/> Manage clinic</button>)}
            {p.settings&&<button role="menuitem" className="icon-btn" onClick={()=>{setPage("settings");setProfileOpen(false);}} style={menuItem}><Icon as={Settings}/> Settings</button>}
            <button role="menuitem" className="icon-btn" onClick={()=>{setProfileOpen(false);onLogout();}} style={menuItem}><Icon as={LogOut}/> Log out</button>
          </div>
        )}
        <button onClick={()=>setProfileOpen(v=>!v)} aria-expanded={profileOpen} className="icon-btn" style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 12px",border:"none",borderRadius:6,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
          <span style={{width:32,height:32,borderRadius:"50%",background:C.raised,border:`1px solid ${C.border}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500,flexShrink:0}}>{initials(user.name)}</span>
          <span style={{flex:1,minWidth:0}}>
            <span style={{display:"block",fontSize:13,fontWeight:500,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</span>
            <span style={{display:"block",fontSize:12,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.title}</span>
          </span>
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,transform:profileOpen?"rotate(180deg)":"none",transition:"transform 160ms var(--ease)"}}/>
        </button>
      </div>
    </nav>
  );
}

export function TopBar({page,area,clinicName,onSearchClick,onMessagesClick,unreadMsgCount,canMessage,recentPatients,onOpenRecent,doctorReady,onToggleReady}){
  const[recentOpen,setRecentOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const onClick=(e)=>{if(ref.current&&!ref.current.contains(e.target))setRecentOpen(false);};
    document.addEventListener("mousedown",onClick);
    return ()=>document.removeEventListener("mousedown",onClick);
  },[]);
  const ghost={height:32,padding:"0 12px",borderRadius:6,border:`1px solid ${C.border2}`,background:C.surface,color:C.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",whiteSpace:"nowrap"};
  return(
    <header style={{height:56,flexShrink:0,display:"flex",alignItems:"center",gap:12,padding:"0 32px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
      <div aria-label="Breadcrumb" style={{display:"flex",alignItems:"center",gap:8,fontSize:13,minWidth:0,flex:1}}>
        <span style={{color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{area||clinicName}</span>
        <span aria-hidden="true" style={{color:C.border2}}>/</span>
        <span style={{color:C.text,fontWeight:500,whiteSpace:"nowrap"}}>{PAGE_LABEL[page]||page}</span>
      </div>
      {onToggleReady&&(
        <button onClick={onToggleReady} aria-pressed={doctorReady} title="Let the front desk and nurses know if you can see the next patient" style={ghost}>
          <Dot color={doctorReady?C.green:C.amber}/>{doctorReady?"Ready for next patient":"Busy"}
        </button>
      )}
      {recentPatients.length>0&&(
        <div ref={ref} style={{position:"relative"}}>
          <button onClick={()=>setRecentOpen(v=>!v)} aria-expanded={recentOpen} style={ghost}>Recent patients <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted}}/></button>
          {recentOpen&&(
            <div role="menu" style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)",minWidth:220,zIndex:500,padding:6}}>
              {recentPatients.map(pt=>(
                <button key={pt.id} role="menuitem" className="icon-btn" onClick={()=>{onOpenRecent(pt);setRecentOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",height:36,padding:"0 10px",border:"none",borderRadius:6,textAlign:"left",cursor:"pointer",fontSize:13,color:C.text,fontFamily:"inherit"}}>
                  <Icon as={UserRound} style={{color:C.muted}}/>{pt.first_name} {pt.last_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={onSearchClick} style={{width:300,height:36,padding:"0 12px",borderRadius:6,border:`1px solid ${C.border2}`,background:C.surface,color:C.muted,fontSize:13,cursor:"text",textAlign:"left",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
        <span style={{flex:1}}>Search patients, appointments…</span>
        <Icon as={Search}/>
      </button>
      {canMessage&&(
        <button onClick={onMessagesClick} title="Messages" aria-label={unreadMsgCount?`Messages, ${unreadMsgCount} unread`:"Messages"} className="icon-btn" style={{position:"relative",width:36,height:36,borderRadius:6,border:`1px solid ${C.border2}`,background:C.surface,display:"flex",alignItems:"center",justifyContent:"center",color:page==="messages"?C.text:C.text2,cursor:"pointer"}}>
          <Icon as={Mail}/>
          {unreadMsgCount>0&&<span style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:C.red,border:`2px solid ${C.surface}`}}/>}
        </button>
      )}
    </header>
  );
}

// ─── GlobalSearch ──────────────────────────────────────────────────────────────
export function GlobalSearch({patients,appts,onClose,onSelectPatient,onSelectAppt}){
  const[q,setQ]=useState("");
  const inputRef=useRef(null);
  useEffect(()=>{if(inputRef.current)inputRef.current.focus();},[]);
  const lq=q.toLowerCase();
  const ptResults=q.length>1?patients.filter(p=>`${p.first_name} ${p.last_name}`.toLowerCase().includes(lq)||(p.phone||"").includes(lq)).slice(0,6):[];
  const apptResults=q.length>1?appts.filter(a=>a.patient.toLowerCase().includes(lq)).slice(0,4):[];
  return(
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:80}} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Search" style={{background:C.surface,borderRadius:12,width:"100%",maxWidth:560,boxShadow:"var(--shadow-lg)",border:`1px solid ${C.border}`,overflow:"hidden",animation:"rise 160ms var(--ease)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}>
          <Search size={18} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted}}/>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search patients, appointments…" aria-label="Search" style={{flex:1,border:"none",outline:"none",fontSize:16,color:C.text,background:"transparent",fontFamily:"inherit"}} onKeyDown={e=>e.key==="Escape"&&onClose()}/>
          <button onClick={onClose} aria-label="Close search" className="icon-btn" style={{border:"none",color:C.muted,cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={16} strokeWidth={1.5}/></button>
        </div>
        <div style={{maxHeight:400,overflow:"auto"}}>
          {q.length<2&&<div style={{padding:"24px",textAlign:"center",color:C.muted,fontSize:13}}>Type to search patients and appointments…</div>}
          {ptResults.length>0&&(
            <div>
              <div style={{padding:"10px 20px 4px",fontSize:12,color:C.muted}}>Patients</div>
              {ptResults.map(pt=>(
                <button key={pt.id} onClick={()=>onSelectPatient(pt)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 20px",border:"none",background:"none",textAlign:"left",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:C.raised,border:`1px solid ${C.border}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,flexShrink:0}}>{pt.first_name[0]}{pt.last_name[0]}</div>
                  <div><div style={{fontWeight:500,fontSize:14,color:C.text}}>{pt.first_name} {pt.last_name}</div><div style={{fontSize:12,color:C.muted}}>{pt.phone} · {pt.insurance}</div></div>
                  {pt.dnc&&<span style={{marginLeft:"auto"}}><Badge color="red">Do not contact</Badge></span>}
                </button>
              ))}
            </div>
          )}
          {apptResults.length>0&&(
            <div style={{borderTop:ptResults.length>0?`1px solid ${C.border}`:"none"}}>
              <div style={{padding:"10px 20px 4px",fontSize:12,color:C.muted}}>Appointments</div>
              {apptResults.map(a=>(
                <button key={a.id} onClick={()=>onSelectAppt(a)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 20px",border:"none",background:"none",textAlign:"left",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <span style={{width:30,height:30,borderRadius:6,background:C.raised,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:C.text2,flexShrink:0}}><CalendarDays size={16} strokeWidth={1.5} aria-hidden="true"/></span>
                  <div style={{flex:1}}><div style={{fontWeight:500,fontSize:14,color:C.text}}>{a.patient}</div><div style={{fontSize:12,color:C.muted}}>{fmt(a.date)} · {a.time} · {a.doctor}</div></div><SB status={a.status}/>
                </button>
              ))}
            </div>
          )}
          {q.length>=2&&ptResults.length===0&&apptResults.length===0&&(
            <div style={{padding:"24px",textAlign:"center",color:C.muted,fontSize:13}}>No results found for "{q}"</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LoginPage({onLogin,accounts}){
  const demoUsers=DEMO_ORDER.map(u=>accounts.find(a=>a.username===u&&a.demo)).filter(Boolean);
  const[u,su]=useState("");const[p,sp]=useState("");const[err,se]=useState("");const[loading,sl]=useState(false);
  const quick=async(usr)=>{sl(true);await new Promise(r=>setTimeout(r,450));onLogin(usr);};
  const submit=async()=>{sl(true);se("");await new Promise(r=>setTimeout(r,600));const f=accounts.find(x=>x.username===u.trim().toLowerCase()&&x.password===p);if(f&&f.status!=="active"){se("This account is inactive. Ask the office admin to turn it back on.");sl(false);}else if(f)onLogin(f);else{se("Username or password is incorrect");sl(false);}};
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:32}}>
          <Logo size={40} wordSize={24}/>
          <div style={{color:C.text2,fontSize:14,marginTop:12}}>Sign in to run today's clinic</div>
        </div>

        <div style={{color:C.text2,fontSize:13,fontWeight:500,marginBottom:8}}>Demo accounts</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24}}>
          {demoUsers.map(usr=>(
            <button key={usr.username} onClick={()=>quick(usr)} disabled={loading} className="role-btn" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:12,cursor:loading?"default":"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:6,background:C.raised,border:`1px solid ${C.border}`,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon as={ROLE_ICON[usr.role]}/></div>
                <div style={{minWidth:0}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:500}}>{ROLE_LABEL[usr.role]}</div>
                  <div style={{color:C.muted,fontSize:12,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{usr.name}</div>
                </div>
              </div>
              <div style={{color:C.muted,fontSize:11,fontFamily:C.mono}}>{usr.username} / {usr.password}</div>
            </button>
          ))}
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:24}}>
          <div style={{color:C.text,fontSize:15,fontWeight:600,marginBottom:16}}>Sign in</div>
          {err&&<div role="alert" style={{marginBottom:16}}><Alert tone="red" title={err}/></div>}
          <div style={{marginBottom:16}}><label htmlFor="login-user" style={LS}>Username</label><input id="login-user" autoComplete="username" value={u} onChange={e=>su(e.target.value)} style={IS}/></div>
          <div style={{marginBottom:20}}><label htmlFor="login-pass" style={LS}>Password</label><input id="login-pass" type="password" autoComplete="current-password" value={p} onChange={e=>sp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={IS}/></div>
          <button onClick={submit} disabled={loading} aria-busy={loading||undefined} className="btn btn-primary" style={{width:"100%",height:40}}>{loading?"Signing in…":"Sign in"}</button>
        </div>
      </div>
    </div>
  );
}

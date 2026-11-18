import React, { useState, useEffect } from "react";
import { Plus, Search, ChevronDown, Pill, X } from "lucide-react";
import { permsFor } from "../lib/accounts";
import { INIT_LABS } from "../lib/data";
import { age, fmt, today } from "../lib/utils";
import { NewApptModal, NewPatientModal, RecallModal, VitalsModal } from "../modals";
import { PatientProfile, RiskBadge, computeRisk } from "./PatientChart";
import { Badge, C, Card, IS, Icon, InsuranceBadge, PB, PageHeader, SS, XB } from "../ui";

export function PatientsPage({user,patients,setPatients,vitals,setVitals,rx,setRx,notes,setNotes,recalls,setRecalls,appts,setAppts,draftNotes,setDraftNotes,refillRequests,setRefillRequests,onOpenPatient,openPatientId,setOpenPatientId,setPage,showToast,addAudit}){
  const[search,setSearch]=useState("");const[sel,setSel]=useState(null);const[showNew,setShowNew]=useState(false);
  const[quickMenu,setQuickMenu]=useState(null); // patient id with open menu
  const[quickNewAppt,setQuickNewAppt]=useState(null);
  const[quickRecall,setQuickRecall]=useState(null);
  const[quickVitals,setQuickVitals]=useState(null);
  const[loading,setLoading]=useState(true);
  // Filter/sort bar state
  const[filterStatus,setFilterStatus]=useState("all");
  const[filterIns,setFilterIns]=useState("all");
  const[filterRisk,setFilterRisk]=useState("all");
  const[filterDoc,setFilterDoc]=useState("all");
  const[sortBy,setSortBy]=useState("name-az");
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),600);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    if(openPatientId){const pt=patients.find(p=>p.id===openPatientId);if(pt){setSel(pt);if(setOpenPatientId)setOpenPatientId(null);}}
  },[openPatientId]);
  const nextAppt=(pid)=>{
    const pName=patients.find(p=>p.id===pid);
    if(!pName)return null;
    const name=`${pName.first_name} ${pName.last_name}`;
    return appts.filter(a=>a.patient===name&&a.date>="2026-02-25"&&a.status!=="completed"&&a.status!=="no-show").sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))[0]||null;
  };
  // Derived filter options
  const allInsurances=["all",...[...new Set(patients.map(p=>p.insurance).filter(Boolean))]];
  const allDoctors=["all",...[...new Set(appts.map(a=>a.doctor).filter(Boolean))]];
  const getRiskLevel=(p)=>{const s=computeRisk(p,rx,vitals,INIT_LABS,appts||[]);return s>=6?"high":s>=3?"medium":"low";};
  const lastDocFor=(p)=>{
    const name=`${p.first_name} ${p.last_name}`;
    const sorted=appts.filter(a=>a.patient===name&&a.status==="completed").sort((a,b)=>b.date.localeCompare(a.date));
    return sorted[0]?.doctor||null;
  };
  const hasFilters=search||filterStatus!=="all"||filterIns!=="all"||filterRisk!=="all"||filterDoc!=="all";
  const clearFilters=()=>{setSearch("");setFilterStatus("all");setFilterIns("all");setFilterRisk("all");setFilterDoc("all");setSortBy("name-az");};
  const q=search.toLowerCase();
  let filt=patients.filter(p=>{
    if(q){
      const name=`${p.first_name} ${p.last_name}`.toLowerCase();
      const phone=(p.phone||"").toLowerCase();
      const ins=(p.insurance||"").toLowerCase();
      if(!name.includes(q)&&!phone.includes(q)&&!ins.includes(q))return false;
    }
    if(filterStatus!=="all"){if(filterStatus==="active"&&p.active===false)return false;if(filterStatus==="inactive"&&p.active!==false)return false;}
    if(filterIns!=="all"&&p.insurance!==filterIns)return false;
    if(filterRisk!=="all"&&getRiskLevel(p)!==filterRisk)return false;
    if(filterDoc!=="all"&&lastDocFor(p)!==filterDoc)return false;
    return true;
  });
  filt=[...filt].sort((a,b)=>{
    if(sortBy==="name-az")return `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`);
    if(sortBy==="name-za")return `${b.last_name}${b.first_name}`.localeCompare(`${a.last_name}${a.first_name}`);
    if(sortBy==="visit-new")return (b.lastVisit||"").localeCompare(a.lastVisit||"");
    if(sortBy==="visit-old")return (a.lastVisit||"").localeCompare(b.lastVisit||"");
    if(sortBy==="risk")return computeRisk(b,rx,vitals,INIT_LABS,appts||[])-computeRisk(a,rx,vitals,INIT_LABS,appts||[]);
    return 0;
  });
  // Read the open chart from the live list, so edits (allergies, details) show straight away
  const selLive=sel&&(patients.find(p=>p.id===sel.id)||sel);
  if(sel)return<div key={sel.id} style={{animation:"rise 220ms var(--ease)"}}><PatientProfile patient={selLive} onBack={()=>setSel(null)} user={user} vitals={vitals} setVitals={setVitals} rx={rx} setRx={setRx} notes={notes} setNotes={setNotes} recalls={recalls} setRecalls={setRecalls} patients={patients} setPatients={setPatients} draftNotes={draftNotes||{}} setDraftNotes={setDraftNotes} refillRequests={refillRequests} setRefillRequests={setRefillRequests} onOpenPatient={onOpenPatient} appts={appts} addAudit={addAudit}/></div>;
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      {showNew&&<NewPatientModal onClose={()=>setShowNew(false)} onSave={p=>{setPatients(prev=>[...prev,p]);setShowNew(false);}}/>}
      {quickNewAppt&&<NewApptModal onClose={()=>setQuickNewAppt(null)} onSave={a=>{setAppts(p=>[...p,a]);setQuickNewAppt(null);}} patients={patients} appts={appts} defaultDate="2026-02-25"/>}
      {quickRecall&&<RecallModal onClose={()=>setQuickRecall(null)} onSave={r=>{setRecalls(p=>[...p,r]);setQuickRecall(null);}} patients={patients}/>}
      {quickVitals&&<VitalsModal patient={quickVitals} onClose={()=>setQuickVitals(null)} onSave={(pid,data)=>{setVitals(p=>({...p,[pid]:[...(p[pid]||[]),{id:Date.now(),date:today(),...data,recordedBy:user.name}]}));setQuickVitals(null);}}/>}
      {loading&&<div>{[...Array(5)].map((_,i)=><div key={i} style={{background:C.skeleton,borderRadius:8,height:44,marginBottom:8,animation:"pulse 1.6s ease-in-out infinite"}}/>)}</div>}
      {!loading&&<>
      <PageHeader title="Patients" meta={`${patients.length} registered · ${patients.filter(p=>p.active!==false).length} active`}
        actions={<>
          {permsFor(user).refills&&!permsFor(user).refillApprove&&setPage&&<XB onClick={()=>setPage("refills")}><Icon as={Pill}/>Refill queue</XB>}
          {permsFor(user).registerPatients&&<PB onClick={()=>setShowNew(true)}><Icon as={Plus}/>New patient</PB>}
        </>}/>
      {/* ── Filter / Sort bar ── */}
      <div style={{marginBottom:12,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"1 1 220px"}}><Search size={16} strokeWidth={1.5} aria-hidden="true" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone, insurance…" aria-label="Search patients" style={{...IS,paddingLeft:36,fontSize:13}}/></div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...SS,flex:"0 0 110px",padding:"8px 10px",fontSize:13}}>
          <option value="all">Any status</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
        <select value={filterIns} onChange={e=>setFilterIns(e.target.value)} style={{...SS,flex:"0 0 130px",padding:"8px 10px",fontSize:13}}>
          {allInsurances.map(ins=><option key={ins} value={ins}>{ins==="all"?"Any insurance":ins}</option>)}
        </select>
        <select value={filterRisk} onChange={e=>setFilterRisk(e.target.value)} style={{...SS,flex:"0 0 130px",padding:"8px 10px",fontSize:13}}>
          <option value="all">Any risk</option><option value="high">High risk</option><option value="medium">Medium risk</option><option value="low">Low risk</option>
        </select>
        <select value={filterDoc} onChange={e=>setFilterDoc(e.target.value)} style={{...SS,flex:"0 0 140px",padding:"8px 10px",fontSize:13}}>
          {allDoctors.map(d=><option key={d} value={d}>{d==="all"?"Any doctor":d}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...SS,flex:"0 0 160px",padding:"8px 10px",fontSize:13}}>
          <option value="name-az">Name (A–Z)</option>
          <option value="name-za">Name (Z–A)</option>
          <option value="visit-new">Last visit (newest)</option>
          <option value="visit-old">Last visit (oldest)</option>
          <option value="risk">Risk (highest first)</option>
        </select>
        {hasFilters&&<button onClick={clearFilters} className="btn btn-secondary"><Icon as={X}/>Clear</button>}
      </div>
      <div style={{fontSize:12,color:C.muted,marginBottom:8}}>Showing {filt.length} of {patients.length} patients</div>
      <Card>
        <table className="tbl" style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Patient","Status","Date of birth","Phone","Insurance","Next appointment","Allergies",""].map((h,hi)=><th key={hi} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{filt.map((p,i)=>{
            const next=nextAppt(p.id);
            const isOpen=quickMenu===p.id;
            return(
              <tr key={p.id} onClick={()=>setSel(p)} className="row-link" style={{borderBottom:i<filt.length-1?`1px solid ${C.border}`:"none"}}>
                <td style={{padding:"12px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:30,height:30,borderRadius:"50%",background:C.raised,border:`1px solid ${C.border}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,flexShrink:0}}>{p.first_name[0]}{p.last_name[0]}</div><div><div style={{fontWeight:500,fontSize:14,color:C.text}}>{p.first_name} {p.last_name}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><RiskBadge score={computeRisk(p,rx,vitals,INIT_LABS,appts||[])}/>{p.dnc&&<Badge color="red">Do not contact</Badge>}</div></div></div></td>
                <td style={{padding:"12px 16px"}}><Badge color={p.active===false?"neutral":"green"}>{p.active===false?"Inactive":"Active"}</Badge></td>
                <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}>{fmt(p.dob)} <span style={{color:C.muted}}>· {age(p.dob)} yrs</span></td>
                <td style={{padding:"12px 16px",fontSize:13,color:C.text2,fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{p.phone}</td>
                <td style={{padding:"12px 16px"}}><InsuranceBadge insurance={p.insurance}/></td>
                <td style={{padding:"12px 16px",fontSize:13,color:next?C.text:C.muted}}>{next?<>{fmt(next.date).replace(/, \d{4}$/,"")} <span style={{fontFamily:C.mono,color:C.text2}}>{next.time}</span></>:"—"}</td>
                <td style={{padding:"12px 16px"}}>{p.allergies.length>0?<Badge color="red">{p.allergies.length} allerg{p.allergies.length>1?"ies":"y"}</Badge>:<span style={{fontSize:12,color:C.muted}}>None</span>}</td>
                <td style={{padding:"12px 16px"}} onClick={e=>e.stopPropagation()}>
                  <div style={{position:"relative"}}>
                    <button onClick={e=>{e.stopPropagation();setQuickMenu(isOpen?null:p.id);}} className="btn btn-secondary btn-sm" >Actions <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true"/></button>
                    {isOpen&&(
                      <div role="menu" style={{position:"absolute",right:0,top:"100%",marginTop:4,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)",zIndex:50,minWidth:180,padding:6}}>
                        {[
                          ["Book appointment",()=>{setQuickMenu(null);setQuickNewAppt(p);}],
                          ["Add recall",()=>{setQuickMenu(null);setQuickRecall(p);}],
                          ...(permsFor(user).vitals?[["Record vitals",()=>{setQuickMenu(null);setQuickVitals(p);}]]:[]),
                          ["Open chart",()=>{setQuickMenu(null);setSel(p);}],
                        ].map(([lbl,fn])=>(
                          <button key={lbl} role="menuitem" onClick={fn} className="icon-btn" style={{display:"block",width:"100%",textAlign:"left",height:34,padding:"0 10px",border:"none",borderRadius:6,fontSize:13,color:C.text,cursor:"pointer",fontFamily:"inherit"}}>{lbl}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        {filt.length===0&&(
          <div style={{padding:"48px 24px",textAlign:"center",color:C.muted}}>
            <Search size={28} strokeWidth={1.5} aria-hidden="true" style={{marginBottom:12}}/>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:8}}>No patients match your filters</div>
            <button onClick={clearFilters} className="text-link">Clear filters</button>
          </div>
        )}
      </Card>
      </>}
    </div>
  );
}

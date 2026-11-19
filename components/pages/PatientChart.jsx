import React, { useState, useRef, useEffect } from "react";
import { Plus, ChevronDown, CalendarDays, ClipboardList, X, Lock, CircleCheck, Activity, Printer, FileText, FolderOpen, NotebookPen, ArrowLeft } from "lucide-react";
import { permsFor } from "../lib/accounts";
import { INIT_FILES, INIT_INACTIVE_RX, INIT_LABS, INIT_PROBLEMS, INIT_REFERRALS, INIT_RX_HISTORY, INIT_VACCINES, VITAL_THRESHOLDS } from "../lib/data";
import { html } from "../lib/print";
import { age, fmt, today } from "../lib/utils";
import { NoteModal, RecallModal, RxModal, VitalsModal } from "../modals";
import { Alert, Badge, C, Card, CardHead, Dot, FF, FR, IS, Icon, KVGrid, LS, LoadingButton, PB, PageHeader, SB, SS, VitalReadout, XB, tint } from "../ui";

// ─── VitalsTabContent (with inline alerts) ────────────────────────────────────
export function VitalsTabContent({patient,v,vitalHistory,onRecordClick,vitals,setVitals,p,showToast,user}){
  const[editV,setEditV]=useState({
    sys:v?v.bp.split("/")[0]:"",
    dia:v?v.bp.split("/")[1]:"",
    hr:v?String(v.hr):"",
    temp:v?String(v.temp):"",
    o2:v?String(v.o2):"",
    weight:v?String(v.weight):"",
  });
  const[saved,setSaved]=useState(false);
  const[savingVitals,setSavingVitals]=useState(false);
  const checkAlerts=(vals)=>{
    const alerts=[];
    const checks=[
      {key:"sys",  th:"bpSystolic"},
      {key:"dia",  th:"bpDiastolic"},
      {key:"hr",   th:"hr"},
      {key:"temp", th:"temp"},
      {key:"o2",   th:"o2"},
      {key:"weight",th:"weight"},
    ];
    checks.forEach(({key,th})=>{
      const val=parseFloat(vals[key]);
      if(isNaN(val)||!vals[key])return;
      const t=VITAL_THRESHOLDS[th];
      if(!t)return;
      const label=t.label;
      if(t.critHigh!==null&&val>=t.critHigh){alerts.push({level:"critical",label,val});}
      else if(val>t.high){alerts.push({level:"abnormal",label,val});}
      else if(val<t.low){alerts.push({level:t.low-val>10?"critical":"abnormal",label,val});}
    });
    return alerts;
  };
  const alerts=checkAlerts(editV);
  const hasCritical=alerts.some(a=>a.level==="critical");
  const saveInlineVitals=()=>{
    if(!editV.sys||!editV.dia||!editV.hr)return;
    setSavingVitals(true);
    setTimeout(()=>{
      const bmi=editV.weight&&editV.ht?((parseInt(editV.weight)/(parseInt(editV.ht)**2))*703).toFixed(1):v?.bmi||0;
      const newEntry={id:Date.now(),date:today(),bp:`${editV.sys}/${editV.dia}`,hr:parseInt(editV.hr),temp:parseFloat(editV.temp)||0,o2:parseInt(editV.o2)||0,weight:parseInt(editV.weight)||0,bmi:parseFloat(bmi)||0,recordedBy:user?.name||""};
      setVitals(prev=>({...prev,[patient.id]:[...(prev[patient.id]||[]),newEntry]}));
      setSaved(true);
      setSavingVitals(false);
      if(alerts.length>0&&showToast)showToast("Vitals saved — review flagged values","amber");
      setTimeout(()=>setSaved(false),2500);
    },600);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>Current vitals</div>{p.vitals&&<button onClick={onRecordClick} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Record via form</button>}</div>
        {v?(<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12,marginBottom:8}}>{["bp","hr","temp","o2","weight","bmi"].map(k=><VitalReadout key={k} k={k} value={v[k]}/>)}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Recorded {v.date?fmt(v.date):"today"}{v.recordedBy?` by ${v.recordedBy}`:""} · shaded band shows the adult reference range</div>
        </>):<div style={{color:C.muted,marginBottom:16}}>No vitals on record</div>}
        {p.vitals&&(
          <div>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>Quick update</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              {[["sys","Systolic","120"],["dia","Diastolic","80"],["hr","Heart Rate","72"],["temp","Temp °F","98.6"],["o2","O\u2082 Sat %","98"],["weight","Weight lbs","160"]].map(([k,lbl,ph])=>(
                <div key={k}>
                  <label style={LS}>{lbl}</label>
                  <input type="number" step={k==="temp"?"0.1":"1"} value={editV[k]} onChange={e=>setEditV(f=>({...f,[k]:e.target.value}))} style={IS} placeholder={ph}/>
                </div>
              ))}
            </div>
            {alerts.length>0&&(
              <Alert tone={hasCritical?"red":"amber"} title={hasCritical?"Critical values":"Values outside range"} style={{marginBottom:12}}>
                {alerts.map((a,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginTop:i?4:0}}>
                    <Dot color={a.level==="critical"?C.red:C.amber} size={6}/>
                    <span>{a.label}: <span style={{fontFamily:C.mono,color:C.text}}>{a.val}</span>{a.level==="critical"?" (critical)":""}</span>
                  </div>
                ))}
              </Alert>
            )}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <LoadingButton onClick={saveInlineVitals} disabled={!editV.sys||!editV.dia||!editV.hr} loading={savingVitals} style={{padding:"8px 20px",fontSize:13,fontWeight:600}}>Save vitals</LoadingButton>
              {saved&&<span role="status" style={{fontSize:13,color:C.text2,display:"inline-flex",alignItems:"center",gap:6}}><CircleCheck size={16} strokeWidth={1.5} style={{color:C.green}} aria-hidden="true"/>Saved{alerts.length>0?", review flagged values":""}</span>}
            </div>
          </div>
        )}
      </Card>
      <Card style={{padding:"20px"}}>
        <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>Trends</div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          <VitalsTrendChart data={vitalHistory} field="systolic"/>
          <VitalsTrendChart data={vitalHistory} field="weight"/>
          <VitalsTrendChart data={vitalHistory} field="glucose"/>
        </div>
      </Card>
      {vitalHistory&&vitalHistory.length>0&&(
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>Vitals history</div>
          <div style={{overflowX:"auto"}}>
            <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr>{["Date","BP","HR","Temp","O₂","Weight","Recorded By"].map(h=><th key={h} style={{padding:"12px 12px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>
                {[...vitalHistory].reverse().map((entry,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i===0?C.blueBg:"transparent"}}>
                    <td style={{padding:"10px 12px",fontWeight:i===0?600:400,color:C.text}}>{fmt(entry.date)}{i===0&&<span style={{marginLeft:6,fontSize:11,color:C.blue,fontWeight:600}}>(current)</span>}</td>
                    <td style={{padding:"10px 12px",color:C.text}}>{entry.bp}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.hr}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.temp}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.o2}%</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.weight} lbs</td>
                    <td style={{padding:"10px 12px",color:C.muted,fontSize:12,fontWeight:500}}>{entry.recordedBy||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Risk Score ────────────────────────────────────────────────────────────────
export function computeRisk(patient, rx, vitals, labs, appts){
  let score=0;
  const a=age(patient.dob);
  if(a>=75)score+=2; else if(a>=65)score+=1;
  const rxArr=rx[patient.id]||[];
  const labArr=labs[patient.id]||[];
  const hasMet=rxArr.some(r=>r.med.toLowerCase().includes("metformin"));
  const hasHbA1c=labArr.some(l=>l.name.toLowerCase().includes("hba1c")&&l.abnormal);
  if(hasMet||hasHbA1c)score+=2;
  const hasLisin=rxArr.some(r=>r.med.toLowerCase().includes("lisinopril"));
  const vArr=vitals[patient.id]||[];
  const v=vArr.length>0?vArr[vArr.length-1]:null;
  const sysBP=v&&v.bp?parseInt(v.bp.split("/")[0]):0;
  if(hasLisin||sysBP>140)score+=2;
  if(patient.allergies&&patient.allergies.length>0)score+=1;
  const ptName=`${patient.first_name} ${patient.last_name}`;
  const noShows=(appts||[]).filter(a=>a.patient===ptName&&a.status==="no-show").length;
  if(noShows>=2)score+=2;
  const lastVisit=patient.lastVisit;
  if(lastVisit){const daysSince=(new Date()-new Date(lastVisit))/86400000;if(daysSince>180)score+=1;}
  if(patient.active===false)score+=1;
  return score;
}
export function RiskBadge({score}){
  const level=score>=6?"High":score>=3?"Medium":"Low";
  const color=score>=6?"red":score>=3?"amber":"green";
  return <Badge color={color==="green"?"neutral":color}>{level} risk</Badge>;
}

// ─── Care Gaps Panel ───────────────────────────────────────────────────────────
export function CareGapsPanel({patient, rx, labs, vaccines}){
  const[open,setOpen]=useState(true);
  const[dismissed,setDismissed]=useState(new Set());
  const ptAge=age(patient.dob);
  const rxArr=rx[patient.id]||[];
  const labArr=labs[patient.id]||[];
  const vacArr=vaccines||[];
  const todayStr=today();
  const gaps=[];
  // Age >= 65: flu vaccine in past 12 months
  if(ptAge>=65){
    const lastFlu=vacArr.filter(v=>v.vaccine.toLowerCase().includes("influenza")).sort((a,b)=>b.date.localeCompare(a.date))[0];
    const monthsAgo12=new Date();monthsAgo12.setFullYear(monthsAgo12.getFullYear()-1);
    if(!lastFlu||new Date(lastFlu.date)<monthsAgo12){
      gaps.push({id:"flu",label:"Annual flu vaccine overdue",action:"Schedule influenza vaccine",severity:"medium"});
    }
  }
  // Age >= 65: pneumococcal
  if(ptAge>=65){
    const hasPneumo=vacArr.some(v=>v.vaccine.toLowerCase().includes("pneumo"));
    if(!hasPneumo)gaps.push({id:"pneumo",label:"Pneumococcal vaccine not on record",action:"Administer Pneumococcal vaccine",severity:"medium"});
  }
  // Age >= 50: colonoscopy
  if(ptAge>=50){
    const hasColono=labArr.some(l=>l.name.toLowerCase().includes("colonoscopy"));
    if(!hasColono)gaps.push({id:"colon",label:"Colonoscopy screening not documented",action:"Order or confirm colonoscopy",severity:"medium"});
  }
  // Diabetic: HbA1c every 6 months
  const hasMet=rxArr.some(r=>r.med.toLowerCase().includes("metformin"));
  const hasHbA1cLab=labArr.some(l=>l.name.toLowerCase().includes("hba1c"));
  if(hasMet||hasHbA1cLab){
    const lastHbA1c=labArr.filter(l=>l.name.toLowerCase().includes("hba1c")).sort((a,b)=>b.date.localeCompare(a.date))[0];
    if(!lastHbA1c){
      gaps.push({id:"hba1c",label:"HbA1c not on record (diabetic patient)",action:"Order HbA1c lab",severity:"high"});
    } else {
      const monthsAgo6=new Date();monthsAgo6.setMonth(monthsAgo6.getMonth()-6);
      if(new Date(lastHbA1c.date)<monthsAgo6)gaps.push({id:"hba1c",label:"HbA1c overdue (>6 months)",action:"Order HbA1c recheck",severity:"medium"});
    }
  }
  // Hypertension: BP check every 3 months
  const hasLisin=rxArr.some(r=>r.med.toLowerCase().includes("lisinopril"));
  if(hasLisin&&patient.lastVisit){
    const daysSince=(new Date()-new Date(patient.lastVisit))/86400000;
    if(daysSince>90)gaps.push({id:"bp",label:"BP check overdue (>3 months since last visit)",action:"Schedule BP follow-up",severity:"medium"});
  }
  // Annual physical
  if(patient.lastVisit){
    const daysSince=(new Date()-new Date(patient.lastVisit))/86400000;
    if(daysSince>365)gaps.push({id:"annual",label:"Annual physical overdue",action:"Schedule annual physical",severity:"medium"});
  }
  const activeGaps=gaps.filter(g=>!dismissed.has(g.id));
  return(
    <div style={{gridColumn:"1 / -1"}}>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div onClick={()=>setOpen(v=>!v)} aria-expanded={open} className="row-link" style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:open&&activeGaps.length>0?`1px solid ${C.border}`:"none"}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text,flex:1}}>Care gaps and preventive care</div>
          {activeGaps.length>0&&<Badge color="amber">{activeGaps.length} open</Badge>}
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,transform:open?"rotate(180deg)":"none",transition:"transform 160ms var(--ease)"}}/>
        </div>
        {open&&(
          <div style={{padding:"4px 0"}}>
            {activeGaps.length===0&&<div style={{padding:"16px 20px",fontSize:13,color:C.muted}}>No care gaps found</div>}
            {activeGaps.map(g=>(
              <div key={g.id} style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.border}`}}>
                <Dot color={g.severity==="high"?C.red:C.amber}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:C.text}}>{g.label}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>Recommended: {g.action}</div>
                </div>
                <button onClick={()=>setDismissed(prev=>{const s=new Set(prev);s.add(g.id);return s;})} className="btn btn-secondary btn-sm" style={{flexShrink:0}}>Dismiss</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export function PatientProfile({patient,onBack,user,vitals,setVitals,rx,setRx,notes,setNotes,recalls,setRecalls,patients,setPatients,refillRequests,setRefillRequests,draftNotes,setDraftNotes,onOpenPatient,appts,addAudit}){
  const[tab,setTab]=useState("overview");
  const[sv,setSv]=useState(false);const[sr,setSr]=useState(false);const[sn,setSn]=useState(false);const[sc,setSc]=useState(false);
  const[showInactiveRx,setShowInactiveRx]=useState(false);
  const[rxHistory]=useState(INIT_RX_HISTORY[patient.id]||{});
  const[expandedRxHistory,setExpandedRxHistory]=useState(new Set());
  // Problems and Labs tab state (hooks must run on every render, not only while the tab is open)
  const[showAddProblem,setShowAddProblem]=useState(false);
  const[newProb,setNewProb]=useState({problem:"",icd:"",status:"active",onset:"",notes:""});
  const[editingProblemId,setEditingProblemId]=useState(null);
  const[editProb,setEditProb]=useState({});
  const[showOrderForm,setShowOrderForm]=useState(false);
  const[orderForm,setOrderForm]=useState({name:"",orderedBy:user.name});
  const[enterResultsId,setEnterResultsId]=useState(null);
  const[resultRows,setResultRows]=useState([{name:"",value:"",unit:"",low:"",high:""}]);
  // Notes tab filters (hooks must run on every render, not only while the tab is open)
  const[noteSearch,setNoteSearch]=useState("");const[noteDrFilter,setNoteDrFilter]=useState("All");const[noteFrom,setNoteFrom]=useState("");const[noteTo,setNoteTo]=useState("");const[signedOnly,setSignedOnly]=useState(false);
  const[addingAllergy,setAddingAllergy]=useState(false);const[newAllergy,setNewAllergy]=useState("");
  const[labResults,setLabResults]=useState(INIT_LABS[patient.id]||[]);
  const[expandedLab,setExpandedLab]=useState(null);
  const[editContactPref,setEditContactPref]=useState(false);
  const[vaccines,setVaccines]=useState(INIT_VACCINES[patient.id]||[]);
  const[showVaccineForm,setShowVaccineForm]=useState(false);
  const[vaccineForm,setVaccineForm]=useState({vaccine:"",date:today(),given_by:user.name,lot:"",next_due:""});
  const[referrals,setReferrals]=useState(INIT_REFERRALS[patient.id]||[]);
  const[showReferralForm,setShowReferralForm]=useState(false);
  const[referralForm,setReferralForm]=useState({specialist:"",facility:"",reason:"",notes:""});
  const[editingReferral,setEditingReferral]=useState(null);
  const p=permsFor(user);
  const vitalHistory=vitals[patient.id]||[];
  const v=vitalHistory.length>0?vitalHistory[vitalHistory.length-1]:null;
  const rxs=rx[patient.id]||[];const ptN=notes[patient.id]||[];
  const inactiveRxs=INIT_INACTIVE_RX[patient.id]||[];
  const[patFiles,setPatFiles]=useState(INIT_FILES[patient.id]||[]);
  const patientFullName=`${patient.first_name} ${patient.last_name}`;
  const patAppts=(appts||[]).filter(a=>a.patient===patientFullName);
  const totalAppts=patAppts.length;
  const completedAppts=patAppts.filter(a=>a.status==="completed").length;
  const noShowAppts=patAppts.filter(a=>a.status==="no-show").length;
  const cancelledAppts=patAppts.filter(a=>a.status==="cancelled").length;
  const[problems,setProblems]=useState(INIT_PROBLEMS[patient.id]||[]);
  // Audit on tab change
  const prevTab=useRef(tab);
  useEffect(()=>{
    if(addAudit&&tab!==prevTab.current){
      addAudit("Viewed",patientFullName,tab.charAt(0).toUpperCase()+tab.slice(1));
      prevTab.current=tab;
    }
  },[tab]);
  const handleFileUpload=(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    const ext=file.name.split(".").pop().toLowerCase();
    const typeMap={pdf:"Document",jpg:"Image",jpeg:"Image",png:"Image",tiff:"Image",doc:"Document",docx:"Document",xls:"Lab Report",xlsx:"Lab Report"};
    const kb=Math.round(file.size/1024);
    const size=kb>=1024?`${(kb/1024).toFixed(1)} MB`:`${kb} KB`;
    setPatFiles(prev=>[...prev,{id:Date.now(),name:file.name,type:typeMap[ext]||"Document",date:today(),size}]);
    e.target.value="";
  };
  const showRxTab=p.prescriptions||p.viewRx;const canWriteRx=p.writeRx||p.prescriptions;
  const showNotesTab=p.notes||p.viewNotes;const canWriteNotes=p.writeNotes||p.notes;
  const activeProblemsCount=problems.filter(pr=>pr.status==="active").length;
  const tabs=[{id:"overview",show:true},{id:"problems",show:true,badge:activeProblemsCount},{id:"vitals",show:p.vitals||p.viewVitals},{id:"prescriptions",show:showRxTab},{id:"notes",show:showNotesTab},{id:"labs",show:true},{id:"vaccines",show:true},{id:"files",show:true},{id:"recalls",show:p.recalls},{id:"referrals",show:true},{id:"timeline",show:true}].filter(t=>t.show);
  const addAllergy=()=>{
    if(!newAllergy.trim())return;
    setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,allergies:[...pt.allergies,newAllergy.trim()]}:pt));
    setNewAllergy("");setAddingAllergy(false);
  };
  const printRx=()=>{
    const w=window.open("","_blank","width=720,height=900");
    w.document.write(String(html`<html><head><title>Prescription</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#1A2332}.header{border-bottom:2px solid #1A3A5C;padding-bottom:16px;margin-bottom:24px}.clinic{font-size:20px;font-weight:bold;color:#1A3A5C}.rx-item{border:1px solid #ddd;border-radius:6px;padding:14px;margin-bottom:12px}.med{font-size:16px;font-weight:bold}.footer{margin-top:48px;border-top:1px solid #ddd;padding-top:16px}.sig{border-bottom:1px solid #000;width:260px;margin-top:36px}@media print{body{margin:20px}}</style></head><body>
    <div class="header"><div class="clinic">My Medical Clinic</div><div style="color:#6B7A8D;font-size:13px">123 Main St · (555) 000-0000</div></div>
    <div style="margin-bottom:16px"><strong>Patient:</strong> ${patient.first_name} ${patient.last_name} &nbsp;·&nbsp; <strong>DOB:</strong> ${patient.dob} &nbsp;·&nbsp; <strong>Date:</strong> ${today()}</div>
    ${rxs.map(rx=>html`<div class="rx-item"><div class="med">℞ ${rx.med} ${rx.dose}</div><div style="margin:6px 0;color:#6B7A8D">${rx.sig}</div><div style="font-size:12px;color:#6B7A8D">Refills: ${rx.refills} &nbsp;·&nbsp; Prescribed: ${rx.date||""}</div></div>`)}
    <div class="footer"><div>Prescribing Physician: <strong>Dr. Priya Patel, MD</strong></div><div class="sig"></div><div style="margin-top:6px;font-size:12px;color:#6B7A8D">Signature</div></div>
    </body></html>`));
    w.document.close();w.focus();setTimeout(()=>w.print(),300);
  };
  const printSummary=()=>{
    const w=window.open("","_blank","width=720,height=900");
    const vitArr=vitals[patient.id]||[];
    const vit=vitArr.length>0?vitArr[vitArr.length-1]:null;
    w.document.write(String(html`<html><head><title>Patient Summary</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#1A2332}h2{color:#1A3A5C}table{width:100%;border-collapse:collapse;margin-bottom:20px}td,th{padding:8px 12px;border:1px solid #ddd;font-size:13px}th{background:#F0F2F5;font-weight:600}.section{margin-bottom:24px}@media print{body{margin:20px}}</style></head><body>
    <h2>My Medical Clinic — Patient Summary</h2>
    <p style="color:#6B7A8D;font-size:13px">Generated: ${today()} &nbsp;·&nbsp; For referral or internal use only</p>
    <div class="section"><h3>Demographics</h3><table><tr><th>Name</th><td>${patient.first_name} ${patient.last_name}</td><th>DOB</th><td>${patient.dob}</td></tr><tr><th>Phone</th><td>${patient.phone}</td><th>Insurance</th><td>${patient.insurance}</td></tr></table></div>
    <div class="section"><h3>Allergies</h3><p>${patient.allergies.length?patient.allergies.join(", "):"No known allergies"}</p></div>
    ${vit?html`<div class="section"><h3>Most Recent Vitals</h3><table><tr><th>BP</th><td>${vit.bp} mmHg</td><th>HR</th><td>${vit.hr} bpm</td></tr><tr><th>Temp</th><td>${vit.temp} °F</td><th>O₂ Sat</th><td>${vit.o2}%</td></tr><tr><th>Weight</th><td>${vit.weight} lbs</td><th>BMI</th><td>${vit.bmi}</td></tr></table></div>`:""}
    ${rxs.length?html`<div class="section"><h3>Active Medications</h3><table><tr><th>Medication</th><th>Dose</th><th>Instructions</th><th>Refills</th></tr>${rxs.map(r=>html`<tr><td>${r.med}</td><td>${r.dose}</td><td>${r.sig}</td><td>${r.refills}</td></tr>`)}</table></div>`:""}
    ${recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).length?html`<div class="section"><h3>Open Recalls</h3><table><tr><th>Reason</th><th>Due Date</th><th>Urgency</th></tr>${recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).map(r=>html`<tr><td>${r.reason}</td><td>${r.due}</td><td>${r.urgency}</td></tr>`)}</table></div>`:""}
    </body></html>`));
    w.document.close();w.focus();setTimeout(()=>w.print(),300);
  };
  return(
    <div style={{padding:"24px 32px 48px"}}>
      {sv&&<VitalsModal patient={patient} onClose={()=>setSv(false)} onSave={(pid,data)=>{setVitals(p=>({...p,[pid]:[...(p[pid]||[]),{id:Date.now(),date:today(),...data,recordedBy:user.name}]}));setSv(false);if(addAudit)addAudit("Edited",patientFullName,"Vitals");}}/>}
      {sr&&<RxModal patient={patient} rx={rxs} onClose={()=>setSr(false)} onSave={(pid,r)=>{setRx(p=>({...p,[pid]:[...(p[pid]||[]),r]}));setSr(false);}}/>}
      {sn&&<NoteModal patient={patient} user={user} draftNotes={draftNotes} setDraftNotes={setDraftNotes} onClose={()=>setSn(false)} onSave={(pid,n)=>{setNotes(p=>({...p,[pid]:[...(p[pid]||[]),n]}));setSn(false);if(addAudit)addAudit("Edited",patientFullName,"Notes");}}/>}
      {sc&&<RecallModal onClose={()=>setSc(false)} onSave={r=>{setRecalls(p=>[...p,r]);setSc(false);}} patients={patients}/>}
      <button onClick={onBack} className="text-link" style={{display:"inline-flex",alignItems:"center",gap:4,marginBottom:12,color:C.text2,textDecoration:"none"}}><ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true"/>All patients</button>
      <PageHeader title={`${patient.first_name} ${patient.last_name}`}
        status={<>{patient.dnc&&<Badge color="red">Do not contact</Badge>}<RiskBadge score={computeRisk(patient,rx,vitals,INIT_LABS,appts||[])}/>{patient.active===false&&<Badge color="neutral">Inactive</Badge>}</>}
        meta={`${age(patient.dob)} yrs · ${patient.gender==="F"?"Female":"Male"} · Patient #${String(patient.id).padStart(5,"0")}`}
        actions={<>
          <XB onClick={printSummary}><Icon as={Printer}/>Print summary</XB>
          {p.prescriptions&&rxs.length>0&&<XB onClick={printRx}><Icon as={Printer}/>Print Rx</XB>}
        </>}/>
      {patient.allergies.length>0&&<Alert tone="red" title={`Allergies: ${patient.allergies.join(", ")}`} meta={`${patient.allergies.length} on record`} style={{marginBottom:12}}
        actions={(p.vitals||p.writeRx)&&!addingAllergy?<button className="text-link" onClick={()=>setAddingAllergy(true)}>Add allergy</button>:null}/>}
      <Card style={{marginBottom:12,paddingBottom:8}}>
        <CardHead title="Patient information">{patient.allergies.length===0&&(p.vitals||p.writeRx)&&!addingAllergy&&<button className="text-link" style={{fontSize:12}} onClick={()=>setAddingAllergy(true)}>Add allergy</button>}</CardHead>
        <KVGrid items={[
          ["Date of birth",fmt(patient.dob)],
          ["Phone",patient.phone||"—"],
          ["Status",patient.active===false?"Inactive":"Active"],
          ["Insurance",patient.insurance||"—"],
          ["Contact",patient.dnc?"Do not contact":`${patient.contactPref||"Call"} · ${(patient.bestTime||"Morning").toLowerCase()}`],
          ["Allergies",patient.allergies.length?patient.allergies.join(", "):"None known"],
          ["Last visit",patient.lastVisit?fmt(patient.lastVisit):"—"],
          ["Next appointment",(()=>{const nx=(appts||[]).filter(a=>a.patient===`${patient.first_name} ${patient.last_name}`&&a.status==="scheduled"&&(a.date||"")>="2026-02-25").sort((x,y)=>(x.date+x.time).localeCompare(y.date+y.time))[0];return nx?`${fmt(nx.date)} · ${nx.time}`:"None booked";})()],
        ]}/>
        {addingAllergy&&(
          <div style={{margin:"8px 20px 12px",paddingTop:12,borderTop:`1px solid ${C.border}`,display:"flex",gap:8,alignItems:"center"}}>
            <input value={newAllergy} onChange={e=>setNewAllergy(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAllergy()} placeholder="e.g. Latex, Penicillin…" aria-label="New allergy" style={{...IS,maxWidth:300}} autoFocus/>
            <PB onClick={addAllergy} disabled={!newAllergy.trim()}>Add</PB>
            <XB onClick={()=>{setAddingAllergy(false);setNewAllergy("");}}>Cancel</XB>
          </div>
        )}
      </Card>
      <div role="tablist" style={{display:"flex",gap:24,marginBottom:12,borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>
        {tabs.map(t=><button key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 0",border:"none",background:"none",cursor:"pointer",fontSize:14,fontWeight:tab===t.id?500:400,color:tab===t.id?C.text:C.muted,borderBottom:tab===t.id?`2px solid ${C.navyMid}`:"2px solid transparent",marginBottom:-1,display:"flex",alignItems:"center",gap:6,fontFamily:"inherit"}}>
          {t.id.charAt(0).toUpperCase()+t.id.slice(1)}{t.badge>0&&<span style={{fontSize:12,color:C.muted,fontVariantNumeric:"tabular-nums"}}>{t.badge}</span>}
        </button>)}
      </div>
      {tab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {problems.filter(pr=>pr.status==="active").length>0&&(
            <Card style={{padding:"16px 20px 20px",gridColumn:"1 / -1"}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>Active problems</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {problems.filter(pr=>pr.status==="active").map(pr=>(
                  <div key={pr.id} style={{border:`1px solid ${C.border2}`,borderRadius:6,padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontWeight:500,fontSize:13,color:C.text}}>{pr.problem}</span>
                    <span style={{fontSize:12,color:C.muted,fontFamily:C.mono}}>{pr.icd}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card style={{padding:"16px 20px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>Recent vitals</div>{p.vitals&&<button onClick={()=>setSv(true)} className="btn btn-secondary btn-sm" ><Icon as={Plus} size={14}/>Record</button>}</div>
            {(p.vitals||p.viewVitals)?(v?(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{["bp","hr","temp","o2","weight","bmi"].map(k=><VitalReadout key={k} k={k} value={v[k]} compact/>)}</div>):<div style={{color:C.muted,fontSize:13}}>No vitals yet. {p.vitals&&<button onClick={()=>setSv(true)} style={{color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Record now</button>}</div>):<div style={{color:C.muted,fontSize:13,display:"flex",alignItems:"center",gap:6}}><Icon as={Lock} size={14}/>Nurses and doctors only</div>}
          </Card>
          <Card style={{padding:"16px 20px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>Active medications</div>{canWriteRx&&<button onClick={()=>setSr(true)} className="btn btn-secondary btn-sm" ><Icon as={Plus} size={14}/>Prescribe</button>}</div>
            {showRxTab?(rxs.length>0?rxs.map((r,ri)=><div key={r.id} style={{padding:"10px 0",borderTop:ri?`1px solid ${C.border}`:"none"}}><div style={{fontWeight:500,fontSize:14,color:C.text}}>{r.med} <span style={{color:C.muted,fontWeight:400}}>{r.dose}</span></div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{r.sig} · {r.refills} refills</div></div>):<div style={{color:C.muted,fontSize:13}}>No active medications.</div>):<div style={{color:C.muted,fontSize:13,display:"flex",alignItems:"center",gap:6}}><Icon as={Lock} size={14}/>Visible to doctors only</div>}
          </Card>
          <Card style={{padding:"16px 20px 20px"}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>Visit history</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Total",totalAppts],["Completed",completedAppts],["No-shows",noShowAppts],["Cancellations",cancelledAppts]].map(([l,v])=>(
                <div key={l} style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 12px"}}><div style={{fontSize:12,color:C.muted}}>{l}</div><div style={{fontSize:22,fontWeight:600,color:l==="No-shows"&&v>0?C.red:C.text,marginTop:4,fontVariantNumeric:"tabular-nums"}}>{v}</div></div>
              ))}
            </div>
          </Card>
          <Card style={{padding:"16px 20px 20px",gridColumn:"1 / -1"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text}}>Contact preferences</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditContactPref(v=>!v)} className="btn btn-secondary btn-sm" >Edit</button>
                <button onClick={()=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,dnc:!patient.dnc}:pt))}
                  className="btn btn-secondary btn-sm">
                  {patient.dnc?"Allow contact":"Mark do not contact"}
                </button>
              </div>
            </div>
            {editContactPref?(
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <FF label="Preferred contact"><select value={patient.contactPref||"Call"} onChange={e=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,contactPref:e.target.value}:pt))} style={{...SS,width:130}}><option>Call</option><option>Text</option><option>Email</option></select></FF>
                <FF label="Best time"><select value={patient.bestTime||"Morning"} onChange={e=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,bestTime:e.target.value}:pt))} style={{...SS,width:130}}><option>Morning</option><option>Afternoon</option><option>Either</option></select></FF>
                <button onClick={()=>setEditContactPref(false)} className="btn btn-primary" style={{alignSelf:"flex-end"}}>Done</button>
              </div>
            ):(
              <div style={{fontSize:13,color:C.text}}>
                {patient.dnc?<span style={{display:"inline-flex",alignItems:"center",gap:8}}><Dot color={C.red}/>Do not contact: all outreach is blocked</span>:<span>Prefers <strong style={{fontWeight:500}}>{(patient.contactPref||"Call").toLowerCase()}</strong>, best in the <strong style={{fontWeight:500}}>{(patient.bestTime||"Morning").toLowerCase()}</strong></span>}
              </div>
            )}
          </Card>
          <CareGapsPanel patient={patient} rx={rx} labs={INIT_LABS} vaccines={vaccines}/>
        </div>
      )}
      {tab==="problems"&&(()=>{
        const canWriteProblems=p.writeRx;
        const saveNewProblem=()=>{
          if(!newProb.problem)return;
          setProblems(prev=>[...prev,{...newProb,id:Date.now()}]);
          setNewProb({problem:"",icd:"",status:"active",onset:"",notes:""});
          setShowAddProblem(false);
        };
        const saveEditProblem=(id)=>{
          setProblems(prev=>prev.map(pr=>pr.id===id?{...pr,...editProb}:pr));
          setEditingProblemId(null);setEditProb({});
        };
        const resolveProblem=(id)=>{
          setProblems(prev=>prev.map(pr=>pr.id===id?{...pr,status:"resolved"}:pr));
        };
        return(
          <Card style={{padding:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text}}>Problem list</div>
              {canWriteProblems&&<button onClick={()=>setShowAddProblem(v=>!v)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Add problem</button>}
            </div>
            {showAddProblem&&(
              <div style={{background:C.raised,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px",marginBottom:16}}>
                <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>New problem</div>
                <FR><FF label="Problem name"><input value={newProb.problem} onChange={e=>setNewProb(f=>({...f,problem:e.target.value}))} style={IS} placeholder="e.g. Essential Hypertension"/></FF><FF label="ICD-10 code"><input value={newProb.icd} onChange={e=>setNewProb(f=>({...f,icd:e.target.value}))} style={IS} placeholder="e.g. I10"/></FF></FR>
                <FR><FF label="Status"><select value={newProb.status} onChange={e=>setNewProb(f=>({...f,status:e.target.value}))} style={SS}><option value="active">Active</option><option value="inactive">Inactive</option><option value="resolved">Resolved</option></select></FF><FF label="Onset date"><input type="date" value={newProb.onset} onChange={e=>setNewProb(f=>({...f,onset:e.target.value}))} style={IS}/></FF></FR>
                <FR cols={1}><FF label="Notes"><input value={newProb.notes} onChange={e=>setNewProb(f=>({...f,notes:e.target.value}))} style={IS} placeholder="Additional notes…"/></FF></FR>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowAddProblem(false)}>Cancel</XB><PB onClick={saveNewProblem} disabled={!newProb.problem}>Add problem</PB></div>
              </div>
            )}
            {problems.length===0?<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>No problems on record.</div>:(
              <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
                <thead><tr>{["Problem","ICD-10","Status","Onset","Notes","Actions"].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                <tbody>
                  {problems.map((pr,i)=>(
                    editingProblemId===pr.id?(
                      <tr key={pr.id} style={{borderBottom:`1px solid ${C.border}`,background:C.raised}}>
                        <td style={{padding:"10px 16px"}}><input defaultValue={editProb.problem??pr.problem} onChange={e=>setEditProb(f=>({...f,problem:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 16px"}}><input defaultValue={editProb.icd??pr.icd} onChange={e=>setEditProb(f=>({...f,icd:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 16px"}}><select defaultValue={editProb.status??pr.status} onChange={e=>setEditProb(f=>({...f,status:e.target.value}))} style={{...SS,fontSize:12}}><option value="active">Active</option><option value="inactive">Inactive</option><option value="resolved">Resolved</option></select></td>
                        <td style={{padding:"10px 16px"}}><input type="date" defaultValue={editProb.onset??pr.onset} onChange={e=>setEditProb(f=>({...f,onset:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 16px"}}><input defaultValue={editProb.notes??pr.notes} onChange={e=>setEditProb(f=>({...f,notes:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 16px"}}><div style={{display:"flex",gap:6}}><button onClick={()=>saveEditProblem(pr.id)} className="btn btn-primary btn-sm">Save</button><button onClick={()=>setEditingProblemId(null)} className="btn btn-secondary btn-sm" >Cancel</button></div></td>
                      </tr>
                    ):(
                      <tr key={pr.id} style={{borderBottom:i<problems.length-1?`1px solid ${C.border}`:"none"}}>
                        <td style={{padding:"12px 16px",fontWeight:500,fontSize:13,color:C.text}}>{pr.problem}</td>
                        <td style={{padding:"12px 16px",fontSize:12,color:C.muted,fontFamily:C.mono}}>{pr.icd}</td>
                        <td style={{padding:"12px 16px"}}><Badge color={pr.status==="active"?"amber":pr.status==="resolved"?"green":"neutral"}>{pr.status}</Badge></td>
                        <td style={{padding:"12px 16px",fontSize:12,color:C.muted}}>{pr.onset?fmt(pr.onset):"—"}</td>
                        <td style={{padding:"12px 16px",fontSize:12,color:C.muted,maxWidth:200}}>{pr.notes||"—"}</td>
                        <td style={{padding:"12px 16px"}}>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {canWriteProblems&&<button onClick={()=>{setEditingProblemId(pr.id);setEditProb({});}} className="btn btn-secondary btn-sm" >Edit</button>}
                            {canWriteProblems&&pr.status==="active"&&<button onClick={()=>resolveProblem(pr.id)} className="btn btn-secondary btn-sm">Resolve</button>}
                          </div>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        );
      })()}
      {tab==="vitals"&&(
        <VitalsTabContent patient={patient} v={v} vitalHistory={vitalHistory} onRecordClick={()=>setSv(true)} vitals={vitals} setVitals={setVitals} p={p} showToast={null} user={user}/>
      )}
      {tab==="prescriptions"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text}}>Prescriptions</div>
            {!canWriteRx&&<Badge color="neutral">Read only</Badge>}
            <button onClick={()=>setShowInactiveRx(v=>!v)} className="text-link" style={{fontSize:12}}>{showInactiveRx?"Hide past prescriptions":"Show past prescriptions"}</button>
          </div>
          {canWriteRx&&<button onClick={()=>setSr(true)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>New prescription</button>}
        </div>
        {rxs.length>0||showInactiveRx?(<table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
          <thead><tr>{["Medication","Dose","Instructions","Refills","Date","Status",""].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {rxs.map((r)=>{
              const histOpen=expandedRxHistory.has(r.id);
              const hist=rxHistory[r.id]||[];
              return(
                <React.Fragment key={r.id}>
                  <tr style={{borderBottom:histOpen?"none":`1px solid ${C.border}`}}>
                    <td style={{padding:"12px 16px",fontWeight:500,color:C.text}}>{r.med}</td>
                    <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.dose}</td>
                    <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.sig}</td>
                    <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.refills}</td>
                    <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.date?fmt(r.date):"—"}</td>
                    <td style={{padding:"12px 16px"}}><Badge color="green">Active</Badge></td>
                    <td style={{padding:"12px 16px"}}>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {p.refills&&setRefillRequests&&<button onClick={()=>setRefillRequests(prev=>[...prev,{id:Date.now(),patientId:patient.id,patient:`${patient.first_name} ${patient.last_name}`,medication:`${r.med} ${r.dose}`,requestedBy:user.role,requestedByName:user.name,date:today(),status:"pending",approvedBy:null,note:""}])} className="btn btn-secondary btn-sm" >Request refill</button>}
                        <button onClick={()=>setExpandedRxHistory(prev=>{const s=new Set(prev);s.has(r.id)?s.delete(r.id):s.add(r.id);return s;})} aria-expanded={histOpen} className="btn btn-secondary btn-sm">History<ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" style={{transform:histOpen?"rotate(180deg)":"none"}}/></button>
                      </div>
                    </td>
                  </tr>
                  {histOpen&&(
                    <tr>
                      <td colSpan={7} style={{padding:"0 16px 16px",borderBottom:`1px solid ${C.border}`}}>
                        <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"16px 16px",border:`1px solid ${C.border}`}}>
                          <div style={{fontWeight:500,fontSize:12,color:C.muted,marginBottom:12}}>Refill History — {r.med}</div>
                          {hist.length===0?<div style={{fontSize:13,color:C.muted}}>No history recorded.</div>:(
                            <div style={{position:"relative",paddingLeft:24}}>
                              <div style={{position:"absolute",left:8,top:0,bottom:0,width:2,background:C.border}}/>
                              {hist.map((h,hi)=>{
                                const dotColor=h.action==="Prescribed"?C.green:h.action==="Refilled"?C.blue:C.amber;
                                return(
                                  <div key={h.id} style={{position:"relative",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
                                    <div style={{position:"absolute",left:-20,top:3,width:12,height:12,borderRadius:"50%",background:dotColor,border:`2px solid ${C.surface}`,flexShrink:0}}/>
                                    <div style={{flex:1}}>
                                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:2}}>
                                        <span style={{fontSize:12,color:C.muted}}>{fmt(h.date)}</span>
                                        <Badge color={h.action==="Prescribed"?"green":h.action==="Refilled"?"blue":"amber"}>{h.action}</Badge>
                                        <span style={{fontSize:12,color:C.muted}}>by {h.by}</span>
                                      </div>
                                      {h.note&&<div style={{fontSize:12,color:C.text}}>{h.note}</div>}
                                      <div style={{fontSize:12,color:C.muted}}>Qty: {h.qty} · {h.daysSupply} days supply</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {showInactiveRx&&inactiveRxs.map((r)=><tr key={r.id} style={{borderBottom:`1px solid ${C.border}`,opacity:0.6}}><td style={{padding:"12px 16px",fontWeight:500,color:C.text}}>{r.med}</td><td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.dose}</td><td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.sig}</td><td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.refills}</td><td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.date?fmt(r.date):"—"}</td><td style={{padding:"12px 16px"}}><Badge color="red">Inactive</Badge></td><td/></tr>)}
          </tbody>
        </table>):<div style={{color:C.muted,fontSize:13}}>No prescriptions on file.</div>}
      </Card>)}
      {tab==="labs"&&(()=>{
        const canOrderLabs=p.writeRx;
        const pendingLabs=labResults.filter(l=>l.status==="pending");
        const resultedLabs=labResults.filter(l=>l.status!=="pending");
        const submitOrder=()=>{
          if(!orderForm.name)return;
          setLabResults(prev=>[...prev,{id:Date.now(),name:orderForm.name,date:today(),status:"pending",orderedBy:orderForm.orderedBy,values:[]}]);
          setOrderForm({name:"",orderedBy:user.name});setShowOrderForm(false);
        };
        const submitResults=(labId)=>{
          const vals=resultRows.filter(r=>r.name&&r.value).map(r=>({name:r.name,value:parseFloat(r.value)||0,unit:r.unit,low:parseFloat(r.low)||0,high:parseFloat(r.high)||999}));
          const hasAbnormal=vals.some(v=>v.value>v.high||v.value<v.low);
          setLabResults(prev=>prev.map(l=>l.id===labId?{...l,status:"resulted",abnormal:hasAbnormal,values:vals}:l));
          setEnterResultsId(null);setResultRows([{name:"",value:"",unit:"",low:"",high:""}]);
        };
        return(
          <Card style={{padding:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text}}>Lab results</div>
              {canOrderLabs&&<button onClick={()=>setShowOrderForm(v=>!v)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Order lab</button>}
            </div>
            {showOrderForm&&(
              <div style={{background:C.raised,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px",marginBottom:16}}>
                <FR><FF label="Lab name"><input value={orderForm.name} onChange={e=>setOrderForm(f=>({...f,name:e.target.value}))} style={IS} placeholder="e.g. Complete Blood Count"/></FF><FF label="Ordered by"><input value={orderForm.orderedBy} onChange={e=>setOrderForm(f=>({...f,orderedBy:e.target.value}))} style={IS}/></FF></FR>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowOrderForm(false)}>Cancel</XB><PB onClick={submitOrder} disabled={!orderForm.name}>Place order</PB></div>
              </div>
            )}
            {pendingLabs.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontWeight:600,fontSize:13,color:C.amber,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:C.amber,display:"inline-block"}}/>Pending Orders ({pendingLabs.length})
                </div>
                {pendingLabs.map((lab)=>(
                  <div key={lab.id} style={{background:C.amberBg,border:`1px solid ${tint(C.amber,19)}`,borderRadius:8,padding:"12px 16px",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:500,fontSize:14,color:C.text}}>{lab.name}</div>
                        <div style={{fontSize:12,color:C.muted,marginTop:2}}>Ordered {fmt(lab.date)} by {lab.orderedBy||"—"}</div>
                      </div>
                      <Badge color="amber">Pending</Badge>
                      {canOrderLabs&&<button onClick={()=>{setEnterResultsId(lab.id===enterResultsId?null:lab.id);setResultRows([{name:"",value:"",unit:"",low:"",high:""}]);}} style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:6,border:`1px solid ${C.navyMid}`,background:C.blueBg,color:C.navyMid,cursor:"pointer"}}>Enter results</button>}
                    </div>
                    {enterResultsId===lab.id&&(
                      <div style={{marginTop:16,background:C.surface,borderRadius:8,padding:"16px",border:`1px solid ${C.border}`}}>
                        <div style={{fontWeight:500,fontSize:12,color:C.muted,marginBottom:10}}>Enter test values</div>
                        {resultRows.map((row,ri)=>(
                          <div key={ri} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 70px 70px auto",gap:8,marginBottom:8,alignItems:"center"}}>
                            <input value={row.name} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,name:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Test name"/>
                            <input value={row.value} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,value:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Value" type="number"/>
                            <input value={row.unit} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,unit:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Unit"/>
                            <input value={row.low} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,low:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Low" type="number"/>
                            <input value={row.high} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,high:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="High" type="number"/>
                            <button onClick={()=>setResultRows(prev=>prev.filter((_,j)=>j!==ri))} aria-label="Remove row" className="icon-btn" style={{border:"none",color:C.muted,cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={14} strokeWidth={1.5}/></button>
                          </div>
                        ))}
                        <div style={{display:"flex",gap:8,marginTop:6}}>
                          <button onClick={()=>setResultRows(prev=>[...prev,{name:"",value:"",unit:"",low:"",high:""}])} className="btn btn-secondary btn-sm" ><Icon as={Plus} size={14}/>Add row</button>
                          <div style={{flex:1}}/>
                          <XB onClick={()=>setEnterResultsId(null)}>Cancel</XB>
                          <PB onClick={()=>submitResults(lab.id)}>Save results</PB>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {resultedLabs.length>0&&(
              <div>
                {pendingLabs.length>0&&<div style={{fontWeight:600,fontSize:13,color:C.green,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:C.green,display:"inline-block"}}/>Resulted ({resultedLabs.length})
                </div>}
                {resultedLabs.map((lab,i)=>{
                  const isExp=expandedLab===lab.id;
                  return(
                    <div key={lab.id} style={{borderBottom:i<resultedLabs.length-1?`1px solid ${C.border}`:"none"}}>
                      <div onClick={()=>setExpandedLab(isExp?null:lab.id)} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:500,fontSize:14,color:C.text}}>{lab.name}</div>
                          <div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmt(lab.date)}{lab.orderedBy&&<span> · {lab.orderedBy}</span>}</div>
                        </div>
                        <Badge color="neutral">Resulted</Badge>
                        {lab.abnormal?<Badge color="red">Abnormal</Badge>:<span style={{fontSize:12,color:C.muted}}>Normal</span>}
                        <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,transform:isExp?"rotate(180deg)":"none",transition:"transform 160ms var(--ease)"}}/>
                      </div>
                      {isExp&&lab.values&&lab.values.length>0&&(
                        <div style={{background:C.raised,borderTop:`1px solid ${C.border}`,padding:"12px 16px"}}>
                          <table style={{width:"100%",borderCollapse:"collapse"}}>
                            <thead><tr style={{background:C.surface}}>{["Test","Value","Unit","Reference Range","Flag"].map(h=><th key={h} style={{padding:"12px 12px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                            <tbody>{lab.values.map((val,vi)=>{
                              const isHigh=val.value>val.high;
                              const isLow=val.value<val.low;
                              const isAbnormal=isHigh||isLow;
                              return(
                                <tr key={vi} style={{background:isAbnormal?C.redBg:"transparent",borderBottom:vi<lab.values.length-1?`1px solid ${C.border}`:"none"}}>
                                  <td style={{padding:"8px 12px",fontWeight:500,fontSize:13,color:C.text}}>{val.name}</td>
                                  <td style={{padding:"8px 12px",fontSize:13,fontWeight:500,color:isAbnormal?C.red:C.text}}>{val.value}</td>
                                  <td style={{padding:"8px 12px",fontSize:12,color:C.muted}}>{val.unit}</td>
                                  <td style={{padding:"8px 12px",fontSize:12,color:C.muted}}>{val.low} – {val.high===999?"No upper limit":val.high}</td>
                                  <td style={{padding:"8px 12px"}}>{isHigh?<Badge color="red">High</Badge>:isLow?<Badge color="red">Low</Badge>:<span style={{fontSize:12,color:C.muted}}>Normal</span>}</td>
                                </tr>
                              );
                            })}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {labResults.length===0&&<div style={{border:`1px dashed ${C.border2}`,borderRadius:8,padding:"40px 20px",textAlign:"center",color:C.muted,fontSize:13}}><FileText size={28} strokeWidth={1.5} aria-hidden="true" style={{marginBottom:8}}/><div>No lab results on file</div></div>}
          </Card>
        );
      })()}
      {tab==="notes"&&(()=>{
        const noteDoctors=["All",...Array.from(new Set(ptN.map(n=>n.doctor)))];
        const hl=(text,term)=>{
          if(!term||!text)return text||"";
          const idx=text.toLowerCase().indexOf(term.toLowerCase());
          if(idx===-1)return text;
          const parts=[];let pos=0;
          let t=text;
          let tl=t.toLowerCase(),sl=term.toLowerCase();
          let i=tl.indexOf(sl);
          while(i!==-1){
            if(i>pos)parts.push(t.slice(pos,i));
            parts.push(<mark key={pos} style={{background:C.amberBg,color:C.text,borderRadius:4,padding:"0 1px"}}>{t.slice(i,i+term.length)}</mark>);
            pos=i+term.length;
            i=tl.indexOf(sl,pos);
          }
          if(pos<t.length)parts.push(t.slice(pos));
          return parts;
        };
        const filtered=ptN.filter(n=>{
          if(signedOnly&&!n.signed)return false;
          if(noteDrFilter!=="All"&&n.doctor!==noteDrFilter)return false;
          if(noteFrom&&n.date<noteFrom)return false;
          if(noteTo&&n.date>noteTo)return false;
          if(noteSearch){
            const s=noteSearch.toLowerCase();
            return (n.chief||"").toLowerCase().includes(s)||(n.assessment||"").toLowerCase().includes(s)||(n.plan||"").toLowerCase().includes(s)||(n.doctor||"").toLowerCase().includes(s);
          }
          return true;
        });
        return(<Card style={{padding:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text}}>Visit notes</div>
              {!canWriteNotes&&<Badge color="neutral">Read only</Badge>}
            </div>
            {canWriteNotes&&<button onClick={()=>setSn(true)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>New note</button>}
          </div>
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 16px",marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:10,alignItems:"flex-end"}}>
              <div><div style={LS}>Search</div><input value={noteSearch} onChange={e=>setNoteSearch(e.target.value)} placeholder="Chief, assessment, plan, doctor…" style={{...IS,width:"100%",boxSizing:"border-box"}}/></div>
              <div><div style={LS}>Doctor</div><select value={noteDrFilter} onChange={e=>setNoteDrFilter(e.target.value)} style={{...SS,width:"100%"}}>{noteDoctors.map(d=><option key={d}>{d}</option>)}</select></div>
              <div><div style={LS}>From</div><input type="date" value={noteFrom} onChange={e=>setNoteFrom(e.target.value)} style={{...IS,width:"100%",boxSizing:"border-box"}}/></div>
              <div><div style={LS}>To</div><input type="date" value={noteTo} onChange={e=>setNoteTo(e.target.value)} style={{...IS,width:"100%",boxSizing:"border-box"}}/></div>
              <div style={{paddingBottom:2}}><label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.text,cursor:"pointer",whiteSpace:"nowrap"}}><input type="checkbox" checked={signedOnly} onChange={e=>setSignedOnly(e.target.checked)}/>Signed only</label></div>
            </div>
            <div style={{marginTop:8,fontSize:12,color:C.muted}}>Showing {filtered.length} of {ptN.length} notes</div>
          </div>
          {filtered.length>0?filtered.map(n=>(
            <div key={n.id} style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"16px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:C.text}}>{hl(n.chief,noteSearch)}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmt(n.date)} · {hl(n.doctor,noteSearch)}</div>
                </div>
                {n.signed?<Badge color="green">Signed</Badge>:<Badge color="amber">Draft</Badge>}
              </div>
              {n.assessment&&<div style={{marginBottom:8}}><div style={{fontSize:12,color:C.muted,marginBottom:4}}>Assessment</div><div style={{fontSize:13,color:C.text}}>{hl(n.assessment,noteSearch)}</div></div>}
              {n.plan&&<div><div style={{fontSize:12,color:C.muted,marginBottom:4}}>Plan</div><div style={{fontSize:13,color:C.text}}>{hl(n.plan,noteSearch)}</div></div>}
            </div>
          )):<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>{ptN.length===0?"No visit notes yet.":"No notes match your filters."}</div>}
        </Card>);
      })()}
      {tab==="files"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text}}>Documents</div>
          <label className="btn btn-primary btn-sm" style={{display:"inline-block"}}>
            + Upload
            <input type="file" style={{display:"none"}} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.xls,.xlsx"/>
          </label>
        </div>
        {patFiles.length>0?(<table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
          <thead><tr>{["File Name","Type","Date","Size",""].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{patFiles.map((f,i)=>(
            <tr key={f.id} style={{borderBottom:i<patFiles.length-1?`1px solid ${C.border}`:"none"}}>
              <td style={{padding:"12px 16px",fontWeight:500,color:C.text}}><span style={{display:"inline-flex",alignItems:"center",gap:8}}><Icon as={FileText} style={{color:C.text2}}/>{f.name}</span></td>
              <td style={{padding:"12px 16px"}}><Badge color="blue">{f.type}</Badge></td>
              <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{fmt(f.date)}</td>
              <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{f.size}</td>
              <td style={{padding:"12px 16px",textAlign:"right"}}><button onClick={()=>setPatFiles(prev=>prev.filter(x=>x.id!==f.id))} style={{fontSize:11,fontWeight:600,padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.red,cursor:"pointer"}}>Remove</button></td>
            </tr>
          ))}</tbody>
        </table>):(
          <label style={{border:`1px dashed ${C.border2}`,borderRadius:8,padding:"40px 20px",textAlign:"center",color:C.muted,fontSize:13,cursor:"pointer",display:"block"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.navyMid} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <FolderOpen size={28} strokeWidth={1.5} aria-hidden="true" style={{marginBottom:8}}/>
            <div>No files yet — click to upload</div>
            <input type="file" style={{display:"none"}} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.xls,.xlsx"/>
          </label>
        )}
      </Card>)}
      {tab==="recalls"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>Recall flags</div><button onClick={()=>setSc(true)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Add recall</button></div>
        {recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).length>0?recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).map((r,i,arr)=><div key={r.id} style={{padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.reason}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Due {fmt(r.due)}</div></div><Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge></div>):<div style={{color:C.muted,fontSize:13}}>No recall flags for this patient.</div>}
      </Card>)}
      {tab==="vaccines"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text}}>Immunization records</div>
          <button onClick={()=>setShowVaccineForm(v=>!v)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Add vaccine</button>
        </div>
        {showVaccineForm&&(
          <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"16px",marginBottom:16,border:`1px solid ${C.border}`}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>New vaccine record</div>
            <FR><FF label="Vaccine name"><input value={vaccineForm.vaccine} onChange={e=>setVaccineForm(f=>({...f,vaccine:e.target.value}))} style={IS} placeholder="e.g. Influenza"/></FF><FF label="Date administered"><input type="date" value={vaccineForm.date} onChange={e=>setVaccineForm(f=>({...f,date:e.target.value}))} style={IS}/></FF></FR>
            <FR><FF label="Given by"><input value={vaccineForm.given_by} onChange={e=>setVaccineForm(f=>({...f,given_by:e.target.value}))} style={IS}/></FF><FF label="Lot number"><input value={vaccineForm.lot} onChange={e=>setVaccineForm(f=>({...f,lot:e.target.value}))} style={IS}/></FF></FR>
            <FR cols={1}><FF label="Next due (optional)"><input type="date" value={vaccineForm.next_due} onChange={e=>setVaccineForm(f=>({...f,next_due:e.target.value}))} style={IS}/></FF></FR>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <XB onClick={()=>setShowVaccineForm(false)}>Cancel</XB>
              <PB onClick={()=>{if(!vaccineForm.vaccine)return;setVaccines(prev=>[...prev,{...vaccineForm,id:Date.now()}]);setVaccineForm({vaccine:"",date:today(),given_by:user.name,lot:"",next_due:""});setShowVaccineForm(false);}}>Save</PB>
            </div>
          </div>
        )}
        {vaccines.length>0?(
          <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
            <thead><tr>{["Vaccine","Date","Given By","Lot #","Next Due"].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{vaccines.map((v,i)=>{
              const dueColor=!v.next_due?null:(v.next_due<today()?C.red:((new Date(v.next_due)-new Date())<90*86400000?C.amber:C.green));
              return(
                <tr key={v.id} style={{borderBottom:i<vaccines.length-1?`1px solid ${C.border}`:"none"}}>
                  <td style={{padding:"12px 16px",fontWeight:500,color:C.text}}>{v.vaccine}</td>
                  <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{fmt(v.date)}</td>
                  <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{v.given_by}</td>
                  <td style={{padding:"12px 16px",color:C.muted,fontFamily:C.mono,fontSize:12}}>{v.lot||"—"}</td>
                  <td style={{padding:"12px 16px"}}>
                    {v.next_due?<span style={{color:dueColor,fontWeight:600,fontSize:13}}>{fmt(v.next_due)}</span>:<span style={{color:C.muted,fontSize:12,fontWeight:500}}>—</span>}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        ):<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>No vaccine records on file.</div>}
      </Card>)}
      {tab==="referrals"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text}}>Referrals</div>
          <button onClick={()=>setShowReferralForm(v=>!v)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>New referral</button>
        </div>
        {showReferralForm&&(
          <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"16px",marginBottom:16,border:`1px solid ${C.border}`}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>New referral</div>
            <FR><FF label="Specialist"><input value={referralForm.specialist} onChange={e=>setReferralForm(f=>({...f,specialist:e.target.value}))} style={IS} placeholder="e.g. Cardiologist"/></FF><FF label="Facility"><input value={referralForm.facility} onChange={e=>setReferralForm(f=>({...f,facility:e.target.value}))} style={IS} placeholder="Hospital or clinic name"/></FF></FR>
            <FR cols={1}><FF label="Reason"><input value={referralForm.reason} onChange={e=>setReferralForm(f=>({...f,reason:e.target.value}))} style={IS} placeholder="Reason for referral"/></FF></FR>
            <FR cols={1}><FF label="Notes"><textarea value={referralForm.notes} onChange={e=>setReferralForm(f=>({...f,notes:e.target.value}))} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <XB onClick={()=>setShowReferralForm(false)}>Cancel</XB>
              <PB onClick={()=>{if(!referralForm.specialist)return;setReferrals(prev=>[...prev,{id:Date.now(),specialist:referralForm.specialist,facility:referralForm.facility,reason:referralForm.reason,sentDate:today(),status:"sent",notes:referralForm.notes}]);setReferralForm({specialist:"",facility:"",reason:"",notes:""});setShowReferralForm(false);}}>Save</PB>
            </div>
          </div>
        )}
        {referrals.length>0?(
          <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
            <thead><tr>{["Specialist","Facility","Reason","Sent Date","Status","Notes"].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{referrals.map((r,i)=>(
              <tr key={r.id} style={{borderBottom:i<referrals.length-1?`1px solid ${C.border}`:"none"}}>
                <td style={{padding:"12px 16px",fontWeight:500,color:C.text}}>{r.specialist}</td>
                <td style={{padding:"12px 16px",color:C.muted,fontSize:12,fontWeight:500}}>{r.facility}</td>
                <td style={{padding:"12px 16px",color:C.muted,fontSize:12,fontWeight:500}}>{r.reason}</td>
                <td style={{padding:"12px 16px",color:C.muted,fontSize:12,fontWeight:500}}>{fmt(r.sentDate)}</td>
                <td style={{padding:"12px 16px"}}>
                  {editingReferral===r.id?(
                    <select defaultValue={r.status} onChange={e=>setReferrals(prev=>prev.map(x=>x.id===r.id?{...x,status:e.target.value}:x))} style={{...SS,width:130,fontSize:12,padding:"4px 8px"}}>
                      {["sent","received","scheduled","completed"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  ):(
                    <span onClick={()=>setEditingReferral(r.id)} style={{cursor:"pointer"}}>
                      <Badge color={r.status==="sent"?"blue":r.status==="received"?"amber":r.status==="scheduled"?"purple":"green"}>{r.status}</Badge>
                    </span>
                  )}
                </td>
                <td style={{padding:"12px 16px",color:C.muted,fontSize:12,fontWeight:500,maxWidth:160}}>{editingReferral===r.id?(
                  <input defaultValue={r.notes} onBlur={e=>{setReferrals(prev=>prev.map(x=>x.id===r.id?{...x,notes:e.target.value}:x));setEditingReferral(null);}} style={{...IS,fontSize:12,padding:"4px 8px"}} autoFocus/>
                ):r.notes||<span style={{fontStyle:"italic"}}>—</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        ):<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>No referrals on file.</div>}
      </Card>)}
      {tab==="timeline"&&(()=>{
        const patientFullN=`${patient.first_name} ${patient.last_name}`;
        const apptEvents=(appts||[]).filter(a=>a.patient===patientFullN).map(a=>({type:"appointment",date:a.date,title:a.type.replace(/-/g," "),detail:`${a.doctor} \u00b7 ${a.status}`,status:a.status,id:"a"+a.id}));
        const noteEvents=(notes[patient.id]||[]).map(n=>({type:"note",date:n.date,title:"Clinical Note",detail:n.chief,signed:n.signed,id:"n"+n.id}));
        const vhEvents=((vitals||{})[patient.id]||[]).map((e,i)=>({type:"vitals",date:e.date,title:"Vitals Recorded",detail:`BP: ${e.bp}, Weight: ${e.weight}lbs`,id:"v"+i}));
        const allEvents=[...apptEvents,...noteEvents,...vhEvents].sort((a,b)=>b.date.localeCompare(a.date));
        if(allEvents.length===0)return(
          <Card style={{padding:"40px",textAlign:"center"}}><ClipboardList size={28} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,marginBottom:8}}/><div style={{color:C.muted,fontSize:13}}>No history recorded for this patient</div></Card>
        );
        // Group by month
        const groups={};
        allEvents.forEach(ev=>{
          const [y,m]=ev.date.split("-");
          const key=`${y}-${m}`;
          if(!groups[key])groups[key]=[];
          groups[key].push(ev);
        });
        const typeIcon={appointment:CalendarDays,note:NotebookPen,vitals:Activity};
        const MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
        return(
          <Card style={{padding:"20px"}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:20}}>Patient history timeline</div>
            {Object.entries(groups).sort((a,b)=>b[0].localeCompare(a[0])).map(([key,evts])=>{
              const [y,m]=key.split("-");
              const monthLabel=`${MONTH_NAMES[parseInt(m)-1]} ${y}`;
              return(
                <div key={key}>
                  <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0 12px"}}>
                    <div style={{flex:1,height:1,background:C.border}}/>
                    <div style={{fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>{monthLabel}</div>
                    <div style={{flex:1,height:1,background:C.border}}/>
                  </div>
                  <div style={{position:"relative",paddingLeft:32}}>
                    <div style={{position:"absolute",left:11,top:0,bottom:0,width:2,background:C.border}}/>
                    {evts.map(ev=>{
                      const TI=typeIcon[ev.type]||ClipboardList;
                      return(
                        <div key={ev.id} style={{position:"relative",marginBottom:16,display:"flex",gap:16,alignItems:"flex-start"}}>
                          <div style={{position:"absolute",left:-21,top:6,width:22,height:22,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border2}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><TI size={12} strokeWidth={1.5} aria-hidden="true"/></div>
                          <div style={{flex:1,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 16px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                              <div style={{fontWeight:500,fontSize:14,color:C.text}}>{ev.title.charAt(0).toUpperCase()+ev.title.slice(1)}</div>
                              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                                <span style={{fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>{fmt(ev.date)}</span>
                                {ev.status&&<SB status={ev.status}/>}
                                {ev.type==="note"&&(ev.signed?<Badge color="green">Signed</Badge>:<Badge color="amber">Draft</Badge>)}
                              </div>
                            </div>
                            <div style={{fontSize:12,color:C.muted}}>{ev.detail}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </Card>
        );
      })()}
    </div>
  );
}

// ─── VitalsTrendChart ────────────────────────────────────────────────────────
export function VitalsTrendChart({data, field}){
  if(!data||data.length<2)return<div style={{fontSize:12,color:C.muted,textAlign:"center",padding:"20px 0"}}>No data available</div>;
  const vals=data.map(d=>{
    if(field==="systolic"){const s=d.bp?parseInt(d.bp.split("/")[0]):null;return s;}
    if(field==="weight")return d.weight;
    if(field==="glucose")return d.glucose;
    return null;
  }).filter(v=>v!==null&&v!==undefined);
  if(vals.length<2)return<div style={{fontSize:12,color:C.muted,textAlign:"center",padding:"20px 0"}}>No data available</div>;
  const allVals=data.map(d=>{
    if(field==="systolic")return d.bp?parseInt(d.bp.split("/")[0]):null;
    if(field==="weight")return d.weight;
    if(field==="glucose")return d.glucose;
    return null;
  });
  const filtered=allVals.filter(v=>v!==null&&v!==undefined);
  const minV=Math.min(...filtered);const maxV=Math.max(...filtered);
  const range=maxV-minV||1;
  const W=340,H=100,PAD=28;
  const color=C.navyMid;
  const pts=data.map((d,i)=>{
    const v=allVals[i];
    if(v===null||v===undefined)return null;
    const x=PAD+(i/(data.length-1))*(W-PAD*2);
    const y=H-PAD-((v-minV)/range)*(H-PAD*2);
    return{x,y,v,date:d.date};
  }).filter(Boolean);
  const polyline=pts.map(p=>`${p.x},${p.y}`).join(" ");
  const label=field==="systolic"?"Systolic BP (mmHg)":field==="weight"?"Weight (lbs)":"Glucose (mg/dL)";
  return(
    <div>
      <div style={{fontSize:12,color:C.muted,marginBottom:4}}>{label}</div>
      <svg width={W} height={H+20} style={{overflow:"visible"}}>
        <text x={0} y={PAD} fontSize={9} fill={C.muted}>{maxV}</text>
        <text x={0} y={H-PAD+4} fontSize={9} fill={C.muted}>{minV}</text>
        <polyline points={polyline} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round"/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill={color} stroke="var(--c-surface)" strokeWidth={1.5}/>
            <text x={p.x} y={H+14} fontSize={9} fill={C.muted} textAnchor="middle">{p.date.slice(5)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

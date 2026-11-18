import React, { useState, useRef } from "react";
import { Check, CircleCheck, FileText, ScanLine, Moon, NotebookPen, Info } from "lucide-react";
import { ALLERGY_CROSS_REACTIVITY, DRUG_INTERACTIONS } from "./lib/data";
import { addDaysToDate, fmt, nowTime, today } from "./lib/utils";
import { Alert, C, FF, FR, IS, Icon, LS, LoadingButton, Modal, OK, PB, SS, XB } from "./ui";

export function NewApptModal({onClose,onSave,patients,defaultDate,appts=[],prefillTime,blockTimes=[],prefill={}}){
  const[f,sf]=useState({pid:prefill.pid||"",date:prefill.date||defaultDate||today(),time:prefillTime||"09:00",dur:"30",doc:prefill.doc||"Dr. Patel",type:prefill.type||"routine",notes:prefill.notes||""});
  const[ok,sok]=useState(false);
  const[conflict,setConflict]=useState(null);
  const[forceOk,setForceOk]=useState(false);
  const[dirty,setDirty]=useState(false);
  const[savingAppt,setSavingAppt]=useState(false);
  const[recurring,setRecurring]=useState(false);
  const[recFreq,setRecFreq]=useState("Weekly");
  const[recCount,setRecCount]=useState(3);
  const[recurDates,setRecurDates]=useState([]);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setConflict(null);setForceOk(false);setDirty(true);};
  const handleClose=()=>{if(dirty&&!window.confirm("You have unsaved changes. Are you sure?"))return;onClose();};
  const freqDays={Weekly:7,"Bi-weekly":14,Monthly:30,"Every 3 months":91};
  const getRecurDates=()=>{
    const days=freqDays[recFreq]||7;
    const dates=[];
    for(let i=0;i<recCount;i++){dates.push(addDaysToDate(f.date,i*days));}
    return dates;
  };
  useState(()=>{if(recurring)setRecurDates(getRecurDates());},[recurring,recFreq,recCount,f.date]);
  const previewDates=recurring?getRecurDates():[];
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
  // Double-booking: same patient same date
  const doubleBook=f.pid?appts.find(a=>{
    const pt=patients.find(p=>p.id===parseInt(f.pid));
    if(!pt)return false;
    return a.date===f.date&&a.patient===`${pt.first_name} ${pt.last_name}`&&a.status!=="no-show"&&a.status!=="completed";
  }):null;
  // Block time check
  const blockedSlot=(blockTimes||[]).find(b=>{
    if(b.doctor!==f.doc&&b.doctor!=="Dr. Patel"&&b.doctor!=="All")return false;
    if(b.date!==f.date)return false;
    const[sh,sm]=f.time.split(":").map(Number);const start=sh*60+sm;const end=start+parseInt(f.dur);
    const[bh,bm]=b.from.split(":").map(Number);const bStart=bh*60+bm;
    const[eh,em]=b.to.split(":").map(Number);const bEnd=eh*60+em;
    return start<bEnd&&end>bStart;
  });
  const sub=()=>{
    if(!f.pid)return;
    if(!forceOk){const c=checkConflict();if(c){setConflict(c);return;}}
    setSavingAppt(true);
    setTimeout(()=>{
      const pt=patients.find(p=>p.id===parseInt(f.pid));
      if(recurring){
        const dates=getRecurDates();
        dates.forEach((d,i)=>{
          onSave({id:Date.now()+i,patient:`${pt.first_name} ${pt.last_name}`,type:f.type,time:f.time,duration:parseInt(f.dur),doctor:f.doc,status:"scheduled",date:d});
        });
      } else {
        onSave({id:Date.now(),patient:`${pt.first_name} ${pt.last_name}`,type:f.type,time:f.time,duration:parseInt(f.dur),doctor:f.doc,status:"scheduled",date:f.date});
      }
      setSavingAppt(false);
      sok(true);setTimeout(onClose,1400);
    },500);
  };
  return(
    <Modal title="New Appointment" onClose={handleClose}>
      {ok&&<OK msg={recurring?`${previewDates.length} recurring appointments scheduled!`:"Appointment scheduled"}/>}
      <FR cols={1}><FF label="Patient"><select value={f.pid} onChange={e=>s("pid",e.target.value)} style={SS}><option value="">Select a patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}</select></FF></FR>
      {doubleBook&&<div style={{background:C.amberBg,border:`1px solid color-mix(in srgb, ${C.amber} 18%, var(--c-surface))`,borderRadius:8,padding:"10px 16px",marginBottom:12,fontSize:12,color:C.amber}}><strong>Note:</strong> {doubleBook.patient} already has an appointment at {doubleBook.time} with {doubleBook.doctor} on this date.</div>}
      <FR><FF label="Date"><input type="date" value={f.date} onChange={e=>s("date",e.target.value)} style={IS}/></FF><FF label="Time"><input type="time" value={f.time} onChange={e=>s("time",e.target.value)} style={IS}/></FF></FR>
      <div style={{marginBottom:16}}>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <input type="checkbox" checked={recurring} onChange={e=>setRecurring(e.target.checked)} style={{width:15,height:15}}/>
          <span style={{fontSize:13,fontWeight:600,color:C.text}}>Recurring Appointment</span>
        </label>
        {recurring&&(
          <div style={{marginTop:10,paddingLeft:24,display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
            <FF label="Frequency"><select value={recFreq} onChange={e=>setRecFreq(e.target.value)} style={{...SS,width:160}}>
              {["Weekly","Bi-weekly","Monthly","Every 3 months"].map(o=><option key={o}>{o}</option>)}
            </select></FF>
            <FF label="Occurrences"><input type="number" min={1} max={12} value={recCount} onChange={e=>setRecCount(Math.max(1,Math.min(12,parseInt(e.target.value)||1)))} style={{...IS,width:80}}/></FF>
          </div>
        )}
        {recurring&&previewDates.length>0&&(
          <div style={{marginTop:10,background:C.blueBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 16px",fontSize:12}}>
            <div style={{fontWeight:600,color:C.navyMid,marginBottom:6}}>{previewDates.length} appointments will be created on:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{previewDates.map((d,i)=><span key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 8px",color:C.text}}>{d}</span>)}</div>
          </div>
        )}
      </div>
      <FR>
        <FF label="Doctor"><select value={f.doc} onChange={e=>s("doc",e.target.value)} style={SS}><option>Dr. Patel</option><option>Dr. Williams</option></select></FF>
        <FF label="Duration"><select value={f.dur} onChange={e=>s("dur",e.target.value)} style={SS}><option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option></select></FF>
      </FR>
      {blockedSlot&&<Alert tone="amber" title={`${blockedSlot.reason} block for ${blockedSlot.doctor}, ${blockedSlot.from}–${blockedSlot.to}`} meta="You can still book" style={{marginBottom:12}}/>}
      <FR cols={1}><FF label="Appointment type"><select value={f.type} onChange={e=>s("type",e.target.value)} style={SS}><option value="routine">Routine</option><option value="follow-up">Follow-up</option><option value="urgent">Urgent</option><option value="new-patient">New patient</option><option value="procedure">Procedure</option></select></FF></FR>
      <FR cols={1}><FF label="Notes (optional)"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={3} placeholder="Reason for visit or special instructions…" style={{...IS,resize:"vertical"}}/></FF></FR>
      {conflict&&!forceOk&&(
        <Alert tone="amber" title="Scheduling conflict" style={{marginBottom:16}} actions={<button onClick={()=>setForceOk(true)} className="btn btn-secondary btn-sm">Book anyway</button>}>
          {f.doc} already has {conflict.patient} at {conflict.time} on this date.
        </Alert>
      )}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><LoadingButton onClick={sub} disabled={!f.pid||ok} loading={savingAppt}>Schedule Appointment</LoadingButton></div>
    </Modal>
  );
}

export const DEMO_SCAN={fn:"Eleanor",ln:"Whitmore",dob:"1959-03-14",gender:"F",phone:"555-0847",email:"eleanor.whitmore@email.com",address:"47 Oak Lane, Springfield, IL 62702",ins:"Medicare",ins_id:"1EG4-TE5-MK72",ec_name:"Robert Whitmore",ec_phone:"555-0849",allergies:"Penicillin, Aspirin"};
export const SCAN_STEPS=["Reading document…","Detecting patient info…","Extracting demographics…","Parsing insurance details…","Filling form fields…"];

export function NewPatientModal({onClose,onSave}){
  const[f,sf]=useState({fn:"",ln:"",dob:"",gender:"",phone:"",email:"",address:"",ins:"",ins_id:"",ec_name:"",ec_phone:"",allergies:""});
  const[ok,sok]=useState(false);
  const[dirty,setDirty]=useState(false);
  const[scanning,setScanning]=useState(false);
  const[scanStep,setScanStep]=useState(0);
  const[scanDone,setScanDone]=useState(false);
  const[dragOver,setDragOver]=useState(false);
  const fileRef=useRef(null);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setDirty(true);};
  const handleClose=()=>{if(dirty&&!window.confirm("You have unsaved changes. Are you sure?"))return;onClose();};
  const sub=()=>{
    if(!f.fn||!f.ln||!f.dob)return;
    onSave({id:Date.now(),first_name:f.fn,last_name:f.ln,dob:f.dob,gender:f.gender,phone:f.phone,insurance:f.ins,allergies:f.allergies?f.allergies.split(",").map(a=>a.trim()).filter(Boolean):[],lastVisit:today()});
    sok(true);setTimeout(onClose,1400);
  };
  const runScan=()=>{
    if(scanning||scanDone)return;
    setScanning(true);setScanStep(0);
    let step=0;
    const iv=setInterval(()=>{
      step++;
      if(step<SCAN_STEPS.length){setScanStep(step);}
      else{
        clearInterval(iv);
        sf(DEMO_SCAN);setDirty(true);
        setScanning(false);setScanDone(true);
      }
    },520);
  };
  const onFile=(e)=>{const file=e.target.files?.[0];if(file)runScan();};
  const onDrop=(e)=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files?.[0])runScan();};
  return(
    <Modal title="New Patient Registration" onClose={handleClose} width={640}>
      {ok&&<OK msg="Patient registered"/>}
      {/* ── Document upload zone ── */}
      {!scanDone&&!scanning&&(
        <div
          onClick={()=>fileRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={onDrop}
          style={{border:`1px dashed ${dragOver?C.text2:C.border2}`,borderRadius:8,padding:"20px",marginBottom:20,textAlign:"center",cursor:"pointer",background:dragOver?C.raised:"transparent",transition:"background-color 160ms var(--ease), border-color 160ms var(--ease)"}}>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.tiff" style={{display:"none"}} onChange={onFile}/>
          <ScanLine size={24} strokeWidth={1.5} aria-hidden="true" style={{color:C.text2,marginBottom:8}}/>
          <div style={{fontWeight:600,fontSize:14,color:C.text,marginBottom:4}}>Upload a scanned document to fill the form</div>
          <div style={{fontSize:12,color:C.muted}}>Intake form, insurance card, referral letter — drag & drop or click to browse</div>
          <div className="btn btn-secondary btn-sm" style={{marginTop:12}}>Choose file</div>
        </div>
      )}
      {scanning&&(
        <div style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"20px",marginBottom:20,textAlign:"center"}}>
          <ScanLine size={24} strokeWidth={1.5} aria-hidden="true" style={{color:C.text2,marginBottom:8}}/>
          <div style={{fontWeight:600,fontSize:13,color:C.text,marginBottom:6}}>Scanning document…</div>
          <div role="status" style={{fontSize:12,color:C.text2,marginBottom:12}}>{SCAN_STEPS[scanStep]}</div>
          <div style={{background:C.raised,borderRadius:3,height:4,overflow:"hidden"}}>
            <div style={{height:"100%",background:C.navyMid,borderRadius:4,transition:"width 400ms var(--ease)",width:`${((scanStep+1)/SCAN_STEPS.length)*100}%`}}/>
          </div>
        </div>
      )}
      {scanDone&&(
        <Alert tone="green" title="12 fields filled from the document" meta="Check them before registering" style={{marginBottom:16}}
          actions={<button onClick={()=>{setScanDone(false);sf({fn:"",ln:"",dob:"",gender:"",phone:"",email:"",address:"",ins:"",ins_id:"",ec_name:"",ec_phone:"",allergies:""});}} className="text-link">Clear the form</button>}/>
      )}
      <div style={{fontSize:12,color:C.muted,marginBottom:12}}>Personal Information</div>
      <FR><FF label="First name"><input value={f.fn} onChange={e=>s("fn",e.target.value)} style={IS} placeholder="Jane"/></FF><FF label="Last name"><input value={f.ln} onChange={e=>s("ln",e.target.value)} style={IS} placeholder="Doe"/></FF></FR>
      <FR><FF label="Date of birth"><input type="date" value={f.dob} onChange={e=>s("dob",e.target.value)} style={IS}/></FF><FF label="Gender"><select value={f.gender} onChange={e=>s("gender",e.target.value)} style={SS}><option value="">Select…</option><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option></select></FF></FR>
      <FR><FF label="Phone"><input value={f.phone} onChange={e=>s("phone",e.target.value)} style={IS} placeholder="555-0100"/></FF><FF label="Email"><input type="email" value={f.email} onChange={e=>s("email",e.target.value)} style={IS} placeholder="jane@email.com"/></FF></FR>
      <FR cols={1}><FF label="Address"><input value={f.address} onChange={e=>s("address",e.target.value)} style={IS} placeholder="123 Main St, City, ST 00000"/></FF></FR>
      <div style={{fontSize:12,color:C.muted,margin:"20px 0 12px"}}>Insurance</div>
      <FR><FF label="Insurance provider"><input value={f.ins} onChange={e=>s("ins",e.target.value)} style={IS} placeholder="BlueCross, Medicare…"/></FF><FF label="Member ID"><input value={f.ins_id} onChange={e=>s("ins_id",e.target.value)} style={IS}/></FF></FR>
      <div style={{fontSize:12,color:C.muted,margin:"20px 0 12px"}}>Emergency Contact</div>
      <FR><FF label="Name"><input value={f.ec_name} onChange={e=>s("ec_name",e.target.value)} style={IS}/></FF><FF label="Phone"><input value={f.ec_phone} onChange={e=>s("ec_phone",e.target.value)} style={IS}/></FF></FR>
      <div style={{fontSize:12,color:C.muted,margin:"20px 0 12px"}}>Clinical</div>
      <FR cols={1}><FF label="Known allergies (comma-separated)"><input value={f.allergies} onChange={e=>s("allergies",e.target.value)} style={IS} placeholder="Penicillin, Sulfa, Latex…"/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><PB onClick={sub} disabled={!f.fn||!f.ln||!f.dob||ok}>Register patient</PB></div>
    </Modal>
  );
}

export function VitalsModal({patient,onClose,onSave}){
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
      {ok&&<OK msg="Vitals recorded"/>}
      {patient.allergies.length>0&&<Alert tone="red" title="Allergies" meta={patient.allergies.join(", ")} style={{marginBottom:16}}/>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        <div><label style={LS}>Systolic</label><input value={f.sys} onChange={e=>s("sys",e.target.value)} style={IS} placeholder="120" type="number"/></div>
        <div><label style={LS}>Diastolic</label><input value={f.dia} onChange={e=>s("dia",e.target.value)} style={IS} placeholder="80" type="number"/></div>
        <div><label style={LS}>Heart rate</label><input value={f.hr} onChange={e=>s("hr",e.target.value)} style={IS} placeholder="72" type="number"/></div>
      </div>
      <FR><FF label="Temperature °F"><input value={f.temp} onChange={e=>s("temp",e.target.value)} style={IS} placeholder="98.6" type="number" step="0.1"/></FF><FF label="O₂ sat %"><input value={f.o2} onChange={e=>s("o2",e.target.value)} style={IS} placeholder="98" type="number"/></FF></FR>
      <FR><FF label="Weight (lbs)"><input value={f.wt} onChange={e=>s("wt",e.target.value)} style={IS} placeholder="160" type="number"/></FF><FF label="Height (inches)"><input value={f.ht} onChange={e=>s("ht",e.target.value)} style={IS} placeholder="65" type="number"/></FF></FR>
      {bmi&&<div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"12px 16px",marginBottom:16,display:"flex",gap:20,alignItems:"center"}}><div><div style={{fontSize:12,color:C.muted,}}>BMI</div><div style={{fontSize:24,fontWeight:600,color:parseFloat(bmi)>30?C.red:parseFloat(bmi)>25?C.amber:C.green}}>{bmi}</div></div><div style={{fontSize:12,color:C.muted}}>{parseFloat(bmi)<18.5?"Underweight":parseFloat(bmi)<25?"Normal weight":parseFloat(bmi)<30?"Overweight":"Obese"}</div></div>}
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.sys||!f.dia||!f.hr||ok}>Save vitals</PB></div>
    </Modal>
  );
}

export function calcDaysSupply(qty,sig){
  const qtyNum=parseInt((qty||"").replace(/\D/g,""));
  if(!qtyNum||!sig)return null;
  const s=sig.toLowerCase();
  let perDay=null;
  if(/four\s*times|qid|4\s*times/.test(s))perDay=4;
  else if(/three\s*times|tid|3\s*times/.test(s))perDay=3;
  else if(/twice|bid|two\s*times|2\s*times/.test(s))perDay=2;
  else if(/every\s*6/.test(s))perDay=4;
  else if(/every\s*8/.test(s))perDay=3;
  else if(/every\s*12/.test(s))perDay=2;
  else if(/once|daily|qd|od|every\s*day|1\s*time/.test(s))perDay=1;
  else if(/weekly|once\s*a?\s*week/.test(s))perDay=1/7;
  if(!perDay)return null;
  return Math.round(qtyNum/perDay);
}

export function RxModal({patient,onClose,onSave,rx}){
  const[f,sf]=useState({med:"",dose:"",sig:"",qty:"",refills:"0",notes:""});
  const[ok,sok]=useState(false);
  const[dirty,setDirty]=useState(false);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setDirty(true);};
  const handleClose=()=>{if(dirty&&!window.confirm("You have unsaved changes. Are you sure?"))return;onClose();};
  const drugs=["Amoxicillin","Metformin","Lisinopril","Atorvastatin","Omeprazole","Levothyroxine","Amlodipine","Metoprolol","Gabapentin","Sertraline"];
  const daysSupply=calcDaysSupply(f.qty,f.sig);
  const existingMeds=(rx||[]).map(r=>r.med);
  const interactions=f.med?DRUG_INTERACTIONS.filter(di=>{
    const newMedLower=f.med.toLowerCase();
    const matchesNew=di.drugs.some(d=>newMedLower.includes(d.toLowerCase())||d.toLowerCase().includes(newMedLower));
    const matchesExisting=di.drugs.some(d=>existingMeds.some(em=>em.toLowerCase().includes(d.toLowerCase())||d.toLowerCase().includes(em.toLowerCase())));
    return matchesNew&&matchesExisting&&di.drugs.some(d=>newMedLower.includes(d.toLowerCase())||d.toLowerCase().includes(newMedLower))&&di.drugs.some(d=>existingMeds.some(em=>em.toLowerCase().includes(d.toLowerCase())||d.toLowerCase().includes(em.toLowerCase())));
  }):[];
  // Allergy check
  const patAllergies=(patient.allergies||[]);
  const allergyAlert=f.med?((()=>{
    const medL=f.med.toLowerCase();
    // Direct match
    for(const allergen of patAllergies){
      const aL=allergen.toLowerCase();
      if(medL.includes(aL)||aL.includes(medL)){
        return {type:"direct",allergen,med:f.med};
      }
    }
    // Cross-reactivity
    for(const allergen of patAllergies){
      const crossList=ALLERGY_CROSS_REACTIVITY[allergen]||[];
      for(const crossMed of crossList){
        const cL=crossMed.toLowerCase();
        if(medL.includes(cL)||cL.includes(medL)){
          return {type:"cross",allergen,med:f.med};
        }
      }
    }
    return null;
  })()):null;
  const sub=()=>{
    if(!f.med||!f.dose)return;
    onSave(patient.id,{id:Date.now(),med:f.med,dose:f.dose,sig:f.sig,qty:f.qty,refills:parseInt(f.refills),date:today()});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title={`New Prescription — ${patient.first_name} ${patient.last_name}`} onClose={handleClose} width={560}>
      {ok&&<OK msg="Prescription saved"/>}
      {patAllergies.length>0&&(
        <div style={{background:C.redBg,border:`1px solid color-mix(in srgb, ${C.red} 18%, var(--c-surface))`,borderRadius:8,padding:"10px 16px",marginBottom:16}}>
          <div style={{color:C.red,fontSize:12,fontWeight:500,marginBottom:4}}>Known Allergies</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {patAllergies.map(a=><span key={a} style={{background:C.red,color:"var(--c-surface)",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:4}}>{a}</span>)}
          </div>
        </div>
      )}
      <FR cols={1}><FF label="Medication name"><input value={f.med} onChange={e=>s("med",e.target.value)} style={IS} placeholder="Start typing or pick below…" list="dl"/><datalist id="dl">{drugs.map(d=><option key={d} value={d}/>)}</datalist></FF></FR>
      {allergyAlert&&allergyAlert.type==="direct"&&(
        <Alert tone="red" title={`Allergy: patient is allergic to ${allergyAlert.allergen}`} style={{marginBottom:8}}>Do not prescribe without a documented override.</Alert>
      )}
      {allergyAlert&&allergyAlert.type==="cross"&&(
        <Alert tone="amber" title="Possible cross-reactivity" style={{marginBottom:8}}>Patient has a {allergyAlert.allergen} allergy; {allergyAlert.med} may cause a reaction.</Alert>
      )}
      {interactions.length>0&&interactions.map((di,i)=>(
        <Alert key={i} tone={di.severity==="high"?"red":"amber"} title={di.severity==="high"?"High-risk interaction":"Interaction caution"} meta={di.drugs.join(" + ")} style={{marginBottom:8}}>{di.effect}</Alert>
      ))}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{drugs.slice(0,6).map(d=><button key={d} onClick={()=>s("med",d)} style={{fontSize:12,height:28,padding:"0 10px",borderRadius:6,border:`1px solid ${f.med===d?C.border2:C.border}`,background:f.med===d?C.navyBg:C.surface,color:f.med===d?C.text:C.text2,cursor:"pointer",fontWeight:f.med===d?500:400,fontFamily:"inherit"}}>{d}</button>)}</div>
      <FR><FF label="Dose"><input value={f.dose} onChange={e=>s("dose",e.target.value)} style={IS} placeholder="500mg"/></FF><FF label="Quantity"><input value={f.qty} onChange={e=>s("qty",e.target.value)} style={IS} placeholder="30 tablets"/></FF></FR>
      <FR cols={1}><FF label="Instructions (sig)"><input value={f.sig} onChange={e=>s("sig",e.target.value)} style={IS} placeholder="Take once daily with food…"/></FF></FR>
      {daysSupply!==null&&<div style={{marginTop:-8,marginBottom:16,fontSize:13,color:C.text2,display:"flex",alignItems:"center",gap:6}}><Icon as={Info} size={14} style={{color:C.muted}}/>About {daysSupply} days' supply</div>}
      <FR cols={1}><FF label="Refills"><select value={f.refills} onChange={e=>s("refills",e.target.value)} style={SS}>{[0,1,2,3,5,11].map(n=><option key={n} value={n}>{n} refill{n!==1?"s":""}</option>)}</select></FF></FR>
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}} placeholder="Additional instructions…"/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><PB onClick={sub} disabled={!f.med||!f.dose||ok||!!(allergyAlert&&allergyAlert.type==="direct")}>Save prescription</PB></div>
    </Modal>
  );
}

export function NoteModal({patient,onClose,onSave,user,draftNotes,setDraftNotes}){
  const draft=(draftNotes||{})[patient.id]||{};
  const[f,sf]=useState({chief:draft.chief||"",subj:draft.subj||"",obj:draft.obj||"",assess:draft.assess||"",plan:draft.plan||"",sign:false});
  const[ok,sok]=useState(false);
  const[medsConfirmed,setMedsConfirmed]=useState(false);
  const[medsTs,setMedsTs]=useState(null);
  const[dirty,setDirty]=useState(false);
  const[savingNote,setSavingNote]=useState(false);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setDirty(true);};
  const handleClose=()=>{
    if(dirty&&!window.confirm("You have unsaved changes. Are you sure?"))return;
    // Save draft on close without signing
    if(dirty&&setDraftNotes){setDraftNotes(p=>({...p,[patient.id]:{chief:f.chief,subj:f.subj,obj:f.obj,assess:f.assess,plan:f.plan}}));}
    onClose();
  };
  const confirmMeds=()=>{setMedsConfirmed(true);setMedsTs(nowTime());};
  const sub=()=>{
    if(!f.chief||!f.assess)return;
    setSavingNote(true);
    setTimeout(()=>{
      const doctorName=user?.name||"Dr. Patel";
      const noteObj={id:Date.now(),date:today(),doctor:doctorName,chief:f.chief,assessment:f.assess,plan:f.plan,signed:f.sign};
      if(medsConfirmed)noteObj.medsReconciled={by:doctorName,at:medsTs};
      onSave(patient.id,noteObj);
      if(setDraftNotes)setDraftNotes(p=>{const n={...p};delete n[patient.id];return n;});
      setSavingNote(false);
      sok(true);setTimeout(onClose,1500);
    },500);
  };
  const soap=[
    {key:"subj",label:"S — Subjective",hint:"What the patient tells you",ph:"Patient's description of symptoms, history…"},
    {key:"obj", label:"O — Objective", hint:"What you observe/measure",    ph:"Exam findings, vitals, lab results…"},
    {key:"assess",label:"A — Assessment *",hint:"Clinical interpretation",  ph:"Diagnosis or differential diagnoses…"},
    {key:"plan",label:"P — Plan",         hint:"What happens next",         ph:"Treatment, referrals, follow-up…"},
  ];
  return(
    <Modal title={`Visit note · ${patient.first_name} ${patient.last_name}`} onClose={handleClose} width={680}>
      {ok&&<OK msg={f.sign?"Note signed and locked":"Note saved as draft"}/>}
      {!medsConfirmed?(
        <Alert tone="amber" title="Confirm the medication list is up to date" style={{marginBottom:16}} actions={<button onClick={confirmMeds} className="btn btn-secondary btn-sm"><Icon as={Check} size={14}/>Medications confirmed</button>}/>
      ):(
        <div style={{fontSize:12,color:C.muted,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Icon as={CircleCheck} size={14} style={{color:C.green}}/>Medications reconciled at {medsTs} by {user?.name||"Doctor"}</div>
      )}
      {draft.chief&&<div style={{marginBottom:12,fontSize:12,color:C.text2,display:"flex",alignItems:"center",gap:6}}><Icon as={NotebookPen} size={14} style={{color:C.muted}}/>Draft restored from your last session</div>}
      <FR cols={1}><FF label="Chief complaint"><input value={f.chief} onChange={e=>s("chief",e.target.value)} style={IS} placeholder="e.g. Follow-up for hypertension, chest pain x 2 days…"/></FF></FR>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {soap.map(sec=>(
          <div key={sec.key}>
            <div style={{marginBottom:6}}>
              <label style={{...LS,display:"inline"}}>{sec.label}</label>
              <span style={{fontSize:12,color:C.muted,marginLeft:8,fontStyle:"italic",textTransform:"none",letterSpacing:"normal"}}>{sec.hint}</span>
            </div>
            <textarea value={f[sec.key]} onChange={e=>s(sec.key,e.target.value)} rows={4} placeholder={sec.ph} style={{...IS,resize:"vertical",fontSize:13}}/>
          </div>
        ))}
      </div>
      <div style={{background:f.sign?C.amberBg:C.bg,border:`1px solid ${f.sign?C.amber:C.border}`,borderRadius:8,padding:"16px 16px",marginBottom:20}}>
        <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
          <input type="checkbox" checked={f.sign} onChange={e=>s("sign",e.target.checked)} style={{width:16,height:16,cursor:"pointer"}}/>
          <div>
            <div style={{fontWeight:600,fontSize:13,color:f.sign?C.amber:C.text}}>Sign &amp; Lock Note</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Once signed, this note cannot be edited.</div>
          </div>
        </label>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
        <XB onClick={handleClose}>Cancel</XB>
        <LoadingButton onClick={sub} disabled={!f.chief||!f.assess||ok} loading={savingNote}
          style={{background:f.sign?((!f.chief||!f.assess||ok||savingNote)?C.disabled:C.amber):((!f.chief||!f.assess||ok||savingNote)?C.disabled:C.navyMid)}}>
          {f.sign?"Sign & Lock":"Save Draft"}
        </LoadingButton>
      </div>
    </Modal>
  );
}

export function RecallModal({onClose,onSave,patients}){
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
      {ok&&<OK msg="Recall flag added"/>}
      <FR cols={1}><FF label="Patient"><select value={f.pid} onChange={e=>s("pid",e.target.value)} style={SS}><option value="">Select a patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}</select></FF></FR>
      <FR cols={1}><FF label="Reason"><input value={f.reason} onChange={e=>s("reason",e.target.value)} style={IS} placeholder="e.g. Annual physical…" list="rl"/><datalist id="rl">{reasons.map(r=><option key={r} value={r}/>)}</datalist></FF></FR>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{reasons.slice(0,5).map(r=><button key={r} onClick={()=>s("reason",r)} style={{fontSize:11,padding:"4px 10px",borderRadius:6,border:`1px solid ${C.border}`,background:f.reason===r?C.blueBg:C.bg,color:f.reason===r?C.blue:C.muted,cursor:"pointer",fontWeight:600}}>{r}</button>)}</div>
      <FR><FF label="Due date"><input type="date" value={f.due} onChange={e=>s("due",e.target.value)} style={IS}/></FF><FF label="Urgency"><select value={f.urgency} onChange={e=>s("urgency",e.target.value)} style={SS}><option value="low">Low — Upcoming</option><option value="medium">Medium — This week</option><option value="high">High — Overdue/Urgent</option></select></FF></FR>
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.pid||!f.reason||!f.due||ok}>Add recall</PB></div>
    </Modal>
  );
}

// ─── FILES POPUP MODAL ────────────────────────────────────────────────────────
export function FilesPopupModal({files,patientName,onClose,onContinue}){
  return(
    <Modal title={`Files — ${patientName}`} onClose={onClose} width={560}>
      <div style={{marginBottom:16,fontSize:13,color:C.muted}}>Review patient files before starting the visit.</div>
      {files.length===0?<div style={{textAlign:"center",padding:"32px",color:C.muted}}>No files on record.</div>:(
        <div style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",marginBottom:20}}>
          {files.map((f,i)=>(
            <div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<files.length-1?`1px solid ${C.border}`:"none"}}>
              <Icon as={FileText} size={20} style={{color:C.text2}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:14,color:C.text}}>{f.name}</div>
                <div style={{fontSize:12,color:C.muted}}>{f.type} · {f.date} · {f.size}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
        <XB onClick={onClose}>Close</XB>
        <PB onClick={onContinue}>Continue to Visit</PB>
      </div>
    </Modal>
  );
}

// ─── FollowUpModal ─────────────────────────────────────────────────────────────
export function FollowUpModal({patient,doctor,onClose,onBook}){
  const addDays=(n)=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().split("T")[0];};
  return(
    <div style={{position:"fixed",inset:0,background:C.overlay,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1500,padding:20}}>
      <div style={{background:C.surface,borderRadius:12,width:"100%",maxWidth:400,boxShadow:"var(--shadow-lg)",border:`1px solid ${C.border}`}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontWeight:600,fontSize:16,color:C.text}}>Schedule a follow-up?</div>
          <div style={{fontSize:13,color:C.muted,marginTop:4}}>For {patient} with {doctor}</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>When should this patient return?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["In 2 weeks",14],["In 1 month",30],["In 3 months",90]].map(([lbl,days])=>(
              <button key={lbl} onClick={()=>onBook(addDays(days))} className="card-link" style={{padding:"12px 16px",borderRadius:6,border:`1px solid ${C.border2}`,background:C.surface,color:C.text,fontSize:14,fontWeight:500,fontFamily:"inherit",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background=C.blueBg} onMouseLeave={e=>e.currentTarget.style.background="var(--c-raised)"}>
                <span>{lbl}</span><span style={{fontSize:13,color:C.muted}}>{fmt(addDays(days))}</span>
              </button>
            ))}
            <button onClick={onClose} className="text-link" style={{marginTop:8,alignSelf:"center",color:C.text2}}>Skip for now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EndOfDayModal ─────────────────────────────────────────────────────────────
export function EndOfDayModal({onClose}){
  const[checks,setChecks]=useState({notes:false,recalls:false,schedule:false});
  const allChecked=Object.values(checks).every(Boolean);
  const toggle=(k)=>setChecks(p=>({...p,[k]:!p[k]}));
  const items=[
    {key:"notes",    label:"All visit notes signed and co-signed"},
    {key:"recalls",  label:"Recall follow-ups reviewed and assigned"},
    {key:"schedule", label:"Tomorrow's schedule confirmed"},
  ];
  return(
    <div style={{position:"fixed",inset:0,background:C.overlay,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1500,padding:20}}>
      <div style={{background:C.surface,borderRadius:12,width:"100%",maxWidth:440,boxShadow:"var(--shadow-lg)",border:`1px solid ${C.border}`}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
          <Moon size={20} strokeWidth={1.5} aria-hidden="true" style={{color:C.text2,marginBottom:8}}/>
          <div style={{fontWeight:600,fontSize:16,color:C.text}}>End-of-day checklist</div>
          <div style={{fontSize:13,color:C.muted,marginTop:4}}>All appointments are complete. Please confirm the following before closing out.</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          {items.map(item=>(
            <label key={item.key} style={{display:"flex",alignItems:"center",gap:16,padding:"12px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
              <input type="checkbox" checked={checks[item.key]} onChange={()=>toggle(item.key)} style={{width:16,height:16,cursor:"pointer",flexShrink:0,accentColor:"var(--c-navymid)"}}/>
              <span style={{fontSize:14,color:checks[item.key]?C.muted:C.text,textDecoration:checks[item.key]?"line-through":"none",transition:"color 160ms var(--ease)"}}>{item.label}</span>
            </label>
          ))}
          <div style={{marginTop:20,display:"flex",justifyContent:"flex-end",gap:10}}>
            <XB onClick={onClose}>Close</XB>
            <PB onClick={onClose} disabled={!allChecked}><Icon as={Check}/>Close the day</PB>
          </div>
        </div>
      </div>
    </div>
  );
}

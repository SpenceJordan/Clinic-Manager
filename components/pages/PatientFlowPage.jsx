import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Check, BellRing as Bell, X } from "lucide-react";
import { INIT_FILES } from "../lib/data";
import { FilesPopupModal } from "../modals";
import { Badge, C, Dot, FLOW_STAGES, Icon, PageHeader, TB, TimeInStage } from "../ui";

// ─── PATIENT FLOW BOARD ───────────────────────────────────────────────────────
export function PatientFlowPage({user,appts,setAppts,doctorStatus,setDoctorStatus,patients,showToast,recalls,setRecalls,noShowHandler,completeHandler,setPendingFollowUp,pendingFollowUp}){
  const TODAY="2026-02-25";
  const todayAppts=appts.filter(a=>(a.date||TODAY)===TODAY);
  const COLS=FLOW_STAGES;
  const noShows=appts.filter(a=>(a.date||TODAY)===TODAY&&a.status==="no-show");
  const ORDER=["scheduled","checked-in","with-nurse","in-progress","completed"];
  const BTN_LABEL={"scheduled":"Check in","checked-in":"Send to nurse","with-nurse":"Start visit","in-progress":"Complete visit"};
  const [filesAppt,setFilesAppt]=useState(null);
  const prevInProgressRef=useRef(new Set(todayAppts.filter(a=>a.status==="in-progress").map(a=>a.id)));
  const[doctorAlerts,setDoctorAlerts]=useState([]);
  useEffect(()=>{
    const currIds=new Set(todayAppts.filter(a=>a.status==="in-progress").map(a=>a.id));
    const newAlerts=[];
    for(const id of currIds){if(!prevInProgressRef.current.has(id)){const a=todayAppts.find(x=>x.id===id);if(a)newAlerts.push(a);}}
    if(newAlerts.length>0)setDoctorAlerts(prev=>[...prev,...newAlerts]);
    prevInProgressRef.current=currIds;
  },[todayAppts]);
  const dismissAlert=(id)=>setDoctorAlerts(prev=>prev.filter(a=>a.id!==id));
  const nowStageTs=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");};
  const advance=(id)=>{
    const a=appts.find(x=>x.id===id);if(!a)return;
    const i=ORDER.indexOf(a.status);
    if(i<0||i>=ORDER.length-1)return;
    const nextStatus=ORDER[i+1];
    // Show files popup when moving to "with-nurse" or "in-progress"
    if((nextStatus==="with-nurse"||nextStatus==="in-progress")&&INIT_FILES[findPatientId(a.patient)]){
      setFilesAppt({id,nextStatus,patient:a.patient,patientId:findPatientId(a.patient)});return;
    }
    if(nextStatus==="completed"){completeHandler(id);}
    else{setAppts(p=>p.map(x=>x.id===id?{...x,status:nextStatus,stageEnteredAt:nowStageTs()}:x));}
  };
  const findPatientId=(name)=>{
    const p=patients.find(pt=>`${pt.first_name} ${pt.last_name}`===name);return p?p.id:null;
  };
  const TYPE_C={routine:C.blue,"follow-up":C.teal,urgent:C.red,procedure:C.amber,"new-patient":C.green};
  const DOCTORS=Object.keys(doctorStatus||{});
  return(
    <div style={{padding:"24px 32px",flex:1,minHeight:0,boxSizing:"border-box",display:"flex",flexDirection:"column"}}>
      {doctorAlerts.length>0&&(
        <div style={{position:"fixed",top:72,right:20,zIndex:800,display:"flex",flexDirection:"column",gap:8}}>
          {doctorAlerts.map(a=>(
            <div key={a.id} role="status" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:16,boxShadow:"var(--shadow-lg)",minWidth:260,maxWidth:300,animation:"rise 220ms var(--ease)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8,color:C.text}}>
                  <Icon as={Bell} style={{color:C.amber}}/>
                  <div style={{fontWeight:500,fontSize:13}}>Ready for the doctor</div>
                </div>
                <button onClick={()=>dismissAlert(a.id)} aria-label="Dismiss" className="icon-btn" style={{border:"none",color:C.muted,cursor:"pointer",width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon as={X}/></button>
              </div>
              <div style={{fontWeight:500,fontSize:14,color:C.text}}>{a.patient}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4,display:"flex",gap:8,alignItems:"center"}}><span style={{fontFamily:C.mono}}>{a.time}</span><span>{a.doctor}</span><TB type={a.type}/></div>
            </div>
          ))}
        </div>
      )}
      {filesAppt&&<FilesPopupModal files={INIT_FILES[filesAppt.patientId]||[]} patientName={filesAppt.patient} onClose={()=>setFilesAppt(null)} onContinue={()=>{
        const a=appts.find(x=>x.id===filesAppt.id);
        if(filesAppt.nextStatus==="completed"){completeHandler(filesAppt.id);}
        else{setAppts(p=>p.map(x=>x.id===filesAppt.id?{...x,status:filesAppt.nextStatus,stageEnteredAt:nowStageTs()}:x));}
        setFilesAppt(null);
      }}/>}
      <PageHeader title="Patient flow" meta={`Wednesday, February 25 · ${todayAppts.length} patients today`}
        status={noShows.length>0?<Badge color="red">{noShows.length} no-show{noShows.length>1?"s":""}</Badge>:null}
        actions={DOCTORS.map(doc=>(
          <span key={doc} style={{height:32,padding:"0 12px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,display:"inline-flex",alignItems:"center",gap:8,fontSize:13,color:C.text}}>
            <Dot color={doctorStatus[doc]?C.green:C.amber}/>{doc.split(" ").pop()} · {doctorStatus[doc]?"ready":"busy"}
          </span>
        ))}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:12,flex:1,overflow:"hidden"}}>
        {COLS.map(col=>{
          const cards=todayAppts.filter(a=>a.status===col.id);
          return(
            <section key={col.id} aria-label={col.label} style={{background:`color-mix(in srgb, var(--c-surface) 45%, var(--c-bg))`,border:`1px solid ${C.border}`,borderRadius:8,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"12px 12px 8px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <Dot color={col.color}/>
                <div style={{fontWeight:600,fontSize:14,color:C.text}}>{col.label}</div>
                <div style={{marginLeft:"auto",fontFamily:C.mono,fontSize:13,color:C.text2,fontVariantNumeric:"tabular-nums"}}>{cards.length}</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"4px 8px 8px"}}>
                {cards.length===0&&(
                  <div style={{margin:"4px 0",border:`1px dashed ${C.border}`,borderRadius:6,padding:"24px 12px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8,color:C.muted}}>
                    <col.Icon size={20} strokeWidth={1.5} aria-hidden="true"/>
                    <div style={{fontSize:12}}>{col.empty}</div>
                  </div>
                )}
                {cards.map(a=>(
                  <div key={a.id} style={{background:C.surface,borderRadius:6,padding:12,marginBottom:8,border:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
                      <div style={{fontWeight:500,fontSize:14,color:C.text,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.patient}</div>
                      <div style={{fontFamily:C.mono,fontSize:12,color:C.text2,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{a.time}</div>
                    </div>
                    {a.stageEnteredAt&&<TimeInStage stageEnteredAt={a.stageEnteredAt}/>}
                    <div style={{display:"flex",gap:8,alignItems:"center",margin:"8px 0 12px",flexWrap:"wrap"}}>
                      <TB type={a.type}/>
                      <span style={{fontSize:12,color:C.muted}}>{a.doctor}</span>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {col.id!=="completed"&&<button onClick={()=>advance(a.id)} className="btn btn-primary btn-sm" style={{flex:1}}>{BTN_LABEL[col.id]}{col.id==="in-progress"?<Check size={14} strokeWidth={2} aria-hidden="true"/>:<ArrowRight size={14} strokeWidth={2} aria-hidden="true"/>}</button>}
                      {col.id==="scheduled"&&user.role!=="doctor"&&<button onClick={()=>noShowHandler(a.id)} className="btn btn-secondary btn-sm">No-show</button>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

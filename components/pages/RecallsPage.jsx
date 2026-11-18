import React, { useState } from "react";
import { Plus, ChevronDown, Check, CircleCheck, CalendarPlus } from "lucide-react";
import { INIT_CONTACT_LOGS } from "../lib/data";
import { fmt, today } from "../lib/utils";
import { NewApptModal, RecallModal } from "../modals";
import { Badge, C, Card, IS, Icon, PB, PageHeader, SS, Segmented, XB } from "../ui";

export function RecallsPage({recalls,setRecalls,patients,appts,setAppts,blockTimes}){
  const[filter,setFilter]=useState("all");const[showNew,setShowNew]=useState(false);
  const[sortDoc,setSortDoc]=useState("all");
  const[checked,setChecked]=useState(new Set());
  const[expandedLog,setExpandedLog]=useState(null);
  const[contactLogs,setContactLogs]=useState(INIT_CONTACT_LOGS);
  const[addingLog,setAddingLog]=useState(null);
  const[logForm,setLogForm]=useState({method:"Phone",outcome:""});
  const[pendingRecallAppt,setPendingRecallAppt]=useState(null);
  const[showBookAppt,setShowBookAppt]=useState(false);
  const done=(ids)=>setRecalls(p=>p.filter(r=>!ids.includes(r.id)));
  const completeSingle=(r)=>{done([r.id]);setPendingRecallAppt(r);};
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
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      {showNew&&<RecallModal onClose={()=>setShowNew(false)} onSave={r=>{setRecalls(p=>[...p,r]);setShowNew(false);}} patients={patients}/>}
      {showBookAppt&&pendingRecallAppt&&(
        <NewApptModal
          onClose={()=>{setShowBookAppt(false);setPendingRecallAppt(null);}}
          onSave={(a)=>{if(setAppts)setAppts(p=>[...p,a]);setShowBookAppt(false);setPendingRecallAppt(null);}}
          patients={patients}
          appts={appts||[]}
          blockTimes={blockTimes||[]}
          prefill={{
            pid: patients.find(p=>`${p.first_name} ${p.last_name}`===pendingRecallAppt.patient)?.id||"",
            doc: pendingRecallAppt.doctor||"Dr. Patel",
            type: "follow-up",
            notes: pendingRecallAppt.reason||"",
          }}
        />
      )}
      {pendingRecallAppt&&!showBookAppt&&(
        <div style={{position:"fixed",inset:0,background:C.overlay,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
          <div role="dialog" aria-modal="true" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,width:"100%",maxWidth:440,boxShadow:"var(--shadow-lg)",overflow:"hidden",animation:"rise 220ms var(--ease)"}}>
            <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <CircleCheck size={20} strokeWidth={2} aria-hidden="true" style={{color:C.green}}/>
                <div style={{fontWeight:600,fontSize:16,color:C.text}}>Recall complete</div>
              </div>
              <div style={{fontSize:13,color:C.muted}}>Would you like to book a follow-up appointment?</div>
            </div>
            <div style={{padding:"20px 24px"}}>
              <div style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 16px",marginBottom:16}}>
                <div style={{display:"flex",gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Patient</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.text}}>{pendingRecallAppt.patient}</div>
                  </div>
                  {pendingRecallAppt.doctor&&(
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Doctor</div>
                      <div style={{fontSize:13,fontWeight:600,color:C.text}}>{pendingRecallAppt.doctor}</div>
                    </div>
                  )}
                </div>
                <div style={{marginTop:10}}>
                  <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Recall reason</div>
                  <div style={{fontSize:13,color:C.text}}>{pendingRecallAppt.reason}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <XB onClick={()=>setPendingRecallAppt(null)}>Skip</XB>
                <PB onClick={()=>setShowBookAppt(true)}><Icon as={CalendarPlus}/>Book appointment</PB>
              </div>
            </div>
          </div>
        </div>
      )}
      <PageHeader title="Recalls and follow-up" meta={`${recalls.length} open recall${recalls.length!==1?"s":""}`}
        status={recalls.filter(r=>r.urgency==="high").length>0?<Badge color="red">{recalls.filter(r=>r.urgency==="high").length} overdue</Badge>:null}
        actions={<>
          {checked.size>0&&<XB onClick={()=>{done([...checked]);setChecked(new Set());}}><Icon as={Check}/>Complete {checked.size} selected</XB>}
          <PB onClick={()=>setShowNew(true)}><Icon as={Plus}/>Add recall</PB>
        </>}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:12,flexWrap:"wrap"}}>
        <Segmented size="sm" value={filter} onChange={setFilter} options={[["all","All"],["high","Overdue"],["medium","This week"],["low","Upcoming"]].map(([id,l])=>[id,l,null,id==="all"?recalls.length:recalls.filter(r=>r.urgency===id).length])}/>
        <select value={sortDoc} onChange={e=>setSortDoc(e.target.value)} aria-label="Doctor" style={{...SS,width:"auto",fontSize:13}}>
          {DOCTORS.map(d=><option key={d} value={d}>{d==="all"?"Any doctor":d}</option>)}
        </select>
      </div>
      <Card>
        {filt.length===0?(<div style={{padding:"48px",textAlign:"center"}}><CircleCheck size={28} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,marginBottom:12}}/><div style={{fontWeight:600,color:C.text}}>All clear</div><div style={{color:C.muted,fontSize:13,marginTop:4}}>No recalls in this category.</div></div>):filt.map((r,i)=>{
          const logs=contactLogs[r.id]||[];
          const isExpanded=expandedLog===r.id;
          return(
            <div key={r.id} style={{borderBottom:i<filt.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:16}}>
                <input type="checkbox" checked={checked.has(r.id)} onChange={()=>toggleCheck(r.id)} aria-label={`Select ${r.patient}`} style={{width:16,height:16,cursor:"pointer",flexShrink:0,accentColor:"var(--c-navymid)"}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:C.text}}>{r.patient}</div>
                  <div style={{fontSize:13,color:C.text2,marginTop:2}}>{r.reason}</div>
                  <div style={{display:"flex",gap:12,marginTop:4,alignItems:"center"}}>
                    <span style={{fontSize:12,color:r.urgency==="high"?C.red:C.muted,fontWeight:r.urgency==="high"?500:400}}>{r.urgency==="high"?"Overdue since ":"Due "}{fmt(r.due)}</span>
                    {r.doctor&&<span style={{fontSize:12,color:C.muted}}>· {r.doctor}</span>}
                    <button onClick={()=>setExpandedLog(isExpanded?null:r.id)} aria-expanded={isExpanded} className="text-link" style={{fontSize:12,display:"inline-flex",alignItems:"center",gap:4}}>{logs.length>0?`${logs.length} contact attempt${logs.length>1?"s":""}`:"Log contact"}<ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" style={{transform:isExpanded?"rotate(180deg)":"none"}}/></button>
                  </div>
                </div>
                <Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"neutral"}>{r.urgency==="high"?"Overdue":r.urgency==="medium"?"This week":"Upcoming"}</Badge>
                <button onClick={()=>completeSingle(r)} className="btn btn-secondary btn-sm"><Icon as={Check} size={14}/>Complete</button>
              </div>
              {isExpanded&&(
                <div style={{background:C.raised,borderTop:`1px solid ${C.border}`,padding:"16px 20px 16px 52px"}}>
                  <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:8}}>Contact attempts</div>
                  {logs.length===0&&<div style={{fontSize:13,color:C.muted,marginBottom:10}}>No contact attempts logged yet.</div>}
                  {logs.map(l=>(
                    <div key={l.id} style={{display:"flex",gap:12,marginBottom:8,fontSize:13}}>
                      <div style={{color:C.muted,width:96,flexShrink:0}}>{fmt(l.date)}</div>
                      <div style={{width:72,flexShrink:0}}><Badge color="neutral">{l.method}</Badge></div>
                      <div style={{color:C.text}}>{l.outcome}</div>
                    </div>
                  ))}
                  {addingLog===r.id?(
                    <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
                      <select value={logForm.method} onChange={e=>setLogForm(f=>({...f,method:e.target.value}))} style={{...SS,width:90,padding:"6px 8px",fontSize:12}}>
                        {["Phone","Email","Text","In person"].map(m=><option key={m}>{m}</option>)}
                      </select>
                      <input value={logForm.outcome} onChange={e=>setLogForm(f=>({...f,outcome:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addLog(r.id)} placeholder="Outcome…" style={{...IS,flex:1,fontSize:12,marginBottom:0}} autoFocus/>
                      <PB onClick={()=>addLog(r.id)} disabled={!logForm.outcome.trim()}>Save</PB>
                      <XB onClick={()=>setAddingLog(null)}>Cancel</XB>
                    </div>
                  ):<button onClick={()=>setAddingLog(r.id)} className="btn btn-secondary btn-sm" style={{marginTop:4}}><Icon as={Plus} size={14}/>Log attempt</button>}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

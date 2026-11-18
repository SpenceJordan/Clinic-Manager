import React, { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { permsFor } from "../lib/accounts";
import { fmt, today } from "../lib/utils";
import { Badge, C, Card, CardHead, IS, Icon, LS, LoadingButton, PB, PageHeader, XB } from "../ui";

// ─── RefillQueuePage ───────────────────────────────────────────────────────────
export function RefillQueuePage({user,patients,rx,setRx,refillRequests,setRefillRequests}){
  const p=permsFor(user);
  const[newReq,setNewReq]=useState({patientId:"",medication:""});
  const[patSearch,setPatSearch]=useState("");
  const[patOpen,setPatOpen]=useState(false);
  const[reviewId,setReviewId]=useState(null);
  const[reviewNote,setReviewNote]=useState("");
  const[loading,setLoading]=useState(true);
  const[submittingRefill,setSubmittingRefill]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),600);return()=>clearTimeout(t);},[]);
  const pending=(refillRequests||[]).filter(r=>r.status==="pending");
  const others=(refillRequests||[]).filter(r=>r.status!=="pending");
  const submit=()=>{
    if(!newReq.patientId||!newReq.medication.trim())return;
    setSubmittingRefill(true);
    setTimeout(()=>{
      const pt=patients.find(x=>x.id===parseInt(newReq.patientId));
      if(!pt){setSubmittingRefill(false);return;}
      setRefillRequests(prev=>[...prev,{id:Date.now(),patientId:pt.id,patient:`${pt.first_name} ${pt.last_name}`,medication:newReq.medication.trim(),requestedBy:user.role,requestedByName:user.name,date:today(),status:"pending",approvedBy:null,note:""}]);
      setNewReq({patientId:"",medication:""});setPatSearch("");
      setSubmittingRefill(false);
    },400);
  };
  const approve=(id)=>{
    setRefillRequests(prev=>prev.map(r=>r.id===id?{...r,status:"approved",approvedBy:user.name,note:reviewNote}:r));
    setReviewId(null);setReviewNote("");
  };
  const deny=(id)=>{
    setRefillRequests(prev=>prev.map(r=>r.id===id?{...r,status:"denied",approvedBy:user.name,note:reviewNote}:r));
    setReviewId(null);setReviewNote("");
  };
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      <PageHeader title="Refill queue" meta={p.refillApprove?"Requests waiting for your review":"Requests sent to the doctors"}
        status={pending.length>0?<Badge color="amber">{pending.length} pending</Badge>:<Badge color="green">Queue clear</Badge>}/>
      {loading&&<div>{[...Array(4)].map((_,i)=><div key={i} style={{background:C.skeleton,borderRadius:8,height:44,marginBottom:8,animation:"pulse 1.6s ease-in-out infinite"}}/>)}</div>}
      {!loading&&<>
        {!p.refillApprove&&(
          <Card style={{marginBottom:16,padding:"20px"}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>New refill request</div>
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <div style={{flex:1,position:"relative"}}><label style={LS}>Patient</label>
                <input
                  value={patSearch}
                  onChange={e=>{setPatSearch(e.target.value);setNewReq(f=>({...f,patientId:""}));setPatOpen(true);}}
                  onFocus={()=>setPatOpen(true)}
                  onBlur={()=>setTimeout(()=>setPatOpen(false),150)}
                  placeholder="Type patient name…"
                  autoComplete="off"
                  style={{...IS,paddingRight:28}}
                />
                {patOpen&&(()=>{
                  const q=patSearch.toLowerCase();
                  const hits=patients.filter(pt=>`${pt.first_name} ${pt.last_name}`.toLowerCase().includes(q));
                  return hits.length>0?(
                    <div role="listbox" style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)",maxHeight:200,overflowY:"auto",marginTop:4,padding:4}}>
                      {hits.map(pt=>(
                        <div key={pt.id}
                          onMouseDown={()=>{setNewReq(f=>({...f,patientId:String(pt.id)}));setPatSearch(`${pt.first_name} ${pt.last_name}`);setPatOpen(false);}}
                          role="option" className="row-link"
                          style={{padding:"8px 12px",fontSize:13,color:C.text,borderRadius:4}}
                        >{pt.first_name} {pt.last_name}</div>
                      ))}
                    </div>
                  ):null;
                })()}
              </div>
              <div style={{flex:1}}><label style={LS}>Medication</label>
                <input value={newReq.medication} onChange={e=>setNewReq(f=>({...f,medication:e.target.value}))} placeholder="e.g. Lisinopril 10mg" style={IS}/>
              </div>
              <LoadingButton onClick={submit} disabled={!newReq.patientId||!newReq.medication.trim()} loading={submittingRefill}>Submit request</LoadingButton>
            </div>
          </Card>
        )}
        <Card style={{marginBottom:12}}>
          <CardHead title="Pending" meta={`${pending.length} request${pending.length!==1?"s":""}`}/>
          {pending.length===0&&<div style={{padding:"0 20px 20px",color:C.muted,fontSize:13}}>No pending refill requests</div>}
          {pending.map((r,i)=>(
            <div key={r.id} style={{borderTop:`1px solid ${C.border}`}}>
              <div style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:C.text}}>{r.patient}</div>
                  <div style={{fontSize:13,color:C.text2,marginTop:2}}>{r.medication}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>Requested by {r.requestedByName} · {fmt(r.date)}</div>
                </div>
                <Badge color="amber">Pending</Badge>
                {p.refillApprove&&<button onClick={()=>setReviewId(reviewId===r.id?null:r.id)} aria-expanded={reviewId===r.id} className="btn btn-secondary btn-sm">Review</button>}
              </div>
              {reviewId===r.id&&(
                <div style={{background:C.raised,borderTop:`1px solid ${C.border}`,padding:"16px 20px"}}>
                  <div style={{fontWeight:500,fontSize:13,color:C.text,marginBottom:8}}>Current medications</div>
                  {(rx[r.patientId]||[]).map(med=><div key={med.id} style={{fontSize:13,color:C.text,marginBottom:4}}>{med.med} {med.dose} <span style={{color:C.muted}}>· {med.sig}</span></div>)}
                  {!(rx[r.patientId]||[]).length&&<div style={{fontSize:13,color:C.muted,marginBottom:10}}>No active medications on file.</div>}
                  <div style={{marginTop:12,marginBottom:10}}><label style={LS}>Note to staff (optional)</label><input value={reviewNote} onChange={e=>setReviewNote(e.target.value)} placeholder="Add note…" style={IS}/></div>
                  <div style={{display:"flex",gap:8}}>
                    <PB onClick={()=>approve(r.id)}><Icon as={Check}/>Approve</PB>
                    <XB onClick={()=>deny(r.id)}><Icon as={X}/>Deny</XB>
                    <XB onClick={()=>{setReviewId(null);setReviewNote("");}}>Cancel</XB>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Card>
        {others.length>0&&(
          <Card>
            <CardHead title="Reviewed" meta={`${others.length} request${others.length!==1?"s":""}`}/>
            {others.map((r,i)=>(
              <div key={r.id} style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:16,borderTop:`1px solid ${C.border}`}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:C.text}}>{r.patient} <span style={{fontWeight:400,color:C.text2}}>· {r.medication}</span></div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>Requested by {r.requestedByName} · {fmt(r.date)}{r.approvedBy?` · reviewed by ${r.approvedBy}`:""}</div>
                  {r.note&&<div style={{fontSize:13,color:C.text2,marginTop:4}}>“{r.note}”</div>}
                </div>
                <Badge color={r.status==="approved"?"green":"red"}>{r.status}</Badge>
              </div>
            ))}
          </Card>
        )}
      </>}
    </div>
  );
}

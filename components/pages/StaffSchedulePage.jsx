import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStaff } from "../lib/accounts";
import { DEMO_TODAY } from "../lib/data";
import { fmt, initials } from "../lib/utils";
import { C, Card, CardHead, Dot, FF, FR, IS, Icon, PB, PageHeader, SS, XB } from "../ui";

// ─── StaffSchedulePage ─────────────────────────────────────────────────────────
export function StaffSchedulePage({staffSchedule,setStaffSchedule}){
  const STAFF_LIST=useStaff().filter(s=>s.status==="active");
  const[weekOffset,setWeekOffset]=useState(0);
  const[editCell,setEditCell]=useState(null);
  const[shiftForm,setShiftForm]=useState({startTime:"08:00",endTime:"17:00",type:"regular"});
  const baseDate="2026-02-24";
  const getWeek=(offset)=>{
    const d=new Date(baseDate+"T12:00:00");
    d.setDate(d.getDate()+offset*7);
    const day=d.getDay();
    const mon=new Date(d);mon.setDate(d.getDate()-(day===0?6:day-1));
    return Array.from({length:7},(_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return x.toISOString().split("T")[0];});
  };
  const weekDates=getWeek(weekOffset);
  const dayLabels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const typeFg={regular:C.green,"half-day":C.amber,"on-call":C.blue,off:C.red};
  const getShift=(staffId,date)=>staffSchedule.find(s=>s.staffId===staffId&&s.date===date);
  const saveShift=()=>{
    if(!editCell)return;
    const{staffId,staffName,role,date}=editCell;
    const existing=staffSchedule.find(s=>s.staffId===staffId&&s.date===date);
    if(existing){
      setStaffSchedule(prev=>prev.map(s=>s.staffId===staffId&&s.date===date?{...s,...shiftForm}:s));
    } else {
      setStaffSchedule(prev=>[...prev,{id:Date.now(),staffId,staffName,role,date,...shiftForm}]);
    }
    setEditCell(null);
  };
  // Coverage summary per day
  const coverage=(date)=>{
    const shifts=staffSchedule.filter(s=>s.date===date&&s.type!=="off");
    const byRole={};
    shifts.forEach(s=>{byRole[s.role]=(byRole[s.role]||0)+1;});
    return byRole;
  };
  const weekLabel=`${fmt(weekDates[0])} – ${fmt(weekDates[6])}`;
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      <PageHeader title="Staff schedule" meta={`Week of ${weekLabel}`}
        actions={<div style={{display:"flex",gap:8}}>
          <button onClick={()=>setWeekOffset(v=>v-1)} aria-label="Previous week" className="btn btn-secondary" style={{padding:"0 10px"}}><Icon as={ChevronLeft}/></button>
          <button onClick={()=>setWeekOffset(0)} className="btn btn-secondary">This week</button>
          <button onClick={()=>setWeekOffset(v=>v+1)} aria-label="Next week" className="btn btn-secondary" style={{padding:"0 10px"}}><Icon as={ChevronRight}/></button>
        </div>}/>
      {editCell&&(
        <Card style={{marginBottom:16,padding:"16px 20px"}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>Edit shift · {editCell.staffName}, {fmt(editCell.date)}</div>
          <FR>
            <FF label="Start time"><input type="time" value={shiftForm.startTime} onChange={e=>setShiftForm(f=>({...f,startTime:e.target.value}))} style={IS}/></FF>
            <FF label="End time"><input type="time" value={shiftForm.endTime} onChange={e=>setShiftForm(f=>({...f,endTime:e.target.value}))} style={IS}/></FF>
            <FF label="Type"><select value={shiftForm.type} onChange={e=>setShiftForm(f=>({...f,type:e.target.value}))} style={SS}><option value="regular">Regular</option><option value="half-day">Half day</option><option value="on-call">On call</option><option value="off">Off</option></select></FF>
          </FR>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setEditCell(null)}>Cancel</XB><PB onClick={saveShift}>Save shift</PB></div>
        </Card>
      )}
      <Card style={{overflow:"auto",marginBottom:16}}>
        <table className="tbl" style={{width:"100%",borderCollapse:"collapse",minWidth:900,tableLayout:"fixed"}}>
          <thead>
            <tr>
              <th style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`,width:220}}>Staff</th>
              {weekDates.map((d,i)=>(
                <th key={d} style={{padding:"12px 8px 8px",textAlign:"center",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`,background:d===DEMO_TODAY?C.raised:"transparent"}}>
                  <div>{dayLabels[i]}</div>
                  <div style={{fontSize:13,color:C.text,fontWeight:500,marginTop:2}}>{new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAFF_LIST.map((staff,si)=>(
              <tr key={staff.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"10px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:C.raised,border:`1px solid ${C.border}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,flexShrink:0}}>
                      {initials(staff.name)}
                    </div>
                    <div>
                      <div style={{fontSize:14,fontWeight:500,color:C.text}}>{staff.name}</div>
                      <div style={{fontSize:12,color:C.muted,textTransform:"capitalize"}}>{staff.role}</div>
                    </div>
                  </div>
                </td>
                {weekDates.map(date=>{
                  const shift=getShift(staff.id,date);
                  return(
                    <td key={date} style={{padding:"6px",textAlign:"center",verticalAlign:"middle"}}>
                      <div
                        onClick={()=>{
                          setEditCell({staffId:staff.id,staffName:staff.name,role:staff.role,date});
                          setShiftForm(shift?{startTime:shift.startTime,endTime:shift.endTime,type:shift.type}:{startTime:"08:00",endTime:"17:00",type:"regular"});
                        }}
                        className="card-link"
                        style={{cursor:"pointer",borderRadius:6,padding:"6px 4px",background:shift?C.surface:"transparent",border:shift?`1px solid ${C.border}`:`1px dashed ${C.border}`,minHeight:50,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}
                      >
                        {shift?(
                          <>
                            <div style={{fontSize:12,fontFamily:C.mono,color:shift.type==="off"?C.muted:C.text,fontVariantNumeric:"tabular-nums"}}>{shift.type==="off"?"Off":`${shift.startTime}–${shift.endTime}`}</div>
                            {shift.type!=="regular"&&shift.type!=="off"&&<div style={{fontSize:11,color:C.text2,display:"flex",alignItems:"center",gap:4}}><Dot color={typeFg[shift.type]} size={6}/>{shift.type==="half-day"?"Half day":"On call"}</div>}
                          </>
                        ):(
                          <div style={{fontSize:12,color:C.muted}}>Add</div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card style={{paddingBottom:16}}>
        <CardHead title="Coverage" meta="Staff on shift by role"/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,minmax(0,1fr))",margin:"0 20px"}}>
          {weekDates.map((date,i)=>{
            const cov=coverage(date);
            return(
              <div key={date} style={{padding:"4px 12px",paddingLeft:i?12:0,borderLeft:i?`1px solid ${C.border}`:"none"}}>
                <div style={{fontSize:12,color:C.muted,marginBottom:8}}>{dayLabels[i]} {new Date(date+"T12:00:00").getDate()}</div>
                {Object.entries(cov).length===0&&<div style={{fontSize:13,color:C.muted}}>No coverage</div>}
                {i<5&&Object.entries(cov).length>0&&!cov.doctor&&<div style={{fontSize:12,color:C.red,display:"flex",alignItems:"center",gap:6,marginBottom:4}}><Dot color={C.red} size={6}/>No doctor</div>}
                {Object.entries(cov).map(([role,cnt])=>(
                  <div key={role} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:13,color:C.text2}}>{role==="receptionist"?"Front desk":role==="admin"?"Admin":role.charAt(0).toUpperCase()+role.slice(1)+"s"}</span>
                    <span style={{fontSize:13,fontWeight:500,color:C.text,fontVariantNumeric:"tabular-nums"}}>{cnt}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

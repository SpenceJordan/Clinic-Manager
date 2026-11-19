import React, { useState, useEffect } from "react";
import { ChevronLeft, CalendarDays, ChevronRight, Printer, List, CalendarRange, Hourglass, CalendarPlus } from "lucide-react";
import { html } from "../lib/print";
import { fmt, today } from "../lib/utils";
import { NewApptModal } from "../modals";
import { Badge, C, Card, Dot, FF, FR, IS, Icon, Modal, PB, PageHeader, SB, SS, STATUS_TONE, Segmented, TB, XB, tint } from "../ui";

// ─── Calendar helpers ─────────────────────────────────────────────────────────
export function getWeekDates(dateStr){
  const d=new Date(dateStr+"T12:00:00");
  const day=d.getDay();
  const mon=new Date(d);mon.setDate(d.getDate()-(day===0?6:day-1));
  return Array.from({length:5},(_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return x.toISOString().split("T")[0];});
}

export function CalendarDayView({appts,selectedDate,onSlotClick,canAdd}){
  const HOUR_H=64,START=8,END=18;
  const hours=Array.from({length:END-START},(_,i)=>START+i);
  const top=(t)=>{const[h,m]=t.split(":").map(Number);return((h-START)+m/60)*HOUR_H;};
  const ht=(d)=>Math.max((d/60)*HOUR_H-2,22);
  const dayAppts=appts.filter(a=>(a.date||"2026-02-25")===selectedDate);
  return(
    <Card style={{overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        <div style={{width:68,flexShrink:0}}/>
        <div style={{flex:1,padding:"12px 16px",fontWeight:600,fontSize:15,color:C.text}}>
          {new Date(selectedDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
          <span style={{marginLeft:10,fontSize:12,fontWeight:400,color:C.muted}}>{dayAppts.length} appointment{dayAppts.length!==1?"s":""}</span>
        </div>
      </div>
      <div style={{display:"flex",overflowY:"auto",maxHeight:520}}>
        <div style={{width:68,flexShrink:0,borderRight:`1px solid ${C.border}`}}>
          {hours.map(h=><div key={h} style={{height:HOUR_H,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:10,paddingTop:6,fontSize:11,fontFamily:C.mono,color:C.muted}}>{String(h).padStart(2,"0")}:00</div>)}
        </div>
        <div style={{flex:1,position:"relative",minHeight:(END-START)*HOUR_H}}>
          {hours.map((h,i)=>(
            <div key={h} style={{position:"absolute",top:i*HOUR_H,left:0,right:0,height:HOUR_H,borderBottom:`1px solid ${C.border}`}}>
              <div style={{position:"absolute",top:HOUR_H/2,left:0,right:0,borderBottom:`1px dashed ${C.border}`}}/>
              {canAdd&&[0,30].map(m=>(
                <div key={m} style={{position:"absolute",top:m===0?0:HOUR_H/2,left:0,right:0,height:HOUR_H/2,cursor:"pointer",zIndex:0}}
                  onClick={()=>onSlotClick(selectedDate,`${String(h).padStart(2,"0")}:${m===0?"00":"30"}`)}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}/>
              ))}
            </div>
          ))}
          {dayAppts.map(a=>{
            const col=STATUS_TONE[a.status]||C.muted;
            return(
              <div key={a.id} style={{position:"absolute",top:top(a.time)+1,left:8,right:8,height:ht(a.duration),background:C.surface,border:`1px solid ${C.border2}`,borderRadius:6,padding:"4px 8px 4px 12px",overflow:"hidden",zIndex:1,boxShadow:`inset 3px 0 0 ${col}`}}>
                <div style={{fontSize:12,fontWeight:500,color:C.text,lineHeight:1.3,display:"flex",alignItems:"center",gap:6}}>{a.patient}{a.type==="urgent"&&<Badge color="red">Urgent</Badge>}</div>
                {ht(a.duration)>28&&<div style={{fontSize:11,color:C.muted}}>{a.time} · {a.type.replace(/-/g," ")} · {a.duration} min</div>}
                {ht(a.duration)>44&&<div style={{fontSize:11,color:C.muted}}>{a.doctor}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export function CalendarWeekView({appts,selectedDate,onSelectDate,onSlotClick,canAdd}){
  const HOUR_H=50,START=8,END=18;
  const hours=Array.from({length:END-START},(_,i)=>START+i);
  const DOC_C={"Dr. Patel":C.blue,"Dr. Williams":C.teal}; // doctor tells blocks apart; tint only
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
            <div key={date} onClick={()=>onSelectDate(date)} style={{flex:1,padding:"10px 6px",textAlign:"center",cursor:"pointer",borderRight:`1px solid ${C.border}`,background:isSel?C.navyBg:"transparent"}}>
              <div style={{fontSize:11,color:C.muted}}>{d.toLocaleDateString("en-US",{weekday:"short"})}</div>
              <div style={{fontSize:16,fontWeight:isSel?600:500,color:C.text}}>{d.getDate()}</div>
              {cnt>0&&<div style={{fontSize:11,color:C.muted}}>{cnt} appt{cnt>1?"s":""}</div>}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",overflowY:"auto",maxHeight:500}}>
        <div style={{width:68,flexShrink:0,borderRight:`1px solid ${C.border}`}}>
          {hours.map(h=><div key={h} style={{height:HOUR_H,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:10,paddingTop:4,fontSize:11,fontFamily:C.mono,color:C.muted}}>{String(h).padStart(2,"0")}:00</div>)}
        </div>
        {weekDates.map(date=>{
          const dayAppts=appts.filter(a=>(a.date||"2026-02-25")===date);
          const isSel=date===selectedDate;
          return(
            <div key={date} style={{flex:1,position:"relative",borderRight:`1px solid ${C.border}`,minHeight:(END-START)*HOUR_H,background:isSel?`color-mix(in srgb, var(--c-raised) 50%, transparent)`:"transparent"}}>
              {hours.map((h,i)=>(
                <div key={h} style={{position:"absolute",top:i*HOUR_H,left:0,right:0,height:HOUR_H,borderBottom:`1px solid ${C.border}`}}>
                  <div style={{position:"absolute",top:HOUR_H/2,left:0,right:0,borderBottom:`1px dashed ${C.border}`}}/>
                  {canAdd&&[0,30].map(m=>(
                    <div key={m} style={{position:"absolute",top:m===0?0:HOUR_H/2,left:0,right:0,height:HOUR_H/2,cursor:"pointer",zIndex:0}}
                      onClick={()=>{onSelectDate(date);onSlotClick(date,`${String(h).padStart(2,"0")}:${m===0?"00":"30"}`);}}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}/>
                  ))}
                </div>
              ))}
              {dayAppts.map(a=>{
                const col=DOC_C[a.doctor]||C.blue;
                return(
                  <div key={a.id} style={{position:"absolute",top:top(a.time)+1,left:2,right:2,height:ht(a.duration),background:tint(col,8),border:`1px solid ${tint(col,16)}`,borderRadius:4,padding:"2px 4px",overflow:"hidden",zIndex:1,fontSize:11}}>
                    <div style={{fontWeight:500,color:C.text,lineHeight:1.2}}>{a.patient.split(" ")[0]}</div>
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

export function MiniCalendar({ selectedDate, onSelectDate, appts }) {
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
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} aria-label="Previous month" className="icon-btn" style={{ border: "none", cursor: "pointer", color: C.text2, width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={16} strokeWidth={1.5}/></button>
        <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{MONTH_NAMES[viewMonth]} {viewYear}</div>
        <button onClick={nextMonth} aria-label="Next month" className="icon-btn" style={{ border: "none", cursor: "pointer", color: C.text2, width: 28, height: 28, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={16} strokeWidth={1.5}/></button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, color: C.muted, paddingBottom: 4 }}>{d}</div>
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
                background: isSelected ? C.navyMid : isToday ? C.navyBg : "transparent",
                color: isSelected ? C.onAccent : C.text,
                fontWeight: isSelected || isToday ? 500 : 400,
                fontVariantNumeric: "tabular-nums",
                fontSize: 12,
              }}
            >
              <span>{day}</span>
              {count > 0 && (
                <div style={{
                  width: 4, height: 4, borderRadius: "50%", marginTop: 2,
                  background: isSelected ? C.onAccent : C.muted,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ApptsPage({user,appts,setAppts,patients,settings,reminderLogs,setReminderLogs,waitlist,setWaitlist,blockTimes,recalls,setRecalls,showToast,noShowHandler,completeHandler,pendingFollowUp,setPendingFollowUp}){
  const [filter, setFilter] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-02-25");
  const [view, setView] = useState("list");
  const [prefillTime, setPrefillTime] = useState(null);
  const [expandedReminder, setExpandedReminder] = useState(null);
  const [phoneLogText, setPhoneLogText] = useState("");
  const [cancelWaitlistAppt, setCancelWaitlistAppt] = useState(null);
  const canAdd = user.role === "receptionist" || user.role === "admin";
  const canLog = user.role === "receptionist" || user.role === "admin";

  const dayAppts = appts.filter(a => (a.date || "2026-02-25") === selectedDate);
  const filtered = filter === "all" ? dayAppts : dayAppts.filter(a => a.status === filter);

  const ORDER = ["scheduled","checked-in","with-nurse","in-progress","completed"];
  const BTN_LABEL = {"scheduled":"Check in","checked-in":"To nurse","with-nurse":"Start","in-progress":"Complete"};
  const advance = (id) => {
    const a = appts.find(x=>x.id===id); if(!a) return;
    const i = ORDER.indexOf(a.status);
    if(i<0||i>=ORDER.length-1) return;
    const next = ORDER[i+1];
    if(next==="completed") { completeHandler(id); }
    else setAppts(p=>p.map(x=>x.id===id?{...x,status:next}:x));
  };

  const cancelAppt = (id) => {
    const a = appts.find(x=>x.id===id); if(!a) return;
    const wl = (waitlist||[]).filter(w=>w.doctor===a.doctor&&w.status==="waiting");
    if(wl.length>0) { setCancelWaitlistAppt({appt:a,waitlist:wl}); }
    else { setAppts(p=>p.map(x=>x.id===id?{...x,status:"no-show"}:x)); }
  };

  const getReminderDot = (id) => {
    const logs = (reminderLogs||{})[id]||[];
    if(!logs.length) return {color:C.inactive,label:"Not sent"};
    const last = logs[0];
    if(last.confirmed) return {color:C.green,label:"Confirmed"};
    return {color:C.amber,label:"Awaiting reply"};
  };

  const logPhoneCall = (apptId) => {
    if(!phoneLogText.trim()) return;
    const entry={id:Date.now(),method:"Phone",ts:new Date().toLocaleString(),outcome:phoneLogText.trim(),confirmed:false};
    setReminderLogs(p=>({...p,[apptId]:[entry,...(p[apptId]||[])]}));
    setPhoneLogText("");
    showToast&&showToast("Phone call logged");
  };

  const printDaySchedule = () => {
    const grouped = {};
    dayAppts.forEach(a=>{if(!grouped[a.doctor])grouped[a.doctor]=[];grouped[a.doctor].push(a);});
    const clinicName = (settings||{}).clinicName||"Clinic Manager";
    const rows = Object.entries(grouped).map(([doc,apts])=>html`
      <h3 style="margin:16px 0 8px;font-size:14px;">${doc}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
        <tr style="background:#f0f2f5;"><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Time</th><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Patient</th><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Type</th><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Dur.</th><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Notes</th></tr>
        ${apts.map(a=>html`<tr><td style="padding:6px 10px;border:1px solid #ddd;">${a.time}</td><td style="padding:6px 10px;border:1px solid #ddd;">${a.patient}</td><td style="padding:6px 10px;border:1px solid #ddd;">${a.type.replace(/-/g," ")}</td><td style="padding:6px 10px;border:1px solid #ddd;">${a.duration}m</td><td style="padding:6px 10px;border:1px solid #ddd;min-width:120px;"></td></tr>`)}
      </table>`);
    const w=window.open("","_blank");
    w.document.write(String(html`<!DOCTYPE html><html><head><title>Daily Schedule</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#000;}h1{font-size:18px;margin-bottom:4px;}@media print{button{display:none;}}</style></head><body><h1>${clinicName} — Daily Schedule</h1><p style="margin:0 0 16px;font-size:13px;">${new Date(selectedDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>${rows}<button onclick="window.print()" style="padding:8px 16px;margin-top:8px;">Print</button></body></html>`));
    w.document.close();
    setTimeout(()=>w.print(),400);
  };

  const displayDate = new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {weekday:"long",year:"numeric",month:"long",day:"numeric"});
  const openSlotModal = (date, time) => { setSelectedDate(date); setPrefillTime(time); setShowNew(true); };

  return (
    <div style={{ padding: "24px 32px 48px" }}>
      {showNew && (
        <NewApptModal
          onClose={() => { setShowNew(false); setPrefillTime(null); }}
          onSave={a => { setAppts(p => [...p, a]); setShowNew(false); setPrefillTime(null); }}
          patients={patients} defaultDate={selectedDate} appts={appts} prefillTime={prefillTime} blockTimes={blockTimes||[]}
        />
      )}
      {cancelWaitlistAppt&&(
        <Modal title="Patient on Waitlist" onClose={()=>setCancelWaitlistAppt(null)}>
          <p style={{fontSize:13,color:C.text,marginBottom:16}}>There {cancelWaitlistAppt.waitlist.length===1?"is":"are"} <strong>{cancelWaitlistAppt.waitlist.length}</strong> patient{cancelWaitlistAppt.waitlist.length!==1?"s":""} on the waitlist for {cancelWaitlistAppt.appt.doctor}.</p>
          {cancelWaitlistAppt.waitlist.slice(0,1).map(w=>(
            <div key={w.id} style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"12px 16px",marginBottom:16}}>
              <div style={{fontWeight:600,fontSize:13}}>{w.patient}</div>
              <div style={{fontSize:12,color:C.muted}}>Preferred: {w.preferredTime} · {w.reason}</div>
            </div>
          ))}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <XB onClick={()=>{setAppts(p=>p.map(x=>x.id===cancelWaitlistAppt.appt.id?{...x,status:"no-show"}:x));setCancelWaitlistAppt(null);}}>Cancel appointment only</XB>
            <PB onClick={()=>{
              setAppts(p=>p.map(x=>x.id===cancelWaitlistAppt.appt.id?{...x,status:"no-show"}:x));
              setWaitlist(p=>p.map(w=>w.id===cancelWaitlistAppt.waitlist[0].id?{...w,status:"contacted"}:w));
              setCancelWaitlistAppt(null);showToast&&showToast("Waitlist patient marked contacted");
            }}>Mark as Contacted &amp; Book</PB>
          </div>
        </Modal>
      )}

      <PageHeader title="Appointments" meta={`${displayDate} · ${dayAppts.length} booked`}
        actions={<>
          {canAdd&&<XB onClick={printDaySchedule}><Icon as={Printer}/>Print day</XB>}
          {canAdd&&<PB onClick={()=>setShowNew(true)}><Icon as={CalendarPlus}/>New appointment</PB>}
        </>}/>
      <div style={{marginBottom:12}}>
        <Segmented value={view} onChange={setView} options={[["list","List",List],["day","Day",CalendarDays],["week","Week",CalendarRange],["waitlist","Waitlist",Hourglass,(waitlist||[]).filter(w=>w.status!=="contacted").length]]}/>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "264px minmax(0,1fr)", gap: 12, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <MiniCalendar selectedDate={selectedDate} onSelectDate={date => { setSelectedDate(date); setFilter("all"); }} appts={appts} />
          <Card style={{ padding: "16px" }}>
            <div style={{ fontSize: 15, fontWeight:600, color: C.text, marginBottom: 12 }}>Day summary</div>
            {[["Total",dayAppts.length,null],["Scheduled",dayAppts.filter(a=>a.status==="scheduled").length,"scheduled"],["Checked in",dayAppts.filter(a=>a.status==="checked-in").length,"checked-in"],["With nurse",dayAppts.filter(a=>a.status==="with-nurse").length,"with-nurse"],["With doctor",dayAppts.filter(a=>a.status==="in-progress").length,"in-progress"],["Completed",dayAppts.filter(a=>a.status==="completed").length,"completed"],["No-show",dayAppts.filter(a=>a.status==="no-show").length,"no-show"]].map(([label,count,st],i)=>(
              <div key={label} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderTop:i?`1px solid ${C.border}`:"none"}}>
                {st&&<Dot color={STATUS_TONE[st]} size={6}/>}
                <span style={{fontSize:13,color:i?C.text2:C.text,fontWeight:i?400:500,flex:1}}>{label}</span>
                <span style={{fontSize:13,fontWeight:500,color:count>0?C.text:C.muted,fontVariantNumeric:"tabular-nums"}}>{count}</span>
              </div>
            ))}
          </Card>
        </div>

        <div>
          {view === "waitlist" && (
            <WaitlistPanel waitlist={waitlist||[]} setWaitlist={setWaitlist} patients={patients} canAdd={canAdd||user.role==="nurse"}/>
          )}
          {view === "list" && (
            <>
              <div style={{ marginBottom: 12 }}>
                <Segmented size="sm" value={filter} onChange={setFilter} options={[["all","All"],["scheduled","Scheduled"],["checked-in","Checked in"],["with-nurse","With nurse"],["in-progress","With doctor"],["completed","Completed"],["no-show","No-show"]].map(([id,l])=>[id,l,null,id==="all"?0:dayAppts.filter(a=>a.status===id).length])}/>
              </div>
              <Card>
                {filtered.length === 0 ? (
                  <div style={{ padding: "48px 32px", textAlign: "center", color: C.muted }}>
                    <CalendarDays size={28} strokeWidth={1.5} aria-hidden="true" style={{ marginBottom: 12 }}/>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No appointments</div>
                    <div style={{ fontSize: 13 }}>{filter !== "all" ? "No appointments match this filter." : "No appointments scheduled for this day."}</div>
                  </div>
                ) : (
                  <table className="tbl" style={{width:"100%",borderCollapse:"collapse" }}>
                    <thead>
                      <tr>
                        {["Time","Patient","Visit","Doctor","Length","Status","Reminder",""].map((h,hi) => (
                          <th key={hi} style={{ padding: "12px 12px 8px", textAlign: "left", fontSize:12, fontWeight:400, color: C.muted, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a, i) => {
                        const dot = getReminderDot(a.id);
                        const logs = (reminderLogs||{})[a.id]||[];
                        const isExpanded = expandedReminder===a.id;
                        return [
                          <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}`, background: a.status==="no-show" ? C.raised : "transparent" }}>
                            <td style={{ whiteSpace: "nowrap", padding: "12px 12px", fontSize: 13, fontFamily: C.mono, color: C.text2, fontVariantNumeric: "tabular-nums" }}>{a.time}</td>
                            <td style={{ whiteSpace: "nowrap", padding: "12px 12px", fontSize: 13, fontWeight:500, color: C.text }}>{a.patient}</td>
                            <td style={{ whiteSpace: "nowrap", padding: "12px 12px" }}><TB type={a.type}/></td>
                            <td style={{ whiteSpace: "nowrap", padding: "12px 12px", fontSize: 13, color: C.text2 }}>{a.doctor}</td>
                            <td style={{ whiteSpace: "nowrap", padding: "12px 12px", fontSize: 13, color: C.text2 }}>{a.duration} min</td>
                            <td style={{ whiteSpace: "nowrap", padding: "12px 12px" }}><SB status={a.status}/></td>
                            <td style={{ whiteSpace: "nowrap", padding: "12px 12px" }}>
                              <button onClick={()=>setExpandedReminder(isExpanded?null:a.id)} title={dot.label}
                                style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:0}}>
                                <Dot color={dot.color} size={6}/>
                                <span style={{fontSize:12,color:C.text2}}>{dot.label}</span>
                              </button>
                            </td>
                            <td style={{ whiteSpace: "nowrap", padding: "12px 12px" }}>
                              <div style={{ display: "flex", gap: 4 }}>
                                {a.status !== "completed" && a.status !== "no-show" && (
                                  <button onClick={() => advance(a.id)} className="btn btn-secondary btn-sm">{BTN_LABEL[a.status]||"Next"}</button>
                                )}
                                {a.status === "scheduled" && (
                                  <button onClick={() => noShowHandler(a.id)} className="btn btn-secondary btn-sm" style={{color:C.text2}}>No-show</button>
                                )}
                              </div>
                            </td>
                          </tr>,
                          isExpanded && (
                            <tr key={a.id+"-log"}>
                              <td colSpan={8} style={{padding:"0 12px 12px",background:C.raised}}>
                                <div style={{padding:"12px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`}}>
                                  <div style={{fontWeight:500,fontSize:13,color:C.text,marginBottom:8}}>Reminder log</div>
                                  {logs.length===0?<div style={{fontSize:12,color:C.muted,marginBottom:8}}>No reminders logged yet.</div>:logs.map((lg,li)=>(
                                    <div key={lg.id} style={{display:"flex",gap:12,alignItems:"center",marginBottom:6,fontSize:12}}>
                                      <span style={{color:C.muted,minWidth:130}}>{lg.ts}</span>
                                      <span style={{background:C.bg,borderRadius:4,padding:"1px 6px",fontWeight:600}}>{lg.method}</span>
                                      <span style={{color:C.text,flex:1}}>{lg.outcome}</span>
                                      {lg.confirmed&&<Badge color="green">Confirmed</Badge>}
                                    </div>
                                  ))}
                                  {canLog&&(
                                    <div style={{display:"flex",gap:8,marginTop:8}}>
                                      <input value={phoneLogText} onChange={e=>setPhoneLogText(e.target.value)} placeholder="Log outcome…" style={{...IS,flex:1,fontSize:12,padding:"6px 10px"}}/>
                                      <button onClick={()=>logPhoneCall(a.id)} className="btn btn-primary btn-sm" >Log call</button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        ].filter(Boolean);
                      })}
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

export function WaitlistPanel({waitlist,setWaitlist,patients,canAdd}){
  const[f,sf]=useState({pid:"",doctor:"Dr. Patel",preferredTime:"Morning",reason:""});
  const[loading,setLoading]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),600);return()=>clearTimeout(t);},[]);
  const add=()=>{
    if(!f.pid||!f.reason)return;
    const pt=patients.find(p=>p.id===parseInt(f.pid));
    if(!pt)return;
    setWaitlist(p=>[...p,{id:Date.now(),patient:`${pt.first_name} ${pt.last_name}`,patientId:pt.id,doctor:f.doctor,preferredTime:f.preferredTime,reason:f.reason,addedDate:today(),status:"waiting"}]);
    sf({pid:"",doctor:"Dr. Patel",preferredTime:"Morning",reason:""});
  };
  const markContacted=(id)=>setWaitlist(p=>p.map(w=>w.id===id?{...w,status:"contacted"}:w));
  if(loading)return <div style={{padding:32}}>{[1,2,3].map(i=><div key={i} style={{background:C.skeleton,borderRadius:8,height:56,marginBottom:8}}/>)}</div>;
  return(
    <div>
      {canAdd&&<Card style={{marginBottom:16,padding:"16px 20px"}}>
        <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>Add to waitlist</div>
        <FR><FF label="Patient"><select value={f.pid} onChange={e=>sf(p=>({...p,pid:e.target.value}))} style={SS}><option value="">Select patient…</option>{patients.map(pt=><option key={pt.id} value={pt.id}>{pt.first_name} {pt.last_name}</option>)}</select></FF><FF label="Doctor"><select value={f.doctor} onChange={e=>sf(p=>({...p,doctor:e.target.value}))} style={SS}><option>Dr. Patel</option><option>Dr. Williams</option></select></FF></FR>
        <FR><FF label="Preferred time"><select value={f.preferredTime} onChange={e=>sf(p=>({...p,preferredTime:e.target.value}))} style={SS}><option>Morning</option><option>Afternoon</option><option>Either</option></select></FF><FF label="Reason"><input value={f.reason} onChange={e=>sf(p=>({...p,reason:e.target.value}))} style={IS} placeholder="Reason for visit…"/></FF></FR>
        <PB onClick={add} disabled={!f.pid||!f.reason}>Add to waitlist</PB>
      </Card>}
      <Card>
        {waitlist.length===0?<div style={{padding:"40px 24px",textAlign:"center",color:C.muted}}>Waitlist is empty.</div>:(
          waitlist.map((w,i)=>(
            <div key={w.id} style={{padding:"16px 20px",borderBottom:i<waitlist.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:16}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:14,color:C.text}}>{w.patient}</div>
                <div style={{fontSize:12,color:C.muted}}>{w.doctor} · {w.preferredTime} · {w.reason}</div>
                <div style={{fontSize:12,color:C.muted,marginTop:2}}>Added {fmt(w.addedDate)}</div>
              </div>
              <Badge color={w.status==="contacted"?"green":"neutral"}>{w.status==="contacted"?"Contacted":"Waiting"}</Badge>
              {w.status==="waiting"&&<button onClick={()=>markContacted(w.id)} className="btn btn-secondary btn-sm" >Mark contacted</button>}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

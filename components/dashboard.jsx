import React, { useState, useEffect } from "react";
import { CalendarDays, Users, Pill, BellRing, Package, Stethoscope, Maximize2, Minimize2, ArrowUp, Check, ClipboardList, CalendarX2, UserRound, Activity, GripVertical, Eye, EyeOff, ArrowDown, ArrowLeftRight, SlidersHorizontal, RotateCcw } from "lucide-react";
import { permsFor, useStaff } from "./lib/accounts";
import { DEMO_NOW, DEMO_TODAY } from "./lib/data";
import { fmt, initials, lastName, toMin } from "./lib/utils";
import { Alert, Badge, C, Card, CardHead, DashHeader, Dot, FLOW_STAGES, Grid, Icon, KVGrid, PB, PageHeader, PageWrap, SB, StatCard, TB, TimeCell, Timeline, XB } from "./ui";

export function FlowWidget({appts,setPage,flush}){
  const todayAppts=appts.filter(a=>(a.date||DEMO_TODAY)===DEMO_TODAY);
  const COLS=FLOW_STAGES.filter(c=>c.id!=="with-nurse"||todayAppts.some(a=>a.status==="with-nurse"));
  return(
    <Card style={{marginBottom:flush?0:12}}>
      <CardHead title="Patient flow" meta={`${todayAppts.filter(a=>a.status!=="no-show").length} visits today`} action="Open board" onAction={()=>setPage("flow")}/>
      <div style={{padding:"0 20px 20px"}}>
        <div role="img" aria-label={COLS.map(c=>`${todayAppts.filter(a=>a.status===c.id).length} ${c.label.toLowerCase()}`).join(", ")} style={{display:"flex",gap:2,height:6,borderRadius:3,overflow:"hidden",background:C.raised,marginBottom:16}}>
          {COLS.map(col=>{const n=todayAppts.filter(a=>a.status===col.id).length;return n?<div key={col.id} style={{flex:n,background:col.color}}/>:null;})}
        </div>
        <div style={{display:"grid",gridTemplateColumns:`repeat(${COLS.length},1fr)`}}>
          {COLS.map((col,i)=>{
            const cnt=todayAppts.filter(a=>a.status===col.id).length;
            return(
              <div key={col.id} style={{paddingLeft:i?16:0,borderLeft:i?`1px solid ${C.border}`:"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.muted}}><Dot color={col.color} size={6}/>{col.label}</div>
                <div style={{fontSize:20,fontWeight:600,color:C.text,marginTop:4,fontVariantNumeric:"tabular-nums"}}>{cnt}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

// Plain table of visits: hairline rows, small grey headers, status as a pill
export function ApptTable({rows,showDoctor=true,empty="No appointments"}){
  const th={padding:"4px 12px 8px",fontSize:12,fontWeight:400,color:C.muted,textAlign:"left",whiteSpace:"nowrap"};
  const td={padding:"12px",fontSize:14,color:C.text,borderTop:`1px solid ${C.border}`,whiteSpace:"nowrap"};
  if(!rows.length)return <div style={{padding:"8px 20px 20px",fontSize:13,color:C.muted}}>{empty}</div>;
  return(
    <div style={{overflowX:"auto"}}>
      <table className="tbl" style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr><th style={th}>Time</th><th style={th}>Patient</th>{showDoctor&&<th style={th}>Doctor</th>}<th style={th}>Visit</th><th style={th}>Status</th></tr></thead>
        <tbody>{rows.map(a=>(
          <tr key={a.id}>
            <td style={{...td,fontFamily:C.mono,fontSize:13,color:C.text2,fontVariantNumeric:"tabular-nums",width:64}}>{a.time}</td>
            <td style={{...td,fontWeight:500}}>{a.patient}</td>
            {showDoctor&&<td style={{...td,color:C.text2}}>{a.doctor}</td>}
            <td style={td}><TB type={a.type}/></td>
            <td style={td}><SB status={a.status}/></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

export function TasksWidget({tasks,setPage,today,style}){
  const PR={high:0,medium:1,low:2};
  const open=tasks.filter(t=>t.status!=="completed").sort((a,b)=>(PR[a.priority]??3)-(PR[b.priority]??3)||(a.due||"").localeCompare(b.due||""));
  const doneCount=tasks.length-open.length;
  const shown=open.slice(0,4);
  return(
    <Card style={style}>
      <CardHead title="Open tasks" meta={`${open.length} open · ${doneCount} completed`} action="All tasks" onAction={()=>setPage("tasks")}/>
      {shown.length===0&&<div style={{padding:"0 20px 20px",color:C.muted,fontSize:13}}>No open tasks</div>}
      {shown.map(t=>{
        const overdue=t.due&&t.due<today;
        const dueToday=t.due===today;
        return(
          <div key={t.id} onClick={()=>setPage("tasks")} className="row-link" style={{padding:"12px 20px",display:"flex",alignItems:"flex-start",gap:12,borderTop:`1px solid ${C.border}`}}>
            <span title={`${t.priority} priority`} style={{marginTop:6}}><Dot color={t.priority==="high"?C.red:t.priority==="medium"?C.amber:C.inactive}/></span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>
                <span style={{textTransform:"capitalize"}}>{t.assignedTo}</span>
                {t.due&&<> · <span style={{color:overdue?C.red:C.muted,fontWeight:overdue?500:400}}>{overdue?"Overdue":dueToday?"Due today":`Due ${fmt(t.due).replace(/, \d{4}$/,"")}`}</span></>}
              </div>
            </div>
            {t.status==="in-progress"&&<Badge color="blue">In progress</Badge>}
          </div>
        );
      })}
      {open.length>shown.length&&<div style={{padding:"12px 20px",borderTop:`1px solid ${C.border}`}}><button className="text-link" onClick={()=>setPage("tasks")} style={{fontSize:12}}>{open.length-shown.length} more</button></div>}
    </Card>
  );
}

export function UpcomingWidget({appts}){
  const NEXT="2026-02-26";
  const rows=appts.filter(a=>(a.date||DEMO_TODAY)===NEXT).sort((a,b)=>a.time.localeCompare(b.time)).slice(0,4);
  if(!rows.length)return null;
  return(
    <Card>
      <CardHead title="Tomorrow" meta={`First ${rows.length} appointment${rows.length>1?"s":""}`}/>
      {rows.map(a=>(
        <div key={a.id} style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:12,borderTop:`1px solid ${C.border}`}}>
          <TimeCell>{a.time}</TimeCell>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,color:C.text}}>{a.patient}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{a.doctor}</div></div>
          <TB type={a.type}/>
        </div>
      ))}
    </Card>
  );
}

export function RecallList({recalls,limit=4}){
  const ORDER={high:0,medium:1,low:2};
  const rows=[...recalls].sort((a,b)=>(ORDER[a.urgency]??3)-(ORDER[b.urgency]??3)||a.due.localeCompare(b.due)).slice(0,limit);
  if(!rows.length)return <div style={{padding:"0 20px 20px",color:C.muted,fontSize:13}}>No open recalls</div>;
  return rows.map(r=>{const late=r.due<DEMO_TODAY;return(
    <div key={r.id} style={{padding:"12px 20px",display:"flex",alignItems:"flex-start",gap:12,borderTop:`1px solid ${C.border}`}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,color:C.text}}>{r.patient}</div>
        <div style={{fontSize:12,color:C.muted,marginTop:2}}>{r.reason}</div>
      </div>
      <div style={{fontSize:12,color:late?C.red:C.muted,fontWeight:late?500:400,whiteSpace:"nowrap",marginTop:2}}>{late?"Overdue since ":"Due "}{fmt(r.due).replace(/, \d{4}$/,"")}</div>
    </div>
  );});
}

// ─── Customisable dashboard layout ───────────────────────────────────────────
// Panels live in zones: "top" (full width), "left" (narrow column), "right" (wide column) or "hidden".
// The layout is saved per role in localStorage. Edit mode: drag panels, or use the toolbar buttons.
export const DASH_ZONES=["top","left","right","hidden"];
export const ADMIN_DASH_DEFAULT={top:["glance"],left:["clinicDay","tasks","staff"],right:["appointments","supplies"],hidden:[]};

export function DashboardLayout({storageKey,legacyKey,canCustomise=true,panels,defaults,header}){
  const ids=Object.keys(panels);
  // Keep only known panels, once each; anything new goes to its default zone
  const normalize=l=>{
    const seen=new Set(),out={};
    DASH_ZONES.forEach(z=>{out[z]=(Array.isArray(l?.[z])?l[z]:[]).filter(id=>panels[id]&&!seen.has(id)&&seen.add(id));});
    ids.forEach(id=>{if(!seen.has(id)){const z=DASH_ZONES.find(z=>defaults[z]?.includes(id))||"right";out[z].push(id);}});
    return out;
  };
  const[layout,setLayout]=useState(()=>{try{const saved=localStorage.getItem(storageKey)??(legacyKey&&localStorage.getItem(legacyKey));if(saved)return normalize(JSON.parse(saved));}catch{}return normalize(defaults);});
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(layout));}catch{}},[layout,storageKey]);
  const[editing,setEditing]=useState(false);
  const[drag,setDrag]=useState(null);   // id of the panel being dragged
  const[over,setOver]=useState(null);   // {zone,index}: where it would land

  const move=(id,zone,index)=>setLayout(l=>{
    const n={};DASH_ZONES.forEach(z=>{n[z]=[...l[z]];});
    let fromZ=null,fromI=-1;
    DASH_ZONES.forEach(z=>{const i=n[z].indexOf(id);if(i>=0){fromZ=z;fromI=i;n[z].splice(i,1);}});
    if(fromZ===zone&&fromI<index)index--;
    n[zone].splice(Math.max(0,Math.min(index,n[zone].length)),0,id);
    return n;
  });
  const zoneOf=id=>DASH_ZONES.find(z=>layout[z].includes(id));
  const endDrag=()=>{setDrag(null);setOver(null);};
  const drop=e=>{e.preventDefault();if(drag&&over)move(drag,over.zone,over.index);endDrag();};
  const isDefault=JSON.stringify(normalize(defaults))===JSON.stringify(layout);

  const tb={width:28,height:28,border:"none",borderRadius:6,background:"transparent",color:C.text2,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"};
  const DropLine=()=><div aria-hidden="true" style={{height:3,borderRadius:2,background:C.navyMid,margin:"-7px 0"}}/>;

  const renderZone=(zone,style)=>{
    const items=layout[zone];
    return(
      <div style={{display:"flex",flexDirection:"column",gap:12,minWidth:0,...style}}
        onDragOver={e=>{if(!drag)return;e.preventDefault();if(e.target===e.currentTarget)setOver({zone,index:items.length});}}
        onDrop={drop}>
        {items.map((id,i)=>{
          const z=zone, col=z==="left"||z==="right";
          return(
            <React.Fragment key={id}>
              {over&&over.zone===zone&&over.index===i&&drag!==id&&<DropLine/>}
              <div draggable={editing}
                onDragStart={e=>{setDrag(id);e.dataTransfer.effectAllowed="move";try{e.dataTransfer.setData("text/plain",id);}catch{}}}
                onDragEnd={endDrag}
                onDragOver={e=>{if(!drag)return;e.preventDefault();e.stopPropagation();const r=e.currentTarget.getBoundingClientRect();setOver({zone,index:e.clientY>r.top+r.height/2?i+1:i});}}
                style={{position:"relative",opacity:drag===id?0.4:1,cursor:editing?"grab":undefined,
                  outline:editing?`1px dashed ${C.border2}`:"none",outlineOffset:3,borderRadius:8,transition:"opacity 160ms var(--ease)"}}>
                {editing&&(
                  <div role="toolbar" aria-label={`${panels[id].title} panel`} style={{position:"absolute",top:10,right:10,zIndex:3,display:"flex",alignItems:"center",gap:2,padding:2,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)"}}>
                    <span title="Drag to move" style={{...tb,cursor:"grab",color:C.muted}}><GripVertical size={16} strokeWidth={1.5} aria-hidden="true"/></span>
                    <button className="icon-btn" style={tb} title="Move up" aria-label={`Move ${panels[id].title} up`} disabled={i===0} onClick={()=>move(id,zone,i-1)}><ArrowUp size={15} strokeWidth={1.5} style={{opacity:i===0?0.35:1}}/></button>
                    <button className="icon-btn" style={tb} title="Move down" aria-label={`Move ${panels[id].title} down`} disabled={i===items.length-1} onClick={()=>move(id,zone,i+2)}><ArrowDown size={15} strokeWidth={1.5} style={{opacity:i===items.length-1?0.35:1}}/></button>
                    {col&&<button className="icon-btn" style={tb} title={z==="left"?"Move to wide column":"Move to narrow column"} aria-label={`Move ${panels[id].title} to the ${z==="left"?"wide":"narrow"} column`} onClick={()=>move(id,z==="left"?"right":"left",layout[z==="left"?"right":"left"].length)}><ArrowLeftRight size={15} strokeWidth={1.5}/></button>}
                    <button className="icon-btn" style={tb} title={col?"Make full width":"Put in a column"} aria-label={col?`Make ${panels[id].title} full width`:`Put ${panels[id].title} in a column`} onClick={()=>col?move(id,"top",layout.top.length):move(id,"right",0)}>{col?<Maximize2 size={15} strokeWidth={1.5}/>:<Minimize2 size={15} strokeWidth={1.5}/>}</button>
                    <span aria-hidden="true" style={{width:1,height:16,background:C.border,margin:"0 2px"}}/>
                    <button className="icon-btn" style={tb} title="Hide panel" aria-label={`Hide ${panels[id].title}`} onClick={()=>move(id,"hidden",layout.hidden.length)}><EyeOff size={15} strokeWidth={1.5}/></button>
                  </div>
                )}
                <div inert={editing||undefined} style={editing?{pointerEvents:"none",userSelect:"none"}:undefined}>{panels[id].el}</div>
              </div>
            </React.Fragment>
          );
        })}
        {over&&over.zone===zone&&over.index===items.length&&<DropLine/>}
        {editing&&items.length===0&&(
          <div style={{border:`1px dashed ${C.border2}`,borderRadius:8,padding:"28px 16px",textAlign:"center",fontSize:13,color:C.muted}}>
            {zone==="top"?"Drop here for a full-width panel":"Drop panels here"}
          </div>
        )}
      </div>
    );
  };

  const customize=canCustomise&&(
    <XB onClick={()=>{setEditing(v=>!v);endDrag();}}>
      {editing?<><Icon as={Check}/>Done</>:<><Icon as={SlidersHorizontal}/>Customise</>}
    </XB>
  );
  return(
    <PageWrap>
      {header(customize)}
      {editing&&(
        <div role="region" aria-label="Customise dashboard" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 16px",marginBottom:12,display:"flex",alignItems:"center",gap:12,flexWrap:"wrap",animation:"rise 160ms var(--ease)"}}>
          <Icon as={SlidersHorizontal} style={{color:C.text2}}/>
          <div style={{flex:1,minWidth:240}}>
            <div style={{fontSize:14,fontWeight:600,color:C.text}}>Customising your dashboard</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Drag a panel to move it, or use its buttons. Your layout is saved for your account on this browser.</div>
          </div>
          {layout.hidden.length>0&&(
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:12,color:C.muted}}>Hidden:</span>
              {layout.hidden.map(id=>(
                <button key={id} className="btn btn-secondary btn-sm" onClick={()=>{const z=DASH_ZONES.find(z=>z!=="hidden"&&defaults[z]?.includes(id))||"right";move(id,z,layout[z].length);}}>
                  <Eye size={14} strokeWidth={1.5} aria-hidden="true"/>{panels[id].title}
                </button>
              ))}
            </div>
          )}
          <XB onClick={()=>setLayout(normalize(defaults))}><Icon as={RotateCcw}/>Reset to default</XB>
        </div>
      )}
      {(layout.top.length>0||editing)&&renderZone("top",{marginBottom:12})}
      <div style={{display:"grid",gridTemplateColumns:"minmax(0,5fr) minmax(0,8fr)",gap:12,alignItems:"start"}}>
        {renderZone("left")}
        {renderZone("right")}
      </div>
    </PageWrap>
  );
}

export function Dashboard({user,view,setPage,appts,recalls,refillRequests,inventory=[],staffSchedule=[],tasks=[],patients=[]}){
  const STAFF_LIST=useStaff();
  const r=view||user.role;
  const TODAY=DEMO_TODAY, NOW=DEMO_NOW;
  const todayAppts=appts.filter(a=>(a.date||TODAY)===TODAY).sort((a,b)=>a.time.localeCompare(b.time));
  const onShift=staffSchedule.filter(s=>s.date===TODAY);
  const lowStock=inventory.filter(i=>i.qty<=i.reorderAt);
  const checkedIn=todayAppts.filter(a=>a.status==="checked-in");
  const inProg=todayAppts.filter(a=>a.status==="in-progress");
  const inClinic=todayAppts.filter(a=>["checked-in","with-nurse","in-progress"].includes(a.status));
  const noShows=todayAppts.filter(a=>a.status==="no-show");
  const completed=todayAppts.filter(a=>a.status==="completed");
  const overdue=recalls.filter(r=>r.urgency==="high");
  const pendingRefills=(refillRequests||[]).filter(r=>r.status==="pending");
  const nextUp=todayAppts.find(a=>a.status==="scheduled"&&toMin(a.time)>=toMin(NOW));
  const longestWait=Math.max(0,...inClinic.filter(a=>a.stageEnteredAt).map(a=>toMin(NOW)-toMin(a.stageEnteredAt.slice(11))));
  const dayHeader=(sub,actions)=><DashHeader date={TODAY} sub={sub} actions={actions}/>;
  const dashKey=`medplus.dashboard.user.${user.username}${r!==user.role?`.${r}`:""}`, canCustomise=permsFor(user).customiseDashboard!==false;

  // Every role's dashboard is a set of panels; DashboardLayout lets each account arrange its own
  const roleDash=(defaults,panels,sub,actions,alert)=>(
    <DashboardLayout storageKey={dashKey} legacyKey={r===user.role?`medplus.dashboard.${r}`:undefined} canCustomise={canCustomise} panels={panels} defaults={defaults}
      header={customize=>(<>{dayHeader(sub,<>{customize}{actions}</>)}{alert}</>)}/>
  );

  if(r==="receptionist")return roleDash(
    {top:["stats","flow"],left:["upcoming"],right:["appointments"],hidden:[]},
    {
      stats:{title:"Today in numbers",el:(
        <Grid cols="repeat(4,minmax(0,1fr))" style={{marginBottom:0}}>
          <StatCard icon={CalendarDays} label="Booked today" value={todayAppts.length} sub={nextUp?`Next: ${nextUp.time} ${nextUp.patient}`:"No one left to arrive"} onClick={()=>setPage("appointments")}/>
          <StatCard icon={ClipboardList} label="Waiting room" value={checkedIn.length} dot={checkedIn.length?C.teal:undefined} sub="Checked in" onClick={()=>setPage("flow")}/>
          <StatCard icon={CalendarX2} label="No-shows" value={noShows.length} tone="red" sub="Need follow-up"/>
          <StatCard icon={BellRing} label="Overdue recalls" value={overdue.length} tone="red" sub="Need scheduling" onClick={()=>setPage("recalls")}/>
        </Grid>)},
      flow:{title:"Patient flow",el:<FlowWidget appts={appts} setPage={setPage} flush/>},
      appointments:{title:"Appointments today",el:<Card><CardHead title="Appointments today" meta={`${completed.length} of ${todayAppts.length} done`} action="Calendar" onAction={()=>setPage("appointments")}/><ApptTable rows={todayAppts}/></Card>},
      upcoming:{title:"Tomorrow",el:<UpcomingWidget appts={appts}/>},
    },
    `Front desk · ${todayAppts.length} appointments booked`,
    <><XB onClick={()=>setPage("recalls")}>Recalls</XB><PB onClick={()=>setPage("appointments")}>Book appointment</PB></>
  );

  if(r==="nurse"){
    const ready=todayAppts.filter(a=>["checked-in","scheduled"].includes(a.status)).slice(0,5);
    return roleDash(
    {top:["stats","flow"],left:["recalls"],right:["ready"],hidden:[]},
    {
      stats:{title:"Today in numbers",el:(
        <Grid cols="repeat(4,minmax(0,1fr))" style={{marginBottom:0}}>
          <StatCard icon={ClipboardList} label="Checked in" value={checkedIn.length} dot={checkedIn.length?C.teal:undefined} sub="Awaiting vitals"/>
          <StatCard icon={Stethoscope} label="With doctor" value={inProg.length} sub="In progress"/>
          <StatCard icon={CalendarDays} label="Still to arrive" value={todayAppts.filter(a=>a.status==="scheduled").length} sub="Scheduled"/>
          <StatCard icon={CalendarX2} label="No-shows" value={noShows.length} tone="red" sub="Today"/>
        </Grid>)},
      flow:{title:"Patient flow",el:<FlowWidget appts={appts} setPage={setPage} flush/>},
      ready:{title:"Ready for vitals",el:<Card><CardHead title="Ready for vitals" meta="Checked in first, then by time"/><ApptTable rows={[...ready].sort((a,b)=>(a.status==="checked-in"?0:1)-(b.status==="checked-in"?0:1))} empty="No one waiting"/></Card>},
      recalls:{title:"Recalls",el:<Card><CardHead title="Recalls" meta={`${overdue.length} overdue`} action="All recalls" onAction={()=>setPage("recalls")}/><RecallList recalls={recalls}/></Card>},
    },
    `Nursing · ${checkedIn.length} waiting for vitals`,
    <PB onClick={()=>setPage("flow")}>Open patient flow</PB>,
    checkedIn.length>0&&<Alert tone="amber" title={`${checkedIn.length} patient${checkedIn.length>1?"s":""} waiting for vitals`} meta={checkedIn.map(a=>a.patient).join(", ")} onClick={()=>setPage("flow")} style={{marginBottom:12}}/>
  );}

  if(r==="doctor"){
    const mine=todayAppts.filter(a=>a.doctor==="Dr. Patel");
    const nextMine=mine.find(a=>a.status==="checked-in")||mine.find(a=>a.status==="scheduled");
    return roleDash(
    {top:["stats"],left:["recalls","upcoming"],right:["schedule"],hidden:[]},
    {
      stats:{title:"Today in numbers",el:(
        <Grid cols="repeat(4,minmax(0,1fr))" style={{marginBottom:0}}>
          <StatCard icon={Users} label="My patients today" value={mine.length} sub={`${mine.filter(a=>a.status==="completed").length} seen`}/>
          <StatCard icon={UserRound} label="Next patient" value={nextMine?nextMine.time:"—"} dot={nextMine?.status==="checked-in"?C.teal:undefined} sub={nextMine?`${nextMine.patient}${nextMine.status==="checked-in"?" · checked in":""}`:"Schedule clear"}/>
          <StatCard icon={Pill} label="Pending refills" value={pendingRefills.length} sub="Awaiting review" onClick={()=>setPage("refills")}/>
          <StatCard icon={BellRing} label="Overdue recalls" value={overdue.length} tone="red" sub="Your patients" onClick={()=>setPage("recalls")}/>
        </Grid>)},
      schedule:{title:"My schedule",el:<Card><CardHead title="My schedule" meta={`${mine.length} visits · ${mine.reduce((s,a)=>s+a.duration,0)} min booked`} action="View all" onAction={()=>setPage("appointments")}/><ApptTable rows={mine} showDoctor={false}/></Card>},
      recalls:{title:"Recalls",el:<Card><CardHead title="Recalls" meta={`${recalls.length} open`} action="All recalls" onAction={()=>setPage("recalls")}/><RecallList recalls={recalls}/></Card>},
      upcoming:{title:"Tomorrow",el:<UpcomingWidget appts={appts}/>},
    },
    `${user.name} · ${mine.length} patients on your schedule`,
    <><XB onClick={()=>setPage("appointments")}>Calendar</XB><PB onClick={()=>setPage("flow")}>Open patient flow</PB></>,
    pendingRefills.length>0&&<Alert tone="amber" title={`${pendingRefills.length} refill request${pendingRefills.length>1?"s":""} waiting for your review`} meta="Refill queue" onClick={()=>setPage("refills")} style={{marginBottom:12}}/>
  );}

  // ── Admin: the office admin's console ──
  const shiftOf=doctor=>onShift.find(s=>s.role==="doctor"&&lastName(s.staffName)===lastName(doctor));
  // Visits booked after the doctor's shift ends: the one scheduling problem a manager has to fix today
  const offShift=todayAppts.filter(a=>a.status==="scheduled"&&(()=>{const sh=shiftOf(a.doctor);return !sh||toMin(a.time)>=toMin(sh.endTime);})());
  const byRole=role=>onShift.filter(s=>s.role===role);
  const firstIn=[...STAFF_LIST].filter(s=>s.lastLogin.startsWith(TODAY)).sort((a,b)=>a.lastLogin.localeCompare(b.lastLogin))[0];
  const morning=todayAppts.filter(a=>toMin(a.time)<toMin("12:00"));
  const afternoon=todayAppts.filter(a=>toMin(a.time)>=toMin("12:00"));
  const lateStarters=onShift.filter(s=>toMin(s.startTime)>=toMin("12:00"));
  const watch=[...inventory].sort((a,b)=>a.qty/a.reorderAt-b.qty/b.reorderAt).slice(0,4);
  const attention=lowStock.length+overdue.length+offShift.length;
  // Every panel on the manager's dashboard; DashboardLayout decides where each one goes
  const panels={
    glance:      {title:"Today at a glance",  el:(
      <Card style={{paddingBottom:8}}>
        <CardHead title="Today at a glance"/>
        <KVGrid items={[
          ["Appointments",`${todayAppts.length} booked`],
          ["In clinic now",`${inClinic.length} patient${inClinic.length!==1?"s":""}`],
          ["Completed",`${completed.length} of ${todayAppts.length}`],
          ["Next arrival",nextUp?`${nextUp.time} · ${nextUp.patient}`:"None"],
          ["Doctors on shift",byRole("doctor").map(s=>lastName(s.staffName)+(s.type!=="regular"?` (to ${s.endTime})`:"")).join(", ")||"None"],
          ["Nurses on shift",byRole("nurse").map(s=>s.staffName.split(" ")[0]+(toMin(s.startTime)>=toMin("12:00")?` (from ${s.startTime})`:"")).join(", ")||"None"],
          ["Front desk",byRole("receptionist").map(s=>s.staffName).join(", ")||"None"],
          ["Total patients",`${patients.length} · ${patients.filter(p=>p.active!==false).length} active`],
        ]}/>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,minmax(0,1fr))",margin:"0 20px",borderTop:`1px solid ${C.border}`}}>
          {[
            {icon:Activity,label:"Longest wait",value:inClinic.length?`${longestWait} min`:"—",dot:inClinic.length?(longestWait>30?C.red:longestWait>15?C.amber:C.green):null,sub:`${inClinic.length} in clinic now`,to:"flow"},
            {icon:Package,label:"Low stock",value:lowStock.length,dot:lowStock.length?C.red:null,sub:lowStock.length?"Reorder needed":"All stocked",to:"inventory"},
            {icon:BellRing,label:"Overdue recalls",value:overdue.length,dot:overdue.length?C.red:null,sub:"Need scheduling",to:"recalls"},
            {icon:Pill,label:"Refill requests",value:pendingRefills.length,dot:null,sub:"Awaiting a doctor",to:"refills"},
          ].map((m,i)=>(
            <button key={m.label} onClick={()=>setPage(m.to)} className="row-link" style={{all:"unset",boxSizing:"border-box",cursor:"pointer",padding:"16px 16px 20px",paddingLeft:i?16:0,borderLeft:i?`1px solid ${C.border}`:"none",minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.muted}}><Icon as={m.icon} size={16} style={{color:C.text2}}/>{m.label}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8}}>{m.dot&&<Dot color={m.dot}/>}<span style={{fontSize:22,fontWeight:600,lineHeight:1,color:C.text,fontVariantNumeric:"tabular-nums"}}>{m.value}</span></div>
              <div style={{fontSize:12,color:C.muted,marginTop:6}}>{m.sub}</div>
            </button>
          ))}
        </div>
      </Card>
    )},
    clinicDay:   {title:"Clinic day",         el:(
          <Card>
            <CardHead title="Clinic day"/>
            <Timeline steps={[
              {title:"Clinic opened",time:"08:00",meta:firstIn?`${firstIn.name} signed in first, ${firstIn.lastLogin.slice(11)}`:null,done:true},
              {title:"Morning session",time:"08:00–12:00",meta:`${morning.filter(a=>a.status==="completed").length} done · ${morning.filter(a=>["checked-in","with-nurse","in-progress"].includes(a.status)).length} in clinic · ${morning.filter(a=>a.status==="scheduled").length} to arrive`,current:toMin(NOW)<toMin("12:00"),done:toMin(NOW)>=toMin("12:00")},
              {title:"Afternoon session",time:"12:00–17:00",meta:`${afternoon.length} booked${lateStarters.length?` · ${lateStarters.map(s=>s.staffName).join(", ")} starts ${lateStarters[0].startTime}`:""}`,current:toMin(NOW)>=toMin("12:00")&&toMin(NOW)<toMin("17:00"),done:toMin(NOW)>=toMin("17:00")},
              {title:"End-of-day close",time:"17:00",meta:"Reconcile visits, follow up no-shows",done:false},
            ]}/>
          </Card>
    )},
    tasks:       {title:"Open tasks",         el:<TasksWidget tasks={tasks} setPage={setPage} today={TODAY}/>},
    appointments:{title:"Appointments today", el:(
        <Card>
          <CardHead title="Appointments today" meta={`${completed.length} of ${todayAppts.length} done · ${noShows.length} no-show${noShows.length!==1?"s":""}`} action="All appointments" onAction={()=>setPage("appointments")}/>
          <ApptTable rows={todayAppts}/>
          {offShift.length>0&&(
            <div style={{padding:"0 20px 20px"}}>
              <Alert tone="red" title={`${offShift.length} visit${offShift.length>1?"s":""} booked after the doctor's shift ends`}
                actions={<><PB onClick={()=>setPage("appointments")}>Reassign visit</PB><XB onClick={()=>setPage("staffschedule")}>Extend shift</XB></>}>
                {offShift.map(a=>{const sh=shiftOf(a.doctor);return `${a.patient} at ${a.time} with ${a.doctor}${sh?`, who leaves at ${sh.endTime}`:", who isn't on shift"}`;}).join("; ")}
              </Alert>
            </div>
          )}
        </Card>
    )},
    staff:       {title:"Staff activity",     el:(
        <Card>
          <CardHead title="Staff activity" meta={`${STAFF_LIST.filter(s=>s.lastLogin.startsWith(TODAY)).length} signed in today`} action="Schedule" onAction={()=>setPage("staffschedule")}/>
          {STAFF_LIST.map(s=>{const sh=onShift.find(x=>x.staffId===s.id);return(
            <div key={s.id} onClick={()=>setPage("staffschedule")} className="row-link" style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:12,borderTop:`1px solid ${C.border}`}}>
              <span style={{width:28,height:28,borderRadius:"50%",background:C.raised,border:`1px solid ${C.border}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,flexShrink:0}}>{initials(s.name)}</span>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,color:s.status==="active"?C.text:C.muted}}>{s.name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{sh?<span style={{fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{sh.startTime}–{sh.endTime}</span>:"Off today"}</div></div>
              {s.status==="active"?<Dot color={s.lastLogin.startsWith(TODAY)?C.green:C.inactive}/>:<Badge color="neutral">Inactive</Badge>}
            </div>
          );})}
        </Card>
    )},
    supplies:    {title:"Supplies to watch",  el:(
        <Card>
          <CardHead title="Supplies to watch" meta="Lowest against reorder level" action="Inventory" onAction={()=>setPage("inventory")}/>
          {watch.map(i=>{const low=i.qty<=i.reorderAt;return(
            <div key={i.id} style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:12,borderTop:`1px solid ${C.border}`}}>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{i.name}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}><span style={{fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{i.qty}</span> {i.unit} · reorder at {i.reorderAt}</div></div>
              <Badge color={low?"red":"neutral"}>{low?"Reorder":"OK"}</Badge>
            </div>
          );})}
        </Card>
    )},
  };
  return(
    <DashboardLayout storageKey={dashKey} legacyKey={r===user.role?`medplus.dashboard.${r}`:undefined} canCustomise={canCustomise} panels={panels} defaults={ADMIN_DASH_DEFAULT}
      header={customize=>(<>
      <PageHeader title={new Date(TODAY+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
        status={<Badge color={attention?"amber":"green"}>{attention?`${attention} need${attention===1?"s":""} attention`:"Running smoothly"}</Badge>}
        meta={`Clinic overview · Open 08:00–17:00 · Updated ${NOW}`}
        actions={<>{customize}<XB onClick={()=>setPage("reports")}>Reports</XB><PB onClick={()=>setPage("staffschedule")}>Staff schedule</PB></>}/>

      {lowStock.length>0&&<Alert tone="red" title={`${lowStock.length} supplies at or below reorder level`} meta={lowStock.map(i=>i.name).join(", ")} onClick={()=>setPage("inventory")} style={{marginBottom:12}}/>}
      </>)}/>
  );
}

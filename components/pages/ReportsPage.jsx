import React from "react";
import { CalendarDays, Users, BellRing, CalendarX2 } from "lucide-react";
import { getWeekDates } from "./AppointmentsPage";
import { C, Card, CardHead, Dot, Grid, PageHeader, PageWrap, StatCard } from "../ui";

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
export function BarChart({data,color=C.navyMid,maxVal}){
  const max=maxVal||Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120,padding:"0 4px"}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <div style={{fontSize:11,fontWeight:600,color:C.text}}>{d.value||""}</div>
          <div style={{width:"100%",background:color,borderRadius:"3px 3px 0 0",height:`${(d.value/max)*90}px`,minHeight:d.value?4:0,transition:"height 300ms var(--ease)"}}/>
          <div style={{fontSize:11,color:C.muted,textAlign:"center",lineHeight:1.2}}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}
export function HBarChart({data}){
  const max=Math.max(...data.map(d=>d.value),1);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {data.map((d,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:120,fontSize:12,color:C.text2,textAlign:"right",flexShrink:0,textTransform:"capitalize"}}>{d.label}</div>
          <div style={{flex:1,background:C.raised,borderRadius:4,overflow:"hidden",height:20}}>
            <div style={{width:`${(d.value/max)*100}%`,background:d.color||C.navyMid,height:"100%",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:6,minWidth:d.value?20:0}}>
              <span style={{fontSize:11,fontWeight:600,color:C.onAccent}}>{d.value}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export function ReportsPage({appts,recalls,patients}){
  const weekDays=["Mon","Tue","Wed","Thu","Fri"];
  const weekDates=getWeekDates("2026-02-25");
  const apptsByDay=weekDates.map((d,i)=>({label:weekDays[i],value:appts.filter(a=>(a.date||"2026-02-25")===d).length}));
  const noShowCount=appts.filter(a=>a.status==="no-show").length;
  const noShowRate=appts.length?Math.round((noShowCount/appts.length)*100):0;
  const typeCount={};appts.forEach(a=>{typeCount[a.type]=(typeCount[a.type]||0)+1;});
  const topTypes=Object.entries(typeCount).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([k,v])=>({label:k.replace(/-/g," "),value:v,color:C.navyMid}));
  const recallByUrgency=[
    {label:"Overdue",  value:recalls.filter(r=>r.urgency==="high").length,   color:C.red},
    {label:"This week",value:recalls.filter(r=>r.urgency==="medium").length, color:C.amber},
    {label:"Upcoming", value:recalls.filter(r=>r.urgency==="low").length,    color:C.green},
  ];
  const completedCount=appts.filter(a=>a.status==="completed").length;
  return(
    <PageWrap>
      <PageHeader title="Reports" meta="Clinic performance · week of Feb 23, 2026"/>
      <Grid cols="repeat(4,minmax(0,1fr))">
        <StatCard icon={CalendarDays} label="Total appointments" value={appts.length} sub="All time"/>
        <StatCard icon={CalendarX2} label="No-show rate" value={`${noShowRate}%`} dot={noShowRate>10?C.red:C.green} sub="Target below 10%"/>
        <StatCard icon={BellRing} label="Open recalls" value={recalls.length} sub="Awaiting contact"/>
        <StatCard icon={Users} label="Active patients" value={patients.filter(p=>p.active!==false).length} sub={`${patients.length} registered`}/>
      </Grid>
      <Grid cols="minmax(0,1fr) minmax(0,1fr)">
        <Card><CardHead title="Appointments this week" meta="By day, Feb 23–27"/><div style={{padding:"4px 20px 20px"}}><BarChart data={apptsByDay} color={C.navyMid}/></div></Card>
        <Card><CardHead title="Appointment types" meta="All time"/><div style={{padding:"4px 20px 20px"}}><HBarChart data={topTypes}/></div></Card>
      </Grid>
      <Grid cols="minmax(0,1fr) minmax(0,1fr)" style={{marginBottom:0}}>
        <Card><CardHead title="Recalls by urgency" meta="Current open recalls"/><div style={{padding:"4px 20px 20px"}}><HBarChart data={recallByUrgency}/></div></Card>
        <Card>
          <CardHead title="No-shows" meta="Share of all appointments"/>
          <div style={{padding:"4px 20px 20px",display:"flex",gap:24,alignItems:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:`conic-gradient(${C.red} 0% ${noShowRate}%,${C.raised} ${noShowRate}% 100%)`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:60,height:60,borderRadius:"50%",background:C.surface,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{fontSize:16,fontWeight:600,color:C.text,fontVariantNumeric:"tabular-nums"}}>{noShowRate}%</div>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:13,color:C.text2}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><Dot color={C.red}/>No-shows: {noShowCount}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}><Dot color={C.inactive}/>Completed: {completedCount}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4}}>Target: below 10%</div>
            </div>
          </div>
        </Card>
      </Grid>
    </PageWrap>
  );
}

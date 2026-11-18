import React from "react";
import { Plus, LayoutDashboard, CalendarDays, Columns3, Users, Pill, BellRing, ChartColumn, ListChecks, Package, CalendarClock, ShieldCheck, Briefcase, Stethoscope, HeartPulse, CalendarCheck, Check, Timer, ClipboardList, X, Lock, ChevronRight, CircleAlert, CircleCheck, Database, ScrollText, UserCog } from "lucide-react";

export const AdminMark=()=><span title="Has admin access" style={{display:"inline-flex",alignItems:"center",gap:4,height:18,padding:"0 6px",borderRadius:4,fontSize:11,fontWeight:500,color:C.text,background:C.raised,border:`1px solid ${C.border}`,verticalAlign:"middle"}}><ShieldCheck size={11} strokeWidth={2} aria-hidden="true"/>Admin</span>;
export const C = {
  bg:"var(--c-bg)", surface:"var(--c-surface)", border:"var(--c-border)",
  navy:"var(--c-navy)", navyMid:"var(--c-navymid)", teal:"var(--c-teal)",
  text:"var(--c-text)", muted:"var(--c-muted)",
  green:"var(--c-green)", greenBg:"var(--c-greenbg)",
  red:"var(--c-red)",     redBg:"var(--c-redbg)",
  amber:"var(--c-amber)", amberBg:"var(--c-amberbg)",
  blue:"var(--c-blue)",   blueBg:"var(--c-bluebg)",
  purple:"var(--c-purple)",purpleBg:"var(--c-purplebg)",
  navyBg:"var(--c-navybg)", tealBg:"var(--c-tealbg)",
  raised:"var(--c-raised)", border2:"var(--c-border2)", text2:"var(--c-text2)", onAccent:"var(--c-on-accent)",
  accentHover:"var(--c-accent-hover)", disabled:"var(--c-disabled)", inactive:"var(--c-inactive)",
  skeleton:"var(--c-skeleton)", overlay:"var(--c-overlay)",
  mono:"var(--font-mono), ui-monospace, monospace",
};
export const RC = { admin:{bg:C.purpleBg,fg:C.purple}, doctor:{bg:C.blueBg,fg:C.blue}, nurse:{bg:C.greenBg,fg:C.green}, receptionist:{bg:C.amberBg,fg:C.amber} };
// Line icons (lucide): one set, 16px, 1.5 stroke, coloured by their text role
export const ROLE_ICON = { admin:Briefcase, doctor:Stethoscope, nurse:HeartPulse, receptionist:CalendarCheck };
export const NAV_ICON = { dashboard:LayoutDashboard, appointments:CalendarDays, flow:Columns3, patients:Users, refills:Pill, recalls:BellRing, reports:ChartColumn, tasks:ListChecks, inventory:Package, staffschedule:CalendarClock, admin:ShieldCheck, overview:LayoutDashboard, accounts:UserCog, audit:ScrollText, backup:Database };
export const Icon=({as:I,size=16,style})=><I size={size} strokeWidth={1.5} aria-hidden="true" style={{flexShrink:0,...style}}/>;
// Logo: a flat plus in ink next to the wordmark. No gradient, no glow.
export const Logo=({size=28,wordSize=16,color})=>(
  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
    <div style={{width:size,height:size,borderRadius:6,background:C.navyMid,color:C.onAccent,display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={size*0.6} strokeWidth={2.5} aria-hidden="true"/></div>
    <div style={{fontWeight:600,fontSize:wordSize,color:color||C.text}}>Med+</div>
  </div>
);

// Status pill: a coloured dot, dark text, a faint tint of the status colour behind it.
// Colour sits in the dot; the words do the work. "neutral" has no dot.
export const BADGE_TONE={green:C.green,red:C.red,amber:C.amber,blue:C.blue,teal:C.teal,purple:C.purple,navy:C.muted,neutral:null};
export const Badge=({color="blue",children,dot=true})=>{
  const fg=BADGE_TONE[color]===undefined?C.blue:BADGE_TONE[color];
  // Sentence case: capitalise only the first letter of plain-text labels
  const label=typeof children==="string"&&children?children.charAt(0).toUpperCase()+children.slice(1):children;
  return(
    <span style={{display:"inline-flex",alignItems:"center",gap:6,height:22,padding:"0 8px",borderRadius:4,fontSize:12,fontWeight:500,lineHeight:1,whiteSpace:"nowrap",color:C.text,
      background:fg?`color-mix(in srgb, ${fg} 7%, var(--c-surface))`:C.raised,
      border:`1px solid ${fg?`color-mix(in srgb, ${fg} 14%, var(--c-surface))`:C.border}`}}>
      {fg&&dot&&<span aria-hidden="true" style={{width:6,height:6,borderRadius:"50%",background:fg,flexShrink:0}}/>}
      {label}
    </span>
  );
};
// Status dot with a value next to it (status tiles, key-value grids)
export const Dot=({color,size=8})=><span aria-hidden="true" style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:color,flexShrink:0}}/>;
// Transparent tint of any colour, including CSS variables (hex+alpha strings don't work on var(--…))
export const tint=(color,pct)=>`color-mix(in srgb, ${color} ${pct}%, transparent)`;
// Status colours: one colour per visit status, used everywhere a status shows
export const STATUS_TONE={scheduled:C.blue,"checked-in":C.teal,"with-nurse":C.purple,"in-progress":C.amber,completed:C.green,"no-show":C.red};
// ─── Vitals: the patient chart's moment ─────────────────────────────────────
// Display ranges for adult vitals: the shaded band is "in range", the track is the scale drawn.
export const VITAL_SCALE={
  bp:    {label:"Blood pressure",unit:"mmHg",min:80, max:180,lo:90,  hi:129, read:v=>parseFloat(String(v).split("/")[0]), status:v=>{const[sy,di]=String(v).split("/").map(Number);return sy>=140||di>=90?"high":sy>=130||di>=80?"above":sy<90?"low":"ok";}},
  hr:    {label:"Heart rate",    unit:"bpm", min:40, max:140,lo:60,  hi:100},
  temp:  {label:"Temperature",   unit:"°F",  min:95, max:104,lo:97,  hi:99.5, high:100.4},
  o2:    {label:"O₂ saturation", unit:"%",   min:85, max:100,lo:95,  hi:100, low:90},
  weight:{label:"Weight",        unit:"lbs"},
  bmi:   {label:"BMI",           unit:"",    min:15, max:40, lo:18.5,hi:24.9, high:30},
};
export const VITAL_WORD={ok:["In range",C.green],above:["Above range",C.amber],high:["High",C.red],low:["Low",C.amber],verylow:["Low",C.red]};
export function vitalStatus(key,val){
  const sc=VITAL_SCALE[key]; if(!sc||sc.min==null||val==null||val==="")return null;
  if(sc.status)return sc.status(val);
  const n=parseFloat(val); if(isNaN(n))return null;
  if(sc.low!=null&&n<sc.low)return "verylow";
  if(n<sc.lo)return "low";
  if(sc.high!=null&&n>=sc.high)return "high";
  if(n>sc.hi)return "above";
  return "ok";
}
export function VitalReadout({k,value,compact}){
  const sc=VITAL_SCALE[k]; const st=vitalStatus(k,value); const [word,col]=st?VITAL_WORD[st]:[null,C.muted];
  const n=sc.read?sc.read(value):parseFloat(value);
  const pos=v=>`${Math.max(0,Math.min(100,(v-sc.min)/(sc.max-sc.min)*100))}%`;
  return(
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:compact?12:16,minWidth:0}}>
      <div style={{fontSize:12,color:C.text2,display:"flex",justifyContent:"space-between",gap:8}}><span>{sc.label}</span>{word&&!compact&&<span style={{color:col,fontWeight:500}}>{word}</span>}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:4,marginTop:compact?4:8}}>
        <span style={{fontFamily:C.mono,fontSize:compact?20:28,fontWeight:500,color:C.text,fontVariantNumeric:"tabular-nums",letterSpacing:"-0.02em"}}>{value??"—"}</span>
        <span style={{fontSize:12,color:C.muted}}>{sc.unit}</span>
        {compact&&word&&<span title={word} style={{marginLeft:"auto",width:8,height:8,borderRadius:"50%",background:col,alignSelf:"center"}}/>}
      </div>
      {!compact&&(sc.min!=null&&!isNaN(n)?(
        <div aria-hidden="true" style={{position:"relative",height:6,marginTop:12,borderRadius:3,background:C.raised}}>
          <div style={{position:"absolute",top:0,bottom:0,left:pos(sc.lo),width:`calc(${pos(sc.hi)} - ${pos(sc.lo)})`,background:tint(C.green,25),borderRadius:3}}/>
          <div style={{position:"absolute",top:-3,left:pos(n),width:12,height:12,marginLeft:-6,borderRadius:"50%",background:col,border:`2px solid ${C.surface}`}}/>
        </div>
      ):<div style={{height:6,marginTop:12}}/>)}
    </div>
  );
}

// Visit stages in order, as the Patient Flow board shows them
export const FLOW_STAGES=[
  {id:"scheduled",   label:"Scheduled",   color:C.blue,   empty:"No one left to arrive",     Icon:CalendarDays},
  {id:"checked-in",  label:"Checked in",  color:C.teal,   empty:"No one in the waiting room", Icon:ClipboardList},
  {id:"with-nurse",  label:"With nurse",  color:C.purple, empty:"No one with a nurse",        Icon:HeartPulse},
  {id:"in-progress", label:"With doctor", color:C.amber,  empty:"No one with a doctor",       Icon:Stethoscope},
  {id:"completed",   label:"Done",        color:C.green,  empty:"No visits finished yet",     Icon:Check},
];
// Signature: a coloured chart-tab on the left edge of a patient row, the colour of its visit status
export const statusTab=(status)=>({boxShadow:`inset 3px 0 0 ${STATUS_TONE[status]||C.border}`});
// Times and record numbers set in mono with even figures
export const TimeCell=({children,width=48})=><div style={{width,flexShrink:0,fontFamily:C.mono,fontSize:13,color:C.text2,fontVariantNumeric:"tabular-nums"}}>{children}</div>;
// Dashboard title: the day, not a greeting. The subline says whose view it is and the one fact that matters.
export const DashHeader=({date,sub,title,actions,status})=>{
  const d=new Date(date+"T12:00:00");
  const day=d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  return <PageHeader title={title||day} status={status} meta={title?`${day} · ${sub}`:sub} actions={actions}/>;
};
export const SB=({status})=>{const m={"checked-in":["teal","Checked in"],"in-progress":["amber","With doctor"],"with-nurse":["purple","With nurse"],scheduled:["blue","Scheduled"],completed:["green","Completed"],"no-show":["red","No-show"]};const[c,l]=m[status]||["blue",status];return <Badge color={c}>{l}</Badge>;};
// Visit type is a category, not a status: neutral, except urgent visits
export const TB=({type})=><Badge color={type==="urgent"?"red":"neutral"}>{type.replace(/-/g," ")}</Badge>;
export const Card=({children,style={},onClick,...rest})=><div onClick={onClick} className={onClick?"card-link":undefined} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-sm)",...style}} {...rest}>{children}</div>;
// Card title row: title (and an optional count/meta), an action link on the right. No rule under it.
export const CardHead=({title,meta,action,onAction,children})=>(
  <div style={{padding:"16px 20px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
    <div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>{title}</div>{meta&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{meta}</div>}</div>
    {children}{action&&<button className="text-link" onClick={onAction} style={{fontSize:12,flexShrink:0}}>{action}</button>}
  </div>
);
// Page header: title, optional status pill, one grey meta line; actions on the right
export const H1={fontSize:24,fontWeight:600,color:C.text,margin:0,letterSpacing:"-0.01em",lineHeight:1.25};
export const SUB={color:C.muted,fontSize:13,marginTop:4};
export const PageHeader=({title,status,meta,actions,style})=>(
  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:20,flexWrap:"wrap",...style}}>
    <div style={{minWidth:0}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}><h1 style={H1}>{title}</h1>{status}</div>
      {meta&&<p style={SUB}>{meta}</p>}
    </div>
    {actions&&<div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>{actions}</div>}
  </div>
);
// Stat tile: icon + label, then the value (with a status dot when it means something), then context
export const StatCard=({label,value,sub,tone,onClick,icon,dot})=>{
  const hot=tone==="red"&&Number(value)>0;
  return(
    <Card onClick={onClick} style={{padding:"16px 20px",cursor:onClick?"pointer":undefined,minWidth:0}}>
      <div style={{display:"flex",alignItems:"center",gap:8,color:C.text2,fontSize:13,fontWeight:500}}>{icon&&<Icon as={icon} size={18} style={{color:C.text}}/>}<span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{label}</span></div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:12}}>
        {(dot||hot)&&<Dot color={dot||C.red}/>}
        <span style={{fontSize:22,fontWeight:600,lineHeight:1,color:C.text,fontVariantNumeric:"tabular-nums"}}>{value}</span>
      </div>
      {sub&&<div style={{color:C.muted,fontSize:12,marginTop:8}}>{sub}</div>}
    </Card>
  );
};
// Key-value grid with hairline dividers (reference: "Asset information")
export const KVGrid=({items,cols=4})=>(
  <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,margin:"0 20px"}}>
    {items.map(([k,v],i)=>(
      <div key={k} style={{padding:"12px 16px",paddingLeft:i%cols===0?0:16,borderLeft:i%cols===0?"none":`1px solid ${C.border}`,borderTop:i>=cols?`1px solid ${C.border}`:"none",minWidth:0}}>
        <div style={{fontSize:12,color:C.muted}}>{k}</div>
        <div style={{fontSize:15,color:C.text,marginTop:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v}</div>
      </div>
    ))}
  </div>
);
// Alert: only for things that need someone now. Tinted surface, solid status icon, plain text.
export const Alert=({tone="red",title,meta,onClick,actions,children,style})=>{
  const fg=tone==="amber"?C.amber:tone==="green"?C.green:C.red;
  const AlertIcon=tone==="green"?CircleCheck:CircleAlert;
  return(
    <div role="status" onClick={onClick} className={onClick?"row-link":undefined} style={{background:`color-mix(in srgb, ${fg} 6%, var(--c-surface))`,border:`1px solid color-mix(in srgb, ${fg} 16%, var(--c-surface))`,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:actions||children?"flex-start":"center",gap:12,cursor:onClick?"pointer":undefined,...style}}>
      <AlertIcon size={20} strokeWidth={2} aria-hidden="true" style={{color:fg,flexShrink:0,marginTop:actions||children?1:0}}/>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,color:C.text}}><span style={{fontWeight:600}}>{title}</span>{meta&&<span style={{color:C.muted}}> · {meta}</span>}</div>
        {children&&<div style={{fontSize:13,color:C.text2,marginTop:4}}>{children}</div>}
        {actions&&<div style={{display:"flex",alignItems:"center",gap:12,marginTop:12,flexWrap:"wrap"}}>{actions}</div>}
      </div>
      {onClick&&<ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" style={{color:C.text,flexShrink:0}}/>}
    </div>
  );
};
// Timeline: filled check circles for done steps, an outlined circle for what's next
export const Timeline=({steps})=>(
  <ol style={{listStyle:"none",margin:0,padding:"4px 20px 16px"}}>
    {steps.map((st,i)=>(
      <li key={i} style={{display:"flex",gap:12,position:"relative",paddingBottom:i<steps.length-1?16:0}}>
        {i<steps.length-1&&<span aria-hidden="true" style={{position:"absolute",left:9,top:20,bottom:0,width:2,background:st.done?C.navyMid:C.border}}/>}
        <span aria-hidden="true" style={{width:20,height:20,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:st.done?C.navyMid:C.surface,border:`2px solid ${st.done?C.navyMid:st.current?C.text:C.border2}`,color:C.onAccent}}>{st.done&&<Check size={12} strokeWidth={3}/>}</span>
        <div style={{minWidth:0}}>
          <div style={{fontSize:14,fontWeight:500,color:st.done||st.current?C.text:C.muted}}>{st.title}</div>
          {st.time&&<div style={{fontSize:12,color:C.muted,marginTop:2,fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{st.time}</div>}
          {st.meta&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{st.meta}</div>}
        </div>
      </li>
    ))}
  </ol>
);
export const Locked=({msg})=>(
  <div style={{padding:"24px 32px"}}>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"56px 32px",textAlign:"center",maxWidth:480,margin:"0 auto"}}>
      <Lock size={32} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,marginBottom:16}}/>
      <div style={{fontWeight:600,fontSize:16,color:C.text,marginBottom:8}}>Access restricted</div>
      <div style={{color:C.muted,fontSize:14}}>{msg||"Your role doesn't have access to this section."}</div>
    </div>
  </div>
);

export function Modal({title,onClose,children,width=560}){
  return(
    <div style={{position:"fixed",inset:0,background:C.overlay,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
      <div role="dialog" aria-modal="true" aria-label={typeof title==="string"?title:undefined} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto",boxShadow:"var(--shadow-lg)",animation:"rise 220ms var(--ease)"}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.surface,zIndex:1}}>
          <div style={{fontWeight:600,fontSize:16,color:C.text}}>{title}</div>
          <button onClick={onClose} aria-label="Close" className="icon-btn" style={{width:32,height:32,border:"none",borderRadius:6,cursor:"pointer",color:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={18} strokeWidth={1.5} aria-hidden="true"/></button>
        </div>
        <div style={{padding:"24px"}}>{children}</div>
      </div>
    </div>
  );
}

export const IS={width:"100%",padding:"8px 12px",lineHeight:"18px",borderRadius:6,border:`1px solid ${C.border2}`,fontSize:14,color:C.text,outline:"none",background:C.surface,boxSizing:"border-box",fontFamily:"inherit"};
export const SS={...IS,appearance:"none",cursor:"pointer"};
export const LS={display:"block",fontSize:13,fontWeight:500,color:C.text2,marginBottom:6};
export const FF=({label,children})=><div><label style={LS}>{label}</label>{children}</div>;
export const FR=({children,cols=2})=><div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:16,marginBottom:16}}>{children}</div>;
export const OK=({msg})=><Alert tone="green" title={msg} style={{marginBottom:20}}/>;
export const PB=({onClick,children,disabled})=>(<button onClick={onClick} disabled={disabled} className="btn btn-primary">{children}</button>);
export const XB=({onClick,children})=>(<button onClick={onClick} className="btn btn-secondary">{children}</button>);
export function LoadingButton({onClick,children,disabled,loading,style}){
  return(
    <button
      onClick={onClick}
      disabled={disabled||loading}
      aria-busy={loading||undefined}
      className="btn btn-primary"
      style={style}
    >
      {loading&&<span className="spinner"/>}
      {children}
    </button>
  );
}

// ─── Insurance badge map + component ────────────────────────────────────────
export const INSURANCE_BADGES = {
  "BlueCross":    { abbr:"BC" },
  "Medicare":     { abbr:"MC" },
  "Medicaid":     { abbr:"MD" },
  "Aetna":        { abbr:"AET" },
  "UnitedHealth": { abbr:"UHC" },
  "Cigna":        { abbr:"CGN" },
  "Humana":       { abbr:"HUM" },
  "Kaiser":       { abbr:"KP" },
};

export function InsuranceBadge({ insurance }) {
  if (!insurance) return <span style={{ fontSize: 12, color: "var(--c-muted)" }}>—</span>;
  const found = Object.entries(INSURANCE_BADGES).find(([key]) =>
    insurance.toLowerCase().includes(key.toLowerCase())
  );
  const abbr = found ? found[1].abbr : insurance.slice(0, 3).toUpperCase();
  // Carriers are not statuses, so the badge stays neutral: a quiet code in mono.
  const color = C.text2;
  const bg    = C.raised;
  return (
    <span
      title={insurance}
      style={{
        display: "inline-block",
        background: bg,
        color: color,
        fontFamily: C.mono,
        fontWeight: 500,
        fontSize: 11,
        padding: "2px 6px",
        borderRadius: 4,
        whiteSpace: "nowrap",
        cursor: "default",
      }}
    >
      {abbr}
    </span>
  );
}

// ─── TimeInStage component ────────────────────────────────────────────────────
export function TimeInStage({ stageEnteredAt }) {
  if (!stageEnteredAt) return null;
  const entered = new Date(stageEnteredAt.replace(" ", "T"));
  // Use a fixed reference time matching demo date (2026-02-25 10:00) for consistent display
  const refNow = new Date("2026-02-25T10:10:00");
  const diffMs = refNow - entered;
  const diffMin = Math.max(0, Math.floor(diffMs / 60000));
  let label, color;
  if (diffMin < 5)       { label = "< 5 min";         color = "var(--c-green)"; }
  else if (diffMin < 15) { label = `${diffMin} min`;  color = "var(--c-green)"; }
  else if (diffMin < 30) { label = `${diffMin} min`;  color = "var(--c-amber)"; }
  else                   { label = `${diffMin} min`;  color = "var(--c-red)"; }
  return (
    <div title="Time in this stage" style={{ fontSize: 12, color, fontWeight: 500, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
      <Timer size={12} strokeWidth={1.5} aria-hidden="true"/><span style={{ fontFamily: C.mono, fontVariantNumeric: "tabular-nums" }}>{label}</span>
    </div>
  );
}

// ─── Staff avatar helper ────────────────────────────────────────────────────
export function StaffAvatar({ name, role, size=32, fontSize=12 }) {
  const ini = name.split(" ").filter(w => !w.startsWith("Dr.")).map(w => w[0]).join("").slice(0,2);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: C.raised, border: `1px solid ${C.border}`, color: C.text2,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 500, flexShrink: 0,
    }}>{ini}</div>
  );
}

export const PageWrap=({children,max=1440})=><div style={{padding:"24px 32px 48px",maxWidth:max}}>{children}</div>;
// Segmented control: one neutral style for every view switch and filter in the app
export function Segmented({options,value,onChange,size="md"}){
  return(
    <div role="tablist" style={{display:"inline-flex",gap:2,padding:2,background:C.raised,border:`1px solid ${C.border}`,borderRadius:6,flexWrap:"wrap"}}>
      {options.map(([id,label,I,count])=>{const a=value===id;return(
        <button key={id} role="tab" aria-selected={a} onClick={()=>onChange(id)} style={{height:size==="sm"?26:30,padding:"0 12px",border:"none",borderRadius:4,background:a?C.surface:"transparent",boxShadow:a?`0 0 0 1px ${C.border}`:"none",color:a?C.text:C.text2,fontSize:13,fontWeight:a?500:400,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,fontFamily:"inherit",whiteSpace:"nowrap"}}>
          {I&&<Icon as={I} size={14}/>}{label}{count>0&&<span style={{fontSize:11,color:C.muted,fontVariantNumeric:"tabular-nums"}}>{count}</span>}
        </button>
      );})}
    </div>
  );
}
export const Grid=({cols,children,style})=><div style={{display:"grid",gridTemplateColumns:cols,gap:12,marginBottom:12,alignItems:"start",...style}}>{children}</div>;

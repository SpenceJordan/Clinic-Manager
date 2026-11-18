import React, { useState } from "react";
import { Plus, ShieldCheck, CircleCheck } from "lucide-react";
import { permsFor } from "../lib/accounts";
import { INIT_SETTINGS } from "../lib/data";
import { fmt } from "../lib/utils";
import { Badge, C, Card, CardHead, IS, Icon, LS, LoadingButton, PageHeader, SS, XB } from "../ui";

export function SettingsPage({user,settings,setSettings,setPage,blockTimes,setBlockTimes,themePref,setThemePref}){
  const[saved,setSaved]=useState(false);
  const[savingSettings,setSavingSettings]=useState(false);
  const[local,setLocal]=useState(settings||INIT_SETTINGS);
  const[btForm,setBtForm]=useState({doctor:"Dr. Priya Patel",date:"",from:"",to:"",reason:"Lunch"});
  const s=(k,v)=>setLocal(p=>({...p,[k]:v}));
  const save=()=>{
    setSavingSettings(true);
    setTimeout(()=>{
      setSettings(local);
      setSavingSettings(false);
      setSaved(true);
      setTimeout(()=>setSaved(false),2500);
    },700);
  };
  const addBlockTime=()=>{
    if(!btForm.date||!btForm.from||!btForm.to)return;
    if(setBlockTimes)setBlockTimes(prev=>[...prev,{...btForm,id:Date.now()}]);
    setBtForm({doctor:"Dr. Priya Patel",date:"",from:"",to:"",reason:"Lunch"});
  };
  const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const lbl=LS;
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:860}}>
      <PageHeader title="Settings" meta={permsFor(user).admin?"Clinic details, hours and preferences":"Your preferences"}/>
      {permsFor(user).admin&&(
        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px 20px",marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
          <Icon as={ShieldCheck} size={20} style={{color:C.text}}/>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:C.text}}>Admin panel</div><div style={{fontSize:13,color:C.muted,marginTop:2}}>Staff accounts, audit log and backups live in the admin panel.</div></div>
          <XB onClick={()=>setPage("admin")}>Open admin panel</XB>
        </div>
      )}
      <Card style={{marginBottom:12}}>
        <CardHead title="Clinic information"/>
        <div style={{padding:"4px 20px 20px"}}>
          <div style={{marginBottom:16}}><label style={lbl}>Clinic name</label><input value={local.clinicName} onChange={e=>s("clinicName",e.target.value)} style={IS}/></div>
          <div style={{marginBottom:16}}><label style={lbl}>Address</label><input value={local.address} onChange={e=>s("address",e.target.value)} style={IS}/></div>
          <div style={{marginBottom:6}}><label style={lbl}>Phone</label><input value={local.phone} onChange={e=>s("phone",e.target.value)} style={IS}/></div>
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <CardHead title="Scheduling defaults"/>
        <div style={{padding:"4px 20px 20px"}}>
          <div style={{marginBottom:6}}><label style={lbl}>Default appointment length</label>
            <select value={local.defaultDuration} onChange={e=>s("defaultDuration",parseInt(e.target.value))} style={{...SS,maxWidth:200}}>
              {[15,20,30,45,60].map(d=><option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <CardHead title="Clinic hours"/>
        <div style={{padding:"4px 20px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr",gap:"8px 12px",alignItems:"center"}}>
            <div style={{fontSize:12,color:C.muted}}>Day</div>
            <div style={{fontSize:12,color:C.muted}}>Open</div>
            <div style={{fontSize:12,color:C.muted}}>Close</div>
            {DAYS.map(day=>[
              <div key={day+"-d"} style={{fontSize:13,fontWeight:500,color:C.text}}>{day}</div>,
              <input key={day+"-o"} type="time" value={(local.clinicHours||{})[day]?.[0]||""} onChange={e=>s("clinicHours",{...local.clinicHours,[day]:[e.target.value,local.clinicHours[day]?.[1]||""]})} style={{...IS,fontSize:13}}/>,
              <input key={day+"-c"} type="time" value={(local.clinicHours||{})[day]?.[1]||""} onChange={e=>s("clinicHours",{...local.clinicHours,[day]:[local.clinicHours[day]?.[0]||"",e.target.value]})} style={{...IS,fontSize:13}}/>,
            ])}
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <CardHead title="Notification preferences"/>
        <div style={{padding:"4px 20px 20px"}}>
          {[["messages","New message notifications"],["recalls","Urgent recall alerts"]].map(([key,label])=>(
            <label key={key} style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,cursor:"pointer"}}>
              <input type="checkbox" checked={local.notifications?.[key]??true} onChange={e=>s("notifications",{...local.notifications,[key]:e.target.checked})} style={{width:16,height:16,cursor:"pointer",accentColor:"var(--c-navymid)"}}/>
              <div><div style={{fontSize:14,color:C.text}}>{label}</div></div>
            </label>
          ))}
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <CardHead title="Appearance"/>
        <div style={{padding:"4px 20px 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:16}}>
            <div>
              <div style={{fontSize:13,fontWeight:500,color:C.text}}>Theme</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>Device follows your computer's light or dark setting</div>
            </div>
            <div role="radiogroup" aria-label="Theme" style={{display:"flex",gap:2,padding:2,background:C.raised,border:`1px solid ${C.border}`,borderRadius:6,flexShrink:0}}>
              {[["system","Device"],["light","Light"],["dark","Dark"]].map(([id,label])=>{
                const on=themePref===id;
                return <button key={id} role="radio" aria-checked={on} onClick={()=>setThemePref(id)} style={{height:30,padding:"0 12px",border:"none",borderRadius:4,fontSize:13,fontWeight:on?500:400,fontFamily:"inherit",cursor:"pointer",background:on?C.surface:"transparent",color:on?C.text:C.text2,boxShadow:on?`0 0 0 1px ${C.border}`:"none"}}>{label}</button>;
              })}
            </div>
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <CardHead title="Change password"/>
        <div style={{padding:"4px 20px 20px"}}>
          {["Current password","New password","Confirm new password"].map(l=><div key={l} style={{marginBottom:16}}><label style={lbl}>{l}</label><input type="password" style={IS}/></div>)}
          <button className="btn btn-primary">Update password</button>
        </div>
      </Card>
      {permsFor(user).admin&&(
        <Card style={{marginBottom:12}}>
          <CardHead title="Blocked time" meta="Lunch, meetings and leave that can't be booked"/>
          <div style={{padding:"4px 20px 20px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr auto",gap:10,marginBottom:16,alignItems:"flex-end"}}>
              <div><label style={lbl}>Doctor</label><select value={btForm.doctor} onChange={e=>setBtForm(f=>({...f,doctor:e.target.value}))} style={{...SS,fontSize:13}}>
                <option>Dr. Priya Patel</option><option>Dr. Owen Williams</option>
              </select></div>
              <div><label style={lbl}>Date</label><input type="date" value={btForm.date} onChange={e=>setBtForm(f=>({...f,date:e.target.value}))} style={{...IS,fontSize:13}}/></div>
              <div><label style={lbl}>From</label><input type="time" value={btForm.from} onChange={e=>setBtForm(f=>({...f,from:e.target.value}))} style={{...IS,fontSize:13}}/></div>
              <div><label style={lbl}>To</label><input type="time" value={btForm.to} onChange={e=>setBtForm(f=>({...f,to:e.target.value}))} style={{...IS,fontSize:13}}/></div>
              <div><label style={lbl}>Reason</label><select value={btForm.reason} onChange={e=>setBtForm(f=>({...f,reason:e.target.value}))} style={{...SS,fontSize:13}}>
                {["Lunch","Meeting","Vacation","Conference","Personal"].map(r=><option key={r}>{r}</option>)}
              </select></div>
              <button onClick={addBlockTime} disabled={!btForm.date||!btForm.from||!btForm.to} className="btn btn-primary"><Icon as={Plus}/>Add</button>
            </div>
            {(blockTimes||[]).length>0?(
              <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse",marginTop:8}}>
                <thead><tr>{["Doctor","Date","Time","Reason",""].map(h=><th key={h} style={{padding:"12px 12px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                <tbody>{(blockTimes||[]).map((b,i)=>(
                  <tr key={b.id} style={{borderBottom:i<(blockTimes||[]).length-1?`1px solid ${C.border}`:"none"}}>
                    <td style={{padding:"10px 12px",fontSize:13,color:C.text,fontWeight:500}}>{b.doctor}</td>
                    <td style={{padding:"10px 12px",fontSize:13,color:C.text2}}>{fmt(b.date)}</td>
                    <td style={{padding:"10px 12px",fontSize:13,color:C.muted}}>{b.from} – {b.to}</td>
                    <td style={{padding:"10px 12px"}}><Badge color="neutral">{b.reason}</Badge></td>
                    <td style={{padding:"10px 12px"}}><button onClick={()=>setBlockTimes&&setBlockTimes(prev=>prev.filter(x=>x.id!==b.id))} className="btn btn-secondary btn-sm">Remove</button></td>
                  </tr>
                ))}</tbody>
              </table>
            ):<div style={{color:C.muted,fontSize:13}}>No block times set.</div>}
          </div>
        </Card>
      )}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <LoadingButton loading={savingSettings} onClick={save}>Save settings</LoadingButton>
        {saved&&<span role="status" style={{color:C.text2,fontSize:13,display:"inline-flex",alignItems:"center",gap:6}}><CircleCheck size={16} strokeWidth={1.5} style={{color:C.green}} aria-hidden="true"/>Saved</span>}
      </div>
    </div>
  );
}

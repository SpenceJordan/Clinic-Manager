import React, { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { permsFor } from "../lib/accounts";
import { fmt, today } from "../lib/utils";
import { Badge, C, Card, Dot, FF, FR, IS, Icon, PB, PageHeader, SS, Segmented, XB } from "../ui";

// ─── TasksPage ────────────────────────────────────────────────────────────────
export function TasksPage({user, tasks, setTasks}){
  const p=permsFor(user);
  const [view, setView]=useState("my");
  const [expanded, setExpanded]=useState(null);
  const [showNew, setShowNew]=useState(false);
  const [editNote, setEditNote]=useState({});
  const [editStatus, setEditStatus]=useState({});
  const [newTask, setNewTask]=useState({title:"",assignedTo:"nurse",patientId:"",priority:"medium",due:"",note:""});
  const canCreate=p.createTasks;
  const myTasks=tasks.filter(t=>t.assignedTo===user.role);
  const assignedByMe=tasks.filter(t=>t.assignedBy===user.role);
  const displayed=view==="my"?myTasks:view==="assigned"?assignedByMe:tasks;
  const isReadOnly=view==="assigned";
  const saveTask=(id)=>{
    setTasks(prev=>prev.map(t=>t.id===id?{...t,note:editNote[id]??t.note,status:editStatus[id]??t.status}:t));
    setExpanded(null);
  };
  const submitNew=()=>{
    if(!newTask.title||!newTask.due)return;
    setTasks(prev=>[...prev,{id:Date.now(),title:newTask.title,assignedTo:newTask.assignedTo,assignedBy:user.role,assignedByName:user.name,patientId:newTask.patientId?parseInt(newTask.patientId):null,patient:"",priority:newTask.priority,due:newTask.due,status:"pending",note:newTask.note}]);
    setNewTask({title:"",assignedTo:"nurse",patientId:"",priority:"medium",due:"",note:""});
    setShowNew(false);
  };
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      <PageHeader title="Tasks" meta={`${myTasks.filter(t=>t.status!=="completed").length} open for you · ${assignedByMe.filter(t=>t.status!=="completed").length} assigned by you still open`}
        actions={canCreate&&<PB onClick={()=>setShowNew(v=>!v)}><Icon as={Plus}/>New task</PB>}/>
      {showNew&&(
        <Card style={{marginBottom:16,padding:"20px"}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>New task</div>
          <FR cols={1}><FF label="Title"><input value={newTask.title} onChange={e=>setNewTask(f=>({...f,title:e.target.value}))} style={IS} placeholder="Task description…"/></FF></FR>
          <FR>
            <FF label="Assign to"><select value={newTask.assignedTo} onChange={e=>setNewTask(f=>({...f,assignedTo:e.target.value}))} style={SS}><option value="nurse">Nurse</option><option value="receptionist">Receptionist</option><option value="doctor">Doctor</option><option value="admin">Admin</option></select></FF>
            <FF label="Priority"><select value={newTask.priority} onChange={e=>setNewTask(f=>({...f,priority:e.target.value}))} style={SS}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></FF>
          </FR>
          <FR><FF label="Due date"><input type="date" value={newTask.due} onChange={e=>setNewTask(f=>({...f,due:e.target.value}))} style={IS}/></FF><FF label="Note"><input value={newTask.note} onChange={e=>setNewTask(f=>({...f,note:e.target.value}))} style={IS} placeholder="Optional note…"/></FF></FR>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={()=>setShowNew(false)}>Cancel</XB><PB onClick={submitNew} disabled={!newTask.title||!newTask.due}>Create task</PB></div>
        </Card>
      )}
      <div style={{marginBottom:12}}>
        <Segmented size="sm" value={view} onChange={setView} options={[
          ["my","My tasks",null,myTasks.filter(t=>t.status!=="completed").length],
          ...(assignedByMe.length>0?[["assigned","Assigned by me",null,assignedByMe.filter(t=>t.status!=="completed").length]]:[]),
          ...(canCreate?[["all","All tasks",null,tasks.filter(t=>t.status!=="completed").length]]:[]),
        ]}/>
      </div>
      <Card style={{overflow:"hidden"}}>
        {displayed.length===0&&<div style={{padding:"32px",textAlign:"center",color:C.muted}}>No tasks to show</div>}
        {displayed.map(task=>{
          const isExp=expanded===task.id;
          const isPast=task.due<today()&&task.status!=="completed";
          return(
            <div key={task.id} style={{borderTop:displayed[0].id===task.id?"none":`1px solid ${C.border}`}}>
              <div onClick={()=>setExpanded(isExp?null:task.id)} aria-expanded={isExp} className="row-link" style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:12}}>
                <span title={`${task.priority} priority`}><Dot color={task.status==="completed"?C.inactive:task.priority==="high"?C.red:task.priority==="medium"?C.amber:C.inactive}/></span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:task.status==="completed"?C.muted:C.text,textDecoration:task.status==="completed"?"line-through":"none"}}>{task.title}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:4}}>
                    {task.patient&&<span>Patient: {task.patient} · </span>}
                    <span>By {task.assignedByName} · </span>
                    <span style={{color:isPast?C.red:C.muted,fontWeight:isPast?500:400}}>{isPast?"Overdue since ":"Due "}{fmt(task.due)}</span>
                  </div>
                </div>
                <span style={{fontSize:12,color:C.muted,textTransform:"capitalize",width:56}}>{task.priority}</span>
                <Badge color={task.status==="completed"?"green":task.status==="in-progress"?"blue":"neutral"}>{task.status==="in-progress"?"In progress":task.status}</Badge>
                <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,transform:isExp?"rotate(180deg)":"none",transition:"transform 160ms var(--ease)"}}/>
              </div>
              {isExp&&(
                <div style={{padding:"16px 20px 16px 40px",background:C.raised,borderTop:`1px solid ${C.border}`}}>
                  {isReadOnly?(
                    <>
                      <div style={{display:"flex",gap:24,marginBottom:12,flexWrap:"wrap"}}>
                        <div>
                          <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Status</div>
                          <Badge color={task.status==="completed"?"green":task.status==="in-progress"?"blue":"neutral"}>{task.status==="in-progress"?"In progress":task.status}</Badge>
                        </div>
                        <div>
                          <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Assigned to</div>
                          <span style={{fontSize:14,color:C.text,textTransform:"capitalize"}}>{task.assignedTo}</span>
                        </div>
                        {task.due&&<div>
                          <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Due</div>
                          <span style={{fontSize:14,color:task.due<today()&&task.status!=="completed"?C.red:C.text}}>{fmt(task.due)}</span>
                        </div>}
                      </div>
                      {task.note&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",fontSize:13,color:C.text}}>
                        <span style={{fontWeight:500,color:C.muted,fontSize:12}}>Note: </span>{task.note}
                      </div>}
                      {!task.note&&<div style={{fontSize:13,color:C.muted,fontStyle:"italic"}}>No note added yet.</div>}
                      <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}><XB onClick={()=>setExpanded(null)}>Close</XB></div>
                    </>
                  ):(
                    <>
                      <FR cols={1}><FF label="Note"><textarea value={editNote[task.id]??task.note} onChange={e=>setEditNote(f=>({...f,[task.id]:e.target.value}))} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
                      <FF label="Status"><select value={editStatus[task.id]??task.status} onChange={e=>setEditStatus(f=>({...f,[task.id]:e.target.value}))} style={{...SS,maxWidth:200}}><option value="pending">Pending</option><option value="in-progress">In progress</option><option value="completed">Completed</option></select></FF>
                      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}}><XB onClick={()=>setExpanded(null)}>Cancel</XB><PB onClick={()=>saveTask(task.id)}>Save</PB></div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

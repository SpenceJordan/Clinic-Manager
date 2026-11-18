import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { DEMO_ORDER, PERM_GROUPS, PERM_NEEDS, hasAdmin, isAdminAddOn, permsFor, roleDefaults } from "../lib/accounts";
import { INIT_LOGIN_HISTORY, ROLE_LABEL } from "../lib/data";
import { AdminMark, Alert, Badge, C, Card, CardHead, FF, IS, Icon, LS, Modal, PB, PageHeader, SS, Segmented, XB } from "../ui";

export const changedPerms=a=>Object.keys(a.perms||{}).filter(k=>k!=="admin"&&a.perms[k]!==roleDefaults(a.role)[k]).length;

export function UsersTab({accounts,user,onAdd,onEdit}){
  const th={padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`};
  const td={padding:"12px 16px",fontSize:13,color:C.text2};
  return(
    <Card>
      <CardHead title="Staff users" meta={`${accounts.length} accounts · ${accounts.filter(hasAdmin).length} with admin access`}><button className="btn btn-primary btn-sm" onClick={onAdd}><Icon as={Plus} size={14}/>Add user</button></CardHead>
      <table className="tbl" style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr>{["Name","Username","Role","Access","Status","Last sign-in",""].map(h=><th key={h} style={th}>{h}</th>)}</tr></thead>
        <tbody>{accounts.map((a,i)=>{const n=changedPerms(a);return(
          <tr key={a.id} className="row-link" onClick={()=>onEdit(a)} style={{borderBottom:i<accounts.length-1?`1px solid ${C.border}`:"none"}}>
            <td style={{...td,color:C.text,fontWeight:500}}>{a.name}{a.id===user?.id&&<span style={{color:C.muted,fontWeight:400}}> (you)</span>}<div style={{fontSize:12,color:C.muted,fontWeight:400,marginTop:2}}>{a.title}</div></td>
            <td style={{...td,fontFamily:C.mono,fontSize:12,color:C.muted}}>{a.username}</td>
            <td style={td}><span style={{display:"inline-flex",alignItems:"center",gap:8}}>{ROLE_LABEL[a.role]}{isAdminAddOn(a)&&<AdminMark/>}</span></td>
            <td style={td}>{n?<Badge color="amber">{n} custom</Badge>:<span style={{color:C.muted}}>Role default</span>}</td>
            <td style={td}><Badge color={a.status==="active"?"green":"neutral"}>{a.status==="active"?"Active":"Inactive"}</Badge></td>
            <td style={{...td,fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{a.lastLogin||"Never"}</td>
            <td style={{...td,textAlign:"right"}}><button className="btn btn-secondary btn-sm" onClick={e=>{e.stopPropagation();onEdit(a);}}>Edit</button></td>
          </tr>);})}</tbody>
      </table>
    </Card>
  );
}

export function AccountModal({account,accounts,self,onSave,onClose}){
  const isNew=!account, isSelf=account&&self&&account.id===self.id;
  const[f,setF]=useState(()=>account?{...account,password:""}:{name:"",username:"",password:"",title:"",role:"nurse",status:"active",perms:{}});
  const[err,setErr]=useState("");
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const eff=permsFor(f), defs=roleDefaults(f.role);
  const toggle=(key,on)=>setF(x=>{
    const next={...permsFor(x),[key]:on};
    // keep read/write pairs consistent
    Object.entries(PERM_NEEDS).forEach(([w,r])=>{if(key===w&&on)next[r]=true;if(key===r&&!on)next[w]=false;});
    const d=roleDefaults(x.role),perms={};
    [...PERM_GROUPS.flatMap(g=>g.items).map(([k])=>k),"admin"].forEach(k=>{if(!!next[k]!==!!d[k])perms[k]=!!next[k];});
    return{...x,perms};
  });
  const nCustom=Object.keys(f.perms||{}).filter(k=>k!=="admin").length;
  const save=()=>{
    const username=f.username.trim().toLowerCase();
    if(!f.name.trim()||!username)return setErr("Name and username are required");
    if(!/^[a-z0-9._-]+$/.test(username))return setErr("Usernames can use letters, numbers, dots, dashes and underscores");
    if(accounts.some(a=>a.username===username&&a.id!==account?.id))return setErr(`The username "${username}" is already taken`);
    if(isNew&&f.password.length<8)return setErr("Password needs at least 8 characters");
    if(!isNew&&f.password&&f.password.length<8)return setErr("New password needs at least 8 characters");
    // Never zero admins: the last active account with admin access keeps it
    const othersWithAdmin=accounts.filter(a=>a.id!==account?.id&&hasAdmin(a)).length;
    if(account&&hasAdmin(account)&&!hasAdmin(f)&&othersWithAdmin===0)
      return setErr(`${account.name} is the only account with admin access. Give another account admin access first, so the clinic can't be locked out.`);
    const{password,...rest}=f;
    onSave({...rest,name:f.name.trim(),title:f.title.trim()||ROLE_LABEL[f.role],username,password:password||account.password});
  };
  const row={display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",fontSize:13,color:C.text,cursor:"pointer"};
  return(
    <Modal title={isNew?"Add user":`Edit ${account.name}`} onClose={onClose} width={680}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <FF label="Full name"><input style={IS} value={f.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Dr. Ana Ruiz" autoFocus={isNew}/></FF>
        <FF label="Job title"><input style={IS} value={f.title} onChange={e=>set("title",e.target.value)} placeholder={ROLE_LABEL[f.role]}/></FF>
        <FF label="Username"><input style={{...IS,fontFamily:C.mono}} value={f.username} onChange={e=>set("username",e.target.value)} autoComplete="off"/></FF>
        <FF label={isNew?"Password":"New password"}><input style={IS} type="password" value={f.password} onChange={e=>set("password",e.target.value)} placeholder={isNew?"At least 8 characters":"Leave blank to keep the current one"} autoComplete="new-password"/></FF>
        <FF label="Role"><select style={SS} value={f.role} disabled={isSelf} onChange={e=>setF(x=>({...x,role:e.target.value,perms:permsFor(x).admin&&!roleDefaults(e.target.value).admin?{admin:true}:{}}))}>{DEMO_ORDER.map(r=><option key={r} value={r}>{ROLE_LABEL[r]}</option>)}</select></FF>
        <FF label="Status"><select style={SS} value={f.status} disabled={isSelf} onChange={e=>set("status",e.target.value)}><option value="active">Active, can sign in</option><option value="inactive">Inactive, can't sign in</option></select></FF>
      </div>

      {(()=>{
        const officeAdmin=f.role==="admin";
        const lastAdmin=!!account&&hasAdmin(account)&&!accounts.some(a=>a.id!==account.id&&hasAdmin(a));
        const locked=officeAdmin||(lastAdmin&&!!eff.admin);
        return(
          <label style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",marginBottom:20,border:`1px solid ${eff.admin?C.border2:C.border}`,borderRadius:8,background:eff.admin?C.raised:"transparent",cursor:locked?"default":"pointer"}}
            title={officeAdmin?"Office admins always have admin access":locked?"The only account with admin access keeps it":undefined}>
            <input type="checkbox" checked={!!eff.admin} disabled={locked} onChange={e=>toggle("admin",e.target.checked)} style={{width:16,height:16,marginTop:2,cursor:"inherit",accentColor:"var(--c-navymid)"}}/>
            <span style={{flex:1,minWidth:0}}>
              <span style={{display:"flex",alignItems:"center",gap:8,fontSize:14,fontWeight:600,color:C.text}}>Admin access{eff.admin&&<AdminMark/>}</span>
              <span style={{display:"block",fontSize:12,color:C.muted,marginTop:2,lineHeight:1.5}}>
                {officeAdmin
                  ?"Office admins always have it. The admin pages are in their sidebar."
                  :`Adds "Manage clinic" to their profile menu: staff and accounts, staff schedule, reports, inventory, audit log and backup. Their own ${ROLE_LABEL[f.role].toLowerCase()} sidebar doesn't change.`}
              </span>
              {lastAdmin&&!officeAdmin&&<span style={{display:"block",fontSize:12,color:C.text2,marginTop:6}}>This is the only account with admin access, so it can't be switched off. Give another account admin access first.</span>}
            </span>
          </label>
        );
      })()}

      <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:12,borderTop:`1px solid ${C.border}`,paddingTop:16,marginBottom:4}}>
        <div>
          <div style={{fontSize:15,fontWeight:600,color:C.text}}>What this account can use</div>
          <div style={{fontSize:12,color:C.muted,marginTop:2}}>Pages switched on here show in their sidebar. Starts from the {ROLE_LABEL[f.role].toLowerCase()} defaults. {nCustom?`${nCustom} changed from the default.`:"No changes."}</div>
        </div>
        {nCustom>0&&<button className="text-link" style={{fontSize:13}} onClick={()=>set("perms",isAdminAddOn(f)?{admin:true}:{})}>Reset to role defaults</button>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,minmax(0,1fr))",gap:"0 24px"}}>
        {PERM_GROUPS.map(g=>(
          <div key={g.label}>
            <div style={{fontSize:12,color:C.muted,margin:"12px 0 2px"}}>{g.label}</div>
            {g.items.map(([k,label,hint])=>{
              const locked=isSelf&&k==="admin";
              const changed=!!eff[k]!==!!defs[k];
              return(
                <label key={k} style={{...row,cursor:locked?"default":"pointer",opacity:locked?0.6:1}} title={locked?"You can't remove your own admin access":undefined}>
                  <input type="checkbox" checked={!!eff[k]} disabled={locked} onChange={e=>toggle(k,e.target.checked)} style={{width:15,height:15,marginTop:1,cursor:"inherit",accentColor:"var(--c-navymid)"}}/>
                  <span style={{minWidth:0}}>{label}{changed&&<span style={{fontSize:11,color:C.amber,marginLeft:6}}>changed</span>}{hint&&<span style={{display:"block",fontSize:12,color:C.muted}}>{hint}</span>}</span>
                </label>
              );
            })}
          </div>
        ))}
      </div>

      {err&&<div role="alert" style={{marginTop:16}}><Alert tone="red" title={err}/></div>}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:20}}>
        <XB onClick={onClose}>Cancel</XB>
        <PB onClick={save}>{isNew?"Create account":"Save changes"}</PB>
      </div>
    </Modal>
  );
}

export function AdminPage({auditLog,accounts,setAccounts,user,addAudit,showToast,title="Admin panel",tabs=["users","audit log","login history","backup"]}){
  const STAFF_LIST=accounts;
  const[editing,setEditing]=useState(null);   // account being edited, or "new"
  const[tab,setTab]=useState(tabs[0]);
  const[loginFilter,setLoginFilter]=useState("all");
  const filteredLogins=loginFilter==="all"?INIT_LOGIN_HISTORY:INIT_LOGIN_HISTORY.filter(l=>l.status===loginFilter);
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      <PageHeader title={title} meta={`${STAFF_LIST.length} staff accounts · ${STAFF_LIST.filter(s=>s.status==="active").length} active`}/>
      {tabs.length>1&&<div role="tablist" style={{display:"flex",gap:24,marginBottom:12,borderBottom:`1px solid ${C.border}`}}>
        {tabs.map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 0",border:"none",background:"none",cursor:"pointer",fontSize:14,fontWeight:tab===t?500:400,color:tab===t?C.text:C.muted,borderBottom:tab===t?`2px solid ${C.navyMid}`:"2px solid transparent",marginBottom:-1,textTransform:"none",fontFamily:"inherit"}}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
      </div>}
      {tab==="users"&&<UsersTab accounts={accounts} user={user} onAdd={()=>setEditing("new")} onEdit={a=>setEditing(a)}/>}
      {editing&&<AccountModal account={editing==="new"?null:editing} accounts={accounts} self={user} onClose={()=>setEditing(null)}
        onSave={acc=>{
          const isNew=editing==="new";
          setAccounts(prev=>isNew?[...prev,{...acc,id:Math.max(0,...prev.map(a=>a.id))+1,lastLogin:""}]:prev.map(a=>a.id===acc.id?acc:a));
          addAudit&&addAudit(isNew?"Created account":"Updated account",`${acc.name} (${acc.username})`,"Admin");
          showToast&&showToast(isNew?"Account created":"Account updated");
          setEditing(null);
        }}/>}
      {tab==="audit log"&&(<Card style={{padding:"16px 20px 8px"}}><div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>Audit log</div><AuditLogTab auditLog={auditLog||[]}/></Card>)}
      {tab==="login history"&&(
        <Card>
          <div style={{padding:"16px 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text}}>Login history</div>
            <Segmented size="sm" value={loginFilter} onChange={setLoginFilter} options={[["all","All"],["Success","Successful"],["Failed","Failed"]]}/>
          </div>
          <table className="tbl" style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["User","Role","Username","Time","Status"].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{filteredLogins.map((l,i)=>(
              <tr key={l.id} style={{borderBottom:i<filteredLogins.length-1?`1px solid ${C.border}`:"none"}}>
                <td style={{padding:"12px 16px",fontWeight:500,fontSize:13,color:C.text}}>{l.user}</td>
                <td style={{padding:"12px 16px"}}><span style={{fontSize:13,color:C.text2,textTransform:"capitalize"}}>{l.role}</span></td>
                <td style={{padding:"12px 16px",fontSize:12,color:C.muted,fontFamily:C.mono}}>{l.username}</td>
                <td style={{padding:"12px 16px",fontSize:13,color:C.text2,fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{l.ts}</td>
                <td style={{padding:"12px 16px"}}><Badge color={l.status==="Success"?"green":"red"}>{l.status}</Badge></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}
      {tab==="backup"&&(<Card style={{padding:"24px"}}><div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:6}}>Database backup</div><div style={{fontSize:13,color:C.muted,marginBottom:20}}>Last backup: never</div><button className="btn btn-primary">Run backup now</button></Card>)}
    </div>
  );
}

// ─── AuditLogTab ─────────────────────────────────────────────────────────────
export function AuditLogTab({auditLog}){
  const [filterUser,   setFilterUser]  =useState("all");
  const [filterAction, setFilterAction]=useState("all");
  const [filterSection,setFilterSection]=useState("all");
  const [dateFrom,     setDateFrom]    =useState("");
  const [dateTo,       setDateTo]      =useState("");

  const users   =["all",...[...new Set((auditLog||[]).map(l=>l.user))]];
  const sections=["all",...[...new Set((auditLog||[]).map(l=>l.section))]];

  const filtered=(auditLog||[]).filter(l=>{
    if(filterUser!=="all"&&l.user!==filterUser)return false;
    if(filterAction!=="all"&&l.action!==filterAction)return false;
    if(filterSection!=="all"&&l.section!==filterSection)return false;
    const entryDate=l.ts?l.ts.slice(0,10):"";
    if(dateFrom&&entryDate<dateFrom)return false;
    if(dateTo&&entryDate>dateTo)return false;
    return true;
  });

  const clearFilters=()=>{setFilterUser("all");setFilterAction("all");setFilterSection("all");setDateFrom("");setDateTo("");};
  const hasFilters=filterUser!=="all"||filterAction!=="all"||filterSection!=="all"||dateFrom||dateTo;

  return(
    <div>
      <div style={{paddingBottom:16,marginBottom:4,borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div><label style={LS}>User</label>
            <select value={filterUser} onChange={e=>setFilterUser(e.target.value)} style={{...SS,width:"auto",minWidth:150}}>
              {users.map(u=><option key={u} value={u}>{u==="all"?"Any user":u}</option>)}
            </select>
          </div>
          <div><label style={LS}>Action</label>
            <select value={filterAction} onChange={e=>setFilterAction(e.target.value)} style={{...SS,width:"auto",minWidth:110}}>
              <option value="all">All</option><option value="Viewed">Viewed</option><option value="Edited">Edited</option>
            </select>
          </div>
          <div><label style={LS}>Section</label>
            <select value={filterSection} onChange={e=>setFilterSection(e.target.value)} style={{...SS,width:"auto",minWidth:130}}>
              {sections.map(s=><option key={s} value={s}>{s==="all"?"Any section":s}</option>)}
            </select>
          </div>
          <div><label style={LS}>From date</label>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{...IS,width:"auto"}}/>
          </div>
          <div><label style={LS}>To date</label>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{...IS,width:"auto"}}/>
          </div>
          {hasFilters&&<XB onClick={clearFilters}><Icon as={X}/>Clear</XB>}
        </div>
        <div style={{marginTop:10,fontSize:12,color:C.muted}}>{filtered.length} {filtered.length===1?"entry":"entries"} found</div>
      </div>
      <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
        <thead>
          <tr>
            {["Date","Time","User","Role","Action","Patient","Section"].map(h=>(
              <th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length===0&&(
            <tr><td colSpan={7} style={{padding:"32px",textAlign:"center",color:C.muted}}>No audit log entries match the selected filters.</td></tr>
          )}
          {filtered.map((l,i)=>{
            const [datePart,timePart]=l.ts?l.ts.split(" "):["—","—"];
            const dateDisplay=datePart?new Date(datePart+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"—";
            return(
              <tr key={l.id} style={{borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none"}} onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 16px",fontSize:13,color:C.text,whiteSpace:"nowrap"}}>{dateDisplay}</td>
                <td style={{padding:"10px 16px",fontSize:13,color:C.text2,whiteSpace:"nowrap",fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{timePart||"—"}</td>
                <td style={{padding:"10px 16px",fontSize:13,fontWeight:500,color:C.text}}>{l.user}</td>
                <td style={{padding:"10px 16px"}}><span style={{fontSize:13,color:C.text2,textTransform:"capitalize"}}>{l.role}</span></td>
                <td style={{padding:"10px 16px"}}><Badge color={l.action==="Edited"?"amber":"neutral"}>{l.action}</Badge></td>
                <td style={{padding:"10px 16px",fontSize:13,color:C.text}}>{l.subject}</td>
                <td style={{padding:"10px 16px",fontSize:13,color:C.text2}}>{l.section}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

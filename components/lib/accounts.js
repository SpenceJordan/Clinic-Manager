import React from "react";
import { INIT_ACCOUNTS } from "./data";

export const DEMO_ORDER=["admin","doctor","nurse","receptionist"];
export const ACCOUNTS_KEY="medplus.accounts";
// Every component reads the live account list from here, so new accounts show up in messages, schedules and dashboards
export const StaffContext=React.createContext(INIT_ACCOUNTS);
export const useStaff=()=>React.useContext(StaffContext);

export const PERMS = {
  admin:        { appointments:true,  patients:true,  vitals:false, viewVitals:true,  notes:false, prescriptions:false, viewRx:true,  writeRx:false, viewNotes:true,  writeNotes:false, recalls:true, admin:true,  settings:true,  messages:true, flow:true, reports:true,  refills:true,  refillApprove:false, tasks:true, inventory:true,  staffSchedule:true  , registerPatients:true,  createTasks:true, customiseDashboard:true },
  doctor:       { appointments:true,  patients:true,  vitals:true,  viewVitals:true,  notes:true,  prescriptions:true,  viewRx:true,  writeRx:true,  viewNotes:true,  writeNotes:true,  recalls:true, admin:false, settings:true,  messages:true, flow:true, reports:false, refills:true,  refillApprove:true,  tasks:true, inventory:false, staffSchedule:false , registerPatients:false, createTasks:true, customiseDashboard:true },
  nurse:        { appointments:true,  patients:true,  vitals:true,  viewVitals:true,  notes:false, prescriptions:false, viewRx:true,  writeRx:false, viewNotes:true,  writeNotes:false, recalls:true, admin:false, settings:false, messages:true, flow:true, reports:false, refills:true,  refillApprove:false, tasks:true, inventory:true,  staffSchedule:false , registerPatients:false, createTasks:false, customiseDashboard:true },
  receptionist: { appointments:true,  patients:true,  vitals:false, viewVitals:false, notes:false, prescriptions:false, viewRx:false, writeRx:false, viewNotes:false, writeNotes:false, recalls:true, admin:false, settings:false, messages:true, flow:true, reports:false, refills:true,  refillApprove:false, tasks:true, inventory:false, staffSchedule:false , registerPatients:true,  createTasks:false, customiseDashboard:true },
};
// What the admin can switch on or off per account. Dashboard is always available.
export const PERM_GROUPS=[
  {label:"Pages",items:[
    ["appointments","Appointments"],["flow","Patient flow"],["patients","Patients"],["refills","Refill queue"],["recalls","Recalls"],
    ["tasks","Tasks"],["inventory","Inventory"],["reports","Reports"],["staffSchedule","Staff schedule"],["messages","Messages"],
    ["settings","Settings"],
  ]},
  {label:"Clinical",items:[
    ["viewVitals","See vitals"],["vitals","Record vitals and allergies"],
    ["viewNotes","Read visit notes"],["writeNotes","Write and sign visit notes"],
    ["viewRx","See prescriptions"],["writeRx","Prescribe, edit problems, order labs"],
    ["refillApprove","Approve refill requests"],
  ]},
  {label:"Front desk and work",items:[
    ["registerPatients","Register new patients"],["createTasks","Create and assign tasks"],
    ["customiseDashboard","Customise their dashboard"],
  ]},
];
// Admin access is one switch on any account. Office admins have it as their job (admin pages in the sidebar);
// anyone else gets a separate "Manage clinic" area from the profile menu, so their working sidebar stays the same.
export const hasAdmin=a=>!!a&&a.status==="active"&&permsFor(a).admin;
export const isAdminAddOn=a=>!!a&&a.role!=="admin"&&permsFor(a).admin;
// A write permission needs its read permission; switching one changes the other
export const PERM_NEEDS={vitals:"viewVitals",writeNotes:"viewNotes",writeRx:"viewRx",refillApprove:"refills"};
export const roleDefaults=role=>PERMS[role]||PERMS.receptionist;
// Effective permissions: role defaults, then the account's own changes
export function permsFor(user){
  const p={...roleDefaults(user?.role),...(user?.perms||{})};
  Object.entries(PERM_NEEDS).forEach(([w,r])=>{if(p[w])p[r]=true;});
  if(user?.role==="admin")p.admin=true;   // the office admin role is the admin job
  p.prescriptions=p.writeRx; p.notes=p.writeNotes;   // older keys still read in the chart
  return p;
}

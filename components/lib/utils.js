

export function age(d){return Math.floor((new Date()-new Date(d))/31557600000);}
// Date-only strings ("2026-02-10") are read as local noon; new Date("2026-02-10") is UTC midnight and shows the previous day in US time zones
export function fmt(d){const s=String(d);return new Date(/^\d{4}-\d{2}-\d{2}$/.test(s)?s+"T12:00:00":s).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}
export function today(){return new Date().toISOString().split("T")[0];}
export function nowTime(){return new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}

export function addDaysToDate(dateStr, days){
  const d=new Date(dateStr+"T12:00:00");
  d.setDate(d.getDate()+days);
  return d.toISOString().split("T")[0];
}

export const initials=name=>name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2);

export const toMin=t=>{const[h,m]=String(t).split(":").map(Number);return h*60+(m||0);};
export const lastName=n=>n.replace(/^Dr\.\s*/,"").split(" ").pop();

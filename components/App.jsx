"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Plus, Search, Mail, ChevronDown, ChevronUp, ChevronLeft, Settings, LogOut, LayoutDashboard, CalendarDays, Columns3, Users, Pill, BellRing, ChartColumn, ListChecks, Package, CalendarClock, ShieldCheck, Briefcase, Stethoscope, HeartPulse, CalendarCheck, MessageSquare, Maximize2, Minimize2, ArrowUp, TriangleAlert, ArrowRight, Check, Timer, BellRing as Bell, ClipboardList, CalendarX2, X, Lock, ChevronRight, CircleAlert, CircleCheck, Ellipsis, UserRound, Activity, ClipboardCheck, Clock, Printer, FileText, FolderOpen, Phone, Ban, ScanLine, Moon, NotebookPen, ArrowLeft, List, CalendarRange, Hourglass, CalendarPlus, Info, GripVertical, Eye, EyeOff, ArrowDown, ArrowLeftRight, SlidersHorizontal, RotateCcw, Database, ScrollText, UserCog } from "lucide-react";

const ROLE_LABEL = { admin:"Office admin", doctor:"Doctor", nurse:"Nurse", receptionist:"Receptionist" };
const INIT_PATIENTS = [
  { id:1, first_name:"Margaret", last_name:"Chen",    dob:"1968-04-12", gender:"F", phone:"555-0142", insurance:"BlueCross",   allergies:["Penicillin","Sulfa"], lastVisit:"2026-02-10", active:true,  contactPref:"Call",  bestTime:"Morning",   dnc:false },
  { id:2, first_name:"Robert",   last_name:"Vásquez", dob:"1952-09-28", gender:"M", phone:"555-0198", insurance:"Medicare",     allergies:[],                    lastVisit:"2026-02-18", active:true,  contactPref:"Call",  bestTime:"Afternoon", dnc:false },
  { id:3, first_name:"Aisha",    last_name:"Okonkwo", dob:"1991-01-03", gender:"F", phone:"555-0277", insurance:"Aetna",        allergies:["Latex"],             lastVisit:"2026-01-30", active:true,  contactPref:"Text",  bestTime:"Either",    dnc:false },
  { id:4, first_name:"Derek",    last_name:"Marsh",   dob:"1985-07-19", gender:"M", phone:"555-0355", insurance:"UnitedHealth", allergies:[],                    lastVisit:"2026-02-20", active:true,  contactPref:"Email", bestTime:"Morning",   dnc:false },
  { id:5, first_name:"Yuki",     last_name:"Tanaka",  dob:"1977-11-05", gender:"F", phone:"555-0401", insurance:"Cigna",        allergies:["Aspirin"],           lastVisit:"2026-02-05", active:true,  contactPref:"Call",  bestTime:"Morning",   dnc:false },
  { id:6, first_name:"Thomas",   last_name:"Reilly",  dob:"1945-03-22", gender:"M", phone:"555-0532", insurance:"Medicare",     allergies:["Codeine"],           lastVisit:"2026-02-22", active:false, contactPref:"Call",  bestTime:"Morning",   dnc:true  },
];
const INIT_LABS = {
  1:[ { id:1, name:"Complete Blood Count (CBC)", date:"2026-02-10", status:"resulted", abnormal:false, values:[
      {name:"WBC", value:7.2, unit:"K/µL", low:4.5, high:11.0},
      {name:"RBC", value:4.8, unit:"M/µL", low:4.2, high:5.9},
      {name:"Hemoglobin", value:14.2, unit:"g/dL", low:12.0, high:17.5},
      {name:"Hematocrit", value:42.1, unit:"%", low:36, high:52},
      {name:"Platelets", value:245, unit:"K/µL", low:150, high:400},
    ]},
    { id:2, name:"Lipid Panel", date:"2026-02-10", status:"resulted", abnormal:false, values:[
      {name:"Total Cholesterol", value:195, unit:"mg/dL", low:0, high:200},
      {name:"LDL", value:118, unit:"mg/dL", low:0, high:130},
      {name:"HDL", value:52, unit:"mg/dL", low:40, high:999},
      {name:"Triglycerides", value:142, unit:"mg/dL", low:0, high:150},
    ]},
  ],
  2:[ { id:1, name:"HbA1c", date:"2026-01-15", status:"resulted", abnormal:true, values:[
      {name:"HbA1c", value:8.2, unit:"%", low:0, high:5.7},
    ]},
    { id:2, name:"Comprehensive Metabolic Panel", date:"2026-01-15", status:"resulted", abnormal:false, values:[
      {name:"Glucose", value:182, unit:"mg/dL", low:70, high:100},
      {name:"BUN", value:18, unit:"mg/dL", low:7, high:25},
      {name:"Creatinine", value:0.9, unit:"mg/dL", low:0.6, high:1.2},
      {name:"Sodium", value:139, unit:"mEq/L", low:136, high:145},
      {name:"Potassium", value:4.1, unit:"mEq/L", low:3.5, high:5.1},
    ]},
  ],
  3:[ { id:1, name:"Comprehensive Metabolic Panel", date:"2026-03-20", status:"pending", orderedBy:"Dr. Patel", values:[] },
    { id:2, name:"Lipid Panel", date:"2026-03-20", status:"pending", orderedBy:"Dr. Patel", values:[] },
  ],
  5:[ { id:1, name:"Thyroid Panel (TSH)", date:"2026-02-05", status:"resulted", orderedBy:"Dr. Williams", abnormal:false, values:[
      {name:"TSH", value:2.1, unit:"mIU/L", low:0.4, high:4.0},
    ]},
    { id:2, name:"Complete Blood Count", date:"2026-03-15", status:"pending", orderedBy:"Dr. Williams", values:[] },
  ],
  6:[ { id:1, name:"Basic Metabolic Panel", date:"2026-02-22", status:"resulted", abnormal:true, values:[
      {name:"Glucose", value:58, unit:"mg/dL", low:70, high:100},
      {name:"BUN", value:28, unit:"mg/dL", low:7, high:25},
      {name:"Creatinine", value:1.4, unit:"mg/dL", low:0.6, high:1.2},
      {name:"Sodium", value:141, unit:"mEq/L", low:136, high:145},
      {name:"Potassium", value:5.3, unit:"mEq/L", low:3.5, high:5.1},
    ]},
  ],
};
const INIT_PROBLEMS = {
  1: [
    { id:1, problem:"Essential Hypertension",        icd:"I10",    status:"active",   onset:"2020-03-15", notes:"Well controlled on Lisinopril" },
    { id:2, problem:"Hyperlipidemia",                icd:"E78.5",  status:"active",   onset:"2021-06-01", notes:"Diet-controlled + Atorvastatin" },
  ],
  2: [
    { id:1, problem:"Type 2 Diabetes Mellitus",      icd:"E11.9",  status:"active",   onset:"2018-07-20", notes:"On Metformin, HbA1c monitoring" },
    { id:2, problem:"Hypertensive Heart Disease",    icd:"I11.9",  status:"active",   onset:"2019-01-10", notes:"Cardiology follow-up scheduled" },
    { id:3, problem:"Obesity",                       icd:"E66.9",  status:"active",   onset:"2018-07-20", notes:"BMI 28.7, dietary counseling" },
  ],
  4: [
    { id:1, problem:"Seasonal Allergic Rhinitis",    icd:"J30.1",  status:"active",   onset:"2015-04-01", notes:"Managed with antihistamines PRN" },
  ],
  6: [
    { id:1, problem:"Chronic Obstructive Pulmonary Disease", icd:"J44.1", status:"active", onset:"2016-09-12", notes:"Ex-smoker, on bronchodilators" },
    { id:2, problem:"Type 2 Diabetes Mellitus",      icd:"E11.9",  status:"active",   onset:"2017-03-05", notes:"Poorly controlled" },
    { id:3, problem:"Hypertension",                  icd:"I10",    status:"resolved", onset:"2010-01-01", notes:"Resolved after weight loss" },
  ],
};
const ALLERGY_CROSS_REACTIVITY = {
  "Penicillin":    ["Amoxicillin","Ampicillin","Piperacillin","Nafcillin"],
  "Sulfa":         ["Sulfamethoxazole","Trimethoprim-Sulfamethoxazole","Sulfadiazine"],
  "Aspirin":       ["Ibuprofen","Naproxen","Celecoxib","Ketorolac"],
  "Codeine":       ["Morphine","Hydrocodone","Oxycodone","Tramadol"],
  "Latex":         ["Banana","Avocado","Kiwi"],
};
const INIT_APPTS = [
  { id:1,  patient:"Margaret Chen",  type:"follow-up",   time:"09:00", duration:30, doctor:"Dr. Patel",    status:"checked-in",  date:"2026-02-25", stageEnteredAt:"2026-02-25 09:15" },
  { id:2,  patient:"Derek Marsh",    type:"routine",     time:"09:30", duration:30, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-02-25" },
  { id:3,  patient:"Robert Vásquez", type:"urgent",      time:"10:00", duration:30, doctor:"Dr. Williams", status:"in-progress", date:"2026-02-25", stageEnteredAt:"2026-02-25 09:45" },
  { id:4,  patient:"Thomas Reilly",  type:"routine",     time:"10:30", duration:30, doctor:"Dr. Williams", status:"scheduled",   date:"2026-02-25" },
  { id:5,  patient:"Aisha Okonkwo",  type:"new-patient", time:"11:00", duration:45, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-02-25" },
  { id:6,  patient:"Yuki Tanaka",    type:"procedure",   time:"14:00", duration:60, doctor:"Dr. Williams", status:"scheduled",   date:"2026-02-25" },
  { id:7,  patient:"Thomas Reilly",  type:"follow-up",   time:"09:00", duration:30, doctor:"Dr. Williams", status:"completed",   date:"2026-02-24" },
  { id:8,  patient:"Derek Marsh",    type:"routine",     time:"14:00", duration:30, doctor:"Dr. Patel",    status:"completed",   date:"2026-02-24" },
  { id:9,  patient:"Robert Vásquez", type:"follow-up",   time:"09:30", duration:30, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-02-26" },
  { id:10, patient:"Yuki Tanaka",    type:"routine",     time:"10:00", duration:30, doctor:"Dr. Williams", status:"scheduled",   date:"2026-02-26" },
  { id:11, patient:"Margaret Chen",  type:"procedure",   time:"11:00", duration:60, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-02-27" },
  { id:12, patient:"Aisha Okonkwo",  type:"new-patient", time:"10:00", duration:45, doctor:"Dr. Williams", status:"scheduled",   date:"2026-03-03" },
  { id:13, patient:"Thomas Reilly",  type:"routine",     time:"09:00", duration:30, doctor:"Dr. Patel",    status:"scheduled",   date:"2026-03-03" },
  { id:14, patient:"Derek Marsh",    type:"follow-up",   time:"13:00", duration:30, doctor:"Dr. Williams", status:"scheduled",   date:"2026-03-05" },
];
const INIT_RECALLS = [
  { id:1, patient:"Robert Vásquez", reason:"HbA1c recheck",       due:"2026-02-20", urgency:"high",   doctor:"Dr. Patel"    },
  { id:2, patient:"Thomas Reilly",  reason:"BP medication review", due:"2026-02-24", urgency:"high",   doctor:"Dr. Williams" },
  { id:3, patient:"Yuki Tanaka",    reason:"Annual physical",      due:"2026-03-01", urgency:"medium", doctor:"Dr. Patel"    },
  { id:4, patient:"Margaret Chen",  reason:"Cholesterol panel",    due:"2026-03-10", urgency:"low",    doctor:"Dr. Williams" },
];
const INIT_CONTACT_LOGS = {
  1:[ { id:1, date:"2026-02-21", method:"Phone", outcome:"No answer — left voicemail" },
      { id:2, date:"2026-02-22", method:"Phone", outcome:"Reached patient, appointment pending" } ],
  2:[ { id:1, date:"2026-02-25", method:"Phone", outcome:"No answer" } ],
};
const INIT_VITALS_FULL = {
  1: [
    { id:1, date:"2025-08-10", bp:"126/80", hr:74, temp:98.6, o2:98, weight:150, bmi:23.4, recordedBy:"James Torres" },
    { id:2, date:"2025-11-15", bp:"124/78", hr:72, temp:98.4, o2:98, weight:149, bmi:23.3, recordedBy:"James Torres" },
    { id:3, date:"2026-02-10", bp:"122/78", hr:72, temp:98.4, o2:98, weight:148, bmi:23.1, recordedBy:"James Torres" },
  ],
  2: [
    { id:1, date:"2025-07-15", bp:"152/94", hr:86, temp:98.7, o2:96, weight:205, bmi:29.1, recordedBy:"James Torres" },
    { id:2, date:"2025-10-20", bp:"150/92", hr:84, temp:98.6, o2:96, weight:203, bmi:28.9, recordedBy:"James Torres" },
    { id:3, date:"2026-01-15", bp:"148/92", hr:84, temp:98.6, o2:96, weight:201, bmi:28.7, recordedBy:"James Torres" },
  ],
  4: [
    { id:1, date:"2025-09-01", bp:"120/76", hr:68, temp:98.2, o2:99, weight:178, bmi:24.8, recordedBy:"James Torres" },
    { id:2, date:"2025-12-10", bp:"119/75", hr:68, temp:98.2, o2:99, weight:176, bmi:24.6, recordedBy:"James Torres" },
    { id:3, date:"2026-02-20", bp:"118/74", hr:68, temp:98.2, o2:99, weight:175, bmi:24.4, recordedBy:"James Torres" },
  ],
};
const INIT_RX = {
  1:[{ id:1, med:"Lisinopril",   dose:"10mg",  sig:"Once daily",            refills:3, date:"2026-02-10" }],
  2:[{ id:2, med:"Metformin",    dose:"500mg", sig:"Twice daily with food", refills:5, date:"2026-01-15" },
     { id:3, med:"Atorvastatin", dose:"20mg",  sig:"Once daily at bedtime", refills:2, date:"2026-01-15" }],
};
const INIT_NOTES = {
  1:[{ id:1, date:"2026-02-10", doctor:"Dr. Patel", chief:"Routine follow-up for hypertension", assessment:"BP well controlled on current regimen.", plan:"Continue Lisinopril 10mg. Recheck in 3 months.", signed:true }],
};
const INIT_INACTIVE_RX = {
  2:[ { id:100, med:"Glipizide", dose:"5mg", sig:"Once daily before breakfast", refills:0, date:"2025-08-01", active:false } ],
};
const INIT_DOCTOR_STATUS = { "Dr. Priya Patel":true, "Dr. Owen Williams":true };
const INIT_REMINDER_LOGS = {
  1:[{ id:1, method:"Auto-SMS", ts:"2026-02-24 08:00", outcome:"Sent", confirmed:true  }],
  3:[{ id:1, method:"Auto-SMS", ts:"2026-02-24 08:00", outcome:"Sent", confirmed:false }],
};
const INIT_BLOCK_TIMES = [
  { id:1, doctor:"Dr. Patel", date:"2026-02-25", from:"12:00", to:"13:00", reason:"Lunch" },
];
const INIT_WAITLIST = [
  { id:1, patient:"Yuki Tanaka", patientId:5, doctor:"Dr. Patel", preferredTime:"Morning", reason:"Annual exam rescheduled", addedDate:"2026-02-20", status:"waiting" },
];
const INIT_REFILL_REQUESTS = [
  { id:1, patientId:1, patient:"Margaret Chen",  medication:"Lisinopril 10mg",  requestedBy:"nurse",        requestedByName:"James Torres",   date:"2026-02-25", status:"pending",  approvedBy:null,       note:"" },
  { id:2, patientId:2, patient:"Robert Vásquez", medication:"Metformin 500mg",  requestedBy:"receptionist", requestedByName:"Brianna Wells",   date:"2026-02-25", status:"approved", approvedBy:"Dr. Patel", note:"Approved — continue current dose" },
];
const INIT_LOGIN_HISTORY = [
  { id:1, user:"Sandra Kim",       role:"admin",        username:"admin",        ts:"2026-02-25 08:30", status:"Success" },
  { id:2, user:"Dr. Priya Patel",  role:"doctor",       username:"doctor",       ts:"2026-02-25 08:14", status:"Success" },
  { id:3, user:"James Torres",     role:"nurse",        username:"nurse",        ts:"2026-02-25 08:02", status:"Success" },
  { id:4, user:"Brianna Wells",    role:"receptionist", username:"receptionist", ts:"2026-02-25 07:45", status:"Success" },
  { id:5, user:"Unknown user",     role:"-",            username:"jdoe",         ts:"2026-02-24 22:11", status:"Failed"  },
  { id:6, user:"Sandra Kim",       role:"admin",        username:"admin",        ts:"2026-02-24 08:22", status:"Success" },
];
const INIT_FILES = {
  1:[{ id:1, name:"CBC Results Feb 2026.pdf",     type:"Lab Report", date:"2026-02-10", size:"142 KB"  }],
  2:[{ id:1, name:"Cardiology Referral.pdf",      type:"Referral",   date:"2026-01-20", size:"98 KB"   },
     { id:2, name:"Echocardiogram Report.pdf",    type:"Lab Report", date:"2026-01-22", size:"2.1 MB"  }],
  6:[{ id:1, name:"Advance Directive.pdf",        type:"Legal",      date:"2025-11-05", size:"215 KB"  }],
};
const INIT_SETTINGS = {
  clinicName:"My Medical Clinic", address:"123 Main St, Springfield, IL 62701", phone:"(555) 000-0000",
  defaultDuration:30,
  clinicHours:{ Mon:["08:00","17:00"], Tue:["08:00","17:00"], Wed:["08:00","17:00"], Thu:["08:00","17:00"], Fri:["08:00","17:00"], Sat:["",""], Sun:["",""] },
  notifications:{ messages:true, recalls:true },
};
const INIT_RX_HISTORY = {
  1: { 1: [
    { id:1, date:"2025-08-10", action:"Prescribed", by:"Dr. Patel", note:"Initial prescription", qty:30, daysSupply:30 },
    { id:2, date:"2025-11-12", action:"Refilled",   by:"Dr. Patel", note:"Routine refill",      qty:30, daysSupply:30 },
    { id:3, date:"2026-02-10", action:"Refilled",   by:"Dr. Patel", note:"Routine refill",      qty:30, daysSupply:30 },
  ]},
  2: {
    2: [
      { id:1, date:"2025-01-15", action:"Prescribed", by:"Dr. Patel", note:"Initial prescription", qty:60, daysSupply:30 },
      { id:2, date:"2025-04-18", action:"Refilled",   by:"Dr. Patel", note:"",                     qty:60, daysSupply:30 },
      { id:3, date:"2025-07-20", action:"Refilled",   by:"James Torres", note:"Nurse refill",       qty:60, daysSupply:30 },
      { id:4, date:"2025-10-22", action:"Refilled",   by:"Dr. Patel", note:"",                     qty:60, daysSupply:30 },
      { id:5, date:"2026-01-15", action:"Refilled",   by:"Brianna Wells", note:"Patient called in", qty:60, daysSupply:30 },
    ],
    3: [
      { id:1, date:"2025-01-15", action:"Prescribed", by:"Dr. Patel", note:"Added for cholesterol", qty:30, daysSupply:30 },
      { id:2, date:"2025-07-20", action:"Refilled",   by:"Dr. Patel", note:"",                      qty:30, daysSupply:30 },
      { id:3, date:"2026-01-15", action:"Refilled",   by:"Dr. Patel", note:"Dose unchanged",        qty:30, daysSupply:30 },
    ],
  },
};
const DRUG_INTERACTIONS = [
  { drugs:["Warfarin","Aspirin"],         severity:"high",   effect:"Increased bleeding risk" },
  { drugs:["Warfarin","Ibuprofen"],       severity:"high",   effect:"Increased bleeding risk" },
  { drugs:["Metformin","Alcohol"],        severity:"medium", effect:"Risk of lactic acidosis" },
  { drugs:["Lisinopril","Potassium"],     severity:"medium", effect:"Risk of hyperkalemia" },
  { drugs:["Atorvastatin","Clarithromycin"], severity:"high", effect:"Increased statin levels — myopathy risk" },
  { drugs:["Metformin","Contrast Dye"],   severity:"high",   effect:"Risk of lactic acidosis — hold before imaging" },
  { drugs:["Aspirin","Ibuprofen"],        severity:"medium", effect:"Reduced aspirin efficacy" },
  { drugs:["Lisinopril","Ibuprofen"],     severity:"medium", effect:"Reduced antihypertensive effect" },
  { drugs:["Codeine","Benzodiazepine"],   severity:"high",   effect:"CNS depression — respiratory risk" },
  { drugs:["Sertraline","Tramadol"],      severity:"high",   effect:"Serotonin syndrome risk" },
];
const VITAL_THRESHOLDS = {
  bpSystolic:  { low:90,  high:180, critHigh:200, label:"Systolic BP" },
  bpDiastolic: { low:60,  high:110, critHigh:120, label:"Diastolic BP" },
  hr:          { low:50,  high:100, critHigh:130, label:"Heart Rate" },
  temp:        { low:96,  high:99.5,critHigh:103, label:"Temperature" },
  o2:          { low:94,  high:100, critHigh:null, label:"O\u2082 Saturation" },
  weight:      { low:80,  high:400, critHigh:null, label:"Weight" },
};
const INIT_INVENTORY = [
  { id:1,  name:"Examination Gloves (M)",  category:"PPE",        qty:150, unit:"pairs",   reorderAt:50,  reorderQty:200, supplier:"MedSupply Co",  lastOrdered:"2026-01-10" },
  { id:2,  name:"Examination Gloves (L)",  category:"PPE",        qty:40,  unit:"pairs",   reorderAt:50,  reorderQty:200, supplier:"MedSupply Co",  lastOrdered:"2026-01-10" },
  { id:3,  name:"Surgical Masks",          category:"PPE",        qty:300, unit:"units",   reorderAt:100, reorderQty:500, supplier:"MedSupply Co",  lastOrdered:"2026-01-10" },
  { id:4,  name:"Alcohol Swabs",           category:"Supplies",   qty:500, unit:"units",   reorderAt:100, reorderQty:1000,supplier:"MedSupply Co",  lastOrdered:"2026-01-10" },
  { id:5,  name:"Blood Pressure Cuffs",    category:"Equipment",  qty:4,   unit:"units",   reorderAt:2,   reorderQty:5,   supplier:"ClinicEquip",   lastOrdered:"2025-11-05" },
  { id:6,  name:"Tongue Depressors",       category:"Supplies",   qty:80,  unit:"units",   reorderAt:50,  reorderQty:500, supplier:"MedSupply Co",  lastOrdered:"2026-01-10" },
  { id:7,  name:"Flu Vaccine (Vials)",     category:"Medication", qty:12,  unit:"vials",   reorderAt:10,  reorderQty:50,  supplier:"VaxDirect",     lastOrdered:"2025-10-01" },
  { id:8,  name:"Insulin Syringes",        category:"Supplies",   qty:25,  unit:"units",   reorderAt:30,  reorderQty:100, supplier:"MedSupply Co",  lastOrdered:"2026-01-10" },
  { id:9,  name:"Exam Table Paper",        category:"Supplies",   qty:8,   unit:"rolls",   reorderAt:5,   reorderQty:24,  supplier:"OfficeHealth",  lastOrdered:"2026-01-15" },
  { id:10, name:"Hand Sanitizer (500mL)",  category:"PPE",        qty:6,   unit:"bottles", reorderAt:4,   reorderQty:12,  supplier:"MedSupply Co",  lastOrdered:"2026-01-10" },
];
const INIT_STAFF_SCHEDULE = [
  { id:1,  staffId:1, staffName:"Dr. Priya Patel",   role:"doctor",       date:"2026-02-24", startTime:"08:00", endTime:"17:00", type:"regular" },
  { id:2,  staffId:2, staffName:"Dr. Owen Williams", role:"doctor",       date:"2026-02-24", startTime:"08:00", endTime:"17:00", type:"regular" },
  { id:3,  staffId:3, staffName:"James Torres",      role:"nurse",        date:"2026-02-24", startTime:"07:30", endTime:"16:00", type:"regular" },
  { id:4,  staffId:4, staffName:"Brianna Wells",     role:"receptionist", date:"2026-02-24", startTime:"08:00", endTime:"17:00", type:"regular" },
  { id:5,  staffId:1, staffName:"Dr. Priya Patel",   role:"doctor",       date:"2026-02-25", startTime:"08:00", endTime:"17:00", type:"regular" },
  { id:6,  staffId:2, staffName:"Dr. Owen Williams", role:"doctor",       date:"2026-02-25", startTime:"08:00", endTime:"13:00", type:"half-day" },
  { id:7,  staffId:3, staffName:"James Torres",      role:"nurse",        date:"2026-02-25", startTime:"07:30", endTime:"16:00", type:"regular" },
  { id:8,  staffId:4, staffName:"Brianna Wells",     role:"receptionist", date:"2026-02-25", startTime:"08:00", endTime:"17:00", type:"regular" },
  { id:9,  staffId:6, staffName:"Marcus Reed",       role:"nurse",        date:"2026-02-25", startTime:"12:00", endTime:"20:00", type:"regular" },
  { id:10, staffId:1, staffName:"Dr. Priya Patel",   role:"doctor",       date:"2026-02-26", startTime:"08:00", endTime:"17:00", type:"regular" },
  { id:11, staffId:3, staffName:"James Torres",      role:"nurse",        date:"2026-02-26", startTime:"07:30", endTime:"16:00", type:"regular" },
  { id:12, staffId:4, staffName:"Brianna Wells",     role:"receptionist", date:"2026-02-26", startTime:"08:00", endTime:"17:00", type:"regular" },
];
// INIT_VITALS_HISTORY replaced by INIT_VITALS_FULL (each entry has full vitals + recordedBy)
const INIT_VACCINES = {
  1:[
    { id:1, vaccine:"Influenza", date:"2025-10-01", given_by:"James Torres", lot:"FLU2025A", next_due:"2026-10-01" },
    { id:2, vaccine:"COVID-19 Booster", date:"2025-09-15", given_by:"James Torres", lot:"MOD2025B", next_due:null },
  ],
  2:[
    { id:1, vaccine:"Pneumococcal (PPSV23)", date:"2023-03-10", given_by:"Dr. Patel", lot:"PNM23C", next_due:null },
    { id:2, vaccine:"Shingles (Shingrix)", date:"2024-06-20", given_by:"Dr. Patel", lot:"SHX2024", next_due:"2025-06-20" },
  ],
};
const INIT_REFERRALS = {
  2:[
    { id:1, specialist:"Cardiologist", facility:"St. Mary's Heart Center", reason:"Chest pain evaluation", sentDate:"2026-01-18", status:"received", notes:"Appointment scheduled for Feb 5" },
  ],
  1:[
    { id:1, specialist:"Endocrinologist", facility:"Springfield Endocrine", reason:"Thyroid nodule follow-up", sentDate:"2026-02-01", status:"sent", notes:"" },
  ],
};
const INIT_TASKS = [
  { id:1, title:"Follow up with Robert Vásquez re: HbA1c results", assignedTo:"nurse", assignedBy:"doctor", assignedByName:"Dr. Priya Patel", patientId:2, patient:"Robert Vásquez", priority:"high", due:"2026-02-26", status:"pending", note:"" },
  { id:2, title:"Verify insurance for Aisha Okonkwo", assignedTo:"receptionist", assignedBy:"admin", assignedByName:"Sandra Kim", patientId:3, patient:"Aisha Okonkwo", priority:"medium", due:"2026-02-25", status:"pending", note:"" },
  { id:3, title:"Schedule follow-up for Margaret Chen - cholesterol panel", assignedTo:"receptionist", assignedBy:"doctor", assignedByName:"Dr. Priya Patel", patientId:1, patient:"Margaret Chen", priority:"low", due:"2026-03-01", status:"completed", note:"Scheduled for March 10" },
];
const INIT_AUDIT_LOG = [
  { id:1, user:"Dr. Priya Patel",  role:"doctor",       action:"Viewed",  subject:"Margaret Chen",  section:"Prescriptions", ts:"2026-02-25 09:02:14" },
  { id:2, user:"James Torres",     role:"nurse",        action:"Edited",  subject:"Robert Vásquez", section:"Vitals",         ts:"2026-02-25 09:15:33" },
  { id:3, user:"Brianna Wells",    role:"receptionist", action:"Viewed",  subject:"Aisha Okonkwo",  section:"Overview",       ts:"2026-02-25 09:30:07" },
  { id:4, user:"Dr. Priya Patel",  role:"doctor",       action:"Edited",  subject:"Robert Vásquez", section:"Notes",          ts:"2026-02-25 10:05:52" },
  { id:5, user:"James Torres",     role:"nurse",        action:"Viewed",  subject:"Derek Marsh",    section:"Prescriptions",  ts:"2026-02-25 10:22:41" },
  { id:6, user:"Sandra Kim",       role:"admin",        action:"Edited",  subject:"Thomas Reilly",  section:"Patient Info",   ts:"2026-02-25 11:00:03" },
  { id:7, user:"Dr. Priya Patel",  role:"doctor",       action:"Viewed",  subject:"Aisha Okonkwo",  section:"Overview",       ts:"2026-02-24 14:11:28" },
  { id:8, user:"Brianna Wells",    role:"receptionist", action:"Viewed",  subject:"Margaret Chen",  section:"Overview",       ts:"2026-02-24 08:45:19" },
  { id:9, user:"James Torres",     role:"nurse",        action:"Edited",  subject:"Yuki Tanaka",    section:"Vitals",         ts:"2026-02-24 09:03:55" },
  { id:10,user:"Sandra Kim",       role:"admin",        action:"Viewed",  subject:"Robert Vásquez", section:"Overview",       ts:"2026-02-23 16:30:00" },
];
// Staff accounts. The office admin can add accounts and change what each one can do (Admin panel → Users).
// Demo only: kept in this browser's localStorage with plain-text passwords. A real deployment needs a server (see PLANNED_CHANGES.md → Security).
const INIT_ACCOUNTS = [
  { id:1, name:"Dr. Priya Patel",   role:"doctor",       status:"active",   lastLogin:"2026-02-25 08:14", username:"doctor",       password:"Doctor1234!",   title:"Physician, MD",        demo:true },
  { id:2, name:"Dr. Owen Williams", role:"doctor",       status:"active",   lastLogin:"2026-02-25 07:58", username:"williams",     password:"Williams1234!", title:"Physician, MD" },
  { id:3, name:"James Torres",      role:"nurse",        status:"active",   lastLogin:"2026-02-25 08:02", username:"nurse",        password:"Nurse1234!",    title:"Registered Nurse",     demo:true },
  { id:4, name:"Brianna Wells",     role:"receptionist", status:"active",   lastLogin:"2026-02-25 07:45", username:"receptionist", password:"Recept1234!",   title:"Front Desk",           demo:true },
  { id:5, name:"Sandra Kim",        role:"admin",        status:"active",   lastLogin:"2026-02-25 08:30", username:"admin",        password:"Admin1234!",    title:"Office Administrator", demo:true },
  { id:6, name:"Marcus Reed",       role:"nurse",        status:"inactive", lastLogin:"2026-02-10 09:30", username:"mreed",        password:"Reed1234!",     title:"Registered Nurse" },
];
const DEMO_ORDER=["admin","doctor","nurse","receptionist"];
const ACCOUNTS_KEY="medplus.accounts";
// Every component reads the live account list from here, so new accounts show up in messages, schedules and dashboards
const StaffContext=React.createContext(INIT_ACCOUNTS);
const useStaff=()=>React.useContext(StaffContext);

// Seed some initial messages between staff members
// Key format: "senderUsername:recipientUsername" sorted alphabetically
const buildConvoKey = (a, b) => [a, b].sort().join(":");
const INIT_MESSAGES = {
  [buildConvoKey("doctor","nurse")]: [
    { id:1, from:"nurse",  text:"Good morning Dr. Patel! Margaret Chen is checked in and ready for vitals.", ts:"08:55", date:"2026-02-25" },
    { id:2, from:"doctor", text:"Thanks James. Please get her BP and weight first, she's on the hypertension follow-up protocol.", ts:"08:57", date:"2026-02-25" },
    { id:3, from:"nurse",  text:"On it. Her BP came back 124/80 — looking good.", ts:"09:04", date:"2026-02-25" },
    { id:4, from:"doctor", text:"Perfect, I'll head in shortly.", ts:"09:06", date:"2026-02-25" },
  ],
  [buildConvoKey("doctor","receptionist")]: [
    { id:1, from:"receptionist", text:"Hi Dr. Patel, Aisha Okonkwo called to confirm her 11am slot.", ts:"08:30", date:"2026-02-25" },
    { id:2, from:"doctor",       text:"Great, confirmed. She's a new patient so please make sure her intake forms are ready.", ts:"08:42", date:"2026-02-25" },
  ],
  [buildConvoKey("admin","nurse")]: [
    { id:1, from:"admin", text:"James, reminder that the new supply order form needs to be submitted by EOD.", ts:"08:10", date:"2026-02-25" },
    { id:2, from:"nurse", text:"Got it Sandra, I'll take care of it after morning rounds.", ts:"08:18", date:"2026-02-25" },
  ],
};

const PERMS = {
  admin:        { appointments:true,  patients:true,  vitals:false, viewVitals:true,  notes:false, prescriptions:false, viewRx:true,  writeRx:false, viewNotes:true,  writeNotes:false, recalls:true, admin:true,  settings:true,  messages:true, flow:true, reports:true,  refills:true,  refillApprove:false, tasks:true, inventory:true,  staffSchedule:true  , registerPatients:true,  createTasks:true, customiseDashboard:true },
  doctor:       { appointments:true,  patients:true,  vitals:true,  viewVitals:true,  notes:true,  prescriptions:true,  viewRx:true,  writeRx:true,  viewNotes:true,  writeNotes:true,  recalls:true, admin:false, settings:true,  messages:true, flow:true, reports:false, refills:true,  refillApprove:true,  tasks:true, inventory:false, staffSchedule:false , registerPatients:false, createTasks:true, customiseDashboard:true },
  nurse:        { appointments:true,  patients:true,  vitals:true,  viewVitals:true,  notes:false, prescriptions:false, viewRx:true,  writeRx:false, viewNotes:true,  writeNotes:false, recalls:true, admin:false, settings:false, messages:true, flow:true, reports:false, refills:true,  refillApprove:false, tasks:true, inventory:true,  staffSchedule:false , registerPatients:false, createTasks:false, customiseDashboard:true },
  receptionist: { appointments:true,  patients:true,  vitals:false, viewVitals:false, notes:false, prescriptions:false, viewRx:false, writeRx:false, viewNotes:false, writeNotes:false, recalls:true, admin:false, settings:false, messages:true, flow:true, reports:false, refills:true,  refillApprove:false, tasks:true, inventory:false, staffSchedule:false , registerPatients:true,  createTasks:false, customiseDashboard:true },
};
// What the admin can switch on or off per account. Dashboard is always available.
const PERM_GROUPS=[
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
const hasAdmin=a=>!!a&&a.status==="active"&&permsFor(a).admin;
const isAdminAddOn=a=>!!a&&a.role!=="admin"&&permsFor(a).admin;
const AdminMark=()=><span title="Has admin access" style={{display:"inline-flex",alignItems:"center",gap:4,height:18,padding:"0 6px",borderRadius:4,fontSize:11,fontWeight:500,color:C.text,background:C.raised,border:`1px solid ${C.border}`,verticalAlign:"middle"}}><ShieldCheck size={11} strokeWidth={2} aria-hidden="true"/>Admin</span>;
// A write permission needs its read permission; switching one changes the other
const PERM_NEEDS={vitals:"viewVitals",writeNotes:"viewNotes",writeRx:"viewRx",refillApprove:"refills"};
const roleDefaults=role=>PERMS[role]||PERMS.receptionist;
// Effective permissions: role defaults, then the account's own changes
function permsFor(user){
  const p={...roleDefaults(user?.role),...(user?.perms||{})};
  Object.entries(PERM_NEEDS).forEach(([w,r])=>{if(p[w])p[r]=true;});
  if(user?.role==="admin")p.admin=true;   // the office admin role is the admin job
  p.prescriptions=p.writeRx; p.notes=p.writeNotes;   // older keys still read in the chart
  return p;
}
const C = {
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
const RC = { admin:{bg:C.purpleBg,fg:C.purple}, doctor:{bg:C.blueBg,fg:C.blue}, nurse:{bg:C.greenBg,fg:C.green}, receptionist:{bg:C.amberBg,fg:C.amber} };
// Line icons (lucide): one set, 16px, 1.5 stroke, coloured by their text role
const ROLE_ICON = { admin:Briefcase, doctor:Stethoscope, nurse:HeartPulse, receptionist:CalendarCheck };
const NAV_ICON = { dashboard:LayoutDashboard, appointments:CalendarDays, flow:Columns3, patients:Users, refills:Pill, recalls:BellRing, reports:ChartColumn, tasks:ListChecks, inventory:Package, staffschedule:CalendarClock, admin:ShieldCheck, overview:LayoutDashboard, accounts:UserCog, audit:ScrollText, backup:Database };
const Icon=({as:I,size=16,style})=><I size={size} strokeWidth={1.5} aria-hidden="true" style={{flexShrink:0,...style}}/>;
// Logo: a flat plus in ink next to the wordmark. No gradient, no glow.
const Logo=({size=28,wordSize=16,color})=>(
  <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
    <div style={{width:size,height:size,borderRadius:6,background:C.navyMid,color:C.onAccent,display:"flex",alignItems:"center",justifyContent:"center"}}><Plus size={size*0.6} strokeWidth={2.5} aria-hidden="true"/></div>
    <div style={{fontWeight:600,fontSize:wordSize,color:color||C.text}}>Med+</div>
  </div>
);

function age(d){return Math.floor((new Date()-new Date(d))/31557600000);}
// Date-only strings ("2026-02-10") are read as local noon; new Date("2026-02-10") is UTC midnight and shows the previous day in US time zones
function fmt(d){const s=String(d);return new Date(/^\d{4}-\d{2}-\d{2}$/.test(s)?s+"T12:00:00":s).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}
function today(){return new Date().toISOString().split("T")[0];}
function nowTime(){return new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}

// Status pill: a coloured dot, dark text, a faint tint of the status colour behind it.
// Colour sits in the dot; the words do the work. "neutral" has no dot.
const BADGE_TONE={green:C.green,red:C.red,amber:C.amber,blue:C.blue,teal:C.teal,purple:C.purple,navy:C.muted,neutral:null};
const Badge=({color="blue",children,dot=true})=>{
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
const Dot=({color,size=8})=><span aria-hidden="true" style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:color,flexShrink:0}}/>;
// Transparent tint of any colour, including CSS variables (hex+alpha strings don't work on var(--…))
const tint=(color,pct)=>`color-mix(in srgb, ${color} ${pct}%, transparent)`;
// Status colours: one colour per visit status, used everywhere a status shows
const STATUS_TONE={scheduled:C.blue,"checked-in":C.teal,"with-nurse":C.purple,"in-progress":C.amber,completed:C.green,"no-show":C.red};
// ─── Vitals: the patient chart's moment ─────────────────────────────────────
// Display ranges for adult vitals: the shaded band is "in range", the track is the scale drawn.
const VITAL_SCALE={
  bp:    {label:"Blood pressure",unit:"mmHg",min:80, max:180,lo:90,  hi:129, read:v=>parseFloat(String(v).split("/")[0]), status:v=>{const[sy,di]=String(v).split("/").map(Number);return sy>=140||di>=90?"high":sy>=130||di>=80?"above":sy<90?"low":"ok";}},
  hr:    {label:"Heart rate",    unit:"bpm", min:40, max:140,lo:60,  hi:100},
  temp:  {label:"Temperature",   unit:"°F",  min:95, max:104,lo:97,  hi:99.5, high:100.4},
  o2:    {label:"O₂ saturation", unit:"%",   min:85, max:100,lo:95,  hi:100, low:90},
  weight:{label:"Weight",        unit:"lbs"},
  bmi:   {label:"BMI",           unit:"",    min:15, max:40, lo:18.5,hi:24.9, high:30},
};
const VITAL_WORD={ok:["In range",C.green],above:["Above range",C.amber],high:["High",C.red],low:["Low",C.amber],verylow:["Low",C.red]};
function vitalStatus(key,val){
  const sc=VITAL_SCALE[key]; if(!sc||sc.min==null||val==null||val==="")return null;
  if(sc.status)return sc.status(val);
  const n=parseFloat(val); if(isNaN(n))return null;
  if(sc.low!=null&&n<sc.low)return "verylow";
  if(n<sc.lo)return "low";
  if(sc.high!=null&&n>=sc.high)return "high";
  if(n>sc.hi)return "above";
  return "ok";
}
function VitalReadout({k,value,compact}){
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
const FLOW_STAGES=[
  {id:"scheduled",   label:"Scheduled",   color:C.blue,   empty:"No one left to arrive",     Icon:CalendarDays},
  {id:"checked-in",  label:"Checked in",  color:C.teal,   empty:"No one in the waiting room", Icon:ClipboardList},
  {id:"with-nurse",  label:"With nurse",  color:C.purple, empty:"No one with a nurse",        Icon:HeartPulse},
  {id:"in-progress", label:"With doctor", color:C.amber,  empty:"No one with a doctor",       Icon:Stethoscope},
  {id:"completed",   label:"Done",        color:C.green,  empty:"No visits finished yet",     Icon:Check},
];
// Signature: a coloured chart-tab on the left edge of a patient row, the colour of its visit status
const statusTab=(status)=>({boxShadow:`inset 3px 0 0 ${STATUS_TONE[status]||C.border}`});
// Times and record numbers set in mono with even figures
const TimeCell=({children,width=48})=><div style={{width,flexShrink:0,fontFamily:C.mono,fontSize:13,color:C.text2,fontVariantNumeric:"tabular-nums"}}>{children}</div>;
// Dashboard title: the day, not a greeting. The subline says whose view it is and the one fact that matters.
const DashHeader=({date,sub,title,actions,status})=>{
  const d=new Date(date+"T12:00:00");
  const day=d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  return <PageHeader title={title||day} status={status} meta={title?`${day} · ${sub}`:sub} actions={actions}/>;
};
const SB=({status})=>{const m={"checked-in":["teal","Checked in"],"in-progress":["amber","With doctor"],"with-nurse":["purple","With nurse"],scheduled:["blue","Scheduled"],completed:["green","Completed"],"no-show":["red","No-show"]};const[c,l]=m[status]||["blue",status];return <Badge color={c}>{l}</Badge>;};
// Visit type is a category, not a status: neutral, except urgent visits
const TB=({type})=><Badge color={type==="urgent"?"red":"neutral"}>{type.replace(/-/g," ")}</Badge>;
const Card=({children,style={},onClick,...rest})=><div onClick={onClick} className={onClick?"card-link":undefined} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-sm)",...style}} {...rest}>{children}</div>;
// Card title row: title (and an optional count/meta), an action link on the right. No rule under it.
const CardHead=({title,meta,action,onAction,children})=>(
  <div style={{padding:"16px 20px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
    <div style={{minWidth:0}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>{title}</div>{meta&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{meta}</div>}</div>
    {children}{action&&<button className="text-link" onClick={onAction} style={{fontSize:12,flexShrink:0}}>{action}</button>}
  </div>
);
// Page header: title, optional status pill, one grey meta line; actions on the right
const H1={fontSize:24,fontWeight:600,color:C.text,margin:0,letterSpacing:"-0.01em",lineHeight:1.25};
const SUB={color:C.muted,fontSize:13,marginTop:4};
const PageHeader=({title,status,meta,actions,style})=>(
  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,marginBottom:20,flexWrap:"wrap",...style}}>
    <div style={{minWidth:0}}>
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}><h1 style={H1}>{title}</h1>{status}</div>
      {meta&&<p style={SUB}>{meta}</p>}
    </div>
    {actions&&<div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>{actions}</div>}
  </div>
);
// Stat tile: icon + label, then the value (with a status dot when it means something), then context
const StatCard=({label,value,sub,tone,onClick,icon,dot})=>{
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
const KVGrid=({items,cols=4})=>(
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
const Alert=({tone="red",title,meta,onClick,actions,children,style})=>{
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
const Timeline=({steps})=>(
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
const Locked=({msg})=>(
  <div style={{padding:"24px 32px"}}>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"56px 32px",textAlign:"center",maxWidth:480,margin:"0 auto"}}>
      <Lock size={32} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,marginBottom:16}}/>
      <div style={{fontWeight:600,fontSize:16,color:C.text,marginBottom:8}}>Access restricted</div>
      <div style={{color:C.muted,fontSize:14}}>{msg||"Your role doesn't have access to this section."}</div>
    </div>
  </div>
);

function Modal({title,onClose,children,width=560}){
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

const IS={width:"100%",padding:"8px 12px",lineHeight:"18px",borderRadius:6,border:`1px solid ${C.border2}`,fontSize:14,color:C.text,outline:"none",background:C.surface,boxSizing:"border-box",fontFamily:"inherit"};
const SS={...IS,appearance:"none",cursor:"pointer"};
const LS={display:"block",fontSize:13,fontWeight:500,color:C.text2,marginBottom:6};
const FF=({label,children})=><div><label style={LS}>{label}</label>{children}</div>;
const FR=({children,cols=2})=><div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:16,marginBottom:16}}>{children}</div>;
const OK=({msg})=><Alert tone="green" title={msg} style={{marginBottom:20}}/>;
const PB=({onClick,children,disabled})=>(<button onClick={onClick} disabled={disabled} className="btn btn-primary">{children}</button>);
const XB=({onClick,children})=>(<button onClick={onClick} className="btn btn-secondary">{children}</button>);
function LoadingButton({onClick,children,disabled,loading,style}){
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
const INSURANCE_BADGES = {
  "BlueCross":    { abbr:"BC" },
  "Medicare":     { abbr:"MC" },
  "Medicaid":     { abbr:"MD" },
  "Aetna":        { abbr:"AET" },
  "UnitedHealth": { abbr:"UHC" },
  "Cigna":        { abbr:"CGN" },
  "Humana":       { abbr:"HUM" },
  "Kaiser":       { abbr:"KP" },
};

function InsuranceBadge({ insurance }) {
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
function TimeInStage({ stageEnteredAt }) {
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
function StaffAvatar({ name, role, size=32, fontSize=12 }) {
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

// ─── MESSAGES PAGE ──────────────────────────────────────────────────────────
function MessagesPage({ user, messages, setMessages, compact = false, contactId, setContactId, onMinimize }) {
  const STAFF_LIST = useStaff().filter(s => s.status === "active" || s.username === user.username);
  // Build contact list: all staff except the current user
  const contacts = STAFF_LIST.filter(s => s.username !== user.username);
  // Active conversation can be controlled by the parent (shared between popup and full page)
  const defaultId = compact ? null : (contacts[0]?.username ?? null);
  const [localId, setLocalId] = useState(defaultId);
  const activeId = setContactId ? (contactId ?? defaultId) : localId;
  const setActiveId = setContactId || setLocalId;
  const activeContact = contacts.find(c => c.username === activeId) || null;
  const setActiveContact = (c) => setActiveId(c ? c.username : null);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const convoKey = activeContact ? buildConvoKey(user.username, activeContact.username) : null;
  const convo = convoKey ? (messages[convoKey] || []) : [];

  // Count unread (messages sent to me in each convo that I haven't "seen")
  // For demo purposes, messages seeded before login are treated as unread if from other person
  function getUnread(contact) {
    const key = buildConvoKey(user.username, contact.username);
    const msgs = messages[key] || [];
    return msgs.filter(m => m.from === contact.username && !m.read).length;
  }

  // Mark messages as read when opening a convo
  useEffect(() => {
    if (!convoKey) return;
    setMessages(prev => {
      const existing = prev[convoKey] || [];
      const updated = existing.map(m =>
        m.from !== user.username ? { ...m, read: true } : m
      );
      return { ...prev, [convoKey]: updated };
    });
  }, [convoKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [convo.length, activeContact]);

  const sendMessage = () => {
    if (!draft.trim() || !activeContact) return;
    const msg = {
      id: Date.now(),
      from: user.username,
      text: draft.trim(),
      ts: nowTime(),
      date: today(),
      read: false,
    };
    setMessages(prev => ({
      ...prev,
      [convoKey]: [...(prev[convoKey] || []), msg],
    }));
    setDraft("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = contacts.reduce((sum, c) => sum + getUnread(c), 0);

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* ── Contact list (in the popup it's only shown when no conversation is open) ── */}
      {(!compact || !activeContact) && (
      <div style={{
        width: compact ? "100%" : 280, flexShrink: 0, borderRight: compact ? "none" : `1px solid ${C.border}`,
        background: C.surface, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: compact ? "12px 14px" : "20px 18px 14px", borderBottom: `1px solid ${C.border}` }}>
          {!compact && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: C.text, flex: 1 }}>Messages</div>
            {totalUnread > 0 && (
              <span style={{
                background: C.navyMid, color: C.onAccent, fontSize: 11, fontWeight: 600,
                padding: "1px 8px", borderRadius: 8,
              }}>{totalUnread}</span>
            )}
            {onMinimize && (
              <button onClick={onMinimize} title="Shrink to popup" style={{
                fontSize: 12, fontWeight: 600, color: C.navyMid, background: "none",
                border: `1px solid ${C.border}`, borderRadius: 999, padding: "4px 10px", cursor: "pointer",
              }}><span style={{display:"inline-flex",alignItems:"center",gap:4}}><Minimize2 size={12} strokeWidth={1.5} aria-hidden="true"/>Popup</span></button>
            )}
          </div>
          )}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search staff…"
            style={{
              width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${C.border}`,
              fontSize: 13, color: C.text, outline: "none", background: C.bg,
              boxSizing: "border-box", fontFamily: "inherit",
            }}
          />
        </div>

        {/* Contact list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredContacts.map(contact => {
            const key = buildConvoKey(user.username, contact.username);
            const msgs = messages[key] || [];
            const lastMsg = msgs[msgs.length - 1];
            const unread = getUnread(contact);
            const isActive = activeContact?.id === contact.id;

            return (
              <button
                key={contact.id}
                onClick={() => { setActiveContact(contact); setDraft(""); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%",
                  padding: "12px 20px", border: "none", cursor: "pointer", textAlign: "left",
                  background: isActive ? C.bg : "transparent",
                  borderLeft: isActive ? `3px solid ${C.navyMid}` : "3px solid transparent",
                  transition: "background-color 160ms var(--ease)",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.bg; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <StaffAvatar name={contact.name} role={contact.role} size={38} fontSize={13} />
                  {contact.status === "active" && (
                    <div style={{
                      position: "absolute", bottom: 0, right: 0,
                      width: 10, height: 10, borderRadius: "50%",
                      background: C.green, border: `2px solid ${C.surface}`,
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <div style={{ fontWeight: unread > 0 ? 600 : 600, fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
                      {contact.name}
                    </div>
                    {lastMsg && (
                      <div style={{ fontSize: 11, color: C.muted, flexShrink: 0, marginLeft: 4 }}>{lastMsg.ts}</div>
                    )}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160 }}>
                      {lastMsg
                        ? (lastMsg.from === user.username ? `You: ${lastMsg.text}` : lastMsg.text)
                        : <span style={{ fontStyle: "italic" }}>No messages yet</span>}
                    </div>
                    {unread > 0 && (
                      <span style={{
                        background: C.navyMid, color: C.onAccent, fontSize: 11, fontWeight: 600,
                        padding: "1px 6px", borderRadius: 8, flexShrink: 0, marginLeft: 4,
                      }}>{unread}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* ── Conversation panel ── */}
      {activeContact ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg }}>
          {/* Convo header */}
          <div style={{
            padding: compact ? "10px 14px" : "14px 24px", background: C.surface, borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: compact ? 10 : 14, flexShrink: 0,
          }}>
            {compact && (
              <button onClick={() => setActiveContact(null)} title="Back to contacts" style={{
                width: 28, height: 28, borderRadius: "50%", border: "none", background: C.bg,
                color: C.text, fontSize: 16, cursor: "pointer", flexShrink: 0,
              }} aria-label="Back to contacts"><ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true"/></button>
            )}
            <div style={{ position: "relative" }}>
              <StaffAvatar name={activeContact.name} role={activeContact.role} size={compact ? 32 : 40} fontSize={compact ? 12 : 14} />
              {activeContact.status === "active" && (
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 11, height: 11, borderRadius: "50%",
                  background: C.green, border: `2px solid ${C.surface}`,
                }} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{activeContact.name}</div>
              <div style={{ fontSize: 12, color: C.muted, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <span style={{ textTransform: "capitalize" }}>{activeContact.role}</span>
                <span>·</span>
                <span style={{ color: activeContact.status === "active" ? C.green : C.muted, fontWeight: 600 }}>
                  {activeContact.status === "active" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", padding: compact ? "12px 14px" : "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            {convo.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.muted }}>
                <MessageSquare size={32} strokeWidth={1.5} aria-hidden="true" style={{ marginBottom: 12 }}/>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>No messages yet</div>
                <div style={{ fontSize: 13 }}>Send a message to {activeContact.name.split(" ")[0]}</div>
              </div>
            ) : (
              <>
                {/* Group messages by date */}
                {(() => {
                  const groups = [];
                  let lastDate = null;
                  convo.forEach((msg, idx) => {
                    if (msg.date !== lastDate) {
                      groups.push({ type: "date", date: msg.date, key: "d-" + idx });
                      lastDate = msg.date;
                    }
                    groups.push({ type: "msg", msg, key: "m-" + msg.id });
                  });
                  return groups.map(item => {
                    if (item.type === "date") {
                      const label = item.date === today() ? "Today" : fmt(item.date);
                      return (
                        <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 12, margin: "12px 0 8px" }}>
                          <div style={{ flex: 1, height: 1, background: C.border }} />
                          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{label}</div>
                          <div style={{ flex: 1, height: 1, background: C.border }} />
                        </div>
                      );
                    }
                    const { msg } = item;
                    const isMine = msg.from === user.username;
                    const sender = STAFF_LIST.find(s => s.username === msg.from);
                    return (
                      <div key={item.key} style={{
                        display: "flex", flexDirection: isMine ? "row-reverse" : "row",
                        alignItems: "flex-end", gap: 8, marginBottom: 6,
                      }}>
                        {!isMine && sender && (
                          <StaffAvatar name={sender.name} role={sender.role} size={28} fontSize={10} />
                        )}
                        <div style={{ maxWidth: compact ? "78%" : "65%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", gap: 4 }}>
                          {!isMine && sender && (
                            <div style={{ fontSize: 11, color: C.muted, marginLeft: 2, fontWeight: 600 }}>
                              {sender.name.split(" ")[0]}
                            </div>
                          )}
                          <div style={{
                            padding: "8px 16px",
                            borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: isMine ? C.navyMid : C.surface,
                            color: isMine ? C.onAccent : C.text,
                            fontSize: 13, lineHeight: 1.5,
                            boxShadow: "none",
                            border: isMine ? "none" : `1px solid ${C.border}`,
                            wordBreak: "break-word",
                          }}>
                            {msg.text}
                          </div>
                          <div style={{ fontSize: 11, color: C.muted, paddingLeft: 2, paddingRight: 2 }}>{msg.ts}</div>
                        </div>
                      </div>
                    );
                  });
                })()}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {/* Input bar */}
          <div style={{
            padding: compact ? "10px 12px" : "14px 24px", background: C.surface, borderTop: `1px solid ${C.border}`,
            display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Message ${activeContact.name.split(" ")[0]}… (Enter to send)`}
              rows={1}
              style={{
                flex: 1, padding: "10px 16px", borderRadius: 16,
                border: `1px solid ${C.border}`, fontSize: 13, color: C.text,
                outline: "none", resize: "none", fontFamily: "inherit",
                background: C.bg, lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
              }}
              onInput={e => {
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!draft.trim()}
              style={{
                width: 40, height: 40, borderRadius: "50%", border: "none",
                background: draft.trim() ? C.navyMid : C.border,
                color: draft.trim() ? C.onAccent : C.muted, fontSize: 16, cursor: draft.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background-color 160ms var(--ease)",
              }}
              aria-label="Send"
            ><ArrowUp size={18} strokeWidth={2} aria-hidden="true"/></button>
          </div>
        </div>
      ) : !compact && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, color: C.muted, flexDirection: "column", gap: 8 }}>
          <MessageSquare size={32} strokeWidth={1.5} aria-hidden="true"/>
          <div style={{ fontWeight: 600 }}>Select a conversation</div>
        </div>
      )}
    </div>
  );
}

// ─── Messages popup docked at the bottom-right ──────────────────────────────
function MessagesDock({ user, messages, setMessages, unread, open, setOpen, contactId, setContactId, onMaximize }) {
  const iconBtn = {
    width: 28, height: 28, borderRadius: 6, border: "none",
    color: C.text2, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  };
  const unreadBadge = unread > 0 && (
    <span style={{ background: C.red, color: "var(--c-surface)", fontSize: 11, fontWeight: 500, padding: "2px 6px", borderRadius: 6, fontVariantNumeric: "tabular-nums" }}>{unread}</span>
  );
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: "fixed", bottom: 0, right: 24, zIndex: 900, width: 210,
        display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
        background: C.surface, color: C.text, border: `1px solid ${C.border}`, borderBottom: "none", borderRadius: "12px 12px 0 0",
        boxShadow: "var(--shadow-lg)", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
      }}>
        <Icon as={MessageSquare} style={{ color: C.navyMid }}/><span style={{ flex: 1, textAlign: "left" }}>Messages</span>{unreadBadge}<Icon as={ChevronUp} style={{ color: C.muted }}/>
      </button>
    );
  }
  return (
    <div style={{
      position: "fixed", bottom: 0, right: 24, zIndex: 900, width: 310, height: 420, maxHeight: "calc(100vh - 90px)",
      display: "flex", flexDirection: "column", background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: "12px 12px 0 0", boxShadow: "var(--shadow-lg)", overflow: "hidden", animation: "rise 220ms var(--ease)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px 6px 16px", background: C.surface, color: C.text, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <Icon as={MessageSquare} style={{ color: C.navyMid }}/><span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>Messages</span>{unreadBadge}
        <button onClick={onMaximize} title="Open full page" aria-label="Open full page" className="icon-btn" style={iconBtn}><Icon as={Maximize2}/></button>
        <button onClick={() => setOpen(false)} title="Minimize" aria-label="Minimize" className="icon-btn" style={iconBtn}><Icon as={ChevronDown}/></button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <MessagesPage user={user} messages={messages} setMessages={setMessages} compact contactId={contactId} setContactId={setContactId} />
      </div>
    </div>
  );
}

function addDaysToDate(dateStr, days){
  const d=new Date(dateStr+"T12:00:00");
  d.setDate(d.getDate()+days);
  return d.toISOString().split("T")[0];
}

function NewApptModal({onClose,onSave,patients,defaultDate,appts=[],prefillTime,blockTimes=[],prefill={}}){
  const[f,sf]=useState({pid:prefill.pid||"",date:prefill.date||defaultDate||today(),time:prefillTime||"09:00",dur:"30",doc:prefill.doc||"Dr. Patel",type:prefill.type||"routine",notes:prefill.notes||""});
  const[ok,sok]=useState(false);
  const[conflict,setConflict]=useState(null);
  const[forceOk,setForceOk]=useState(false);
  const[dirty,setDirty]=useState(false);
  const[savingAppt,setSavingAppt]=useState(false);
  const[recurring,setRecurring]=useState(false);
  const[recFreq,setRecFreq]=useState("Weekly");
  const[recCount,setRecCount]=useState(3);
  const[recurDates,setRecurDates]=useState([]);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setConflict(null);setForceOk(false);setDirty(true);};
  const handleClose=()=>{if(dirty&&!window.confirm("You have unsaved changes. Are you sure?"))return;onClose();};
  const freqDays={Weekly:7,"Bi-weekly":14,Monthly:30,"Every 3 months":91};
  const getRecurDates=()=>{
    const days=freqDays[recFreq]||7;
    const dates=[];
    for(let i=0;i<recCount;i++){dates.push(addDaysToDate(f.date,i*days));}
    return dates;
  };
  useState(()=>{if(recurring)setRecurDates(getRecurDates());},[recurring,recFreq,recCount,f.date]);
  const previewDates=recurring?getRecurDates():[];
  const checkConflict=()=>{
    const [sh,sm]=f.time.split(":").map(Number);
    const startMin=sh*60+sm;const endMin=startMin+parseInt(f.dur);
    return appts.find(a=>{
      if(a.date!==f.date||a.doctor!==f.doc||a.status==="no-show"||a.status==="completed")return false;
      const[ah,am]=a.time.split(":").map(Number);
      const aStart=ah*60+am;const aEnd=aStart+a.duration;
      return startMin<aEnd&&endMin>aStart;
    });
  };
  // Double-booking: same patient same date
  const doubleBook=f.pid?appts.find(a=>{
    const pt=patients.find(p=>p.id===parseInt(f.pid));
    if(!pt)return false;
    return a.date===f.date&&a.patient===`${pt.first_name} ${pt.last_name}`&&a.status!=="no-show"&&a.status!=="completed";
  }):null;
  // Block time check
  const blockedSlot=(blockTimes||[]).find(b=>{
    if(b.doctor!==f.doc&&b.doctor!=="Dr. Patel"&&b.doctor!=="All")return false;
    if(b.date!==f.date)return false;
    const[sh,sm]=f.time.split(":").map(Number);const start=sh*60+sm;const end=start+parseInt(f.dur);
    const[bh,bm]=b.from.split(":").map(Number);const bStart=bh*60+bm;
    const[eh,em]=b.to.split(":").map(Number);const bEnd=eh*60+em;
    return start<bEnd&&end>bStart;
  });
  const sub=()=>{
    if(!f.pid)return;
    if(!forceOk){const c=checkConflict();if(c){setConflict(c);return;}}
    setSavingAppt(true);
    setTimeout(()=>{
      const pt=patients.find(p=>p.id===parseInt(f.pid));
      if(recurring){
        const dates=getRecurDates();
        dates.forEach((d,i)=>{
          onSave({id:Date.now()+i,patient:`${pt.first_name} ${pt.last_name}`,type:f.type,time:f.time,duration:parseInt(f.dur),doctor:f.doc,status:"scheduled",date:d});
        });
      } else {
        onSave({id:Date.now(),patient:`${pt.first_name} ${pt.last_name}`,type:f.type,time:f.time,duration:parseInt(f.dur),doctor:f.doc,status:"scheduled",date:f.date});
      }
      setSavingAppt(false);
      sok(true);setTimeout(onClose,1400);
    },500);
  };
  return(
    <Modal title="New Appointment" onClose={handleClose}>
      {ok&&<OK msg={recurring?`${previewDates.length} recurring appointments scheduled!`:"Appointment scheduled"}/>}
      <FR cols={1}><FF label="Patient"><select value={f.pid} onChange={e=>s("pid",e.target.value)} style={SS}><option value="">Select a patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}</select></FF></FR>
      {doubleBook&&<div style={{background:C.amberBg,border:`1px solid color-mix(in srgb, ${C.amber} 18%, var(--c-surface))`,borderRadius:8,padding:"10px 16px",marginBottom:12,fontSize:12,color:C.amber}}><strong>Note:</strong> {doubleBook.patient} already has an appointment at {doubleBook.time} with {doubleBook.doctor} on this date.</div>}
      <FR><FF label="Date"><input type="date" value={f.date} onChange={e=>s("date",e.target.value)} style={IS}/></FF><FF label="Time"><input type="time" value={f.time} onChange={e=>s("time",e.target.value)} style={IS}/></FF></FR>
      <div style={{marginBottom:16}}>
        <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
          <input type="checkbox" checked={recurring} onChange={e=>setRecurring(e.target.checked)} style={{width:15,height:15}}/>
          <span style={{fontSize:13,fontWeight:600,color:C.text}}>Recurring Appointment</span>
        </label>
        {recurring&&(
          <div style={{marginTop:10,paddingLeft:24,display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
            <FF label="Frequency"><select value={recFreq} onChange={e=>setRecFreq(e.target.value)} style={{...SS,width:160}}>
              {["Weekly","Bi-weekly","Monthly","Every 3 months"].map(o=><option key={o}>{o}</option>)}
            </select></FF>
            <FF label="Occurrences"><input type="number" min={1} max={12} value={recCount} onChange={e=>setRecCount(Math.max(1,Math.min(12,parseInt(e.target.value)||1)))} style={{...IS,width:80}}/></FF>
          </div>
        )}
        {recurring&&previewDates.length>0&&(
          <div style={{marginTop:10,background:C.blueBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 16px",fontSize:12}}>
            <div style={{fontWeight:600,color:C.navyMid,marginBottom:6}}>{previewDates.length} appointments will be created on:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{previewDates.map((d,i)=><span key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 8px",color:C.text}}>{d}</span>)}</div>
          </div>
        )}
      </div>
      <FR>
        <FF label="Doctor"><select value={f.doc} onChange={e=>s("doc",e.target.value)} style={SS}><option>Dr. Patel</option><option>Dr. Williams</option></select></FF>
        <FF label="Duration"><select value={f.dur} onChange={e=>s("dur",e.target.value)} style={SS}><option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option></select></FF>
      </FR>
      {blockedSlot&&<Alert tone="amber" title={`${blockedSlot.reason} block for ${blockedSlot.doctor}, ${blockedSlot.from}–${blockedSlot.to}`} meta="You can still book" style={{marginBottom:12}}/>}
      <FR cols={1}><FF label="Appointment type"><select value={f.type} onChange={e=>s("type",e.target.value)} style={SS}><option value="routine">Routine</option><option value="follow-up">Follow-up</option><option value="urgent">Urgent</option><option value="new-patient">New patient</option><option value="procedure">Procedure</option></select></FF></FR>
      <FR cols={1}><FF label="Notes (optional)"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={3} placeholder="Reason for visit or special instructions…" style={{...IS,resize:"vertical"}}/></FF></FR>
      {conflict&&!forceOk&&(
        <Alert tone="amber" title="Scheduling conflict" style={{marginBottom:16}} actions={<button onClick={()=>setForceOk(true)} className="btn btn-secondary btn-sm">Book anyway</button>}>
          {f.doc} already has {conflict.patient} at {conflict.time} on this date.
        </Alert>
      )}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><LoadingButton onClick={sub} disabled={!f.pid||ok} loading={savingAppt}>Schedule Appointment</LoadingButton></div>
    </Modal>
  );
}

const DEMO_SCAN={fn:"Eleanor",ln:"Whitmore",dob:"1959-03-14",gender:"F",phone:"555-0847",email:"eleanor.whitmore@email.com",address:"47 Oak Lane, Springfield, IL 62702",ins:"Medicare",ins_id:"1EG4-TE5-MK72",ec_name:"Robert Whitmore",ec_phone:"555-0849",allergies:"Penicillin, Aspirin"};
const SCAN_STEPS=["Reading document…","Detecting patient info…","Extracting demographics…","Parsing insurance details…","Filling form fields…"];

function NewPatientModal({onClose,onSave}){
  const[f,sf]=useState({fn:"",ln:"",dob:"",gender:"",phone:"",email:"",address:"",ins:"",ins_id:"",ec_name:"",ec_phone:"",allergies:""});
  const[ok,sok]=useState(false);
  const[dirty,setDirty]=useState(false);
  const[scanning,setScanning]=useState(false);
  const[scanStep,setScanStep]=useState(0);
  const[scanDone,setScanDone]=useState(false);
  const[dragOver,setDragOver]=useState(false);
  const fileRef=useRef(null);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setDirty(true);};
  const handleClose=()=>{if(dirty&&!window.confirm("You have unsaved changes. Are you sure?"))return;onClose();};
  const sub=()=>{
    if(!f.fn||!f.ln||!f.dob)return;
    onSave({id:Date.now(),first_name:f.fn,last_name:f.ln,dob:f.dob,gender:f.gender,phone:f.phone,insurance:f.ins,allergies:f.allergies?f.allergies.split(",").map(a=>a.trim()).filter(Boolean):[],lastVisit:today()});
    sok(true);setTimeout(onClose,1400);
  };
  const runScan=()=>{
    if(scanning||scanDone)return;
    setScanning(true);setScanStep(0);
    let step=0;
    const iv=setInterval(()=>{
      step++;
      if(step<SCAN_STEPS.length){setScanStep(step);}
      else{
        clearInterval(iv);
        sf(DEMO_SCAN);setDirty(true);
        setScanning(false);setScanDone(true);
      }
    },520);
  };
  const onFile=(e)=>{const file=e.target.files?.[0];if(file)runScan();};
  const onDrop=(e)=>{e.preventDefault();setDragOver(false);if(e.dataTransfer.files?.[0])runScan();};
  return(
    <Modal title="New Patient Registration" onClose={handleClose} width={640}>
      {ok&&<OK msg="Patient registered"/>}
      {/* ── Document upload zone ── */}
      {!scanDone&&!scanning&&(
        <div
          onClick={()=>fileRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={onDrop}
          style={{border:`1px dashed ${dragOver?C.text2:C.border2}`,borderRadius:8,padding:"20px",marginBottom:20,textAlign:"center",cursor:"pointer",background:dragOver?C.raised:"transparent",transition:"background-color 160ms var(--ease), border-color 160ms var(--ease)"}}>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.tiff" style={{display:"none"}} onChange={onFile}/>
          <ScanLine size={24} strokeWidth={1.5} aria-hidden="true" style={{color:C.text2,marginBottom:8}}/>
          <div style={{fontWeight:600,fontSize:14,color:C.text,marginBottom:4}}>Upload a scanned document to fill the form</div>
          <div style={{fontSize:12,color:C.muted}}>Intake form, insurance card, referral letter — drag & drop or click to browse</div>
          <div className="btn btn-secondary btn-sm" style={{marginTop:12}}>Choose file</div>
        </div>
      )}
      {scanning&&(
        <div style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"20px",marginBottom:20,textAlign:"center"}}>
          <ScanLine size={24} strokeWidth={1.5} aria-hidden="true" style={{color:C.text2,marginBottom:8}}/>
          <div style={{fontWeight:600,fontSize:13,color:C.text,marginBottom:6}}>Scanning document…</div>
          <div role="status" style={{fontSize:12,color:C.text2,marginBottom:12}}>{SCAN_STEPS[scanStep]}</div>
          <div style={{background:C.raised,borderRadius:3,height:4,overflow:"hidden"}}>
            <div style={{height:"100%",background:C.navyMid,borderRadius:4,transition:"width 400ms var(--ease)",width:`${((scanStep+1)/SCAN_STEPS.length)*100}%`}}/>
          </div>
        </div>
      )}
      {scanDone&&(
        <Alert tone="green" title="12 fields filled from the document" meta="Check them before registering" style={{marginBottom:16}}
          actions={<button onClick={()=>{setScanDone(false);sf({fn:"",ln:"",dob:"",gender:"",phone:"",email:"",address:"",ins:"",ins_id:"",ec_name:"",ec_phone:"",allergies:""});}} className="text-link">Clear the form</button>}/>
      )}
      <div style={{fontSize:12,color:C.muted,marginBottom:12}}>Personal Information</div>
      <FR><FF label="First name"><input value={f.fn} onChange={e=>s("fn",e.target.value)} style={IS} placeholder="Jane"/></FF><FF label="Last name"><input value={f.ln} onChange={e=>s("ln",e.target.value)} style={IS} placeholder="Doe"/></FF></FR>
      <FR><FF label="Date of birth"><input type="date" value={f.dob} onChange={e=>s("dob",e.target.value)} style={IS}/></FF><FF label="Gender"><select value={f.gender} onChange={e=>s("gender",e.target.value)} style={SS}><option value="">Select…</option><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option></select></FF></FR>
      <FR><FF label="Phone"><input value={f.phone} onChange={e=>s("phone",e.target.value)} style={IS} placeholder="555-0100"/></FF><FF label="Email"><input type="email" value={f.email} onChange={e=>s("email",e.target.value)} style={IS} placeholder="jane@email.com"/></FF></FR>
      <FR cols={1}><FF label="Address"><input value={f.address} onChange={e=>s("address",e.target.value)} style={IS} placeholder="123 Main St, City, ST 00000"/></FF></FR>
      <div style={{fontSize:12,color:C.muted,margin:"20px 0 12px"}}>Insurance</div>
      <FR><FF label="Insurance provider"><input value={f.ins} onChange={e=>s("ins",e.target.value)} style={IS} placeholder="BlueCross, Medicare…"/></FF><FF label="Member ID"><input value={f.ins_id} onChange={e=>s("ins_id",e.target.value)} style={IS}/></FF></FR>
      <div style={{fontSize:12,color:C.muted,margin:"20px 0 12px"}}>Emergency Contact</div>
      <FR><FF label="Name"><input value={f.ec_name} onChange={e=>s("ec_name",e.target.value)} style={IS}/></FF><FF label="Phone"><input value={f.ec_phone} onChange={e=>s("ec_phone",e.target.value)} style={IS}/></FF></FR>
      <div style={{fontSize:12,color:C.muted,margin:"20px 0 12px"}}>Clinical</div>
      <FR cols={1}><FF label="Known allergies (comma-separated)"><input value={f.allergies} onChange={e=>s("allergies",e.target.value)} style={IS} placeholder="Penicillin, Sulfa, Latex…"/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><PB onClick={sub} disabled={!f.fn||!f.ln||!f.dob||ok}>Register patient</PB></div>
    </Modal>
  );
}

function VitalsModal({patient,onClose,onSave}){
  const[f,sf]=useState({sys:"",dia:"",hr:"",temp:"",wt:"",ht:"",o2:"",notes:""});
  const[ok,sok]=useState(false);
  const s=(k,v)=>sf(p=>({...p,[k]:v}));
  const bmi=f.wt&&f.ht?((parseInt(f.wt)/(parseInt(f.ht)**2))*703).toFixed(1):null;
  const sub=()=>{
    onSave(patient.id,{bp:`${f.sys}/${f.dia}`,hr:parseInt(f.hr),temp:parseFloat(f.temp),o2:parseInt(f.o2),weight:parseInt(f.wt),bmi:parseFloat(bmi)||0});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title={`Record Vitals — ${patient.first_name} ${patient.last_name}`} onClose={onClose} width={520}>
      {ok&&<OK msg="Vitals recorded"/>}
      {patient.allergies.length>0&&<Alert tone="red" title="Allergies" meta={patient.allergies.join(", ")} style={{marginBottom:16}}/>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        <div><label style={LS}>Systolic</label><input value={f.sys} onChange={e=>s("sys",e.target.value)} style={IS} placeholder="120" type="number"/></div>
        <div><label style={LS}>Diastolic</label><input value={f.dia} onChange={e=>s("dia",e.target.value)} style={IS} placeholder="80" type="number"/></div>
        <div><label style={LS}>Heart rate</label><input value={f.hr} onChange={e=>s("hr",e.target.value)} style={IS} placeholder="72" type="number"/></div>
      </div>
      <FR><FF label="Temperature °F"><input value={f.temp} onChange={e=>s("temp",e.target.value)} style={IS} placeholder="98.6" type="number" step="0.1"/></FF><FF label="O₂ sat %"><input value={f.o2} onChange={e=>s("o2",e.target.value)} style={IS} placeholder="98" type="number"/></FF></FR>
      <FR><FF label="Weight (lbs)"><input value={f.wt} onChange={e=>s("wt",e.target.value)} style={IS} placeholder="160" type="number"/></FF><FF label="Height (inches)"><input value={f.ht} onChange={e=>s("ht",e.target.value)} style={IS} placeholder="65" type="number"/></FF></FR>
      {bmi&&<div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"12px 16px",marginBottom:16,display:"flex",gap:20,alignItems:"center"}}><div><div style={{fontSize:12,color:C.muted,}}>BMI</div><div style={{fontSize:24,fontWeight:600,color:parseFloat(bmi)>30?C.red:parseFloat(bmi)>25?C.amber:C.green}}>{bmi}</div></div><div style={{fontSize:12,color:C.muted}}>{parseFloat(bmi)<18.5?"Underweight":parseFloat(bmi)<25?"Normal weight":parseFloat(bmi)<30?"Overweight":"Obese"}</div></div>}
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.sys||!f.dia||!f.hr||ok}>Save vitals</PB></div>
    </Modal>
  );
}

function calcDaysSupply(qty,sig){
  const qtyNum=parseInt((qty||"").replace(/\D/g,""));
  if(!qtyNum||!sig)return null;
  const s=sig.toLowerCase();
  let perDay=null;
  if(/four\s*times|qid|4\s*times/.test(s))perDay=4;
  else if(/three\s*times|tid|3\s*times/.test(s))perDay=3;
  else if(/twice|bid|two\s*times|2\s*times/.test(s))perDay=2;
  else if(/every\s*6/.test(s))perDay=4;
  else if(/every\s*8/.test(s))perDay=3;
  else if(/every\s*12/.test(s))perDay=2;
  else if(/once|daily|qd|od|every\s*day|1\s*time/.test(s))perDay=1;
  else if(/weekly|once\s*a?\s*week/.test(s))perDay=1/7;
  if(!perDay)return null;
  return Math.round(qtyNum/perDay);
}

function RxModal({patient,onClose,onSave,rx}){
  const[f,sf]=useState({med:"",dose:"",sig:"",qty:"",refills:"0",notes:""});
  const[ok,sok]=useState(false);
  const[dirty,setDirty]=useState(false);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setDirty(true);};
  const handleClose=()=>{if(dirty&&!window.confirm("You have unsaved changes. Are you sure?"))return;onClose();};
  const drugs=["Amoxicillin","Metformin","Lisinopril","Atorvastatin","Omeprazole","Levothyroxine","Amlodipine","Metoprolol","Gabapentin","Sertraline"];
  const daysSupply=calcDaysSupply(f.qty,f.sig);
  const existingMeds=(rx||[]).map(r=>r.med);
  const interactions=f.med?DRUG_INTERACTIONS.filter(di=>{
    const newMedLower=f.med.toLowerCase();
    const matchesNew=di.drugs.some(d=>newMedLower.includes(d.toLowerCase())||d.toLowerCase().includes(newMedLower));
    const matchesExisting=di.drugs.some(d=>existingMeds.some(em=>em.toLowerCase().includes(d.toLowerCase())||d.toLowerCase().includes(em.toLowerCase())));
    return matchesNew&&matchesExisting&&di.drugs.some(d=>newMedLower.includes(d.toLowerCase())||d.toLowerCase().includes(newMedLower))&&di.drugs.some(d=>existingMeds.some(em=>em.toLowerCase().includes(d.toLowerCase())||d.toLowerCase().includes(em.toLowerCase())));
  }):[];
  // Allergy check
  const patAllergies=(patient.allergies||[]);
  const allergyAlert=f.med?((()=>{
    const medL=f.med.toLowerCase();
    // Direct match
    for(const allergen of patAllergies){
      const aL=allergen.toLowerCase();
      if(medL.includes(aL)||aL.includes(medL)){
        return {type:"direct",allergen,med:f.med};
      }
    }
    // Cross-reactivity
    for(const allergen of patAllergies){
      const crossList=ALLERGY_CROSS_REACTIVITY[allergen]||[];
      for(const crossMed of crossList){
        const cL=crossMed.toLowerCase();
        if(medL.includes(cL)||cL.includes(medL)){
          return {type:"cross",allergen,med:f.med};
        }
      }
    }
    return null;
  })()):null;
  const sub=()=>{
    if(!f.med||!f.dose)return;
    onSave(patient.id,{id:Date.now(),med:f.med,dose:f.dose,sig:f.sig,qty:f.qty,refills:parseInt(f.refills),date:today()});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title={`New Prescription — ${patient.first_name} ${patient.last_name}`} onClose={handleClose} width={560}>
      {ok&&<OK msg="Prescription saved"/>}
      {patAllergies.length>0&&(
        <div style={{background:C.redBg,border:`1px solid color-mix(in srgb, ${C.red} 18%, var(--c-surface))`,borderRadius:8,padding:"10px 16px",marginBottom:16}}>
          <div style={{color:C.red,fontSize:12,fontWeight:500,marginBottom:4}}>Known Allergies</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {patAllergies.map(a=><span key={a} style={{background:C.red,color:"var(--c-surface)",fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:4}}>{a}</span>)}
          </div>
        </div>
      )}
      <FR cols={1}><FF label="Medication name"><input value={f.med} onChange={e=>s("med",e.target.value)} style={IS} placeholder="Start typing or pick below…" list="dl"/><datalist id="dl">{drugs.map(d=><option key={d} value={d}/>)}</datalist></FF></FR>
      {allergyAlert&&allergyAlert.type==="direct"&&(
        <Alert tone="red" title={`Allergy: patient is allergic to ${allergyAlert.allergen}`} style={{marginBottom:8}}>Do not prescribe without a documented override.</Alert>
      )}
      {allergyAlert&&allergyAlert.type==="cross"&&(
        <Alert tone="amber" title="Possible cross-reactivity" style={{marginBottom:8}}>Patient has a {allergyAlert.allergen} allergy; {allergyAlert.med} may cause a reaction.</Alert>
      )}
      {interactions.length>0&&interactions.map((di,i)=>(
        <Alert key={i} tone={di.severity==="high"?"red":"amber"} title={di.severity==="high"?"High-risk interaction":"Interaction caution"} meta={di.drugs.join(" + ")} style={{marginBottom:8}}>{di.effect}</Alert>
      ))}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{drugs.slice(0,6).map(d=><button key={d} onClick={()=>s("med",d)} style={{fontSize:12,height:28,padding:"0 10px",borderRadius:6,border:`1px solid ${f.med===d?C.border2:C.border}`,background:f.med===d?C.navyBg:C.surface,color:f.med===d?C.text:C.text2,cursor:"pointer",fontWeight:f.med===d?500:400,fontFamily:"inherit"}}>{d}</button>)}</div>
      <FR><FF label="Dose"><input value={f.dose} onChange={e=>s("dose",e.target.value)} style={IS} placeholder="500mg"/></FF><FF label="Quantity"><input value={f.qty} onChange={e=>s("qty",e.target.value)} style={IS} placeholder="30 tablets"/></FF></FR>
      <FR cols={1}><FF label="Instructions (sig)"><input value={f.sig} onChange={e=>s("sig",e.target.value)} style={IS} placeholder="Take once daily with food…"/></FF></FR>
      {daysSupply!==null&&<div style={{marginTop:-8,marginBottom:16,fontSize:13,color:C.text2,display:"flex",alignItems:"center",gap:6}}><Icon as={Info} size={14} style={{color:C.muted}}/>About {daysSupply} days' supply</div>}
      <FR cols={1}><FF label="Refills"><select value={f.refills} onChange={e=>s("refills",e.target.value)} style={SS}>{[0,1,2,3,5,11].map(n=><option key={n} value={n}>{n} refill{n!==1?"s":""}</option>)}</select></FF></FR>
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}} placeholder="Additional instructions…"/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><PB onClick={sub} disabled={!f.med||!f.dose||ok||!!(allergyAlert&&allergyAlert.type==="direct")}>Save prescription</PB></div>
    </Modal>
  );
}

function NoteModal({patient,onClose,onSave,user,draftNotes,setDraftNotes}){
  const draft=(draftNotes||{})[patient.id]||{};
  const[f,sf]=useState({chief:draft.chief||"",subj:draft.subj||"",obj:draft.obj||"",assess:draft.assess||"",plan:draft.plan||"",sign:false});
  const[ok,sok]=useState(false);
  const[medsConfirmed,setMedsConfirmed]=useState(false);
  const[medsTs,setMedsTs]=useState(null);
  const[dirty,setDirty]=useState(false);
  const[savingNote,setSavingNote]=useState(false);
  const s=(k,v)=>{sf(p=>({...p,[k]:v}));setDirty(true);};
  const handleClose=()=>{
    if(dirty&&!window.confirm("You have unsaved changes. Are you sure?"))return;
    // Save draft on close without signing
    if(dirty&&setDraftNotes){setDraftNotes(p=>({...p,[patient.id]:{chief:f.chief,subj:f.subj,obj:f.obj,assess:f.assess,plan:f.plan}}));}
    onClose();
  };
  const confirmMeds=()=>{setMedsConfirmed(true);setMedsTs(nowTime());};
  const sub=()=>{
    if(!f.chief||!f.assess)return;
    setSavingNote(true);
    setTimeout(()=>{
      const doctorName=user?.name||"Dr. Patel";
      const noteObj={id:Date.now(),date:today(),doctor:doctorName,chief:f.chief,assessment:f.assess,plan:f.plan,signed:f.sign};
      if(medsConfirmed)noteObj.medsReconciled={by:doctorName,at:medsTs};
      onSave(patient.id,noteObj);
      if(setDraftNotes)setDraftNotes(p=>{const n={...p};delete n[patient.id];return n;});
      setSavingNote(false);
      sok(true);setTimeout(onClose,1500);
    },500);
  };
  const soap=[
    {key:"subj",label:"S — Subjective",hint:"What the patient tells you",ph:"Patient's description of symptoms, history…"},
    {key:"obj", label:"O — Objective", hint:"What you observe/measure",    ph:"Exam findings, vitals, lab results…"},
    {key:"assess",label:"A — Assessment *",hint:"Clinical interpretation",  ph:"Diagnosis or differential diagnoses…"},
    {key:"plan",label:"P — Plan",         hint:"What happens next",         ph:"Treatment, referrals, follow-up…"},
  ];
  return(
    <Modal title={`Visit note · ${patient.first_name} ${patient.last_name}`} onClose={handleClose} width={680}>
      {ok&&<OK msg={f.sign?"Note signed and locked":"Note saved as draft"}/>}
      {!medsConfirmed?(
        <Alert tone="amber" title="Confirm the medication list is up to date" style={{marginBottom:16}} actions={<button onClick={confirmMeds} className="btn btn-secondary btn-sm"><Icon as={Check} size={14}/>Medications confirmed</button>}/>
      ):(
        <div style={{fontSize:12,color:C.muted,marginBottom:12,display:"flex",alignItems:"center",gap:6}}><Icon as={CircleCheck} size={14} style={{color:C.green}}/>Medications reconciled at {medsTs} by {user?.name||"Doctor"}</div>
      )}
      {draft.chief&&<div style={{marginBottom:12,fontSize:12,color:C.text2,display:"flex",alignItems:"center",gap:6}}><Icon as={NotebookPen} size={14} style={{color:C.muted}}/>Draft restored from your last session</div>}
      <FR cols={1}><FF label="Chief complaint"><input value={f.chief} onChange={e=>s("chief",e.target.value)} style={IS} placeholder="e.g. Follow-up for hypertension, chest pain x 2 days…"/></FF></FR>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {soap.map(sec=>(
          <div key={sec.key}>
            <div style={{marginBottom:6}}>
              <label style={{...LS,display:"inline"}}>{sec.label}</label>
              <span style={{fontSize:12,color:C.muted,marginLeft:8,fontStyle:"italic",textTransform:"none",letterSpacing:"normal"}}>{sec.hint}</span>
            </div>
            <textarea value={f[sec.key]} onChange={e=>s(sec.key,e.target.value)} rows={4} placeholder={sec.ph} style={{...IS,resize:"vertical",fontSize:13}}/>
          </div>
        ))}
      </div>
      <div style={{background:f.sign?C.amberBg:C.bg,border:`1px solid ${f.sign?C.amber:C.border}`,borderRadius:8,padding:"16px 16px",marginBottom:20}}>
        <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
          <input type="checkbox" checked={f.sign} onChange={e=>s("sign",e.target.checked)} style={{width:16,height:16,cursor:"pointer"}}/>
          <div>
            <div style={{fontWeight:600,fontSize:13,color:f.sign?C.amber:C.text}}>Sign &amp; Lock Note</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Once signed, this note cannot be edited.</div>
          </div>
        </label>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
        <XB onClick={handleClose}>Cancel</XB>
        <LoadingButton onClick={sub} disabled={!f.chief||!f.assess||ok} loading={savingNote}
          style={{background:f.sign?((!f.chief||!f.assess||ok||savingNote)?C.disabled:C.amber):((!f.chief||!f.assess||ok||savingNote)?C.disabled:C.navyMid)}}>
          {f.sign?"Sign & Lock":"Save Draft"}
        </LoadingButton>
      </div>
    </Modal>
  );
}

function RecallModal({onClose,onSave,patients}){
  const[f,sf]=useState({pid:"",reason:"",due:"",urgency:"medium",notes:""});
  const[ok,sok]=useState(false);
  const s=(k,v)=>sf(p=>({...p,[k]:v}));
  const reasons=["Annual physical","HbA1c recheck","BP medication review","Cholesterol panel","Mammogram due","Colonoscopy screening","Flu vaccine","Wound check","Lab results review"];
  const sub=()=>{
    if(!f.pid||!f.reason||!f.due)return;
    const pt=patients.find(p=>p.id===parseInt(f.pid));
    onSave({id:Date.now(),patient:`${pt.first_name} ${pt.last_name}`,reason:f.reason,due:f.due,urgency:f.urgency});
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title="Add Recall Flag" onClose={onClose} width={520}>
      {ok&&<OK msg="Recall flag added"/>}
      <FR cols={1}><FF label="Patient"><select value={f.pid} onChange={e=>s("pid",e.target.value)} style={SS}><option value="">Select a patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}</select></FF></FR>
      <FR cols={1}><FF label="Reason"><input value={f.reason} onChange={e=>s("reason",e.target.value)} style={IS} placeholder="e.g. Annual physical…" list="rl"/><datalist id="rl">{reasons.map(r=><option key={r} value={r}/>)}</datalist></FF></FR>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{reasons.slice(0,5).map(r=><button key={r} onClick={()=>s("reason",r)} style={{fontSize:11,padding:"4px 10px",borderRadius:6,border:`1px solid ${C.border}`,background:f.reason===r?C.blueBg:C.bg,color:f.reason===r?C.blue:C.muted,cursor:"pointer",fontWeight:600}}>{r}</button>)}</div>
      <FR><FF label="Due date"><input type="date" value={f.due} onChange={e=>s("due",e.target.value)} style={IS}/></FF><FF label="Urgency"><select value={f.urgency} onChange={e=>s("urgency",e.target.value)} style={SS}><option value="low">Low — Upcoming</option><option value="medium">Medium — This week</option><option value="high">High — Overdue/Urgent</option></select></FF></FR>
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.pid||!f.reason||!f.due||ok}>Add recall</PB></div>
    </Modal>
  );
}

// ─── App shell: sidebar + header ─────────────────────────────────────────────
const PAGE_LABEL={overview:"Overview",accounts:"Staff and accounts",audit:"Audit log",backup:"Backup",dashboard:"Dashboard",appointments:"Appointments",flow:"Patient flow",patients:"Patients",refills:"Refill queue",recalls:"Recalls",reports:"Reports",tasks:"Tasks",inventory:"Inventory",staffschedule:"Staff schedule",admin:"Admin panel",settings:"Settings",messages:"Messages"};
// Nav grouped by what each role does all day. Admin (office admin) leads with operations.
const NAV_GROUPS={
  admin:[
    {label:null,      ids:["dashboard","reports"]},
    {label:"Operations",ids:["staffschedule","inventory","tasks","admin"]},
    {label:"Clinical",  ids:["appointments","flow","patients","refills","recalls"]},
  ],
  default:[
    {label:null,      ids:["dashboard","flow","appointments"]},
    {label:"Patients",  ids:["patients","refills","recalls"]},
    {label:"Work",      ids:["tasks","inventory","staffschedule","reports"]},
  ],
};
// The "Manage clinic" area for accounts with admin access on top of their own role
const MANAGE_NAV=[
  {label:null,     ids:["overview"]},
  {label:"People", ids:["accounts","staffschedule"]},
  {label:"Clinic", ids:["reports","inventory"]},
  {label:"Records",ids:["audit","backup"]},
];
const MANAGE_ONLY=["overview","accounts","audit","backup"], MANAGE_SHARED=["staffschedule","reports","inventory"];
const initials=name=>name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2);

function Sidebar({page,setPage,user,recallCount,pendingRefills,onLogout,managing,onManage,onBackToWork}){
  const p=permsFor(user);
  const show={dashboard:true,appointments:p.appointments,flow:p.flow,patients:p.patients,refills:p.refills,recalls:p.recalls,reports:p.reports,tasks:p.tasks,inventory:p.inventory,staffschedule:p.staffSchedule,admin:p.admin};
  const badge={refills:p.refillApprove?pendingRefills:0,recalls:recallCount};
  const groups=managing?MANAGE_NAV:(NAV_GROUPS[user.role]||NAV_GROUPS.default).map(g=>({...g,ids:g.ids.filter(id=>show[id])})).filter(g=>g.ids.length);
  const addOn=isAdminAddOn(user);
  const[profileOpen,setProfileOpen]=useState(false);
  const profileRef=useRef(null);
  useEffect(()=>{
    const onClick=(e)=>{if(profileRef.current&&!profileRef.current.contains(e.target))setProfileOpen(false);};
    document.addEventListener("mousedown",onClick);
    return ()=>document.removeEventListener("mousedown",onClick);
  },[]);
  const menuItem={display:"flex",alignItems:"center",gap:10,width:"100%",height:36,padding:"0 10px",border:"none",borderRadius:6,background:"transparent",color:C.text,fontSize:13,textAlign:"left",cursor:"pointer",fontFamily:"inherit"};
  return(
    <nav aria-label="Main" style={{width:232,flexShrink:0,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{height:56,display:"flex",alignItems:"center",padding:"0 24px",flexShrink:0}}><Logo/></div>
      <div style={{flex:1,overflowY:"auto",padding:"8px 12px 12px"}}>
        {managing&&(
          <div style={{marginBottom:16}}>
            <button className="nav-item" onClick={onBackToWork}><Icon as={ArrowLeft} size={18}/><span style={{flex:1}}>Back to my work</span></button>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"16px 12px 0",fontSize:13,fontWeight:600,color:C.text}}><ShieldCheck size={16} strokeWidth={1.5} aria-hidden="true"/>Manage clinic</div>
          </div>
        )}
        {groups.map((g,gi)=>(
          <div key={gi} style={{marginTop:gi?20:0}}>
            {g.label&&<div style={{fontSize:12,color:C.muted,padding:"0 12px 6px"}}>{g.label}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:2}}>
              {g.ids.map(id=>{const n=badge[id]||0;return(
                <button key={id} className="nav-item" aria-current={page===id?"page":undefined} onClick={()=>setPage(id)}>
                  <Icon as={NAV_ICON[id]} size={18}/>
                  <span style={{flex:1,whiteSpace:"nowrap"}}>{PAGE_LABEL[id]}</span>
                  {n>0&&<span aria-label={`${n} need attention`} style={{minWidth:20,height:20,padding:"0 6px",borderRadius:10,fontSize:11,fontWeight:600,display:"inline-flex",alignItems:"center",justifyContent:"center",fontVariantNumeric:"tabular-nums",background:id==="recalls"?C.redBg:C.raised,color:id==="recalls"?C.red:C.text2}}>{n}</span>}
                </button>
              );})}
            </div>
          </div>
        ))}
      </div>
      <div ref={profileRef} style={{position:"relative",padding:12,borderTop:`1px solid ${C.border}`}}>
        {profileOpen&&(
          <div role="menu" style={{position:"absolute",bottom:"calc(100% - 4px)",left:12,right:12,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)",padding:6,zIndex:500,animation:"rise 160ms var(--ease)"}}>
            <div style={{padding:"8px 10px 10px",borderBottom:`1px solid ${C.border}`,marginBottom:6,display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.text2}}><Icon as={ROLE_ICON[user.role]} size={14}/><span style={{flex:1}}>{ROLE_LABEL[user.role]||user.role} account</span>{addOn&&<AdminMark/>}</div>
            {addOn&&(managing
              ?<button role="menuitem" className="icon-btn" onClick={()=>{setProfileOpen(false);onBackToWork();}} style={menuItem}><Icon as={ArrowLeft}/> Back to my work</button>
              :<button role="menuitem" className="icon-btn" onClick={()=>{setProfileOpen(false);onManage();}} style={menuItem}><Icon as={ShieldCheck}/> Manage clinic</button>)}
            {p.settings&&<button role="menuitem" className="icon-btn" onClick={()=>{setPage("settings");setProfileOpen(false);}} style={menuItem}><Icon as={Settings}/> Settings</button>}
            <button role="menuitem" className="icon-btn" onClick={()=>{setProfileOpen(false);onLogout();}} style={menuItem}><Icon as={LogOut}/> Log out</button>
          </div>
        )}
        <button onClick={()=>setProfileOpen(v=>!v)} aria-expanded={profileOpen} className="icon-btn" style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"8px 12px",border:"none",borderRadius:6,cursor:"pointer",textAlign:"left",fontFamily:"inherit"}}>
          <span style={{width:32,height:32,borderRadius:"50%",background:C.raised,border:`1px solid ${C.border}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:500,flexShrink:0}}>{initials(user.name)}</span>
          <span style={{flex:1,minWidth:0}}>
            <span style={{display:"block",fontSize:13,fontWeight:500,color:C.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</span>
            <span style={{display:"block",fontSize:12,color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.title}</span>
          </span>
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,transform:profileOpen?"rotate(180deg)":"none",transition:"transform 160ms var(--ease)"}}/>
        </button>
      </div>
    </nav>
  );
}

function TopBar({page,area,clinicName,onSearchClick,onMessagesClick,unreadMsgCount,canMessage,recentPatients,onOpenRecent,doctorReady,onToggleReady}){
  const[recentOpen,setRecentOpen]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{
    const onClick=(e)=>{if(ref.current&&!ref.current.contains(e.target))setRecentOpen(false);};
    document.addEventListener("mousedown",onClick);
    return ()=>document.removeEventListener("mousedown",onClick);
  },[]);
  const ghost={height:32,padding:"0 12px",borderRadius:6,border:`1px solid ${C.border2}`,background:C.surface,color:C.text,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",whiteSpace:"nowrap"};
  return(
    <header style={{height:56,flexShrink:0,display:"flex",alignItems:"center",gap:12,padding:"0 32px",borderBottom:`1px solid ${C.border}`,background:C.bg}}>
      <div aria-label="Breadcrumb" style={{display:"flex",alignItems:"center",gap:8,fontSize:13,minWidth:0,flex:1}}>
        <span style={{color:C.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{area||clinicName}</span>
        <span aria-hidden="true" style={{color:C.border2}}>/</span>
        <span style={{color:C.text,fontWeight:500,whiteSpace:"nowrap"}}>{PAGE_LABEL[page]||page}</span>
      </div>
      {onToggleReady&&(
        <button onClick={onToggleReady} aria-pressed={doctorReady} title="Let the front desk and nurses know if you can see the next patient" style={ghost}>
          <Dot color={doctorReady?C.green:C.amber}/>{doctorReady?"Ready for next patient":"Busy"}
        </button>
      )}
      {recentPatients.length>0&&(
        <div ref={ref} style={{position:"relative"}}>
          <button onClick={()=>setRecentOpen(v=>!v)} aria-expanded={recentOpen} style={ghost}>Recent patients <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted}}/></button>
          {recentOpen&&(
            <div role="menu" style={{position:"absolute",top:"calc(100% + 6px)",right:0,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)",minWidth:220,zIndex:500,padding:6}}>
              {recentPatients.map(pt=>(
                <button key={pt.id} role="menuitem" className="icon-btn" onClick={()=>{onOpenRecent(pt);setRecentOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",height:36,padding:"0 10px",border:"none",borderRadius:6,textAlign:"left",cursor:"pointer",fontSize:13,color:C.text,fontFamily:"inherit"}}>
                  <Icon as={UserRound} style={{color:C.muted}}/>{pt.first_name} {pt.last_name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={onSearchClick} style={{width:300,height:36,padding:"0 12px",borderRadius:6,border:`1px solid ${C.border2}`,background:C.surface,color:C.muted,fontSize:13,cursor:"text",textAlign:"left",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit"}}>
        <span style={{flex:1}}>Search patients, appointments…</span>
        <Icon as={Search}/>
      </button>
      {canMessage&&(
        <button onClick={onMessagesClick} title="Messages" aria-label={unreadMsgCount?`Messages, ${unreadMsgCount} unread`:"Messages"} className="icon-btn" style={{position:"relative",width:36,height:36,borderRadius:6,border:`1px solid ${C.border2}`,background:C.surface,display:"flex",alignItems:"center",justifyContent:"center",color:page==="messages"?C.text:C.text2,cursor:"pointer"}}>
          <Icon as={Mail}/>
          {unreadMsgCount>0&&<span style={{position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:C.red,border:`2px solid ${C.surface}`}}/>}
        </button>
      )}
    </header>
  );
}

const DEMO_TODAY="2026-02-25", DEMO_NOW="10:10";
const toMin=t=>{const[h,m]=String(t).split(":").map(Number);return h*60+(m||0);};
const lastName=n=>n.replace(/^Dr\.\s*/,"").split(" ").pop();

function FlowWidget({appts,setPage,flush}){
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
function ApptTable({rows,showDoctor=true,empty="No appointments"}){
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

function TasksWidget({tasks,setPage,today,style}){
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

function UpcomingWidget({appts}){
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

function RecallList({recalls,limit=4}){
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

const PageWrap=({children,max=1440})=><div style={{padding:"24px 32px 48px",maxWidth:max}}>{children}</div>;
// Segmented control: one neutral style for every view switch and filter in the app
function Segmented({options,value,onChange,size="md"}){
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
const Grid=({cols,children,style})=><div style={{display:"grid",gridTemplateColumns:cols,gap:12,marginBottom:12,alignItems:"start",...style}}>{children}</div>;

// ─── Customisable dashboard layout ───────────────────────────────────────────
// Panels live in zones: "top" (full width), "left" (narrow column), "right" (wide column) or "hidden".
// The layout is saved per role in localStorage. Edit mode: drag panels, or use the toolbar buttons.
const DASH_ZONES=["top","left","right","hidden"];
const ADMIN_DASH_DEFAULT={top:["glance"],left:["clinicDay","tasks","staff"],right:["appointments","supplies"],hidden:[]};

function DashboardLayout({storageKey,legacyKey,canCustomise=true,panels,defaults,header}){
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

function Dashboard({user,view,setPage,appts,recalls,refillRequests,inventory=[],staffSchedule=[],tasks=[],patients=[]}){
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

// ─── Calendar helpers ─────────────────────────────────────────────────────────
function getWeekDates(dateStr){
  const d=new Date(dateStr+"T12:00:00");
  const day=d.getDay();
  const mon=new Date(d);mon.setDate(d.getDate()-(day===0?6:day-1));
  return Array.from({length:5},(_,i)=>{const x=new Date(mon);x.setDate(mon.getDate()+i);return x.toISOString().split("T")[0];});
}

function CalendarDayView({appts,selectedDate,onSlotClick,canAdd}){
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

function CalendarWeekView({appts,selectedDate,onSelectDate,onSlotClick,canAdd}){
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

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function BarChart({data,color=C.navyMid,maxVal}){
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
function HBarChart({data}){
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
function ReportsPage({appts,recalls,patients}){
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

// ─── FILES POPUP MODAL ────────────────────────────────────────────────────────
function FilesPopupModal({files,patientName,onClose,onContinue}){
  return(
    <Modal title={`Files — ${patientName}`} onClose={onClose} width={560}>
      <div style={{marginBottom:16,fontSize:13,color:C.muted}}>Review patient files before starting the visit.</div>
      {files.length===0?<div style={{textAlign:"center",padding:"32px",color:C.muted}}>No files on record.</div>:(
        <div style={{border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden",marginBottom:20}}>
          {files.map((f,i)=>(
            <div key={f.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<files.length-1?`1px solid ${C.border}`:"none"}}>
              <Icon as={FileText} size={20} style={{color:C.text2}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:500,fontSize:14,color:C.text}}>{f.name}</div>
                <div style={{fontSize:12,color:C.muted}}>{f.type} · {f.date} · {f.size}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
        <XB onClick={onClose}>Close</XB>
        <PB onClick={onContinue}>Continue to Visit</PB>
      </div>
    </Modal>
  );
}

// ─── PATIENT FLOW BOARD ───────────────────────────────────────────────────────
function PatientFlowPage({user,appts,setAppts,doctorStatus,setDoctorStatus,patients,showToast,recalls,setRecalls,noShowHandler,completeHandler,setPendingFollowUp,pendingFollowUp}){
  const TODAY="2026-02-25";
  const todayAppts=appts.filter(a=>(a.date||TODAY)===TODAY);
  const COLS=FLOW_STAGES;
  const noShows=appts.filter(a=>(a.date||TODAY)===TODAY&&a.status==="no-show");
  const ORDER=["scheduled","checked-in","with-nurse","in-progress","completed"];
  const BTN_LABEL={"scheduled":"Check in","checked-in":"Send to nurse","with-nurse":"Start visit","in-progress":"Complete visit"};
  const [filesAppt,setFilesAppt]=useState(null);
  const prevInProgressRef=useRef(new Set(todayAppts.filter(a=>a.status==="in-progress").map(a=>a.id)));
  const[doctorAlerts,setDoctorAlerts]=useState([]);
  useEffect(()=>{
    const currIds=new Set(todayAppts.filter(a=>a.status==="in-progress").map(a=>a.id));
    const newAlerts=[];
    for(const id of currIds){if(!prevInProgressRef.current.has(id)){const a=todayAppts.find(x=>x.id===id);if(a)newAlerts.push(a);}}
    if(newAlerts.length>0)setDoctorAlerts(prev=>[...prev,...newAlerts]);
    prevInProgressRef.current=currIds;
  },[todayAppts]);
  const dismissAlert=(id)=>setDoctorAlerts(prev=>prev.filter(a=>a.id!==id));
  const nowStageTs=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")+" "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");};
  const advance=(id)=>{
    const a=appts.find(x=>x.id===id);if(!a)return;
    const i=ORDER.indexOf(a.status);
    if(i<0||i>=ORDER.length-1)return;
    const nextStatus=ORDER[i+1];
    // Show files popup when moving to "with-nurse" or "in-progress"
    if((nextStatus==="with-nurse"||nextStatus==="in-progress")&&INIT_FILES[findPatientId(a.patient)]){
      setFilesAppt({id,nextStatus,patient:a.patient,patientId:findPatientId(a.patient)});return;
    }
    if(nextStatus==="completed"){completeHandler(id);}
    else{setAppts(p=>p.map(x=>x.id===id?{...x,status:nextStatus,stageEnteredAt:nowStageTs()}:x));}
  };
  const findPatientId=(name)=>{
    const p=patients.find(pt=>`${pt.first_name} ${pt.last_name}`===name);return p?p.id:null;
  };
  const TYPE_C={routine:C.blue,"follow-up":C.teal,urgent:C.red,procedure:C.amber,"new-patient":C.green};
  const DOCTORS=Object.keys(doctorStatus||{});
  return(
    <div style={{padding:"24px 32px",flex:1,minHeight:0,boxSizing:"border-box",display:"flex",flexDirection:"column"}}>
      {doctorAlerts.length>0&&(
        <div style={{position:"fixed",top:72,right:20,zIndex:800,display:"flex",flexDirection:"column",gap:8}}>
          {doctorAlerts.map(a=>(
            <div key={a.id} role="status" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:16,boxShadow:"var(--shadow-lg)",minWidth:260,maxWidth:300,animation:"rise 220ms var(--ease)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8,color:C.text}}>
                  <Icon as={Bell} style={{color:C.amber}}/>
                  <div style={{fontWeight:500,fontSize:13}}>Ready for the doctor</div>
                </div>
                <button onClick={()=>dismissAlert(a.id)} aria-label="Dismiss" className="icon-btn" style={{border:"none",color:C.muted,cursor:"pointer",width:24,height:24,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon as={X}/></button>
              </div>
              <div style={{fontWeight:500,fontSize:14,color:C.text}}>{a.patient}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:4,display:"flex",gap:8,alignItems:"center"}}><span style={{fontFamily:C.mono}}>{a.time}</span><span>{a.doctor}</span><TB type={a.type}/></div>
            </div>
          ))}
        </div>
      )}
      {filesAppt&&<FilesPopupModal files={INIT_FILES[filesAppt.patientId]||[]} patientName={filesAppt.patient} onClose={()=>setFilesAppt(null)} onContinue={()=>{
        const a=appts.find(x=>x.id===filesAppt.id);
        if(filesAppt.nextStatus==="completed"){completeHandler(filesAppt.id);}
        else{setAppts(p=>p.map(x=>x.id===filesAppt.id?{...x,status:filesAppt.nextStatus,stageEnteredAt:nowStageTs()}:x));}
        setFilesAppt(null);
      }}/>}
      <PageHeader title="Patient flow" meta={`Wednesday, February 25 · ${todayAppts.length} patients today`}
        status={noShows.length>0?<Badge color="red">{noShows.length} no-show{noShows.length>1?"s":""}</Badge>:null}
        actions={DOCTORS.map(doc=>(
          <span key={doc} style={{height:32,padding:"0 12px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,display:"inline-flex",alignItems:"center",gap:8,fontSize:13,color:C.text}}>
            <Dot color={doctorStatus[doc]?C.green:C.amber}/>{doc.split(" ").pop()} · {doctorStatus[doc]?"ready":"busy"}
          </span>
        ))}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,minmax(0,1fr))",gap:12,flex:1,overflow:"hidden"}}>
        {COLS.map(col=>{
          const cards=todayAppts.filter(a=>a.status===col.id);
          return(
            <section key={col.id} aria-label={col.label} style={{background:`color-mix(in srgb, var(--c-surface) 45%, var(--c-bg))`,border:`1px solid ${C.border}`,borderRadius:8,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"12px 12px 8px",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <Dot color={col.color}/>
                <div style={{fontWeight:600,fontSize:14,color:C.text}}>{col.label}</div>
                <div style={{marginLeft:"auto",fontFamily:C.mono,fontSize:13,color:C.text2,fontVariantNumeric:"tabular-nums"}}>{cards.length}</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"4px 8px 8px"}}>
                {cards.length===0&&(
                  <div style={{margin:"4px 0",border:`1px dashed ${C.border}`,borderRadius:6,padding:"24px 12px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:8,color:C.muted}}>
                    <col.Icon size={20} strokeWidth={1.5} aria-hidden="true"/>
                    <div style={{fontSize:12}}>{col.empty}</div>
                  </div>
                )}
                {cards.map(a=>(
                  <div key={a.id} style={{background:C.surface,borderRadius:6,padding:12,marginBottom:8,border:`1px solid ${C.border}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",gap:8}}>
                      <div style={{fontWeight:500,fontSize:14,color:C.text,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.patient}</div>
                      <div style={{fontFamily:C.mono,fontSize:12,color:C.text2,fontVariantNumeric:"tabular-nums",flexShrink:0}}>{a.time}</div>
                    </div>
                    {a.stageEnteredAt&&<TimeInStage stageEnteredAt={a.stageEnteredAt}/>}
                    <div style={{display:"flex",gap:8,alignItems:"center",margin:"8px 0 12px",flexWrap:"wrap"}}>
                      <TB type={a.type}/>
                      <span style={{fontSize:12,color:C.muted}}>{a.doctor}</span>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      {col.id!=="completed"&&<button onClick={()=>advance(a.id)} className="btn btn-primary btn-sm" style={{flex:1}}>{BTN_LABEL[col.id]}{col.id==="in-progress"?<Check size={14} strokeWidth={2} aria-hidden="true"/>:<ArrowRight size={14} strokeWidth={2} aria-hidden="true"/>}</button>}
                      {col.id==="scheduled"&&user.role!=="doctor"&&<button onClick={()=>noShowHandler(a.id)} className="btn btn-secondary btn-sm">No-show</button>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function MiniCalendar({ selectedDate, onSelectDate, appts }) {
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

function ApptsPage({user,appts,setAppts,patients,settings,reminderLogs,setReminderLogs,waitlist,setWaitlist,blockTimes,recalls,setRecalls,showToast,noShowHandler,completeHandler,pendingFollowUp,setPendingFollowUp}){
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
    const rows = Object.entries(grouped).map(([doc,apts])=>`
      <h3 style="margin:16px 0 8px;font-size:14px;">${doc}</h3>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin-bottom:16px;">
        <tr style="background:#f0f2f5;"><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Time</th><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Patient</th><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Type</th><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Dur.</th><th style="padding:6px 10px;text-align:left;border:1px solid #ddd;">Notes</th></tr>
        ${apts.map(a=>`<tr><td style="padding:6px 10px;border:1px solid #ddd;">${a.time}</td><td style="padding:6px 10px;border:1px solid #ddd;">${a.patient}</td><td style="padding:6px 10px;border:1px solid #ddd;">${a.type.replace(/-/g," ")}</td><td style="padding:6px 10px;border:1px solid #ddd;">${a.duration}m</td><td style="padding:6px 10px;border:1px solid #ddd;min-width:120px;"></td></tr>`).join("")}
      </table>`).join("");
    const w=window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>Daily Schedule</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#000;}h1{font-size:18px;margin-bottom:4px;}@media print{button{display:none;}}</style></head><body><h1>${clinicName} — Daily Schedule</h1><p style="margin:0 0 16px;font-size:13px;">${new Date(selectedDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>${rows}<button onclick="window.print()" style="padding:8px 16px;margin-top:8px;">Print</button></body></html>`);
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
            <XB onClick={()=>{setAppts(p=>p.map(x=>x.id===cancelWaitlistAppt.appt.id?{...x,status:"no-show"}:x));setCancelWaitlistAppt(null);}}>Cancel Appointment Only</XB>
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

function WaitlistPanel({waitlist,setWaitlist,patients,canAdd}){
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

// ─── VitalsTabContent (with inline alerts) ────────────────────────────────────
function VitalsTabContent({patient,v,vitalHistory,onRecordClick,vitals,setVitals,p,showToast,user}){
  const[editV,setEditV]=useState({
    sys:v?v.bp.split("/")[0]:"",
    dia:v?v.bp.split("/")[1]:"",
    hr:v?String(v.hr):"",
    temp:v?String(v.temp):"",
    o2:v?String(v.o2):"",
    weight:v?String(v.weight):"",
  });
  const[saved,setSaved]=useState(false);
  const[savingVitals,setSavingVitals]=useState(false);
  const checkAlerts=(vals)=>{
    const alerts=[];
    const checks=[
      {key:"sys",  th:"bpSystolic"},
      {key:"dia",  th:"bpDiastolic"},
      {key:"hr",   th:"hr"},
      {key:"temp", th:"temp"},
      {key:"o2",   th:"o2"},
      {key:"weight",th:"weight"},
    ];
    checks.forEach(({key,th})=>{
      const val=parseFloat(vals[key]);
      if(isNaN(val)||!vals[key])return;
      const t=VITAL_THRESHOLDS[th];
      if(!t)return;
      const label=t.label;
      if(t.critHigh!==null&&val>=t.critHigh){alerts.push({level:"critical",label,val});}
      else if(val>t.high){alerts.push({level:"abnormal",label,val});}
      else if(val<t.low){alerts.push({level:t.low-val>10?"critical":"abnormal",label,val});}
    });
    return alerts;
  };
  const alerts=checkAlerts(editV);
  const hasCritical=alerts.some(a=>a.level==="critical");
  const saveInlineVitals=()=>{
    if(!editV.sys||!editV.dia||!editV.hr)return;
    setSavingVitals(true);
    setTimeout(()=>{
      const bmi=editV.weight&&editV.ht?((parseInt(editV.weight)/(parseInt(editV.ht)**2))*703).toFixed(1):v?.bmi||0;
      const newEntry={id:Date.now(),date:today(),bp:`${editV.sys}/${editV.dia}`,hr:parseInt(editV.hr),temp:parseFloat(editV.temp)||0,o2:parseInt(editV.o2)||0,weight:parseInt(editV.weight)||0,bmi:parseFloat(bmi)||0,recordedBy:user?.name||""};
      setVitals(prev=>({...prev,[patient.id]:[...(prev[patient.id]||[]),newEntry]}));
      setSaved(true);
      setSavingVitals(false);
      if(alerts.length>0&&showToast)showToast("Vitals saved — review flagged values","amber");
      setTimeout(()=>setSaved(false),2500);
    },600);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>Current vitals</div>{p.vitals&&<button onClick={onRecordClick} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Record via form</button>}</div>
        {v?(<>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12,marginBottom:8}}>{["bp","hr","temp","o2","weight","bmi"].map(k=><VitalReadout key={k} k={k} value={v[k]}/>)}</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Recorded {v.date?fmt(v.date):"today"}{v.recordedBy?` by ${v.recordedBy}`:""} · shaded band shows the adult reference range</div>
        </>):<div style={{color:C.muted,marginBottom:16}}>No vitals on record</div>}
        {p.vitals&&(
          <div>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>Quick update</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              {[["sys","Systolic","120"],["dia","Diastolic","80"],["hr","Heart Rate","72"],["temp","Temp °F","98.6"],["o2","O\u2082 Sat %","98"],["weight","Weight lbs","160"]].map(([k,lbl,ph])=>(
                <div key={k}>
                  <label style={LS}>{lbl}</label>
                  <input type="number" step={k==="temp"?"0.1":"1"} value={editV[k]} onChange={e=>setEditV(f=>({...f,[k]:e.target.value}))} style={IS} placeholder={ph}/>
                </div>
              ))}
            </div>
            {alerts.length>0&&(
              <Alert tone={hasCritical?"red":"amber"} title={hasCritical?"Critical values":"Values outside range"} style={{marginBottom:12}}>
                {alerts.map((a,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginTop:i?4:0}}>
                    <Dot color={a.level==="critical"?C.red:C.amber} size={6}/>
                    <span>{a.label}: <span style={{fontFamily:C.mono,color:C.text}}>{a.val}</span>{a.level==="critical"?" (critical)":""}</span>
                  </div>
                ))}
              </Alert>
            )}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <LoadingButton onClick={saveInlineVitals} disabled={!editV.sys||!editV.dia||!editV.hr} loading={savingVitals} style={{padding:"8px 20px",fontSize:13,fontWeight:600}}>Save vitals</LoadingButton>
              {saved&&<span role="status" style={{fontSize:13,color:C.text2,display:"inline-flex",alignItems:"center",gap:6}}><CircleCheck size={16} strokeWidth={1.5} style={{color:C.green}} aria-hidden="true"/>Saved{alerts.length>0?", review flagged values":""}</span>}
            </div>
          </div>
        )}
      </Card>
      <Card style={{padding:"20px"}}>
        <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>Trends</div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          <VitalsTrendChart data={vitalHistory} field="systolic"/>
          <VitalsTrendChart data={vitalHistory} field="weight"/>
          <VitalsTrendChart data={vitalHistory} field="glucose"/>
        </div>
      </Card>
      {vitalHistory&&vitalHistory.length>0&&(
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>Vitals history</div>
          <div style={{overflowX:"auto"}}>
            <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr>{["Date","BP","HR","Temp","O₂","Weight","Recorded By"].map(h=><th key={h} style={{padding:"12px 12px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>
                {[...vitalHistory].reverse().map((entry,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i===0?C.blueBg:"transparent"}}>
                    <td style={{padding:"10px 12px",fontWeight:i===0?600:400,color:C.text}}>{fmt(entry.date)}{i===0&&<span style={{marginLeft:6,fontSize:11,color:C.blue,fontWeight:600}}>(current)</span>}</td>
                    <td style={{padding:"10px 12px",color:C.text}}>{entry.bp}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.hr}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.temp}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.o2}%</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.weight} lbs</td>
                    <td style={{padding:"10px 12px",color:C.muted,fontSize:12,fontWeight:500}}>{entry.recordedBy||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── Risk Score ────────────────────────────────────────────────────────────────
function computeRisk(patient, rx, vitals, labs, appts){
  let score=0;
  const a=age(patient.dob);
  if(a>=75)score+=2; else if(a>=65)score+=1;
  const rxArr=rx[patient.id]||[];
  const labArr=labs[patient.id]||[];
  const hasMet=rxArr.some(r=>r.med.toLowerCase().includes("metformin"));
  const hasHbA1c=labArr.some(l=>l.name.toLowerCase().includes("hba1c")&&l.abnormal);
  if(hasMet||hasHbA1c)score+=2;
  const hasLisin=rxArr.some(r=>r.med.toLowerCase().includes("lisinopril"));
  const vArr=vitals[patient.id]||[];
  const v=vArr.length>0?vArr[vArr.length-1]:null;
  const sysBP=v&&v.bp?parseInt(v.bp.split("/")[0]):0;
  if(hasLisin||sysBP>140)score+=2;
  if(patient.allergies&&patient.allergies.length>0)score+=1;
  const ptName=`${patient.first_name} ${patient.last_name}`;
  const noShows=(appts||[]).filter(a=>a.patient===ptName&&a.status==="no-show").length;
  if(noShows>=2)score+=2;
  const lastVisit=patient.lastVisit;
  if(lastVisit){const daysSince=(new Date()-new Date(lastVisit))/86400000;if(daysSince>180)score+=1;}
  if(patient.active===false)score+=1;
  return score;
}
function RiskBadge({score}){
  const level=score>=6?"High":score>=3?"Medium":"Low";
  const color=score>=6?"red":score>=3?"amber":"green";
  return <Badge color={color==="green"?"neutral":color}>{level} risk</Badge>;
}

// ─── Care Gaps Panel ───────────────────────────────────────────────────────────
function CareGapsPanel({patient, rx, labs, vaccines}){
  const[open,setOpen]=useState(true);
  const[dismissed,setDismissed]=useState(new Set());
  const ptAge=age(patient.dob);
  const rxArr=rx[patient.id]||[];
  const labArr=labs[patient.id]||[];
  const vacArr=vaccines||[];
  const todayStr=today();
  const gaps=[];
  // Age >= 65: flu vaccine in past 12 months
  if(ptAge>=65){
    const lastFlu=vacArr.filter(v=>v.vaccine.toLowerCase().includes("influenza")).sort((a,b)=>b.date.localeCompare(a.date))[0];
    const monthsAgo12=new Date();monthsAgo12.setFullYear(monthsAgo12.getFullYear()-1);
    if(!lastFlu||new Date(lastFlu.date)<monthsAgo12){
      gaps.push({id:"flu",label:"Annual flu vaccine overdue",action:"Schedule influenza vaccine",severity:"medium"});
    }
  }
  // Age >= 65: pneumococcal
  if(ptAge>=65){
    const hasPneumo=vacArr.some(v=>v.vaccine.toLowerCase().includes("pneumo"));
    if(!hasPneumo)gaps.push({id:"pneumo",label:"Pneumococcal vaccine not on record",action:"Administer Pneumococcal vaccine",severity:"medium"});
  }
  // Age >= 50: colonoscopy
  if(ptAge>=50){
    const hasColono=labArr.some(l=>l.name.toLowerCase().includes("colonoscopy"));
    if(!hasColono)gaps.push({id:"colon",label:"Colonoscopy screening not documented",action:"Order or confirm colonoscopy",severity:"medium"});
  }
  // Diabetic: HbA1c every 6 months
  const hasMet=rxArr.some(r=>r.med.toLowerCase().includes("metformin"));
  const hasHbA1cLab=labArr.some(l=>l.name.toLowerCase().includes("hba1c"));
  if(hasMet||hasHbA1cLab){
    const lastHbA1c=labArr.filter(l=>l.name.toLowerCase().includes("hba1c")).sort((a,b)=>b.date.localeCompare(a.date))[0];
    if(!lastHbA1c){
      gaps.push({id:"hba1c",label:"HbA1c not on record (diabetic patient)",action:"Order HbA1c lab",severity:"high"});
    } else {
      const monthsAgo6=new Date();monthsAgo6.setMonth(monthsAgo6.getMonth()-6);
      if(new Date(lastHbA1c.date)<monthsAgo6)gaps.push({id:"hba1c",label:"HbA1c overdue (>6 months)",action:"Order HbA1c recheck",severity:"medium"});
    }
  }
  // Hypertension: BP check every 3 months
  const hasLisin=rxArr.some(r=>r.med.toLowerCase().includes("lisinopril"));
  if(hasLisin&&patient.lastVisit){
    const daysSince=(new Date()-new Date(patient.lastVisit))/86400000;
    if(daysSince>90)gaps.push({id:"bp",label:"BP check overdue (>3 months since last visit)",action:"Schedule BP follow-up",severity:"medium"});
  }
  // Annual physical
  if(patient.lastVisit){
    const daysSince=(new Date()-new Date(patient.lastVisit))/86400000;
    if(daysSince>365)gaps.push({id:"annual",label:"Annual physical overdue",action:"Schedule annual physical",severity:"medium"});
  }
  const activeGaps=gaps.filter(g=>!dismissed.has(g.id));
  return(
    <div style={{gridColumn:"1 / -1"}}>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div onClick={()=>setOpen(v=>!v)} aria-expanded={open} className="row-link" style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:open&&activeGaps.length>0?`1px solid ${C.border}`:"none"}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text,flex:1}}>Care gaps and preventive care</div>
          {activeGaps.length>0&&<Badge color="amber">{activeGaps.length} open</Badge>}
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,transform:open?"rotate(180deg)":"none",transition:"transform 160ms var(--ease)"}}/>
        </div>
        {open&&(
          <div style={{padding:"4px 0"}}>
            {activeGaps.length===0&&<div style={{padding:"16px 20px",fontSize:13,color:C.muted}}>No care gaps found</div>}
            {activeGaps.map(g=>(
              <div key={g.id} style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.border}`}}>
                <Dot color={g.severity==="high"?C.red:C.amber}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:C.text}}>{g.label}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>Recommended: {g.action}</div>
                </div>
                <button onClick={()=>setDismissed(prev=>{const s=new Set(prev);s.add(g.id);return s;})} className="btn btn-secondary btn-sm" style={{flexShrink:0}}>Dismiss</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── InventoryPage ─────────────────────────────────────────────────────────────
function InventoryPage({inventory,setInventory}){
  const[catFilter,setCatFilter]=useState("All");
  const[showAdd,setShowAdd]=useState(false);
  const[newItem,setNewItem]=useState({name:"",category:"Supplies",qty:0,unit:"units",reorderAt:10,reorderQty:50,supplier:""});
  const[qtyEdit,setQtyEdit]=useState({});
  const cats=["All",...[...new Set(inventory.map(i=>i.category))]];
  const filtered=catFilter==="All"?inventory:inventory.filter(i=>i.category===catFilter);
  const lowStock=inventory.filter(i=>i.qty<=i.reorderAt);
  const outOfStock=inventory.filter(i=>i.qty===0);
  const updateQty=(id,val)=>{
    const n=Math.max(0,parseInt(val)||0);
    setInventory(prev=>prev.map(i=>i.id===id?{...i,qty:n}:i));
  };
  const markOrdered=(id)=>{
    setInventory(prev=>prev.map(i=>i.id===id?{...i,lastOrdered:today(),qty:i.qty+i.reorderQty}:i));
  };
  const addItem=()=>{
    if(!newItem.name)return;
    setInventory(prev=>[...prev,{...newItem,id:Date.now(),qty:parseInt(newItem.qty)||0,reorderAt:parseInt(newItem.reorderAt)||10,reorderQty:parseInt(newItem.reorderQty)||50,lastOrdered:""}]);
    setNewItem({name:"",category:"Supplies",qty:0,unit:"units",reorderAt:10,reorderQty:50,supplier:""});
    setShowAdd(false);
  };
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      <PageHeader title="Inventory" meta={`${inventory.length} items · ${[...new Set(inventory.map(i=>i.supplier))].length} suppliers`}
        status={lowStock.length>0?<Badge color="red">{lowStock.length} low stock</Badge>:<Badge color="green">All stocked</Badge>}
        actions={<PB onClick={()=>setShowAdd(v=>!v)}><Icon as={Plus}/>Add item</PB>}/>
      {lowStock.length>0&&<Alert tone="red" title={`${lowStock.length} item${lowStock.length>1?"s":""} at or below reorder level`} meta={lowStock.map(i=>i.name).join(", ")} style={{marginBottom:12}}
        actions={<button className="text-link" onClick={()=>lowStock.forEach(i=>markOrdered(i.id))}>Mark all as ordered</button>}/>}
      <div style={{marginBottom:12}}><Segmented size="sm" value={catFilter} onChange={setCatFilter} options={cats.map(c=>[c,c,null,c==="All"?0:inventory.filter(i=>i.category===c).length])}/></div>
      {showAdd&&(
        <Card style={{marginBottom:16,padding:"16px 20px"}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>New item</div>
          <FR><FF label="Name"><input value={newItem.name} onChange={e=>setNewItem(f=>({...f,name:e.target.value}))} style={IS}/></FF><FF label="Category"><select value={newItem.category} onChange={e=>setNewItem(f=>({...f,category:e.target.value}))} style={SS}>{["PPE","Supplies","Equipment","Medication"].map(c=><option key={c}>{c}</option>)}</select></FF></FR>
          <FR><FF label="Quantity"><input type="number" value={newItem.qty} onChange={e=>setNewItem(f=>({...f,qty:e.target.value}))} style={IS}/></FF><FF label="Unit"><input value={newItem.unit} onChange={e=>setNewItem(f=>({...f,unit:e.target.value}))} style={IS} placeholder="units"/></FF></FR>
          <FR><FF label="Reorder at"><input type="number" value={newItem.reorderAt} onChange={e=>setNewItem(f=>({...f,reorderAt:e.target.value}))} style={IS}/></FF><FF label="Reorder quantity"><input type="number" value={newItem.reorderQty} onChange={e=>setNewItem(f=>({...f,reorderQty:e.target.value}))} style={IS}/></FF></FR>
          <FR cols={1}><FF label="Supplier"><input value={newItem.supplier} onChange={e=>setNewItem(f=>({...f,supplier:e.target.value}))} style={IS}/></FF></FR>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowAdd(false)}>Cancel</XB><PB onClick={addItem} disabled={!newItem.name}>Add item</PB></div>
        </Card>
      )}
      <Card style={{overflow:"hidden"}}>
        <table className="tbl" style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Item","Category","Quantity","Reorder at","Supplier","Last ordered","Status",""].map((h,hi)=><th key={hi} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((item,i)=>{
              const isLow=item.qty<=item.reorderAt;
              const isEditing=qtyEdit[item.id]!==undefined;
              return(
                <tr key={item.id} style={{borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none"}}>
                  <td style={{padding:"12px 16px",fontWeight:500,fontSize:14,color:C.text}}>{item.name}</td>
                  <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}>{item.category}</td>
                  <td style={{padding:"12px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <button onClick={()=>updateQty(item.id,item.qty-1)} aria-label={`Decrease ${item.name}`} className="icon-btn" style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border2}`,cursor:"pointer",color:C.text2,fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                      <input
                        type="number"
                        value={isEditing?qtyEdit[item.id]:item.qty}
                        onChange={e=>setQtyEdit(prev=>({...prev,[item.id]:e.target.value}))}
                        onBlur={e=>{if(isEditing){updateQty(item.id,qtyEdit[item.id]);setQtyEdit(prev=>{const n={...prev};delete n[item.id];return n;});}}}
                        aria-label={`${item.name} quantity`} style={{...IS,width:64,textAlign:"center",padding:"4px 6px",fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}
                      />
                      <button onClick={()=>updateQty(item.id,item.qty+1)} aria-label={`Increase ${item.name}`} className="icon-btn" style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border2}`,cursor:"pointer",color:C.text2,fontSize:16,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </td>
                  <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}><span style={{fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{item.reorderAt}</span> {item.unit}</td>
                  <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}>{item.supplier||"—"}</td>
                  <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}>{item.lastOrdered?fmt(item.lastOrdered):"—"}</td>
                  <td style={{padding:"12px 16px"}}>{item.qty===0?<Badge color="red">Out of stock</Badge>:isLow?<Badge color="red">Reorder</Badge>:item.qty<=item.reorderAt*1.5?<Badge color="amber">Running low</Badge>:<Badge color="green">In stock</Badge>}</td>
                  <td style={{padding:"12px 16px"}}>
                    <button onClick={()=>markOrdered(item.id)} className="btn btn-secondary btn-sm" >Mark ordered</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── StaffSchedulePage ─────────────────────────────────────────────────────────
function StaffSchedulePage({staffSchedule,setStaffSchedule}){
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

function PatientProfile({patient,onBack,user,vitals,setVitals,rx,setRx,notes,setNotes,recalls,setRecalls,patients,setPatients,refillRequests,setRefillRequests,draftNotes,setDraftNotes,onOpenPatient,appts,addAudit}){
  const[tab,setTab]=useState("overview");
  const[sv,setSv]=useState(false);const[sr,setSr]=useState(false);const[sn,setSn]=useState(false);const[sc,setSc]=useState(false);
  const[showInactiveRx,setShowInactiveRx]=useState(false);
  const[rxHistory]=useState(INIT_RX_HISTORY[patient.id]||{});
  const[expandedRxHistory,setExpandedRxHistory]=useState(new Set());
  const[addingAllergy,setAddingAllergy]=useState(false);const[newAllergy,setNewAllergy]=useState("");
  const[labResults,setLabResults]=useState(INIT_LABS[patient.id]||[]);
  const[expandedLab,setExpandedLab]=useState(null);
  const[editContactPref,setEditContactPref]=useState(false);
  const[vaccines,setVaccines]=useState(INIT_VACCINES[patient.id]||[]);
  const[showVaccineForm,setShowVaccineForm]=useState(false);
  const[vaccineForm,setVaccineForm]=useState({vaccine:"",date:today(),given_by:user.name,lot:"",next_due:""});
  const[referrals,setReferrals]=useState(INIT_REFERRALS[patient.id]||[]);
  const[showReferralForm,setShowReferralForm]=useState(false);
  const[referralForm,setReferralForm]=useState({specialist:"",facility:"",reason:"",notes:""});
  const[editingReferral,setEditingReferral]=useState(null);
  const p=permsFor(user);
  const vitalHistory=vitals[patient.id]||[];
  const v=vitalHistory.length>0?vitalHistory[vitalHistory.length-1]:null;
  const rxs=rx[patient.id]||[];const ptN=notes[patient.id]||[];
  const inactiveRxs=INIT_INACTIVE_RX[patient.id]||[];
  const[patFiles,setPatFiles]=useState(INIT_FILES[patient.id]||[]);
  const patientFullName=`${patient.first_name} ${patient.last_name}`;
  const patAppts=(appts||[]).filter(a=>a.patient===patientFullName);
  const totalAppts=patAppts.length;
  const completedAppts=patAppts.filter(a=>a.status==="completed").length;
  const noShowAppts=patAppts.filter(a=>a.status==="no-show").length;
  const cancelledAppts=patAppts.filter(a=>a.status==="cancelled").length;
  const[problems,setProblems]=useState(INIT_PROBLEMS[patient.id]||[]);
  // Audit on tab change
  const prevTab=useRef(tab);
  useEffect(()=>{
    if(addAudit&&tab!==prevTab.current){
      addAudit("Viewed",patientFullName,tab.charAt(0).toUpperCase()+tab.slice(1));
      prevTab.current=tab;
    }
  },[tab]);
  const handleFileUpload=(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    const ext=file.name.split(".").pop().toLowerCase();
    const typeMap={pdf:"Document",jpg:"Image",jpeg:"Image",png:"Image",tiff:"Image",doc:"Document",docx:"Document",xls:"Lab Report",xlsx:"Lab Report"};
    const kb=Math.round(file.size/1024);
    const size=kb>=1024?`${(kb/1024).toFixed(1)} MB`:`${kb} KB`;
    setPatFiles(prev=>[...prev,{id:Date.now(),name:file.name,type:typeMap[ext]||"Document",date:today(),size}]);
    e.target.value="";
  };
  const showRxTab=p.prescriptions||p.viewRx;const canWriteRx=p.writeRx||p.prescriptions;
  const showNotesTab=p.notes||p.viewNotes;const canWriteNotes=p.writeNotes||p.notes;
  const activeProblemsCount=problems.filter(pr=>pr.status==="active").length;
  const tabs=[{id:"overview",show:true},{id:"problems",show:true,badge:activeProblemsCount},{id:"vitals",show:p.vitals||p.viewVitals},{id:"prescriptions",show:showRxTab},{id:"notes",show:showNotesTab},{id:"labs",show:true},{id:"vaccines",show:true},{id:"files",show:true},{id:"recalls",show:p.recalls},{id:"referrals",show:true},{id:"timeline",show:true}].filter(t=>t.show);
  const addAllergy=()=>{
    if(!newAllergy.trim())return;
    setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,allergies:[...pt.allergies,newAllergy.trim()]}:pt));
    setNewAllergy("");setAddingAllergy(false);
  };
  const printRx=()=>{
    const w=window.open("","_blank","width=720,height=900");
    w.document.write(`<html><head><title>Prescription</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#1A2332}.header{border-bottom:2px solid #1A3A5C;padding-bottom:16px;margin-bottom:24px}.clinic{font-size:20px;font-weight:bold;color:#1A3A5C}.rx-item{border:1px solid #ddd;border-radius:6px;padding:14px;margin-bottom:12px}.med{font-size:16px;font-weight:bold}.footer{margin-top:48px;border-top:1px solid #ddd;padding-top:16px}.sig{border-bottom:1px solid #000;width:260px;margin-top:36px}@media print{body{margin:20px}}</style></head><body>
    <div class="header"><div class="clinic">My Medical Clinic</div><div style="color:#6B7A8D;font-size:13px">123 Main St · (555) 000-0000</div></div>
    <div style="margin-bottom:16px"><strong>Patient:</strong> ${patient.first_name} ${patient.last_name} &nbsp;·&nbsp; <strong>DOB:</strong> ${patient.dob} &nbsp;·&nbsp; <strong>Date:</strong> ${today()}</div>
    ${rxs.map(rx=>`<div class="rx-item"><div class="med">℞ ${rx.med} ${rx.dose}</div><div style="margin:6px 0;color:#6B7A8D">${rx.sig}</div><div style="font-size:12px;color:#6B7A8D">Refills: ${rx.refills} &nbsp;·&nbsp; Prescribed: ${rx.date||""}</div></div>`).join("")}
    <div class="footer"><div>Prescribing Physician: <strong>Dr. Priya Patel, MD</strong></div><div class="sig"></div><div style="margin-top:6px;font-size:12px;color:#6B7A8D">Signature</div></div>
    </body></html>`);
    w.document.close();w.focus();setTimeout(()=>w.print(),300);
  };
  const printSummary=()=>{
    const w=window.open("","_blank","width=720,height=900");
    const vitArr=vitals[patient.id]||[];
    const vit=vitArr.length>0?vitArr[vitArr.length-1]:null;
    w.document.write(`<html><head><title>Patient Summary</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#1A2332}h2{color:#1A3A5C}table{width:100%;border-collapse:collapse;margin-bottom:20px}td,th{padding:8px 12px;border:1px solid #ddd;font-size:13px}th{background:#F0F2F5;font-weight:600}.section{margin-bottom:24px}@media print{body{margin:20px}}</style></head><body>
    <h2>My Medical Clinic — Patient Summary</h2>
    <p style="color:#6B7A8D;font-size:13px">Generated: ${today()} &nbsp;·&nbsp; For referral or internal use only</p>
    <div class="section"><h3>Demographics</h3><table><tr><th>Name</th><td>${patient.first_name} ${patient.last_name}</td><th>DOB</th><td>${patient.dob}</td></tr><tr><th>Phone</th><td>${patient.phone}</td><th>Insurance</th><td>${patient.insurance}</td></tr></table></div>
    <div class="section"><h3>Allergies</h3><p>${patient.allergies.length?patient.allergies.join(", "):"No known allergies"}</p></div>
    ${vit?`<div class="section"><h3>Most Recent Vitals</h3><table><tr><th>BP</th><td>${vit.bp} mmHg</td><th>HR</th><td>${vit.hr} bpm</td></tr><tr><th>Temp</th><td>${vit.temp} °F</td><th>O₂ Sat</th><td>${vit.o2}%</td></tr><tr><th>Weight</th><td>${vit.weight} lbs</td><th>BMI</th><td>${vit.bmi}</td></tr></table></div>`:""}
    ${rxs.length?`<div class="section"><h3>Active Medications</h3><table><tr><th>Medication</th><th>Dose</th><th>Instructions</th><th>Refills</th></tr>${rxs.map(r=>`<tr><td>${r.med}</td><td>${r.dose}</td><td>${r.sig}</td><td>${r.refills}</td></tr>`).join("")}</table></div>`:""}
    ${recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).length?`<div class="section"><h3>Open Recalls</h3><table><tr><th>Reason</th><th>Due Date</th><th>Urgency</th></tr>${recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).map(r=>`<tr><td>${r.reason}</td><td>${r.due}</td><td>${r.urgency}</td></tr>`).join("")}</table></div>`:""}
    </body></html>`);
    w.document.close();w.focus();setTimeout(()=>w.print(),300);
  };
  return(
    <div style={{padding:"24px 32px 48px"}}>
      {sv&&<VitalsModal patient={patient} onClose={()=>setSv(false)} onSave={(pid,data)=>{setVitals(p=>({...p,[pid]:[...(p[pid]||[]),{id:Date.now(),date:today(),...data,recordedBy:user.name}]}));setSv(false);if(addAudit)addAudit("Edited",patientFullName,"Vitals");}}/>}
      {sr&&<RxModal patient={patient} rx={rxs} onClose={()=>setSr(false)} onSave={(pid,r)=>{setRx(p=>({...p,[pid]:[...(p[pid]||[]),r]}));setSr(false);}}/>}
      {sn&&<NoteModal patient={patient} user={user} draftNotes={draftNotes} setDraftNotes={setDraftNotes} onClose={()=>setSn(false)} onSave={(pid,n)=>{setNotes(p=>({...p,[pid]:[...(p[pid]||[]),n]}));setSn(false);if(addAudit)addAudit("Edited",patientFullName,"Notes");}}/>}
      {sc&&<RecallModal onClose={()=>setSc(false)} onSave={r=>{setRecalls(p=>[...p,r]);setSc(false);}} patients={patients}/>}
      <button onClick={onBack} className="text-link" style={{display:"inline-flex",alignItems:"center",gap:4,marginBottom:12,color:C.text2,textDecoration:"none"}}><ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true"/>All patients</button>
      <PageHeader title={`${patient.first_name} ${patient.last_name}`}
        status={<>{patient.dnc&&<Badge color="red">Do not contact</Badge>}<RiskBadge score={computeRisk(patient,rx,vitals,INIT_LABS,appts||[])}/>{patient.active===false&&<Badge color="neutral">Inactive</Badge>}</>}
        meta={`${age(patient.dob)} yrs · ${patient.gender==="F"?"Female":"Male"} · Patient #${String(patient.id).padStart(5,"0")}`}
        actions={<>
          <XB onClick={printSummary}><Icon as={Printer}/>Print summary</XB>
          {p.prescriptions&&rxs.length>0&&<XB onClick={printRx}><Icon as={Printer}/>Print Rx</XB>}
        </>}/>
      {patient.allergies.length>0&&<Alert tone="red" title={`Allergies: ${patient.allergies.join(", ")}`} meta={`${patient.allergies.length} on record`} style={{marginBottom:12}}
        actions={(p.vitals||p.writeRx)&&!addingAllergy?<button className="text-link" onClick={()=>setAddingAllergy(true)}>Add allergy</button>:null}/>}
      <Card style={{marginBottom:12,paddingBottom:8}}>
        <CardHead title="Patient information">{patient.allergies.length===0&&(p.vitals||p.writeRx)&&!addingAllergy&&<button className="text-link" style={{fontSize:12}} onClick={()=>setAddingAllergy(true)}>Add allergy</button>}</CardHead>
        <KVGrid items={[
          ["Date of birth",fmt(patient.dob)],
          ["Phone",patient.phone||"—"],
          ["Status",patient.active===false?"Inactive":"Active"],
          ["Insurance",patient.insurance||"—"],
          ["Contact",patient.dnc?"Do not contact":`${patient.contactPref||"Call"} · ${(patient.bestTime||"Morning").toLowerCase()}`],
          ["Allergies",patient.allergies.length?patient.allergies.join(", "):"None known"],
          ["Last visit",patient.lastVisit?fmt(patient.lastVisit):"—"],
          ["Next appointment",(()=>{const nx=(appts||[]).filter(a=>a.patient===`${patient.first_name} ${patient.last_name}`&&a.status==="scheduled"&&(a.date||"")>="2026-02-25").sort((x,y)=>(x.date+x.time).localeCompare(y.date+y.time))[0];return nx?`${fmt(nx.date)} · ${nx.time}`:"None booked";})()],
        ]}/>
        {addingAllergy&&(
          <div style={{margin:"8px 20px 12px",paddingTop:12,borderTop:`1px solid ${C.border}`,display:"flex",gap:8,alignItems:"center"}}>
            <input value={newAllergy} onChange={e=>setNewAllergy(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAllergy()} placeholder="e.g. Latex, Penicillin…" aria-label="New allergy" style={{...IS,maxWidth:300}} autoFocus/>
            <PB onClick={addAllergy} disabled={!newAllergy.trim()}>Add</PB>
            <XB onClick={()=>{setAddingAllergy(false);setNewAllergy("");}}>Cancel</XB>
          </div>
        )}
      </Card>
      <div role="tablist" style={{display:"flex",gap:24,marginBottom:12,borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>
        {tabs.map(t=><button key={t.id} role="tab" aria-selected={tab===t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 0",border:"none",background:"none",cursor:"pointer",fontSize:14,fontWeight:tab===t.id?500:400,color:tab===t.id?C.text:C.muted,borderBottom:tab===t.id?`2px solid ${C.navyMid}`:"2px solid transparent",marginBottom:-1,display:"flex",alignItems:"center",gap:6,fontFamily:"inherit"}}>
          {t.id.charAt(0).toUpperCase()+t.id.slice(1)}{t.badge>0&&<span style={{fontSize:12,color:C.muted,fontVariantNumeric:"tabular-nums"}}>{t.badge}</span>}
        </button>)}
      </div>
      {tab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {problems.filter(pr=>pr.status==="active").length>0&&(
            <Card style={{padding:"16px 20px 20px",gridColumn:"1 / -1"}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>Active problems</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {problems.filter(pr=>pr.status==="active").map(pr=>(
                  <div key={pr.id} style={{border:`1px solid ${C.border2}`,borderRadius:6,padding:"6px 12px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontWeight:500,fontSize:13,color:C.text}}>{pr.problem}</span>
                    <span style={{fontSize:12,color:C.muted,fontFamily:C.mono}}>{pr.icd}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card style={{padding:"16px 20px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>Recent vitals</div>{p.vitals&&<button onClick={()=>setSv(true)} className="btn btn-secondary btn-sm" ><Icon as={Plus} size={14}/>Record</button>}</div>
            {(p.vitals||p.viewVitals)?(v?(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{["bp","hr","temp","o2","weight","bmi"].map(k=><VitalReadout key={k} k={k} value={v[k]} compact/>)}</div>):<div style={{color:C.muted,fontSize:13}}>No vitals yet. {p.vitals&&<button onClick={()=>setSv(true)} style={{color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Record now</button>}</div>):<div style={{color:C.muted,fontSize:13,display:"flex",alignItems:"center",gap:6}}><Icon as={Lock} size={14}/>Nurses and doctors only</div>}
          </Card>
          <Card style={{padding:"16px 20px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>Active medications</div>{canWriteRx&&<button onClick={()=>setSr(true)} className="btn btn-secondary btn-sm" ><Icon as={Plus} size={14}/>Prescribe</button>}</div>
            {showRxTab?(rxs.length>0?rxs.map((r,ri)=><div key={r.id} style={{padding:"10px 0",borderTop:ri?`1px solid ${C.border}`:"none"}}><div style={{fontWeight:500,fontSize:14,color:C.text}}>{r.med} <span style={{color:C.muted,fontWeight:400}}>{r.dose}</span></div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{r.sig} · {r.refills} refills</div></div>):<div style={{color:C.muted,fontSize:13}}>No active medications.</div>):<div style={{color:C.muted,fontSize:13,display:"flex",alignItems:"center",gap:6}}><Icon as={Lock} size={14}/>Visible to doctors only</div>}
          </Card>
          <Card style={{padding:"16px 20px 20px"}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>Visit history</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Total",totalAppts],["Completed",completedAppts],["No-shows",noShowAppts],["Cancellations",cancelledAppts]].map(([l,v])=>(
                <div key={l} style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 12px"}}><div style={{fontSize:12,color:C.muted}}>{l}</div><div style={{fontSize:22,fontWeight:600,color:l==="No-shows"&&v>0?C.red:C.text,marginTop:4,fontVariantNumeric:"tabular-nums"}}>{v}</div></div>
              ))}
            </div>
          </Card>
          <Card style={{padding:"16px 20px 20px",gridColumn:"1 / -1"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text}}>Contact preferences</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditContactPref(v=>!v)} className="btn btn-secondary btn-sm" >Edit</button>
                <button onClick={()=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,dnc:!patient.dnc}:pt))}
                  className="btn btn-secondary btn-sm">
                  {patient.dnc?"Allow contact":"Mark do not contact"}
                </button>
              </div>
            </div>
            {editContactPref?(
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <FF label="Preferred contact"><select value={patient.contactPref||"Call"} onChange={e=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,contactPref:e.target.value}:pt))} style={{...SS,width:130}}><option>Call</option><option>Text</option><option>Email</option></select></FF>
                <FF label="Best time"><select value={patient.bestTime||"Morning"} onChange={e=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,bestTime:e.target.value}:pt))} style={{...SS,width:130}}><option>Morning</option><option>Afternoon</option><option>Either</option></select></FF>
                <button onClick={()=>setEditContactPref(false)} className="btn btn-primary" style={{alignSelf:"flex-end"}}>Done</button>
              </div>
            ):(
              <div style={{fontSize:13,color:C.text}}>
                {patient.dnc?<span style={{display:"inline-flex",alignItems:"center",gap:8}}><Dot color={C.red}/>Do not contact: all outreach is blocked</span>:<span>Prefers <strong style={{fontWeight:500}}>{(patient.contactPref||"Call").toLowerCase()}</strong>, best in the <strong style={{fontWeight:500}}>{(patient.bestTime||"Morning").toLowerCase()}</strong></span>}
              </div>
            )}
          </Card>
          <CareGapsPanel patient={patient} rx={rx} labs={INIT_LABS} vaccines={vaccines}/>
        </div>
      )}
      {tab==="problems"&&(()=>{
        const canWriteProblems=p.writeRx;
        const[showAddProblem,setShowAddProblem]=useState(false);
        const[newProb,setNewProb]=useState({problem:"",icd:"",status:"active",onset:"",notes:""});
        const[editingProblemId,setEditingProblemId]=useState(null);
        const[editProb,setEditProb]=useState({});
        const saveNewProblem=()=>{
          if(!newProb.problem)return;
          setProblems(prev=>[...prev,{...newProb,id:Date.now()}]);
          setNewProb({problem:"",icd:"",status:"active",onset:"",notes:""});
          setShowAddProblem(false);
        };
        const saveEditProblem=(id)=>{
          setProblems(prev=>prev.map(pr=>pr.id===id?{...pr,...editProb}:pr));
          setEditingProblemId(null);setEditProb({});
        };
        const resolveProblem=(id)=>{
          setProblems(prev=>prev.map(pr=>pr.id===id?{...pr,status:"resolved"}:pr));
        };
        return(
          <Card style={{padding:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text}}>Problem list</div>
              {canWriteProblems&&<button onClick={()=>setShowAddProblem(v=>!v)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Add problem</button>}
            </div>
            {showAddProblem&&(
              <div style={{background:C.raised,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px",marginBottom:16}}>
                <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>New problem</div>
                <FR><FF label="Problem name"><input value={newProb.problem} onChange={e=>setNewProb(f=>({...f,problem:e.target.value}))} style={IS} placeholder="e.g. Essential Hypertension"/></FF><FF label="ICD-10 code"><input value={newProb.icd} onChange={e=>setNewProb(f=>({...f,icd:e.target.value}))} style={IS} placeholder="e.g. I10"/></FF></FR>
                <FR><FF label="Status"><select value={newProb.status} onChange={e=>setNewProb(f=>({...f,status:e.target.value}))} style={SS}><option value="active">Active</option><option value="inactive">Inactive</option><option value="resolved">Resolved</option></select></FF><FF label="Onset date"><input type="date" value={newProb.onset} onChange={e=>setNewProb(f=>({...f,onset:e.target.value}))} style={IS}/></FF></FR>
                <FR cols={1}><FF label="Notes"><input value={newProb.notes} onChange={e=>setNewProb(f=>({...f,notes:e.target.value}))} style={IS} placeholder="Additional notes…"/></FF></FR>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowAddProblem(false)}>Cancel</XB><PB onClick={saveNewProblem} disabled={!newProb.problem}>Add problem</PB></div>
              </div>
            )}
            {problems.length===0?<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>No problems on record.</div>:(
              <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
                <thead><tr>{["Problem","ICD-10","Status","Onset","Notes","Actions"].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                <tbody>
                  {problems.map((pr,i)=>(
                    editingProblemId===pr.id?(
                      <tr key={pr.id} style={{borderBottom:`1px solid ${C.border}`,background:C.raised}}>
                        <td style={{padding:"10px 16px"}}><input defaultValue={editProb.problem??pr.problem} onChange={e=>setEditProb(f=>({...f,problem:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 16px"}}><input defaultValue={editProb.icd??pr.icd} onChange={e=>setEditProb(f=>({...f,icd:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 16px"}}><select defaultValue={editProb.status??pr.status} onChange={e=>setEditProb(f=>({...f,status:e.target.value}))} style={{...SS,fontSize:12}}><option value="active">Active</option><option value="inactive">Inactive</option><option value="resolved">Resolved</option></select></td>
                        <td style={{padding:"10px 16px"}}><input type="date" defaultValue={editProb.onset??pr.onset} onChange={e=>setEditProb(f=>({...f,onset:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 16px"}}><input defaultValue={editProb.notes??pr.notes} onChange={e=>setEditProb(f=>({...f,notes:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 16px"}}><div style={{display:"flex",gap:6}}><button onClick={()=>saveEditProblem(pr.id)} className="btn btn-primary btn-sm">Save</button><button onClick={()=>setEditingProblemId(null)} className="btn btn-secondary btn-sm" >Cancel</button></div></td>
                      </tr>
                    ):(
                      <tr key={pr.id} style={{borderBottom:i<problems.length-1?`1px solid ${C.border}`:"none"}}>
                        <td style={{padding:"12px 16px",fontWeight:500,fontSize:13,color:C.text}}>{pr.problem}</td>
                        <td style={{padding:"12px 16px",fontSize:12,color:C.muted,fontFamily:C.mono}}>{pr.icd}</td>
                        <td style={{padding:"12px 16px"}}><Badge color={pr.status==="active"?"amber":pr.status==="resolved"?"green":"neutral"}>{pr.status}</Badge></td>
                        <td style={{padding:"12px 16px",fontSize:12,color:C.muted}}>{pr.onset?fmt(pr.onset):"—"}</td>
                        <td style={{padding:"12px 16px",fontSize:12,color:C.muted,maxWidth:200}}>{pr.notes||"—"}</td>
                        <td style={{padding:"12px 16px"}}>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {canWriteProblems&&<button onClick={()=>{setEditingProblemId(pr.id);setEditProb({});}} className="btn btn-secondary btn-sm" >Edit</button>}
                            {canWriteProblems&&pr.status==="active"&&<button onClick={()=>resolveProblem(pr.id)} className="btn btn-secondary btn-sm">Resolve</button>}
                          </div>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        );
      })()}
      {tab==="vitals"&&(
        <VitalsTabContent patient={patient} v={v} vitalHistory={vitalHistory} onRecordClick={()=>setSv(true)} vitals={vitals} setVitals={setVitals} p={p} showToast={null} user={user}/>
      )}
      {tab==="prescriptions"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text}}>Prescriptions</div>
            {!canWriteRx&&<Badge color="neutral">Read only</Badge>}
            <button onClick={()=>setShowInactiveRx(v=>!v)} className="text-link" style={{fontSize:12}}>{showInactiveRx?"Hide past prescriptions":"Show past prescriptions"}</button>
          </div>
          {canWriteRx&&<button onClick={()=>setSr(true)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>New prescription</button>}
        </div>
        {rxs.length>0||showInactiveRx?(<table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
          <thead><tr>{["Medication","Dose","Instructions","Refills","Date","Status",""].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {rxs.map((r)=>{
              const histOpen=expandedRxHistory.has(r.id);
              const hist=rxHistory[r.id]||[];
              return(
                <React.Fragment key={r.id}>
                  <tr style={{borderBottom:histOpen?"none":`1px solid ${C.border}`}}>
                    <td style={{padding:"12px 16px",fontWeight:500,color:C.text}}>{r.med}</td>
                    <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.dose}</td>
                    <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.sig}</td>
                    <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.refills}</td>
                    <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.date?fmt(r.date):"—"}</td>
                    <td style={{padding:"12px 16px"}}><Badge color="green">Active</Badge></td>
                    <td style={{padding:"12px 16px"}}>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {p.refills&&setRefillRequests&&<button onClick={()=>setRefillRequests(prev=>[...prev,{id:Date.now(),patientId:patient.id,patient:`${patient.first_name} ${patient.last_name}`,medication:`${r.med} ${r.dose}`,requestedBy:user.role,requestedByName:user.name,date:today(),status:"pending",approvedBy:null,note:""}])} className="btn btn-secondary btn-sm" >Request refill</button>}
                        <button onClick={()=>setExpandedRxHistory(prev=>{const s=new Set(prev);s.has(r.id)?s.delete(r.id):s.add(r.id);return s;})} aria-expanded={histOpen} className="btn btn-secondary btn-sm">History<ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" style={{transform:histOpen?"rotate(180deg)":"none"}}/></button>
                      </div>
                    </td>
                  </tr>
                  {histOpen&&(
                    <tr>
                      <td colSpan={7} style={{padding:"0 16px 16px",borderBottom:`1px solid ${C.border}`}}>
                        <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"16px 16px",border:`1px solid ${C.border}`}}>
                          <div style={{fontWeight:500,fontSize:12,color:C.muted,marginBottom:12}}>Refill History — {r.med}</div>
                          {hist.length===0?<div style={{fontSize:13,color:C.muted}}>No history recorded.</div>:(
                            <div style={{position:"relative",paddingLeft:24}}>
                              <div style={{position:"absolute",left:8,top:0,bottom:0,width:2,background:C.border}}/>
                              {hist.map((h,hi)=>{
                                const dotColor=h.action==="Prescribed"?C.green:h.action==="Refilled"?C.blue:C.amber;
                                return(
                                  <div key={h.id} style={{position:"relative",marginBottom:16,display:"flex",gap:12,alignItems:"flex-start"}}>
                                    <div style={{position:"absolute",left:-20,top:3,width:12,height:12,borderRadius:"50%",background:dotColor,border:`2px solid ${C.surface}`,flexShrink:0}}/>
                                    <div style={{flex:1}}>
                                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:2}}>
                                        <span style={{fontSize:12,color:C.muted}}>{fmt(h.date)}</span>
                                        <Badge color={h.action==="Prescribed"?"green":h.action==="Refilled"?"blue":"amber"}>{h.action}</Badge>
                                        <span style={{fontSize:12,color:C.muted}}>by {h.by}</span>
                                      </div>
                                      {h.note&&<div style={{fontSize:12,color:C.text}}>{h.note}</div>}
                                      <div style={{fontSize:12,color:C.muted}}>Qty: {h.qty} · {h.daysSupply} days supply</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {showInactiveRx&&inactiveRxs.map((r)=><tr key={r.id} style={{borderBottom:`1px solid ${C.border}`,opacity:0.6}}><td style={{padding:"12px 16px",fontWeight:500,color:C.text}}>{r.med}</td><td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.dose}</td><td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.sig}</td><td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.refills}</td><td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{r.date?fmt(r.date):"—"}</td><td style={{padding:"12px 16px"}}><Badge color="red">Inactive</Badge></td><td/></tr>)}
          </tbody>
        </table>):<div style={{color:C.muted,fontSize:13}}>No prescriptions on file.</div>}
      </Card>)}
      {tab==="labs"&&(()=>{
        const canOrderLabs=p.writeRx;
        const[showOrderForm,setShowOrderForm]=useState(false);
        const[orderForm,setOrderForm]=useState({name:"",orderedBy:user.name});
        const[enterResultsId,setEnterResultsId]=useState(null);
        const[resultRows,setResultRows]=useState([{name:"",value:"",unit:"",low:"",high:""}]);
        const pendingLabs=labResults.filter(l=>l.status==="pending");
        const resultedLabs=labResults.filter(l=>l.status!=="pending");
        const submitOrder=()=>{
          if(!orderForm.name)return;
          setLabResults(prev=>[...prev,{id:Date.now(),name:orderForm.name,date:today(),status:"pending",orderedBy:orderForm.orderedBy,values:[]}]);
          setOrderForm({name:"",orderedBy:user.name});setShowOrderForm(false);
        };
        const submitResults=(labId)=>{
          const vals=resultRows.filter(r=>r.name&&r.value).map(r=>({name:r.name,value:parseFloat(r.value)||0,unit:r.unit,low:parseFloat(r.low)||0,high:parseFloat(r.high)||999}));
          const hasAbnormal=vals.some(v=>v.value>v.high||v.value<v.low);
          setLabResults(prev=>prev.map(l=>l.id===labId?{...l,status:"resulted",abnormal:hasAbnormal,values:vals}:l));
          setEnterResultsId(null);setResultRows([{name:"",value:"",unit:"",low:"",high:""}]);
        };
        return(
          <Card style={{padding:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text}}>Lab results</div>
              {canOrderLabs&&<button onClick={()=>setShowOrderForm(v=>!v)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Order lab</button>}
            </div>
            {showOrderForm&&(
              <div style={{background:C.raised,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px",marginBottom:16}}>
                <FR><FF label="Lab name"><input value={orderForm.name} onChange={e=>setOrderForm(f=>({...f,name:e.target.value}))} style={IS} placeholder="e.g. Complete Blood Count"/></FF><FF label="Ordered by"><input value={orderForm.orderedBy} onChange={e=>setOrderForm(f=>({...f,orderedBy:e.target.value}))} style={IS}/></FF></FR>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowOrderForm(false)}>Cancel</XB><PB onClick={submitOrder} disabled={!orderForm.name}>Place order</PB></div>
              </div>
            )}
            {pendingLabs.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontWeight:600,fontSize:13,color:C.amber,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:C.amber,display:"inline-block"}}/>Pending Orders ({pendingLabs.length})
                </div>
                {pendingLabs.map((lab)=>(
                  <div key={lab.id} style={{background:C.amberBg,border:`1px solid ${tint(C.amber,19)}`,borderRadius:8,padding:"12px 16px",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:500,fontSize:14,color:C.text}}>{lab.name}</div>
                        <div style={{fontSize:12,color:C.muted,marginTop:2}}>Ordered {fmt(lab.date)} by {lab.orderedBy||"—"}</div>
                      </div>
                      <Badge color="amber">Pending</Badge>
                      {canOrderLabs&&<button onClick={()=>{setEnterResultsId(lab.id===enterResultsId?null:lab.id);setResultRows([{name:"",value:"",unit:"",low:"",high:""}]);}} style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:6,border:`1px solid ${C.navyMid}`,background:C.blueBg,color:C.navyMid,cursor:"pointer"}}>Enter Results</button>}
                    </div>
                    {enterResultsId===lab.id&&(
                      <div style={{marginTop:16,background:C.surface,borderRadius:8,padding:"16px",border:`1px solid ${C.border}`}}>
                        <div style={{fontWeight:500,fontSize:12,color:C.muted,marginBottom:10}}>Enter Test Values</div>
                        {resultRows.map((row,ri)=>(
                          <div key={ri} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 70px 70px auto",gap:8,marginBottom:8,alignItems:"center"}}>
                            <input value={row.name} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,name:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Test name"/>
                            <input value={row.value} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,value:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Value" type="number"/>
                            <input value={row.unit} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,unit:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Unit"/>
                            <input value={row.low} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,low:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Low" type="number"/>
                            <input value={row.high} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,high:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="High" type="number"/>
                            <button onClick={()=>setResultRows(prev=>prev.filter((_,j)=>j!==ri))} aria-label="Remove row" className="icon-btn" style={{border:"none",color:C.muted,cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={14} strokeWidth={1.5}/></button>
                          </div>
                        ))}
                        <div style={{display:"flex",gap:8,marginTop:6}}>
                          <button onClick={()=>setResultRows(prev=>[...prev,{name:"",value:"",unit:"",low:"",high:""}])} className="btn btn-secondary btn-sm" ><Icon as={Plus} size={14}/>Add row</button>
                          <div style={{flex:1}}/>
                          <XB onClick={()=>setEnterResultsId(null)}>Cancel</XB>
                          <PB onClick={()=>submitResults(lab.id)}>Save Results</PB>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {resultedLabs.length>0&&(
              <div>
                {pendingLabs.length>0&&<div style={{fontWeight:600,fontSize:13,color:C.green,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:C.green,display:"inline-block"}}/>Resulted ({resultedLabs.length})
                </div>}
                {resultedLabs.map((lab,i)=>{
                  const isExp=expandedLab===lab.id;
                  return(
                    <div key={lab.id} style={{borderBottom:i<resultedLabs.length-1?`1px solid ${C.border}`:"none"}}>
                      <div onClick={()=>setExpandedLab(isExp?null:lab.id)} style={{padding:"12px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:500,fontSize:14,color:C.text}}>{lab.name}</div>
                          <div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmt(lab.date)}{lab.orderedBy&&<span> · {lab.orderedBy}</span>}</div>
                        </div>
                        <Badge color="neutral">Resulted</Badge>
                        {lab.abnormal?<Badge color="red">Abnormal</Badge>:<span style={{fontSize:12,color:C.muted}}>Normal</span>}
                        <ChevronDown size={16} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,transform:isExp?"rotate(180deg)":"none",transition:"transform 160ms var(--ease)"}}/>
                      </div>
                      {isExp&&lab.values&&lab.values.length>0&&(
                        <div style={{background:C.raised,borderTop:`1px solid ${C.border}`,padding:"12px 16px"}}>
                          <table style={{width:"100%",borderCollapse:"collapse"}}>
                            <thead><tr style={{background:C.surface}}>{["Test","Value","Unit","Reference Range","Flag"].map(h=><th key={h} style={{padding:"12px 12px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                            <tbody>{lab.values.map((val,vi)=>{
                              const isHigh=val.value>val.high;
                              const isLow=val.value<val.low;
                              const isAbnormal=isHigh||isLow;
                              return(
                                <tr key={vi} style={{background:isAbnormal?C.redBg:"transparent",borderBottom:vi<lab.values.length-1?`1px solid ${C.border}`:"none"}}>
                                  <td style={{padding:"8px 12px",fontWeight:500,fontSize:13,color:C.text}}>{val.name}</td>
                                  <td style={{padding:"8px 12px",fontSize:13,fontWeight:500,color:isAbnormal?C.red:C.text}}>{val.value}</td>
                                  <td style={{padding:"8px 12px",fontSize:12,color:C.muted}}>{val.unit}</td>
                                  <td style={{padding:"8px 12px",fontSize:12,color:C.muted}}>{val.low} – {val.high===999?"No upper limit":val.high}</td>
                                  <td style={{padding:"8px 12px"}}>{isHigh?<Badge color="red">High</Badge>:isLow?<Badge color="red">Low</Badge>:<span style={{fontSize:12,color:C.muted}}>Normal</span>}</td>
                                </tr>
                              );
                            })}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {labResults.length===0&&<div style={{border:`1px dashed ${C.border2}`,borderRadius:8,padding:"40px 20px",textAlign:"center",color:C.muted,fontSize:13}}><FileText size={28} strokeWidth={1.5} aria-hidden="true" style={{marginBottom:8}}/><div>No lab results on file</div></div>}
          </Card>
        );
      })()}
      {tab==="notes"&&(()=>{
        const [noteSearch,setNoteSearch]=React.useState("");
        const [noteDrFilter,setNoteDrFilter]=React.useState("All");
        const [noteFrom,setNoteFrom]=React.useState("");
        const [noteTo,setNoteTo]=React.useState("");
        const [signedOnly,setSignedOnly]=React.useState(false);
        const noteDoctors=["All",...Array.from(new Set(ptN.map(n=>n.doctor)))];
        const hl=(text,term)=>{
          if(!term||!text)return text||"";
          const idx=text.toLowerCase().indexOf(term.toLowerCase());
          if(idx===-1)return text;
          const parts=[];let pos=0;
          let t=text;
          let tl=t.toLowerCase(),sl=term.toLowerCase();
          let i=tl.indexOf(sl);
          while(i!==-1){
            if(i>pos)parts.push(t.slice(pos,i));
            parts.push(<mark key={pos} style={{background:C.amberBg,color:C.text,borderRadius:4,padding:"0 1px"}}>{t.slice(i,i+term.length)}</mark>);
            pos=i+term.length;
            i=tl.indexOf(sl,pos);
          }
          if(pos<t.length)parts.push(t.slice(pos));
          return parts;
        };
        const filtered=ptN.filter(n=>{
          if(signedOnly&&!n.signed)return false;
          if(noteDrFilter!=="All"&&n.doctor!==noteDrFilter)return false;
          if(noteFrom&&n.date<noteFrom)return false;
          if(noteTo&&n.date>noteTo)return false;
          if(noteSearch){
            const s=noteSearch.toLowerCase();
            return (n.chief||"").toLowerCase().includes(s)||(n.assessment||"").toLowerCase().includes(s)||(n.plan||"").toLowerCase().includes(s)||(n.doctor||"").toLowerCase().includes(s);
          }
          return true;
        });
        return(<Card style={{padding:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontWeight:600,fontSize:15,color:C.text}}>Visit notes</div>
              {!canWriteNotes&&<Badge color="neutral">Read only</Badge>}
            </div>
            {canWriteNotes&&<button onClick={()=>setSn(true)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>New note</button>}
          </div>
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 16px",marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr auto",gap:10,alignItems:"flex-end"}}>
              <div><div style={LS}>Search</div><input value={noteSearch} onChange={e=>setNoteSearch(e.target.value)} placeholder="Chief, assessment, plan, doctor…" style={{...IS,width:"100%",boxSizing:"border-box"}}/></div>
              <div><div style={LS}>Doctor</div><select value={noteDrFilter} onChange={e=>setNoteDrFilter(e.target.value)} style={{...SS,width:"100%"}}>{noteDoctors.map(d=><option key={d}>{d}</option>)}</select></div>
              <div><div style={LS}>From</div><input type="date" value={noteFrom} onChange={e=>setNoteFrom(e.target.value)} style={{...IS,width:"100%",boxSizing:"border-box"}}/></div>
              <div><div style={LS}>To</div><input type="date" value={noteTo} onChange={e=>setNoteTo(e.target.value)} style={{...IS,width:"100%",boxSizing:"border-box"}}/></div>
              <div style={{paddingBottom:2}}><label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.text,cursor:"pointer",whiteSpace:"nowrap"}}><input type="checkbox" checked={signedOnly} onChange={e=>setSignedOnly(e.target.checked)}/>Signed only</label></div>
            </div>
            <div style={{marginTop:8,fontSize:12,color:C.muted}}>Showing {filtered.length} of {ptN.length} notes</div>
          </div>
          {filtered.length>0?filtered.map(n=>(
            <div key={n.id} style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"16px",marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div>
                  <div style={{fontWeight:600,fontSize:13,color:C.text}}>{hl(n.chief,noteSearch)}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmt(n.date)} · {hl(n.doctor,noteSearch)}</div>
                </div>
                {n.signed?<Badge color="green">Signed</Badge>:<Badge color="amber">Draft</Badge>}
              </div>
              {n.assessment&&<div style={{marginBottom:8}}><div style={{fontSize:12,color:C.muted,marginBottom:4}}>Assessment</div><div style={{fontSize:13,color:C.text}}>{hl(n.assessment,noteSearch)}</div></div>}
              {n.plan&&<div><div style={{fontSize:12,color:C.muted,marginBottom:4}}>Plan</div><div style={{fontSize:13,color:C.text}}>{hl(n.plan,noteSearch)}</div></div>}
            </div>
          )):<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>{ptN.length===0?"No visit notes yet.":"No notes match your filters."}</div>}
        </Card>);
      })()}
      {tab==="files"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text}}>Documents</div>
          <label className="btn btn-primary btn-sm" style={{display:"inline-block"}}>
            + Upload
            <input type="file" style={{display:"none"}} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.xls,.xlsx"/>
          </label>
        </div>
        {patFiles.length>0?(<table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
          <thead><tr>{["File Name","Type","Date","Size",""].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{patFiles.map((f,i)=>(
            <tr key={f.id} style={{borderBottom:i<patFiles.length-1?`1px solid ${C.border}`:"none"}}>
              <td style={{padding:"12px 16px",fontWeight:500,color:C.text}}><span style={{display:"inline-flex",alignItems:"center",gap:8}}><Icon as={FileText} style={{color:C.text2}}/>{f.name}</span></td>
              <td style={{padding:"12px 16px"}}><Badge color="blue">{f.type}</Badge></td>
              <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{fmt(f.date)}</td>
              <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{f.size}</td>
              <td style={{padding:"12px 16px",textAlign:"right"}}><button onClick={()=>setPatFiles(prev=>prev.filter(x=>x.id!==f.id))} style={{fontSize:11,fontWeight:600,padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.red,cursor:"pointer"}}>Remove</button></td>
            </tr>
          ))}</tbody>
        </table>):(
          <label style={{border:`1px dashed ${C.border2}`,borderRadius:8,padding:"40px 20px",textAlign:"center",color:C.muted,fontSize:13,cursor:"pointer",display:"block"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.navyMid} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <FolderOpen size={28} strokeWidth={1.5} aria-hidden="true" style={{marginBottom:8}}/>
            <div>No files yet — click to upload</div>
            <input type="file" style={{display:"none"}} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.xls,.xlsx"/>
          </label>
        )}
      </Card>)}
      {tab==="recalls"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:600,fontSize:15,color:C.text}}>Recall flags</div><button onClick={()=>setSc(true)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Add recall</button></div>
        {recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).length>0?recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).map((r,i,arr)=><div key={r.id} style={{padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.reason}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Due {fmt(r.due)}</div></div><Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge></div>):<div style={{color:C.muted,fontSize:13}}>No recall flags for this patient.</div>}
      </Card>)}
      {tab==="vaccines"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text}}>Immunization records</div>
          <button onClick={()=>setShowVaccineForm(v=>!v)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>Add vaccine</button>
        </div>
        {showVaccineForm&&(
          <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"16px",marginBottom:16,border:`1px solid ${C.border}`}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>New vaccine record</div>
            <FR><FF label="Vaccine name"><input value={vaccineForm.vaccine} onChange={e=>setVaccineForm(f=>({...f,vaccine:e.target.value}))} style={IS} placeholder="e.g. Influenza"/></FF><FF label="Date administered"><input type="date" value={vaccineForm.date} onChange={e=>setVaccineForm(f=>({...f,date:e.target.value}))} style={IS}/></FF></FR>
            <FR><FF label="Given by"><input value={vaccineForm.given_by} onChange={e=>setVaccineForm(f=>({...f,given_by:e.target.value}))} style={IS}/></FF><FF label="Lot number"><input value={vaccineForm.lot} onChange={e=>setVaccineForm(f=>({...f,lot:e.target.value}))} style={IS}/></FF></FR>
            <FR cols={1}><FF label="Next due (optional)"><input type="date" value={vaccineForm.next_due} onChange={e=>setVaccineForm(f=>({...f,next_due:e.target.value}))} style={IS}/></FF></FR>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <XB onClick={()=>setShowVaccineForm(false)}>Cancel</XB>
              <PB onClick={()=>{if(!vaccineForm.vaccine)return;setVaccines(prev=>[...prev,{...vaccineForm,id:Date.now()}]);setVaccineForm({vaccine:"",date:today(),given_by:user.name,lot:"",next_due:""});setShowVaccineForm(false);}}>Save</PB>
            </div>
          </div>
        )}
        {vaccines.length>0?(
          <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
            <thead><tr>{["Vaccine","Date","Given By","Lot #","Next Due"].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{vaccines.map((v,i)=>{
              const dueColor=!v.next_due?null:(v.next_due<today()?C.red:((new Date(v.next_due)-new Date())<90*86400000?C.amber:C.green));
              return(
                <tr key={v.id} style={{borderBottom:i<vaccines.length-1?`1px solid ${C.border}`:"none"}}>
                  <td style={{padding:"12px 16px",fontWeight:500,color:C.text}}>{v.vaccine}</td>
                  <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{fmt(v.date)}</td>
                  <td style={{padding:"12px 16px",color:C.text2,fontSize:13}}>{v.given_by}</td>
                  <td style={{padding:"12px 16px",color:C.muted,fontFamily:C.mono,fontSize:12}}>{v.lot||"—"}</td>
                  <td style={{padding:"12px 16px"}}>
                    {v.next_due?<span style={{color:dueColor,fontWeight:600,fontSize:13}}>{fmt(v.next_due)}</span>:<span style={{color:C.muted,fontSize:12,fontWeight:500}}>—</span>}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        ):<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>No vaccine records on file.</div>}
      </Card>)}
      {tab==="referrals"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:600,fontSize:15,color:C.text}}>Referrals</div>
          <button onClick={()=>setShowReferralForm(v=>!v)} className="btn btn-primary btn-sm" ><Icon as={Plus} size={14}/>New referral</button>
        </div>
        {showReferralForm&&(
          <div style={{border:`1px solid ${C.border}`,borderRadius:6,padding:"16px",marginBottom:16,border:`1px solid ${C.border}`}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:12}}>New referral</div>
            <FR><FF label="Specialist"><input value={referralForm.specialist} onChange={e=>setReferralForm(f=>({...f,specialist:e.target.value}))} style={IS} placeholder="e.g. Cardiologist"/></FF><FF label="Facility"><input value={referralForm.facility} onChange={e=>setReferralForm(f=>({...f,facility:e.target.value}))} style={IS} placeholder="Hospital or clinic name"/></FF></FR>
            <FR cols={1}><FF label="Reason"><input value={referralForm.reason} onChange={e=>setReferralForm(f=>({...f,reason:e.target.value}))} style={IS} placeholder="Reason for referral"/></FF></FR>
            <FR cols={1}><FF label="Notes"><textarea value={referralForm.notes} onChange={e=>setReferralForm(f=>({...f,notes:e.target.value}))} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <XB onClick={()=>setShowReferralForm(false)}>Cancel</XB>
              <PB onClick={()=>{if(!referralForm.specialist)return;setReferrals(prev=>[...prev,{id:Date.now(),specialist:referralForm.specialist,facility:referralForm.facility,reason:referralForm.reason,sentDate:today(),status:"sent",notes:referralForm.notes}]);setReferralForm({specialist:"",facility:"",reason:"",notes:""});setShowReferralForm(false);}}>Save</PB>
            </div>
          </div>
        )}
        {referrals.length>0?(
          <table className="tbl" style={{width:"calc(100% + 40px)",margin:"0 -20px",borderCollapse:"collapse"}}>
            <thead><tr>{["Specialist","Facility","Reason","Sent Date","Status","Notes"].map(h=><th key={h} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{referrals.map((r,i)=>(
              <tr key={r.id} style={{borderBottom:i<referrals.length-1?`1px solid ${C.border}`:"none"}}>
                <td style={{padding:"12px 16px",fontWeight:500,color:C.text}}>{r.specialist}</td>
                <td style={{padding:"12px 16px",color:C.muted,fontSize:12,fontWeight:500}}>{r.facility}</td>
                <td style={{padding:"12px 16px",color:C.muted,fontSize:12,fontWeight:500}}>{r.reason}</td>
                <td style={{padding:"12px 16px",color:C.muted,fontSize:12,fontWeight:500}}>{fmt(r.sentDate)}</td>
                <td style={{padding:"12px 16px"}}>
                  {editingReferral===r.id?(
                    <select defaultValue={r.status} onChange={e=>setReferrals(prev=>prev.map(x=>x.id===r.id?{...x,status:e.target.value}:x))} style={{...SS,width:130,fontSize:12,padding:"4px 8px"}}>
                      {["sent","received","scheduled","completed"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  ):(
                    <span onClick={()=>setEditingReferral(r.id)} style={{cursor:"pointer"}}>
                      <Badge color={r.status==="sent"?"blue":r.status==="received"?"amber":r.status==="scheduled"?"purple":"green"}>{r.status}</Badge>
                    </span>
                  )}
                </td>
                <td style={{padding:"12px 16px",color:C.muted,fontSize:12,fontWeight:500,maxWidth:160}}>{editingReferral===r.id?(
                  <input defaultValue={r.notes} onBlur={e=>{setReferrals(prev=>prev.map(x=>x.id===r.id?{...x,notes:e.target.value}:x));setEditingReferral(null);}} style={{...IS,fontSize:12,padding:"4px 8px"}} autoFocus/>
                ):r.notes||<span style={{fontStyle:"italic"}}>—</span>}</td>
              </tr>
            ))}</tbody>
          </table>
        ):<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>No referrals on file.</div>}
      </Card>)}
      {tab==="timeline"&&(()=>{
        const patientFullN=`${patient.first_name} ${patient.last_name}`;
        const apptEvents=(appts||[]).filter(a=>a.patient===patientFullN).map(a=>({type:"appointment",date:a.date,title:a.type.replace(/-/g," "),detail:`${a.doctor} \u00b7 ${a.status}`,status:a.status,id:"a"+a.id}));
        const noteEvents=(notes[patient.id]||[]).map(n=>({type:"note",date:n.date,title:"Clinical Note",detail:n.chief,signed:n.signed,id:"n"+n.id}));
        const vhEvents=(INIT_VITALS_HISTORY[patient.id]||[]).map((e,i)=>({type:"vitals",date:e.date,title:"Vitals Recorded",detail:`BP: ${e.bp}, Weight: ${e.weight}lbs`,id:"v"+i}));
        const allEvents=[...apptEvents,...noteEvents,...vhEvents].sort((a,b)=>b.date.localeCompare(a.date));
        if(allEvents.length===0)return(
          <Card style={{padding:"40px",textAlign:"center"}}><ClipboardList size={28} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,marginBottom:8}}/><div style={{color:C.muted,fontSize:13}}>No history recorded for this patient</div></Card>
        );
        // Group by month
        const groups={};
        allEvents.forEach(ev=>{
          const [y,m]=ev.date.split("-");
          const key=`${y}-${m}`;
          if(!groups[key])groups[key]=[];
          groups[key].push(ev);
        });
        const typeIcon={appointment:CalendarDays,note:NotebookPen,vitals:Activity};
        const MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
        return(
          <Card style={{padding:"20px"}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:20}}>Patient history timeline</div>
            {Object.entries(groups).sort((a,b)=>b[0].localeCompare(a[0])).map(([key,evts])=>{
              const [y,m]=key.split("-");
              const monthLabel=`${MONTH_NAMES[parseInt(m)-1]} ${y}`;
              return(
                <div key={key}>
                  <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0 12px"}}>
                    <div style={{flex:1,height:1,background:C.border}}/>
                    <div style={{fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>{monthLabel}</div>
                    <div style={{flex:1,height:1,background:C.border}}/>
                  </div>
                  <div style={{position:"relative",paddingLeft:32}}>
                    <div style={{position:"absolute",left:11,top:0,bottom:0,width:2,background:C.border}}/>
                    {evts.map(ev=>{
                      const TI=typeIcon[ev.type]||ClipboardList;
                      return(
                        <div key={ev.id} style={{position:"relative",marginBottom:16,display:"flex",gap:16,alignItems:"flex-start"}}>
                          <div style={{position:"absolute",left:-21,top:6,width:22,height:22,borderRadius:"50%",background:C.surface,border:`1px solid ${C.border2}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><TI size={12} strokeWidth={1.5} aria-hidden="true"/></div>
                          <div style={{flex:1,border:`1px solid ${C.border}`,borderRadius:6,padding:"10px 16px"}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                              <div style={{fontWeight:500,fontSize:14,color:C.text}}>{ev.title.charAt(0).toUpperCase()+ev.title.slice(1)}</div>
                              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                                <span style={{fontSize:12,color:C.muted,whiteSpace:"nowrap"}}>{fmt(ev.date)}</span>
                                {ev.status&&<SB status={ev.status}/>}
                                {ev.type==="note"&&(ev.signed?<Badge color="green">Signed</Badge>:<Badge color="amber">Draft</Badge>)}
                              </div>
                            </div>
                            <div style={{fontSize:12,color:C.muted}}>{ev.detail}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </Card>
        );
      })()}
    </div>
  );
}

function PatientsPage({user,patients,setPatients,vitals,setVitals,rx,setRx,notes,setNotes,recalls,setRecalls,appts,setAppts,draftNotes,setDraftNotes,refillRequests,setRefillRequests,onOpenPatient,openPatientId,setOpenPatientId,setPage,showToast,addAudit}){
  const[search,setSearch]=useState("");const[sel,setSel]=useState(null);const[showNew,setShowNew]=useState(false);
  const[quickMenu,setQuickMenu]=useState(null); // patient id with open menu
  const[quickNewAppt,setQuickNewAppt]=useState(null);
  const[quickRecall,setQuickRecall]=useState(null);
  const[quickVitals,setQuickVitals]=useState(null);
  const[loading,setLoading]=useState(true);
  // Filter/sort bar state
  const[filterStatus,setFilterStatus]=useState("all");
  const[filterIns,setFilterIns]=useState("all");
  const[filterRisk,setFilterRisk]=useState("all");
  const[filterDoc,setFilterDoc]=useState("all");
  const[sortBy,setSortBy]=useState("name-az");
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),600);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    if(openPatientId){const pt=patients.find(p=>p.id===openPatientId);if(pt){setSel(pt);if(setOpenPatientId)setOpenPatientId(null);}}
  },[openPatientId]);
  const nextAppt=(pid)=>{
    const pName=patients.find(p=>p.id===pid);
    if(!pName)return null;
    const name=`${pName.first_name} ${pName.last_name}`;
    return appts.filter(a=>a.patient===name&&a.date>="2026-02-25"&&a.status!=="completed"&&a.status!=="no-show").sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))[0]||null;
  };
  // Derived filter options
  const allInsurances=["all",...[...new Set(patients.map(p=>p.insurance).filter(Boolean))]];
  const allDoctors=["all",...[...new Set(appts.map(a=>a.doctor).filter(Boolean))]];
  const getRiskLevel=(p)=>{const s=computeRisk(p,rx,vitals,INIT_LABS,appts||[]);return s>=6?"high":s>=3?"medium":"low";};
  const lastDocFor=(p)=>{
    const name=`${p.first_name} ${p.last_name}`;
    const sorted=appts.filter(a=>a.patient===name&&a.status==="completed").sort((a,b)=>b.date.localeCompare(a.date));
    return sorted[0]?.doctor||null;
  };
  const hasFilters=search||filterStatus!=="all"||filterIns!=="all"||filterRisk!=="all"||filterDoc!=="all";
  const clearFilters=()=>{setSearch("");setFilterStatus("all");setFilterIns("all");setFilterRisk("all");setFilterDoc("all");setSortBy("name-az");};
  const q=search.toLowerCase();
  let filt=patients.filter(p=>{
    if(q){
      const name=`${p.first_name} ${p.last_name}`.toLowerCase();
      const phone=(p.phone||"").toLowerCase();
      const ins=(p.insurance||"").toLowerCase();
      if(!name.includes(q)&&!phone.includes(q)&&!ins.includes(q))return false;
    }
    if(filterStatus!=="all"){if(filterStatus==="active"&&p.active===false)return false;if(filterStatus==="inactive"&&p.active!==false)return false;}
    if(filterIns!=="all"&&p.insurance!==filterIns)return false;
    if(filterRisk!=="all"&&getRiskLevel(p)!==filterRisk)return false;
    if(filterDoc!=="all"&&lastDocFor(p)!==filterDoc)return false;
    return true;
  });
  filt=[...filt].sort((a,b)=>{
    if(sortBy==="name-az")return `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`);
    if(sortBy==="name-za")return `${b.last_name}${b.first_name}`.localeCompare(`${a.last_name}${a.first_name}`);
    if(sortBy==="visit-new")return (b.lastVisit||"").localeCompare(a.lastVisit||"");
    if(sortBy==="visit-old")return (a.lastVisit||"").localeCompare(b.lastVisit||"");
    if(sortBy==="risk")return computeRisk(b,rx,vitals,INIT_LABS,appts||[])-computeRisk(a,rx,vitals,INIT_LABS,appts||[]);
    return 0;
  });
  if(sel)return<div key={sel.id} style={{animation:"rise 220ms var(--ease)"}}><PatientProfile patient={sel} onBack={()=>setSel(null)} user={user} vitals={vitals} setVitals={setVitals} rx={rx} setRx={setRx} notes={notes} setNotes={setNotes} recalls={recalls} setRecalls={setRecalls} patients={patients} setPatients={setPatients} draftNotes={draftNotes||{}} setDraftNotes={setDraftNotes} refillRequests={refillRequests} setRefillRequests={setRefillRequests} onOpenPatient={onOpenPatient} appts={appts} addAudit={addAudit}/></div>;
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      {showNew&&<NewPatientModal onClose={()=>setShowNew(false)} onSave={p=>{setPatients(prev=>[...prev,p]);setShowNew(false);}}/>}
      {quickNewAppt&&<NewApptModal onClose={()=>setQuickNewAppt(null)} onSave={a=>{setAppts(p=>[...p,a]);setQuickNewAppt(null);}} patients={patients} appts={appts} defaultDate="2026-02-25"/>}
      {quickRecall&&<RecallModal onClose={()=>setQuickRecall(null)} onSave={r=>{setRecalls(p=>[...p,r]);setQuickRecall(null);}} patients={patients}/>}
      {quickVitals&&<VitalsModal patient={quickVitals} onClose={()=>setQuickVitals(null)} onSave={(pid,data)=>{setVitals(p=>({...p,[pid]:[...(p[pid]||[]),{id:Date.now(),date:today(),...data,recordedBy:user.name}]}));setQuickVitals(null);}}/>}
      {loading&&<div>{[...Array(5)].map((_,i)=><div key={i} style={{background:C.skeleton,borderRadius:8,height:44,marginBottom:8,animation:"pulse 1.6s ease-in-out infinite"}}/>)}</div>}
      {!loading&&<>
      <PageHeader title="Patients" meta={`${patients.length} registered · ${patients.filter(p=>p.active!==false).length} active`}
        actions={<>
          {permsFor(user).refills&&!permsFor(user).refillApprove&&setPage&&<XB onClick={()=>setPage("refills")}><Icon as={Pill}/>Refill queue</XB>}
          {permsFor(user).registerPatients&&<PB onClick={()=>setShowNew(true)}><Icon as={Plus}/>New patient</PB>}
        </>}/>
      {/* ── Filter / Sort bar ── */}
      <div style={{marginBottom:12,display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:"1 1 220px"}}><Search size={16} strokeWidth={1.5} aria-hidden="true" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted}}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone, insurance…" aria-label="Search patients" style={{...IS,paddingLeft:36,fontSize:13}}/></div>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...SS,flex:"0 0 110px",padding:"8px 10px",fontSize:13}}>
          <option value="all">Any status</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
        <select value={filterIns} onChange={e=>setFilterIns(e.target.value)} style={{...SS,flex:"0 0 130px",padding:"8px 10px",fontSize:13}}>
          {allInsurances.map(ins=><option key={ins} value={ins}>{ins==="all"?"Any insurance":ins}</option>)}
        </select>
        <select value={filterRisk} onChange={e=>setFilterRisk(e.target.value)} style={{...SS,flex:"0 0 130px",padding:"8px 10px",fontSize:13}}>
          <option value="all">Any risk</option><option value="high">High risk</option><option value="medium">Medium risk</option><option value="low">Low risk</option>
        </select>
        <select value={filterDoc} onChange={e=>setFilterDoc(e.target.value)} style={{...SS,flex:"0 0 140px",padding:"8px 10px",fontSize:13}}>
          {allDoctors.map(d=><option key={d} value={d}>{d==="all"?"Any doctor":d}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...SS,flex:"0 0 160px",padding:"8px 10px",fontSize:13}}>
          <option value="name-az">Name (A–Z)</option>
          <option value="name-za">Name (Z–A)</option>
          <option value="visit-new">Last visit (newest)</option>
          <option value="visit-old">Last visit (oldest)</option>
          <option value="risk">Risk (highest first)</option>
        </select>
        {hasFilters&&<button onClick={clearFilters} className="btn btn-secondary"><Icon as={X}/>Clear</button>}
      </div>
      <div style={{fontSize:12,color:C.muted,marginBottom:8}}>Showing {filt.length} of {patients.length} patients</div>
      <Card>
        <table className="tbl" style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Patient","Status","Date of birth","Phone","Insurance","Next appointment","Allergies",""].map((h,hi)=><th key={hi} style={{padding:"12px 16px 8px",textAlign:"left",fontSize:12,fontWeight:400,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{filt.map((p,i)=>{
            const next=nextAppt(p.id);
            const isOpen=quickMenu===p.id;
            return(
              <tr key={p.id} onClick={()=>setSel(p)} className="row-link" style={{borderBottom:i<filt.length-1?`1px solid ${C.border}`:"none"}}>
                <td style={{padding:"12px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:30,height:30,borderRadius:"50%",background:C.raised,border:`1px solid ${C.border}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,flexShrink:0}}>{p.first_name[0]}{p.last_name[0]}</div><div><div style={{fontWeight:500,fontSize:14,color:C.text}}>{p.first_name} {p.last_name}</div><div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><RiskBadge score={computeRisk(p,rx,vitals,INIT_LABS,appts||[])}/>{p.dnc&&<Badge color="red">Do not contact</Badge>}</div></div></div></td>
                <td style={{padding:"12px 16px"}}><Badge color={p.active===false?"neutral":"green"}>{p.active===false?"Inactive":"Active"}</Badge></td>
                <td style={{padding:"12px 16px",fontSize:13,color:C.text2}}>{fmt(p.dob)} <span style={{color:C.muted}}>· {age(p.dob)} yrs</span></td>
                <td style={{padding:"12px 16px",fontSize:13,color:C.text2,fontFamily:C.mono,fontVariantNumeric:"tabular-nums"}}>{p.phone}</td>
                <td style={{padding:"12px 16px"}}><InsuranceBadge insurance={p.insurance}/></td>
                <td style={{padding:"12px 16px",fontSize:13,color:next?C.text:C.muted}}>{next?<>{fmt(next.date).replace(/, \d{4}$/,"")} <span style={{fontFamily:C.mono,color:C.text2}}>{next.time}</span></>:"—"}</td>
                <td style={{padding:"12px 16px"}}>{p.allergies.length>0?<Badge color="red">{p.allergies.length} allerg{p.allergies.length>1?"ies":"y"}</Badge>:<span style={{fontSize:12,color:C.muted}}>None</span>}</td>
                <td style={{padding:"12px 16px"}} onClick={e=>e.stopPropagation()}>
                  <div style={{position:"relative"}}>
                    <button onClick={e=>{e.stopPropagation();setQuickMenu(isOpen?null:p.id);}} className="btn btn-secondary btn-sm" >Actions <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true"/></button>
                    {isOpen&&(
                      <div role="menu" style={{position:"absolute",right:0,top:"100%",marginTop:4,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)",zIndex:50,minWidth:180,padding:6}}>
                        {[
                          ["Book appointment",()=>{setQuickMenu(null);setQuickNewAppt(p);}],
                          ["Add recall",()=>{setQuickMenu(null);setQuickRecall(p);}],
                          ...(permsFor(user).vitals?[["Record vitals",()=>{setQuickMenu(null);setQuickVitals(p);}]]:[]),
                          ["Open chart",()=>{setQuickMenu(null);setSel(p);}],
                        ].map(([lbl,fn])=>(
                          <button key={lbl} role="menuitem" onClick={fn} className="icon-btn" style={{display:"block",width:"100%",textAlign:"left",height:34,padding:"0 10px",border:"none",borderRadius:6,fontSize:13,color:C.text,cursor:"pointer",fontFamily:"inherit"}}>{lbl}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}</tbody>
        </table>
        {filt.length===0&&(
          <div style={{padding:"48px 24px",textAlign:"center",color:C.muted}}>
            <Search size={28} strokeWidth={1.5} aria-hidden="true" style={{marginBottom:12}}/>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:8}}>No patients match your filters</div>
            <button onClick={clearFilters} className="text-link">Clear filters</button>
          </div>
        )}
      </Card>
      </>}
    </div>
  );
}

function RecallsPage({recalls,setRecalls,patients,appts,setAppts,blockTimes}){
  const[filter,setFilter]=useState("all");const[showNew,setShowNew]=useState(false);
  const[sortDoc,setSortDoc]=useState("all");
  const[checked,setChecked]=useState(new Set());
  const[expandedLog,setExpandedLog]=useState(null);
  const[contactLogs,setContactLogs]=useState(INIT_CONTACT_LOGS);
  const[addingLog,setAddingLog]=useState(null);
  const[logForm,setLogForm]=useState({method:"Phone",outcome:""});
  const[pendingRecallAppt,setPendingRecallAppt]=useState(null);
  const[showBookAppt,setShowBookAppt]=useState(false);
  const done=(ids)=>setRecalls(p=>p.filter(r=>!ids.includes(r.id)));
  const completeSingle=(r)=>{done([r.id]);setPendingRecallAppt(r);};
  const DOCTORS=["all",...[...new Set(recalls.map(r=>r.doctor||"").filter(Boolean))]];
  let filt=filter==="all"?recalls:recalls.filter(r=>r.urgency===filter);
  if(sortDoc!=="all")filt=filt.filter(r=>r.doctor===sortDoc);
  const toggleCheck=(id)=>setChecked(prev=>{const s=new Set(prev);s.has(id)?s.delete(id):s.add(id);return s;});
  const addLog=(recallId)=>{
    if(!logForm.outcome.trim())return;
    setContactLogs(prev=>({...prev,[recallId]:[...(prev[recallId]||[]),{id:Date.now(),date:today(),method:logForm.method,outcome:logForm.outcome.trim()}]}));
    setLogForm({method:"Phone",outcome:""});setAddingLog(null);
  };
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      {showNew&&<RecallModal onClose={()=>setShowNew(false)} onSave={r=>{setRecalls(p=>[...p,r]);setShowNew(false);}} patients={patients}/>}
      {showBookAppt&&pendingRecallAppt&&(
        <NewApptModal
          onClose={()=>{setShowBookAppt(false);setPendingRecallAppt(null);}}
          onSave={(a)=>{if(setAppts)setAppts(p=>[...p,a]);setShowBookAppt(false);setPendingRecallAppt(null);}}
          patients={patients}
          appts={appts||[]}
          blockTimes={blockTimes||[]}
          prefill={{
            pid: patients.find(p=>`${p.first_name} ${p.last_name}`===pendingRecallAppt.patient)?.id||"",
            doc: pendingRecallAppt.doctor||"Dr. Patel",
            type: "follow-up",
            notes: pendingRecallAppt.reason||"",
          }}
        />
      )}
      {pendingRecallAppt&&!showBookAppt&&(
        <div style={{position:"fixed",inset:0,background:C.overlay,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
          <div role="dialog" aria-modal="true" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,width:"100%",maxWidth:440,boxShadow:"var(--shadow-lg)",overflow:"hidden",animation:"rise 220ms var(--ease)"}}>
            <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <CircleCheck size={20} strokeWidth={2} aria-hidden="true" style={{color:C.green}}/>
                <div style={{fontWeight:600,fontSize:16,color:C.text}}>Recall complete</div>
              </div>
              <div style={{fontSize:13,color:C.muted}}>Would you like to book a follow-up appointment?</div>
            </div>
            <div style={{padding:"20px 24px"}}>
              <div style={{border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 16px",marginBottom:16}}>
                <div style={{display:"flex",gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Patient</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.text}}>{pendingRecallAppt.patient}</div>
                  </div>
                  {pendingRecallAppt.doctor&&(
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Doctor</div>
                      <div style={{fontSize:13,fontWeight:600,color:C.text}}>{pendingRecallAppt.doctor}</div>
                    </div>
                  )}
                </div>
                <div style={{marginTop:10}}>
                  <div style={{fontSize:12,color:C.muted,marginBottom:4}}>Recall reason</div>
                  <div style={{fontSize:13,color:C.text}}>{pendingRecallAppt.reason}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <XB onClick={()=>setPendingRecallAppt(null)}>Skip</XB>
                <PB onClick={()=>setShowBookAppt(true)}><Icon as={CalendarPlus}/>Book appointment</PB>
              </div>
            </div>
          </div>
        </div>
      )}
      <PageHeader title="Recalls and follow-up" meta={`${recalls.length} open recall${recalls.length!==1?"s":""}`}
        status={recalls.filter(r=>r.urgency==="high").length>0?<Badge color="red">{recalls.filter(r=>r.urgency==="high").length} overdue</Badge>:null}
        actions={<>
          {checked.size>0&&<XB onClick={()=>{done([...checked]);setChecked(new Set());}}><Icon as={Check}/>Complete {checked.size} selected</XB>}
          <PB onClick={()=>setShowNew(true)}><Icon as={Plus}/>Add recall</PB>
        </>}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,gap:12,flexWrap:"wrap"}}>
        <Segmented size="sm" value={filter} onChange={setFilter} options={[["all","All"],["high","Overdue"],["medium","This week"],["low","Upcoming"]].map(([id,l])=>[id,l,null,id==="all"?recalls.length:recalls.filter(r=>r.urgency===id).length])}/>
        <select value={sortDoc} onChange={e=>setSortDoc(e.target.value)} aria-label="Doctor" style={{...SS,width:"auto",fontSize:13}}>
          {DOCTORS.map(d=><option key={d} value={d}>{d==="all"?"Any doctor":d}</option>)}
        </select>
      </div>
      <Card>
        {filt.length===0?(<div style={{padding:"48px",textAlign:"center"}}><CircleCheck size={28} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted,marginBottom:12}}/><div style={{fontWeight:600,color:C.text}}>All clear</div><div style={{color:C.muted,fontSize:13,marginTop:4}}>No recalls in this category.</div></div>):filt.map((r,i)=>{
          const logs=contactLogs[r.id]||[];
          const isExpanded=expandedLog===r.id;
          return(
            <div key={r.id} style={{borderBottom:i<filt.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:16}}>
                <input type="checkbox" checked={checked.has(r.id)} onChange={()=>toggleCheck(r.id)} aria-label={`Select ${r.patient}`} style={{width:16,height:16,cursor:"pointer",flexShrink:0,accentColor:"var(--c-navymid)"}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:C.text}}>{r.patient}</div>
                  <div style={{fontSize:13,color:C.text2,marginTop:2}}>{r.reason}</div>
                  <div style={{display:"flex",gap:12,marginTop:4,alignItems:"center"}}>
                    <span style={{fontSize:12,color:r.urgency==="high"?C.red:C.muted,fontWeight:r.urgency==="high"?500:400}}>{r.urgency==="high"?"Overdue since ":"Due "}{fmt(r.due)}</span>
                    {r.doctor&&<span style={{fontSize:12,color:C.muted}}>· {r.doctor}</span>}
                    <button onClick={()=>setExpandedLog(isExpanded?null:r.id)} aria-expanded={isExpanded} className="text-link" style={{fontSize:12,display:"inline-flex",alignItems:"center",gap:4}}>{logs.length>0?`${logs.length} contact attempt${logs.length>1?"s":""}`:"Log contact"}<ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" style={{transform:isExpanded?"rotate(180deg)":"none"}}/></button>
                  </div>
                </div>
                <Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"neutral"}>{r.urgency==="high"?"Overdue":r.urgency==="medium"?"This week":"Upcoming"}</Badge>
                <button onClick={()=>completeSingle(r)} className="btn btn-secondary btn-sm"><Icon as={Check} size={14}/>Complete</button>
              </div>
              {isExpanded&&(
                <div style={{background:C.raised,borderTop:`1px solid ${C.border}`,padding:"16px 20px 16px 52px"}}>
                  <div style={{fontSize:13,fontWeight:500,color:C.text,marginBottom:8}}>Contact attempts</div>
                  {logs.length===0&&<div style={{fontSize:13,color:C.muted,marginBottom:10}}>No contact attempts logged yet.</div>}
                  {logs.map(l=>(
                    <div key={l.id} style={{display:"flex",gap:12,marginBottom:8,fontSize:13}}>
                      <div style={{color:C.muted,width:96,flexShrink:0}}>{fmt(l.date)}</div>
                      <div style={{width:72,flexShrink:0}}><Badge color="neutral">{l.method}</Badge></div>
                      <div style={{color:C.text}}>{l.outcome}</div>
                    </div>
                  ))}
                  {addingLog===r.id?(
                    <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
                      <select value={logForm.method} onChange={e=>setLogForm(f=>({...f,method:e.target.value}))} style={{...SS,width:90,padding:"6px 8px",fontSize:12}}>
                        {["Phone","Email","Text","In person"].map(m=><option key={m}>{m}</option>)}
                      </select>
                      <input value={logForm.outcome} onChange={e=>setLogForm(f=>({...f,outcome:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addLog(r.id)} placeholder="Outcome…" style={{...IS,flex:1,fontSize:12,marginBottom:0}} autoFocus/>
                      <PB onClick={()=>addLog(r.id)} disabled={!logForm.outcome.trim()}>Save</PB>
                      <XB onClick={()=>setAddingLog(null)}>Cancel</XB>
                    </div>
                  ):<button onClick={()=>setAddingLog(r.id)} className="btn btn-secondary btn-sm" style={{marginTop:4}}><Icon as={Plus} size={14}/>Log attempt</button>}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

const changedPerms=a=>Object.keys(a.perms||{}).filter(k=>k!=="admin"&&a.perms[k]!==roleDefaults(a.role)[k]).length;

function UsersTab({accounts,user,onAdd,onEdit}){
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

function AccountModal({account,accounts,self,onSave,onClose}){
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

function AdminPage({auditLog,accounts,setAccounts,user,addAudit,showToast,title="Admin panel",tabs=["users","audit log","login history","backup"]}){
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

function SettingsPage({user,settings,setSettings,setPage,blockTimes,setBlockTimes,themePref,setThemePref}){
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

// ─── RefillQueuePage ───────────────────────────────────────────────────────────
function RefillQueuePage({user,patients,rx,setRx,refillRequests,setRefillRequests}){
  const p=permsFor(user);
  const[newReq,setNewReq]=useState({patientId:"",medication:""});
  const[patSearch,setPatSearch]=useState("");
  const[patOpen,setPatOpen]=useState(false);
  const[reviewId,setReviewId]=useState(null);
  const[reviewNote,setReviewNote]=useState("");
  const[loading,setLoading]=useState(true);
  const[submittingRefill,setSubmittingRefill]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),600);return()=>clearTimeout(t);},[]);
  const pending=(refillRequests||[]).filter(r=>r.status==="pending");
  const others=(refillRequests||[]).filter(r=>r.status!=="pending");
  const submit=()=>{
    if(!newReq.patientId||!newReq.medication.trim())return;
    setSubmittingRefill(true);
    setTimeout(()=>{
      const pt=patients.find(x=>x.id===parseInt(newReq.patientId));
      if(!pt){setSubmittingRefill(false);return;}
      setRefillRequests(prev=>[...prev,{id:Date.now(),patientId:pt.id,patient:`${pt.first_name} ${pt.last_name}`,medication:newReq.medication.trim(),requestedBy:user.role,requestedByName:user.name,date:today(),status:"pending",approvedBy:null,note:""}]);
      setNewReq({patientId:"",medication:""});setPatSearch("");
      setSubmittingRefill(false);
    },400);
  };
  const approve=(id)=>{
    setRefillRequests(prev=>prev.map(r=>r.id===id?{...r,status:"approved",approvedBy:user.name,note:reviewNote}:r));
    setReviewId(null);setReviewNote("");
  };
  const deny=(id)=>{
    setRefillRequests(prev=>prev.map(r=>r.id===id?{...r,status:"denied",approvedBy:user.name,note:reviewNote}:r));
    setReviewId(null);setReviewNote("");
  };
  return(
    <div style={{padding:"24px 32px 48px",maxWidth:1440}}>
      <PageHeader title="Refill queue" meta={p.refillApprove?"Requests waiting for your review":"Requests sent to the doctors"}
        status={pending.length>0?<Badge color="amber">{pending.length} pending</Badge>:<Badge color="green">Queue clear</Badge>}/>
      {loading&&<div>{[...Array(4)].map((_,i)=><div key={i} style={{background:C.skeleton,borderRadius:8,height:44,marginBottom:8,animation:"pulse 1.6s ease-in-out infinite"}}/>)}</div>}
      {!loading&&<>
        {!p.refillApprove&&(
          <Card style={{marginBottom:16,padding:"20px"}}>
            <div style={{fontWeight:600,fontSize:15,color:C.text,marginBottom:16}}>New refill request</div>
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <div style={{flex:1,position:"relative"}}><label style={LS}>Patient</label>
                <input
                  value={patSearch}
                  onChange={e=>{setPatSearch(e.target.value);setNewReq(f=>({...f,patientId:""}));setPatOpen(true);}}
                  onFocus={()=>setPatOpen(true)}
                  onBlur={()=>setTimeout(()=>setPatOpen(false),150)}
                  placeholder="Type patient name…"
                  autoComplete="off"
                  style={{...IS,paddingRight:28}}
                />
                {patOpen&&(()=>{
                  const q=patSearch.toLowerCase();
                  const hits=patients.filter(pt=>`${pt.first_name} ${pt.last_name}`.toLowerCase().includes(q));
                  return hits.length>0?(
                    <div role="listbox" style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"var(--shadow-lg)",maxHeight:200,overflowY:"auto",marginTop:4,padding:4}}>
                      {hits.map(pt=>(
                        <div key={pt.id}
                          onMouseDown={()=>{setNewReq(f=>({...f,patientId:String(pt.id)}));setPatSearch(`${pt.first_name} ${pt.last_name}`);setPatOpen(false);}}
                          role="option" className="row-link"
                          style={{padding:"8px 12px",fontSize:13,color:C.text,borderRadius:4}}
                        >{pt.first_name} {pt.last_name}</div>
                      ))}
                    </div>
                  ):null;
                })()}
              </div>
              <div style={{flex:1}}><label style={LS}>Medication</label>
                <input value={newReq.medication} onChange={e=>setNewReq(f=>({...f,medication:e.target.value}))} placeholder="e.g. Lisinopril 10mg" style={IS}/>
              </div>
              <LoadingButton onClick={submit} disabled={!newReq.patientId||!newReq.medication.trim()} loading={submittingRefill}>Submit request</LoadingButton>
            </div>
          </Card>
        )}
        <Card style={{marginBottom:12}}>
          <CardHead title="Pending" meta={`${pending.length} request${pending.length!==1?"s":""}`}/>
          {pending.length===0&&<div style={{padding:"0 20px 20px",color:C.muted,fontSize:13}}>No pending refill requests</div>}
          {pending.map((r,i)=>(
            <div key={r.id} style={{borderTop:`1px solid ${C.border}`}}>
              <div style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:16}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:C.text}}>{r.patient}</div>
                  <div style={{fontSize:13,color:C.text2,marginTop:2}}>{r.medication}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>Requested by {r.requestedByName} · {fmt(r.date)}</div>
                </div>
                <Badge color="amber">Pending</Badge>
                {p.refillApprove&&<button onClick={()=>setReviewId(reviewId===r.id?null:r.id)} aria-expanded={reviewId===r.id} className="btn btn-secondary btn-sm">Review</button>}
              </div>
              {reviewId===r.id&&(
                <div style={{background:C.raised,borderTop:`1px solid ${C.border}`,padding:"16px 20px"}}>
                  <div style={{fontWeight:500,fontSize:13,color:C.text,marginBottom:8}}>Current medications</div>
                  {(rx[r.patientId]||[]).map(med=><div key={med.id} style={{fontSize:13,color:C.text,marginBottom:4}}>{med.med} {med.dose} <span style={{color:C.muted}}>· {med.sig}</span></div>)}
                  {!(rx[r.patientId]||[]).length&&<div style={{fontSize:13,color:C.muted,marginBottom:10}}>No active medications on file.</div>}
                  <div style={{marginTop:12,marginBottom:10}}><label style={LS}>Note to staff (optional)</label><input value={reviewNote} onChange={e=>setReviewNote(e.target.value)} placeholder="Add note…" style={IS}/></div>
                  <div style={{display:"flex",gap:8}}>
                    <PB onClick={()=>approve(r.id)}><Icon as={Check}/>Approve</PB>
                    <XB onClick={()=>deny(r.id)}><Icon as={X}/>Deny</XB>
                    <XB onClick={()=>{setReviewId(null);setReviewNote("");}}>Cancel</XB>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Card>
        {others.length>0&&(
          <Card>
            <CardHead title="Reviewed" meta={`${others.length} request${others.length!==1?"s":""}`}/>
            {others.map((r,i)=>(
              <div key={r.id} style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:16,borderTop:`1px solid ${C.border}`}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:14,color:C.text}}>{r.patient} <span style={{fontWeight:400,color:C.text2}}>· {r.medication}</span></div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>Requested by {r.requestedByName} · {fmt(r.date)}{r.approvedBy?` · reviewed by ${r.approvedBy}`:""}</div>
                  {r.note&&<div style={{fontSize:13,color:C.text2,marginTop:4}}>“{r.note}”</div>}
                </div>
                <Badge color={r.status==="approved"?"green":"red"}>{r.status}</Badge>
              </div>
            ))}
          </Card>
        )}
      </>}
    </div>
  );
}

// ─── GlobalSearch ──────────────────────────────────────────────────────────────
function GlobalSearch({patients,appts,onClose,onSelectPatient,onSelectAppt}){
  const[q,setQ]=useState("");
  const inputRef=useRef(null);
  useEffect(()=>{if(inputRef.current)inputRef.current.focus();},[]);
  const lq=q.toLowerCase();
  const ptResults=q.length>1?patients.filter(p=>`${p.first_name} ${p.last_name}`.toLowerCase().includes(lq)||(p.phone||"").includes(lq)).slice(0,6):[];
  const apptResults=q.length>1?appts.filter(a=>a.patient.toLowerCase().includes(lq)).slice(0,4):[];
  return(
    <div style={{position:"fixed",inset:0,background:C.overlay,zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:80}} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Search" style={{background:C.surface,borderRadius:12,width:"100%",maxWidth:560,boxShadow:"var(--shadow-lg)",border:`1px solid ${C.border}`,overflow:"hidden",animation:"rise 160ms var(--ease)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}>
          <Search size={18} strokeWidth={1.5} aria-hidden="true" style={{color:C.muted}}/>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search patients, appointments…" aria-label="Search" style={{flex:1,border:"none",outline:"none",fontSize:16,color:C.text,background:"transparent",fontFamily:"inherit"}} onKeyDown={e=>e.key==="Escape"&&onClose()}/>
          <button onClick={onClose} aria-label="Close search" className="icon-btn" style={{border:"none",color:C.muted,cursor:"pointer",width:28,height:28,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><X size={16} strokeWidth={1.5}/></button>
        </div>
        <div style={{maxHeight:400,overflow:"auto"}}>
          {q.length<2&&<div style={{padding:"24px",textAlign:"center",color:C.muted,fontSize:13}}>Type to search patients and appointments…</div>}
          {ptResults.length>0&&(
            <div>
              <div style={{padding:"10px 20px 4px",fontSize:12,color:C.muted}}>Patients</div>
              {ptResults.map(pt=>(
                <button key={pt.id} onClick={()=>onSelectPatient(pt)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 20px",border:"none",background:"none",textAlign:"left",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:C.raised,border:`1px solid ${C.border}`,color:C.text2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:500,flexShrink:0}}>{pt.first_name[0]}{pt.last_name[0]}</div>
                  <div><div style={{fontWeight:500,fontSize:14,color:C.text}}>{pt.first_name} {pt.last_name}</div><div style={{fontSize:12,color:C.muted}}>{pt.phone} · {pt.insurance}</div></div>
                  {pt.dnc&&<span style={{marginLeft:"auto"}}><Badge color="red">Do not contact</Badge></span>}
                </button>
              ))}
            </div>
          )}
          {apptResults.length>0&&(
            <div style={{borderTop:ptResults.length>0?`1px solid ${C.border}`:"none"}}>
              <div style={{padding:"10px 20px 4px",fontSize:12,color:C.muted}}>Appointments</div>
              {apptResults.map(a=>(
                <button key={a.id} onClick={()=>onSelectAppt(a)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"12px 20px",border:"none",background:"none",textAlign:"left",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background="var(--c-raised)"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <span style={{width:30,height:30,borderRadius:6,background:C.raised,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:C.text2,flexShrink:0}}><CalendarDays size={16} strokeWidth={1.5} aria-hidden="true"/></span>
                  <div style={{flex:1}}><div style={{fontWeight:500,fontSize:14,color:C.text}}>{a.patient}</div><div style={{fontSize:12,color:C.muted}}>{fmt(a.date)} · {a.time} · {a.doctor}</div></div><SB status={a.status}/>
                </button>
              ))}
            </div>
          )}
          {q.length>=2&&ptResults.length===0&&apptResults.length===0&&(
            <div style={{padding:"24px",textAlign:"center",color:C.muted,fontSize:13}}>No results found for "{q}"</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FollowUpModal ─────────────────────────────────────────────────────────────
function FollowUpModal({patient,doctor,onClose,onBook}){
  const addDays=(n)=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().split("T")[0];};
  return(
    <div style={{position:"fixed",inset:0,background:C.overlay,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1500,padding:20}}>
      <div style={{background:C.surface,borderRadius:12,width:"100%",maxWidth:400,boxShadow:"var(--shadow-lg)",border:`1px solid ${C.border}`}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontWeight:600,fontSize:16,color:C.text}}>Schedule a follow-up?</div>
          <div style={{fontSize:13,color:C.muted,marginTop:4}}>For {patient} with {doctor}</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>When should this patient return?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["In 2 weeks",14],["In 1 month",30],["In 3 months",90]].map(([lbl,days])=>(
              <button key={lbl} onClick={()=>onBook(addDays(days))} className="card-link" style={{padding:"12px 16px",borderRadius:6,border:`1px solid ${C.border2}`,background:C.surface,color:C.text,fontSize:14,fontWeight:500,fontFamily:"inherit",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background=C.blueBg} onMouseLeave={e=>e.currentTarget.style.background="var(--c-raised)"}>
                <span>{lbl}</span><span style={{fontSize:13,color:C.muted}}>{fmt(addDays(days))}</span>
              </button>
            ))}
            <button onClick={onClose} className="text-link" style={{marginTop:8,alignSelf:"center",color:C.text2}}>Skip for now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EndOfDayModal ─────────────────────────────────────────────────────────────
function EndOfDayModal({onClose}){
  const[checks,setChecks]=useState({notes:false,recalls:false,schedule:false});
  const allChecked=Object.values(checks).every(Boolean);
  const toggle=(k)=>setChecks(p=>({...p,[k]:!p[k]}));
  const items=[
    {key:"notes",    label:"All visit notes signed and co-signed"},
    {key:"recalls",  label:"Recall follow-ups reviewed and assigned"},
    {key:"schedule", label:"Tomorrow's schedule confirmed"},
  ];
  return(
    <div style={{position:"fixed",inset:0,background:C.overlay,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1500,padding:20}}>
      <div style={{background:C.surface,borderRadius:12,width:"100%",maxWidth:440,boxShadow:"var(--shadow-lg)",border:`1px solid ${C.border}`}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
          <Moon size={20} strokeWidth={1.5} aria-hidden="true" style={{color:C.text2,marginBottom:8}}/>
          <div style={{fontWeight:600,fontSize:16,color:C.text}}>End-of-day checklist</div>
          <div style={{fontSize:13,color:C.muted,marginTop:4}}>All appointments are complete. Please confirm the following before closing out.</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          {items.map(item=>(
            <label key={item.key} style={{display:"flex",alignItems:"center",gap:16,padding:"12px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
              <input type="checkbox" checked={checks[item.key]} onChange={()=>toggle(item.key)} style={{width:16,height:16,cursor:"pointer",flexShrink:0,accentColor:"var(--c-navymid)"}}/>
              <span style={{fontSize:14,color:checks[item.key]?C.muted:C.text,textDecoration:checks[item.key]?"line-through":"none",transition:"color 160ms var(--ease)"}}>{item.label}</span>
            </label>
          ))}
          <div style={{marginTop:20,display:"flex",justifyContent:"flex-end",gap:10}}>
            <XB onClick={onClose}>Close</XB>
            <PB onClick={onClose} disabled={!allChecked}><Icon as={Check}/>Close the day</PB>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VitalsTrendChart ────────────────────────────────────────────────────────
function VitalsTrendChart({data, field}){
  if(!data||data.length<2)return<div style={{fontSize:12,color:C.muted,textAlign:"center",padding:"20px 0"}}>No data available</div>;
  const vals=data.map(d=>{
    if(field==="systolic"){const s=d.bp?parseInt(d.bp.split("/")[0]):null;return s;}
    if(field==="weight")return d.weight;
    if(field==="glucose")return d.glucose;
    return null;
  }).filter(v=>v!==null&&v!==undefined);
  if(vals.length<2)return<div style={{fontSize:12,color:C.muted,textAlign:"center",padding:"20px 0"}}>No data available</div>;
  const allVals=data.map(d=>{
    if(field==="systolic")return d.bp?parseInt(d.bp.split("/")[0]):null;
    if(field==="weight")return d.weight;
    if(field==="glucose")return d.glucose;
    return null;
  });
  const filtered=allVals.filter(v=>v!==null&&v!==undefined);
  const minV=Math.min(...filtered);const maxV=Math.max(...filtered);
  const range=maxV-minV||1;
  const W=340,H=100,PAD=28;
  const color=C.navyMid;
  const pts=data.map((d,i)=>{
    const v=allVals[i];
    if(v===null||v===undefined)return null;
    const x=PAD+(i/(data.length-1))*(W-PAD*2);
    const y=H-PAD-((v-minV)/range)*(H-PAD*2);
    return{x,y,v,date:d.date};
  }).filter(Boolean);
  const polyline=pts.map(p=>`${p.x},${p.y}`).join(" ");
  const label=field==="systolic"?"Systolic BP (mmHg)":field==="weight"?"Weight (lbs)":"Glucose (mg/dL)";
  return(
    <div>
      <div style={{fontSize:12,color:C.muted,marginBottom:4}}>{label}</div>
      <svg width={W} height={H+20} style={{overflow:"visible"}}>
        <text x={0} y={PAD} fontSize={9} fill={C.muted}>{maxV}</text>
        <text x={0} y={H-PAD+4} fontSize={9} fill={C.muted}>{minV}</text>
        <polyline points={polyline} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round"/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill={color} stroke="var(--c-surface)" strokeWidth={1.5}/>
            <text x={p.x} y={H+14} fontSize={9} fill={C.muted} textAnchor="middle">{p.date.slice(5)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── TasksPage ────────────────────────────────────────────────────────────────
function TasksPage({user, tasks, setTasks}){
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

// ─── AuditLogTab ─────────────────────────────────────────────────────────────
function AuditLogTab({auditLog}){
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

function LoginPage({onLogin,accounts}){
  const demoUsers=DEMO_ORDER.map(u=>accounts.find(a=>a.username===u&&a.demo)).filter(Boolean);
  const[u,su]=useState("");const[p,sp]=useState("");const[err,se]=useState("");const[loading,sl]=useState(false);
  const quick=async(usr)=>{sl(true);await new Promise(r=>setTimeout(r,450));onLogin(usr);};
  const submit=async()=>{sl(true);se("");await new Promise(r=>setTimeout(r,600));const f=accounts.find(x=>x.username===u.trim().toLowerCase()&&x.password===p);if(f&&f.status!=="active"){se("This account is inactive. Ask the office admin to turn it back on.");sl(false);}else if(f)onLogin(f);else{se("Username or password is incorrect");sl(false);}};
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:440}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:32}}>
          <Logo size={40} wordSize={24}/>
          <div style={{color:C.text2,fontSize:14,marginTop:12}}>Sign in to run today's clinic</div>
        </div>

        <div style={{color:C.text2,fontSize:13,fontWeight:500,marginBottom:8}}>Demo accounts</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24}}>
          {demoUsers.map(usr=>(
            <button key={usr.username} onClick={()=>quick(usr)} disabled={loading} className="role-btn" style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:12,cursor:loading?"default":"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:6,background:C.raised,border:`1px solid ${C.border}`,color:C.text,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon as={ROLE_ICON[usr.role]}/></div>
                <div style={{minWidth:0}}>
                  <div style={{color:C.text,fontSize:13,fontWeight:500}}>{ROLE_LABEL[usr.role]}</div>
                  <div style={{color:C.muted,fontSize:12,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{usr.name}</div>
                </div>
              </div>
              <div style={{color:C.muted,fontSize:11,fontFamily:C.mono}}>{usr.username} / {usr.password}</div>
            </button>
          ))}
        </div>

        <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:24}}>
          <div style={{color:C.text,fontSize:15,fontWeight:600,marginBottom:16}}>Sign in</div>
          {err&&<div role="alert" style={{marginBottom:16}}><Alert tone="red" title={err}/></div>}
          <div style={{marginBottom:16}}><label htmlFor="login-user" style={LS}>Username</label><input id="login-user" autoComplete="username" value={u} onChange={e=>su(e.target.value)} style={IS}/></div>
          <div style={{marginBottom:20}}><label htmlFor="login-pass" style={LS}>Password</label><input id="login-pass" type="password" autoComplete="current-password" value={p} onChange={e=>sp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={IS}/></div>
          <button onClick={submit} disabled={loading} aria-busy={loading||undefined} className="btn btn-primary" style={{width:"100%",height:40}}>{loading?"Signing in…":"Sign in"}</button>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const[accounts,setAccounts]=useState(INIT_ACCOUNTS);
  // Load saved accounts after mount (keeps server and client HTML the same), then save every change
  const accountsLoaded=useRef(false);
  useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(ACCOUNTS_KEY));if(Array.isArray(saved)&&saved.length)setAccounts(saved);}catch{}accountsLoaded.current=true;},[]);
  useEffect(()=>{if(accountsLoaded.current)try{localStorage.setItem(ACCOUNTS_KEY,JSON.stringify(accounts));}catch{}},[accounts]);
  const[sessionId,setSessionId]=useState(null);
  // The signed-in account is read live, so permission changes apply straight away
  const user=accounts.find(a=>a.id===sessionId&&a.status==="active")||null;
  const setUser=u=>setSessionId(u?u.id:null);const[page,setPageRaw]=useState("dashboard");
  // "manage" = the Manage clinic area for accounts with admin access on top of their own role
  const[area,setArea]=useState("work");
  const managing=area==="manage"&&isAdminAddOn(user);
  useEffect(()=>{if(area==="manage"&&user&&!isAdminAddOn(user)){setArea("work");setPageRaw("dashboard");}},[area,user]);
  const setPage=id=>{
    if(MANAGE_ONLY.includes(id))setArea("manage");
    else if(!MANAGE_SHARED.includes(id))setArea("work");
    setPageRaw(id);
  };
  const[patients,setPatients]=useState(INIT_PATIENTS);
  const[appts,setAppts]=useState(INIT_APPTS);
  const[recalls,setRecalls]=useState(INIT_RECALLS);
  const[vitals,setVitals]=useState(INIT_VITALS_FULL);
  const[rx,setRx]=useState(INIT_RX);
  const[notes,setNotes]=useState(INIT_NOTES);
  const[draftNotes,setDraftNotes]=useState({});
  const[messages,setMessages]=useState(INIT_MESSAGES);
  const[chatOpen,setChatOpen]=useState(false);
  const[chatContactId,setChatContactId]=useState(null);
  const lastPageRef=useRef("dashboard");
  useEffect(()=>{if(page!=="messages")lastPageRef.current=page;},[page]);
  const[settings,setSettings]=useState(INIT_SETTINGS);
  const[doctorStatus,setDoctorStatus]=useState(INIT_DOCTOR_STATUS);
  const[reminderLogs,setReminderLogs]=useState(INIT_REMINDER_LOGS);
  const[blockTimes,setBlockTimes]=useState(INIT_BLOCK_TIMES);
  const[waitlist,setWaitlist]=useState(INIT_WAITLIST);
  const[refillRequests,setRefillRequests]=useState(INIT_REFILL_REQUESTS);
  const[recentPatients,setRecentPatients]=useState([]);
  const[tasks,setTasks]=useState(INIT_TASKS);
  const[auditLog,setAuditLog]=useState(INIT_AUDIT_LOG);
  const[inventory,setInventory]=useState(INIT_INVENTORY);
  const[staffSchedule,setStaffSchedule]=useState(INIT_STAFF_SCHEDULE);
  // Theme: follows the device by default; Settings can pin it to light or dark.
  const[themePref,setThemePref]=useState(()=>{
    try{
      const saved=localStorage.getItem("clinicTheme");
      if(saved==="light"||saved==="dark"||saved==="system")return saved;
      const legacy=localStorage.getItem("clinicDark");
      if(legacy==="1")return "dark";
    }catch{}
    return "system";
  });
  const[systemDark,setSystemDark]=useState(()=>{try{return window.matchMedia("(prefers-color-scheme: dark)").matches;}catch{return false;}});
  useEffect(()=>{
    let mq;try{mq=window.matchMedia("(prefers-color-scheme: dark)");}catch{return;}
    const onChange=e=>setSystemDark(e.matches);
    mq.addEventListener?.("change",onChange);
    return()=>mq.removeEventListener?.("change",onChange);
  },[]);
  const darkMode=themePref==="dark"||(themePref==="system"&&systemDark);
  useEffect(()=>{
    if(darkMode){document.documentElement.setAttribute("data-dark","");}
    else{document.documentElement.removeAttribute("data-dark");}
  },[darkMode]);
  useEffect(()=>{try{localStorage.setItem("clinicTheme",themePref);localStorage.removeItem("clinicDark");}catch{}},[themePref]);
  const[globalSearchOpen,setGlobalSearchOpen]=useState(false);
  const[openPatientId,setOpenPatientId]=useState(null);
  const[eodShown,setEodShown]=useState(false);
  const[eodModal,setEodModal]=useState(false);
  const[toast,setToast]=useState(null);
  const[pendingFollowUp,setPendingFollowUp]=useState(null);

  const showToast=(msg,color="green")=>{
    setToast({msg,color});
    setTimeout(()=>setToast(null),3000);
  };

  const noShowHandler=(id)=>{
    const a=appts.find(x=>x.id===id);
    if(!a)return;
    setAppts(p=>p.map(x=>x.id===id?{...x,status:"no-show"}:x));
    const dueDate=new Date();dueDate.setDate(dueDate.getDate()+3);
    const dueStr=dueDate.toISOString().split("T")[0];
    setRecalls(p=>[...p,{id:Date.now(),patient:a.patient,reason:"No-show — reschedule appointment",due:dueStr,urgency:"medium",doctor:a.doctor||""}]);
    showToast(`Recall created for ${a.patient}`,"amber");
  };

  const completeHandler=(id)=>{
    const a=appts.find(x=>x.id===id);
    if(!a)return;
    setAppts(p=>p.map(x=>x.id===id?{...x,status:"completed"}:x));
    setPendingFollowUp({patient:a.patient,doctor:a.doctor,date:a.date});
    // EOD check
    const todayStr=today();
    const todayAppts=appts.filter(x=>(x.date||"2026-02-25")===todayStr);
    const allDone=todayAppts.every(x=>x.id===id||x.status==="completed"||x.status==="no-show");
    if(allDone&&!eodShown&&todayAppts.length>0){setEodModal(true);setEodShown(true);}
  };

  const onOpenPatient=(patient)=>{
    setRecentPatients(prev=>{
      const filtered=prev.filter(p=>p.id!==patient.id);
      return [patient,...filtered].slice(0,5);
    });
  };

  const addAudit=(action,subject,section)=>{
    if(!user)return;
    const now=new Date();
    const ts=now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0")+" "+String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0")+":"+String(now.getSeconds()).padStart(2,"0");
    setAuditLog(prev=>[{id:Date.now(),user:user.name,role:user.role,action,subject,section,ts},...prev]);
  };

  useEffect(()=>{
    const handler=(e)=>{
      if(e.key==="/"&&document.activeElement.tagName!=="INPUT"&&document.activeElement.tagName!=="TEXTAREA"){
        e.preventDefault();setGlobalSearchOpen(true);
      }
    };
    document.addEventListener("keydown",handler);
    return()=>document.removeEventListener("keydown",handler);
  },[]);

  if(!user)return<LoginPage accounts={accounts} onLogin={u=>{setUser(u);setArea("work");setPage("dashboard");setRecentPatients([]);}}/>;
  const p=permsFor(user);
  const overdueCount=recalls.filter(r=>r.urgency==="high").length;
  const pendingRefills=refillRequests.filter(r=>r.status==="pending").length;

  const unreadMsgCount = accounts
    .filter(s => s.username !== user.username)
    .reduce((sum, contact) => {
      const key = buildConvoKey(user.username, contact.username);
      const msgs = messages[key] || [];
      return sum + msgs.filter(m => m.from === contact.username && !m.read).length;
    }, 0);

  const pages={
    dashboard:<Dashboard user={user} setPage={setPage} appts={appts} recalls={recalls} refillRequests={refillRequests} inventory={inventory} staffSchedule={staffSchedule} tasks={tasks} patients={patients}/>,
    appointments:p.appointments?<ApptsPage user={user} appts={appts} setAppts={setAppts} patients={patients} settings={settings} reminderLogs={reminderLogs} setReminderLogs={setReminderLogs} waitlist={waitlist} setWaitlist={setWaitlist} blockTimes={blockTimes} recalls={recalls} setRecalls={setRecalls} showToast={showToast} noShowHandler={noShowHandler} completeHandler={completeHandler} pendingFollowUp={pendingFollowUp} setPendingFollowUp={setPendingFollowUp}/>:<Locked/>,
    flow:p.flow?<PatientFlowPage user={user} appts={appts} setAppts={setAppts} doctorStatus={doctorStatus} setDoctorStatus={setDoctorStatus} patients={patients} showToast={showToast} recalls={recalls} setRecalls={setRecalls} noShowHandler={noShowHandler} completeHandler={completeHandler} setPendingFollowUp={setPendingFollowUp} pendingFollowUp={pendingFollowUp}/>:<Locked/>,
    patients:p.patients?<PatientsPage user={user} patients={patients} setPatients={setPatients} vitals={vitals} setVitals={setVitals} rx={rx} setRx={setRx} notes={notes} setNotes={setNotes} draftNotes={draftNotes} setDraftNotes={setDraftNotes} recalls={recalls} setRecalls={setRecalls} appts={appts} setAppts={setAppts} refillRequests={refillRequests} setRefillRequests={setRefillRequests} onOpenPatient={onOpenPatient} openPatientId={openPatientId} setOpenPatientId={setOpenPatientId} setPage={setPage} showToast={showToast} addAudit={addAudit}/>:<Locked/>,
    recalls:p.recalls?<RecallsPage recalls={recalls} setRecalls={setRecalls} patients={patients} appts={appts} setAppts={setAppts} blockTimes={blockTimes}/>:<Locked/>,
    messages:p.messages?<MessagesPage user={user} messages={messages} setMessages={setMessages} contactId={chatContactId} setContactId={setChatContactId} onMinimize={()=>{setPage(lastPageRef.current);setChatOpen(true);}}/>:<Locked msg="Messaging is not available for your role."/>,
    reports:(p.reports||managing)?<ReportsPage appts={appts} recalls={recalls} patients={patients}/>:<Locked msg="Reports are restricted to administrators."/>,
    refills:p.refills?<RefillQueuePage user={user} patients={patients} rx={rx} setRx={setRx} refillRequests={refillRequests} setRefillRequests={setRefillRequests}/>:<Locked msg="Refill queue access is not available for your role."/>,
    tasks:p.tasks?<TasksPage user={user} tasks={tasks} setTasks={setTasks}/>:<Locked msg="Tasks are not available for your role."/>,
    inventory:(p.inventory||managing)?<InventoryPage inventory={inventory} setInventory={setInventory}/>:<Locked msg="Inventory is not available for your role."/>,
    staffschedule:(p.staffSchedule||managing)?<StaffSchedulePage staffSchedule={staffSchedule} setStaffSchedule={setStaffSchedule}/>:<Locked msg="Staff schedule is restricted to administrators."/>,
    admin:(p.admin&&user.role==="admin")?<AdminPage auditLog={auditLog} accounts={accounts} setAccounts={setAccounts} user={user} addAudit={addAudit} showToast={showToast}/>:<Locked msg="Admin panel is restricted to administrators only."/>,
    overview:managing?<Dashboard user={user} view="admin" setPage={setPage} appts={appts} recalls={recalls} refillRequests={refillRequests} inventory={inventory} staffSchedule={staffSchedule} tasks={tasks} patients={patients}/>:<Locked msg="Manage clinic needs admin access."/>,
    accounts:managing?<AdminPage key="accounts" title="Staff and accounts" tabs={["users","login history"]} auditLog={auditLog} accounts={accounts} setAccounts={setAccounts} user={user} addAudit={addAudit} showToast={showToast}/>:<Locked msg="Manage clinic needs admin access."/>,
    audit:managing?<AdminPage key="audit" title="Audit log" tabs={["audit log"]} auditLog={auditLog} accounts={accounts} setAccounts={setAccounts} user={user} addAudit={addAudit} showToast={showToast}/>:<Locked msg="Manage clinic needs admin access."/>,
    backup:managing?<AdminPage key="backup" title="Backup" tabs={["backup"]} auditLog={auditLog} accounts={accounts} setAccounts={setAccounts} user={user} addAudit={addAudit} showToast={showToast}/>:<Locked msg="Manage clinic needs admin access."/>,
    settings:p.settings?<SettingsPage user={user} settings={settings} setSettings={setSettings} setPage={setPage} blockTimes={blockTimes} setBlockTimes={setBlockTimes} themePref={themePref} setThemePref={setThemePref}/>:<Locked msg="Settings are restricted to doctors and admins."/>,
  };
  return(
    <StaffContext.Provider value={accounts}>
    <div style={{display:"flex",height:"100vh",fontFamily:"var(--font-sans), system-ui, sans-serif",overflow:"hidden"}}>
      {globalSearchOpen&&<GlobalSearch patients={patients} appts={appts} onClose={()=>setGlobalSearchOpen(false)} onSelectPatient={(pt)=>{setOpenPatientId(pt.id);setPage("patients");setGlobalSearchOpen(false);onOpenPatient(pt);}} onSelectAppt={()=>{setPage("appointments");setGlobalSearchOpen(false);}}/>}
      {eodModal&&<EndOfDayModal onClose={()=>setEodModal(false)}/>}
      {pendingFollowUp&&<FollowUpModal patient={pendingFollowUp.patient} doctor={pendingFollowUp.doctor} onClose={()=>setPendingFollowUp(null)} onBook={(date)=>{setPendingFollowUp(null);setPage("appointments");}}/>}
      {toast&&<div style={{position:"fixed",bottom:(p.messages&&page!=="messages")?(chatOpen?444:56):24,right:24,zIndex:9999,background:C.navyMid,color:C.onAccent,borderRadius:8,padding:"12px 16px",fontSize:14,fontWeight:500,boxShadow:"var(--shadow-lg)",animation:"rise 220ms var(--ease)",display:"flex",alignItems:"center",gap:10,minWidth:280}}>{toast.color==="green"?<CircleCheck size={18} strokeWidth={2} aria-hidden="true" style={{color:"var(--c-green)"}}/>:<CircleAlert size={18} strokeWidth={2} aria-hidden="true" style={{color:toast.color==="amber"?"var(--c-amber)":"var(--c-red)"}}/>}{toast.msg}</div>}
      {p.messages&&page!=="messages"&&<MessagesDock user={user} messages={messages} setMessages={setMessages} unread={unreadMsgCount} open={chatOpen} setOpen={setChatOpen} contactId={chatContactId} setContactId={setChatContactId} onMaximize={()=>{setChatOpen(false);setPage("messages");}}/>}
      <Sidebar page={page} setPage={setPage} user={user} recallCount={overdueCount} pendingRefills={pendingRefills}
        managing={managing} onManage={()=>{setArea("manage");setPageRaw("overview");}} onBackToWork={()=>{setArea("work");setPageRaw("dashboard");}}
        onLogout={()=>{setArea("work");setUser(null);setChatOpen(false);setChatContactId(null);}}/>
      <main style={{flex:1,minWidth:0,overflow:"hidden",background:C.bg,display:"flex",flexDirection:"column",minHeight:0}}>
        <TopBar page={page} area={managing?"Manage clinic":null} clinicName={settings.clinicName} onSearchClick={()=>setGlobalSearchOpen(true)} canMessage={p.messages} unreadMsgCount={unreadMsgCount} onMessagesClick={()=>{if(page!=="messages")setChatOpen(o=>!o);}}
          recentPatients={recentPatients} onOpenRecent={pt=>{setOpenPatientId(pt.id);setPage("patients");}}
          doctorReady={!!doctorStatus[user.name]} onToggleReady={user.role==="doctor"?()=>setDoctorStatus(prev=>({...prev,[user.name]:!prev[user.name]})):null}/>
        <div style={{flex:1,overflow:(page==="messages"||page==="flow")?"hidden":"auto"}}>
          <div key={page} style={{height:"100%",animation:"rise 220ms var(--ease)",display:(page==="messages"||page==="flow")?"flex":"block",flexDirection:"column",overflow:(page==="messages"||page==="flow")?"hidden":"visible"}}>
            {pages[page]}
          </div>
        </div>
      </main>
    </div>
    </StaffContext.Provider>
  );
}

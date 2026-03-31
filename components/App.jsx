"use client";
import React, { useState, useRef, useEffect } from "react";

const DEMO_USERS = [
  { username:"admin",        password:"Admin1234!",  name:"Sandra Kim",       role:"admin",        title:"Office Administrator" },
  { username:"doctor",       password:"Doctor1234!", name:"Dr. Priya Patel",  role:"doctor",       title:"Physician, MD" },
  { username:"nurse",        password:"Nurse1234!",  name:"James Torres",     role:"nurse",        title:"Registered Nurse" },
  { username:"receptionist", password:"Recept1234!", name:"Brianna Wells",    role:"receptionist", title:"Front Desk" },
];
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
const STAFF_LIST = [
  { id:1, name:"Dr. Priya Patel",   role:"doctor",       status:"active",   lastLogin:"2026-02-25 08:14", username:"doctor" },
  { id:2, name:"Dr. Owen Williams", role:"doctor",       status:"active",   lastLogin:"2026-02-25 07:58", username:"williams" },
  { id:3, name:"James Torres",      role:"nurse",        status:"active",   lastLogin:"2026-02-25 08:02", username:"nurse" },
  { id:4, name:"Brianna Wells",     role:"receptionist", status:"active",   lastLogin:"2026-02-25 07:45", username:"receptionist" },
  { id:5, name:"Sandra Kim",        role:"admin",        status:"active",   lastLogin:"2026-02-25 08:30", username:"admin" },
  { id:6, name:"Marcus Reed",       role:"nurse",        status:"inactive", lastLogin:"2026-02-10 09:30", username:"mreed" },
];

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
  admin:        { appointments:true,  patients:true,  vitals:true,  notes:true,  prescriptions:true,  viewRx:true,  writeRx:true,  viewNotes:true,  writeNotes:true,  recalls:true, admin:true,  settings:true,  messages:true, flow:true, reports:true,  refills:true,  refillApprove:true,  tasks:true, inventory:true,  staffSchedule:true  },
  doctor:       { appointments:true,  patients:true,  vitals:true,  notes:true,  prescriptions:true,  viewRx:true,  writeRx:true,  viewNotes:true,  writeNotes:true,  recalls:true, admin:false, settings:true,  messages:true, flow:true, reports:false, refills:true,  refillApprove:true,  tasks:true, inventory:false, staffSchedule:false },
  nurse:        { appointments:true,  patients:true,  vitals:true,  notes:false, prescriptions:false, viewRx:true,  writeRx:false, viewNotes:true,  writeNotes:false, recalls:true, admin:false, settings:false, messages:true, flow:true, reports:false, refills:true,  refillApprove:false, tasks:true, inventory:true,  staffSchedule:false },
  receptionist: { appointments:true,  patients:true,  vitals:false, notes:false, prescriptions:false, viewRx:false, writeRx:false, viewNotes:false, writeNotes:false, recalls:true, admin:false, settings:false, messages:true, flow:true, reports:false, refills:true,  refillApprove:false, tasks:true, inventory:false, staffSchedule:false },
};
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
};
const RC = { admin:{bg:C.purpleBg,fg:C.purple}, doctor:{bg:C.blueBg,fg:C.blue}, nurse:{bg:C.greenBg,fg:C.green}, receptionist:{bg:C.amberBg,fg:C.amber} };
const RI = { admin:"⚙", doctor:"⚕", nurse:"♥", receptionist:"◉" };

function age(d){return Math.floor((new Date()-new Date(d))/31557600000);}
function fmt(d){return new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}
function today(){return new Date().toISOString().split("T")[0];}
function nowTime(){return new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false});}

const Badge=({color="blue",children})=>{
  const m={green:[C.greenBg,C.green],red:[C.redBg,C.red],amber:[C.amberBg,C.amber],blue:[C.blueBg,C.blue],navy:[C.navyBg,C.navyMid],teal:[C.tealBg,C.teal],purple:[C.purpleBg,C.purple]};
  const[bg,fg]=m[color]||m.blue;
  return <span style={{background:bg,color:fg,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4,letterSpacing:"0.04em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{children}</span>;
};
const SB=({status})=>{const m={"checked-in":["teal","Checked In"],"in-progress":["amber","With Doctor"],"with-nurse":["purple","With Nurse"],scheduled:["blue","Scheduled"],completed:["green","Completed"],"no-show":["red","No Show"]};const[c,l]=m[status]||["blue",status];return <Badge color={c}>{l}</Badge>;};
const TB=({type})=>{const m={routine:"blue","follow-up":"teal",urgent:"red",procedure:"amber","new-patient":"green"};return <Badge color={m[type]||"blue"}>{type.replace(/-/g," ")}</Badge>;};
const Card=({children,style={}})=><div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,...style}}>{children}</div>;
const Locked=({msg})=>(
  <div style={{padding:"28px 32px"}}>
    <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"56px 32px",textAlign:"center",maxWidth:480,margin:"0 auto"}}>
      <div style={{fontSize:40,marginBottom:16}}>🔒</div>
      <div style={{fontWeight:700,fontSize:16,color:C.text,marginBottom:8}}>Access Restricted</div>
      <div style={{color:C.muted,fontSize:14}}>{msg||"Your role doesn't have access to this section."}</div>
    </div>
  </div>
);

function Modal({title,onClose,children,width=560}){
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
      <div style={{background:C.surface,borderRadius:14,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"18px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.surface,zIndex:1}}>
          <div style={{fontWeight:700,fontSize:16,color:C.text}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted,lineHeight:1,padding:4}}>×</button>
        </div>
        <div style={{padding:"24px"}}>{children}</div>
      </div>
    </div>
  );
}

const IS={width:"100%",padding:"9px 12px",borderRadius:7,border:`1px solid ${C.border}`,fontSize:14,color:C.text,outline:"none",background:C.surface,boxSizing:"border-box",fontFamily:"inherit"};
const SS={...IS,appearance:"none",cursor:"pointer"};
const LS={display:"block",fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6};
const FF=({label,children})=><div><label style={LS}>{label}</label>{children}</div>;
const FR=({children,cols=2})=><div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:14,marginBottom:16}}>{children}</div>;
const OK=({msg})=>(<div style={{background:C.greenBg,border:`1px solid ${C.green}`,borderRadius:8,padding:"12px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>✓</span><span style={{color:C.green,fontWeight:600,fontSize:14}}>{msg}</span></div>);
const PB=({onClick,children,disabled})=>(<button onClick={onClick} disabled={disabled} style={{background:disabled?"#9BB5D9":C.navyMid,color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:700,cursor:disabled?"default":"pointer"}}>{children}</button>);
const XB=({onClick,children})=>(<button onClick={onClick} style={{background:C.surface,color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:600,cursor:"pointer"}}>{children}</button>);

// ─── Insurance badge map + component ────────────────────────────────────────
const INSURANCE_BADGES = {
  "BlueCross":    { abbr:"BC",  color:"#1565C0", bg:"#E3F2FD" },
  "Medicare":     { abbr:"MC",  color:"#2E7D32", bg:"#E8F5E9" },
  "Medicaid":     { abbr:"MD",  color:"#6A1B9A", bg:"#F3E5F5" },
  "Aetna":        { abbr:"AET", color:"#B71C1C", bg:"#FFEBEE" },
  "UnitedHealth": { abbr:"UHC", color:"#E65100", bg:"#FFF3E0" },
  "Cigna":        { abbr:"CGN", color:"#00695C", bg:"#E0F2F1" },
  "Humana":       { abbr:"HUM", color:"#1A237E", bg:"#E8EAF6" },
  "Kaiser":       { abbr:"KP",  color:"#4A148C", bg:"#F3E5F5" },
};

function InsuranceBadge({ insurance }) {
  if (!insurance) return <span style={{ fontSize: 12, color: "var(--c-muted)" }}>—</span>;
  const found = Object.entries(INSURANCE_BADGES).find(([key]) =>
    insurance.toLowerCase().includes(key.toLowerCase())
  );
  const abbr = found ? found[1].abbr : insurance.slice(0, 3).toUpperCase();
  const color = found ? found[1].color : "#6B7A8D";
  const bg    = found ? found[1].bg    : "#F0F2F5";
  return (
    <span
      title={insurance}
      style={{
        display: "inline-block",
        background: bg,
        color: color,
        fontWeight: 700,
        fontSize: 11,
        padding: "2px 8px",
        borderRadius: 4,
        letterSpacing: "0.04em",
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
    <div style={{ fontSize: 10, color, fontWeight: 600, marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
      <span>⏱</span><span>{label}</span>
    </div>
  );
}

// ─── Staff avatar helper ────────────────────────────────────────────────────
function StaffAvatar({ name, role, size=32, fontSize=12 }) {
  const initials = name.split(" ").filter(w => !w.startsWith("Dr.")).map(w => w[0]).join("").slice(0,2);
  const rc = RC[role] || { fg: C.navyMid };
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: rc.fg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize, fontWeight: 700, flexShrink: 0,
    }}>{initials}</div>
  );
}

// ─── MESSAGES PAGE ──────────────────────────────────────────────────────────
function MessagesPage({ user, messages, setMessages }) {
  // Build contact list: all staff except the current user
  const contacts = STAFF_LIST.filter(s => s.username !== user.username);
  const [activeContact, setActiveContact] = useState(contacts[0] || null);
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
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
      {/* ── Contact list ── */}
      <div style={{
        width: 280, flexShrink: 0, borderRight: `1px solid ${C.border}`,
        background: C.surface, display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 18px 14px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Messages</div>
            {totalUnread > 0 && (
              <span style={{
                background: C.navyMid, color: "#fff", fontSize: 11, fontWeight: 700,
                padding: "1px 7px", borderRadius: 10,
              }}>{totalUnread}</span>
            )}
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search staff…"
            style={{
              width: "100%", padding: "7px 12px", borderRadius: 7, border: `1px solid ${C.border}`,
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
                  padding: "12px 18px", border: "none", cursor: "pointer", textAlign: "left",
                  background: isActive ? C.bg : "transparent",
                  borderLeft: isActive ? `3px solid ${C.navyMid}` : "3px solid transparent",
                  transition: "background 0.15s",
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
                      background: C.green, border: "2px solid #fff",
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <div style={{ fontWeight: unread > 0 ? 700 : 600, fontSize: 13, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 }}>
                      {contact.name}
                    </div>
                    {lastMsg && (
                      <div style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 4 }}>{lastMsg.ts}</div>
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
                        background: C.navyMid, color: "#fff", fontSize: 10, fontWeight: 700,
                        padding: "1px 6px", borderRadius: 10, flexShrink: 0, marginLeft: 4,
                      }}>{unread}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Conversation panel ── */}
      {activeContact ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: C.bg }}>
          {/* Convo header */}
          <div style={{
            padding: "14px 24px", background: C.surface, borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: 14, flexShrink: 0,
          }}>
            <div style={{ position: "relative" }}>
              <StaffAvatar name={activeContact.name} role={activeContact.role} size={40} fontSize={14} />
              {activeContact.status === "active" && (
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 11, height: 11, borderRadius: "50%",
                  background: C.green, border: "2px solid #fff",
                }} />
              )}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{activeContact.name}</div>
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
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
            {convo.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: C.muted }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>💬</div>
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
                        <div style={{ maxWidth: "65%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", gap: 3 }}>
                          {!isMine && sender && (
                            <div style={{ fontSize: 11, color: C.muted, marginLeft: 2, fontWeight: 600 }}>
                              {sender.name.split(" ")[0]}
                            </div>
                          )}
                          <div style={{
                            padding: "9px 14px",
                            borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: isMine ? C.navyMid : C.surface,
                            color: isMine ? "#fff" : C.text,
                            fontSize: 13, lineHeight: 1.5,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                            border: isMine ? "none" : `1px solid ${C.border}`,
                            wordBreak: "break-word",
                          }}>
                            {msg.text}
                          </div>
                          <div style={{ fontSize: 10, color: C.muted, paddingLeft: 2, paddingRight: 2 }}>{msg.ts}</div>
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
            padding: "14px 24px", background: C.surface, borderTop: `1px solid ${C.border}`,
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
                flex: 1, padding: "10px 14px", borderRadius: 22,
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
                color: "#fff", fontSize: 16, cursor: draft.trim() ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "background 0.15s",
              }}
            >↑</button>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, color: C.muted, flexDirection: "column", gap: 8 }}>
          <div style={{ fontSize: 40 }}>💬</div>
          <div style={{ fontWeight: 600 }}>Select a conversation</div>
        </div>
      )}
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
    const pt=patients.find(p=>p.id===parseInt(f.pid));
    if(recurring){
      const dates=getRecurDates();
      dates.forEach((d,i)=>{
        onSave({id:Date.now()+i,patient:`${pt.first_name} ${pt.last_name}`,type:f.type,time:f.time,duration:parseInt(f.dur),doctor:f.doc,status:"scheduled",date:d});
      });
    } else {
      onSave({id:Date.now(),patient:`${pt.first_name} ${pt.last_name}`,type:f.type,time:f.time,duration:parseInt(f.dur),doctor:f.doc,status:"scheduled",date:f.date});
    }
    sok(true);setTimeout(onClose,1400);
  };
  return(
    <Modal title="New Appointment" onClose={handleClose}>
      {ok&&<OK msg={recurring?`${previewDates.length} recurring appointments scheduled!`:"Appointment scheduled!"}/>}
      <FR cols={1}><FF label="Patient *"><select value={f.pid} onChange={e=>s("pid",e.target.value)} style={SS}><option value="">Select a patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}</select></FF></FR>
      {doubleBook&&<div style={{background:C.amberBg,border:`1px solid ${C.amber}`,borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:12,color:C.amber}}><strong>Note:</strong> {doubleBook.patient} already has an appointment at {doubleBook.time} with {doubleBook.doctor} on this date.</div>}
      <FR><FF label="Date"><input type="date" value={f.date} onChange={e=>s("date",e.target.value)} style={IS}/></FF><FF label="Time"><input type="time" value={f.time} onChange={e=>s("time",e.target.value)} style={IS}/></FF></FR>
      <div style={{marginBottom:14}}>
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
          <div style={{marginTop:10,background:C.blueBg,border:`1px solid ${C.border}`,borderRadius:7,padding:"10px 14px",fontSize:12}}>
            <div style={{fontWeight:700,color:C.navyMid,marginBottom:6}}>{previewDates.length} appointments will be created on:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{previewDates.map((d,i)=><span key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 8px",color:C.text}}>{d}</span>)}</div>
          </div>
        )}
      </div>
      <FR>
        <FF label="Doctor"><select value={f.doc} onChange={e=>s("doc",e.target.value)} style={SS}><option>Dr. Patel</option><option>Dr. Williams</option></select></FF>
        <FF label="Duration"><select value={f.dur} onChange={e=>s("dur",e.target.value)} style={SS}><option value="15">15 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option></select></FF>
      </FR>
      {blockedSlot&&<div style={{background:C.amberBg,border:`1px solid ${C.amber}`,borderRadius:8,padding:"10px 14px",marginBottom:12,fontSize:12,color:C.amber}}>⚠ <strong>{blockedSlot.reason}</strong> block for {blockedSlot.doctor} {blockedSlot.from}–{blockedSlot.to}. You can still book.</div>}
      <FR cols={1}><FF label="Appointment Type"><select value={f.type} onChange={e=>s("type",e.target.value)} style={SS}><option value="routine">Routine</option><option value="follow-up">Follow-up</option><option value="urgent">Urgent</option><option value="new-patient">New Patient</option><option value="procedure">Procedure</option></select></FF></FR>
      <FR cols={1}><FF label="Notes (optional)"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={3} placeholder="Reason for visit or special instructions…" style={{...IS,resize:"vertical"}}/></FF></FR>
      {conflict&&!forceOk&&(
        <div style={{background:C.amberBg,border:`1px solid ${C.amber}`,borderRadius:8,padding:"12px 16px",marginBottom:14}}>
          <div style={{fontWeight:700,fontSize:13,color:C.amber,marginBottom:4}}>⚠ Scheduling Conflict</div>
          <div style={{fontSize:13,color:C.text,marginBottom:10}}>{f.doc} already has <strong>{conflict.patient}</strong> at {conflict.time} on this date.</div>
          <button onClick={()=>setForceOk(true)} style={{fontSize:12,fontWeight:700,color:C.amber,background:"none",border:`1px solid ${C.amber}`,borderRadius:6,padding:"5px 12px",cursor:"pointer"}}>Book Anyway</button>
        </div>
      )}
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><PB onClick={sub} disabled={!f.pid||ok}>Schedule Appointment</PB></div>
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
      {ok&&<OK msg="Patient registered successfully!"/>}
      {/* ── Document upload zone ── */}
      {!scanDone&&!scanning&&(
        <div
          onClick={()=>fileRef.current?.click()}
          onDragOver={e=>{e.preventDefault();setDragOver(true);}}
          onDragLeave={()=>setDragOver(false)}
          onDrop={onDrop}
          style={{border:`2px dashed ${dragOver?C.navyMid:C.border}`,borderRadius:10,padding:"18px 20px",marginBottom:20,textAlign:"center",cursor:"pointer",background:dragOver?C.blueBg:"transparent",transition:"all 0.15s"}}>
          <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.tiff" style={{display:"none"}} onChange={onFile}/>
          <div style={{fontSize:24,marginBottom:6}}>📄</div>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:3}}>Upload a scanned document to auto-fill</div>
          <div style={{fontSize:12,color:C.muted}}>Intake form, insurance card, referral letter — drag & drop or click to browse</div>
          <div style={{marginTop:10,display:"inline-block",background:C.navyMid,color:"#fff",borderRadius:6,padding:"6px 16px",fontSize:12,fontWeight:700}}>Choose File</div>
        </div>
      )}
      {scanning&&(
        <div style={{border:`1px solid ${C.border}`,borderRadius:10,padding:"20px",marginBottom:20,textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:10,animation:"pulse 0.8s ease infinite"}}>🔍</div>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:6}}>Scanning document…</div>
          <div style={{fontSize:12,color:C.navyMid,marginBottom:12}}>{SCAN_STEPS[scanStep]}</div>
          <div style={{background:C.border,borderRadius:4,height:6,overflow:"hidden"}}>
            <div style={{height:"100%",background:C.navyMid,borderRadius:4,transition:"width 0.5s",width:`${((scanStep+1)/SCAN_STEPS.length)*100}%`}}/>
          </div>
        </div>
      )}
      {scanDone&&(
        <div style={{background:C.greenBg,border:`1px solid ${C.green}`,borderRadius:8,padding:"10px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>✓</span>
          <div><span style={{color:C.green,fontWeight:700,fontSize:13}}>Document scanned — 12 fields extracted.</span><span style={{color:C.muted,fontSize:12}}> Review and edit below before registering.</span></div>
          <button onClick={()=>{setScanDone(false);sf({fn:"",ln:"",dob:"",gender:"",phone:"",email:"",address:"",ins:"",ins_id:"",ec_name:"",ec_phone:"",allergies:""});}} style={{marginLeft:"auto",fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer"}}>✕ Clear</button>
        </div>
      )}
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>Personal Information</div>
      <FR><FF label="First Name *"><input value={f.fn} onChange={e=>s("fn",e.target.value)} style={IS} placeholder="Jane"/></FF><FF label="Last Name *"><input value={f.ln} onChange={e=>s("ln",e.target.value)} style={IS} placeholder="Doe"/></FF></FR>
      <FR><FF label="Date of Birth *"><input type="date" value={f.dob} onChange={e=>s("dob",e.target.value)} style={IS}/></FF><FF label="Gender"><select value={f.gender} onChange={e=>s("gender",e.target.value)} style={SS}><option value="">Select…</option><option value="M">Male</option><option value="F">Female</option><option value="O">Other</option></select></FF></FR>
      <FR><FF label="Phone"><input value={f.phone} onChange={e=>s("phone",e.target.value)} style={IS} placeholder="555-0100"/></FF><FF label="Email"><input type="email" value={f.email} onChange={e=>s("email",e.target.value)} style={IS} placeholder="jane@email.com"/></FF></FR>
      <FR cols={1}><FF label="Address"><input value={f.address} onChange={e=>s("address",e.target.value)} style={IS} placeholder="123 Main St, City, ST 00000"/></FF></FR>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",margin:"20px 0 12px"}}>Insurance</div>
      <FR><FF label="Insurance Provider"><input value={f.ins} onChange={e=>s("ins",e.target.value)} style={IS} placeholder="BlueCross, Medicare…"/></FF><FF label="Member ID"><input value={f.ins_id} onChange={e=>s("ins_id",e.target.value)} style={IS}/></FF></FR>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",margin:"20px 0 12px"}}>Emergency Contact</div>
      <FR><FF label="Name"><input value={f.ec_name} onChange={e=>s("ec_name",e.target.value)} style={IS}/></FF><FF label="Phone"><input value={f.ec_phone} onChange={e=>s("ec_phone",e.target.value)} style={IS}/></FF></FR>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",margin:"20px 0 12px"}}>Clinical</div>
      <FR cols={1}><FF label="Known Allergies (comma-separated)"><input value={f.allergies} onChange={e=>s("allergies",e.target.value)} style={IS} placeholder="Penicillin, Sulfa, Latex…"/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><PB onClick={sub} disabled={!f.fn||!f.ln||!f.dob||ok}>Register Patient</PB></div>
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
      {ok&&<OK msg="Vitals recorded!"/>}
      {patient.allergies.length>0&&<div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:8,padding:"10px 14px",marginBottom:16,display:"flex",gap:10,alignItems:"center"}}><span>⚠</span><span style={{color:C.red,fontSize:13,fontWeight:600}}>Allergies: {patient.allergies.join(", ")}</span></div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:16}}>
        <div><label style={LS}>Systolic</label><input value={f.sys} onChange={e=>s("sys",e.target.value)} style={IS} placeholder="120" type="number"/></div>
        <div><label style={LS}>Diastolic</label><input value={f.dia} onChange={e=>s("dia",e.target.value)} style={IS} placeholder="80" type="number"/></div>
        <div><label style={LS}>Heart Rate</label><input value={f.hr} onChange={e=>s("hr",e.target.value)} style={IS} placeholder="72" type="number"/></div>
      </div>
      <FR><FF label="Temperature °F"><input value={f.temp} onChange={e=>s("temp",e.target.value)} style={IS} placeholder="98.6" type="number" step="0.1"/></FF><FF label="O₂ Sat %"><input value={f.o2} onChange={e=>s("o2",e.target.value)} style={IS} placeholder="98" type="number"/></FF></FR>
      <FR><FF label="Weight (lbs)"><input value={f.wt} onChange={e=>s("wt",e.target.value)} style={IS} placeholder="160" type="number"/></FF><FF label="Height (inches)"><input value={f.ht} onChange={e=>s("ht",e.target.value)} style={IS} placeholder="65" type="number"/></FF></FR>
      {bmi&&<div style={{background:C.bg,borderRadius:8,padding:"12px 16px",marginBottom:16,display:"flex",gap:20,alignItems:"center"}}><div><div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>BMI</div><div style={{fontSize:24,fontWeight:800,color:parseFloat(bmi)>30?C.red:parseFloat(bmi)>25?C.amber:C.green}}>{bmi}</div></div><div style={{fontSize:12,color:C.muted}}>{parseFloat(bmi)<18.5?"Underweight":parseFloat(bmi)<25?"Normal weight":parseFloat(bmi)<30?"Overweight":"Obese"}</div></div>}
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.sys||!f.dia||!f.hr||ok}>Save Vitals</PB></div>
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
      {ok&&<OK msg="Prescription saved!"/>}
      {patAllergies.length>0&&(
        <div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:8,padding:"10px 14px",marginBottom:16}}>
          <div style={{color:C.red,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Known Allergies</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {patAllergies.map(a=><span key={a} style={{background:C.red,color:"#fff",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:4}}>{a}</span>)}
          </div>
        </div>
      )}
      <FR cols={1}><FF label="Medication Name *"><input value={f.med} onChange={e=>s("med",e.target.value)} style={IS} placeholder="Start typing or pick below…" list="dl"/><datalist id="dl">{drugs.map(d=><option key={d} value={d}/>)}</datalist></FF></FR>
      {allergyAlert&&allergyAlert.type==="direct"&&(
        <div style={{background:C.redBg,border:`1px solid ${C.red}`,borderRadius:8,padding:"12px 16px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:18}}>🚫</span>
          <span style={{color:C.red,fontSize:13,fontWeight:700}}>ALLERGY ALERT: Patient is allergic to {allergyAlert.allergen}. Do not prescribe without documented override.</span>
        </div>
      )}
      {allergyAlert&&allergyAlert.type==="cross"&&(
        <div style={{background:C.amberBg,border:`1px solid ${C.amber}`,borderRadius:8,padding:"12px 16px",marginBottom:10,display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:18}}>⚠</span>
          <span style={{color:C.amber,fontSize:13,fontWeight:700}}>Cross-Reactivity Warning: Patient has {allergyAlert.allergen} allergy — {allergyAlert.med} may cause a reaction.</span>
        </div>
      )}
      {interactions.length>0&&interactions.map((di,i)=>(
        <div key={i} style={{background:di.severity==="high"?C.redBg:C.amberBg,border:`1px solid ${di.severity==="high"?C.red:C.amber}`,borderRadius:7,padding:"9px 14px",marginBottom:8,display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:16}}>⚠</span>
          <span style={{color:di.severity==="high"?C.red:C.amber,fontSize:13,fontWeight:600}}>{di.severity==="high"?"High Risk":"Caution"}: {di.effect} ({di.drugs.join(" + ")})</span>
        </div>
      ))}
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{drugs.slice(0,6).map(d=><button key={d} onClick={()=>s("med",d)} style={{fontSize:11,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:f.med===d?C.blueBg:C.bg,color:f.med===d?C.blue:C.muted,cursor:"pointer",fontWeight:600}}>{d}</button>)}</div>
      <FR><FF label="Dose *"><input value={f.dose} onChange={e=>s("dose",e.target.value)} style={IS} placeholder="500mg"/></FF><FF label="Quantity"><input value={f.qty} onChange={e=>s("qty",e.target.value)} style={IS} placeholder="30 tablets"/></FF></FR>
      <FR cols={1}><FF label="Instructions (sig)"><input value={f.sig} onChange={e=>s("sig",e.target.value)} style={IS} placeholder="Take once daily with food…"/></FF></FR>
      {daysSupply!==null&&<div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 14px",marginBottom:14,fontSize:12,color:C.muted}}>≈ <strong>{daysSupply} days supply</strong></div>}
      <FR cols={1}><FF label="Refills"><select value={f.refills} onChange={e=>s("refills",e.target.value)} style={SS}>{[0,1,2,3,5,11].map(n=><option key={n} value={n}>{n} refill{n!==1?"s":""}</option>)}</select></FF></FR>
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}} placeholder="Additional instructions…"/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={handleClose}>Cancel</XB><PB onClick={sub} disabled={!f.med||!f.dose||ok||!!(allergyAlert&&allergyAlert.type==="direct")}>Save Prescription</PB></div>
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
    const doctorName=user?.name||"Dr. Patel";
    const noteObj={id:Date.now(),date:today(),doctor:doctorName,chief:f.chief,assessment:f.assess,plan:f.plan,signed:f.sign};
    if(medsConfirmed)noteObj.medsReconciled={by:doctorName,at:medsTs};
    onSave(patient.id,noteObj);
    if(setDraftNotes)setDraftNotes(p=>{const n={...p};delete n[patient.id];return n;});
    sok(true);setTimeout(onClose,1500);
  };
  const soap=[
    {key:"subj",label:"S — Subjective",hint:"What the patient tells you",ph:"Patient's description of symptoms, history…"},
    {key:"obj", label:"O — Objective", hint:"What you observe/measure",    ph:"Exam findings, vitals, lab results…"},
    {key:"assess",label:"A — Assessment *",hint:"Clinical interpretation",  ph:"Diagnosis or differential diagnoses…"},
    {key:"plan",label:"P — Plan",         hint:"What happens next",         ph:"Treatment, referrals, follow-up…"},
  ];
  return(
    <Modal title={`Visit Note — ${patient.first_name} ${patient.last_name}`} onClose={handleClose} width={680}>
      {ok&&<OK msg={f.sign?"Note signed and locked!":"Note saved as draft!"}/>}
      {!medsConfirmed?(
        <div style={{background:C.amberBg,border:`1px solid ${C.amber}`,borderRadius:8,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:16}}>💊</span>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:C.amber}}>Please confirm patient medications are up to date before proceeding</div></div>
          <button onClick={confirmMeds} style={{fontSize:12,fontWeight:700,color:C.amber,background:"none",border:`1px solid ${C.amber}`,borderRadius:6,padding:"6px 14px",cursor:"pointer",whiteSpace:"nowrap"}}>Medications Confirmed ✓</button>
        </div>
      ):(
        <div style={{fontSize:12,color:C.muted,marginBottom:12}}>✓ Meds reconciled at {medsTs} by {user?.name||"Doctor"}</div>
      )}
      {draft.chief&&<div style={{background:C.blueBg,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 12px",marginBottom:12,fontSize:12,color:C.navyMid}}>📝 Draft restored from previous session</div>}
      <FR cols={1}><FF label="Chief Complaint *"><input value={f.chief} onChange={e=>s("chief",e.target.value)} style={IS} placeholder="e.g. Follow-up for hypertension, chest pain x 2 days…"/></FF></FR>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:16}}>
        {soap.map(sec=>(
          <div key={sec.key}>
            <div style={{marginBottom:6}}>
              <label style={{...LS,display:"inline"}}>{sec.label}</label>
              <span style={{fontSize:11,color:C.muted,marginLeft:8,fontStyle:"italic",textTransform:"none",letterSpacing:"normal"}}>{sec.hint}</span>
            </div>
            <textarea value={f[sec.key]} onChange={e=>s(sec.key,e.target.value)} rows={4} placeholder={sec.ph} style={{...IS,resize:"vertical",fontSize:13}}/>
          </div>
        ))}
      </div>
      <div style={{background:f.sign?C.amberBg:C.bg,border:`1px solid ${f.sign?"#F5C07A":C.border}`,borderRadius:8,padding:"14px 16px",marginBottom:20}}>
        <label style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
          <input type="checkbox" checked={f.sign} onChange={e=>s("sign",e.target.checked)} style={{width:16,height:16,cursor:"pointer"}}/>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:f.sign?C.amber:C.text}}>Sign &amp; Lock Note</div>
            <div style={{fontSize:12,color:C.muted,marginTop:2}}>Once signed, this note cannot be edited.</div>
          </div>
        </label>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}>
        <XB onClick={handleClose}>Cancel</XB>
        <button onClick={sub} disabled={!f.chief||!f.assess||ok}
          style={{background:f.sign?(ok?"#9BB5D9":C.amber):(ok?"#9BB5D9":C.navyMid),color:"#fff",border:"none",borderRadius:8,padding:"10px 22px",fontSize:14,fontWeight:700,cursor:"pointer"}}>
          {f.sign?"Sign &amp; Lock":"Save Draft"}
        </button>
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
      {ok&&<OK msg="Recall flag added!"/>}
      <FR cols={1}><FF label="Patient *"><select value={f.pid} onChange={e=>s("pid",e.target.value)} style={SS}><option value="">Select a patient…</option>{patients.map(p=><option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}</select></FF></FR>
      <FR cols={1}><FF label="Reason *"><input value={f.reason} onChange={e=>s("reason",e.target.value)} style={IS} placeholder="e.g. Annual physical…" list="rl"/><datalist id="rl">{reasons.map(r=><option key={r} value={r}/>)}</datalist></FF></FR>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>{reasons.slice(0,5).map(r=><button key={r} onClick={()=>s("reason",r)} style={{fontSize:11,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:f.reason===r?C.blueBg:C.bg,color:f.reason===r?C.blue:C.muted,cursor:"pointer",fontWeight:600}}>{r}</button>)}</div>
      <FR><FF label="Due Date *"><input type="date" value={f.due} onChange={e=>s("due",e.target.value)} style={IS}/></FF><FF label="Urgency"><select value={f.urgency} onChange={e=>s("urgency",e.target.value)} style={SS}><option value="low">Low — Upcoming</option><option value="medium">Medium — This week</option><option value="high">High — Overdue/Urgent</option></select></FF></FR>
      <FR cols={1}><FF label="Notes"><textarea value={f.notes} onChange={e=>s("notes",e.target.value)} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={onClose}>Cancel</XB><PB onClick={sub} disabled={!f.pid||!f.reason||!f.due||ok}>Add Recall</PB></div>
    </Modal>
  );
}

function Sidebar({page,setPage,user,recallCount,unreadMsgCount,pendingRefills,collapsed,setCollapsed}){
  const p=PERMS[user.role];const rc=RC[user.role];
  const nav=[
    {id:"dashboard",  icon:"▦", label:"Dashboard",    show:true},
    {id:"appointments",icon:"◷",label:"Appointments", show:p.appointments},
    {id:"flow",       icon:"⊞", label:"Patient Flow", show:p.flow},
    {id:"patients",   icon:"◉", label:"Patients",     show:p.patients},
    {id:"recalls",    icon:"◎", label:"Recalls",      show:p.recalls,   badge:recallCount},
    {id:"refills",    icon:"♻", label:"Refill Queue", show:p.refills,   badge:p.refillApprove?pendingRefills:0},
    {id:"reports",    icon:"▣", label:"Reports",      show:p.reports},
    {id:"tasks",         icon:"✓", label:"Tasks",          show:p.tasks},
    {id:"inventory",     icon:"📦",label:"Inventory",      show:p.inventory},
    {id:"staffschedule", icon:"📅",label:"Staff Schedule",  show:p.staffSchedule},
    {id:"admin",         icon:"⚙", label:"Admin Panel",    show:p.admin},
  ].filter(n=>n.show);
  const W=collapsed?56:220;
  return(
    <div style={{width:W,background:C.navy,display:"flex",flexDirection:"column",height:"100%",flexShrink:0,transition:"width 0.2s"}}>
      <div style={{padding:collapsed?"16px 12px":"20px 18px 16px",borderBottom:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",gap:10,overflow:"hidden"}}>
        <div style={{width:32,height:32,background:C.blueBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:C.navyMid,fontWeight:900,fontSize:17,flexShrink:0}}>✚</div>
        {!collapsed&&<div><div style={{color:"#fff",fontWeight:700,fontSize:13}}>Clinic Manager</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>v1.0</div></div>}
      </div>
      {!collapsed&&<div style={{padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{background:rc.bg,borderRadius:6,padding:"5px 10px",display:"inline-flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:12}}>{RI[user.role]}</span>
          <span style={{color:rc.fg,fontSize:11,fontWeight:700,textTransform:"capitalize"}}>{user.role}</span>
        </div>
      </div>}
      <nav style={{flex:1,padding:"10px"}}>
        {nav.map(n=>{const a=page===n.id;return(
          <button key={n.id} onClick={()=>setPage(n.id)} title={collapsed?n.label:undefined}
            style={{display:"flex",alignItems:"center",gap:collapsed?0:10,width:"100%",padding:collapsed?"9px 0":"9px 12px",justifyContent:collapsed?"center":"flex-start",borderRadius:7,border:"none",cursor:"pointer",marginBottom:2,background:a?"rgba(255,255,255,0.12)":"transparent",color:a?"#fff":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:a?600:400,textAlign:"left",position:"relative"}}>
            <span style={{fontSize:14,flexShrink:0}}>{n.icon}</span>
            {!collapsed&&<span style={{flex:1}}>{n.label}</span>}
            {n.badge>0&&<span style={{background:n.id==="messages"?C.teal:n.id==="refills"?C.green:C.red,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:10,position:collapsed?"absolute":"static",top:collapsed?4:undefined,right:collapsed?4:undefined}}>{n.badge}</span>}
          </button>
        );})}
      </nav>
      <div style={{borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        {p.messages&&<div style={{padding:"2px 10px"}}>
          <button onClick={()=>setPage("messages")} title={collapsed?"Messages":undefined}
            style={{display:"flex",alignItems:"center",gap:collapsed?0:10,width:"100%",padding:collapsed?"9px 0":"9px 12px",justifyContent:collapsed?"center":"flex-start",borderRadius:7,border:"none",cursor:"pointer",marginBottom:2,background:page==="messages"?"rgba(255,255,255,0.12)":"transparent",color:page==="messages"?"#fff":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:page==="messages"?600:400,textAlign:"left",position:"relative"}}>
            <span style={{fontSize:14,flexShrink:0}}>✉</span>
            {!collapsed&&<span style={{flex:1}}>Messages</span>}
            {unreadMsgCount>0&&<span style={{background:C.teal,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:10,position:collapsed?"absolute":"static",top:collapsed?4:undefined,right:collapsed?4:undefined}}>{unreadMsgCount}</span>}
          </button>
        </div>}
        {p.settings&&<div style={{padding:"2px 10px 6px"}}>
          <button onClick={()=>setPage("settings")} title={collapsed?"Settings":undefined}
            style={{display:"flex",alignItems:"center",gap:collapsed?0:10,width:"100%",padding:collapsed?"9px 0":"9px 12px",justifyContent:collapsed?"center":"flex-start",borderRadius:7,border:"none",cursor:"pointer",background:page==="settings"?"rgba(255,255,255,0.12)":"transparent",color:page==="settings"?"#fff":"rgba(255,255,255,0.55)",fontSize:13,fontWeight:page==="settings"?600:400,textAlign:"left"}}>
            <span style={{fontSize:14,flexShrink:0}}>⚙</span>
            {!collapsed&&<span style={{flex:1}}>Settings</span>}
          </button>
        </div>}
        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:collapsed?"8px 10px":"8px 14px",display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between"}}>
          {!collapsed&&<div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:rc.fg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:11,flexShrink:0}}>
              {user.name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2)}
            </div>
            <div style={{minWidth:0}}>
              <div style={{color:"#fff",fontSize:11,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name}</div>
              <div style={{color:"rgba(255,255,255,0.4)",fontSize:10,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.title}</div>
            </div>
          </div>}
          <button onClick={()=>setCollapsed(v=>!v)} title={collapsed?"Expand sidebar":"Collapse sidebar"}
            style={{background:"rgba(255,255,255,0.08)",border:"none",color:"rgba(255,255,255,0.5)",borderRadius:6,padding:"5px 9px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>
            {collapsed?">":"<"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FlowWidget({appts,setPage}){
  const TODAY="2026-02-25";
  const todayAppts=appts.filter(a=>(a.date||TODAY)===TODAY);
  const COLS=[{id:"scheduled",label:"Scheduled",color:C.blue,bg:C.blueBg},{id:"checked-in",label:"Checked In",color:C.teal,bg:C.tealBg},{id:"in-progress",label:"With Provider",color:C.amber,bg:C.amberBg},{id:"completed",label:"Done",color:C.green,bg:C.greenBg}];
  return(
    <Card style={{marginBottom:16}}>
      <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Patient Flow — Today</div><button onClick={()=>setPage("flow")} style={{color:C.navyMid,fontSize:12,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>Full board →</button></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",padding:"16px 20px",gap:12}}>
        {COLS.map(col=>{
          const cnt=todayAppts.filter(a=>a.status===col.id).length;
          return(
            <div key={col.id} style={{background:col.bg,borderRadius:8,padding:"12px",border:`1px solid ${C.border}`,textAlign:"center"}}>
              <div style={{fontSize:28,fontWeight:800,color:col.color,lineHeight:1}}>{cnt}</div>
              <div style={{fontSize:11,color:col.color,fontWeight:600,marginTop:4}}>{col.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function UpcomingWidget({appts}){
  const NEXT="2026-02-26";
  const nextDayAppts=appts.filter(a=>(a.date||"2026-02-25")===NEXT).slice(0,3);
  if(!nextDayAppts.length)return null;
  return(
    <Card>
      <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Tomorrow's First Appointments</div>
      {nextDayAppts.map((a,i,arr)=>(
        <div key={a.id} style={{padding:"11px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{width:42,color:C.muted,fontSize:12,fontWeight:700,flexShrink:0}}>{a.time}</div>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:11,color:C.muted}}>{a.doctor} · {a.type.replace(/-/g," ")}</div></div>
          <TB type={a.type}/>
        </div>
      ))}
    </Card>
  );
}

function Dashboard({user,setPage,appts,recalls,refillRequests}){
  const r=user.role;
  const TODAY="2026-02-25";
  const todayAppts=appts.filter(a=>(a.date||TODAY)===TODAY);
  const checkedIn=todayAppts.filter(a=>a.status==="checked-in");
  const inProg=todayAppts.filter(a=>a.status==="in-progress");
  const noShows=todayAppts.filter(a=>a.status==="no-show");
  const overdue=recalls.filter(r=>r.urgency==="high");

  if(r==="receptionist")return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Good morning, {user.name}</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · Front Desk View</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[["Today's Appointments",todayAppts.length,"Booked",C.navyMid],["Checked In",checkedIn.length,"In waiting room",C.teal],["No-Shows",noShows.length,"Need follow-up",C.red],["Overdue Recalls",overdue.length,"Need scheduling",C.amber]].map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <FlowWidget appts={appts} setPage={setPage}/>
      <UpcomingWidget appts={appts}/>
    </div>
  );

  if(r==="nurse")return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Good morning, {user.name}</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · Nursing View</p></div>
      {checkedIn.length>0&&<div style={{background:C.amberBg,border:`1px solid ${C.amber}`,borderRadius:10,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:18}}>⚠</span><div><div style={{fontWeight:700,fontSize:13,color:C.amber}}>{checkedIn.length} patient{checkedIn.length>1?"s":""} waiting for vitals</div><div style={{fontSize:12,color:C.amber,marginTop:2}}>{checkedIn.map(a=>a.patient).join(", ")}</div></div></div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[["Checked In",checkedIn.length,"Awaiting vitals",C.teal],["In Progress",inProg.length,"With physician",C.amber],["No-Shows",noShows.length,"Today",C.red],["Scheduled",todayAppts.filter(a=>a.status==="scheduled").length,"Still arriving",C.blue]].map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <FlowWidget appts={appts} setPage={setPage}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Ready for Vitals</div>{todayAppts.filter(a=>["checked-in","scheduled"].includes(a.status)).slice(0,3).map((a,i,arr)=>(
          <div key={a.id} style={{padding:"13px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:12,color:C.muted,marginTop:1}}>{a.time}</div></div><SB status={a.status}/></div>
        ))}</Card>
        <Card><div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Overdue Recalls</div>{overdue.length>0?overdue.map((r,i,arr)=>(
          <div key={r.id} style={{padding:"13px 20px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.patient}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{r.reason}</div><div style={{fontSize:11,color:C.red,marginTop:2,fontWeight:600}}>Overdue since {fmt(r.due)}</div></div>
        )):<div style={{padding:"20px",color:C.muted,fontSize:13}}>No overdue recalls. ✓</div>}</Card>
      </div>
    </div>
  );

  if(r==="doctor")return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Good morning, {user.name}</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · {todayAppts.filter(a=>a.doctor==="Dr. Patel").length} patients today</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[["My Patients",todayAppts.filter(a=>a.doctor==="Dr. Patel").length,"Today",C.navyMid],["In Progress",inProg.length,"With you now",C.amber],["No-Shows",noShows.length,"Today",C.red],["Pending Refills",(refillRequests||[]).filter(r=>r.status==="pending").length,"Awaiting review",C.teal]].map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px",cursor:l==="Pending Refills"?"pointer":undefined}} onClick={l==="Pending Refills"?()=>setPage("refills"):undefined}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:16,marginBottom:16}}>
        <Card>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>My Schedule</div><button onClick={()=>setPage("appointments")} style={{color:C.navyMid,fontSize:12,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>View all →</button></div>
          {todayAppts.filter(a=>a.doctor==="Dr. Patel").map((a,i,arr)=>(
            <div key={a.id} style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{width:46,textAlign:"right",color:C.muted,fontSize:13,fontWeight:600,flexShrink:0}}>{a.time}</div>
              <div style={{width:3,height:36,background:a.status==="in-progress"?C.amber:a.status==="checked-in"?C.teal:C.border,borderRadius:2,flexShrink:0}}/>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:12,color:C.muted,marginTop:1}}>{a.duration}min · <TB type={a.type}/></div></div>
              <SB status={a.status}/>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Recall Alerts</div>
          {recalls.map((r,i)=>(<div key={r.id} style={{padding:"12px 20px",borderBottom:i<recalls.length-1?`1px solid ${C.border}`:"none"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.patient}</div><Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge></div><div style={{fontSize:12,color:C.muted}}>{r.reason}</div><div style={{fontSize:11,color:r.urgency==="high"?C.red:C.muted,marginTop:2,fontWeight:r.urgency==="high"?600:400}}>Due {fmt(r.due)}</div></div>))}
          {recalls.length===0&&<div style={{padding:"20px",color:C.muted,fontSize:13}}>No open recalls. ✓</div>}
        </Card>
      </div>
      <UpcomingWidget appts={appts}/>
    </div>
  );

  return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Good morning, {user.name}</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · Admin Overview</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}}>
        {[["Total Patients","6","Active records",C.navyMid],["Today's Volume",todayAppts.length,"Appointments",C.blue],["Pending Refills",(refillRequests||[]).filter(r=>r.status==="pending").length,"Awaiting approval",C.teal],["Open Recalls",recalls.length,"Follow-up needed",C.amber]].map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <FlowWidget appts={appts} setPage={setPage}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>All Appointments Today</div>
          {todayAppts.slice(0,5).map((a,i)=>(<div key={a.id} style={{padding:"11px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:i<4?`1px solid ${C.border}`:"none"}}><div style={{width:42,color:C.muted,fontSize:12,fontWeight:600,flexShrink:0}}>{a.time}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:11,color:C.muted}}>{a.doctor}</div></div><SB status={a.status}/></div>))}
        </Card>
        <Card>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Staff Activity</div></div>
          {STAFF_LIST.map((s,i)=>(<div key={s.id} style={{padding:"11px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:i<STAFF_LIST.length-1?`1px solid ${C.border}`:"none"}}><div style={{width:30,height:30,borderRadius:"50%",background:s.status==="active"?C.navyMid:"#CBD5E1",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{s.name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2)}</div><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{s.name}</div><div style={{fontSize:11,color:C.muted}}>{s.lastLogin}</div></div><Badge color={s.status==="active"?"green":"red"}>{s.status}</Badge></div>))}
        </Card>
      </div>
      <UpcomingWidget appts={appts}/>
    </div>
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
  const TYPE_C={routine:C.blue,"follow-up":C.teal,urgent:C.red,procedure:C.amber,"new-patient":C.green};
  const top=(t)=>{const[h,m]=t.split(":").map(Number);return((h-START)+m/60)*HOUR_H;};
  const ht=(d)=>Math.max((d/60)*HOUR_H-2,22);
  const dayAppts=appts.filter(a=>(a.date||"2026-02-25")===selectedDate);
  return(
    <Card style={{overflow:"hidden"}}>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`}}>
        <div style={{width:68,flexShrink:0}}/>
        <div style={{flex:1,padding:"10px 16px",fontWeight:700,fontSize:13,color:C.text}}>
          {new Date(selectedDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
          <span style={{marginLeft:10,fontSize:12,fontWeight:400,color:C.muted}}>{dayAppts.length} appointment{dayAppts.length!==1?"s":""}</span>
        </div>
      </div>
      <div style={{display:"flex",overflowY:"auto",maxHeight:520}}>
        <div style={{width:68,flexShrink:0,borderRight:`1px solid ${C.border}`}}>
          {hours.map(h=><div key={h} style={{height:HOUR_H,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:10,paddingTop:6,fontSize:10,fontWeight:600,color:C.muted}}>{h>12?h-12:h}:00 {h>=12?"PM":"AM"}</div>)}
        </div>
        <div style={{flex:1,position:"relative",minHeight:(END-START)*HOUR_H}}>
          {hours.map((h,i)=>(
            <div key={h} style={{position:"absolute",top:i*HOUR_H,left:0,right:0,height:HOUR_H,borderBottom:`1px solid ${C.border}`}}>
              <div style={{position:"absolute",top:HOUR_H/2,left:0,right:0,borderBottom:`1px dashed #EEF0F3`}}/>
              {canAdd&&[0,30].map(m=>(
                <div key={m} style={{position:"absolute",top:m===0?0:HOUR_H/2,left:0,right:0,height:HOUR_H/2,cursor:"pointer",zIndex:0}}
                  onClick={()=>onSlotClick(selectedDate,`${String(h).padStart(2,"0")}:${m===0?"00":"30"}`)}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(30,77,140,0.04)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}/>
              ))}
            </div>
          ))}
          {dayAppts.map(a=>{
            const col=TYPE_C[a.type]||C.blue;
            return(
              <div key={a.id} style={{position:"absolute",top:top(a.time)+1,left:8,right:8,height:ht(a.duration),background:col+"1A",border:`1px solid ${col}60`,borderLeft:`3px solid ${col}`,borderRadius:5,padding:"4px 8px",overflow:"hidden",zIndex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:col,lineHeight:1.3}}>{a.patient}</div>
                {ht(a.duration)>28&&<div style={{fontSize:10,color:C.muted}}>{a.time} · {a.type.replace(/-/g," ")} · {a.duration}m</div>}
                {ht(a.duration)>44&&<div style={{fontSize:10,color:C.muted}}>{a.doctor}</div>}
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
  const DOC_C={"Dr. Patel":C.blue,"Dr. Williams":C.teal};
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
            <div key={date} onClick={()=>onSelectDate(date)} style={{flex:1,padding:"10px 6px",textAlign:"center",cursor:"pointer",borderRight:`1px solid ${C.border}`,background:isSel?C.blueBg:"transparent"}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:600}}>{d.toLocaleDateString("en-US",{weekday:"short"})}</div>
              <div style={{fontSize:18,fontWeight:700,color:isSel?C.navyMid:C.text}}>{d.getDate()}</div>
              {cnt>0&&<div style={{fontSize:9,color:C.muted}}>{cnt} appt{cnt>1?"s":""}</div>}
            </div>
          );
        })}
      </div>
      <div style={{display:"flex",overflowY:"auto",maxHeight:500}}>
        <div style={{width:68,flexShrink:0,borderRight:`1px solid ${C.border}`}}>
          {hours.map(h=><div key={h} style={{height:HOUR_H,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"flex-start",justifyContent:"flex-end",paddingRight:10,paddingTop:4,fontSize:10,fontWeight:600,color:C.muted}}>{h>12?h-12:h}{h>=12?"pm":"am"}</div>)}
        </div>
        {weekDates.map(date=>{
          const dayAppts=appts.filter(a=>(a.date||"2026-02-25")===date);
          const isSel=date===selectedDate;
          return(
            <div key={date} style={{flex:1,position:"relative",borderRight:`1px solid ${C.border}`,minHeight:(END-START)*HOUR_H,background:isSel?"rgba(30,77,140,0.015)":"transparent"}}>
              {hours.map((h,i)=>(
                <div key={h} style={{position:"absolute",top:i*HOUR_H,left:0,right:0,height:HOUR_H,borderBottom:`1px solid ${C.border}`}}>
                  <div style={{position:"absolute",top:HOUR_H/2,left:0,right:0,borderBottom:`1px dashed #EEF0F3`}}/>
                  {canAdd&&[0,30].map(m=>(
                    <div key={m} style={{position:"absolute",top:m===0?0:HOUR_H/2,left:0,right:0,height:HOUR_H/2,cursor:"pointer",zIndex:0}}
                      onClick={()=>{onSelectDate(date);onSlotClick(date,`${String(h).padStart(2,"0")}:${m===0?"00":"30"}`);}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(30,77,140,0.05)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}/>
                  ))}
                </div>
              ))}
              {dayAppts.map(a=>{
                const col=DOC_C[a.doctor]||C.blue;
                return(
                  <div key={a.id} style={{position:"absolute",top:top(a.time)+1,left:2,right:2,height:ht(a.duration),background:col+"22",border:`1px solid ${col}50`,borderLeft:`2px solid ${col}`,borderRadius:3,padding:"2px 4px",overflow:"hidden",zIndex:1,fontSize:10}}>
                    <div style={{fontWeight:700,color:col,lineHeight:1.2}}>{a.patient.split(" ")[0]}</div>
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
          <div style={{fontSize:11,fontWeight:700,color:C.text}}>{d.value||""}</div>
          <div style={{width:"100%",background:color,borderRadius:"3px 3px 0 0",height:`${(d.value/max)*90}px`,minHeight:d.value?4:0,transition:"height 0.3s"}}/>
          <div style={{fontSize:10,color:C.muted,textAlign:"center",lineHeight:1.2}}>{d.label}</div>
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
          <div style={{width:120,fontSize:12,color:C.muted,textAlign:"right",flexShrink:0}}>{d.label}</div>
          <div style={{flex:1,background:C.bg,borderRadius:4,overflow:"hidden",height:20}}>
            <div style={{width:`${(d.value/max)*100}%`,background:d.color||C.navyMid,height:"100%",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:6,minWidth:d.value?20:0}}>
              <span style={{fontSize:10,fontWeight:700,color:"#fff"}}>{d.value}</span>
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
    {label:"This Week",value:recalls.filter(r=>r.urgency==="medium").length, color:C.amber},
    {label:"Upcoming", value:recalls.filter(r=>r.urgency==="low").length,    color:C.green},
  ];
  const statCards=[
    ["Total Appointments",appts.length,"All time",C.navyMid],
    ["No-Show Rate",`${noShowRate}%`,"This month",noShowRate>15?C.red:C.green],
    ["Open Recalls",recalls.length,"Awaiting contact",C.amber],
    ["Active Patients",patients.filter(p=>p.active!==false).length,"Total registered",C.teal],
  ];
  return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Reports</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Clinic performance overview</p></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        {statCards.map(([l,v,s,c])=>(
          <Card key={l} style={{padding:"18px 20px"}}><div style={{color:C.muted,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>{l}</div><div style={{fontSize:30,fontWeight:800,color:c,lineHeight:1}}>{v}</div><div style={{color:C.muted,fontSize:12,marginTop:5}}>{s}</div></Card>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Appointments This Week</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>By day (Feb 24–28, 2026)</div>
          <BarChart data={apptsByDay} color={C.navyMid}/>
        </Card>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Top Appointment Types</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>All time</div>
          <HBarChart data={topTypes}/>
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:4}}>Recalls by Urgency</div>
          <div style={{fontSize:12,color:C.muted,marginBottom:16}}>Current open recalls</div>
          <HBarChart data={recallByUrgency}/>
        </Card>
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:16}}>No-Show Summary</div>
          <div style={{display:"flex",gap:20,alignItems:"center"}}>
            <div style={{width:80,height:80,borderRadius:"50%",background:`conic-gradient(${C.red} 0% ${noShowRate}%,${C.greenBg} ${noShowRate}% 100%)`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:C.surface,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
                <div style={{fontSize:18,fontWeight:800,color:C.red}}>{noShowRate}%</div>
              </div>
            </div>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}><div style={{width:10,height:10,borderRadius:2,background:C.red}}/><span style={{fontSize:13,color:C.muted}}>No-shows: {noShowCount}</span></div>
              <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:2,background:C.greenBg,border:`1px solid ${C.green}`}}/><span style={{fontSize:13,color:C.muted}}>Completed: {appts.filter(a=>a.status==="completed").length}</span></div>
              <div style={{fontSize:12,color:C.muted,marginTop:12}}>Target: below 10%</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
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
              <span style={{fontSize:20}}>📄</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13,color:C.text}}>{f.name}</div>
                <div style={{fontSize:11,color:C.muted}}>{f.type} · {f.date} · {f.size}</div>
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
  const COLS=[
    {id:"scheduled",   label:"Scheduled",  color:C.blue,   bg:C.blueBg},
    {id:"checked-in",  label:"Checked In", color:C.teal,   bg:C.tealBg},
    {id:"with-nurse",  label:"With Nurse", color:C.purple, bg:C.purpleBg},
    {id:"in-progress", label:"With Doctor",color:C.amber,  bg:C.amberBg},
    {id:"completed",   label:"Done",       color:C.green,  bg:C.greenBg},
  ];
  const noShows=appts.filter(a=>(a.date||TODAY)===TODAY&&a.status==="no-show");
  const ORDER=["scheduled","checked-in","with-nurse","in-progress","completed"];
  const BTN_LABEL={"scheduled":"Check In →","checked-in":"To Nurse →","with-nurse":"Start Visit →","in-progress":"Complete ✓"};
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
    <div style={{padding:"28px 32px",height:"calc(100% - 56px)",boxSizing:"border-box",display:"flex",flexDirection:"column"}}>
      {doctorAlerts.length>0&&(
        <div style={{position:"fixed",top:72,right:20,zIndex:800,display:"flex",flexDirection:"column",gap:8}}>
          {doctorAlerts.map(a=>(
            <div key={a.id} style={{background:C.surface,border:`2px solid ${C.amber}`,borderRadius:12,padding:"14px 16px",boxShadow:"0 6px 24px rgba(0,0,0,0.18)",minWidth:260,maxWidth:300,animation:"slideIn 0.2s ease"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18}}>🔔</span>
                  <div style={{fontWeight:700,fontSize:13,color:C.amber}}>Patient Ready for Doctor</div>
                </div>
                <button onClick={()=>dismissAlert(a.id)} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer",padding:0,lineHeight:1,marginLeft:8}}>×</button>
              </div>
              <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:3}}>{a.patient}</div>
              <div style={{fontSize:12,color:C.muted}}>{a.type.replace(/-/g," ")} · {a.time}</div>
              {a.doctor&&<div style={{fontSize:12,color:C.muted,marginTop:1}}>{a.doctor}</div>}
              <button onClick={()=>dismissAlert(a.id)} style={{marginTop:10,width:"100%",padding:"6px",borderRadius:6,border:`1px solid ${C.border}`,background:C.bg,color:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>Dismiss</button>
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
      <div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Patient Flow</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>Wednesday, February 25, 2026 · {todayAppts.length} patients scheduled</p></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {DOCTORS.length>0&&<div style={{display:"flex",gap:6}}>
            {DOCTORS.map(doc=>(
              <div key={doc} style={{background:doctorStatus[doc]?C.greenBg:C.redBg,border:`1px solid ${doctorStatus[doc]?C.green:C.red}20`,borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,color:doctorStatus[doc]?C.green:C.red,display:"flex",alignItems:"center",gap:4}}>
                <span style={{fontSize:8}}>●</span>{doc.split(" ").pop()} {doctorStatus[doc]?"Ready":"Busy"}
              </div>
            ))}
          </div>}
          {noShows.length>0&&<div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:8,padding:"8px 14px",fontSize:13,color:C.red,fontWeight:600}}>{noShows.length} no-show{noShows.length>1?"s":""} today</div>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,flex:1,overflow:"hidden"}}>
        {COLS.map(col=>{
          const cards=todayAppts.filter(a=>a.status===col.id);
          return(
            <div key={col.id} style={{background:col.bg,borderRadius:10,border:`1px solid ${col.color}30`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"12px 16px",borderBottom:`1px solid ${col.color}30`,display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:col.color}}/>
                <div style={{fontWeight:700,fontSize:13,color:col.color}}>{col.label}</div>
                <div style={{marginLeft:"auto",background:col.color,color:"#fff",fontSize:11,fontWeight:700,padding:"1px 7px",borderRadius:10}}>{cards.length}</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"10px"}}>
                {cards.length===0&&(()=>{
                  const emptyMsgs={"checked-in":["📋","No patients checked in"],"with-nurse":["🩺","No patients with nurse"],"in-progress":["👨‍⚕️","No patients with doctor"],completed:["✓","No completed visits yet"],scheduled:["📅","No patients scheduled"]};
                  const[icon,msg]=emptyMsgs[col.id]||["—","Empty"];
                  return(
                    <div style={{margin:"20px 6px",border:`1.5px dashed ${col.color}40`,borderRadius:10,padding:"24px 12px",textAlign:"center",background:col.bg,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                      <div style={{fontSize:22,opacity:0.5}}>{icon}</div>
                      <div style={{fontSize:11,color:col.color,fontWeight:600,opacity:0.7}}>{msg}</div>
                    </div>
                  );
                })()}
                {cards.map(a=>(
                  <div key={a.id} style={{background:C.surface,borderRadius:8,padding:"12px",marginBottom:8,border:`1px solid ${col.color}25`,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                      <div style={{fontWeight:700,fontSize:13,color:C.text}}>{a.patient}</div>
                      <div style={{fontSize:11,fontWeight:600,color:C.muted}}>{a.time}</div>
                    </div>
                    {a.stageEnteredAt&&<TimeInStage stageEnteredAt={a.stageEnteredAt}/>}
                    <div style={{display:"flex",gap:6,marginBottom:8,marginTop:6,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,fontWeight:600,color:TYPE_C[a.type]||C.blue,background:(TYPE_C[a.type]||C.blue)+"15",padding:"2px 6px",borderRadius:3}}>{a.type.replace(/-/g," ")}</span>
                      <span style={{fontSize:10,color:C.muted,background:C.bg,padding:"2px 6px",borderRadius:3}}>{a.doctor}</span>
                    </div>
                    <div style={{display:"flex",gap:6}}>
                      {col.id!=="completed"&&<button onClick={()=>advance(a.id)} style={{flex:1,fontSize:11,fontWeight:700,padding:"5px 8px",borderRadius:5,border:"none",background:col.color,color:"#fff",cursor:"pointer"}}>{BTN_LABEL[col.id]||"→"}</button>}
                      {col.id==="scheduled"&&user.role!=="doctor"&&<button onClick={()=>noShowHandler(a.id)} style={{fontSize:11,fontWeight:600,padding:"5px 8px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.red,cursor:"pointer"}}>No Show</button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <button onClick={prevMonth} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1, padding: "2px 8px", borderRadius: 4 }}>‹</button>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{MONTH_NAMES[viewMonth]} {viewYear}</div>
        <button onClick={nextMonth} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 20, lineHeight: 1, padding: "2px 8px", borderRadius: 4 }}>›</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: C.muted, paddingBottom: 4 }}>{d}</div>
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
                background: isSelected ? C.navyMid : isToday ? C.blueBg : "transparent",
                color: isSelected ? "#fff" : isToday ? C.blue : C.text,
                fontWeight: isSelected || isToday ? 700 : 400,
                fontSize: 12,
              }}
            >
              <span>{day}</span>
              {count > 0 && (
                <div style={{
                  width: 4, height: 4, borderRadius: "50%", marginTop: 2,
                  background: isSelected ? "rgba(255,255,255,0.75)" : C.teal,
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
  const BTN_LABEL = {"scheduled":"Check In","checked-in":"To Nurse","with-nurse":"Start","in-progress":"Complete"};
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
    if(!logs.length) return {color:"#CBD5E1",label:"Not Sent"};
    const last = logs[0];
    if(last.confirmed) return {color:C.green,label:"Confirmed"};
    return {color:C.amber,label:"Sent — Not Confirmed"};
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
    <div style={{ padding: "28px 32px" }}>
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
            <div key={w.id} style={{background:C.bg,borderRadius:8,padding:"12px 14px",marginBottom:16}}>
              <div style={{fontWeight:700,fontSize:13}}>{w.patient}</div>
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

      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: 0 }}>Appointments</h1>
          <p style={{ color: C.muted, fontSize: 14, marginTop: 4 }}>{displayDate}</p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 7, overflow: "hidden" }}>
            {[["list","≡ List"],["day","⊟ Day"],["week","⊞ Week"],["waitlist","⏳ Waitlist"]].map(([id,lbl]) => (
              <button key={id} onClick={() => setView(id)}
                style={{ padding: "7px 14px", border: "none", background: view===id ? C.navyMid : C.surface, color: view===id ? "#fff" : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {lbl}
              </button>
            ))}
          </div>
          {canAdd && <button onClick={printDaySchedule} style={{background:C.surface,color:C.muted,border:`1px solid ${C.border}`,borderRadius:7,padding:"9px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>🖨 Print Day</button>}
          {canAdd && (
            <button onClick={() => setShowNew(true)}
              style={{ background: C.navyMid, color: "#fff", border: "none", borderRadius: 7, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              + New Appointment
            </button>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "268px 1fr", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <MiniCalendar selectedDate={selectedDate} onSelectDate={date => { setSelectedDate(date); setFilter("all"); }} appts={appts} />
          <Card style={{ padding: "16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Day Summary</div>
            {[["Total",dayAppts.length,C.navyMid],["Scheduled",dayAppts.filter(a=>a.status==="scheduled").length,C.blue],["Checked In",dayAppts.filter(a=>a.status==="checked-in").length,C.teal],["With Nurse",dayAppts.filter(a=>a.status==="with-nurse").length,C.purple],["With Doctor",dayAppts.filter(a=>a.status==="in-progress").length,C.amber],["Completed",dayAppts.filter(a=>a.status==="completed").length,C.green],["No-Shows",dayAppts.filter(a=>a.status==="no-show").length,C.red]].map(([label,count,color])=>(
              <div key={label} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <span style={{fontSize:12,color:C.muted}}>{label}</span>
                <span style={{fontSize:13,fontWeight:700,color:count>0?color:C.muted}}>{count}</span>
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
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap:"wrap" }}>
                {[["all","All"],["scheduled","Scheduled"],["checked-in","Checked In"],["with-nurse","With Nurse"],["in-progress","With Doctor"],["completed","Completed"],["no-show","No-Show"]].map(([id,lbl]) => (
                  <button key={id} onClick={() => setFilter(id)}
                    style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${filter===id ? C.navyMid : C.border}`, background: filter===id ? C.navyMid : C.surface, color: filter===id ? "#fff" : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {lbl}
                  </button>
                ))}
              </div>
              <Card>
                {filtered.length === 0 ? (
                  <div style={{ padding: "48px 32px", textAlign: "center", color: C.muted }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>No appointments</div>
                    <div style={{ fontSize: 13 }}>{filter !== "all" ? "No appointments match this filter." : "No appointments scheduled for this day."}</div>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: C.bg }}>
                        {["Time","Patient","Type","Doctor","Dur.","Status","Reminder","Action"].map(h => (
                          <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a, i) => {
                        const dot = getReminderDot(a.id);
                        const logs = (reminderLogs||{})[a.id]||[];
                        const isExpanded = expandedReminder===a.id;
                        // left-border accent logic
                        const typeAccent = {urgent:C.red,"follow-up":C.teal,"new-patient":C.green,procedure:C.amber};
                        const statusAccent = {"checked-in":C.teal,"in-progress":C.amber,"with-nurse":C.purple};
                        const accentColor = statusAccent[a.status] || typeAccent[a.type] || null;
                        const rowBg = a.status==="no-show" ? C.redBg
                          : a.status==="checked-in" ? "rgba(0,160,160,0.05)"
                          : a.status==="in-progress" ? "rgba(240,140,0,0.05)"
                          : a.status==="with-nurse" ? "rgba(120,70,200,0.05)"
                          : a.type==="urgent" ? "rgba(220,50,50,0.05)"
                          : "transparent";
                        return [
                          <tr key={a.id} style={{ borderBottom: `1px solid ${C.border}`, background: rowBg, borderLeft: accentColor ? `4px solid ${accentColor}` : "4px solid transparent" }}>
                            <td style={{ padding: "12px 12px", fontSize: 13, fontWeight: 700, color: C.text }}>{a.time}</td>
                            <td style={{ padding: "12px 12px", fontSize: 13, fontWeight: 600, color: C.text }}>{a.patient}</td>
                            <td style={{ padding: "12px 12px" }}><TB type={a.type}/></td>
                            <td style={{ padding: "12px 12px", fontSize: 12, color: C.muted }}>{a.doctor}</td>
                            <td style={{ padding: "12px 12px", fontSize: 12, color: C.muted }}>{a.duration}m</td>
                            <td style={{ padding: "12px 12px" }}><SB status={a.status}/></td>
                            <td style={{ padding: "12px 12px" }}>
                              <button onClick={()=>setExpandedReminder(isExpanded?null:a.id)} title={dot.label}
                                style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,padding:0}}>
                                <span style={{width:10,height:10,borderRadius:"50%",background:dot.color,display:"inline-block",flexShrink:0}}/>
                                <span style={{fontSize:11,color:C.muted}}>{dot.label}</span>
                              </button>
                            </td>
                            <td style={{ padding: "12px 12px" }}>
                              <div style={{ display: "flex", gap: 5 }}>
                                {a.status !== "completed" && a.status !== "no-show" && (
                                  <button onClick={() => advance(a.id)}
                                    style={{ fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 5, border: `1px solid ${C.border}`, background: C.surface, color: C.navyMid, cursor: "pointer" }}>
                                    {BTN_LABEL[a.status]||"→"}
                                  </button>
                                )}
                                {a.status === "scheduled" && (
                                  <button onClick={() => noShowHandler(a.id)}
                                    style={{ fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 5, border: `1px solid ${C.border}`, background: C.surface, color: C.red, cursor: "pointer" }}>
                                    No Show
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>,
                          isExpanded && (
                            <tr key={a.id+"-log"}>
                              <td colSpan={8} style={{padding:"0 12px 12px",background:C.bg}}>
                                <div style={{padding:"12px",background:C.surface,borderRadius:8,border:`1px solid ${C.border}`}}>
                                  <div style={{fontWeight:700,fontSize:12,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:8}}>Reminder Log</div>
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
                                      <button onClick={()=>logPhoneCall(a.id)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>Log Phone Call</button>
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
  if(loading)return <div style={{padding:32}}>{[1,2,3].map(i=><div key={i} style={{background:"#E8ECF0",borderRadius:8,height:56,marginBottom:8}}/>)}</div>;
  return(
    <div>
      {canAdd&&<Card style={{marginBottom:16,padding:"16px 20px"}}>
        <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:14}}>Add to Waitlist</div>
        <FR><FF label="Patient"><select value={f.pid} onChange={e=>sf(p=>({...p,pid:e.target.value}))} style={SS}><option value="">Select patient…</option>{patients.map(pt=><option key={pt.id} value={pt.id}>{pt.first_name} {pt.last_name}</option>)}</select></FF><FF label="Doctor"><select value={f.doctor} onChange={e=>sf(p=>({...p,doctor:e.target.value}))} style={SS}><option>Dr. Patel</option><option>Dr. Williams</option></select></FF></FR>
        <FR><FF label="Preferred Time"><select value={f.preferredTime} onChange={e=>sf(p=>({...p,preferredTime:e.target.value}))} style={SS}><option>Morning</option><option>Afternoon</option><option>Either</option></select></FF><FF label="Reason"><input value={f.reason} onChange={e=>sf(p=>({...p,reason:e.target.value}))} style={IS} placeholder="Reason for visit…"/></FF></FR>
        <PB onClick={add} disabled={!f.pid||!f.reason}>Add to Waitlist</PB>
      </Card>}
      <Card>
        {waitlist.length===0?<div style={{padding:"40px 24px",textAlign:"center",color:C.muted}}>Waitlist is empty.</div>:(
          waitlist.map((w,i)=>(
            <div key={w.id} style={{padding:"14px 20px",borderBottom:i<waitlist.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:14}}>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text}}>{w.patient}</div>
                <div style={{fontSize:12,color:C.muted}}>{w.doctor} · {w.preferredTime} · {w.reason}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>Added {w.addedDate}</div>
              </div>
              <Badge color={w.status==="contacted"?"green":"blue"}>{w.status==="contacted"?"Contacted":"Waiting"}</Badge>
              {w.status==="waiting"&&<button onClick={()=>markContacted(w.id)} style={{fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.navyMid,cursor:"pointer"}}>Mark Contacted</button>}
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
    const bmi=editV.weight&&editV.ht?((parseInt(editV.weight)/(parseInt(editV.ht)**2))*703).toFixed(1):v?.bmi||0;
    const newEntry={id:Date.now(),date:today(),bp:`${editV.sys}/${editV.dia}`,hr:parseInt(editV.hr),temp:parseFloat(editV.temp)||0,o2:parseInt(editV.o2)||0,weight:parseInt(editV.weight)||0,bmi:parseFloat(bmi)||0,recordedBy:user?.name||""};
    setVitals(prev=>({...prev,[patient.id]:[...(prev[patient.id]||[]),newEntry]}));
    setSaved(true);
    if(alerts.length>0&&showToast)showToast("Vitals saved — review flagged values","amber");
    setTimeout(()=>setSaved(false),2500);
  };
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Current Vitals</div><button onClick={onRecordClick} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Record via Form</button></div>
        {v?(<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:16}}>{[["BP",v.bp,"mmHg",parseFloat(v.bp)>130?C.amber:C.green],["HR",v.hr,"bpm",C.green],["Temp",v.temp,"°F",C.green],["O\u2082",v.o2,"%",v.o2<97?C.amber:C.green],["Weight",v.weight,"lbs",C.text],["BMI",v.bmi,"",v.bmi>25?C.amber:C.green]].map(([l,val,u,c])=><div key={l} style={{background:C.bg,borderRadius:8,padding:"14px",textAlign:"center"}}><div style={{fontSize:11,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:c}}>{val}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{u}</div></div>)}</div>):<div style={{color:C.muted,marginBottom:16}}>No vitals on record.</div>}
        {p.vitals&&(
          <div>
            <div style={{fontWeight:600,fontSize:13,color:C.text,marginBottom:12}}>Quick Update</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
              {[["sys","Systolic","120"],["dia","Diastolic","80"],["hr","Heart Rate","72"],["temp","Temp °F","98.6"],["o2","O\u2082 Sat %","98"],["weight","Weight lbs","160"]].map(([k,lbl,ph])=>(
                <div key={k}>
                  <label style={LS}>{lbl}</label>
                  <input type="number" step={k==="temp"?"0.1":"1"} value={editV[k]} onChange={e=>setEditV(f=>({...f,[k]:e.target.value}))} style={IS} placeholder={ph}/>
                </div>
              ))}
            </div>
            {alerts.length>0&&(
              <div style={{background:hasCritical?C.redBg:C.amberBg,border:`1px solid ${hasCritical?C.red:C.amber}`,borderRadius:8,padding:"10px 14px",marginBottom:12}}>
                {alerts.map((a,i)=>(
                  <div key={i} style={{fontSize:13,fontWeight:600,color:hasCritical?C.red:C.amber,display:"flex",alignItems:"center",gap:6}}>
                    <span>{a.level==="critical"?"🔴":"🟡"}</span>
                    <span>{a.level==="critical"?"CRITICAL":"ABNORMAL"}: {a.label} = {a.val}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={saveInlineVitals} disabled={!editV.sys||!editV.dia||!editV.hr} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Save Vitals</button>
              {saved&&<span style={{fontSize:13,color:C.green,fontWeight:600}}>✓ Saved{alerts.length>0?" — review flagged values":""}</span>}
            </div>
          </div>
        )}
      </Card>
      <Card style={{padding:"20px"}}>
        <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:16}}>Trends</div>
        <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
          <VitalsTrendChart data={vitalHistory} field="systolic"/>
          <VitalsTrendChart data={vitalHistory} field="weight"/>
          <VitalsTrendChart data={vitalHistory} field="glucose"/>
        </div>
      </Card>
      {vitalHistory&&vitalHistory.length>0&&(
        <Card style={{padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:14}}>Vitals History</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead><tr style={{background:C.bg}}>{["Date","BP","HR","Temp","O₂","Weight","Recorded By"].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
              <tbody>
                {[...vitalHistory].reverse().map((entry,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${C.border}`,background:i===0?C.blueBg:"transparent"}}>
                    <td style={{padding:"10px 12px",fontWeight:i===0?700:400,color:C.text}}>{fmt(entry.date)}{i===0&&<span style={{marginLeft:6,fontSize:10,color:C.blue,fontWeight:700}}>(current)</span>}</td>
                    <td style={{padding:"10px 12px",color:C.text}}>{entry.bp}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.hr}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.temp}</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.o2}%</td>
                    <td style={{padding:"10px 12px",color:C.muted}}>{entry.weight} lbs</td>
                    <td style={{padding:"10px 12px",color:C.muted,fontSize:12}}>{entry.recordedBy||"—"}</td>
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
  return <Badge color={color}>{level} Risk</Badge>;
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
      gaps.push({id:"flu",icon:"🟡",label:"Annual flu vaccine overdue",action:"Schedule influenza vaccine",severity:"medium"});
    }
  }
  // Age >= 65: pneumococcal
  if(ptAge>=65){
    const hasPneumo=vacArr.some(v=>v.vaccine.toLowerCase().includes("pneumo"));
    if(!hasPneumo)gaps.push({id:"pneumo",icon:"🟡",label:"Pneumococcal vaccine not on record",action:"Administer Pneumococcal vaccine",severity:"medium"});
  }
  // Age >= 50: colonoscopy
  if(ptAge>=50){
    const hasColono=labArr.some(l=>l.name.toLowerCase().includes("colonoscopy"));
    if(!hasColono)gaps.push({id:"colon",icon:"⚠",label:"Colonoscopy screening not documented",action:"Order or confirm colonoscopy",severity:"medium"});
  }
  // Diabetic: HbA1c every 6 months
  const hasMet=rxArr.some(r=>r.med.toLowerCase().includes("metformin"));
  const hasHbA1cLab=labArr.some(l=>l.name.toLowerCase().includes("hba1c"));
  if(hasMet||hasHbA1cLab){
    const lastHbA1c=labArr.filter(l=>l.name.toLowerCase().includes("hba1c")).sort((a,b)=>b.date.localeCompare(a.date))[0];
    if(!lastHbA1c){
      gaps.push({id:"hba1c",icon:"🔴",label:"HbA1c not on record (diabetic patient)",action:"Order HbA1c lab",severity:"high"});
    } else {
      const monthsAgo6=new Date();monthsAgo6.setMonth(monthsAgo6.getMonth()-6);
      if(new Date(lastHbA1c.date)<monthsAgo6)gaps.push({id:"hba1c",icon:"🟡",label:"HbA1c overdue (>6 months)",action:"Order HbA1c recheck",severity:"medium"});
    }
  }
  // Hypertension: BP check every 3 months
  const hasLisin=rxArr.some(r=>r.med.toLowerCase().includes("lisinopril"));
  if(hasLisin&&patient.lastVisit){
    const daysSince=(new Date()-new Date(patient.lastVisit))/86400000;
    if(daysSince>90)gaps.push({id:"bp",icon:"⚠",label:"BP check overdue (>3 months since last visit)",action:"Schedule BP follow-up",severity:"medium"});
  }
  // Annual physical
  if(patient.lastVisit){
    const daysSince=(new Date()-new Date(patient.lastVisit))/86400000;
    if(daysSince>365)gaps.push({id:"annual",icon:"🟡",label:"Annual physical overdue",action:"Schedule annual physical",severity:"medium"});
  }
  const activeGaps=gaps.filter(g=>!dismissed.has(g.id));
  return(
    <div style={{gridColumn:"1 / -1"}}>
      <Card style={{padding:0,overflow:"hidden"}}>
        <div onClick={()=>setOpen(v=>!v)} style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",borderBottom:open&&activeGaps.length>0?`1px solid ${C.border}`:"none"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,flex:1}}>Care Gaps &amp; Preventive Alerts</div>
          {activeGaps.length>0&&<span style={{background:C.amberBg,color:C.amber,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10}}>{activeGaps.length}</span>}
          <span style={{color:C.muted,fontSize:12}}>{open?"▲":"▼"}</span>
        </div>
        {open&&(
          <div style={{padding:"4px 0"}}>
            {activeGaps.length===0&&<div style={{padding:"16px 20px",fontSize:13,color:C.muted}}>✓ No care gaps identified.</div>}
            {activeGaps.map(g=>(
              <div key={g.id} style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:18,flexShrink:0}}>{g.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:C.text}}>{g.label}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>Recommended: {g.action}</div>
                </div>
                <button onClick={()=>setDismissed(prev=>{const s=new Set(prev);s.add(g.id);return s;})} style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,cursor:"pointer",flexShrink:0}}>Dismiss</button>
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
  const getQtyColor=(i)=>{
    if(i.qty===0)return C.red;
    if(i.qty<=i.reorderAt)return C.red;
    if(i.qty<=i.reorderAt*1.5)return C.amber;
    return C.text;
  };
  return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      <div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Inventory</h1>
          <div style={{display:"flex",gap:12,marginTop:8,alignItems:"center"}}>
            <span style={{fontSize:13,color:C.muted}}>Total: <strong>{inventory.length}</strong></span>
            {lowStock.length>0&&<Badge color="red">{lowStock.length} Low Stock</Badge>}
            {outOfStock.length>0&&<Badge color="red">{outOfStock.length} Out of Stock</Badge>}
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{...SS,width:160}}>
            {cats.map(c=><option key={c}>{c}</option>)}
          </select>
          <button onClick={()=>setShowAdd(v=>!v)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add Item</button>
        </div>
      </div>
      {showAdd&&(
        <Card style={{marginBottom:16,padding:"16px 20px"}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>New Item</div>
          <FR><FF label="Name *"><input value={newItem.name} onChange={e=>setNewItem(f=>({...f,name:e.target.value}))} style={IS}/></FF><FF label="Category"><select value={newItem.category} onChange={e=>setNewItem(f=>({...f,category:e.target.value}))} style={SS}>{["PPE","Supplies","Equipment","Medication"].map(c=><option key={c}>{c}</option>)}</select></FF></FR>
          <FR><FF label="Qty"><input type="number" value={newItem.qty} onChange={e=>setNewItem(f=>({...f,qty:e.target.value}))} style={IS}/></FF><FF label="Unit"><input value={newItem.unit} onChange={e=>setNewItem(f=>({...f,unit:e.target.value}))} style={IS} placeholder="units"/></FF></FR>
          <FR><FF label="Reorder At"><input type="number" value={newItem.reorderAt} onChange={e=>setNewItem(f=>({...f,reorderAt:e.target.value}))} style={IS}/></FF><FF label="Reorder Qty"><input type="number" value={newItem.reorderQty} onChange={e=>setNewItem(f=>({...f,reorderQty:e.target.value}))} style={IS}/></FF></FR>
          <FR cols={1}><FF label="Supplier"><input value={newItem.supplier} onChange={e=>setNewItem(f=>({...f,supplier:e.target.value}))} style={IS}/></FF></FR>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowAdd(false)}>Cancel</XB><PB onClick={addItem} disabled={!newItem.name}>Add Item</PB></div>
        </Card>
      )}
      <Card style={{overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>{["Name","Category","Qty","Unit","Reorder At","Last Ordered","Actions"].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map((item,i)=>{
              const isLow=item.qty<=item.reorderAt;
              const isEditing=qtyEdit[item.id]!==undefined;
              return(
                <tr key={item.id} style={{borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none",borderLeft:isLow?`3px solid ${C.red}`:"3px solid transparent"}}>
                  <td style={{padding:"11px 14px",fontWeight:600,fontSize:13,color:C.text}}>{item.name}</td>
                  <td style={{padding:"11px 14px"}}><Badge color={item.category==="PPE"?"blue":item.category==="Equipment"?"purple":item.category==="Medication"?"green":"amber"}>{item.category}</Badge></td>
                  <td style={{padding:"11px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <button onClick={()=>updateQty(item.id,item.qty-1)} style={{width:22,height:22,borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontWeight:700,color:C.muted,fontSize:14,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
                      <input
                        type="number"
                        value={isEditing?qtyEdit[item.id]:item.qty}
                        onChange={e=>setQtyEdit(prev=>({...prev,[item.id]:e.target.value}))}
                        onBlur={e=>{if(isEditing){updateQty(item.id,qtyEdit[item.id]);setQtyEdit(prev=>{const n={...prev};delete n[item.id];return n;});}}}
                        style={{...IS,width:60,textAlign:"center",padding:"4px 6px",color:getQtyColor(item),fontWeight:700}}
                      />
                      <button onClick={()=>updateQty(item.id,item.qty+1)} style={{width:22,height:22,borderRadius:4,border:`1px solid ${C.border}`,background:C.bg,cursor:"pointer",fontWeight:700,color:C.muted,fontSize:14,lineHeight:1,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                    </div>
                  </td>
                  <td style={{padding:"11px 14px",fontSize:12,color:C.muted}}>{item.unit}</td>
                  <td style={{padding:"11px 14px",fontSize:12,color:C.muted}}>{item.reorderAt}</td>
                  <td style={{padding:"11px 14px",fontSize:12,color:C.muted}}>{item.lastOrdered||"—"}</td>
                  <td style={{padding:"11px 14px"}}>
                    <button onClick={()=>markOrdered(item.id)} style={{fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.navyMid,cursor:"pointer"}}>Mark Ordered</button>
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
  const typeColor={regular:C.greenBg,"half-day":C.amberBg,"on-call":C.blueBg,off:C.redBg};
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
    <div style={{padding:"28px 32px",maxWidth:1200}}>
      <div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Staff Schedule</h1>
          <p style={{color:C.muted,fontSize:14,marginTop:4}}>{weekLabel}</p>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setWeekOffset(v=>v-1)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",color:C.text}}>‹ Prev Week</button>
          <button onClick={()=>setWeekOffset(0)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",color:C.muted}}>Today</button>
          <button onClick={()=>setWeekOffset(v=>v+1)} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 14px",fontSize:13,fontWeight:600,cursor:"pointer",color:C.text}}>Next Week ›</button>
        </div>
      </div>
      {editCell&&(
        <Card style={{marginBottom:16,padding:"16px 20px"}}>
          <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>Edit Shift — {editCell.staffName} on {fmt(editCell.date)}</div>
          <FR>
            <FF label="Start Time"><input type="time" value={shiftForm.startTime} onChange={e=>setShiftForm(f=>({...f,startTime:e.target.value}))} style={IS}/></FF>
            <FF label="End Time"><input type="time" value={shiftForm.endTime} onChange={e=>setShiftForm(f=>({...f,endTime:e.target.value}))} style={IS}/></FF>
            <FF label="Type"><select value={shiftForm.type} onChange={e=>setShiftForm(f=>({...f,type:e.target.value}))} style={SS}><option value="regular">Regular</option><option value="half-day">Half Day</option><option value="on-call">On Call</option><option value="off">Off</option></select></FF>
          </FR>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setEditCell(null)}>Cancel</XB><PB onClick={saveShift}>Save Shift</PB></div>
        </Card>
      )}
      <Card style={{overflow:"auto",marginBottom:16}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
          <thead>
            <tr style={{background:C.bg}}>
              <th style={{padding:"10px 14px",textAlign:"left",fontSize:12,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`,minWidth:160}}>Staff</th>
              {weekDates.map((d,i)=>(
                <th key={d} style={{padding:"10px 8px",textAlign:"center",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`}}>
                  <div>{dayLabels[i]}</div>
                  <div style={{fontSize:12,color:C.text,fontWeight:600}}>{d.slice(5)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAFF_LIST.map((staff,si)=>(
              <tr key={staff.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:RC[staff.role]?.fg||C.navyMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0}}>
                      {staff.name.split(" ").filter(w=>!w.startsWith("Dr")).map(w=>w[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div style={{fontSize:12,fontWeight:600,color:C.text}}>{staff.name}</div>
                      <div style={{fontSize:10,color:C.muted,textTransform:"capitalize"}}>{staff.role}</div>
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
                        style={{cursor:"pointer",borderRadius:6,padding:"6px 4px",background:shift?typeColor[shift.type]||C.greenBg:C.bg,border:`1px solid ${C.border}`,minHeight:50,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}
                        onMouseEnter={e=>e.currentTarget.style.opacity="0.8"}
                        onMouseLeave={e=>e.currentTarget.style.opacity="1"}
                      >
                        {shift?(
                          <>
                            <div style={{fontSize:11,fontWeight:700,color:typeFg[shift.type]||C.green}}>{shift.startTime}–{shift.endTime}</div>
                            <div style={{fontSize:9,fontWeight:600,color:typeFg[shift.type]||C.green,textTransform:"uppercase"}}>{shift.type}</div>
                          </>
                        ):(
                          <div style={{fontSize:11,color:C.muted}}>—</div>
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
      <Card style={{padding:"16px 20px"}}>
        <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>Coverage Summary</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:10}}>
          {weekDates.map((date,i)=>{
            const cov=coverage(date);
            return(
              <div key={date} style={{background:C.bg,borderRadius:8,padding:"10px"}}>
                <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:6}}>{dayLabels[i]} {date.slice(5)}</div>
                {Object.entries(cov).length===0&&<div style={{fontSize:11,color:C.muted}}>No coverage</div>}
                {Object.entries(cov).map(([role,cnt])=>(
                  <div key={role} style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:11,color:RC[role]?.fg||C.text,textTransform:"capitalize",fontWeight:600}}>{role}</span>
                    <span style={{fontSize:11,fontWeight:700,color:RC[role]?.fg||C.text}}>{cnt}</span>
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
  const p=PERMS[user.role];
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
  const tabs=[{id:"overview",show:true},{id:"problems",show:true,badge:activeProblemsCount},{id:"vitals",show:p.vitals},{id:"prescriptions",show:showRxTab},{id:"notes",show:showNotesTab},{id:"labs",show:true},{id:"vaccines",show:true},{id:"files",show:true},{id:"recalls",show:p.recalls},{id:"referrals",show:true},{id:"timeline",show:true}].filter(t=>t.show);
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
    w.document.write(`<html><head><title>Patient Summary</title><style>body{font-family:Arial,sans-serif;margin:40px;color:#1A2332}h2{color:#1A3A5C}table{width:100%;border-collapse:collapse;margin-bottom:20px}td,th{padding:8px 12px;border:1px solid #ddd;font-size:13px}th{background:#F0F2F5;font-weight:700}.section{margin-bottom:24px}@media print{body{margin:20px}}</style></head><body>
    <h2>My Medical Clinic — Patient Summary</h2>
    <p style="color:#6B7A8D;font-size:13px">Generated: ${today()} &nbsp;·&nbsp; For referral or internal use only</p>
    <div class="section"><h3>Demographics</h3><table><tr><th>Name</th><td>${patient.first_name} ${patient.last_name}</td><th>DOB</th><td>${patient.dob}</td></tr><tr><th>Phone</th><td>${patient.phone}</td><th>Insurance</th><td>${patient.insurance}</td></tr></table></div>
    <div class="section"><h3>⚠ Allergies</h3><p>${patient.allergies.length?patient.allergies.join(", "):"No known allergies"}</p></div>
    ${vit?`<div class="section"><h3>Most Recent Vitals</h3><table><tr><th>BP</th><td>${vit.bp} mmHg</td><th>HR</th><td>${vit.hr} bpm</td></tr><tr><th>Temp</th><td>${vit.temp} °F</td><th>O₂ Sat</th><td>${vit.o2}%</td></tr><tr><th>Weight</th><td>${vit.weight} lbs</td><th>BMI</th><td>${vit.bmi}</td></tr></table></div>`:""}
    ${rxs.length?`<div class="section"><h3>Active Medications</h3><table><tr><th>Medication</th><th>Dose</th><th>Instructions</th><th>Refills</th></tr>${rxs.map(r=>`<tr><td>${r.med}</td><td>${r.dose}</td><td>${r.sig}</td><td>${r.refills}</td></tr>`).join("")}</table></div>`:""}
    ${recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).length?`<div class="section"><h3>Open Recalls</h3><table><tr><th>Reason</th><th>Due Date</th><th>Urgency</th></tr>${recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).map(r=>`<tr><td>${r.reason}</td><td>${r.due}</td><td>${r.urgency}</td></tr>`).join("")}</table></div>`:""}
    </body></html>`);
    w.document.close();w.focus();setTimeout(()=>w.print(),300);
  };
  return(
    <div style={{padding:"28px 32px"}}>
      {sv&&<VitalsModal patient={patient} onClose={()=>setSv(false)} onSave={(pid,data)=>{setVitals(p=>({...p,[pid]:[...(p[pid]||[]),{id:Date.now(),date:today(),...data,recordedBy:user.name}]}));setSv(false);if(addAudit)addAudit("Edited",patientFullName,"Vitals");}}/>}
      {sr&&<RxModal patient={patient} rx={rxs} onClose={()=>setSr(false)} onSave={(pid,r)=>{setRx(p=>({...p,[pid]:[...(p[pid]||[]),r]}));setSr(false);}}/>}
      {sn&&<NoteModal patient={patient} user={user} draftNotes={draftNotes} setDraftNotes={setDraftNotes} onClose={()=>setSn(false)} onSave={(pid,n)=>{setNotes(p=>({...p,[pid]:[...(p[pid]||[]),n]}));setSn(false);if(addAudit)addAudit("Edited",patientFullName,"Notes");}}/>}
      {sc&&<RecallModal onClose={()=>setSc(false)} onSave={r=>{setRecalls(p=>[...p,r]);setSc(false);}} patients={patients}/>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",padding:0}}>← Back to Patients</button>
        <div style={{display:"flex",gap:8}}>
          <button onClick={printSummary} style={{fontSize:12,fontWeight:600,padding:"6px 14px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.navyMid,cursor:"pointer"}}>⎙ Print Summary</button>
          {p.prescriptions&&rxs.length>0&&<button onClick={printRx} style={{fontSize:12,fontWeight:600,padding:"6px 14px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.navyMid,cursor:"pointer"}}>⎙ Print Rx</button>}
        </div>
      </div>
      <Card style={{padding:"20px 24px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:C.navyMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,flexShrink:0}}>{patient.first_name[0]}{patient.last_name[0]}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
              <h2 style={{margin:0,fontSize:20,fontWeight:700,color:C.text}}>{patient.first_name} {patient.last_name}</h2>
              {patient.dnc&&<span style={{background:C.redBg,color:C.red,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,border:`1px solid #F5B7B1`}}>⛔ DNC</span>}
              <RiskBadge score={computeRisk(patient,rx,vitals,INIT_LABS,appts||[])}/>
            </div>
            <div style={{color:C.muted,fontSize:13,marginTop:2}}>{age(patient.dob)} yrs · {patient.gender==="F"?"Female":"Male"} · DOB {fmt(patient.dob)} · {patient.phone}</div>
            {patient.dnc?(
              <div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:5,padding:"4px 10px",marginTop:6,display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:C.red,fontWeight:700}}>⛔ Do Not Contact</div>
            ):(
              <div style={{fontSize:12,color:C.muted,marginTop:4}}>
                📞 Preferred: <strong>{patient.contactPref||"Call"}</strong> · Best time: <strong>{patient.bestTime||"Morning"}</strong>
              </div>
            )}
          </div>
          <div>
            {patient.allergies.length>0?(<div style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:7,padding:"8px 14px",marginBottom:4}}><div style={{color:C.red,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:2}}>⚠ Allergies</div><div style={{color:C.red,fontSize:12,fontWeight:600}}>{patient.allergies.join(", ")}</div></div>):(<div style={{background:C.greenBg,border:`1px solid ${C.green}`,borderRadius:7,padding:"8px 14px",marginBottom:4}}><div style={{color:C.green,fontSize:12,fontWeight:600}}>✓ No Known Allergies</div></div>)}
            {(p.vitals||user.role==="doctor")&&<button onClick={()=>setAddingAllergy(true)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>+ Add Allergy</button>}
          </div>
          <div style={{textAlign:"right",paddingLeft:16,borderLeft:`1px solid ${C.border}`}}><div style={{fontSize:11,color:C.muted,textTransform:"uppercase",fontWeight:700}}>Insurance</div><div style={{marginTop:3}}><InsuranceBadge insurance={patient.insurance}/></div></div>
        </div>
        {addingAllergy&&(
          <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`,display:"flex",gap:8,alignItems:"center"}}>
            <input value={newAllergy} onChange={e=>setNewAllergy(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addAllergy()} placeholder="e.g. Latex, Penicillin…" style={{...IS,maxWidth:300,marginBottom:0}} autoFocus/>
            <PB onClick={addAllergy} disabled={!newAllergy.trim()}>Add</PB>
            <XB onClick={()=>{setAddingAllergy(false);setNewAllergy("");}}>Cancel</XB>
          </div>
        )}
      </Card>
      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"10px 18px",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?700:400,color:tab===t.id?C.navyMid:C.muted,borderBottom:tab===t.id?`2px solid ${C.navyMid}`:"2px solid transparent",marginBottom:-1,textTransform:"capitalize",display:"flex",alignItems:"center",gap:5}}>
          {t.id}{t.badge>0&&<span style={{background:C.red,color:"#fff",fontSize:10,fontWeight:700,padding:"1px 5px",borderRadius:10}}>{t.badge}</span>}
        </button>)}
      </div>
      {tab==="overview"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {problems.filter(pr=>pr.status==="active").length>0&&(
            <Card style={{padding:"18px 20px",gridColumn:"1 / -1"}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>Active Problems</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {problems.filter(pr=>pr.status==="active").map(pr=>(
                  <div key={pr.id} style={{background:C.redBg,border:`1px solid #F5B7B1`,borderRadius:6,padding:"6px 12px",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontWeight:700,fontSize:13,color:C.red}}>{pr.problem}</span>
                    <span style={{fontSize:11,color:C.muted,fontFamily:"monospace"}}>{pr.icd}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
          <Card style={{padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontWeight:700,fontSize:13,color:C.text}}>Recent Vitals</div>{p.vitals&&<button onClick={()=>setSv(true)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>+ Record</button>}</div>
            {p.vitals?(v?(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>{[["Blood Pressure",v.bp,"mmHg"],["Heart Rate",v.hr,"bpm"],["Temperature",v.temp,"°F"],["O₂ Sat",v.o2,"%"],["Weight",v.weight,"lbs"],["BMI",v.bmi,""]].map(([l,val,u])=><div key={l} style={{background:C.bg,borderRadius:7,padding:"10px 12px"}}><div style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:17,fontWeight:700,color:C.text,marginTop:2}}>{val}<span style={{fontSize:11,color:C.muted,fontWeight:400,marginLeft:2}}>{u}</span></div></div>)}</div>):<div style={{color:C.muted,fontSize:13}}>No vitals yet. <button onClick={()=>setSv(true)} style={{color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Record now</button></div>):<div style={{color:C.muted,fontSize:13,fontStyle:"italic"}}>🔒 Nurses and doctors only.</div>}
          </Card>
          <Card style={{padding:"18px 20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={{fontWeight:700,fontSize:13,color:C.text}}>Active Medications</div>{canWriteRx&&<button onClick={()=>setSr(true)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>+ Prescribe</button>}</div>
            {showRxTab?(rxs.length>0?rxs.map(r=><div key={r.id} style={{padding:"10px 12px",background:C.bg,borderRadius:7,marginBottom:8}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.med} <span style={{color:C.muted,fontWeight:400}}>{r.dose}</span></div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{r.sig} · {r.refills} refills</div></div>):<div style={{color:C.muted,fontSize:13}}>No active medications.</div>):<div style={{color:C.muted,fontSize:13,fontStyle:"italic"}}>🔒 Doctors only.</div>}
          </Card>
          <Card style={{padding:"18px 20px"}}>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>Visit History</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[["Total",totalAppts,C.navyMid],["Completed",completedAppts,C.green],["No-Shows",noShowAppts,C.red],["Cancellations",cancelledAppts,C.amber]].map(([l,v,c])=>(
                <div key={l} style={{background:C.bg,borderRadius:7,padding:"10px 12px"}}><div style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:22,fontWeight:800,color:c,marginTop:2}}>{v}</div></div>
              ))}
            </div>
          </Card>
          <Card style={{padding:"18px 20px",gridColumn:"1 / -1"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:13,color:C.text}}>Contact Preferences</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditContactPref(v=>!v)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>Edit</button>
                <button onClick={()=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,dnc:!patient.dnc}:pt))}
                  style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:5,border:`1px solid ${patient.dnc?C.red:C.border}`,background:patient.dnc?C.redBg:C.surface,color:patient.dnc?C.red:C.muted,cursor:"pointer"}}>
                  {patient.dnc?"Remove DNC Flag":"Enable DNC"}
                </button>
              </div>
            </div>
            {editContactPref?(
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <FF label="Preferred Contact"><select value={patient.contactPref||"Call"} onChange={e=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,contactPref:e.target.value}:pt))} style={{...SS,width:130}}><option>Call</option><option>Text</option><option>Email</option></select></FF>
                <FF label="Best Time"><select value={patient.bestTime||"Morning"} onChange={e=>setPatients(prev=>prev.map(pt=>pt.id===patient.id?{...pt,bestTime:e.target.value}:pt))} style={{...SS,width:130}}><option>Morning</option><option>Afternoon</option><option>Either</option></select></FF>
                <button onClick={()=>setEditContactPref(false)} style={{alignSelf:"flex-end",marginBottom:0,fontSize:12,fontWeight:600,background:C.navyMid,color:"#fff",border:"none",borderRadius:6,padding:"7px 14px",cursor:"pointer"}}>Done</button>
              </div>
            ):(
              <div style={{fontSize:13,color:C.text}}>
                {patient.dnc?<span style={{color:C.red,fontWeight:700}}>⛔ Do Not Contact — all outreach blocked</span>:<span>Preferred: <strong>{patient.contactPref||"Call"}</strong> · Best time: <strong>{patient.bestTime||"Morning"}</strong></span>}
              </div>
            )}
          </Card>
          <CareGapsPanel patient={patient} rx={rx} labs={INIT_LABS} vaccines={vaccines}/>
        </div>
      )}
      {tab==="problems"&&(()=>{
        const canWriteProblems=p.prescriptions||user.role==="doctor"||user.role==="admin";
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
              <div style={{fontWeight:700,fontSize:14,color:C.text}}>Problem List</div>
              {canWriteProblems&&<button onClick={()=>setShowAddProblem(v=>!v)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add Problem</button>}
            </div>
            {showAddProblem&&(
              <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"16px",marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>New Problem</div>
                <FR><FF label="Problem Name *"><input value={newProb.problem} onChange={e=>setNewProb(f=>({...f,problem:e.target.value}))} style={IS} placeholder="e.g. Essential Hypertension"/></FF><FF label="ICD-10 Code"><input value={newProb.icd} onChange={e=>setNewProb(f=>({...f,icd:e.target.value}))} style={IS} placeholder="e.g. I10"/></FF></FR>
                <FR><FF label="Status"><select value={newProb.status} onChange={e=>setNewProb(f=>({...f,status:e.target.value}))} style={SS}><option value="active">Active</option><option value="inactive">Inactive</option><option value="resolved">Resolved</option></select></FF><FF label="Onset Date"><input type="date" value={newProb.onset} onChange={e=>setNewProb(f=>({...f,onset:e.target.value}))} style={IS}/></FF></FR>
                <FR cols={1}><FF label="Notes"><input value={newProb.notes} onChange={e=>setNewProb(f=>({...f,notes:e.target.value}))} style={IS} placeholder="Additional notes…"/></FF></FR>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowAddProblem(false)}>Cancel</XB><PB onClick={saveNewProblem} disabled={!newProb.problem}>Add Problem</PB></div>
              </div>
            )}
            {problems.length===0?<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>No problems on record.</div>:(
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr style={{background:C.bg}}>{["Problem","ICD-10","Status","Onset","Notes","Actions"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                <tbody>
                  {problems.map((pr,i)=>(
                    editingProblemId===pr.id?(
                      <tr key={pr.id} style={{borderBottom:`1px solid ${C.border}`,background:C.blueBg}}>
                        <td style={{padding:"10px 14px"}}><input defaultValue={editProb.problem??pr.problem} onChange={e=>setEditProb(f=>({...f,problem:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 14px"}}><input defaultValue={editProb.icd??pr.icd} onChange={e=>setEditProb(f=>({...f,icd:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 14px"}}><select defaultValue={editProb.status??pr.status} onChange={e=>setEditProb(f=>({...f,status:e.target.value}))} style={{...SS,fontSize:12}}><option value="active">Active</option><option value="inactive">Inactive</option><option value="resolved">Resolved</option></select></td>
                        <td style={{padding:"10px 14px"}}><input type="date" defaultValue={editProb.onset??pr.onset} onChange={e=>setEditProb(f=>({...f,onset:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 14px"}}><input defaultValue={editProb.notes??pr.notes} onChange={e=>setEditProb(f=>({...f,notes:e.target.value}))} style={{...IS,fontSize:12}}/></td>
                        <td style={{padding:"10px 14px"}}><div style={{display:"flex",gap:6}}><button onClick={()=>saveEditProblem(pr.id)} style={{fontSize:11,fontWeight:700,padding:"4px 8px",borderRadius:5,border:"none",background:C.green,color:"#fff",cursor:"pointer"}}>Save</button><button onClick={()=>setEditingProblemId(null)} style={{fontSize:11,fontWeight:600,padding:"4px 8px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,cursor:"pointer"}}>Cancel</button></div></td>
                      </tr>
                    ):(
                      <tr key={pr.id} style={{borderBottom:i<problems.length-1?`1px solid ${C.border}`:"none"}}>
                        <td style={{padding:"12px 14px",fontWeight:600,fontSize:13,color:C.text}}>{pr.problem}</td>
                        <td style={{padding:"12px 14px",fontSize:12,color:C.muted,fontFamily:"monospace"}}>{pr.icd}</td>
                        <td style={{padding:"12px 14px"}}><Badge color={pr.status==="active"?"red":pr.status==="resolved"?"green":"amber"}>{pr.status}</Badge></td>
                        <td style={{padding:"12px 14px",fontSize:12,color:C.muted}}>{pr.onset?fmt(pr.onset):"—"}</td>
                        <td style={{padding:"12px 14px",fontSize:12,color:C.muted,maxWidth:200}}>{pr.notes||"—"}</td>
                        <td style={{padding:"12px 14px"}}>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {canWriteProblems&&<button onClick={()=>{setEditingProblemId(pr.id);setEditProb({});}} style={{fontSize:11,fontWeight:600,padding:"4px 8px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.navyMid,cursor:"pointer"}}>Edit</button>}
                            {canWriteProblems&&pr.status==="active"&&<button onClick={()=>resolveProblem(pr.id)} style={{fontSize:11,fontWeight:600,padding:"4px 8px",borderRadius:5,border:`1px solid ${C.border}`,background:C.greenBg,color:C.green,cursor:"pointer"}}>Resolve</button>}
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
            <div style={{fontWeight:700,fontSize:14,color:C.text}}>Prescriptions</div>
            {!canWriteRx&&<Badge color="blue">Read Only</Badge>}
            <button onClick={()=>setShowInactiveRx(v=>!v)} style={{fontSize:11,color:C.muted,fontWeight:600,background:C.bg,border:`1px solid ${C.border}`,borderRadius:5,padding:"3px 9px",cursor:"pointer"}}>{showInactiveRx?"Hide History":"Show History"}</button>
          </div>
          {canWriteRx&&<button onClick={()=>setSr(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ New Prescription</button>}
        </div>
        {rxs.length>0||showInactiveRx?(<table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>{["Medication","Dose","Instructions","Refills","Date","Status",""].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>
            {rxs.map((r)=>{
              const histOpen=expandedRxHistory.has(r.id);
              const hist=rxHistory[r.id]||[];
              return(
                <React.Fragment key={r.id}>
                  <tr style={{borderBottom:histOpen?"none":`1px solid ${C.border}`}}>
                    <td style={{padding:"12px 14px",fontWeight:700,color:C.text}}>{r.med}</td>
                    <td style={{padding:"12px 14px",color:C.muted}}>{r.dose}</td>
                    <td style={{padding:"12px 14px",color:C.muted}}>{r.sig}</td>
                    <td style={{padding:"12px 14px",color:C.muted}}>{r.refills}</td>
                    <td style={{padding:"12px 14px",color:C.muted}}>{r.date?fmt(r.date):"—"}</td>
                    <td style={{padding:"12px 14px"}}><Badge color="green">Active</Badge></td>
                    <td style={{padding:"12px 14px"}}>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {p.refills&&setRefillRequests&&<button onClick={()=>setRefillRequests(prev=>[...prev,{id:Date.now(),patientId:patient.id,patient:`${patient.first_name} ${patient.last_name}`,medication:`${r.med} ${r.dose}`,requestedBy:user.role,requestedByName:user.name,date:today(),status:"pending",approvedBy:null,note:""}])} style={{fontSize:11,fontWeight:600,padding:"4px 8px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.navyMid,cursor:"pointer"}}>Request Refill</button>}
                        <button onClick={()=>setExpandedRxHistory(prev=>{const s=new Set(prev);s.has(r.id)?s.delete(r.id):s.add(r.id);return s;})} style={{fontSize:11,fontWeight:600,padding:"4px 8px",borderRadius:5,border:`1px solid ${C.border}`,background:histOpen?C.blueBg:C.surface,color:histOpen?C.blue:C.muted,cursor:"pointer"}}>History {histOpen?"▲":"▼"}</button>
                      </div>
                    </td>
                  </tr>
                  {histOpen&&(
                    <tr>
                      <td colSpan={7} style={{padding:"0 14px 14px",borderBottom:`1px solid ${C.border}`}}>
                        <div style={{background:C.bg,borderRadius:8,padding:"14px 16px",border:`1px solid ${C.border}`}}>
                          <div style={{fontWeight:700,fontSize:12,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Refill History — {r.med}</div>
                          {hist.length===0?<div style={{fontSize:13,color:C.muted}}>No history recorded.</div>:(
                            <div style={{position:"relative",paddingLeft:24}}>
                              <div style={{position:"absolute",left:8,top:0,bottom:0,width:2,background:C.border}}/>
                              {hist.map((h,hi)=>{
                                const dotColor=h.action==="Prescribed"?C.green:h.action==="Refilled"?C.blue:C.amber;
                                return(
                                  <div key={h.id} style={{position:"relative",marginBottom:14,display:"flex",gap:12,alignItems:"flex-start"}}>
                                    <div style={{position:"absolute",left:-20,top:3,width:12,height:12,borderRadius:"50%",background:dotColor,border:"2px solid #fff",flexShrink:0}}/>
                                    <div style={{flex:1}}>
                                      <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:2}}>
                                        <span style={{fontSize:11,color:C.muted}}>{fmt(h.date)}</span>
                                        <Badge color={h.action==="Prescribed"?"green":h.action==="Refilled"?"blue":"amber"}>{h.action}</Badge>
                                        <span style={{fontSize:12,color:C.muted}}>by {h.by}</span>
                                      </div>
                                      {h.note&&<div style={{fontSize:12,color:C.text}}>{h.note}</div>}
                                      <div style={{fontSize:11,color:C.muted}}>Qty: {h.qty} · {h.daysSupply} days supply</div>
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
            {showInactiveRx&&inactiveRxs.map((r)=><tr key={r.id} style={{borderBottom:`1px solid ${C.border}`,opacity:0.6}}><td style={{padding:"12px 14px",fontWeight:700,color:C.text}}>{r.med}</td><td style={{padding:"12px 14px",color:C.muted}}>{r.dose}</td><td style={{padding:"12px 14px",color:C.muted}}>{r.sig}</td><td style={{padding:"12px 14px",color:C.muted}}>{r.refills}</td><td style={{padding:"12px 14px",color:C.muted}}>{r.date?fmt(r.date):"—"}</td><td style={{padding:"12px 14px"}}><Badge color="red">Inactive</Badge></td><td/></tr>)}
          </tbody>
        </table>):<div style={{color:C.muted,fontSize:13}}>No prescriptions on file.</div>}
      </Card>)}
      {tab==="labs"&&(()=>{
        const canOrderLabs=p.prescriptions||user.role==="doctor"||user.role==="admin";
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
              <div style={{fontWeight:700,fontSize:14,color:C.text}}>Lab Results</div>
              {canOrderLabs&&<button onClick={()=>setShowOrderForm(v=>!v)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Order Lab</button>}
            </div>
            {showOrderForm&&(
              <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px",marginBottom:16}}>
                <FR><FF label="Lab Name *"><input value={orderForm.name} onChange={e=>setOrderForm(f=>({...f,name:e.target.value}))} style={IS} placeholder="e.g. Complete Blood Count"/></FF><FF label="Ordered By"><input value={orderForm.orderedBy} onChange={e=>setOrderForm(f=>({...f,orderedBy:e.target.value}))} style={IS}/></FF></FR>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><XB onClick={()=>setShowOrderForm(false)}>Cancel</XB><PB onClick={submitOrder} disabled={!orderForm.name}>Place Order</PB></div>
              </div>
            )}
            {pendingLabs.length>0&&(
              <div style={{marginBottom:16}}>
                <div style={{fontWeight:700,fontSize:13,color:C.amber,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:C.amber,display:"inline-block"}}/>Pending Orders ({pendingLabs.length})
                </div>
                {pendingLabs.map((lab)=>(
                  <div key={lab.id} style={{background:C.amberBg,border:`1px solid ${C.amber}30`,borderRadius:8,padding:"12px 16px",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:600,fontSize:13,color:C.text}}>{lab.name}</div>
                        <div style={{fontSize:12,color:C.muted,marginTop:2}}>Ordered {fmt(lab.date)} by {lab.orderedBy||"—"}</div>
                      </div>
                      <Badge color="amber">Pending</Badge>
                      {canOrderLabs&&<button onClick={()=>{setEnterResultsId(lab.id===enterResultsId?null:lab.id);setResultRows([{name:"",value:"",unit:"",low:"",high:""}]);}} style={{fontSize:11,fontWeight:700,padding:"5px 10px",borderRadius:5,border:`1px solid ${C.navyMid}`,background:C.blueBg,color:C.navyMid,cursor:"pointer"}}>Enter Results</button>}
                    </div>
                    {enterResultsId===lab.id&&(
                      <div style={{marginTop:14,background:C.surface,borderRadius:8,padding:"14px",border:`1px solid ${C.border}`}}>
                        <div style={{fontWeight:700,fontSize:12,color:C.muted,textTransform:"uppercase",marginBottom:10}}>Enter Test Values</div>
                        {resultRows.map((row,ri)=>(
                          <div key={ri} style={{display:"grid",gridTemplateColumns:"1fr 80px 80px 70px 70px auto",gap:8,marginBottom:8,alignItems:"center"}}>
                            <input value={row.name} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,name:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Test name"/>
                            <input value={row.value} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,value:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Value" type="number"/>
                            <input value={row.unit} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,unit:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Unit"/>
                            <input value={row.low} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,low:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="Low" type="number"/>
                            <input value={row.high} onChange={e=>setResultRows(prev=>prev.map((r,j)=>j===ri?{...r,high:e.target.value}:r))} style={{...IS,fontSize:12}} placeholder="High" type="number"/>
                            <button onClick={()=>setResultRows(prev=>prev.filter((_,j)=>j!==ri))} style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:16,padding:"2px 4px"}}>×</button>
                          </div>
                        ))}
                        <div style={{display:"flex",gap:8,marginTop:6}}>
                          <button onClick={()=>setResultRows(prev=>[...prev,{name:"",value:"",unit:"",low:"",high:""}])} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>+ Add Row</button>
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
                {pendingLabs.length>0&&<div style={{fontWeight:700,fontSize:13,color:C.green,marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:C.green,display:"inline-block"}}/>Resulted ({resultedLabs.length})
                </div>}
                {resultedLabs.map((lab,i)=>{
                  const isExp=expandedLab===lab.id;
                  return(
                    <div key={lab.id} style={{borderBottom:i<resultedLabs.length-1?`1px solid ${C.border}`:"none"}}>
                      <div onClick={()=>setExpandedLab(isExp?null:lab.id)} style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:600,fontSize:13,color:C.text}}>{lab.name}</div>
                          <div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmt(lab.date)}{lab.orderedBy&&<span> · {lab.orderedBy}</span>}</div>
                        </div>
                        <Badge color="green">Resulted</Badge>
                        {lab.abnormal?<Badge color="red">Abnormal</Badge>:<span style={{fontSize:12,color:C.muted}}>Normal</span>}
                        <span style={{color:C.muted,fontSize:12}}>{isExp?"▲":"▼"}</span>
                      </div>
                      {isExp&&lab.values&&lab.values.length>0&&(
                        <div style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:"12px 14px"}}>
                          <table style={{width:"100%",borderCollapse:"collapse"}}>
                            <thead><tr style={{background:C.surface}}>{["Test","Value","Unit","Reference Range","Flag"].map(h=><th key={h} style={{padding:"7px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                            <tbody>{lab.values.map((val,vi)=>{
                              const isHigh=val.value>val.high;
                              const isLow=val.value<val.low;
                              const isAbnormal=isHigh||isLow;
                              return(
                                <tr key={vi} style={{background:isAbnormal?C.redBg:"transparent",borderBottom:vi<lab.values.length-1?`1px solid ${C.border}`:"none"}}>
                                  <td style={{padding:"8px 12px",fontWeight:600,fontSize:13,color:C.text}}>{val.name}</td>
                                  <td style={{padding:"8px 12px",fontSize:13,fontWeight:700,color:isAbnormal?C.red:C.text}}>{val.value}</td>
                                  <td style={{padding:"8px 12px",fontSize:12,color:C.muted}}>{val.unit}</td>
                                  <td style={{padding:"8px 12px",fontSize:12,color:C.muted}}>{val.low} – {val.high===999?"No upper limit":val.high}</td>
                                  <td style={{padding:"8px 12px"}}>{isHigh?<Badge color="red">↑ HIGH</Badge>:isLow?<Badge color="red">↓ LOW</Badge>:<span style={{fontSize:12,color:C.muted}}>Normal</span>}</td>
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
            {labResults.length===0&&<div style={{border:`2px dashed ${C.border}`,borderRadius:10,padding:"40px 20px",textAlign:"center",color:C.muted,fontSize:13}}><div style={{fontSize:28,marginBottom:8}}>🧪</div>No lab results on file.</div>}
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
            parts.push(<mark key={pos} style={{background:C.amberBg,color:C.text,borderRadius:2,padding:"0 1px"}}>{t.slice(i,i+term.length)}</mark>);
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontWeight:700,fontSize:14,color:C.text}}>Visit Notes</div>
              {!canWriteNotes&&<Badge color="blue">Read Only</Badge>}
            </div>
            {canWriteNotes&&<button onClick={()=>setSn(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ New Note</button>}
          </div>
          <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"12px 14px",marginBottom:14}}>
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
                  <div style={{fontWeight:700,fontSize:13,color:C.text}}>{hl(n.chief,noteSearch)}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>{fmt(n.date)} · {hl(n.doctor,noteSearch)}</div>
                </div>
                {n.signed?<Badge color="green">Signed</Badge>:<Badge color="amber">Draft</Badge>}
              </div>
              {n.assessment&&<div style={{marginBottom:8}}><div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Assessment</div><div style={{fontSize:13,color:C.text}}>{hl(n.assessment,noteSearch)}</div></div>}
              {n.plan&&<div><div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Plan</div><div style={{fontSize:13,color:C.text}}>{hl(n.plan,noteSearch)}</div></div>}
            </div>
          )):<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>{ptN.length===0?"No visit notes yet.":"No notes match your filters."}</div>}
        </Card>);
      })()}
      {tab==="files"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text}}>Documents</div>
          <label style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",display:"inline-block"}}>
            + Upload
            <input type="file" style={{display:"none"}} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.xls,.xlsx"/>
          </label>
        </div>
        {patFiles.length>0?(<table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>{["File Name","Type","Date","Size",""].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{patFiles.map((f,i)=>(
            <tr key={f.id} style={{borderBottom:i<patFiles.length-1?`1px solid ${C.border}`:"none"}}>
              <td style={{padding:"12px 14px",fontWeight:600,color:C.text}}>📄 {f.name}</td>
              <td style={{padding:"12px 14px"}}><Badge color="blue">{f.type}</Badge></td>
              <td style={{padding:"12px 14px",color:C.muted}}>{fmt(f.date)}</td>
              <td style={{padding:"12px 14px",color:C.muted}}>{f.size}</td>
              <td style={{padding:"12px 14px",textAlign:"right"}}><button onClick={()=>setPatFiles(prev=>prev.filter(x=>x.id!==f.id))} style={{fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.red,cursor:"pointer"}}>Remove</button></td>
            </tr>
          ))}</tbody>
        </table>):(
          <label style={{border:`2px dashed ${C.border}`,borderRadius:10,padding:"40px 20px",textAlign:"center",color:C.muted,fontSize:13,cursor:"pointer",display:"block"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.navyMid} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{fontSize:28,marginBottom:8}}>📁</div>
            <div>No files yet — click to upload</div>
            <input type="file" style={{display:"none"}} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx,.xls,.xlsx"/>
          </label>
        )}
      </Card>)}
      {tab==="recalls"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Recall Flags</div><button onClick={()=>setSc(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add Recall</button></div>
        {recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).length>0?recalls.filter(r=>r.patient===`${patient.first_name} ${patient.last_name}`).map((r,i,arr)=><div key={r.id} style={{padding:"12px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",display:"flex",alignItems:"center",gap:12}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.reason}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>Due {fmt(r.due)}</div></div><Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge></div>):<div style={{color:C.muted,fontSize:13}}>No recall flags for this patient.</div>}
      </Card>)}
      {tab==="vaccines"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text}}>Immunization Records</div>
          <button onClick={()=>setShowVaccineForm(v=>!v)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add Vaccine</button>
        </div>
        {showVaccineForm&&(
          <div style={{background:C.bg,borderRadius:8,padding:"16px",marginBottom:16,border:`1px solid ${C.border}`}}>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>New Vaccine Record</div>
            <FR><FF label="Vaccine Name"><input value={vaccineForm.vaccine} onChange={e=>setVaccineForm(f=>({...f,vaccine:e.target.value}))} style={IS} placeholder="e.g. Influenza"/></FF><FF label="Date Administered"><input type="date" value={vaccineForm.date} onChange={e=>setVaccineForm(f=>({...f,date:e.target.value}))} style={IS}/></FF></FR>
            <FR><FF label="Given By"><input value={vaccineForm.given_by} onChange={e=>setVaccineForm(f=>({...f,given_by:e.target.value}))} style={IS}/></FF><FF label="Lot Number"><input value={vaccineForm.lot} onChange={e=>setVaccineForm(f=>({...f,lot:e.target.value}))} style={IS}/></FF></FR>
            <FR cols={1}><FF label="Next Due (optional)"><input type="date" value={vaccineForm.next_due} onChange={e=>setVaccineForm(f=>({...f,next_due:e.target.value}))} style={IS}/></FF></FR>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <XB onClick={()=>setShowVaccineForm(false)}>Cancel</XB>
              <PB onClick={()=>{if(!vaccineForm.vaccine)return;setVaccines(prev=>[...prev,{...vaccineForm,id:Date.now()}]);setVaccineForm({vaccine:"",date:today(),given_by:user.name,lot:"",next_due:""});setShowVaccineForm(false);}}>Save</PB>
            </div>
          </div>
        )}
        {vaccines.length>0?(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg}}>{["Vaccine","Date","Given By","Lot #","Next Due"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{vaccines.map((v,i)=>{
              const dueColor=!v.next_due?null:(v.next_due<today()?C.red:((new Date(v.next_due)-new Date())<90*86400000?C.amber:C.green));
              return(
                <tr key={v.id} style={{borderBottom:i<vaccines.length-1?`1px solid ${C.border}`:"none"}}>
                  <td style={{padding:"12px 14px",fontWeight:600,color:C.text}}>{v.vaccine}</td>
                  <td style={{padding:"12px 14px",color:C.muted}}>{fmt(v.date)}</td>
                  <td style={{padding:"12px 14px",color:C.muted}}>{v.given_by}</td>
                  <td style={{padding:"12px 14px",color:C.muted,fontFamily:"monospace",fontSize:12}}>{v.lot||"—"}</td>
                  <td style={{padding:"12px 14px"}}>
                    {v.next_due?<span style={{color:dueColor,fontWeight:600,fontSize:13}}>{fmt(v.next_due)}</span>:<span style={{color:C.muted,fontSize:12}}>—</span>}
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        ):<div style={{color:C.muted,fontSize:13,textAlign:"center",padding:"24px"}}>No vaccine records on file.</div>}
      </Card>)}
      {tab==="referrals"&&(<Card style={{padding:"20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text}}>Referrals</div>
          <button onClick={()=>setShowReferralForm(v=>!v)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ New Referral</button>
        </div>
        {showReferralForm&&(
          <div style={{background:C.bg,borderRadius:8,padding:"16px",marginBottom:16,border:`1px solid ${C.border}`}}>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:12}}>New Referral</div>
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
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg}}>{["Specialist","Facility","Reason","Sent Date","Status","Notes"].map(h=><th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{referrals.map((r,i)=>(
              <tr key={r.id} style={{borderBottom:i<referrals.length-1?`1px solid ${C.border}`:"none"}}>
                <td style={{padding:"12px 14px",fontWeight:600,color:C.text}}>{r.specialist}</td>
                <td style={{padding:"12px 14px",color:C.muted,fontSize:12}}>{r.facility}</td>
                <td style={{padding:"12px 14px",color:C.muted,fontSize:12}}>{r.reason}</td>
                <td style={{padding:"12px 14px",color:C.muted,fontSize:12}}>{fmt(r.sentDate)}</td>
                <td style={{padding:"12px 14px"}}>
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
                <td style={{padding:"12px 14px",color:C.muted,fontSize:12,maxWidth:160}}>{editingReferral===r.id?(
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
          <Card style={{padding:"40px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>📋</div><div style={{color:C.muted,fontSize:13}}>No history recorded for this patient.</div></Card>
        );
        // Group by month
        const groups={};
        allEvents.forEach(ev=>{
          const [y,m]=ev.date.split("-");
          const key=`${y}-${m}`;
          if(!groups[key])groups[key]=[];
          groups[key].push(ev);
        });
        const typeIcon={appointment:"🗓",note:"📋",vitals:"📊"};
        const typeColor={appointment:C.blue,note:C.green,vitals:C.purple};
        const MONTH_NAMES=["January","February","March","April","May","June","July","August","September","October","November","December"];
        return(
          <Card style={{padding:"20px"}}>
            <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:20}}>Patient History Timeline</div>
            {Object.entries(groups).sort((a,b)=>b[0].localeCompare(a[0])).map(([key,evts])=>{
              const [y,m]=key.split("-");
              const monthLabel=`${MONTH_NAMES[parseInt(m)-1]} ${y}`;
              return(
                <div key={key}>
                  <div style={{display:"flex",alignItems:"center",gap:12,margin:"16px 0 12px"}}>
                    <div style={{flex:1,height:1,background:C.border}}/>
                    <div style={{fontSize:11,fontWeight:700,color:C.muted,whiteSpace:"nowrap"}}>{monthLabel}</div>
                    <div style={{flex:1,height:1,background:C.border}}/>
                  </div>
                  <div style={{position:"relative",paddingLeft:32}}>
                    <div style={{position:"absolute",left:11,top:0,bottom:0,width:2,background:C.border}}/>
                    {evts.map(ev=>{
                      const dotCol=typeColor[ev.type]||C.blue;
                      return(
                        <div key={ev.id} style={{position:"relative",marginBottom:16,display:"flex",gap:14,alignItems:"flex-start"}}>
                          <div style={{position:"absolute",left:-21,top:2,width:22,height:22,borderRadius:"50%",background:dotCol+"20",border:`2px solid ${dotCol}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{typeIcon[ev.type]}</div>
                          <div style={{flex:1,background:C.bg,borderRadius:8,padding:"10px 14px",border:`1px solid ${C.border}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                              <div style={{fontWeight:700,fontSize:13,color:C.text,textTransform:"capitalize"}}>{ev.title}</div>
                              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                                <span style={{fontSize:11,color:C.muted,whiteSpace:"nowrap"}}>{fmt(ev.date)}</span>
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
  if(sel)return<PatientProfile patient={sel} onBack={()=>setSel(null)} user={user} vitals={vitals} setVitals={setVitals} rx={rx} setRx={setRx} notes={notes} setNotes={setNotes} recalls={recalls} setRecalls={setRecalls} patients={patients} setPatients={setPatients} draftNotes={draftNotes||{}} setDraftNotes={setDraftNotes} refillRequests={refillRequests} setRefillRequests={setRefillRequests} onOpenPatient={onOpenPatient} appts={appts} addAudit={addAudit}/>;
  return(
    <div style={{padding:"28px 32px",maxWidth:1100}}>
      {showNew&&<NewPatientModal onClose={()=>setShowNew(false)} onSave={p=>{setPatients(prev=>[...prev,p]);setShowNew(false);}}/>}
      {quickNewAppt&&<NewApptModal onClose={()=>setQuickNewAppt(null)} onSave={a=>{setAppts(p=>[...p,a]);setQuickNewAppt(null);}} patients={patients} appts={appts} defaultDate="2026-02-25"/>}
      {quickRecall&&<RecallModal onClose={()=>setQuickRecall(null)} onSave={r=>{setRecalls(p=>[...p,r]);setQuickRecall(null);}} patients={patients}/>}
      {quickVitals&&<VitalsModal patient={quickVitals} onClose={()=>setQuickVitals(null)} onSave={(pid,data)=>{setVitals(p=>({...p,[pid]:[...(p[pid]||[]),{id:Date.now(),date:today(),...data,recordedBy:user.name}]}));setQuickVitals(null);}}/>}
      {loading&&<div>{[...Array(5)].map((_,i)=><div key={i} style={{background:"#E8ECF0",borderRadius:8,height:44,marginBottom:8,animation:"pulse 1.2s ease infinite"}}/>)}</div>}
      {!loading&&<>
      <div style={{marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Patients</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>{patients.length} total · {patients.filter(p=>p.active!==false).length} active</p></div>
        <div style={{display:"flex",gap:8}}>
          {PERMS[user.role].refills&&!PERMS[user.role].refillApprove&&setPage&&<button onClick={()=>setPage("refills")} style={{background:C.surface,color:C.navyMid,border:`1px solid ${C.border}`,borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>♻ Refill Queue</button>}
          {(user.role==="receptionist"||user.role==="admin")&&<button onClick={()=>setShowNew(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ New Patient</button>}
        </div>
      </div>
      {/* ── Filter / Sort bar ── */}
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, phone, insurance…" style={{...IS,flex:"1 1 180px",padding:"7px 12px",fontSize:13,marginBottom:0}}/>
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{...SS,flex:"0 0 110px",padding:"7px 10px",fontSize:12}}>
          <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
        </select>
        <select value={filterIns} onChange={e=>setFilterIns(e.target.value)} style={{...SS,flex:"0 0 130px",padding:"7px 10px",fontSize:12}}>
          {allInsurances.map(ins=><option key={ins} value={ins}>{ins==="all"?"All Insurance":ins}</option>)}
        </select>
        <select value={filterRisk} onChange={e=>setFilterRisk(e.target.value)} style={{...SS,flex:"0 0 130px",padding:"7px 10px",fontSize:12}}>
          <option value="all">All Risk</option><option value="high">High Risk</option><option value="medium">Medium Risk</option><option value="low">Low Risk</option>
        </select>
        <select value={filterDoc} onChange={e=>setFilterDoc(e.target.value)} style={{...SS,flex:"0 0 140px",padding:"7px 10px",fontSize:12}}>
          {allDoctors.map(d=><option key={d} value={d}>{d==="all"?"All Doctors":d}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...SS,flex:"0 0 160px",padding:"7px 10px",fontSize:12}}>
          <option value="name-az">Name (A–Z)</option>
          <option value="name-za">Name (Z–A)</option>
          <option value="visit-new">Last Visit (newest)</option>
          <option value="visit-old">Last Visit (oldest)</option>
          <option value="risk">Risk (highest first)</option>
        </select>
        {hasFilters&&<button onClick={clearFilters} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"6px 12px",fontSize:12,color:C.muted,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>✕ Clear</button>}
      </div>
      <div style={{fontSize:12,color:C.muted,marginBottom:10}}>Showing <strong>{filt.length}</strong> of <strong>{patients.length}</strong> patients</div>
      <Card>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.bg}}>{["Patient","Status","DOB / Age","Phone","Insurance","Next Appt","Allergies",""].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
          <tbody>{filt.map((p,i)=>{
            const next=nextAppt(p.id);
            const isOpen=quickMenu===p.id;
            return(
              <tr key={p.id} onClick={()=>setSel(p)} style={{borderBottom:i<filt.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",opacity:p.active===false?0.6:1}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"13px 16px"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:30,height:30,borderRadius:"50%",background:p.active===false?"#CBD5E1":C.navyMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{p.first_name[0]}{p.last_name[0]}</div><div><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{p.first_name} {p.last_name}</div><RiskBadge score={computeRisk(p,rx,vitals,INIT_LABS,appts||[])}/></div>{p.dnc&&<span style={{background:C.redBg,color:C.red,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:3}}>DNC</span>}</div></div></td>
                <td style={{padding:"13px 16px"}}><Badge color={p.active===false?"red":"green"}>{p.active===false?"Inactive":"Active"}</Badge></td>
                <td style={{padding:"13px 16px",fontSize:13,color:C.muted}}>{fmt(p.dob)} · {age(p.dob)} yrs</td>
                <td style={{padding:"13px 16px",fontSize:13,color:C.muted}}>{p.phone}</td>
                <td style={{padding:"13px 16px"}}><InsuranceBadge insurance={p.insurance}/></td>
                <td style={{padding:"13px 16px",fontSize:13,color:next?C.navyMid:C.muted}}>{next?`${next.date} ${next.time}`:"—"}</td>
                <td style={{padding:"13px 16px"}}>{p.allergies.length>0?<Badge color="red">{p.allergies.length} allerg{p.allergies.length>1?"ies":"y"}</Badge>:<span style={{fontSize:12,color:C.muted}}>None</span>}</td>
                <td style={{padding:"13px 16px"}} onClick={e=>e.stopPropagation()}>
                  <div style={{position:"relative"}}>
                    <button onClick={e=>{e.stopPropagation();setQuickMenu(isOpen?null:p.id);}} style={{fontSize:11,fontWeight:600,padding:"5px 10px",borderRadius:5,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,cursor:"pointer"}}>Actions ▾</button>
                    {isOpen&&(
                      <div style={{position:"absolute",right:0,top:"100%",marginTop:4,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",zIndex:50,minWidth:160}}>
                        {[
                          ["Book Appointment",()=>{setQuickMenu(null);setQuickNewAppt(p);}],
                          ["Add Recall",()=>{setQuickMenu(null);setQuickRecall(p);}],
                          ...(PERMS[user.role].vitals?[["Record Vitals",()=>{setQuickMenu(null);setQuickVitals(p);}]]:[]),
                          ["Open Profile",()=>{setQuickMenu(null);setSel(p);}],
                        ].map(([lbl,fn])=>(
                          <button key={lbl} onClick={fn} style={{display:"block",width:"100%",textAlign:"left",padding:"9px 14px",border:"none",background:"transparent",fontSize:13,color:C.text,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{lbl}</button>
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
            <div style={{fontSize:28,marginBottom:10}}>🔍</div>
            <div style={{fontWeight:600,fontSize:14,marginBottom:4}}>No patients match your filters</div>
            <button onClick={clearFilters} style={{fontSize:12,color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Clear filters</button>
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
    <div style={{padding:"28px 32px",maxWidth:900}}>
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
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
          <div style={{background:C.surface,borderRadius:14,width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",overflow:"hidden"}}>
            <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                <span style={{fontSize:22}}>✅</span>
                <div style={{fontWeight:700,fontSize:16,color:C.text}}>Recall Complete</div>
              </div>
              <div style={{fontSize:13,color:C.muted}}>Would you like to book a follow-up appointment?</div>
            </div>
            <div style={{padding:"18px 24px"}}>
              <div style={{background:C.bg,borderRadius:8,padding:"12px 14px",marginBottom:16}}>
                <div style={{display:"flex",gap:16}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Patient</div>
                    <div style={{fontSize:13,fontWeight:600,color:C.text}}>{pendingRecallAppt.patient}</div>
                  </div>
                  {pendingRecallAppt.doctor&&(
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Doctor</div>
                      <div style={{fontSize:13,fontWeight:600,color:C.text}}>{pendingRecallAppt.doctor}</div>
                    </div>
                  )}
                </div>
                <div style={{marginTop:10}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:3}}>Recall Reason</div>
                  <div style={{fontSize:13,color:C.text}}>{pendingRecallAppt.reason}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                <XB onClick={()=>setPendingRecallAppt(null)}>Skip</XB>
                <PB onClick={()=>setShowBookAppt(true)}>📅 Book Appointment</PB>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Recall & Follow-Up</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>{recalls.length} open recall{recalls.length!==1?"s":""}</p></div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          {checked.size>0&&<button onClick={()=>{done([...checked]);setChecked(new Set());}} style={{background:C.green,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Complete {checked.size} selected</button>}
          <button onClick={()=>setShowNew(true)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ Add Recall</button>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",gap:8}}>
          {[["all","All","blue"],["high","Overdue","red"],["medium","This Week","amber"],["low","Upcoming","green"]].map(([id,lbl,col])=>{
            const cnt=id==="all"?recalls.length:recalls.filter(r=>r.urgency===id).length;const a=filter===id;
            const fg={blue:C.navyMid,red:C.red,amber:C.amber,green:C.green}[col];
            const bg={blue:C.blueBg,red:C.redBg,amber:C.amberBg,green:C.greenBg}[col];
            return<button key={id} onClick={()=>setFilter(id)} style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${a?fg:C.border}`,background:a?bg:C.surface,color:a?fg:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>{lbl}{cnt>0&&<span style={{marginLeft:5,background:a?fg:C.border,color:a?"#fff":C.muted,padding:"0 5px",borderRadius:8,fontSize:10}}>{cnt}</span>}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:C.muted,fontWeight:600}}>Doctor:</span>
          <select value={sortDoc} onChange={e=>setSortDoc(e.target.value)} style={{...SS,width:"auto",padding:"6px 10px",fontSize:12}}>
            {DOCTORS.map(d=><option key={d} value={d}>{d==="all"?"All Doctors":d}</option>)}
          </select>
        </div>
      </div>
      <Card>
        {filt.length===0?(<div style={{padding:"48px",textAlign:"center"}}><div style={{fontSize:36,marginBottom:10}}>✓</div><div style={{fontWeight:600,color:C.text}}>All clear!</div><div style={{color:C.muted,fontSize:13,marginTop:4}}>No recalls in this category.</div></div>):filt.map((r,i)=>{
          const logs=contactLogs[r.id]||[];
          const isExpanded=expandedLog===r.id;
          return(
            <div key={r.id} style={{borderBottom:i<filt.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14}}>
                <input type="checkbox" checked={checked.has(r.id)} onChange={()=>toggleCheck(r.id)} style={{width:15,height:15,cursor:"pointer",flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:14,color:C.text}}>{r.patient}</div>
                  <div style={{fontSize:13,color:C.muted,marginTop:2}}>{r.reason}</div>
                  <div style={{display:"flex",gap:12,marginTop:3,alignItems:"center"}}>
                    <span style={{fontSize:12,color:r.urgency==="high"?C.red:C.muted,fontWeight:r.urgency==="high"?600:400}}>{r.urgency==="high"?"⚠ Overdue — ":"Due "}{fmt(r.due)}</span>
                    {r.doctor&&<span style={{fontSize:11,color:C.muted}}>· {r.doctor}</span>}
                    <button onClick={()=>setExpandedLog(isExpanded?null:r.id)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:"none",cursor:"pointer",padding:0}}>{logs.length>0?`${logs.length} contact log${logs.length>1?"s":""}`:"+Log Contact"} {isExpanded?"▲":"▼"}</button>
                  </div>
                </div>
                <Badge color={r.urgency==="high"?"red":r.urgency==="medium"?"amber":"blue"}>{r.urgency}</Badge>
                <button onClick={()=>completeSingle(r)} style={{padding:"7px 14px",borderRadius:6,border:`1px solid ${C.border}`,background:C.surface,color:C.green,fontSize:12,fontWeight:600,cursor:"pointer"}}>Mark Complete</button>
              </div>
              {isExpanded&&(
                <div style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:"14px 20px 14px 52px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:10}}>Contact Log</div>
                  {logs.length===0&&<div style={{fontSize:13,color:C.muted,marginBottom:10}}>No contact attempts logged yet.</div>}
                  {logs.map(l=>(
                    <div key={l.id} style={{display:"flex",gap:12,marginBottom:8,fontSize:13}}>
                      <div style={{color:C.muted,width:80,flexShrink:0}}>{l.date}</div>
                      <div style={{width:60,flexShrink:0}}><Badge color="navy">{l.method}</Badge></div>
                      <div style={{color:C.text}}>{l.outcome}</div>
                    </div>
                  ))}
                  {addingLog===r.id?(
                    <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
                      <select value={logForm.method} onChange={e=>setLogForm(f=>({...f,method:e.target.value}))} style={{...SS,width:90,padding:"6px 8px",fontSize:12}}>
                        {["Phone","Email","Text","In Person"].map(m=><option key={m}>{m}</option>)}
                      </select>
                      <input value={logForm.outcome} onChange={e=>setLogForm(f=>({...f,outcome:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addLog(r.id)} placeholder="Outcome…" style={{...IS,flex:1,fontSize:12,marginBottom:0}} autoFocus/>
                      <PB onClick={()=>addLog(r.id)} disabled={!logForm.outcome.trim()}>Save</PB>
                      <XB onClick={()=>setAddingLog(null)}>Cancel</XB>
                    </div>
                  ):<button onClick={()=>setAddingLog(r.id)} style={{fontSize:11,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer",marginTop:4}}>+ Log Attempt</button>}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function AdminPage({auditLog}){
  const[tab,setTab]=useState("users");
  const[loginFilter,setLoginFilter]=useState("all");
  const filteredLogins=loginFilter==="all"?INIT_LOGIN_HISTORY:INIT_LOGIN_HISTORY.filter(l=>l.status===loginFilter);
  return(
    <div style={{padding:"28px 32px",maxWidth:900}}>
      <div style={{marginBottom:24}}><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Admin Panel</h1></div>
      <div style={{display:"flex",marginBottom:16,borderBottom:`1px solid ${C.border}`}}>
        {["users","audit log","login history","backup"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"10px 20px",border:"none",background:"none",cursor:"pointer",fontSize:13,fontWeight:tab===t?700:400,color:tab===t?C.navyMid:C.muted,borderBottom:tab===t?`2px solid ${C.navyMid}`:"2px solid transparent",marginBottom:-1,textTransform:"capitalize"}}>{t}</button>)}
      </div>
      {tab==="users"&&(<Card><div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Staff Users</div><button style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer"}}>+ Add User</button></div><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{background:C.bg}}>{["Name","Role","Status","Last Login",""].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead><tbody>{STAFF_LIST.map((s,i)=><tr key={s.id} style={{borderBottom:i<STAFF_LIST.length-1?`1px solid ${C.border}`:"none"}}><td style={{padding:"13px 16px",fontWeight:600,fontSize:13,color:C.text}}>{s.name}</td><td style={{padding:"13px 16px"}}><Badge color={s.role==="admin"?"purple":s.role==="doctor"?"navy":s.role==="nurse"?"green":"amber"}>{s.role}</Badge></td><td style={{padding:"13px 16px"}}><Badge color={s.status==="active"?"green":"red"}>{s.status}</Badge></td><td style={{padding:"13px 16px",fontSize:12,color:C.muted}}>{s.lastLogin}</td><td style={{padding:"13px 16px"}}><button style={{fontSize:12,color:C.navyMid,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"4px 10px",cursor:"pointer"}}>Edit</button></td></tr>)}</tbody></table></Card>)}
      {tab==="audit log"&&(<Card style={{padding:"20px"}}><div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:16}}>Audit Log</div><AuditLogTab auditLog={auditLog||[]}/></Card>)}
      {tab==="login history"&&(
        <Card>
          <div style={{padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontWeight:700,fontSize:14,color:C.text}}>Login History</div>
            <div style={{display:"flex",gap:6}}>
              {["all","Success","Failed"].map(f=><button key={f} onClick={()=>setLoginFilter(f)} style={{fontSize:12,fontWeight:600,padding:"4px 12px",borderRadius:20,border:`1px solid ${loginFilter===f?C.navyMid:C.border}`,background:loginFilter===f?C.blueBg:C.surface,color:loginFilter===f?C.navyMid:C.muted,cursor:"pointer"}}>{f==="all"?"All":f}</button>)}
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.bg}}>{["User","Role","Username","Time","Status"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
            <tbody>{filteredLogins.map((l,i)=>(
              <tr key={l.id} style={{borderBottom:i<filteredLogins.length-1?`1px solid ${C.border}`:"none"}}>
                <td style={{padding:"12px 16px",fontWeight:600,fontSize:13,color:C.text}}>{l.user}</td>
                <td style={{padding:"12px 16px"}}><Badge color={l.role==="admin"?"purple":l.role==="doctor"?"navy":l.role==="nurse"?"green":l.role==="receptionist"?"amber":"red"}>{l.role}</Badge></td>
                <td style={{padding:"12px 16px",fontSize:12,color:C.muted,fontFamily:"monospace"}}>{l.username}</td>
                <td style={{padding:"12px 16px",fontSize:12,color:C.muted}}>{l.ts}</td>
                <td style={{padding:"12px 16px"}}><Badge color={l.status==="Success"?"green":"red"}>{l.status}</Badge></td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}
      {tab==="backup"&&(<Card style={{padding:"24px"}}><div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:6}}>Database Backup</div><div style={{fontSize:13,color:C.muted,marginBottom:20}}>Last backup: never</div><button style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Run Backup Now</button></Card>)}
    </div>
  );
}

function SettingsPage({user,settings,setSettings,setPage,blockTimes,setBlockTimes,darkMode,setDarkMode}){
  const[saved,setSaved]=useState(false);
  const[local,setLocal]=useState(settings||INIT_SETTINGS);
  const[btForm,setBtForm]=useState({doctor:"Dr. Priya Patel",date:"",from:"",to:"",reason:"Lunch"});
  const s=(k,v)=>setLocal(p=>({...p,[k]:v}));
  const save=()=>{setSettings(local);setSaved(true);setTimeout(()=>setSaved(false),2500);};
  const addBlockTime=()=>{
    if(!btForm.date||!btForm.from||!btForm.to)return;
    if(setBlockTimes)setBlockTimes(prev=>[...prev,{...btForm,id:Date.now()}]);
    setBtForm({doctor:"Dr. Priya Patel",date:"",from:"",to:"",reason:"Lunch"});
  };
  const DAYS=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const lbl={display:"block",fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6};
  return(
    <div style={{padding:"28px 32px",maxWidth:640}}>
      <h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:"0 0 28px"}}>Settings</h1>
      {user.role==="admin"&&(
        <div style={{background:C.blueBg,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:18}}>⚙</span>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:C.navyMid}}>Admin Panel</div><div style={{fontSize:12,color:C.muted}}>Manage staff users, audit logs, and backup from the Admin Panel.</div></div>
          <button onClick={()=>setPage("admin")} style={{fontSize:12,fontWeight:700,color:C.navyMid,background:"none",border:`1px solid ${C.navyMid}`,borderRadius:6,padding:"6px 14px",cursor:"pointer"}}>Go to Admin →</button>
        </div>
      )}
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Clinic Information</div></div>
        <div style={{padding:"20px"}}>
          <div style={{marginBottom:14}}><label style={lbl}>Clinic Name</label><input value={local.clinicName} onChange={e=>s("clinicName",e.target.value)} style={IS}/></div>
          <div style={{marginBottom:14}}><label style={lbl}>Address</label><input value={local.address} onChange={e=>s("address",e.target.value)} style={IS}/></div>
          <div style={{marginBottom:6}}><label style={lbl}>Phone</label><input value={local.phone} onChange={e=>s("phone",e.target.value)} style={IS}/></div>
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Scheduling Defaults</div></div>
        <div style={{padding:"20px"}}>
          <div style={{marginBottom:6}}><label style={lbl}>Default Appointment Duration</label>
            <select value={local.defaultDuration} onChange={e=>s("defaultDuration",parseInt(e.target.value))} style={{...SS,maxWidth:200}}>
              {[15,20,30,45,60].map(d=><option key={d} value={d}>{d} minutes</option>)}
            </select>
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Clinic Hours</div></div>
        <div style={{padding:"20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"60px 1fr 1fr",gap:"8px 12px",alignItems:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Day</div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Open</div>
            <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>Close</div>
            {DAYS.map(day=>[
              <div key={day+"-d"} style={{fontSize:13,fontWeight:600,color:C.text}}>{day}</div>,
              <input key={day+"-o"} type="time" value={(local.clinicHours||{})[day]?.[0]||""} onChange={e=>s("clinicHours",{...local.clinicHours,[day]:[e.target.value,local.clinicHours[day]?.[1]||""]})} style={{...IS,fontSize:13}}/>,
              <input key={day+"-c"} type="time" value={(local.clinicHours||{})[day]?.[1]||""} onChange={e=>s("clinicHours",{...local.clinicHours,[day]:[local.clinicHours[day]?.[0]||"",e.target.value]})} style={{...IS,fontSize:13}}/>,
            ])}
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Notification Preferences</div></div>
        <div style={{padding:"20px"}}>
          {[["messages","New message notifications"],["recalls","Urgent recall alerts"]].map(([key,label])=>(
            <label key={key} style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,cursor:"pointer"}}>
              <input type="checkbox" checked={local.notifications?.[key]??true} onChange={e=>s("notifications",{...local.notifications,[key]:e.target.checked})} style={{width:16,height:16,cursor:"pointer"}}/>
              <div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{label}</div></div>
            </label>
          ))}
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Appearance</div></div>
        <div style={{padding:"20px"}}>
          <label style={{display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.text}}>Dark Mode</div>
              <div style={{fontSize:12,color:C.muted,marginTop:2}}>Easier on the eyes in low-light environments</div>
            </div>
            <div onClick={()=>setDarkMode(v=>!v)} style={{width:44,height:24,borderRadius:12,background:darkMode?C.navyMid:C.border,position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}>
              <div style={{position:"absolute",top:3,left:darkMode?22:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.25)"}}/>
            </div>
          </label>
        </div>
      </Card>
      <Card style={{marginBottom:16}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Change Password</div></div>
        <div style={{padding:"20px"}}>
          {["Current Password","New Password","Confirm New Password"].map(l=><div key={l} style={{marginBottom:14}}><label style={lbl}>{l}</label><input type="password" style={IS}/></div>)}
          <button style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Update Password</button>
        </div>
      </Card>
      {user.role==="admin"&&(
        <Card style={{marginBottom:16}}>
          <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.border}`}}><div style={{fontWeight:700,fontSize:14,color:C.text}}>Schedule Management — Block Times</div></div>
          <div style={{padding:"20px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr auto",gap:10,marginBottom:14,alignItems:"flex-end"}}>
              <div><label style={lbl}>Doctor</label><select value={btForm.doctor} onChange={e=>setBtForm(f=>({...f,doctor:e.target.value}))} style={{...SS,fontSize:13}}>
                <option>Dr. Priya Patel</option><option>Dr. Owen Williams</option>
              </select></div>
              <div><label style={lbl}>Date</label><input type="date" value={btForm.date} onChange={e=>setBtForm(f=>({...f,date:e.target.value}))} style={{...IS,fontSize:13}}/></div>
              <div><label style={lbl}>From</label><input type="time" value={btForm.from} onChange={e=>setBtForm(f=>({...f,from:e.target.value}))} style={{...IS,fontSize:13}}/></div>
              <div><label style={lbl}>To</label><input type="time" value={btForm.to} onChange={e=>setBtForm(f=>({...f,to:e.target.value}))} style={{...IS,fontSize:13}}/></div>
              <div><label style={lbl}>Reason</label><select value={btForm.reason} onChange={e=>setBtForm(f=>({...f,reason:e.target.value}))} style={{...SS,fontSize:13}}>
                {["Lunch","Meeting","Vacation","Conference","Personal"].map(r=><option key={r}>{r}</option>)}
              </select></div>
              <button onClick={addBlockTime} disabled={!btForm.date||!btForm.from||!btForm.to} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 16px",fontSize:13,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap"}}>+ Add</button>
            </div>
            {(blockTimes||[]).length>0?(
              <table style={{width:"100%",borderCollapse:"collapse",marginTop:8}}>
                <thead><tr style={{background:C.bg}}>{["Doctor","Date","Time","Reason",""].map(h=><th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>)}</tr></thead>
                <tbody>{(blockTimes||[]).map((b,i)=>(
                  <tr key={b.id} style={{borderBottom:i<(blockTimes||[]).length-1?`1px solid ${C.border}`:"none"}}>
                    <td style={{padding:"10px 12px",fontSize:13,color:C.text,fontWeight:600}}>{b.doctor}</td>
                    <td style={{padding:"10px 12px",fontSize:13,color:C.muted}}>{b.date}</td>
                    <td style={{padding:"10px 12px",fontSize:13,color:C.muted}}>{b.from} – {b.to}</td>
                    <td style={{padding:"10px 12px"}}><Badge color="amber">{b.reason}</Badge></td>
                    <td style={{padding:"10px 12px"}}><button onClick={()=>setBlockTimes&&setBlockTimes(prev=>prev.filter(x=>x.id!==b.id))} style={{fontSize:11,color:C.red,fontWeight:600,background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"3px 8px",cursor:"pointer"}}>Delete</button></td>
                  </tr>
                ))}</tbody>
              </table>
            ):<div style={{color:C.muted,fontSize:13}}>No block times set.</div>}
          </div>
        </Card>
      )}
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={save} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>Save All Settings</button>
        {saved&&<span style={{color:C.green,fontSize:13,fontWeight:600}}>✓ Saved</span>}
      </div>
    </div>
  );
}

// ─── RefillQueuePage ───────────────────────────────────────────────────────────
function RefillQueuePage({user,patients,rx,setRx,refillRequests,setRefillRequests}){
  const p=PERMS[user.role];
  const[newReq,setNewReq]=useState({patientId:"",medication:""});
  const[patSearch,setPatSearch]=useState("");
  const[patOpen,setPatOpen]=useState(false);
  const[reviewId,setReviewId]=useState(null);
  const[reviewNote,setReviewNote]=useState("");
  const[loading,setLoading]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),600);return()=>clearTimeout(t);},[]);
  const pending=(refillRequests||[]).filter(r=>r.status==="pending");
  const others=(refillRequests||[]).filter(r=>r.status!=="pending");
  const submit=()=>{
    if(!newReq.patientId||!newReq.medication.trim())return;
    const pt=patients.find(x=>x.id===parseInt(newReq.patientId));
    if(!pt)return;
    setRefillRequests(prev=>[...prev,{id:Date.now(),patientId:pt.id,patient:`${pt.first_name} ${pt.last_name}`,medication:newReq.medication.trim(),requestedBy:user.role,requestedByName:user.name,date:today(),status:"pending",approvedBy:null,note:""}]);
    setNewReq({patientId:"",medication:""});setPatSearch("");
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
    <div style={{padding:"28px 32px",maxWidth:900}}>
      <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Refill Queue</h1>
          <p style={{color:C.muted,fontSize:14,marginTop:4}}>{pending.length} pending request{pending.length!==1?"s":""}</p>
        </div>
      </div>
      {loading&&<div>{[...Array(4)].map((_,i)=><div key={i} style={{background:"#E8ECF0",borderRadius:8,height:44,marginBottom:8,animation:"pulse 1.2s ease infinite"}}/>)}</div>}
      {!loading&&<>
        {!p.refillApprove&&(
          <Card style={{marginBottom:16,padding:"20px"}}>
            <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:14}}>Submit New Refill Request</div>
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
                    <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 6px 20px rgba(0,0,0,0.15)",maxHeight:200,overflowY:"auto",marginTop:2}}>
                      {hits.map(pt=>(
                        <div key={pt.id}
                          onMouseDown={()=>{setNewReq(f=>({...f,patientId:String(pt.id)}));setPatSearch(`${pt.first_name} ${pt.last_name}`);setPatOpen(false);}}
                          style={{padding:"9px 14px",fontSize:13,color:C.text,cursor:"pointer",borderBottom:`1px solid ${C.border}`}}
                          onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                        >{pt.first_name} {pt.last_name}</div>
                      ))}
                    </div>
                  ):null;
                })()}
              </div>
              <div style={{flex:1}}><label style={LS}>Medication</label>
                <input value={newReq.medication} onChange={e=>setNewReq(f=>({...f,medication:e.target.value}))} placeholder="e.g. Lisinopril 10mg" style={IS}/>
              </div>
              <PB onClick={submit} disabled={!newReq.patientId||!newReq.medication.trim()}>Submit Request</PB>
            </div>
          </Card>
        )}
        <Card style={{marginBottom:16}}>
          <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Pending Requests {pending.length>0&&<span style={{background:C.amberBg,color:C.amber,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:10,marginLeft:8}}>{pending.length}</span>}</div>
          {pending.length===0&&<div style={{padding:"24px",color:C.muted,fontSize:13,textAlign:"center"}}>No pending refill requests. ✓</div>}
          {pending.map((r,i)=>(
            <div key={r.id} style={{borderBottom:i<pending.length-1?`1px solid ${C.border}`:"none"}}>
              <div style={{padding:"14px 20px",display:"flex",alignItems:"center",gap:14}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13,color:C.text}}>{r.patient}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>{r.medication}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:2}}>Requested by {r.requestedByName} ({r.requestedBy}) · {r.date}</div>
                </div>
                <Badge color="amber">Pending</Badge>
                {p.refillApprove&&<button onClick={()=>setReviewId(reviewId===r.id?null:r.id)} style={{fontSize:12,fontWeight:700,padding:"6px 14px",borderRadius:6,border:`1px solid ${C.navyMid}`,background:C.blueBg,color:C.navyMid,cursor:"pointer"}}>Review</button>}
              </div>
              {reviewId===r.id&&(
                <div style={{background:C.bg,borderTop:`1px solid ${C.border}`,padding:"16px 20px"}}>
                  <div style={{fontWeight:700,fontSize:12,color:C.muted,textTransform:"uppercase",marginBottom:10}}>Current Medications for {r.patient}</div>
                  {(rx[r.patientId]||[]).map(med=><div key={med.id} style={{fontSize:13,color:C.text,marginBottom:4}}>• {med.med} {med.dose} — {med.sig}</div>)}
                  {!(rx[r.patientId]||[]).length&&<div style={{fontSize:13,color:C.muted,marginBottom:10}}>No active medications on file.</div>}
                  <div style={{marginTop:12,marginBottom:10}}><label style={LS}>Doctor Note (optional)</label><input value={reviewNote} onChange={e=>setReviewNote(e.target.value)} placeholder="Add note…" style={IS}/></div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>approve(r.id)} style={{background:C.green,color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ Approve</button>
                    <button onClick={()=>deny(r.id)} style={{background:C.red,color:"#fff",border:"none",borderRadius:7,padding:"8px 18px",fontSize:13,fontWeight:700,cursor:"pointer"}}>✗ Deny</button>
                    <XB onClick={()=>{setReviewId(null);setReviewNote("");}}>Cancel</XB>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Card>
        {others.length>0&&(
          <Card>
            <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:14,color:C.text}}>Completed Requests</div>
            {others.map((r,i)=>(
              <div key={r.id} style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:14,borderBottom:i<others.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:C.text}}>{r.patient} — {r.medication}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>By {r.requestedByName} · {r.date}</div>
                  {r.note&&<div style={{fontSize:12,color:r.status==="denied"?C.red:C.green,marginTop:2,fontStyle:"italic"}}>{r.note}</div>}
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
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:2000,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:80}} onClick={onClose}>
      <div style={{background:C.surface,borderRadius:14,width:"100%",maxWidth:560,boxShadow:"0 20px 60px rgba(0,0,0,0.3)",overflow:"hidden"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"14px 18px",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:18,color:C.muted}}>🔍</span>
          <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search patients, appointments…" style={{flex:1,border:"none",outline:"none",fontSize:16,color:C.text,background:"transparent"}} onKeyDown={e=>e.key==="Escape"&&onClose()}/>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,color:C.muted,cursor:"pointer",padding:"2px 6px"}}>×</button>
        </div>
        <div style={{maxHeight:400,overflow:"auto"}}>
          {q.length<2&&<div style={{padding:"24px",textAlign:"center",color:C.muted,fontSize:13}}>Type to search patients and appointments…</div>}
          {ptResults.length>0&&(
            <div>
              <div style={{padding:"10px 18px 4px",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Patients</div>
              {ptResults.map(pt=>(
                <button key={pt.id} onClick={()=>onSelectPatient(pt)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 18px",border:"none",background:"none",textAlign:"left",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <div style={{width:30,height:30,borderRadius:"50%",background:C.navyMid,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{pt.first_name[0]}{pt.last_name[0]}</div>
                  <div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{pt.first_name} {pt.last_name}</div><div style={{fontSize:12,color:C.muted}}>{pt.phone} · {pt.insurance}</div></div>
                  {pt.dnc&&<span style={{marginLeft:"auto",background:C.redBg,color:C.red,fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:3}}>DNC</span>}
                </button>
              ))}
            </div>
          )}
          {apptResults.length>0&&(
            <div style={{borderTop:ptResults.length>0?`1px solid ${C.border}`:"none"}}>
              <div style={{padding:"10px 18px 4px",fontSize:10,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em"}}>Appointments</div>
              {apptResults.map(a=>(
                <button key={a.id} onClick={()=>onSelectAppt(a)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"11px 18px",border:"none",background:"none",textAlign:"left",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                  <span style={{fontSize:16}}>📅</span>
                  <div><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.patient}</div><div style={{fontSize:12,color:C.muted}}>{a.date} {a.time} · {a.doctor} · <SB status={a.status}/></div></div>
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
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1500,padding:20}}>
      <div style={{background:C.surface,borderRadius:14,width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"18px 24px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontWeight:700,fontSize:16,color:C.text}}>Schedule Follow-Up?</div>
          <div style={{fontSize:13,color:C.muted,marginTop:4}}>For {patient} with {doctor}</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          <div style={{fontSize:13,color:C.muted,marginBottom:16}}>When should this patient return?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["2 Weeks",14],["1 Month",30],["3 Months",90]].map(([lbl,days])=>(
              <button key={lbl} onClick={()=>onBook(addDays(days))} style={{padding:"12px 18px",borderRadius:8,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:14,fontWeight:600,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>e.currentTarget.style.background=C.blueBg} onMouseLeave={e=>e.currentTarget.style.background=C.bg}>
                <span>{lbl}</span><span style={{fontSize:12,color:C.muted}}>{addDays(days)}</span>
              </button>
            ))}
            <button onClick={onClose} style={{padding:"10px 18px",borderRadius:8,border:`1px solid ${C.border}`,background:C.surface,color:C.muted,fontSize:13,fontWeight:600,cursor:"pointer",marginTop:4}}>No Thanks — Skip</button>
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
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1500,padding:20}}>
      <div style={{background:C.surface,borderRadius:14,width:"100%",maxWidth:440,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
        <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:24,marginBottom:6}}>🌙</div>
          <div style={{fontWeight:700,fontSize:18,color:C.text}}>End of Day Checklist</div>
          <div style={{fontSize:13,color:C.muted,marginTop:4}}>All appointments are complete. Please confirm the following before closing out.</div>
        </div>
        <div style={{padding:"20px 24px"}}>
          {items.map(item=>(
            <label key={item.key} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
              <input type="checkbox" checked={checks[item.key]} onChange={()=>toggle(item.key)} style={{width:18,height:18,cursor:"pointer",flexShrink:0}}/>
              <span style={{fontSize:14,color:checks[item.key]?C.muted:C.text,textDecoration:checks[item.key]?"line-through":"none",transition:"all 0.15s"}}>{item.label}</span>
            </label>
          ))}
          <div style={{marginTop:20,display:"flex",justifyContent:"flex-end",gap:10}}>
            <XB onClick={onClose}>Close</XB>
            <PB onClick={onClose} disabled={!allChecked}>✓ Done for the Day</PB>
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
  const color=field==="systolic"?C.blue:field==="weight"?C.green:C.amber;
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
      <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",marginBottom:4}}>{label}</div>
      <svg width={W} height={H+20} style={{overflow:"visible"}}>
        <text x={0} y={PAD} fontSize={9} fill={C.muted}>{maxV}</text>
        <text x={0} y={H-PAD+4} fontSize={9} fill={C.muted}>{minV}</text>
        <polyline points={polyline} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round"/>
        {pts.map((p,i)=>(
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill={color} stroke="#fff" strokeWidth={1.5}/>
            <text x={p.x} y={H+14} fontSize={9} fill={C.muted} textAnchor="middle">{p.date.slice(5)}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── TasksPage ────────────────────────────────────────────────────────────────
function TasksPage({user, tasks, setTasks}){
  const p=PERMS[user.role];
  const [view, setView]=useState("my");
  const [expanded, setExpanded]=useState(null);
  const [showNew, setShowNew]=useState(false);
  const [editNote, setEditNote]=useState({});
  const [editStatus, setEditStatus]=useState({});
  const [newTask, setNewTask]=useState({title:"",assignedTo:"nurse",patientId:"",priority:"medium",due:"",note:""});
  const canCreate=p.admin||user.role==="doctor"||user.role==="admin";
  const myTasks=tasks.filter(t=>t.assignedTo===user.role);
  const assignedByMe=tasks.filter(t=>t.assignedBy===user.role);
  const displayed=view==="my"?myTasks:view==="assigned"?assignedByMe:tasks;
  const isReadOnly=view==="assigned";
  const priorityColor={high:C.red,medium:C.amber,low:C.blue};
  const statusColor={pending:C.amber,"in-progress":C.blue,completed:C.green};
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
    <div style={{padding:"28px 32px",maxWidth:900}}>
      <div style={{marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:C.text,margin:0}}>Tasks</h1><p style={{color:C.muted,fontSize:14,marginTop:4}}>{myTasks.filter(t=>t.status!=="completed").length} open · {assignedByMe.filter(t=>t.status!=="completed").length} pending from me</p></div>
        {canCreate&&<button onClick={()=>setShowNew(v=>!v)} style={{background:C.navyMid,color:"#fff",border:"none",borderRadius:7,padding:"9px 18px",fontSize:13,fontWeight:600,cursor:"pointer"}}>+ New Task</button>}
      </div>
      {showNew&&(
        <Card style={{marginBottom:16,padding:"20px"}}>
          <div style={{fontWeight:700,fontSize:14,color:C.text,marginBottom:14}}>New Task</div>
          <FR cols={1}><FF label="Title *"><input value={newTask.title} onChange={e=>setNewTask(f=>({...f,title:e.target.value}))} style={IS} placeholder="Task description…"/></FF></FR>
          <FR>
            <FF label="Assign To"><select value={newTask.assignedTo} onChange={e=>setNewTask(f=>({...f,assignedTo:e.target.value}))} style={SS}><option value="nurse">Nurse</option><option value="receptionist">Receptionist</option><option value="doctor">Doctor</option><option value="admin">Admin</option></select></FF>
            <FF label="Priority"><select value={newTask.priority} onChange={e=>setNewTask(f=>({...f,priority:e.target.value}))} style={SS}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></FF>
          </FR>
          <FR><FF label="Due Date *"><input type="date" value={newTask.due} onChange={e=>setNewTask(f=>({...f,due:e.target.value}))} style={IS}/></FF><FF label="Note"><input value={newTask.note} onChange={e=>setNewTask(f=>({...f,note:e.target.value}))} style={IS} placeholder="Optional note…"/></FF></FR>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:8,borderTop:`1px solid ${C.border}`}}><XB onClick={()=>setShowNew(false)}>Cancel</XB><PB onClick={submitNew} disabled={!newTask.title||!newTask.due}>Create Task</PB></div>
        </Card>
      )}
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        <button onClick={()=>setView("my")} style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${view==="my"?C.navyMid:C.border}`,background:view==="my"?C.blueBg:C.surface,color:view==="my"?C.navyMid:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
          My Tasks {myTasks.filter(t=>t.status!=="completed").length>0&&<span style={{background:C.amber,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,marginLeft:4}}>{myTasks.filter(t=>t.status!=="completed").length}</span>}
        </button>
        {assignedByMe.length>0&&<button onClick={()=>setView("assigned")} style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${view==="assigned"?C.navyMid:C.border}`,background:view==="assigned"?C.blueBg:C.surface,color:view==="assigned"?C.navyMid:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>
          Assigned by Me {assignedByMe.filter(t=>t.status==="completed").length>0&&<span style={{background:C.green,color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10,marginLeft:4}}>{assignedByMe.filter(t=>t.status==="completed").length} done</span>}
        </button>}
        {canCreate&&<button onClick={()=>setView("all")} style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${view==="all"?C.navyMid:C.border}`,background:view==="all"?C.blueBg:C.surface,color:view==="all"?C.navyMid:C.muted,fontSize:12,fontWeight:600,cursor:"pointer"}}>All Tasks</button>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {displayed.length===0&&<div style={{padding:"32px",textAlign:"center",color:C.muted}}>No tasks to show.</div>}
        {displayed.map(task=>{
          const isExp=expanded===task.id;
          const isPast=task.due<today()&&task.status!=="completed";
          return(
            <Card key={task.id} style={{padding:0,overflow:"hidden"}}>
              <div onClick={()=>setExpanded(isExp?null:task.id)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13,color:task.status==="completed"?C.muted:C.text,textDecoration:task.status==="completed"?"line-through":"none"}}>{task.title}</div>
                  <div style={{fontSize:11,color:C.muted,marginTop:3}}>
                    {task.patient&&<span>Patient: {task.patient} · </span>}
                    <span>By {task.assignedByName} · </span>
                    <span style={{color:isPast?C.red:C.muted,fontWeight:isPast?700:400}}>Due {task.due}{isPast?" (overdue)":""}</span>
                  </div>
                </div>
                <Badge color={task.priority==="high"?"red":task.priority==="medium"?"amber":"blue"}>{task.priority}</Badge>
                <Badge color={task.status==="completed"?"green":task.status==="in-progress"?"blue":"amber"}>{task.status}</Badge>
                <span style={{color:C.muted,fontSize:12}}>{isExp?"▲":"▼"}</span>
              </div>
              {isExp&&(
                <div style={{padding:"14px 18px",background:C.bg,borderTop:`1px solid ${C.border}`}}>
                  {isReadOnly?(
                    <>
                      <div style={{display:"flex",gap:24,marginBottom:12,flexWrap:"wrap"}}>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Status</div>
                          <Badge color={task.status==="completed"?"green":task.status==="in-progress"?"blue":"amber"}>{task.status}</Badge>
                        </div>
                        <div>
                          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Assigned To</div>
                          <span style={{fontSize:13,color:C.text,fontWeight:600,textTransform:"capitalize"}}>{task.assignedTo}</span>
                        </div>
                        {task.due&&<div>
                          <div style={{fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Due</div>
                          <span style={{fontSize:13,color:task.due<today()&&task.status!=="completed"?C.red:C.text}}>{task.due}</span>
                        </div>}
                      </div>
                      {task.note&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:7,padding:"10px 12px",fontSize:13,color:C.text}}>
                        <span style={{fontWeight:700,color:C.muted,fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em"}}>Note: </span>{task.note}
                      </div>}
                      {!task.note&&<div style={{fontSize:13,color:C.muted,fontStyle:"italic"}}>No note added yet.</div>}
                      <div style={{display:"flex",justifyContent:"flex-end",marginTop:12}}><XB onClick={()=>setExpanded(null)}>Close</XB></div>
                    </>
                  ):(
                    <>
                      <FR cols={1}><FF label="Note"><textarea value={editNote[task.id]??task.note} onChange={e=>setEditNote(f=>({...f,[task.id]:e.target.value}))} rows={2} style={{...IS,resize:"vertical"}}/></FF></FR>
                      <FF label="Status"><select value={editStatus[task.id]??task.status} onChange={e=>setEditStatus(f=>({...f,[task.id]:e.target.value}))} style={{...SS,maxWidth:200}}><option value="pending">Pending</option><option value="in-progress">In Progress</option><option value="completed">Completed</option></select></FF>
                      <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:12}}><XB onClick={()=>setExpanded(null)}>Cancel</XB><PB onClick={()=>saveTask(task.id)}>Save</PB></div>
                    </>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
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
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div><label style={LS}>User</label>
            <select value={filterUser} onChange={e=>setFilterUser(e.target.value)} style={{...SS,width:"auto",minWidth:150}}>
              {users.map(u=><option key={u} value={u}>{u==="all"?"All Users":u}</option>)}
            </select>
          </div>
          <div><label style={LS}>Action</label>
            <select value={filterAction} onChange={e=>setFilterAction(e.target.value)} style={{...SS,width:"auto",minWidth:110}}>
              <option value="all">All</option><option value="Viewed">Viewed</option><option value="Edited">Edited</option>
            </select>
          </div>
          <div><label style={LS}>Section</label>
            <select value={filterSection} onChange={e=>setFilterSection(e.target.value)} style={{...SS,width:"auto",minWidth:130}}>
              {sections.map(s=><option key={s} value={s}>{s==="all"?"All Sections":s}</option>)}
            </select>
          </div>
          <div><label style={LS}>From Date</label>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{...IS,width:"auto"}}/>
          </div>
          <div><label style={LS}>To Date</label>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{...IS,width:"auto"}}/>
          </div>
          {hasFilters&&<button onClick={clearFilters} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"7px 14px",fontSize:12,color:C.muted,cursor:"pointer",alignSelf:"flex-end"}}>Clear</button>}
        </div>
        <div style={{marginTop:10,fontSize:12,color:C.muted}}>{filtered.length} {filtered.length===1?"entry":"entries"} found</div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead>
          <tr style={{background:C.bg}}>
            {["Date","Time","User","Role","Action","Patient","Section"].map(h=>(
              <th key={h} style={{padding:"9px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.04em",borderBottom:`1px solid ${C.border}`}}>{h}</th>
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
              <tr key={l.id} style={{borderBottom:i<filtered.length-1?`1px solid ${C.border}`:"none"}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"10px 14px",fontSize:12,fontWeight:600,color:C.text,whiteSpace:"nowrap"}}>{dateDisplay}</td>
                <td style={{padding:"10px 14px",fontSize:12,color:C.muted,whiteSpace:"nowrap",fontFamily:"monospace"}}>{timePart||"—"}</td>
                <td style={{padding:"10px 14px",fontSize:13,fontWeight:600,color:C.text}}>{l.user}</td>
                <td style={{padding:"10px 14px"}}><Badge color={l.role==="admin"?"purple":l.role==="doctor"?"navy":l.role==="nurse"?"green":"amber"}>{l.role}</Badge></td>
                <td style={{padding:"10px 14px"}}><Badge color={l.action==="Edited"?"amber":"blue"}>{l.action}</Badge></td>
                <td style={{padding:"10px 14px",fontSize:13,color:C.text}}>{l.subject}</td>
                <td style={{padding:"10px 14px",fontSize:12,color:C.muted}}>{l.section}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function LoginPage({onLogin}){
  const[u,su]=useState("");const[p,sp]=useState("");const[err,se]=useState("");const[loading,sl]=useState(false);
  const quick=async(usr)=>{sl(true);await new Promise(r=>setTimeout(r,450));onLogin(usr);};
  const submit=async()=>{sl(true);se("");await new Promise(r=>setTimeout(r,600));const f=DEMO_USERS.find(x=>x.username===u&&x.password===p);if(f)onLogin(f);else{se("Invalid username or password.");sl(false);}};
  return(
    <div style={{minHeight:"100vh",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:480}}>
        <div style={{textAlign:"center",marginBottom:32}}><div style={{width:54,height:54,background:C.blueBg,borderRadius:14,display:"inline-flex",alignItems:"center",justifyContent:"center",color:C.navyMid,fontWeight:900,fontSize:26,marginBottom:14}}>✚</div><div style={{color:"#fff",fontSize:22,fontWeight:800}}>Clinic Manager</div><div style={{color:"rgba(255,255,255,0.45)",fontSize:13,marginTop:4}}>Sign in to your account</div></div>
        <div style={{marginBottom:20}}>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",textAlign:"center",marginBottom:12}}>Quick Login — Try a Role</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {DEMO_USERS.map(usr=>(
              <button key={usr.username} onClick={()=>quick(usr)} disabled={loading} style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.12)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.07)"}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                  <div style={{width:28,height:28,borderRadius:7,background:RC[usr.role].bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>{RI[usr.role]}</div>
                  <div><div style={{color:"#fff",fontSize:13,fontWeight:700,textTransform:"capitalize"}}>{usr.role}</div><div style={{color:"rgba(255,255,255,0.45)",fontSize:11}}>{usr.name}</div></div>
                </div>
                <div style={{background:"rgba(0,0,0,0.2)",borderRadius:5,padding:"3px 8px",display:"inline-block"}}><span style={{color:"rgba(255,255,255,0.45)",fontSize:10}}>{usr.username} / {usr.password}</span></div>
              </button>
            ))}
          </div>
        </div>
        <div style={{background:C.surface,borderRadius:14,padding:24}}>
          <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"center",marginBottom:14}}>Or sign in manually</div>
          {err&&<div style={{background:C.redBg,color:C.red,padding:"10px 14px",borderRadius:7,fontSize:13,marginBottom:14}}>{err}</div>}
          <div style={{marginBottom:14}}><label style={{display:"block",fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Username</label><input value={u} onChange={e=>su(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:7,border:`1px solid ${C.border}`,fontSize:14,outline:"none",boxSizing:"border-box",background:C.bg,color:C.text}}/></div>
          <div style={{marginBottom:18}}><label style={{display:"block",fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Password</label><input type="password" value={p} onChange={e=>sp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} style={{width:"100%",padding:"9px 12px",borderRadius:7,border:`1px solid ${C.border}`,fontSize:14,outline:"none",boxSizing:"border-box",background:C.bg,color:C.text}}/></div>
          <button onClick={submit} disabled={loading} style={{width:"100%",background:loading?"#9BB5D9":C.navyMid,color:"#fff",border:"none",borderRadius:8,padding:"11px",fontSize:14,fontWeight:700,cursor:"pointer"}}>{loading?"Signing in…":"Sign In"}</button>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const[user,setUser]=useState(null);const[page,setPage]=useState("dashboard");
  const[patients,setPatients]=useState(INIT_PATIENTS);
  const[appts,setAppts]=useState(INIT_APPTS);
  const[recalls,setRecalls]=useState(INIT_RECALLS);
  const[vitals,setVitals]=useState(INIT_VITALS_FULL);
  const[rx,setRx]=useState(INIT_RX);
  const[notes,setNotes]=useState(INIT_NOTES);
  const[draftNotes,setDraftNotes]=useState({});
  const[messages,setMessages]=useState(INIT_MESSAGES);
  const[settings,setSettings]=useState(INIT_SETTINGS);
  const[doctorStatus,setDoctorStatus]=useState(INIT_DOCTOR_STATUS);
  const[reminderLogs,setReminderLogs]=useState(INIT_REMINDER_LOGS);
  const[blockTimes,setBlockTimes]=useState(INIT_BLOCK_TIMES);
  const[waitlist,setWaitlist]=useState(INIT_WAITLIST);
  const[refillRequests,setRefillRequests]=useState(INIT_REFILL_REQUESTS);
  const[recentPatients,setRecentPatients]=useState([]);
  const[sidebarCollapsed,setSidebarCollapsed]=useState(false);
  const[tasks,setTasks]=useState(INIT_TASKS);
  const[auditLog,setAuditLog]=useState(INIT_AUDIT_LOG);
  const[inventory,setInventory]=useState(INIT_INVENTORY);
  const[staffSchedule,setStaffSchedule]=useState(INIT_STAFF_SCHEDULE);
  const[darkMode,setDarkMode]=useState(()=>{try{return localStorage.getItem("clinicDark")==="1";}catch{return false;}});

  useEffect(()=>{
    if(darkMode){document.documentElement.setAttribute("data-dark","");}
    else{document.documentElement.removeAttribute("data-dark");}
    try{localStorage.setItem("clinicDark",darkMode?"1":"0");}catch{}
  },[darkMode]);
  const[globalSearchOpen,setGlobalSearchOpen]=useState(false);
  const[openPatientId,setOpenPatientId]=useState(null);
  const[eodShown,setEodShown]=useState(false);
  const[eodModal,setEodModal]=useState(false);
  const[toast,setToast]=useState(null);
  const[recentDropOpen,setRecentDropOpen]=useState(false);
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

  if(!user)return<LoginPage onLogin={u=>{setUser(u);setPage("dashboard");setRecentPatients([]);}}/>;
  const p=PERMS[user.role];
  const overdueCount=recalls.filter(r=>r.urgency==="high").length;
  const pendingRefills=refillRequests.filter(r=>r.status==="pending").length;

  const unreadMsgCount = STAFF_LIST
    .filter(s => s.username !== user.username)
    .reduce((sum, contact) => {
      const key = buildConvoKey(user.username, contact.username);
      const msgs = messages[key] || [];
      return sum + msgs.filter(m => m.from === contact.username && !m.read).length;
    }, 0);

  const pages={
    dashboard:<Dashboard user={user} setPage={setPage} appts={appts} recalls={recalls} refillRequests={refillRequests}/>,
    appointments:p.appointments?<ApptsPage user={user} appts={appts} setAppts={setAppts} patients={patients} settings={settings} reminderLogs={reminderLogs} setReminderLogs={setReminderLogs} waitlist={waitlist} setWaitlist={setWaitlist} blockTimes={blockTimes} recalls={recalls} setRecalls={setRecalls} showToast={showToast} noShowHandler={noShowHandler} completeHandler={completeHandler} pendingFollowUp={pendingFollowUp} setPendingFollowUp={setPendingFollowUp}/>:<Locked/>,
    flow:p.flow?<PatientFlowPage user={user} appts={appts} setAppts={setAppts} doctorStatus={doctorStatus} setDoctorStatus={setDoctorStatus} patients={patients} showToast={showToast} recalls={recalls} setRecalls={setRecalls} noShowHandler={noShowHandler} completeHandler={completeHandler} setPendingFollowUp={setPendingFollowUp} pendingFollowUp={pendingFollowUp}/>:<Locked/>,
    patients:p.patients?<PatientsPage user={user} patients={patients} setPatients={setPatients} vitals={vitals} setVitals={setVitals} rx={rx} setRx={setRx} notes={notes} setNotes={setNotes} draftNotes={draftNotes} setDraftNotes={setDraftNotes} recalls={recalls} setRecalls={setRecalls} appts={appts} setAppts={setAppts} refillRequests={refillRequests} setRefillRequests={setRefillRequests} onOpenPatient={onOpenPatient} openPatientId={openPatientId} setOpenPatientId={setOpenPatientId} setPage={setPage} showToast={showToast} addAudit={addAudit}/>:<Locked/>,
    recalls:p.recalls?<RecallsPage recalls={recalls} setRecalls={setRecalls} patients={patients} appts={appts} setAppts={setAppts} blockTimes={blockTimes}/>:<Locked/>,
    messages:p.messages?<MessagesPage user={user} messages={messages} setMessages={setMessages}/>:<Locked msg="Messaging is not available for your role."/>,
    reports:p.reports?<ReportsPage appts={appts} recalls={recalls} patients={patients}/>:<Locked msg="Reports are restricted to administrators."/>,
    refills:p.refills?<RefillQueuePage user={user} patients={patients} rx={rx} setRx={setRx} refillRequests={refillRequests} setRefillRequests={setRefillRequests}/>:<Locked msg="Refill queue access is not available for your role."/>,
    tasks:p.tasks?<TasksPage user={user} tasks={tasks} setTasks={setTasks}/>:<Locked msg="Tasks are not available for your role."/>,
    inventory:p.inventory?<InventoryPage inventory={inventory} setInventory={setInventory}/>:<Locked msg="Inventory is not available for your role."/>,
    staffschedule:p.staffSchedule?<StaffSchedulePage staffSchedule={staffSchedule} setStaffSchedule={setStaffSchedule}/>:<Locked msg="Staff schedule is restricted to administrators."/>,
    admin:p.admin?<AdminPage auditLog={auditLog}/>:<Locked msg="Admin panel is restricted to administrators only."/>,
    settings:p.settings?<SettingsPage user={user} settings={settings} setSettings={setSettings} setPage={setPage} blockTimes={blockTimes} setBlockTimes={setBlockTimes} darkMode={darkMode} setDarkMode={setDarkMode}/>:<Locked msg="Settings are restricted to doctors and admins."/>,
  };
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"'Segoe UI',system-ui,sans-serif",overflow:"hidden"}}>
      {globalSearchOpen&&<GlobalSearch patients={patients} appts={appts} onClose={()=>setGlobalSearchOpen(false)} onSelectPatient={(pt)=>{setOpenPatientId(pt.id);setPage("patients");setGlobalSearchOpen(false);onOpenPatient(pt);}} onSelectAppt={()=>{setPage("appointments");setGlobalSearchOpen(false);}}/>}
      {eodModal&&<EndOfDayModal onClose={()=>setEodModal(false)}/>}
      {pendingFollowUp&&<FollowUpModal patient={pendingFollowUp.patient} doctor={pendingFollowUp.doctor} onClose={()=>setPendingFollowUp(null)} onBook={(date)=>{setPendingFollowUp(null);setPage("appointments");}}/>}
      {toast&&<div style={{position:"fixed",bottom:24,right:24,zIndex:9999,background:toast.color==="green"?C.green:toast.color==="amber"?C.amber:C.red,color:"#fff",borderRadius:10,padding:"12px 20px",fontSize:14,fontWeight:600,boxShadow:"0 4px 20px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",gap:8,minWidth:280}}><span>{toast.color==="green"?"✓":toast.color==="amber"?"⚠":"✗"}</span>{toast.msg}</div>}
      <Sidebar page={page} setPage={setPage} user={user} recallCount={overdueCount} unreadMsgCount={unreadMsgCount} pendingRefills={pendingRefills} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}/>
      <main style={{flex:1,overflow:(page==="messages"||page==="flow")?"hidden":"auto",background:C.bg,display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",alignItems:"center",padding:"8px 20px",background:C.surface,borderBottom:`1px solid ${C.border}`,flexShrink:0,gap:12,position:"relative"}}>
          <button onClick={()=>setUser(null)} style={{fontSize:12,color:C.muted,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 12px",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>← Switch Role</button>
          {user.role!=="doctor"&&(
            <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",width:360,pointerEvents:"auto"}}>
              <button onClick={()=>setGlobalSearchOpen(true)} style={{width:"100%",padding:"7px 14px",borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.muted,fontSize:13,cursor:"text",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>🔍</span>
                <span>Search patients, appointments…</span>
                <span style={{marginLeft:"auto",background:C.border,borderRadius:4,padding:"1px 6px",fontSize:11,fontFamily:"monospace"}}>/</span>
              </button>
            </div>
          )}
          <div style={{display:"flex",gap:8,alignItems:"center",marginLeft:"auto"}}>
            {recentPatients.length>0&&(
              <div style={{position:"relative"}}>
                <button onClick={()=>setRecentDropOpen(v=>!v)} style={{fontSize:12,color:C.muted,background:"none",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                  Recent <span style={{fontSize:10}}>▾</span>
                </button>
                {recentDropOpen&&(
                  <div style={{position:"absolute",top:"100%",right:0,marginTop:4,background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,boxShadow:"0 4px 16px rgba(0,0,0,0.12)",minWidth:200,zIndex:500}}>
                    {recentPatients.map(pt=>(
                      <button key={pt.id} onClick={()=>{setOpenPatientId(pt.id);setPage("patients");setRecentDropOpen(false);}} style={{display:"block",width:"100%",padding:"9px 14px",border:"none",background:"none",textAlign:"left",cursor:"pointer",fontSize:13,color:C.text}} onMouseEnter={e=>e.currentTarget.style.background=C.bg} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                        {pt.first_name} {pt.last_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {user.role==="doctor"&&(
              <button onClick={()=>setGlobalSearchOpen(true)} style={{padding:"7px 14px",borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.muted,fontSize:13,cursor:"text",display:"flex",alignItems:"center",gap:8,width:300}}>
                <span style={{fontSize:14}}>🔍</span>
                <span>Search patients, appointments…</span>
                <span style={{marginLeft:"auto",background:C.border,borderRadius:4,padding:"1px 6px",fontSize:11,fontFamily:"monospace"}}>/</span>
              </button>
            )}
            {user.role==="doctor"&&(
              <button onClick={()=>setDoctorStatus(prev=>({...prev,[user.name]:!prev[user.name]}))}
                style={{fontSize:12,fontWeight:700,padding:"5px 12px",borderRadius:6,border:`1px solid ${doctorStatus[user.name]?C.green:C.red}`,background:doctorStatus[user.name]?C.greenBg:C.redBg,color:doctorStatus[user.name]?C.green:C.red,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:8}}>●</span> {doctorStatus[user.name]?"Ready":"Busy"}
              </button>
            )}
          </div>
        </div>
        <div style={{flex:1,overflow:(page==="messages"||page==="flow")?"hidden":"auto"}} onClick={()=>setRecentDropOpen(false)}>
          {pages[page]}
        </div>
      </main>
    </div>
  );
}
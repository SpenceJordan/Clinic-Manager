
export const ROLE_LABEL = { admin:"Office admin", doctor:"Doctor", nurse:"Nurse", receptionist:"Receptionist" };
export const INIT_PATIENTS = [
  { id:1, first_name:"Margaret", last_name:"Chen",    dob:"1968-04-12", gender:"F", phone:"555-0142", insurance:"BlueCross",   allergies:["Penicillin","Sulfa"], lastVisit:"2026-02-10", active:true,  contactPref:"Call",  bestTime:"Morning",   dnc:false },
  { id:2, first_name:"Robert",   last_name:"Vásquez", dob:"1952-09-28", gender:"M", phone:"555-0198", insurance:"Medicare",     allergies:[],                    lastVisit:"2026-02-18", active:true,  contactPref:"Call",  bestTime:"Afternoon", dnc:false },
  { id:3, first_name:"Aisha",    last_name:"Okonkwo", dob:"1991-01-03", gender:"F", phone:"555-0277", insurance:"Aetna",        allergies:["Latex"],             lastVisit:"2026-01-30", active:true,  contactPref:"Text",  bestTime:"Either",    dnc:false },
  { id:4, first_name:"Derek",    last_name:"Marsh",   dob:"1985-07-19", gender:"M", phone:"555-0355", insurance:"UnitedHealth", allergies:[],                    lastVisit:"2026-02-20", active:true,  contactPref:"Email", bestTime:"Morning",   dnc:false },
  { id:5, first_name:"Yuki",     last_name:"Tanaka",  dob:"1977-11-05", gender:"F", phone:"555-0401", insurance:"Cigna",        allergies:["Aspirin"],           lastVisit:"2026-02-05", active:true,  contactPref:"Call",  bestTime:"Morning",   dnc:false },
  { id:6, first_name:"Thomas",   last_name:"Reilly",  dob:"1945-03-22", gender:"M", phone:"555-0532", insurance:"Medicare",     allergies:["Codeine"],           lastVisit:"2026-02-22", active:false, contactPref:"Call",  bestTime:"Morning",   dnc:true  },
];
export const INIT_LABS = {
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
export const INIT_PROBLEMS = {
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
export const ALLERGY_CROSS_REACTIVITY = {
  "Penicillin":    ["Amoxicillin","Ampicillin","Piperacillin","Nafcillin"],
  "Sulfa":         ["Sulfamethoxazole","Trimethoprim-Sulfamethoxazole","Sulfadiazine"],
  "Aspirin":       ["Ibuprofen","Naproxen","Celecoxib","Ketorolac"],
  "Codeine":       ["Morphine","Hydrocodone","Oxycodone","Tramadol"],
  "Latex":         ["Banana","Avocado","Kiwi"],
};
export const INIT_APPTS = [
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
export const INIT_RECALLS = [
  { id:1, patient:"Robert Vásquez", reason:"HbA1c recheck",       due:"2026-02-20", urgency:"high",   doctor:"Dr. Patel"    },
  { id:2, patient:"Thomas Reilly",  reason:"BP medication review", due:"2026-02-24", urgency:"high",   doctor:"Dr. Williams" },
  { id:3, patient:"Yuki Tanaka",    reason:"Annual physical",      due:"2026-03-01", urgency:"medium", doctor:"Dr. Patel"    },
  { id:4, patient:"Margaret Chen",  reason:"Cholesterol panel",    due:"2026-03-10", urgency:"low",    doctor:"Dr. Williams" },
];
export const INIT_CONTACT_LOGS = {
  1:[ { id:1, date:"2026-02-21", method:"Phone", outcome:"No answer — left voicemail" },
      { id:2, date:"2026-02-22", method:"Phone", outcome:"Reached patient, appointment pending" } ],
  2:[ { id:1, date:"2026-02-25", method:"Phone", outcome:"No answer" } ],
};
export const INIT_VITALS_FULL = {
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
export const INIT_RX = {
  1:[{ id:1, med:"Lisinopril",   dose:"10mg",  sig:"Once daily",            refills:3, date:"2026-02-10" }],
  2:[{ id:2, med:"Metformin",    dose:"500mg", sig:"Twice daily with food", refills:5, date:"2026-01-15" },
     { id:3, med:"Atorvastatin", dose:"20mg",  sig:"Once daily at bedtime", refills:2, date:"2026-01-15" }],
};
export const INIT_NOTES = {
  1:[{ id:1, date:"2026-02-10", doctor:"Dr. Patel", chief:"Routine follow-up for hypertension", assessment:"BP well controlled on current regimen.", plan:"Continue Lisinopril 10mg. Recheck in 3 months.", signed:true }],
};
export const INIT_INACTIVE_RX = {
  2:[ { id:100, med:"Glipizide", dose:"5mg", sig:"Once daily before breakfast", refills:0, date:"2025-08-01", active:false } ],
};
export const INIT_DOCTOR_STATUS = { "Dr. Priya Patel":true, "Dr. Owen Williams":true };
export const INIT_REMINDER_LOGS = {
  1:[{ id:1, method:"Auto-SMS", ts:"2026-02-24 08:00", outcome:"Sent", confirmed:true  }],
  3:[{ id:1, method:"Auto-SMS", ts:"2026-02-24 08:00", outcome:"Sent", confirmed:false }],
};
export const INIT_BLOCK_TIMES = [
  { id:1, doctor:"Dr. Patel", date:"2026-02-25", from:"12:00", to:"13:00", reason:"Lunch" },
];
export const INIT_WAITLIST = [
  { id:1, patient:"Yuki Tanaka", patientId:5, doctor:"Dr. Patel", preferredTime:"Morning", reason:"Annual exam rescheduled", addedDate:"2026-02-20", status:"waiting" },
];
export const INIT_REFILL_REQUESTS = [
  { id:1, patientId:1, patient:"Margaret Chen",  medication:"Lisinopril 10mg",  requestedBy:"nurse",        requestedByName:"James Torres",   date:"2026-02-25", status:"pending",  approvedBy:null,       note:"" },
  { id:2, patientId:2, patient:"Robert Vásquez", medication:"Metformin 500mg",  requestedBy:"receptionist", requestedByName:"Brianna Wells",   date:"2026-02-25", status:"approved", approvedBy:"Dr. Patel", note:"Approved — continue current dose" },
];
export const INIT_LOGIN_HISTORY = [
  { id:1, user:"Sandra Kim",       role:"admin",        username:"admin",        ts:"2026-02-25 08:30", status:"Success" },
  { id:2, user:"Dr. Priya Patel",  role:"doctor",       username:"doctor",       ts:"2026-02-25 08:14", status:"Success" },
  { id:3, user:"James Torres",     role:"nurse",        username:"nurse",        ts:"2026-02-25 08:02", status:"Success" },
  { id:4, user:"Brianna Wells",    role:"receptionist", username:"receptionist", ts:"2026-02-25 07:45", status:"Success" },
  { id:5, user:"Unknown user",     role:"-",            username:"jdoe",         ts:"2026-02-24 22:11", status:"Failed"  },
  { id:6, user:"Sandra Kim",       role:"admin",        username:"admin",        ts:"2026-02-24 08:22", status:"Success" },
];
export const INIT_FILES = {
  1:[{ id:1, name:"CBC Results Feb 2026.pdf",     type:"Lab Report", date:"2026-02-10", size:"142 KB"  }],
  2:[{ id:1, name:"Cardiology Referral.pdf",      type:"Referral",   date:"2026-01-20", size:"98 KB"   },
     { id:2, name:"Echocardiogram Report.pdf",    type:"Lab Report", date:"2026-01-22", size:"2.1 MB"  }],
  6:[{ id:1, name:"Advance Directive.pdf",        type:"Legal",      date:"2025-11-05", size:"215 KB"  }],
};
export const INIT_SETTINGS = {
  clinicName:"My Medical Clinic", address:"123 Main St, Springfield, IL 62701", phone:"(555) 000-0000",
  defaultDuration:30,
  clinicHours:{ Mon:["08:00","17:00"], Tue:["08:00","17:00"], Wed:["08:00","17:00"], Thu:["08:00","17:00"], Fri:["08:00","17:00"], Sat:["",""], Sun:["",""] },
  notifications:{ messages:true, recalls:true },
};
export const INIT_RX_HISTORY = {
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
export const DRUG_INTERACTIONS = [
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
export const VITAL_THRESHOLDS = {
  bpSystolic:  { low:90,  high:180, critHigh:200, label:"Systolic BP" },
  bpDiastolic: { low:60,  high:110, critHigh:120, label:"Diastolic BP" },
  hr:          { low:50,  high:100, critHigh:130, label:"Heart Rate" },
  temp:        { low:96,  high:99.5,critHigh:103, label:"Temperature" },
  o2:          { low:94,  high:100, critHigh:null, label:"O\u2082 Saturation" },
  weight:      { low:80,  high:400, critHigh:null, label:"Weight" },
};
export const INIT_INVENTORY = [
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
export const INIT_STAFF_SCHEDULE = [
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
export const INIT_VACCINES = {
  1:[
    { id:1, vaccine:"Influenza", date:"2025-10-01", given_by:"James Torres", lot:"FLU2025A", next_due:"2026-10-01" },
    { id:2, vaccine:"COVID-19 Booster", date:"2025-09-15", given_by:"James Torres", lot:"MOD2025B", next_due:null },
  ],
  2:[
    { id:1, vaccine:"Pneumococcal (PPSV23)", date:"2023-03-10", given_by:"Dr. Patel", lot:"PNM23C", next_due:null },
    { id:2, vaccine:"Shingles (Shingrix)", date:"2024-06-20", given_by:"Dr. Patel", lot:"SHX2024", next_due:"2025-06-20" },
  ],
};
export const INIT_REFERRALS = {
  2:[
    { id:1, specialist:"Cardiologist", facility:"St. Mary's Heart Center", reason:"Chest pain evaluation", sentDate:"2026-01-18", status:"received", notes:"Appointment scheduled for Feb 5" },
  ],
  1:[
    { id:1, specialist:"Endocrinologist", facility:"Springfield Endocrine", reason:"Thyroid nodule follow-up", sentDate:"2026-02-01", status:"sent", notes:"" },
  ],
};
export const INIT_TASKS = [
  { id:1, title:"Follow up with Robert Vásquez re: HbA1c results", assignedTo:"nurse", assignedBy:"doctor", assignedByName:"Dr. Priya Patel", patientId:2, patient:"Robert Vásquez", priority:"high", due:"2026-02-26", status:"pending", note:"" },
  { id:2, title:"Verify insurance for Aisha Okonkwo", assignedTo:"receptionist", assignedBy:"admin", assignedByName:"Sandra Kim", patientId:3, patient:"Aisha Okonkwo", priority:"medium", due:"2026-02-25", status:"pending", note:"" },
  { id:3, title:"Schedule follow-up for Margaret Chen - cholesterol panel", assignedTo:"receptionist", assignedBy:"doctor", assignedByName:"Dr. Priya Patel", patientId:1, patient:"Margaret Chen", priority:"low", due:"2026-03-01", status:"completed", note:"Scheduled for March 10" },
];
export const INIT_AUDIT_LOG = [
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
export const INIT_ACCOUNTS = [
  { id:1, name:"Dr. Priya Patel",   role:"doctor",       status:"active",   lastLogin:"2026-02-25 08:14", username:"doctor",       password:"Doctor1234!",   title:"Physician, MD",        demo:true },
  { id:2, name:"Dr. Owen Williams", role:"doctor",       status:"active",   lastLogin:"2026-02-25 07:58", username:"williams",     password:"Williams1234!", title:"Physician, MD" },
  { id:3, name:"James Torres",      role:"nurse",        status:"active",   lastLogin:"2026-02-25 08:02", username:"nurse",        password:"Nurse1234!",    title:"Registered Nurse",     demo:true },
  { id:4, name:"Brianna Wells",     role:"receptionist", status:"active",   lastLogin:"2026-02-25 07:45", username:"receptionist", password:"Recept1234!",   title:"Front Desk",           demo:true },
  { id:5, name:"Sandra Kim",        role:"admin",        status:"active",   lastLogin:"2026-02-25 08:30", username:"admin",        password:"Admin1234!",    title:"Office Administrator", demo:true },
  { id:6, name:"Marcus Reed",       role:"nurse",        status:"inactive", lastLogin:"2026-02-10 09:30", username:"mreed",        password:"Reed1234!",     title:"Registered Nurse" },
];
// Seed some initial messages between staff members
// Key format: "senderUsername:recipientUsername" sorted alphabetically
export const buildConvoKey = (a, b) => [a, b].sort().join(":");
export const INIT_MESSAGES = {
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

export const DEMO_TODAY="2026-02-25", DEMO_NOW="10:10";

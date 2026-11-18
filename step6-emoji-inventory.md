# Emoji and symbol inventory: components/App.jsx

Scope: every non-comment line of `components/App.jsx` in its current state (4720 lines). Excluded per instructions: the `RI` constant (line 332), the nav `icon` fields (lines 1316-1326), and print-window template strings (`w.document.write(...)` blocks, lines 2137 and 2893-2913). Box-drawing characters in comments are not rendered and are ignored.

**Note:** App.jsx was being edited while this inventory was built. About 13 lines were inserted above line 385, and three entries were already gone from the file (line 1537 `⚠`, lines 1550 and 1578 `✓`); those are dropped from the tables. Line numbers below match the current file.

## A. Icons and symbols to replace

### `Locked`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 385 | 🔒 | 1 | `<div style={{fontSize:36,marginBottom:16}}>🔒</div>` | Locked-state illustration | Lock (size 36, muted) |

### `Modal`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 398 | × | 1 | `…lignItems:"center",justifyContent:"center"}}>×</button>` | Modal close button | X |

### `OK`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 411 | ✓ | 1 | `…a-hidden style={{color:C.green,fontSize:14}}>✓</span><span style={{color:C.gree` | Success mark in inline OK banner | CircleCheck |

### `TimeInStage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 486 | ⏱ | 1 | `<span>⏱</span><span>{label}</span>` | Time-in-stage prefix | Timer |

### `NewApptModal`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 977 | ⚠ | 1 | `…,marginBottom:12,fontSize:12,color:C.amber}}>⚠ <strong>{blockedSlot.reason}</st` | Warning box for blocked slot | TriangleAlert |
| 982 | ⚠ | 1 | `…0,fontSize:13,color:C.amber,marginBottom:4}}>⚠ Scheduling Conflict</div>` | Warning heading: scheduling conflict | TriangleAlert |

### `NewPatientModal`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1039 | 📄 | 1 | `<div style={{fontSize:24,marginBottom:6}}>📄</div>` | Idle illustration in scan step | FileText |
| 1047 | 🔍 | 1 | `…om:10,animation:"pulse 0.8s ease infinite"}}>🔍</div>` | Scanning-state illustration (pulsing) | Search |
| 1057 | ✓ | 1 | `<span style={{fontSize:16}}>✓</span>` | Scan-complete mark | CircleCheck |
| 1059 | ✕ | 1 | `…ound:"none",border:"none",cursor:"pointer"}}>✕ Clear</button>` | Reset/clear scanned form button | X |

### `VitalsModal`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1090 | ⚠ | 1 | `…ay:"flex",gap:10,alignItems:"center"}}><span>⚠</span><span style={{color:C.red,` | Allergy warning above vitals form | TriangleAlert |

### `RxModal`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1179 | 🚫 | 1 | `<span style={{fontSize:16}}>🚫</span>` | Blocked/no-prescribe warning in Rx modal | Ban |
| 1185 | ⚠ | 1 | `<span style={{fontSize:16}}>⚠</span>` | Warning icon in Rx alert | TriangleAlert |
| 1191 | ⚠ | 1 | `<span style={{fontSize:16}}>⚠</span>` | Warning icon in Rx alert | TriangleAlert |

### `NoteModal`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1246 | 💊 | 1 | `<span style={{fontSize:16}}>💊</span>` | Medication banner icon (reconcile meds) | Pill |
| 1248 | ✓ | 1 | `…,whiteSpace:"nowrap"}}>Medications Confirmed ✓</button>` | Trailing check on confirmed-state button | remove (plain text 'Medications Confirmed'), or CircleCheck inline |
| 1251 | ✓ | 1 | `…ntWeight:500,color:C.muted,marginBottom:12}}>✓ Meds reconciled at {medsTs} by {` | Confirmation line prefix | CircleCheck (inline, 12px) |
| 1253 | 📝 | 1 | `…arginBottom:12,fontSize:12,color:C.navyMid}}>📝 Draft restored from previous ses` | Draft chief-complaint banner icon | NotebookPen |

### `TasksWidget`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1482 | ✓ | 1 | `…",color:C.muted,fontSize:13}}>No open tasks. ✓</div>}` | Empty-state tick in tasks widget | remove (plain text 'No open tasks.') |

### `FilesPopupModal`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1849 | 📄 | 1 | `<span style={{fontSize:20}}>📄</span>` | File row icon in files popup | FileText |

### `PatientFlowPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1879 | ✓ | 1 | `…rse":"Start Visit →","in-progress":"Complete ✓"};` | Trailing check in kanban action label | remove (plain 'Complete') or Check icon in button |
| 1917 | 🔔 | 1 | `<span style={{fontSize:16}}>🔔</span>` | Alert row icon | BellRing |
| 1920 | × | 1 | `…inter",padding:0,lineHeight:1,marginLeft:8}}>×</button>` | Dismiss alert button | X |
| 1942 | ● | 1 | `<span style={{fontSize:11}}>●</span>{doc.split(" ").pop()} {doc…` | Doctor availability status dot | plain CSS dot (span, 6px, border-radius 50%, green/grey) |
| 1961 | 📋 | 1 | `const emptyMsgs={"checked-in":["📋","No patients checked in"],"with-…` | Empty-state icon: checked-in column | ClipboardList |
| 1961 | 🩺 | 1 | `…"📋","No patients checked in"],"with-nurse":["🩺","No patients with nurse"],"in-p` | Empty-state icon: with-nurse column | Stethoscope |
| 1961 | 👨‍⚕️ | 1 | `…🩺","No patients with nurse"],"in-progress":["👨‍⚕️","No patients with doctor"],c` | Empty-state icon: in-progress column (ZWJ sequence, counted once) | Stethoscope |
| 1961 | ✓ | 1 | `…👨‍⚕️","No patients with doctor"],completed:["✓","No completed visits yet"],sche` | Empty-state icon: completed column | CircleCheck |
| 1961 | 📅 | 1 | `…:["✓","No completed visits yet"],scheduled:["📅","No patients scheduled"]};` | Empty-state icon: scheduled column | CalendarDays |

### `MiniCalendar`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 2031 | ‹ | 1 | `…t: 1, padding: "2px 8px", borderRadius: 4 }}>‹</button>` | Mini-calendar previous month | ChevronLeft |
| 2033 | › | 1 | `…t: 1, padding: "2px 8px", borderRadius: 4 }}>›</button>` | Mini-calendar next month | ChevronRight |

### `ApptsPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 2181 | ≡ | 1 | `{[["list","≡ List"],["day","⊟ Day"],["week","⊞…` | View switcher tab: List | List (icon + label) |
| 2181 | ⊟ | 1 | `{[["list","≡ List"],["day","⊟ Day"],["week","⊞ Week"],["waitlis…` | View switcher tab: Day | CalendarDays (icon + label) |
| 2181 | ⊞ | 1 | `{[["list","≡ List"],["day","⊟ Day"],["week","⊞ Week"],["waitlist","⏳ Waitlist"]]` | View switcher tab: Week | CalendarRange (icon + label) |
| 2181 | ⏳ | 1 | `…day","⊟ Day"],["week","⊞ Week"],["waitlist","⏳ Waitlist"]].map(([id,lbl]) => (` | View switcher tab: Waitlist | Hourglass (icon + label) |
| 2188 | 🖨 | 1 | `…ontSize:12,fontWeight:600,cursor:"pointer"}}>🖨 Print Day</button>}` | Print day schedule button | Printer |
| 2229 | 📅 | 1 | `…v style={{ fontSize: 28, marginBottom: 12 }}>📅</div>` | Empty-state illustration: no appointments | CalendarDays (size 28) |

### `VitalsTabContent`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 2437 | 🔴 | 1 | `<span>{a.level==="critical"?"🔴":"🟡"}</span>` | Vitals alert severity: critical | colored CSS dot (red) or CircleAlert in red |
| 2437 | 🟡 | 1 | `<span>{a.level==="critical"?"🔴":"🟡"}</span>` | Vitals alert severity: warning | colored CSS dot (amber) or CircleAlert in amber |
| 2445 | ✓ | 1 | `…{{fontSize:13,color:C.green,fontWeight:600}}>✓ Saved{alerts.length>0?" — review` | Saved confirmation prefix | CircleCheck |

### `CareGapsPanel`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 2530 | 🟡 | 1 | `gaps.push({id:"flu",icon:"🟡",label:"Annual flu vaccine overdu…` | Care-gap severity marker (data icon field, rendered) | colored CSS dot (amber) or Circle fill |
| 2536 | 🟡 | 1 | `if(!hasPneumo)gaps.push({id:"pneumo",icon:"🟡",label:"Pneumococcal vaccine not …` | Care-gap severity marker (amber) | colored CSS dot (amber) |
| 2541 | ⚠ | 1 | `if(!hasColono)gaps.push({id:"colon",icon:"⚠",label:"Colonoscopy screening not…` | Care-gap marker (warning) | TriangleAlert |
| 2549 | 🔴 | 1 | `gaps.push({id:"hba1c",icon:"🔴",label:"HbA1c not on record (diab…` | Care-gap severity marker (critical) | colored CSS dot (red) |
| 2552 | 🟡 | 1 | `…date)<monthsAgo6)gaps.push({id:"hba1c",icon:"🟡",label:"HbA1c overdue (>6 months` | Care-gap severity marker (amber) | colored CSS dot (amber) |
| 2559 | ⚠ | 1 | `if(daysSince>90)gaps.push({id:"bp",icon:"⚠",label:"BP check overdue (>3 mont…` | Care-gap marker (warning) | TriangleAlert |
| 2564 | 🟡 | 1 | `…f(daysSince>365)gaps.push({id:"annual",icon:"🟡",label:"Annual physical overdue"` | Care-gap severity marker (amber) | colored CSS dot (amber) |
| 2573 | ▲ | 1 | `…:C.muted,fontSize:12,fontWeight:500}}>{open?"▲":"▼"}</span>` | Care-gaps panel expand/collapse | ChevronUp |
| 2573 | ▼ | 1 | `…uted,fontSize:12,fontWeight:500}}>{open?"▲":"▼"}</span>` | Care-gaps panel expand/collapse | ChevronDown |
| 2577 | ✓ | 1 | `…ding:"16px 20px",fontSize:13,color:C.muted}}>✓ No care gaps identified.</div>}` | Empty-state tick | CircleCheck (or remove) |

### `StaffSchedulePage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 2737 | ‹ | 1 | `…ntWeight:600,cursor:"pointer",color:C.text}}>‹ Prev Week</button>` | Week navigation: previous | ChevronLeft (with label) |
| 2739 | › | 1 | `…00,cursor:"pointer",color:C.text}}>Next Week ›</button>` | Week navigation: next | ChevronRight (with label) |

### `PatientProfile`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 2924 | › | 1 | `<span>›</span>` | Breadcrumb separator | ChevronRight (size 12) |
| 2926 | › | 1 | `<span>›</span>` | Breadcrumb separator | ChevronRight (size 12) |
| 2930 | ← | 1 | `…ted,fontSize:13,cursor:"pointer",padding:0}}>← Back to Patients</button>` | Back to patient list | ArrowLeft (with label) |
| 2932 | ⎙ | 1 | `…C.surface,color:C.navyMid,cursor:"pointer"}}>⎙ Print Summary</button>` | Print patient summary button | Printer |
| 2933 | ⎙ | 1 | `…C.surface,color:C.navyMid,cursor:"pointer"}}>⎙ Print Rx</button>}` | Print prescription button | Printer |
| 2942 | ⛔ | 1 | `…,borderRadius:4,border:`1px solid #F5B7B1`}}>⛔ DNC</span>}` | Do-not-contact badge in profile header | Ban |
| 2947 | ⛔ | 1 | `…p:6,fontSize:12,color:C.red,fontWeight:600}}>⛔ Do Not Contact</div>` | Do-not-contact alert line | Ban |
| 2950 | 📞 | 1 | `📞 Preferred: <strong>{patient.conta…` | Contact preference line | Phone |
| 2955 | ⚠ | 1 | `…,fontSize:12,fontWeight:500,marginBottom:2}}>⚠ Allergies</div><div style={{colo` | Allergy warning heading | TriangleAlert |
| 2955 | ✓ | 1 | `…{{color:C.green,fontSize:12,fontWeight:600}}>✓ No Known Allergies</div></div>)}` | Success line: no allergies | CircleCheck |
| 2990 | 🔒 | 1 | `…lor:C.muted,fontSize:13,fontStyle:"italic"}}>🔒 Nurses and doctors only.</div>}` | Locked-state for vitals tab | Lock |
| 2994 | 🔒 | 1 | `…lor:C.muted,fontSize:13,fontStyle:"italic"}}>🔒 Doctors only.</div>}` | Locked-state for prescriptions tab | Lock |
| 3023 | ⛔ | 1 | `…c?<span style={{color:C.red,fontWeight:600}}>⛔ Do Not Contact — all outreach bl` | DNC warning in contact section | Ban |
| 3130 | ▲ | 1 | `….muted,cursor:"pointer"}}>History {histOpen?"▲":"▼"}</button>` | Rx history expand/collapse | ChevronUp |
| 3130 | ▼ | 1 | `…ed,cursor:"pointer"}}>History {histOpen?"▲":"▼"}</button>` | Rx history expand/collapse | ChevronDown |
| 3228 | × | 1 | `…or:"pointer",fontSize:16,padding:"2px 4px"}}>×</button>` | Remove lab result row | X |
| 3259 | ▲ | 1 | `…C.muted,fontSize:12,fontWeight:500}}>{isExp?"▲":"▼"}</span>` | Lab result expand/collapse | ChevronUp |
| 3259 | ▼ | 1 | `…ted,fontSize:12,fontWeight:500}}>{isExp?"▲":"▼"}</span>` | Lab result expand/collapse | ChevronDown |
| 3275 | ↑ | 1 | `…ding:"8px 12px"}}>{isHigh?<Badge color="red">↑ HIGH</Badge>:isLow?<Badge color=` | Abnormal-high lab badge | ArrowUp (inline 12px, in Badge) |
| 3275 | ↓ | 1 | `…red">↑ HIGH</Badge>:isLow?<Badge color="red">↓ LOW</Badge>:<span style={{fontSi` | Abnormal-low lab badge | ArrowDown (inline 12px, in Badge) |
| 3287 | 🧪 | 1 | `…}}><div style={{fontSize:28,marginBottom:8}}>🧪</div>No lab results on file.</di` | Empty-state illustration: no lab results | FlaskConical |
| 3371 | 📄 | 1 | `…ng:"12px 16px",fontWeight:600,color:C.text}}>📄 {f.name}</td>` | File name cell icon | FileText |
| 3380 | 📁 | 1 | `<div style={{fontSize:28,marginBottom:8}}>📁</div>` | Empty-state illustration: no files | Folder (size 28) |
| 3479 | 📋 | 1 | `…}}><div style={{fontSize:28,marginBottom:8}}>📋</div><div style={{color:C.muted,` | Empty-state illustration: no notes | ClipboardList (size 28) |
| 3489 | 🗓 | 1 | `const typeIcon={appointment:"🗓",note:"📋",vitals:"📊"};` | Timeline icon: appointment event | CalendarDays |
| 3489 | 📋 | 1 | `const typeIcon={appointment:"🗓",note:"📋",vitals:"📊"};` | Timeline icon: note event | ClipboardList |
| 3489 | 📊 | 1 | `…t typeIcon={appointment:"🗓",note:"📋",vitals:"📊"};` | Timeline icon: vitals event | ChartColumn |

### `PatientsPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 3605 | ♻ | 1 | `…ontSize:12,fontWeight:600,cursor:"pointer"}}>♻ Refill Queue</button>}` | Refill queue shortcut button | RefreshCw (with label) |
| 3631 | ✕ | 1 | `…"pointer",whiteSpace:"nowrap",flexShrink:0}}>✕ Clear</button>}` | Clear filters button | X |
| 3651 | ▾ | 1 | `…ace,color:C.muted,cursor:"pointer"}}>Actions ▾</button>` | Row quick-actions menu toggle | ChevronDown (with label) |
| 3672 | 🔍 | 1 | `<div style={{fontSize:28,marginBottom:10}}>🔍</div>` | Empty-state illustration: no search results | Search (size 28) |

### `RecallsPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 3727 | ✅ | 1 | `<span style={{fontSize:24}}>✅</span>` | Success illustration: pending appointment booked | CircleCheckBig (size 24) |
| 3753 | 📅 | 1 | `<PB onClick={()=>setShowBookAppt(true)}>📅 Book Appointment</PB>` | Book appointment button icon | CalendarPlus |
| 3762 | ✓ | 1 | `…ontSize:12,fontWeight:600,cursor:"pointer"}}>✓ Complete {checked.size} selected` | Bulk-complete button prefix | Check |
| 3783 | ✓ | 1 | `…}><div style={{fontSize:36,marginBottom:10}}>✓</div><div style={{fontWeight:600` | Empty-state 'All clear!' illustration | CircleCheckBig (size 36) |
| 3794 | ⚠ | 1 | `…ency==="high"?600:400}}>{r.urgency==="high"?"⚠ Overdue — ":"Due "}{fmt(r.due)}<` | High-urgency recall label | TriangleAlert (inline 12px) |
| 3796 | ▲ | 1 | `…ngth>1?"s":""}`:"+Log Contact"} {isExpanded?"▲":"▼"}</button>` | Recall contact log expand/collapse | ChevronUp |
| 3796 | ▼ | 1 | `…>1?"s":""}`:"+Log Contact"} {isExpanded?"▲":"▼"}</button>` | Recall contact log expand/collapse | ChevronDown |

### `SettingsPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 3899 | ⚙ | 1 | `<span style={{fontSize:16}}>⚙</span>` | Admin card icon in settings | ShieldCheck or Settings |
| 4007 | ✓ | 1 | `…{{color:C.green,fontSize:13,fontWeight:600}}>✓ Saved</span>}` | Saved confirmation prefix | CircleCheck |

### `RefillQueuePage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 4095 | ✓ | 1 | `…Align:"center"}}>No pending refill requests. ✓</div>}` | Empty-state tick in refill queue | remove (plain text) |
| 4114 | ✓ | 1 | `…ontSize:13,fontWeight:600,cursor:"pointer"}}>✓ Approve</button>` | Approve refill button prefix | Check |
| 4115 | ✗ | 1 | `…ontSize:13,fontWeight:600,cursor:"pointer"}}>✗ Deny</button>` | Deny refill button prefix | X |

### `GlobalSearch`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 4155 | 🔍 | 1 | `<span style={{fontSize:16,color:C.muted}}>🔍</span>` | Global search input icon | Search |
| 4157 | × | 1 | `…C.muted,cursor:"pointer",padding:"2px 6px"}}>×</button>` | Global search close button | X |
| 4178 | 📅 | 1 | `<span style={{fontSize:16}}>📅</span>` | Appointment result icon in global search | CalendarDays |

### `EndOfDayModal`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 4233 | 🌙 | 1 | `<div style={{fontSize:24,marginBottom:6}}>🌙</div>` | End-of-day illustration | Moon |
| 4246 | ✓ | 1 | `<PB onClick={onClose} disabled={!allChecked}>✓ Done for the Day</PB>` | Done button prefix | Check |

### `TasksPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 4373 | ▲ | 1 | `…C.muted,fontSize:12,fontWeight:500}}>{isExp?"▲":"▼"}</span>` | Task expand/collapse | ChevronUp |
| 4373 | ▼ | 1 | `…ted,fontSize:12,fontWeight:500}}>{isExp?"▲":"▼"}</span>` | Task expand/collapse | ChevronDown |

### `App`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 4682 | ✓ | 1 | `…minWidth:280}}><span>{toast.color==="green"?"✓":toast.color==="amber"?"⚠":"✗"}<` | Toast icon: success (green) | CircleCheck |
| 4682 | ⚠ | 1 | `…t.color==="green"?"✓":toast.color==="amber"?"⚠":"✗"}</span>{toast.msg}</div>}` | Toast icon: warning (amber) | TriangleAlert |
| 4682 | ✗ | 1 | `…lor==="green"?"✓":toast.color==="amber"?"⚠":"✗"}</span>{toast.msg}</div>}` | Toast icon: error (red) | CircleX |
| 4691 | ▾ | 1 | `Recent <span style={{fontSize:11}}>▾</span>` | Recent-section dropdown caret | ChevronDown |
| 4707 | ● | 1 | `<span style={{fontSize:11}}>●</span> {doctorStatus[user.name]?"…` | Doctor status dot (header) | plain CSS dot (span, 6px, border-radius 50%) |

## B. Text arrows (may be kept)

### `FlowWidget`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1454 | → | 1 | `…,border:"none",cursor:"pointer"}}>Full board →</button></div>` | Link text arrow | keep (text) |

### `TasksWidget`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1480 | → | 1 | `…",border:"none",cursor:"pointer"}}>All tasks →</button>` | Link text arrow | keep (text) |

### `Dashboard`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1578 | → | 1 | `…e",border:"none",cursor:"pointer"}}>View all →</button></div>` | Link text arrow | keep (text) |
| 1616 | → | 1 | `…e",border:"none",cursor:"pointer"}}>Schedule →</button></div>` | Link text arrow | keep (text) |

### `PatientFlowPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 1879 | → | 3 | `const BTN_LABEL={"scheduled":"Check In →","checked-in":"To Nurse →","with-…` | Kanban action button labels | keep (text) |
| 1982 | → | 1 | `…fff",cursor:"pointer"}}>{BTN_LABEL[col.id]\|\|"→"}</button>}` | Fallback kanban button label | keep (text) |

### `ApptsPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 2277 | → | 1 | `{BTN_LABEL[a.status]\|\|"→"}` | Fallback action button label | keep (text) |

### `SettingsPage`

| Line | Char | Count | Snippet (current file) | Meaning in UI | Suggested replacement |
|---|---|---|---|---|---|
| 3901 | → | 1 | `…ng:"6px 16px",cursor:"pointer"}}>Go to Admin →</button>` | Link text arrow | keep (text) |

## C. Non-icon characters kept as text

- `·` (30 lines: 710, 1479, 1493, 1536, 1549, 1570, 1599, 1671, 1852, 1923, 1937, 2160, 2355, 2945, 2950, 2994, 3023, 3154, 3255, 3349, 3603, 3644, 3795, 4102, 4130, 4167, 4179, 4331, 4366, 4367): middle-dot separator in meta text (e.g. 'Age · Gender')
- `°` (4 lines: 1096, 2421, 2426, 2990): '°F' unit text in vitals labels
- `₂` (3 lines: 1096, 2463, 2990): 'O₂' subscript text in labels and table headers
- `≈` (1 lines: 1198): '≈' approximate prefix in Rx days-supply hint (line 1198); plain text, keep
- `µ` (3 lines: 21, 22, 25): unit text 'K/µL' / 'M/µL' in mock lab data
- Accented letters in mock patient names (e.g. 'Vásquez') are data, not symbols; not listed.

## D. Skipped by instruction

- Line 332: `RI` constant (⚙ ⚕ ♥ ◉)
- Lines 1316-1326: nav array `icon` fields (▦ ◷ ⊞ ◉ ♻ ◎ ▣ ✓ 📦 📅 ⚙)
- Line 2137: Daily Schedule print template (ApptsPage), no symbols on the line
- Lines 2893-2913: Prescription and Patient Summary print templates (℞ ⚠ · ° ₂ inside `w.document.write`)

## Totals per character

| Char | Occurrences | Section |
|---|---|---|
| ✓ | 17 | A (replace) |
| ⚠ | 10 | A (replace) |
| 🟡 | 5 | A (replace) |
| ▲ | 5 | A (replace) |
| ▼ | 5 | A (replace) |
| × | 4 | A (replace) |
| 📅 | 4 | A (replace) |
| › | 4 | A (replace) |
| 🔒 | 3 | A (replace) |
| 📄 | 3 | A (replace) |
| 🔍 | 3 | A (replace) |
| 📋 | 3 | A (replace) |
| ⛔ | 3 | A (replace) |
| ✕ | 2 | A (replace) |
| ● | 2 | A (replace) |
| ‹ | 2 | A (replace) |
| 🔴 | 2 | A (replace) |
| ⎙ | 2 | A (replace) |
| ▾ | 2 | A (replace) |
| ✗ | 2 | A (replace) |
| ⏱ | 1 | A (replace) |
| 🚫 | 1 | A (replace) |
| 💊 | 1 | A (replace) |
| 📝 | 1 | A (replace) |
| 🔔 | 1 | A (replace) |
| 🩺 | 1 | A (replace) |
| 👨‍⚕️ | 1 | A (replace) |
| ≡ | 1 | A (replace) |
| ⊟ | 1 | A (replace) |
| ⊞ | 1 | A (replace) |
| ⏳ | 1 | A (replace) |
| 🖨 | 1 | A (replace) |
| ← | 1 | A (replace) |
| 📞 | 1 | A (replace) |
| ↑ | 1 | A (replace) |
| ↓ | 1 | A (replace) |
| 🧪 | 1 | A (replace) |
| 📁 | 1 | A (replace) |
| 🗓 | 1 | A (replace) |
| 📊 | 1 | A (replace) |
| ♻ | 1 | A (replace) |
| ✅ | 1 | A (replace) |
| ⚙ | 1 | A (replace) |
| 🌙 | 1 | A (replace) |
| → | 10 | B (text arrow, keep) |

Total to replace: 107 occurrences across 107 line entries. Text arrows kept: 10.

Note: the `👨‍⚕️` sequence on the in-progress empty state (line 1961) is counted once in the table and as one emoji in the totals.

## Verified lucide-react names

Checked with `require("lucide-react")` (all true): Check, X, CircleCheck, CircleCheckBig, CircleX, CircleAlert, TriangleAlert, Ban, Lock, Search, Settings, ShieldCheck, ClipboardList, FileText, NotebookPen, Stethoscope, Pill, RefreshCw, Recycle, Printer, Timer, Hourglass, List, CalendarDays, CalendarRange, CalendarClock, CalendarPlus, ChartColumn, Phone, FlaskConical, Moon, Folder, BellRing, Users, Package, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, HeartPulse, Circle, CircleDot, Workflow, Columns3, LayoutDashboard, Target.

`lucide-react` is already imported on line 3 of App.jsx, so the new names can be added to that import.

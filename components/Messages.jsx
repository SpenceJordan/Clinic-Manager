import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, MessageSquare, Maximize2, Minimize2, ArrowUp } from "lucide-react";
import { useStaff } from "./lib/accounts";
import { buildConvoKey } from "./lib/data";
import { fmt, nowTime, today } from "./lib/utils";
import { C, Icon, StaffAvatar } from "./ui";

// ─── MESSAGES PAGE ──────────────────────────────────────────────────────────
export function MessagesPage({ user, messages, setMessages, compact = false, contactId, setContactId, onMinimize }) {
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
export function MessagesDock({ user, messages, setMessages, unread, open, setOpen, contactId, setContactId, onMaximize }) {
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

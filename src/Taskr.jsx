import { useState, useEffect, useRef, useMemo } from "react";

const GOLD = "#C9A84C";
const GOLD_BRIGHT = "#F0C040";
const GOLD_DIM = "rgba(201,168,76,0.15)";
const GOLD_BORDER = "rgba(201,168,76,0.3)";
const BG = "#0a0a0a";
const SURFACE = "#111111";
const SURFACE2 = "#1a1a1a";
const SURFACE3 = "#222222";
const BORDER = "#2a2a2a";
const TEXT = "#f0e6cc";
const TEXT_MUTED = "#6b6050";
const TEXT_DIM = "#9a8870";

const CATEGORIES = ["work", "personal", "study", "other"];
const CAT_META = {
  work:     { icon: "◆", color: "#5a9aba", bg: "rgba(58,90,122,0.15)", border: "#3a5a7a" },
  personal: { icon: "◆", color: "#6aaa6a", bg: "rgba(74,122,74,0.15)",  border: "#4a7a4a" },
  study:    { icon: "◆", color: "#baa060", bg: "rgba(122,106,58,0.15)", border: "#7a6a3a" },
  other:    { icon: "◆", color: "#9a6aba", bg: "rgba(90,58,122,0.15)",  border: "#5a3a7a" },
};
const PRIORITY_META = {
  low:    { label: "Low",    color: "#6aaa6a" },
  medium: { label: "Medium", color: GOLD },
  high:   { label: "High",   color: "#c05050" },
};

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("taskr-v2") || "[]"); } catch { return []; }
  });
  useEffect(() => { localStorage.setItem("taskr-v2", JSON.stringify(tasks)); }, [tasks]);
  const add = (text, cat, priority, dueDate, notes) => {
    setTasks(prev => [{
      id: uid(), text, category: cat, priority: priority || "medium",
      dueDate: dueDate || null, notes: notes || "", done: false,
      createdAt: Date.now(), pinned: false,
    }, ...prev]);
  };
  const remove = id => setTasks(prev => prev.filter(t => t.id !== id));
  const toggle = id => setTasks(prev => prev.map(t => t.id === id ? {...t, done: !t.done} : t));
  const pin    = id => setTasks(prev => prev.map(t => t.id === id ? {...t, pinned: !t.pinned} : t));
  const edit   = (id, updates) => setTasks(prev => prev.map(t => t.id === id ? {...t, ...updates} : t));
  const clearDone = () => setTasks(prev => prev.filter(t => !t.done));
  return { tasks, add, remove, toggle, pin, edit, clearDone };
}

const styles = {
  app: { display:"flex", height:"100vh", overflow:"hidden", background:BG, color:TEXT,
         fontFamily:"'DM Mono', 'Courier New', monospace", fontSize:"14px" },
  sidebar: { width:"240px", minWidth:"240px", background:SURFACE, borderRight:`1px solid ${BORDER}`,
             display:"flex", flexDirection:"column", padding:"28px 20px", gap:"32px", overflowY:"auto" },
  brand: { display:"flex", alignItems:"center", gap:"10px" },
  brandDot: { width:"10px", height:"10px", borderRadius:"50%", background:GOLD,
              boxShadow:`0 0 12px ${GOLD}`, flexShrink:0 },
  brandH1: { fontFamily:"'Cinzel', 'Georgia', serif", fontSize:"22px", fontWeight:"700",
             letterSpacing:"2px", color:GOLD, margin:0 },
  navLabel: { fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase",
              color:TEXT_MUTED, marginBottom:"10px" },
  catList: { listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"4px" },
  catItem: (active) => ({
    display:"flex", alignItems:"center", gap:"10px", padding:"9px 12px",
    borderRadius:"8px", cursor:"pointer", fontSize:"13px", transition:"all 0.2s",
    border:`1px solid ${active ? GOLD_BORDER : "transparent"}`,
    background: active ? GOLD_DIM : "transparent",
    color: active ? TEXT : TEXT_DIM,
  }),
  catCount: (active) => ({
    marginLeft:"auto", fontSize:"11px", padding:"1px 7px", borderRadius:"20px",
    background: active ? "rgba(201,168,76,0.2)" : SURFACE3,
    color: active ? GOLD : TEXT_MUTED,
  }),
  sidebarFooter: { marginTop:"auto", borderTop:`1px solid ${BORDER}`, paddingTop:"16px",
                   fontSize:"12px", color:TEXT_MUTED },
  main: { flex:1, overflowY:"auto", padding:"36px 40px", display:"flex",
          flexDirection:"column", gap:"28px" },
  mainHeader: { borderBottom:`1px solid ${BORDER}`, paddingBottom:"16px" },
  mainTitle: { fontFamily:"'Cinzel', 'Georgia', serif", fontSize:"26px", fontWeight:"700",
               letterSpacing:"1px", color:GOLD, margin:0 },
  mainSub: { color:TEXT_MUTED, fontSize:"13px", marginTop:"4px" },
  taskBar: { display:"flex", gap:"10px", alignItems:"center", background:SURFACE,
             border:`1px solid ${BORDER}`, borderRadius:"10px", padding:"12px 14px",
             flexWrap:"wrap" },
  input: { flex:1, minWidth:"160px", background:"transparent", border:"none", outline:"none",
           fontFamily:"inherit", fontSize:"14px", color:TEXT },
  select: { background:SURFACE2, border:`1px solid ${BORDER}`, borderRadius:"6px",
            color:TEXT_DIM, fontFamily:"inherit", fontSize:"12px", padding:"6px 10px",
            cursor:"pointer", outline:"none" },
  addBtn: { background:GOLD, border:"none", color:"#0a0a0a", fontFamily:"inherit",
            fontSize:"13px", fontWeight:"600", padding:"8px 18px", borderRadius:"6px",
            cursor:"pointer", whiteSpace:"nowrap", letterSpacing:"0.5px" },
  expandBtn: { background:SURFACE2, border:`1px solid ${BORDER}`, color:TEXT_DIM,
               fontFamily:"inherit", fontSize:"12px", padding:"8px 12px", borderRadius:"6px",
               cursor:"pointer" },
  expandPanel: { background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:"10px",
                 padding:"14px 16px", display:"grid", gap:"10px",
                 gridTemplateColumns:"1fr 1fr 1fr" },
  expandInput: { background:SURFACE2, border:`1px solid ${BORDER}`, borderRadius:"6px",
                 color:TEXT, fontFamily:"inherit", fontSize:"13px", padding:"7px 10px",
                 outline:"none", width:"100%" },
  sectionLabel: { fontSize:"10px", letterSpacing:"2.5px", color:TEXT_MUTED,
                  paddingBottom:"8px", borderBottom:`1px solid ${BORDER}`,
                  display:"flex", alignItems:"center", justifyContent:"space-between" },
  taskList: { listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"8px" },
  emptyState: { fontSize:"13px", color:TEXT_MUTED, padding:"10px 0" },
  card: (done, pinned) => ({
    display:"flex", alignItems:"flex-start", gap:"12px", background: pinned ? "rgba(201,168,76,0.04)" : SURFACE,
    border:`1px solid ${pinned ? GOLD_BORDER : BORDER}`, borderRadius:"10px",
    padding:"13px 16px", transition:"border-color 0.2s, background 0.2s",
    opacity: done ? 0.55 : 1, position:"relative",
  }),
  check: (checked) => ({
    width:"18px", height:"18px", minWidth:"18px", borderRadius:"50%", border:`2px solid ${checked ? GOLD : BORDER}`,
    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
    background: checked ? GOLD : "transparent", transition:"all 0.2s", marginTop:"1px",
    fontSize:"10px", color:"#0a0a0a",
  }),
  taskText: (done) => ({
    flex:1, fontSize:"14px", color: done ? TEXT_MUTED : TEXT, lineHeight:"1.4",
    textDecoration: done ? "line-through" : "none",
  }),
  tag: (cat) => ({
    fontSize:"10px", letterSpacing:"1px", textTransform:"uppercase", padding:"3px 9px",
    borderRadius:"20px", border:`1px solid ${CAT_META[cat]?.border || BORDER}`,
    color: CAT_META[cat]?.color || TEXT_MUTED, background: CAT_META[cat]?.bg || SURFACE2,
    whiteSpace:"nowrap",
  }),
  priorityDot: (p) => ({
    width:"7px", height:"7px", borderRadius:"50%", background: PRIORITY_META[p]?.color || GOLD,
    flexShrink:0, marginTop:"5px",
  }),
  iconBtn: { background:"transparent", border:"none", cursor:"pointer", padding:"2px 5px",
             borderRadius:"4px", fontSize:"14px", color:TEXT_MUTED, lineHeight:1 },
  dueBadge: (overdue) => ({
    fontSize:"10px", padding:"2px 7px", borderRadius:"20px",
    border:`1px solid ${overdue ? "#c05050" : BORDER}`,
    color: overdue ? "#c05050" : TEXT_MUTED, background:"transparent", whiteSpace:"nowrap",
  }),
  toolbar: { display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" },
  toolBtn: (active) => ({
    background: active ? GOLD_DIM : "transparent", border:`1px solid ${active ? GOLD_BORDER : BORDER}`,
    color: active ? GOLD : TEXT_DIM, fontFamily:"inherit", fontSize:"12px",
    padding:"5px 12px", borderRadius:"6px", cursor:"pointer",
  }),
  searchBar: { display:"flex", alignItems:"center", gap:"8px", background:SURFACE,
               border:`1px solid ${BORDER}`, borderRadius:"8px", padding:"7px 12px" },
  searchInput: { background:"transparent", border:"none", outline:"none", fontFamily:"inherit",
                 fontSize:"13px", color:TEXT, flex:1 },
  notes: { fontSize:"12px", color:TEXT_MUTED, marginTop:"4px", fontStyle:"italic" },
  modal: { position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", display:"flex",
           alignItems:"center", justifyContent:"center", zIndex:1000 },
  modalBox: { background:SURFACE, border:`1px solid ${GOLD_BORDER}`, borderRadius:"12px",
              padding:"28px", width:"420px", maxWidth:"95vw", display:"flex",
              flexDirection:"column", gap:"16px" },
  modalTitle: { fontFamily:"'Cinzel', serif", color:GOLD, fontSize:"18px", margin:0 },
  modalLabel: { fontSize:"11px", letterSpacing:"1.5px", textTransform:"uppercase",
                color:TEXT_MUTED, marginBottom:"4px" },
  modalInput: { width:"100%", background:SURFACE2, border:`1px solid ${BORDER}`,
                borderRadius:"6px", color:TEXT, fontFamily:"inherit", fontSize:"14px",
                padding:"9px 12px", outline:"none", boxSizing:"border-box" },
  modalTextarea: { width:"100%", background:SURFACE2, border:`1px solid ${BORDER}`,
                   borderRadius:"6px", color:TEXT, fontFamily:"inherit", fontSize:"13px",
                   padding:"9px 12px", outline:"none", resize:"vertical", minHeight:"80px",
                   boxSizing:"border-box" },
  progressBar: { height:"4px", background:SURFACE2, borderRadius:"2px", overflow:"hidden" },
  progressFill: (pct) => ({
    height:"100%", width:`${pct}%`, background:`linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})`,
    borderRadius:"2px", transition:"width 0.5s ease",
  }),
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"10px" },
  statCard: { background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:"8px",
              padding:"12px 14px", textAlign:"center" },
  statNum: { fontSize:"22px", fontWeight:"600", color:GOLD, fontFamily:"'Cinzel', serif" },
  statLabel: { fontSize:"11px", color:TEXT_MUTED, marginTop:"2px" },
};

function EditModal({ task, onSave, onClose }) {
  const [text, setText] = useState(task.text);
  const [cat, setCat] = useState(task.category);
  const [priority, setPriority] = useState(task.priority);
  const [due, setDue] = useState(task.dueDate || "");
  const [notes, setNotes] = useState(task.notes || "");
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalBox} onClick={e => e.stopPropagation()}>
        <p style={styles.modalTitle}>Edit Task</p>
        <div>
          <p style={styles.modalLabel}>Task</p>
          <input style={styles.modalInput} value={text} onChange={e => setText(e.target.value)} />
        </div>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px"}}>
          <div>
            <p style={styles.modalLabel}>Category</p>
            <select style={{...styles.select, width:"100%"}} value={cat} onChange={e=>setCat(e.target.value)}>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <p style={styles.modalLabel}>Priority</p>
            <select style={{...styles.select, width:"100%"}} value={priority} onChange={e=>setPriority(e.target.value)}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
          </div>
          <div>
            <p style={styles.modalLabel}>Due Date</p>
            <input type="date" style={{...styles.modalInput, fontSize:"12px"}} value={due} onChange={e=>setDue(e.target.value)} />
          </div>
        </div>
        <div>
          <p style={styles.modalLabel}>Notes</p>
          <textarea style={styles.modalTextarea} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any notes..." />
        </div>
        <div style={{display:"flex", gap:"10px", justifyContent:"flex-end"}}>
          <button style={{...styles.toolBtn(false), padding:"8px 18px"}} onClick={onClose}>Cancel</button>
          <button style={{...styles.addBtn}} onClick={()=>{onSave({text,category:cat,priority,dueDate:due||null,notes}); onClose();}}>Save</button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({ task, onToggle, onDelete, onPin, onEdit }) {
  const [hovered, setHovered] = useState(false);
  const overdue = task.dueDate && !task.done && new Date(task.dueDate) < new Date();
  return (
    <li style={{...styles.card(task.done, task.pinned), outline: hovered ? `1px solid ${BORDER}` : "none"}}
        onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>
      <div style={styles.priorityDot(task.priority)} title={`Priority: ${task.priority}`} />
      <div style={styles.check(task.done)} onClick={()=>onToggle(task.id)}>
        {task.done && "✓"}
      </div>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap"}}>
          <span style={styles.taskText(task.done)}>{task.text}</span>
          <span style={styles.tag(task.category)}>{task.category}</span>
          {task.dueDate && <span style={styles.dueBadge(overdue)}>{overdue ? "⚠ " : ""}{task.dueDate}</span>}
          {task.pinned && <span style={{fontSize:"12px", color:GOLD}}>📌</span>}
        </div>
        {task.notes && <p style={styles.notes}>{task.notes}</p>}
      </div>
      <div style={{display:"flex", gap:"2px", opacity: hovered ? 1 : 0, transition:"opacity 0.15s"}}>
        <button style={styles.iconBtn} title="Pin" onClick={()=>onPin(task.id)}>{task.pinned?"🗓":"📌"}</button>
        <button style={styles.iconBtn} title="Edit" onClick={()=>onEdit(task)}>✎</button>
        <button style={{...styles.iconBtn, color:"#c05050"}} title="Delete" onClick={()=>onDelete(task.id)}>×</button>
      </div>
    </li>
  );
}

export default function Taskr() {
  const { tasks, add, remove, toggle, pin, edit, clearDone } = useTasks();
  const [activeCat, setActiveCat] = useState("all");
  const [text, setText] = useState("");
  const [cat, setCat] = useState("work");
  const [priority, setPriority] = useState("medium");
  const [due, setDue] = useState("");
  const [notes, setNotes] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [filterPriority, setFilterPriority] = useState("all");
  const [editingTask, setEditingTask] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const inputRef = useRef();

  const catHeaders = {
    all:["All Tasks","What needs to get done?"],
    work:["Work","Stay on top of your work tasks."],
    personal:["Personal","Your personal to-dos."],
    study:["Study","Keep up with your coursework."],
    other:["Other","Everything else."],
  };

  const filtered = useMemo(() => {
    let t = activeCat === "all" ? tasks : tasks.filter(x => x.category === activeCat);
    if (filterPriority !== "all") t = t.filter(x => x.priority === filterPriority);
    if (search) t = t.filter(x => x.text.toLowerCase().includes(search.toLowerCase()) || x.notes?.toLowerCase().includes(search.toLowerCase()));
    const pinned = t.filter(x => x.pinned && !x.done);
    const active = t.filter(x => !x.pinned && !x.done);
    const done   = t.filter(x => x.done);
    const sort = arr => {
      if (sortBy === "priority") {
        const order = {high:0, medium:1, low:2};
        return [...arr].sort((a,b) => order[a.priority]-order[b.priority]);
      }
      if (sortBy === "due") return [...arr].sort((a,b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1; if (!b.dueDate) return -1;
        return new Date(a.dueDate)-new Date(b.dueDate);
      });
      if (sortBy === "az") return [...arr].sort((a,b)=>a.text.localeCompare(b.text));
      return arr;
    };
    return { pinned, active: sort(active), done };
  }, [tasks, activeCat, filterPriority, search, sortBy]);

  const counts = useMemo(() => {
    const active = tasks.filter(t=>!t.done);
    const all = active.length;
    const bycat = {};
    CATEGORIES.forEach(c => { bycat[c] = active.filter(t=>t.category===c).length; });
    return { all, ...bycat };
  }, [tasks]);

  const stats = useMemo(() => {
    const done = tasks.filter(t=>t.done).length;
    const total = tasks.length;
    const overdue = tasks.filter(t=>t.dueDate && !t.done && new Date(t.dueDate)<new Date()).length;
    const pct = total ? Math.round((done/total)*100) : 0;
    return { done, total, overdue, pct };
  }, [tasks]);

  const handleAdd = () => {
    if (!text.trim()) { inputRef.current?.focus(); return; }
    add(text.trim(), cat, priority, due, notes);
    setText(""); setDue(""); setNotes("");
    inputRef.current?.focus();
  };

  const [title, sub] = catHeaders[activeCat];

  return (
    <div style={styles.app}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      {editingTask && <EditModal task={editingTask} onSave={u => edit(editingTask.id, u)} onClose={()=>setEditingTask(null)} />}

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandDot} />
          <h1 style={styles.brandH1}>TASKR</h1>
        </div>

        {/* Search */}
        <div style={styles.searchBar}>
          <span style={{color:TEXT_MUTED, fontSize:"12px"}}>⌕</span>
          <input style={styles.searchInput} placeholder="Search tasks..." value={search} onChange={e=>setSearch(e.target.value)} />
          {search && <span style={{cursor:"pointer", color:TEXT_MUTED, fontSize:"14px"}} onClick={()=>setSearch("")}>×</span>}
        </div>

        {/* Categories */}
        <nav>
          <p style={styles.navLabel}>Categories</p>
          <ul style={styles.catList}>
            {["all",...CATEGORIES].map(c => (
              <li key={c} style={styles.catItem(activeCat===c)} onClick={()=>setActiveCat(c)}>
                <span style={{fontSize:"8px", color:activeCat===c?GOLD:TEXT_MUTED}}>◈</span>
                <span style={{flex:1, textTransform:"capitalize"}}>{c==="all"?"All Tasks":c}</span>
                <span style={styles.catCount(activeCat===c)}>{counts[c]||0}</span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Progress */}
        <div>
          <p style={styles.navLabel}>Progress</p>
          <div style={styles.progressBar}>
            <div style={styles.progressFill(stats.pct)} />
          </div>
          <p style={{fontSize:"11px", color:TEXT_MUTED, marginTop:"6px"}}>{stats.pct}% complete — {stats.done}/{stats.total} tasks</p>
          {stats.overdue > 0 && <p style={{fontSize:"11px", color:"#c05050", marginTop:"4px"}}>⚠ {stats.overdue} overdue</p>}
        </div>

        <div style={styles.sidebarFooter}>
          <p style={{cursor:"pointer", color: showStats?GOLD:TEXT_MUTED}} onClick={()=>setShowStats(x=>!x)}>
            {showStats?"▾":"▸"} Stats & summary
          </p>
          {tasks.filter(t=>t.done).length>0 && (
            <p style={{cursor:"pointer", color:"#c05050", marginTop:"8px", fontSize:"11px"}} onClick={clearDone}>
              🗑 Clear completed ({tasks.filter(t=>t.done).length})
            </p>
          )}
        </div>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        <header style={styles.mainHeader}>
          <h2 style={styles.mainTitle}>{title}</h2>
          <p style={styles.mainSub}>{sub}</p>
        </header>

        {/* Stats Panel */}
        {showStats && (
          <div style={styles.statsGrid}>
            {[["Total",stats.total],["Done",stats.done],["Active",stats.total-stats.done],["Overdue",stats.overdue]].map(([l,v])=>(
              <div key={l} style={styles.statCard}>
                <div style={styles.statNum}>{v}</div>
                <div style={styles.statLabel}>{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* Add Task Bar */}
        <div style={styles.taskBar}>
          <input ref={inputRef} style={styles.input} placeholder="New task..."
            value={text} onChange={e=>setText(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&handleAdd()} />
          <select style={styles.select} value={cat} onChange={e=>setCat(e.target.value)}>
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <select style={styles.select} value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
          <button style={styles.expandBtn} onClick={()=>setExpanded(x=>!x)}>{expanded?"▲":"▼"} More</button>
          <button style={styles.addBtn} onClick={handleAdd}>+ Add</button>
        </div>

        {expanded && (
          <div style={styles.expandPanel}>
            <div>
              <p style={styles.modalLabel}>Due Date</p>
              <input type="date" style={styles.expandInput} value={due} onChange={e=>setDue(e.target.value)} />
            </div>
            <div style={{gridColumn:"2/4"}}>
              <p style={styles.modalLabel}>Notes</p>
              <input style={styles.expandInput} placeholder="Optional notes..." value={notes} onChange={e=>setNotes(e.target.value)} />
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <span style={{fontSize:"11px", color:TEXT_MUTED, letterSpacing:"1px"}}>SORT:</span>
          {[["date","Date"],["priority","Priority"],["due","Due"],["az","A–Z"]].map(([v,l])=>(
            <button key={v} style={styles.toolBtn(sortBy===v)} onClick={()=>setSortBy(v)}>{l}</button>
          ))}
          <span style={{fontSize:"11px", color:TEXT_MUTED, letterSpacing:"1px", marginLeft:"8px"}}>PRIORITY:</span>
          {[["all","All"],["high","High"],["medium","Med"],["low","Low"]].map(([v,l])=>(
            <button key={v} style={styles.toolBtn(filterPriority===v)} onClick={()=>setFilterPriority(v)}>{l}</button>
          ))}
        </div>

        {/* Pinned */}
        {filtered.pinned.length > 0 && (
          <section>
            <p style={styles.sectionLabel}>
              <span>📌 PINNED</span>
              <span>{filtered.pinned.length}</span>
            </p>
            <ul style={styles.taskList}>
              {filtered.pinned.map(t=><TaskCard key={t.id} task={t} onToggle={toggle} onDelete={remove} onPin={pin} onEdit={setEditingTask}/>)}
            </ul>
          </section>
        )}

        {/* Active */}
        <section>
          <p style={styles.sectionLabel}>
            <span>TO DO</span>
            <span>{filtered.active.length}</span>
          </p>
          <ul style={styles.taskList}>
            {filtered.active.map(t=><TaskCard key={t.id} task={t} onToggle={toggle} onDelete={remove} onPin={pin} onEdit={setEditingTask}/>)}
          </ul>
          {filtered.active.length===0 && filtered.pinned.length===0 && (
            <p style={styles.emptyState}>Nothing here — add a task above ↑</p>
          )}
        </section>

        {/* Done */}
        <section>
          <p style={styles.sectionLabel}>
            <span>COMPLETED</span>
            <span>{filtered.done.length}</span>
          </p>
          <ul style={styles.taskList}>
            {filtered.done.map(t=><TaskCard key={t.id} task={t} onToggle={toggle} onDelete={remove} onPin={pin} onEdit={setEditingTask}/>)}
          </ul>
          {filtered.done.length===0 && <p style={styles.emptyState}>No completed tasks yet.</p>}
        </section>
      </main>
    </div>
  );
}

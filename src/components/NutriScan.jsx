import { useState, useEffect, useRef } from "react";

// ── constants ────────────────────────────────────────────────
const GOAL_CAL     = 2000;
const PRICE_INPUT  = 1.00 / 1_000_000;
const PRICE_OUTPUT = 5.00 / 1_000_000;
const BUDGET       = 5.00;
const DAILY_LIMIT  = 10_000;

// ── storage helpers ──────────────────────────────────────────
const todayStr  = () => new Date().toISOString().slice(0, 10);
const todayKey  = () => "nutriscan_log_" + todayStr();
const loadLog   = () => JSON.parse(localStorage.getItem(todayKey()) || "[]");
const saveLog   = (l) => localStorage.setItem(todayKey(), JSON.stringify(l));
const USAGE_KEY = "nutriscan_usage";
const loadUsage = () =>
  JSON.parse(localStorage.getItem(USAGE_KEY) || '{"totalInput":0,"totalOutput":0,"days":{}}');
const saveUsage = (u) => localStorage.setItem(USAGE_KEY, JSON.stringify(u));
const THEME_KEY = "nutriscan_theme";

function recordUsage(inTok, outTok) {
  const u = loadUsage(), d = todayStr();
  u.totalInput += inTok; u.totalOutput += outTok;
  if (!u.days[d]) u.days[d] = { input: 0, output: 0 };
  u.days[d].input += inTok; u.days[d].output += outTok;
  saveUsage(u); return u;
}
const cost      = (i, o) => i * PRICE_INPUT + o * PRICE_OUTPUT;
const formatDate = () => new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

// ── theme tokens ─────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:          "#050505",
    surface:     "#0d0d0d",
    surface2:    "#111111",
    border:      "#161616",
    border2:     "#1e1e1e",
    text:        "#e0e0e0",
    textMuted:   "#888",
    textDim:     "#444",
    textFaint:   "#2a2a2a",
    accent:      "#a3e635",
    accentText:  "#050505",
    accentBg:    "#0e1a02",
    proteinBg:   "#0d1f35",
    carbsBg:     "#2a1200",
    fatBg:       "#280d1a",
    fiberBg:     "#0e1a02",
    keyBannerBg: "#0e0c00",
    keyBannerBorder: "#2a2000",
    errBg:       "#120404",
    errBorder:   "#2a0808",
    thumbPh:     "#181818",
    histBar:     "#1e3a5f",
    toggleBg:    "#111",
    toggleBorder:"#1e1e1e",
  },
  light: {
    bg:          "#f5f5f0",
    surface:     "#ffffff",
    surface2:    "#f0f0ea",
    border:      "#e8e8e0",
    border2:     "#d8d8d0",
    text:        "#1a1a1a",
    textMuted:   "#666",
    textDim:     "#999",
    textFaint:   "#bbb",
    accent:      "#4d7c0f",
    accentText:  "#ffffff",
    accentBg:    "#f0fae8",
    proteinBg:   "#eff6ff",
    carbsBg:     "#fff7ed",
    fatBg:       "#fdf2f8",
    fiberBg:     "#f7fee7",
    keyBannerBg: "#fffbeb",
    keyBannerBorder: "#fde68a",
    errBg:       "#fef2f2",
    errBorder:   "#fecaca",
    thumbPh:     "#f0f0ea",
    histBar:     "#bfdbfe",
    toggleBg:    "#f0f0ea",
    toggleBorder:"#e0e0d8",
  }
};

// ── component ────────────────────────────────────────────────
export default function NutriScan() {
  const [log,           setLog]           = useState(loadLog);
  const [imageB64,      setImageB64]      = useState(null);
  const [imageType,     setImageType]     = useState("image/jpeg");
  const [previewSrc,    setPreviewSrc]    = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState(null);
  const [showKeyBanner, setShowKeyBanner] = useState(false);
  const [keyInput,      setKeyInput]      = useState("");
  const [keyVisible,    setKeyVisible]    = useState(false);
  const [usage,         setUsage]         = useState(loadUsage);
  const [showUsage,     setShowUsage]     = useState(false);
  const [theme,         setTheme]         = useState(() => localStorage.getItem(THEME_KEY) || "dark");

  const cameraRef  = useRef();
  const galleryRef = useRef();
  const t = THEMES[theme];

  const API_KEY =
    (typeof import_meta !== "undefined" && import_meta?.env?.VITE_ANTHROPIC_API_KEY) ||
    localStorage.getItem("nutriscan_key");

  useEffect(() => { if (!API_KEY) setShowKeyBanner(true); }, []);
  useEffect(() => { saveLog(log); }, [log]);
  useEffect(() => { localStorage.setItem(THEME_KEY, theme); }, [theme]);

  // ── nutrition totals ──────────────────────────────────────
  const totals = log.reduce(
    (a, e) => ({ cal: a.cal+(e.calories||0), p: a.p+(e.protein||0),
      c: a.c+(e.carbs||0), f: a.f+(e.fat||0), fi: a.fi+(e.fiber||0) }),
    { cal:0, p:0, c:0, f:0, fi:0 }
  );
  const calPct    = Math.min(totals.cal / GOAL_CAL, 1);
  const circ      = 2 * Math.PI * 54;
  const offset    = circ * (1 - calPct);
  const ringColor = calPct > .9 ? "#f87171" : calPct > .7 ? "#fb923c" : "#a3e635";

  // ── usage derived ─────────────────────────────────────────
  const todayUsage = usage.days?.[todayStr()] || { input: 0, output: 0 };
  const todayTok   = todayUsage.input + todayUsage.output;
  const todayCost  = cost(todayUsage.input, todayUsage.output);
  const totalCost  = cost(usage.totalInput, usage.totalOutput);
  const budgetPct  = Math.min(totalCost / BUDGET, 1);
  const dailyPct   = Math.min(todayTok / DAILY_LIMIT, 1);
  const budgetLeft = Math.max(BUDGET - totalCost, 0);
  const daysLeft   = todayCost > 0 ? Math.floor(budgetLeft / todayCost) : "∞";
  const budgetColor= budgetPct > .8 ? "#f87171" : budgetPct > .5 ? "#fb923c" : "#a3e635";
  const dailyColor = dailyPct  > .8 ? "#f87171" : dailyPct  > .5 ? "#fb923c" : "#60a5fa";
  const allDays    = Object.entries(usage.days || {}).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,7);

  // ── handlers ─────────────────────────────────────────────
  function toggleTheme() { setTheme(t => t === "dark" ? "light" : "dark"); }
  function saveKey() {
    if (!keyInput.trim()) return;
    localStorage.setItem("nutriscan_key", keyInput.trim());
    setShowKeyBanner(false);
  }
  function handleFile(e) {
    const file = e.target.files[0]; if (!file) return;
    setImageType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = ev => {
      setImageB64(ev.target.result.split(",")[1]);
      setPreviewSrc(ev.target.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  }
  function clearPreview() {
    setImageB64(null); setPreviewSrc(null); setError(null);
    if (cameraRef.current)  cameraRef.current.value  = "";
    if (galleryRef.current) galleryRef.current.value = "";
  }
  async function analyzeFood() {
    const key = API_KEY;
    if (!key) { setShowKeyBanner(true); return; }
    if (!imageB64) { cameraRef.current?.click(); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 800,
          messages: [{ role:"user", content:[
            { type:"image", source:{ type:"base64", media_type:imageType, data:imageB64 }},
            { type:"text", text:`You are a nutrition expert. Analyze this food image and respond ONLY with a JSON object, no markdown, no explanation. Format:
{"name":"food name","portion":"estimated portion e.g. 1 cup, 200g","calories":number,"protein":number,"carbs":number,"fat":number,"fiber":number,"sugar":number,"sodium":number,"insight":"one short health tip or fact about this food in under 20 words"}
All nutrients in grams except sodium (mg) and calories (kcal). Be accurate and realistic.`}
          ]}]
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const inTok  = data.usage?.input_tokens  || 0;
      const outTok = data.usage?.output_tokens || 0;
      setUsage({ ...recordUsage(inTok, outTok) });
      let raw = data.content[0].text.trim().replace(/```json|```/g,"").trim();
      const food = JSON.parse(raw);
      food.thumb = previewSrc;
      food.time  = new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
      setLog(prev => [...prev, food]);
      clearPreview();
    } catch(err) {
      setError("Could not analyze food: " + (err.message||"Unknown error"));
    } finally { setLoading(false); }
  }
  function deleteEntry(i) { setLog(prev => prev.filter((_,idx)=>idx!==i)); }
  function resetUsage() {
    if (!confirm("Reset all token usage history?")) return;
    localStorage.removeItem(USAGE_KEY);
    setUsage(loadUsage());
  }

  const macros = [
    { label:"Protein", val:totals.p,  color:"#60a5fa", bg:t.proteinBg },
    { label:"Carbs",   val:totals.c,  color:"#fb923c", bg:t.carbsBg   },
    { label:"Fat",     val:totals.f,  color:"#f472b6", bg:t.fatBg     },
    { label:"Fiber",   val:totals.fi, color:"#a3e635", bg:t.fiberBg   },
  ];

  // inline style helpers
  const card   = { background:t.surface,  border:`1px solid ${t.border}`,  borderRadius:24, padding:22 };
  const card2  = { background:t.surface2, border:`1px solid ${t.border2}`, borderRadius:12, padding:"10px 12px" };
  const pill   = (color) => ({ background:t.surface2, border:`1px solid ${t.border}`, borderRadius:8, padding:"10px 12px", color });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{background:${t.bg};transition:background .3s}

        .ns-root{min-height:100vh;font-family:'Outfit',sans-serif;color:${t.text};background:${t.bg};transition:background .25s,color .25s}
        .ns-inner{max-width:440px;margin:0 auto;padding:36px 20px 100px}

        /* header */
        .ns-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;gap:12px}
        .ns-logo{font-size:26px;font-weight:800;letter-spacing:-1.5px;line-height:1;color:${t.text}}
        .ns-logo em{color:${t.accent};font-style:normal}
        .ns-header-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
        .ns-header-controls{display:flex;gap:8px;align-items:center}

        /* icon buttons */
        .ns-icon-btn{background:${t.toggleBg};border:1px solid ${t.toggleBorder};border-radius:10px;padding:8px 11px;font-size:14px;cursor:pointer;color:${t.textMuted};transition:all .2s;line-height:1}
        .ns-icon-btn:hover{border-color:${t.border2};color:${t.text}}
        .ns-icon-btn.active{border-color:${t.accent};color:${t.accent};background:${t.accentBg}}

        .ns-date-main{font-size:12px;font-weight:500;color:${t.textMuted};text-align:right}
        .ns-date-sub{font-size:10px;color:${t.textDim};margin-top:1px;letter-spacing:.06em;text-transform:uppercase;text-align:right}

        /* key banner */
        .ns-key-banner{background:${t.keyBannerBg};border:1px solid ${t.keyBannerBorder};border-left:3px solid #fb923c;border-radius:14px;padding:16px;margin-bottom:18px}
        .ns-key-label{font-size:13px;color:#fb923c;font-weight:600;margin-bottom:10px}
        .ns-key-row{display:flex;gap:8px}
        .ns-key-input{flex:1;background:${t.surface};border:1px solid ${t.border2};border-radius:10px;padding:10px 14px;font-size:13px;color:${t.text};outline:none;font-family:'Outfit',sans-serif;transition:border-color .2s}
        .ns-key-input:focus{border-color:${t.accent}}
        .ns-key-toggle{background:${t.surface};border:1px solid ${t.border2};border-radius:10px;padding:10px 12px;color:${t.textMuted};cursor:pointer;font-size:14px;transition:border-color .2s}
        .ns-key-save{background:${t.accent};color:${t.accentText};border:none;border-radius:10px;padding:10px 16px;font-size:13px;font-weight:700;cursor:pointer;font-family:'Outfit',sans-serif}

        /* usage panel */
        .ns-usage-panel{background:${t.surface};border:1px solid ${t.border};border-radius:20px;padding:20px;margin-bottom:14px;animation:slideUp .2s ease}
        .ns-usage-title{font-size:11px;font-weight:700;letter-spacing:.1em;color:${t.textDim};text-transform:uppercase;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}
        .ns-reset-btn{font-size:11px;color:${t.textDim};background:none;border:1px solid ${t.border2};border-radius:6px;padding:3px 8px;cursor:pointer;font-family:'Outfit',sans-serif;transition:color .2s,border-color .2s}
        .ns-reset-btn:hover{color:#f87171;border-color:#f87171}
        .ns-usage-bars{display:flex;flex-direction:column;gap:12px;margin-bottom:16px}
        .ns-bar-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px}
        .ns-bar-label{font-size:12px;color:${t.textMuted};font-weight:500}
        .ns-bar-val{font-size:12px;font-weight:700}
        .ns-bar-track{height:6px;background:${t.surface2};border-radius:3px;overflow:hidden}
        .ns-bar-fill{height:100%;border-radius:3px;transition:width .6s cubic-bezier(.4,0,.2,1)}
        .ns-usage-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:14px}
        .ns-stat{background:${t.surface2};border-radius:12px;padding:10px 12px}
        .ns-stat-val{font-size:16px;font-weight:800;letter-spacing:-.5px;line-height:1}
        .ns-stat-lbl{font-size:10px;color:${t.textDim};margin-top:3px;font-weight:500}
        .ns-history-title{font-size:11px;font-weight:700;letter-spacing:.08em;color:${t.textDim};text-transform:uppercase;margin-bottom:8px}
        .ns-history-row{display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid ${t.border}}
        .ns-history-row:last-child{border-bottom:none}
        .ns-history-date{font-size:11px;color:${t.textDim};min-width:80px}
        .ns-history-bar-wrap{flex:1;height:4px;background:${t.surface2};border-radius:2px;overflow:hidden}
        .ns-history-bar{height:100%;border-radius:2px;transition:width .4s}
        .ns-history-cost{font-size:11px;font-weight:700;color:${t.textMuted};min-width:48px;text-align:right}

        /* cal card */
        .ns-cal-card{background:${t.surface};border:1px solid ${t.border};border-radius:24px;padding:22px;margin-bottom:12px;display:flex;align-items:center;gap:18px;transition:background .25s}
        .ns-ring-wrap{position:relative;width:120px;height:120px;flex-shrink:0}
        .ns-ring-wrap svg{transform:rotate(-90deg);display:block}
        .ns-ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
        .ns-cal-num{font-size:28px;font-weight:800;letter-spacing:-2px;line-height:1;color:${t.text}}
        .ns-cal-unit{font-size:10px;color:${t.textDim};letter-spacing:.1em;margin-top:2px}
        .ns-cal-goal{font-size:10px;color:${t.textFaint};margin-top:1px}
        .ns-macro-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:7px}
        .ns-macro-box{border-radius:12px;padding:10px 11px;transition:background .25s}
        .ns-macro-num{font-size:18px;font-weight:700;letter-spacing:-.8px;line-height:1}
        .ns-macro-num sup{font-size:10px;font-weight:400;letter-spacing:0;vertical-align:super}
        .ns-macro-lbl{font-size:11px;margin-top:3px;font-weight:500;opacity:.6}

        /* action buttons */
        .ns-scan-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:9px}
        .ns-btn-camera{background:${t.accent};color:${t.accentText};border:none;border-radius:16px;padding:16px 12px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:transform .15s,opacity .15s;letter-spacing:-.2px}
        .ns-btn-camera:hover{opacity:.9;transform:translateY(-1px)}
        .ns-btn-camera:active{transform:scale(.98)}
        .ns-btn-camera:disabled{opacity:.55;cursor:not-allowed;transform:none}
        .ns-btn-analyze{background:${t.accent};color:${t.accentText};border:none;border-radius:16px;padding:16px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-bottom:9px;transition:transform .15s,opacity .15s}
        .ns-btn-analyze:hover{opacity:.9;transform:translateY(-1px)}
        .ns-btn-analyze:disabled{opacity:.55;cursor:not-allowed;transform:none}
        .ns-btn-gallery{background:transparent;border:1px solid ${t.border2};border-radius:16px;padding:16px 12px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:600;color:${t.textMuted};cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:border-color .2s,color .2s}
        .ns-btn-gallery:hover{border-color:${t.text};color:${t.text}}
        .ns-btn-gallery-full{width:100%;background:transparent;border:1px solid ${t.border2};border-radius:16px;padding:14px;font-family:'Outfit',sans-serif;font-size:14px;color:${t.textMuted};cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:28px;transition:border-color .2s,color .2s}
        .ns-btn-gallery-full:hover{border-color:${t.text};color:${t.text}}

        /* preview */
        .ns-preview{position:relative;border-radius:20px;overflow:hidden;margin-bottom:12px}
        .ns-preview img{width:100%;max-height:220px;object-fit:cover;display:block}
        .ns-preview-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 55%);pointer-events:none}
        .ns-preview-tag{position:absolute;bottom:12px;left:14px;font-size:12px;color:rgba(255,255,255,.6);font-weight:500}
        .ns-preview-x{position:absolute;top:10px;right:10px;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.1);color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center}

        .ns-err{background:${t.errBg};border:1px solid ${t.errBorder};border-radius:12px;padding:12px 16px;font-size:13px;color:#f87171;margin-bottom:12px}

        .ns-spinner{width:16px;height:16px;border:2px solid rgba(0,0,0,.2);border-top-color:${t.accentText};border-radius:50%;animation:spin .65s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}

        /* log */
        .ns-log-header{font-size:11px;font-weight:700;letter-spacing:.12em;color:${t.textFaint};text-transform:uppercase;margin-bottom:12px}
        .ns-empty{text-align:center;padding:52px 20px}
        .ns-empty-ico{font-size:32px;margin-bottom:12px;opacity:.25}
        .ns-empty-txt{font-size:13px;color:${t.textDim};line-height:1.6}
        .ns-item{display:flex;align-items:center;gap:12px;background:${t.surface};border:1px solid ${t.border};border-radius:18px;padding:13px;margin-bottom:7px;transition:border-color .2s,background .25s;animation:slideUp .25s ease}
        @keyframes slideUp{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        .ns-item:hover{border-color:${t.border2}}
        .ns-item-img{width:54px;height:54px;border-radius:11px;object-fit:cover;flex-shrink:0}
        .ns-item-ph{width:54px;height:54px;border-radius:11px;background:${t.thumbPh};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:22px}
        .ns-item-body{flex:1;min-width:0}
        .ns-item-name{font-size:14px;font-weight:700;letter-spacing:-.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;color:${t.text}}
        .ns-item-portion{font-size:11px;color:${t.textDim};margin-bottom:4px}
        .ns-item-macros{display:flex;gap:8px}
        .ns-item-macros span{font-size:11px;font-weight:600}
        .ns-item-insight{font-size:11px;color:${t.textDim};font-style:italic;margin-top:5px;padding-top:5px;border-top:1px solid ${t.border}}
        .ns-item-right{display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;align-self:stretch;flex-shrink:0}
        .ns-item-cal{font-size:17px;font-weight:800;color:${t.accent};letter-spacing:-.8px}
        .ns-item-cal-lbl{font-size:10px;color:${t.textDim}}
        .ns-item-foot{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
        .ns-item-time{font-size:10px;color:${t.textFaint}}
        .ns-item-del{background:none;border:none;color:${t.textFaint};cursor:pointer;font-size:13px;padding:2px;transition:color .2s;line-height:1}
        .ns-item-del:hover{color:#f87171}

        @media(max-width:420px){
          .ns-inner{padding:24px 14px 80px}
          .ns-ring-wrap{width:104px;height:104px}
          .ns-cal-num{font-size:24px}
          .ns-logo{font-size:22px}
          .ns-cal-card{padding:16px;gap:14px}
        }
      `}</style>

      <div className="ns-root">
        <div className="ns-inner">

          {/* ── Header ── */}
          <div className="ns-header">
            <div className="ns-logo">Nutri<em>Scan</em></div>
            <div className="ns-header-right">
              <div className="ns-header-controls">
                {/* theme toggle */}
                <button className="ns-icon-btn" onClick={toggleTheme} title="Toggle theme">
                  {theme === "dark" ? "☀️" : "🌙"}
                </button>
                {/* usage toggle */}
                <button className={`ns-icon-btn${showUsage?" active":""}`} onClick={()=>setShowUsage(v=>!v)} title="API Usage">
                  ⚡
                </button>
              </div>
              <div>
                <div className="ns-date-main">{formatDate()}</div>
                <div className="ns-date-sub">Daily Tracker</div>
              </div>
            </div>
          </div>

          {/* ── API Key Banner ── */}
          {showKeyBanner && (
            <div className="ns-key-banner">
              <div className="ns-key-label">⚡ Add your Claude API key</div>
              <div className="ns-key-row">
                <input className="ns-key-input" type={keyVisible?"text":"password"}
                  placeholder="sk-ant-..." value={keyInput}
                  onChange={e=>setKeyInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&saveKey()} />
                <button className="ns-key-toggle" onClick={()=>setKeyVisible(v=>!v)}>
                  {keyVisible?"🙈":"👁"}
                </button>
                <button className="ns-key-save" onClick={saveKey}>Save</button>
              </div>
            </div>
          )}

          {/* ── Usage Panel ── */}
          {showUsage && (
            <div className="ns-usage-panel">
              <div className="ns-usage-title">
                Token & Cost Monitor
                <button className="ns-reset-btn" onClick={resetUsage}>Reset</button>
              </div>
              <div className="ns-usage-bars">
                <div>
                  <div className="ns-bar-top">
                    <span className="ns-bar-label">Total Budget Used</span>
                    <span className="ns-bar-val" style={{color:budgetColor}}>
                      ${totalCost.toFixed(4)} <span style={{color:t.textDim,fontWeight:400}}>/ $5.00</span>
                    </span>
                  </div>
                  <div className="ns-bar-track">
                    <div className="ns-bar-fill" style={{width:`${budgetPct*100}%`,background:budgetColor}}/>
                  </div>
                </div>
                <div>
                  <div className="ns-bar-top">
                    <span className="ns-bar-label">Today's Tokens</span>
                    <span className="ns-bar-val" style={{color:dailyColor}}>
                      {todayTok.toLocaleString()} <span style={{color:t.textDim,fontWeight:400}}>/ {DAILY_LIMIT.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="ns-bar-track">
                    <div className="ns-bar-fill" style={{width:`${dailyPct*100}%`,background:dailyColor}}/>
                  </div>
                </div>
              </div>
              <div className="ns-usage-stats">
                <div className="ns-stat">
                  <div className="ns-stat-val" style={{color:t.accent}}>${budgetLeft.toFixed(3)}</div>
                  <div className="ns-stat-lbl">Budget left</div>
                </div>
                <div className="ns-stat">
                  <div className="ns-stat-val" style={{color:"#60a5fa"}}>{typeof daysLeft==="number"?daysLeft+"d":"∞"}</div>
                  <div className="ns-stat-lbl">Days left*</div>
                </div>
                <div className="ns-stat">
                  <div className="ns-stat-val" style={{color:"#f472b6"}}>${todayCost.toFixed(4)}</div>
                  <div className="ns-stat-lbl">Today's cost</div>
                </div>
              </div>
              {allDays.length > 0 && (
                <>
                  <div className="ns-history-title">Last {allDays.length} days</div>
                  {allDays.map(([date, d]) => {
                    const tok    = d.input + d.output;
                    const dayMax = Math.max(...allDays.map(([,x])=>x.input+x.output), 1);
                    const isToday= date === todayStr();
                    return (
                      <div key={date} className="ns-history-row">
                        <div className="ns-history-date" style={{color:isToday?t.accent:t.textDim}}>
                          {isToday?"Today":date.slice(5)}
                        </div>
                        <div className="ns-history-bar-wrap">
                          <div className="ns-history-bar" style={{width:`${(tok/dayMax)*100}%`,background:isToday?t.accent:t.histBar}}/>
                        </div>
                        <div style={{fontSize:10,color:t.textDim,minWidth:52,textAlign:"right"}}>{tok.toLocaleString()} tok</div>
                        <div className="ns-history-cost">${cost(d.input,d.output).toFixed(4)}</div>
                      </div>
                    );
                  })}
                  <div style={{fontSize:10,color:t.textFaint,marginTop:10}}>* Based on today's usage rate</div>
                </>
              )}
              {allDays.length === 0 && (
                <div style={{textAlign:"center",padding:"20px 0",fontSize:13,color:t.textDim}}>
                  No usage recorded yet. Scan your first food!
                </div>
              )}
            </div>
          )}

          {/* ── Calorie Ring + Macros ── */}
          <div className="ns-cal-card">
            <div className="ns-ring-wrap">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke={t.border} strokeWidth="9"/>
                <circle cx="60" cy="60" r="54" fill="none" stroke={ringColor}
                  strokeWidth="9" strokeDasharray={circ} strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{transition:"stroke-dashoffset .8s cubic-bezier(.4,0,.2,1),stroke .4s"}}/>
              </svg>
              <div className="ns-ring-center">
                <div className="ns-cal-num">{Math.round(totals.cal)}</div>
                <div className="ns-cal-unit">KCAL</div>
                <div className="ns-cal-goal">/ {GOAL_CAL}</div>
              </div>
            </div>
            <div className="ns-macro-grid">
              {macros.map(m => (
                <div key={m.label} className="ns-macro-box" style={{background:m.bg}}>
                  <div className="ns-macro-num" style={{color:m.color}}>
                    {Math.round(m.val)}<sup>g</sup>
                  </div>
                  <div className="ns-macro-lbl" style={{color:m.color}}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Image Preview ── */}
          {previewSrc && (
            <div className="ns-preview">
              <img src={previewSrc} alt="food preview"/>
              <div className="ns-preview-grad"/>
              <div className="ns-preview-tag">Ready to analyze</div>
              <button className="ns-preview-x" onClick={clearPreview}>✕</button>
            </div>
          )}

          {error && <div className="ns-err">⚠ {error}</div>}

          {/* ── Action Buttons ── */}
          {previewSrc ? (
            // when image is loaded, show full-width analyze button
            <button className="ns-btn-analyze" onClick={analyzeFood} disabled={loading}>
              {loading ? <><div className="ns-spinner"/> Analyzing...</> : <>🔍 Analyze This Food</>}
            </button>
          ) : (
            // otherwise show camera + gallery side by side
            <div className="ns-scan-row">
              <button className="ns-btn-camera" onClick={()=>cameraRef.current?.click()} disabled={loading}>
                📷 Camera
              </button>
              <label className="ns-btn-gallery">
                🖼 Gallery
                <input ref={galleryRef} type="file" accept="image/*"
                  onChange={handleFile} style={{display:"none"}}/>
              </label>
            </div>
          )}

          {/* hidden camera input — opens camera directly */}
          <input ref={cameraRef} type="file" accept="image/*" capture="environment"
            onChange={handleFile} style={{display:"none"}}/>

          {/* ── Log ── */}
          <div className="ns-log-header">Today's Log</div>
          {log.length === 0 ? (
            <div className="ns-empty">
              <div className="ns-empty-ico">🥗</div>
              <div className="ns-empty-txt">No food scanned yet today.<br/>Tap Camera or Gallery to get started.</div>
            </div>
          ) : (
            [...log].reverse().map((e, ri) => {
              const i = log.length - 1 - ri;
              return (
                <div key={i} className="ns-item">
                  {e.thumb
                    ? <img src={e.thumb} className="ns-item-img" alt={e.name}/>
                    : <div className="ns-item-ph">🍽️</div>
                  }
                  <div className="ns-item-body">
                    <div className="ns-item-name">{e.name}</div>
                    <div className="ns-item-portion">{e.portion}</div>
                    <div className="ns-item-macros">
                      <span style={{color:"#60a5fa"}}>P {Math.round(e.protein||0)}g</span>
                      <span style={{color:"#fb923c"}}>C {Math.round(e.carbs||0)}g</span>
                      <span style={{color:"#f472b6"}}>F {Math.round(e.fat||0)}g</span>
                    </div>
                    {e.insight && <div className="ns-item-insight">💡 {e.insight}</div>}
                  </div>
                  <div className="ns-item-right">
                    <div>
                      <div className="ns-item-cal">{Math.round(e.calories||0)}</div>
                      <div className="ns-item-cal-lbl">kcal</div>
                    </div>
                    <div className="ns-item-foot">
                      <div className="ns-item-time">{e.time}</div>
                      <button className="ns-item-del" onClick={()=>deleteEntry(i)}>✕</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
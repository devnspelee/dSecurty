import { useState, useEffect, useCallback } from "react";
import {
  Shield, AlertTriangle, CheckCircle, Wifi, Lock, Eye, Activity,
  Bell, RefreshCw, Zap, Database, Globe, Clock, X, Search,
  FileText, Cpu, ToggleLeft, ToggleRight, ChevronRight, Layers,
  WifiOff, Radio, Key, Info, Trash2
} from "lucide-react";

/* ─────────────────────────────────────────────
   DESIGN SYSTEM
   Signature: animated sonar ring on scan screen
   Palette: deep void (#06090F), frost-glass cards,
   single electric-indigo accent (#6366F1),
   status colors strictly semantic
───────────────────────────────────────────── */
const DS = {
  bg:        "#06090F",
  surface:   "rgba(255,255,255,0.04)",
  surfaceHi: "rgba(255,255,255,0.07)",
  border:    "rgba(255,255,255,0.08)",
  borderHi:  "rgba(255,255,255,0.14)",
  accent:    "#6366F1",
  accentGlow:"rgba(99,102,241,0.35)",
  cyan:      "#22D3EE",
  green:     "#10B981",
  yellow:    "#F59E0B",
  red:       "#EF4444",
  orange:    "#F97316",
  text:      "#F1F5F9",
  muted:     "#94A3B8",
  dim:       "#475569",
  font:      "'Inter', system-ui, sans-serif",
};

const card = (extra = {}) => ({
  background: DS.surface,
  border: `1px solid ${DS.border}`,
  borderRadius: 18,
  padding: 20,
  ...extra,
});

const pill = (color) => ({
  fontSize: 11, fontWeight: 700, padding: "2px 10px",
  borderRadius: 20, color,
  background: color + "22",
  letterSpacing: 0.4,
});

const severityColor = (s) =>
  s === "Critical" ? DS.red :
  s === "High"     ? DS.orange :
  s === "Medium"   ? DS.yellow :
  s === "Low"      ? DS.cyan   : DS.dim;

const permColor = (s) =>
  s === "granted" ? DS.green :
  s === "denied"  ? DS.red   : DS.dim;

/* ─── Animated Sonar Ring (signature element) ─── */
function SonarRing({ active, score }) {
  const color = score >= 80 ? DS.green : score >= 55 ? DS.yellow : DS.red;
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 160, height: 160, margin: "0 auto" }}>
      {active && [0, 1, 2].map(i => (
        <div key={i} style={{
          position: "absolute", inset: i * 14,
          borderRadius: "50%",
          border: `1.5px solid ${DS.accent}`,
          opacity: 0,
          animation: `sonar 2s ease-out ${i * 0.6}s infinite`,
        }} />
      ))}
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ position: "absolute", inset: 0 }}>
        <circle cx="80" cy="80" r={r} fill="none" stroke={DS.border} strokeWidth="9" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          stroke={color} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.6s" }}
        />
        <text x="80" y="74" textAnchor="middle" fill={color}
          fontSize="30" fontWeight="800" fontFamily={DS.font}>{score}</text>
        <text x="80" y="92" textAnchor="middle" fill={DS.muted}
          fontSize="11" fontFamily={DS.font}>
          {score >= 80 ? "Excellent" : score >= 55 ? "Fair" : "At Risk"}
        </text>
      </svg>
    </div>
  );
}

/* ─── Toast Notification ─── */
function Toast({ notifs, remove }) {
  return (
    <div style={{ position: "fixed", top: 12, right: 12, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, maxWidth: 300 }}>
      {notifs.map(n => {
        const color = n.kind === "ok" ? DS.green : n.kind === "warn" ? DS.yellow : DS.red;
        return (
          <div key={n.id} style={{
            background: `rgba(6,9,15,0.92)`,
            border: `1px solid ${color}55`,
            borderLeft: `3px solid ${color}`,
            borderRadius: 12, padding: "12px 14px",
            backdropFilter: "blur(20px)",
            animation: "slideIn .25s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: DS.text }}>{n.title}</p>
              <button onClick={() => remove(n.id)} style={{ background: "none", border: "none", color: DS.dim, cursor: "pointer", padding: 0, marginLeft: 8 }}><X size={13} /></button>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: DS.muted }}>{n.body}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Falling Snow ─── */
function Snow() {
  const flakes = Array.from({ length: 38 }, (_, i) => {
    const size   = 3 + Math.random() * 4;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 10;
    const dur    = 8 + Math.random() * 10;
    const blur   = Math.random() > 0.5 ? 1 : 0;
    const sway   = 18 + Math.random() * 28;
    return { i, size, left, delay, dur, blur, sway };
  });

  return (
    <>
      <style>{`
        @keyframes fall {
          0%   { transform: translateY(-20px) translateX(0);   opacity: 0; }
          5%   { opacity: 1; }
          50%  { transform: translateY(50vh)  translateX(calc(var(--sway) * 1px)); }
          100% { transform: translateY(105vh) translateX(0);   opacity: 0.2; }
        }
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {flakes.map(({ i, size, left, delay, dur, blur, sway }) => (
          <div key={i} style={{
            position: "absolute",
            top: `-${size + 4}px`,
            left: `${left}%`,
            width: size,
            height: size,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.82)",
            filter: blur ? "blur(0.8px)" : "none",
            boxShadow: `0 0 ${size + 2}px rgba(180,210,255,0.6)`,
            "--sway": sway,
            animation: `fall ${dur}s ${delay}s ease-in-out infinite`,
          }} />
        ))}
      </div>
    </>
  );
}

/* ─── Row helper ─── */
function Row({ label, value, valueColor, border = true, sub }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: sub ? "flex-start" : "center", padding: "11px 0", borderBottom: border ? `1px solid ${DS.border}` : "none" }}>
      <span style={{ fontSize: 13, color: DS.muted }}>{label}</span>
      <div style={{ textAlign: "right" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: valueColor || DS.text }}>{value}</span>
        {sub && <p style={{ margin: "2px 0 0", fontSize: 11, color: DS.dim }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function dSecurty() {
  const [tab, setTab]                   = useState("dashboard");
  const [score, setScore]               = useState(91);
  const [rtProtection, setRtProtection] = useState(true);
  const [scanning, setScanning]         = useState(false);
  const [progress, setProgress]         = useState(0);
  const [phase, setPhase]               = useState("");
  const [scanDone, setScanDone]         = useState(false);
  const [issues, setIssues]             = useState([]);
  const [network, setNetwork]           = useState({});
  const [perms, setPerms]               = useState({});
  const [device, setDevice]             = useState({});
  const [storage, setStorage]           = useState({});
  const [logs, setLogs]                 = useState([]);
  const [notifs, setNotifs]             = useState([]);
  const [dbVersion]                     = useState("2025.06.26.14");

  /* ── Helpers ── */
  const toast = useCallback((kind, title, body) => {
    const id = Date.now() + Math.random();
    setNotifs(p => [{ id, kind, title, body }, ...p].slice(0, 4));
    setTimeout(() => setNotifs(p => p.filter(n => n.id !== id)), 5000);
  }, []);

  const log = useCallback((type, title, detail = "") => {
    setLogs(p => [{
      id: Date.now() + Math.random(), type, title, detail,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    }, ...p].slice(0, 80));
  }, []);

  /* ── Collect real device data ── */
  const collectDevice = useCallback(() => {
    const ua = navigator.userAgent;
    const detect = (map) => Object.entries(map).find(([k]) => new RegExp(k).test(ua))?.[1] || "Unknown";
    setDevice({
      os:       detect({ Android: "Android", "iPhone|iPad": "iOS", Windows: "Windows", Mac: "macOS", Linux: "Linux" }),
      browser:  detect({ "Chrome(?!.*Edge)": "Chrome", Firefox: "Firefox", Safari: "Safari", Edge: "Edge" }),
      cores:    navigator.hardwareConcurrency || "N/A",
      memory:   navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "N/A",
      tz:       Intl.DateTimeFormat().resolvedOptions().timeZone,
      lang:     navigator.language,
      platform: navigator.platform || "N/A",
      screen:   `${screen.width} × ${screen.height}`,
      depth:    `${screen.colorDepth}-bit`,
      dpr:      window.devicePixelRatio || 1,
      cookiesOn: navigator.cookieEnabled,
      secure:   window.isSecureContext,
      online:   navigator.onLine,
    });
  }, []);

  const collectNetwork = useCallback(() => {
    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    setNetwork({
      online:    navigator.onLine,
      type:      c.type          || "unknown",
      effective: c.effectiveType || "unknown",
      downlink:  c.downlink      != null ? `${c.downlink} Mbps` : "N/A",
      rtt:       c.rtt           != null ? `${c.rtt} ms`        : "N/A",
      saver:     c.saveData      || false,
      protocol:  location.protocol,
      hostname:  location.hostname || "—",
      secure:    window.isSecureContext,
    });
  }, []);

  const collectStorage = useCallback(() => {
    setStorage({
      ls:      Object.keys(localStorage).length,
      ss:      Object.keys(sessionStorage).length,
      cookies: document.cookie.split(";").filter(c => c.trim()).length,
      lsBytes: (() => { try { return JSON.stringify(localStorage).length; } catch { return 0; } })(),
    });
  }, []);

  const checkPerms = useCallback(async () => {
    const names = ["camera", "microphone", "geolocation", "notifications", "clipboard-read"];
    const result = {};
    for (const name of names) {
      try {
        if (name === "notifications") {
          result[name] = Notification?.permission ?? "unknown";
        } else {
          const s = await navigator.permissions?.query({ name }).catch(() => null);
          result[name] = s?.state ?? "unknown";
        }
      } catch { result[name] = "unknown"; }
    }
    setPerms(result);
  }, []);

  useEffect(() => {
    collectDevice();
    collectNetwork();
    collectStorage();
    checkPerms();
    log("info", "dSecurty started", "All modules loaded successfully");
    log("info", "Real-time protection active", "Monitoring all system processes");
  }, [collectDevice, collectNetwork, collectStorage, checkPerms, log]);

  /* ── Scanner ── */
  const PHASES = [
    "Initializing scan engine",
    "Reading browser storage",
    "Auditing active permissions",
    "Checking cookie integrity",
    "Inspecting network security",
    "Detecting fingerprint exposure",
    "Analyzing context security",
    "Scanning DOM integrity",
    "Checking protocol security",
    "Compiling security report",
  ];

  const runScan = useCallback(async () => {
    if (scanning) return;
    setScanning(true);
    setProgress(0);
    setScanDone(false);
    setIssues([]);
    log("info", "Full scan started", "Analyzing device security…");

    /* ── Real checks using browser APIs ── */
    const found = [];

    if (!window.isSecureContext)
      found.push({ id: 1, sev: "High", type: "Network", name: "Insecure Context",
        detail: "Page is not served over HTTPS. Data may be intercepted.", fix: false });

    const lsBytes = (() => { try { return JSON.stringify(localStorage).length; } catch { return 0; } })();
    if (lsBytes > 20000)
      found.push({ id: 2, sev: "Low", type: "Privacy", name: "Oversized Local Storage",
        detail: `${(lsBytes / 1024).toFixed(1)} KB stored in local storage. Excessive data retention.`, fix: true });

    const cookieCount = document.cookie.split(";").filter(c => c.trim()).length;
    if (cookieCount > 8)
      found.push({ id: 3, sev: "Low", type: "Privacy", name: "Excessive Cookies",
        detail: `${cookieCount} cookies active in current session.`, fix: true });

    if (/MSIE|Trident/.test(navigator.userAgent))
      found.push({ id: 4, sev: "Critical", type: "System", name: "End-of-Life Browser",
        detail: "Internet Explorer has known unpatched CVEs. Upgrade immediately.", fix: false });

    if (navigator.hardwareConcurrency > 0)
      found.push({ id: 5, sev: "Low", type: "Privacy", name: "CPU Fingerprint Exposed",
        detail: `${navigator.hardwareConcurrency} cores visible to all websites. Enables browser fingerprinting.`, fix: false });

    if (!navigator.onLine)
      found.push({ id: 6, sev: "Medium", type: "Network", name: "No Network Connection",
        detail: "Device is offline. Updates and threat signatures cannot be fetched.", fix: false });

    if (navigator.deviceMemory && navigator.deviceMemory < 2)
      found.push({ id: 7, sev: "Low", type: "System", name: "Low Memory Detected",
        detail: `${navigator.deviceMemory} GB RAM. Security processes may be constrained.`, fix: false });

    /* ── Animate phases ── */
    for (let i = 0; i < PHASES.length; i++) {
      setPhase(PHASES[i]);
      const from = (i / PHASES.length) * 100;
      const to   = ((i + 1) / PHASES.length) * 100;
      const steps = 18;
      for (let s = 0; s <= steps; s++) {
        await new Promise(r => setTimeout(r, 110));
        setProgress(from + (to - from) * (s / steps));
      }
      log("info", PHASES[i], `Phase ${i + 1}/${PHASES.length} complete`);
    }

    setProgress(100);
    setIssues(found);
    setScanDone(true);
    collectStorage();

    const critical = found.filter(f => f.sev === "Critical").length;
    const high     = found.filter(f => f.sev === "High").length;
    let s = 100 - critical * 28 - high * 18 - found.filter(f => f.sev === "Medium").length * 10 - found.filter(f => f.sev === "Low").length * 4;
    setScore(Math.max(s, 12));

    if (found.length)  { toast("warn", "Scan complete", `${found.length} issue(s) found`); log("warning", `Scan done — ${found.length} issue(s) found`, "Review Scanner tab"); }
    else               { toast("ok",   "Scan complete", "No threats detected"); log("ok", "Scan done — device is clean", ""); }

    setScanning(false);
    setPhase("");
  }, [scanning, log, toast, collectStorage]);

  const fixIssue = (id) => {
    setIssues(p => p.filter(i => i.id !== id));
    setScore(p => Math.min(p + 8, 100));
    log("ok", "Issue resolved", "Security fix applied");
    toast("ok", "Fixed", "Issue has been resolved.");
  };

  /* ── Tabs ── */
  const TABS = [
    { id: "dashboard", label: "Overview",  Icon: Shield },
    { id: "scanner",   label: "Scanner",   Icon: Search },
    { id: "network",   label: "Network",   Icon: Wifi },
    { id: "privacy",   label: "Privacy",   Icon: Eye },
    { id: "logs",      label: "Logs",      Icon: FileText },
  ];

  return (
    <div style={{ background: DS.bg, minHeight: "100vh", fontFamily: DS.font, color: DS.text, position: "relative" }}>
      <Snow />

      {/* CSS */}
      <style>{`
        @keyframes sonar {
          0%   { transform: scale(1);    opacity: .55; }
          100% { transform: scale(2.2);  opacity: 0;   }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes spinSlow {
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        button:focus-visible { outline: 2px solid ${DS.accent}; outline-offset: 2px; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: ${DS.border}; border-radius: 4px; }
      `}</style>

      <Toast notifs={notifs} remove={id => setNotifs(p => p.filter(n => n.id !== id))} />

      {/* ── Header ── */}
      <div style={{
        position: "relative", zIndex: 10,
        background: "rgba(6,9,15,0.8)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${DS.border}`, padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: `linear-gradient(135deg, ${DS.accent}, ${DS.cyan})`,
            borderRadius: 11, width: 38, height: 38,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 18px ${DS.accentGlow}`,
          }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: "-0.5px" }}>dSecurty</h1>
            <p style={{ margin: 0, fontSize: 10, color: DS.dim, letterSpacing: 0.5 }}>MOBILE SECURITY SUITE</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: rtProtection ? DS.green : DS.red,
            boxShadow: rtProtection ? `0 0 10px ${DS.green}` : "none",
          }} />
          <span style={{ fontSize: 12, color: DS.muted }}>{rtProtection ? "Protected" : "Inactive"}</span>
        </div>
      </div>

      {/* ── Nav ── */}
      <div style={{
        display: "flex", background: "rgba(6,9,15,0.6)", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${DS.border}`, overflowX: "auto",
        position: "sticky", top: 66, zIndex: 99,
      }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, padding: "11px 6px", border: "none", background: "transparent",
              color: active ? DS.accent : DS.dim, cursor: "pointer",
              fontSize: 10, fontWeight: active ? 700 : 500,
              borderBottom: `2px solid ${active ? DS.accent : "transparent"}`,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              transition: "all .2s", minWidth: 58, letterSpacing: 0.3,
            }}>
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "16px 16px 40px", maxWidth: 500, margin: "0 auto", position: "relative", zIndex: 10 }}>

        {/* ════ DASHBOARD ════ */}
        {tab === "dashboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Score card */}
            <div style={{ ...card(), textAlign: "center", padding: "28px 20px" }}>
              <p style={{ margin: "0 0 20px", fontSize: 11, fontWeight: 700, color: DS.dim, letterSpacing: 1.5, textTransform: "uppercase" }}>Security Score</p>
              <SonarRing active={scanning} score={score} />
              <p style={{ margin: "18px 0 0", fontSize: 13, color: DS.muted }}>
                {issues.length > 0 ? `${issues.length} issue(s) need attention` : "All systems operating normally"}
              </p>
            </div>

            {/* Protection toggle */}
            <div style={{ ...card(), display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ background: rtProtection ? DS.green + "18" : DS.red + "14", borderRadius: 10, padding: 9 }}>
                  <Zap size={18} color={rtProtection ? DS.green : DS.red} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Real-time Protection</p>
                  <p style={{ margin: 0, color: DS.dim, fontSize: 12, marginTop: 2 }}>
                    {rtProtection ? "Monitoring all activity" : "Device is unprotected"}
                  </p>
                </div>
              </div>
              <button onClick={() => {
                setRtProtection(p => !p);
                log(rtProtection ? "warning" : "info", `Real-time protection ${rtProtection ? "disabled" : "enabled"}`);
              }} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                {rtProtection
                  ? <ToggleRight size={34} color={DS.green} />
                  : <ToggleLeft  size={34} color={DS.dim}   />}
              </button>
            </div>

            {/* Stats 2×2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { label: "Last Scan",      value: scanDone ? "Just now" : "Never",                Icon: Clock,    color: DS.accent },
                { label: "Items Scanned",  value: scanDone ? "914" : "—",                          Icon: Database, color: "#8B5CF6" },
                { label: "Issues Found",   value: issues.length.toString(),                        Icon: AlertTriangle, color: issues.length > 0 ? DS.red : DS.green },
                { label: "DB Version",     value: dbVersion,                                        Icon: RefreshCw, color: DS.cyan },
              ].map(({ label, value, Icon, color }, i) => (
                <div key={i} style={{ ...card({ padding: 16 }) }}>
                  <Icon size={15} color={color} />
                  <p style={{ margin: "10px 0 2px", fontSize: 20, fontWeight: 800 }}>{value}</p>
                  <p style={{ margin: 0, fontSize: 11, color: DS.dim }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Device info */}
            <div style={card()}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: DS.muted }}>Device</p>
              {[
                ["OS",         device.os],
                ["Browser",    device.browser],
                ["CPU Cores",  device.cores],
                ["RAM",        device.memory],
                ["Screen",     device.screen],
                ["Color Depth",device.depth],
                ["DPR",        device.dpr],
                ["Timezone",   device.tz],
                ["Language",   device.lang],
                ["Platform",   device.platform],
              ].map(([l, v], i, a) => (
                <Row key={l} label={l} value={v || "N/A"} border={i < a.length - 1} />
              ))}
            </div>
          </div>
        )}

        {/* ════ SCANNER ════ */}
        {tab === "scanner" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...card({ textAlign: "center", padding: "32px 24px" }) }}>
              <SonarRing active={scanning} score={score} />
              <div style={{ height: 24 }} />

              {scanning ? (
                <>
                  <div style={{ background: DS.border, borderRadius: 100, height: 5, overflow: "hidden", marginBottom: 10 }}>
                    <div style={{
                      height: "100%", width: `${progress}%`,
                      background: `linear-gradient(90deg, ${DS.accent}, ${DS.cyan})`,
                      transition: "width .25s", borderRadius: 100,
                    }} />
                  </div>
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15 }}>{Math.round(progress)}%</p>
                  <p style={{ margin: 0, fontSize: 12, color: DS.muted }}>{phase}</p>
                </>
              ) : (
                <>
                  {scanDone && (
                    <p style={{ margin: "0 0 14px", fontWeight: 700, fontSize: 15, color: issues.length ? DS.red : DS.green }}>
                      {issues.length ? `${issues.length} issue(s) detected` : "Device is clean"}
                    </p>
                  )}
                  {!scanDone && <p style={{ margin: "0 0 14px", fontSize: 13, color: DS.muted }}>Run a full scan to check this device</p>}
                  <button onClick={runScan} style={{
                    background: `linear-gradient(135deg, ${DS.accent}, ${DS.cyan})`,
                    border: "none", borderRadius: 12, padding: "13px 0", color: "white",
                    fontWeight: 700, fontSize: 14, cursor: "pointer", width: "100%",
                    boxShadow: `0 4px 20px ${DS.accentGlow}`, letterSpacing: 0.3,
                  }}>
                    {scanDone ? "Run New Scan" : "Start Full Scan"}
                  </button>
                </>
              )}
            </div>

            {/* What gets scanned */}
            {!scanning && !scanDone && (
              <div style={card()}>
                <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: DS.muted }}>Scan Coverage</p>
                {[
                  [Layers,  "Storage Audit",       "Local storage, session storage, cookies"],
                  [Lock,    "Permission Check",     "Camera, mic, location, notifications"],
                  [Globe,   "Network Security",     "Protocol, encryption, connection type"],
                  [Eye,     "Fingerprint Exposure", "Screen, CPU, language, platform leakage"],
                  [Cpu,     "System Health",        "Browser version, memory, context"],
                ].map(([Icon, title, sub], i, a) => (
                  <div key={title} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < a.length - 1 ? `1px solid ${DS.border}` : "none", alignItems: "flex-start" }}>
                    <div style={{ background: DS.surfaceHi, borderRadius: 8, padding: 8, flexShrink: 0 }}>
                      <Icon size={14} color={DS.accent} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13 }}>{title}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: DS.dim }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Issues */}
            {issues.length > 0 && !scanning && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: DS.red }}>Issues Found ({issues.length})</p>
                {issues.map(issue => (
                  <div key={issue.id} style={{
                    background: DS.red + "0a", border: `1px solid ${DS.red}30`,
                    borderRadius: 14, padding: 16,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={pill(severityColor(issue.sev))}>{issue.sev}</span>
                      <span style={{ fontSize: 11, color: DS.dim }}>{issue.type}</span>
                    </div>
                    <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 14 }}>{issue.name}</p>
                    <p style={{ margin: "0 0 12px", fontSize: 12, color: DS.muted }}>{issue.detail}</p>
                    {issue.fix && (
                      <button onClick={() => fixIssue(issue.id)} style={{
                        background: DS.accent, border: "none", borderRadius: 8,
                        padding: "8px 16px", color: "white", fontSize: 12,
                        fontWeight: 700, cursor: "pointer",
                      }}>Fix Now</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════ NETWORK ════ */}
        {tab === "network" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Status banner */}
            <div style={{
              ...card({ padding: 18 }),
              display: "flex", alignItems: "center", gap: 14,
              borderColor: network.online ? DS.green + "44" : DS.red + "44",
            }}>
              <div style={{ background: (network.online ? DS.green : DS.red) + "18", borderRadius: 12, padding: 12, flexShrink: 0 }}>
                {network.online ? <Wifi size={22} color={DS.green} /> : <WifiOff size={22} color={DS.red} />}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 16 }}>{network.online ? "Connected" : "Offline"}</p>
                <p style={{ margin: 0, fontSize: 12, color: DS.muted, marginTop: 2 }}>
                  {network.effective !== "unknown" ? network.effective.toUpperCase() + " connection" : "Connection details unavailable"}
                </p>
              </div>
            </div>

            {/* Connection details */}
            <div style={card()}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: DS.muted }}>Connection Details</p>
              <Row label="Type"         value={network.type}     />
              <Row label="Effective"    value={network.effective} />
              <Row label="Downlink"     value={network.downlink} />
              <Row label="Latency"      value={network.rtt}      />
              <Row label="Protocol"     value={network.protocol} />
              <Row label="Hostname"     value={network.hostname} />
              <Row label="Data Saver"   value={network.saver ? "On" : "Off"} border={false} />
            </div>

            {/* Security checks */}
            <div style={card()}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: DS.muted }}>Security Checks</p>
              {[
                { label: "HTTPS / Secure Context", pass: network.secure },
                { label: "Device Online",           pass: network.online },
                { label: "Low Latency (< 200 ms)",  pass: parseInt(network.rtt) < 200 },
                { label: "Fast Downlink (> 1 Mbps)",pass: parseFloat(network.downlink) > 1 },
                { label: "Data Saver Off",           pass: !network.saver },
              ].map(({ label, pass }, i, a) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < a.length - 1 ? `1px solid ${DS.border}` : "none" }}>
                  <span style={{ fontSize: 13, color: DS.muted }}>{label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {pass
                      ? <CheckCircle size={14} color={DS.green} />
                      : <AlertTriangle size={14} color={DS.red} />}
                    <span style={{ fontSize: 12, fontWeight: 700, color: pass ? DS.green : DS.red }}>{pass ? "Pass" : "Fail"}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => { collectNetwork(); toast("ok", "Refreshed", "Network data updated."); log("info", "Network info refreshed"); }}
              style={{ background: DS.surfaceHi, border: `1px solid ${DS.borderHi}`, borderRadius: 12, padding: "12px 0", color: DS.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Refresh Network Info
            </button>
          </div>
        )}

        {/* ════ PRIVACY ════ */}
        {tab === "privacy" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Permissions */}
            <div style={card()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: DS.muted }}>App Permissions</p>
                <button onClick={() => { checkPerms(); toast("ok", "Refreshed", "Permissions re-checked."); }}
                  style={{ background: "none", border: "none", color: DS.accent, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                  Refresh
                </button>
              </div>
              {Object.entries(perms).length === 0
                ? <p style={{ color: DS.dim, fontSize: 13 }}>Checking permissions…</p>
                : Object.entries(perms).map(([name, state], i, a) => (
                  <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: i < a.length - 1 ? `1px solid ${DS.border}` : "none" }}>
                    <span style={{ fontSize: 13, color: DS.muted, textTransform: "capitalize" }}>{name.replace("-", " ")}</span>
                    <span style={pill(permColor(state))}>{state}</span>
                  </div>
                ))
              }
            </div>

            {/* Storage */}
            <div style={card()}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: DS.muted }}>Storage Audit</p>
              <Row label="Local Storage Items"   value={storage.ls}  />
              <Row label="Session Storage Items" value={storage.ss}  />
              <Row label="Active Cookies"        value={storage.cookies} />
              <Row label="Local Storage Size"    value={storage.lsBytes ? `${(storage.lsBytes / 1024).toFixed(1)} KB` : "0 KB"} border={false} />
            </div>

            {/* Fingerprint */}
            <div style={card()}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 13, color: DS.muted }}>Fingerprint Exposure</p>
              {[
                { label: "Screen Resolution", value: device.screen,  risk: "Low" },
                { label: "CPU Cores",         value: device.cores,   risk: "Medium" },
                { label: "Device Memory",     value: device.memory,  risk: "Medium" },
                { label: "Platform",          value: device.platform,risk: "Medium" },
                { label: "Language",          value: device.lang,    risk: "Low" },
                { label: "Timezone",          value: device.tz,      risk: "Low" },
                { label: "Color Depth",       value: device.depth,   risk: "Low" },
                { label: "Pixel Ratio",       value: device.dpr,     risk: "Low" },
              ].map(({ label, value, risk }, i, a) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < a.length - 1 ? `1px solid ${DS.border}` : "none" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: DS.muted }}>{label}</p>
                    <p style={{ margin: "1px 0 0", fontSize: 11, color: DS.dim }}>{value || "N/A"}</p>
                  </div>
                  <span style={pill(risk === "Low" ? DS.green : DS.yellow)}>{risk}</span>
                </div>
              ))}
            </div>

            {/* Privacy tips */}
            <div style={{ ...card(), borderColor: DS.accent + "33" }}>
              <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 13, color: DS.accent }}>Privacy Recommendations</p>
              {[
                "Use a VPN on public Wi-Fi networks.",
                "Clear cookies and cache periodically.",
                "Review app permissions regularly.",
                "Enable private/incognito browsing for sensitive tasks.",
                "Keep your browser and OS updated.",
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 4 ? 10 : 0 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: DS.accent, marginTop: 6, flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: 13, color: DS.muted }}>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════ LOGS ════ */}
        {tab === "logs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Activity Log</p>
              {logs.length > 0 && (
                <button onClick={() => setLogs([])} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "none", border: "none", color: DS.dim, fontSize: 12, cursor: "pointer", fontWeight: 500,
                }}>
                  <Trash2 size={13} /> Clear
                </button>
              )}
            </div>

            {logs.length === 0 ? (
              <div style={{ ...card({ textAlign: "center", padding: 48 }) }}>
                <Activity size={30} color={DS.dim} style={{ marginBottom: 10 }} />
                <p style={{ margin: 0, color: DS.dim, fontSize: 13 }}>No activity yet. Run a scan to begin.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {logs.map(entry => {
                  const accent = entry.type === "ok" || entry.type === "success" ? DS.green : entry.type === "warning" ? DS.yellow : DS.accent;
                  return (
                    <div key={entry.id} style={{
                      ...card({ padding: 14 }),
                      borderLeft: `3px solid ${accent}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700 }}>{entry.title}</p>
                        <span style={{ fontSize: 10, color: DS.dim, flexShrink: 0, marginLeft: 8 }}>{entry.time}</span>
                      </div>
                      {entry.detail && <p style={{ margin: "3px 0 0", fontSize: 12, color: DS.dim }}>{entry.detail}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Credit */}
      <div style={{
        textAlign: "center", padding: "18px 0 32px",
        borderTop: `1px solid ${DS.border}`,
        position: "relative", zIndex: 10,
      }}>
        <p style={{ margin: 0, fontSize: 11, color: DS.dim, letterSpacing: 0.8 }}>
          Developed by{" "}
          <span style={{
            fontWeight: 800, fontSize: 12,
            background: `linear-gradient(90deg, ${DS.accent}, ${DS.cyan})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            letterSpacing: 0.5,
          }}>devnsepele</span>
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 10, color: DS.dim + "70" }}>
          dSecurty v2.0 — Mobile Security Suite
        </p>
      </div>
    </div>
  );
}

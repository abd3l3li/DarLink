import { useEffect, useState, useRef, useCallback } from "react";

// ─── Exponential backoff config ───────────────────────────────────────────────
const INITIAL_INTERVAL_MS = 30_000;
const MAX_INTERVAL_MS = 300_000; // 5 min cap during outages
const BACKOFF_MULTIPLIER = 1.5;

// ─── Status definitions ───────────────────────────────────────────────────────
const STATUS = {
  healthy: {
    label: "All Systems Operational",
    badge: "Operational",
    dotColor: "bg-green-500",
    dotShadow: "shadow-[0_0_8px_rgba(34,197,94,0.8)]",
    badgeBg: "bg-green-100 text-green-700 border-green-200",
    textColor: "text-green-600",
    barColor: "bg-green-500",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
    ),
  },
  degraded: {
    label: "Partial System Degradation",
    badge: "Degraded",
    dotColor: "bg-amber-400",
    dotShadow: "shadow-[0_0_8px_rgba(245,158,11,0.8)]",
    badgeBg: "bg-amber-100 text-amber-700 border-amber-200",
    textColor: "text-amber-500",
    barColor: "bg-amber-400",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  down: {
    label: "Major Outage Detected",
    badge: "Down",
    dotColor: "bg-red-500",
    dotShadow: "shadow-[0_0_8px_rgba(239,68,68,0.8)]",
    badgeBg: "bg-red-100 text-red-700 border-red-200",
    textColor: "text-red-500",
    barColor: "bg-red-500",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  loading: {
    label: "Checking system status…",
    badge: "Checking",
    dotColor: "bg-gray-400",
    dotShadow: "",
    badgeBg: "bg-gray-100 text-gray-500 border-gray-200",
    textColor: "text-gray-400",
    barColor: "bg-gray-300",
    icon: (
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    ),
  },
};

function deriveStatus(data) {
  if (!data?.status) return "down";
  const s = data.status.toUpperCase();
  if (s === "UP") return "healthy";
  if (s === "OUT_OF_SERVICE" || s === "UNKNOWN") return "degraded";
  return "down";
}

function buildComponents(data) {
  if (!data?.components) return [];
  return Object.entries(data.components).map(([key, val]) => {
    const s = (val?.status || "UNKNOWN").toUpperCase();
    let status;
    if (s === "UP")                            status = "healthy";
    else if (s === "OUT_OF_SERVICE")           status = "degraded";
    else if (s === "UNKNOWN")                  status = "degraded"; // expected before first backup run
    else                                       status = "down";
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      status,
      details: val?.details || {},
    };
  });
}

// Component name → friendly label + icon
const COMPONENT_META = {
  Db: { label: "Database", icon: "🗄️" },
  Diskspace: { label: "Disk Space", icon: "💾" },
  Ping: { label: "Connectivity", icon: "📡" },
  Backup: { label: "Backup", icon: "🔒" },
  Backuphealthindicator: { label: "Backup Age", icon: "🔒" },
  Ssl: { label: "SSL / Certificates", icon: "🔐" },
};

function getComponentMeta(name) {
  const key = name.replace(/\s/g, "");
  return COMPONENT_META[key] || { label: name, icon: "⚙️" };
}

// ─── Formatting helpers ────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return 'Unknown';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(isoString) {
  if (!isoString) return 'Unknown';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', 
      hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    });
  } catch (e) {
    return isoString;
  }
}

function FormattedDetails({ name, details }) {
  const n = String(name).toLowerCase();

  // Disk Space
  if (n === 'diskspace') {
    const displayPath = details.path === '/.' ? 'Root Directory (/)' : (details.path || 'N/A');
    return (
      <div className="grid gap-2 text-sm text-[var(--color-muted)]">
        <p><strong className="text-[var(--color-text)] font-medium">Path:</strong> {displayPath}</p>
        <p><strong className="text-[var(--color-text)] font-medium">Status:</strong> {details.exists ? 'Available' : 'Unavailable'}</p>
        <p><strong className="text-[var(--color-text)] font-medium">Total Space:</strong> {formatBytes(details.total)}</p>
        <p><strong className="text-[var(--color-text)] font-medium">Free Space:</strong> {formatBytes(details.free)}</p>
        <p><strong className="text-[var(--color-text)] font-medium">Warning Threshold:</strong> {formatBytes(details.threshold)}</p>
      </div>
    );
  }

  // Backup
  if (n === 'backup' || n === 'backuphealthindicator') {
    return (
      <div className="grid gap-2 text-sm text-[var(--color-muted)]">
        {details.lastBackup && (
          <p><strong className="text-[var(--color-text)] font-medium">Last Backup:</strong> {formatDate(details.lastBackup)}</p>
        )}
        {details.ageHours !== undefined && (
          <p><strong className="text-[var(--color-text)] font-medium">Backup Age:</strong> {details.ageHours} {details.ageHours === 1 ? 'hour' : 'hours'} ago</p>
        )}
        {details.error && (
          <p className="text-red-500"><strong className="font-medium">Error:</strong> {details.error}</p>
        )}
      </div>
    );
  }

  // Database / Db
  if (n === 'db' || n === 'database') {
    return (
      <div className="grid gap-2 text-sm text-[var(--color-muted)]">
        <p><strong className="text-[var(--color-text)] font-medium">System:</strong> {details.database || 'Unknown'}</p>
        {details.validationQuery && (
          <p>
            <strong className="text-[var(--color-text)] font-medium">Validation Check:</strong>
            <span className="ml-1 text-[var(--color-text)]">
              {details.validationQuery === 'isValid()' 
                ? 'Built-in Driver Validation' 
                : <code className="bg-[var(--color-bg)] px-1.5 py-0.5 rounded border border-[var(--color-border-gray)] text-xs">{details.validationQuery}</code>}
            </span>
          </p>
        )}
      </div>
    );
  }

  // SSL
  if (n === 'ssl') {
    const validCount = details.validChains?.length || 0;
    const invalidCount = details.invalidChains?.length || 0;
    return (
      <div className="grid gap-2 text-sm text-[var(--color-muted)]">
        <p>
          <strong className="text-[var(--color-text)] font-medium">Valid Certificates:</strong> 
          <span className="ml-1 text-[var(--color-text)]">
            {validCount === 0 ? '0 (Pending Configuration)' : validCount}
          </span>
        </p>
        <p>
          <strong className="text-[var(--color-text)] font-medium">Invalid Certificates:</strong> 
          <span className={`ml-1 ${invalidCount === 0 ? 'text-[var(--color-text)]' : 'text-red-500 font-medium'}`}>
            {invalidCount === 0 ? '0 (Clean)' : `${invalidCount} Detected`}
          </span>
        </p>
      </div>
    );
  }

  // Generic block for any other unexpected data
  return (
    <div className="flex flex-col gap-2 text-sm text-[var(--color-muted)]">
      {Object.entries(details).map(([k, v]) => {
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          return (
            <div key={k} className="mt-1">
              <strong className="text-[var(--color-text)] font-medium capitalize block mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}:</strong>
              <div className="pl-3 border-l-2 border-[var(--color-border-gray)]">
                <FormattedDetails name={k} details={v} />
              </div>
            </div>
          );
        }
        return (
          <p key={k}>
            <strong className="text-[var(--color-text)] font-medium capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}:</strong> {String(v)}
          </p>
        );
      })}
    </div>
  );
}

export default function StatusPage() {
  const [status, setStatus] = useState("loading");
  const [components, setComponents] = useState([]);
  const [lastChecked, setLastChecked] = useState(null);
  const [nextIn, setNextIn] = useState(INITIAL_INTERVAL_MS / 1000);
  const [errorMsg, setErrorMsg] = useState(null);

  const intervalRef = useRef(INITIAL_INTERVAL_MS);
  const timerRef = useRef(null);
  const countRef = useRef(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch("/actuator/health", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus(deriveStatus(data));
      setComponents(buildComponents(data));
      setErrorMsg(null);
      intervalRef.current = INITIAL_INTERVAL_MS;
    } catch (err) {
      setStatus("down");
      setErrorMsg(err.message);
      intervalRef.current = Math.min(
        intervalRef.current * BACKOFF_MULTIPLIER,
        MAX_INTERVAL_MS
      );
    }
    setLastChecked(new Date());
    setNextIn(Math.round(intervalRef.current / 1000));
  }, []);

  const scheduleNext = useCallback(() => {
    clearTimeout(timerRef.current);
    clearInterval(countRef.current);

    let remaining = Math.round(intervalRef.current / 1000);
    setNextIn(remaining);

    countRef.current = setInterval(() => {
      remaining = Math.max(0, remaining - 1);
      setNextIn(remaining);
    }, 1000);

    timerRef.current = setTimeout(async () => {
      clearInterval(countRef.current);
      await fetchHealth();
      scheduleNext();
    }, intervalRef.current);
  }, [fetchHealth]);

  useEffect(() => {
    fetchHealth().then(scheduleNext);
    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countRef.current);
    };
  }, [fetchHealth, scheduleNext]);

  const cfg = STATUS[status] ?? STATUS.down;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] font-[Inter,sans-serif]">
      {/* ── Page header ── */}
      <div className="border-b border-[var(--color-border-gray)] bg-[var(--color-surface)]">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">System Status</h1>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">DarLink platform health overview</p>
          </div>
          <button
            id="status-refresh-btn"
            onClick={() => {
              clearTimeout(timerRef.current);
              clearInterval(countRef.current);
              setStatus("loading");
              fetchHealth().then(scheduleNext);
            }}
            className="flex items-center gap-2 text-sm text-[var(--color-primary)] border border-[var(--color-primary)]/30
                       bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 
                       px-4 py-2 rounded-full transition-colors duration-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">

        {/* ── Overall status banner ── */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border-gray)] rounded-xl p-6
                        flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Pulsing dot */}
            <span className="relative flex-shrink-0">
              <span className={`block w-4 h-4 rounded-full ${cfg.dotColor} ${cfg.dotShadow}`} />
              {status !== "loading" && (
                <span className={`absolute inset-0 rounded-full ${cfg.dotColor} opacity-40 animate-ping`} />
              )}
            </span>
            <div className="min-w-0">
              <p className={`text-lg font-semibold ${cfg.textColor}`}>{cfg.label}</p>
              {errorMsg && (
                <p className="text-xs text-red-500 mt-0.5 truncate">
                  {errorMsg}
                </p>
              )}
            </div>
          </div>

          <span className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 
                            text-xs font-semibold rounded-full border ${cfg.badgeBg}`}>
            <span className={cfg.textColor}>{cfg.icon}</span>
            {cfg.badge}
          </span>
        </div>

        {/* ── Poll info bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-[var(--color-muted)] 
                        bg-[var(--color-surface)] border border-[var(--color-border-gray)] rounded-lg px-4 py-3">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {lastChecked
              ? <>Last checked: <strong className="text-[var(--color-text)] font-medium">{lastChecked.toLocaleTimeString()}</strong></>
              : "Fetching status…"}
          </div>
          <span className="hidden sm:block text-[var(--color-border-gray)]">·</span>
          <span>
            Next check in <strong className={`font-medium ${cfg.textColor}`}>{nextIn}s</strong>
          </span>
          <span className="hidden sm:block text-[var(--color-border-gray)]">·</span>
          <span>Exponential backoff active during outages (max {MAX_INTERVAL_MS / 60000} min)</span>
        </div>

        {/* ── Component breakdown ── */}
        {components.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-3">
              Component Health
            </h2>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border-gray)] rounded-xl overflow-hidden shadow-sm divide-y divide-[var(--color-border-gray)]">
              {components.map((c) => {
                const ccfg = STATUS[c.status];
                const meta = getComponentMeta(c.name);
                const hasDetails = Object.keys(c.details).length > 0;
                return (
                  <details key={c.name} className="group">
                    <summary className={`flex items-center gap-4 px-5 py-4 cursor-pointer 
                                        hover:bg-[var(--color-bg)] transition-colors duration-150
                                        ${hasDetails ? "" : "pointer-events-none"}`}>
                      {/* Status dot */}
                      <span className="relative flex-shrink-0">
                        <span className={`block w-2.5 h-2.5 rounded-full ${ccfg.dotColor}`} />
                      </span>

                      {/* Icon + name */}
                      <span className="text-lg flex-shrink-0 select-none" aria-hidden>{meta.icon}</span>
                      <span className="flex-1 font-medium text-sm text-[var(--color-text)]">{meta.label}</span>

                      {/* Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 
                                        text-xs font-semibold rounded-full border ${ccfg.badgeBg}`}>
                        <span className={ccfg.textColor}>{ccfg.icon}</span>
                        {ccfg.badge}
                      </span>

                      {/* Expand chevron */}
                      {hasDetails && (
                        <svg className="w-4 h-4 text-[var(--color-muted)] transition-transform group-open:rotate-180 flex-shrink-0"
                             fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      )}
                    </summary>

                    {/* Detail pane */}
                    {hasDetails && (
                      <div className="px-5 pb-4 pt-1 bg-[var(--color-bg)]">
                        <div className="bg-[var(--color-surface)] border border-[var(--color-border-gray)] rounded-lg p-4">
                          <FormattedDetails name={c.name} details={c.details} />
                        </div>
                      </div>
                    )}
                  </details>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Uptime legend ── */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-3">
            Status Legend
          </h2>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border-gray)] rounded-xl p-5 shadow-sm
                          grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            {["healthy", "degraded", "down"].map((s) => {
              const sc = STATUS[s];
              return (
                <div key={s} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full flex-shrink-0 ${sc.dotColor} ${sc.dotShadow}`} />
                  <div>
                    <p className={`font-semibold ${sc.textColor}`}>{sc.badge}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {s === "healthy" && "All components UP"}
                      {s === "degraded" && "Some components impacted or pending first run"}
                      {s === "down" && "Critical failure / unreachable"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
}

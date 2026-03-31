import { useEffect, useState, useRef, useCallback } from "react";

// polling backoff settings.
const INITIAL_INTERVAL_MS = 30_000;
const MAX_INTERVAL_MS = 300_000;
const BACKOFF_MULTIPLIER = 1.5;

// ui metadata for status states.
const STATUS = {
  healthy: {
    label: "All Systems Operational",
    badge: "Operational",
    dotColor: "bg-emerald-500",
    badgeBg: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    textColor: "text-emerald-600",
    icon: (
      <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  degraded: {
    label: "Partial System Degradation",
    badge: "Degraded",
    dotColor: "bg-amber-500",
    badgeBg: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    textColor: "text-amber-600",
    icon: (
      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  down: {
    label: "Major Outage Detected",
    badge: "Down",
    dotColor: "bg-red-500",
    badgeBg: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10",
    textColor: "text-red-600",
    icon: (
      <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  loading: {
    label: "Checking system status...",
    badge: "Checking",
    dotColor: "bg-gray-400",
    badgeBg: "bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10",
    textColor: "text-gray-500",
    icon: (
      <svg className="w-6 h-6 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
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
    if (s === "UP") status = "healthy";
    else if (s === "OUT_OF_SERVICE" || s === "UNKNOWN") status = "degraded";
    else status = "down";
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1),
      status,
      details: val?.details || {},
    };
  });
}

const COMPONENT_META = {
  Db: { label: "Database" },
  Diskspace: { label: "Disk Space" },
  Ping: { label: "Connectivity" },
  Backup: { label: "Backup System" },
  Backuphealthindicator: { label: "Backup Freshness" },
  Ssl: { label: "SSL / Certificates" },
};

function getComponentMeta(name) {
  const key = name.replace(/\s/g, "");
  return COMPONENT_META[key] || { label: name };
}

function formatBytes(bytes) {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return "Unknown";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatDate(isoString) {
  if (!isoString) return "Unknown";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  } catch (e) {
    return isoString;
  }
}

function DetailRow({ label, value, isCode }) {
  return (
    <div className="flex justify-between items-center py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      {isCode ? (
        <code className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs border border-gray-200">
          {value}
        </code>
      ) : (
        <span className="text-gray-900 font-medium">{value}</span>
      )}
    </div>
  );
}

function FormattedDetails({ name, details }) {
  const n = String(name).toLowerCase();

  if (n === "diskspace") {
    const displayPath = details.path === "/." ? "Root Directory (/)" : (details.path || "N/A");
    return (
      <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
        <DetailRow label="Path" value={displayPath} />
        <DetailRow label="Total Space" value={formatBytes(details.total)} />
        <DetailRow label="Free Space" value={formatBytes(details.free)} />
      </div>
    );
  }

  if (n === "backup" || n === "backuphealthindicator") {
    return (
      <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
        {details.lastBackup && <DetailRow label="Last Backup" value={formatDate(details.lastBackup)} />}
        {details.ageHours !== undefined && <DetailRow label="Age" value={`${details.ageHours}h ago`} />}
        {details.error && <DetailRow label="Error" value={<span className="text-red-600">{details.error}</span>} />}
      </div>
    );
  }

  if (n === "db" || n === "database") {
    return (
      <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
        <DetailRow label="System" value={details.database || "Unknown"} />
        {details.validationQuery && (
          <DetailRow 
            label="Validation" 
            value={details.validationQuery === "isValid()" ? "Driver Native" : details.validationQuery} 
            isCode={details.validationQuery !== "isValid()"}
          />
        )}
      </div>
    );
  }

  if (n === "ssl") {
    const validCount = details.validChains?.length || 0;
    const invalidCount = details.invalidChains?.length || 0;
    return (
      <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
        <DetailRow label="Valid Certs" value={validCount} />
        <DetailRow label="Invalid Certs" value={<span className={invalidCount > 0 ? "text-red-600" : ""}>{invalidCount}</span>} />
      </div>
    );
  }

  return (
    <div className="pt-2 border-t border-gray-100 mt-2 space-y-1">
      {Object.entries(details).map(([k, v]) => {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) return null;
        return <DetailRow key={k} label={k.replace(/([A-Z])/g, " $1").trim()} value={String(v)} />;
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
      
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-base font-semibold text-gray-900 tracking-tight">System Status</h1>
          <button
            onClick={() => {
              clearTimeout(timerRef.current);
              clearInterval(countRef.current);
              setStatus("loading");
              fetchHealth().then(scheduleNext);
            }}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-md shadow-sm"
          >
            <svg className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        <section className="bg-white border border-gray-200 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full bg-gray-50 border border-gray-100 ${status === 'loading' ? 'animate-pulse' : ''}`}>
              {cfg.icon}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{cfg.label}</h2>
              {errorMsg ? (
                <p className="text-sm text-red-600 mt-1">{errorMsg}</p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">DarLink services and infrastructure</p>
              )}
            </div>
          </div>
          
          <div className="text-right flex flex-col items-end gap-2">
             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badgeBg}`}>
                {cfg.badge}
             </span>
             <p className="text-xs text-gray-400">
               Next update in {nextIn}s
             </p>
          </div>
        </section>

        {components.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">System Components</h3>
              <span className="text-xs text-gray-500">Last checked: {lastChecked ? lastChecked.toLocaleTimeString() : "..."}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((c) => {
                const ccfg = STATUS[c.status];
                const meta = getComponentMeta(c.name);
                const hasDetails = Object.keys(c.details).length > 0;
                
                return (
                  <div key={c.name} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${ccfg.dotColor}`} />
                        <h4 className="text-sm font-medium text-gray-900">{meta.label}</h4>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ccfg.badgeBg}`}>
                        {ccfg.badge}
                      </span>
                    </div>
                    
                    {hasDetails ? (
                      <FormattedDetails name={c.name} details={c.details} />
                    ) : (
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        <p className="text-xs text-gray-400 italic">No additional details</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

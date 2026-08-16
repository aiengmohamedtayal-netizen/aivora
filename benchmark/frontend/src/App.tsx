import { useEffect, useMemo, useRef, useState } from "react";

type Params = { temperature: number; max_tokens: number; top_p: number };
type SuiteCase = { id: string; name: string; category: string; description: string; prompt: string; validator: string };
type Metrics = { ttft_ms: number | null; total_latency_ms: number; input_tokens: number; output_tokens: number; tokens_per_second: number; validation_passed: boolean; validation_message: string };
type CaseResult = { case_id: string; case_name: string; category: string; output: string; metrics: Metrics; error?: string | null };
type Run = { run_id: string; status: string; model_name: string; started_at: string; completed_at?: string | null; total_cases: number; completed_cases: number; pass_rate: number; average_latency_ms: number; average_tokens_per_second: number; cases: CaseResult[]; error?: string | null };
type PlaygroundResponse = { text: string; input_tokens: number; output_tokens: number; ttft_ms: number | null; total_latency_ms: number; tokens_per_second: number; provider: string };

const api = async <T,>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(path, { headers: { "Content-Type": "application/json", ...(options?.headers || {}) }, ...options });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(body.detail || "Request failed");
  }
  return response.json();
};

const defaultParams: Params = { temperature: 0.2, max_tokens: 512, top_p: 0.95 };

function App() {
  const [tab, setTab] = useState<"playground" | "benchmarks" | "history">("playground");
  const [prompt, setPrompt] = useState("Explain how a transformer model uses attention in three concise paragraphs.");
  const [systemInstruction, setSystemInstruction] = useState("You are a precise, technically rigorous assistant.");
  const [params, setParams] = useState<Params>(defaultParams);
  const [answer, setAnswer] = useState("");
  const [playgroundMetrics, setPlaygroundMetrics] = useState<PlaygroundResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [suite, setSuite] = useState<SuiteCase[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [activeRun, setActiveRun] = useState<Run | null>(null);
  const [running, setRunning] = useState(false);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    Promise.all([api<SuiteCase[]>("/api/suite"), api<Run[]>("/api/runs")]).then(([loadedSuite, loadedRuns]) => {
      setSuite(loadedSuite);
      setRuns(loadedRuns);
      if (loadedRuns[0]) setActiveRun(loadedRuns[0]);
    }).catch((reason: Error) => setError(reason.message));
    return () => { if (pollRef.current) window.clearInterval(pollRef.current); };
  }, []);

  const startBenchmark = async () => {
    setError("");
    setRunning(true);
    try {
      const started = await api<{ run_id: string }>("/api/runs", { method: "POST", body: JSON.stringify({}) });
      pollRef.current = window.setInterval(async () => {
        const latest = await api<Run>(`/api/runs/${started.run_id}`);
        setActiveRun(latest);
        if (latest.status === "completed" || latest.status === "failed") {
          if (pollRef.current) window.clearInterval(pollRef.current);
          setRunning(false);
          setRuns((current) => [latest, ...current.filter((run) => run.run_id !== latest.run_id)]);
        }
      }, 700);
    } catch (reason) {
      setRunning(false);
      setError((reason as Error).message);
    }
  };

  const sendPrompt = async () => {
    setError("");
    setAnswer("");
    setPlaygroundMetrics(null);
    setIsGenerating(true);
    const startedAt = performance.now();
    try {
      const response = await fetch("/api/playground/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, system_instruction: systemInstruction, params }),
      });
      if (!response.ok || !response.body) throw new Error("Unable to start model stream");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let firstTokenAt: number | null = null;
      let fullText = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split("\n\n");
        buffer = events.pop() || "";
        for (const event of events) {
          const line = event.split("\n").find((item) => item.startsWith("data:"));
          if (!line) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          const parsed = JSON.parse(data) as { delta?: string; error?: string };
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.delta) {
            if (firstTokenAt === null) firstTokenAt = performance.now();
            fullText += parsed.delta;
            setAnswer(fullText);
          }
        }
      }
      const completedAt = performance.now();
      const roughTokens = fullText.trim() ? fullText.trim().split(/\s+/).length : 0;
      setPlaygroundMetrics({ text: fullText, input_tokens: prompt.trim().split(/\s+/).length, output_tokens: roughTokens, ttft_ms: firstTokenAt ? firstTokenAt - startedAt : null, total_latency_ms: completedAt - startedAt, tokens_per_second: roughTokens / Math.max((completedAt - startedAt) / 1000, 0.001), provider: "stream" });
    } catch (reason) {
      setError((reason as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const latest = activeRun;
  const passCount = latest?.cases.filter((item) => item.metrics.validation_passed).length || 0;
  const maxLatency = Math.max(...(latest?.cases.map((item) => item.metrics.total_latency_ms) || [1]));
  const healthLabel = running ? "RUNNING" : latest?.status === "completed" ? "READY" : "IDLE";

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">⌁</span><div><strong>MODEL BENCHMARK LAB</strong><span>AI evaluation workspace</span></div></div>
        <div className="topbar-actions"><span className={`status-dot ${running ? "pulse" : ""}`} /> <span>{healthLabel}</span><span className="divider" /><span className="model-chip">{latest?.model_name || "benchmark-mock"}</span></div>
      </header>

      <main className="content">
        <section className="hero"><div><p className="eyebrow">EVALUATION CONSOLE / 01</p><h1>Measure what the model<br /><em>actually does.</em></h1><p className="hero-copy">A focused workspace for testing reasoning, latency, throughput, and structured output reliability.</p></div><div className="hero-orbit"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-core">AI</div><span className="orbit-label">LIVE SIGNAL</span></div></section>

        <nav className="tabs" aria-label="Primary navigation">
          <button className={tab === "playground" ? "active" : ""} onClick={() => setTab("playground")}><span>01</span> Playground</button>
          <button className={tab === "benchmarks" ? "active" : ""} onClick={() => setTab("benchmarks")}><span>02</span> Benchmarks</button>
          <button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}><span>03</span> History</button>
        </nav>

        {error && <div className="error-banner"><strong>Request issue</strong><span>{error}</span><button onClick={() => setError("")}>×</button></div>}

        {tab === "playground" && <section className="workspace-grid">
          <div className="panel prompt-panel"><div className="panel-heading"><div><p className="eyebrow">INTERACTIVE PLAYGROUND</p><h2>Prompt the model</h2></div><span className="panel-index">A / 01</span></div>
            <label>System instruction <textarea value={systemInstruction} onChange={(event) => setSystemInstruction(event.target.value)} rows={3} /></label>
            <label>Prompt <textarea className="prompt-textarea" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={8} /></label>
            <div className="param-grid">
              <label>Temperature <div className="range-row"><input type="range" min="0" max="2" step="0.05" value={params.temperature} onChange={(event) => setParams({ ...params, temperature: Number(event.target.value) })} /><output>{params.temperature.toFixed(2)}</output></div></label>
              <label>Top P <div className="range-row"><input type="range" min="0.1" max="1" step="0.05" value={params.top_p} onChange={(event) => setParams({ ...params, top_p: Number(event.target.value) })} /><output>{params.top_p.toFixed(2)}</output></div></label>
              <label>Max tokens <input type="number" min="1" max="32768" value={params.max_tokens} onChange={(event) => setParams({ ...params, max_tokens: Number(event.target.value) })} /></label>
            </div>
            <button className="primary-button" disabled={isGenerating || !prompt.trim()} onClick={sendPrompt}>{isGenerating ? "Streaming response…" : "Run prompt"}<span>↗</span></button>
          </div>
          <div className="panel response-panel"><div className="panel-heading"><div><p className="eyebrow">MODEL OUTPUT</p><h2>Response trace</h2></div><span className="live-badge">{isGenerating ? "● LIVE" : "○ READY"}</span></div>
            <div className={`response-body ${!answer ? "empty" : ""}`}>{answer || <><span className="empty-glyph">◌</span><p>Run a prompt to see the model response and live measurements.</p></>}</div>
            {playgroundMetrics && <div className="metric-strip"><Metric label="TTFT" value={`${playgroundMetrics.ttft_ms?.toFixed(0) || "—"} ms`} /><Metric label="TOTAL" value={`${playgroundMetrics.total_latency_ms.toFixed(0)} ms`} /><Metric label="OUTPUT" value={`${playgroundMetrics.output_tokens} tok`} /><Metric label="SPEED" value={`${playgroundMetrics.tokens_per_second.toFixed(1)} tok/s`} /></div>}
          </div>
        </section>}

        {tab === "benchmarks" && <section><div className="section-heading"><div><p className="eyebrow">AUTOMATED SUITE / 05 CASES</p><h2>Benchmark run</h2><p>Five focused probes, one comparable signal.</p></div><button className="primary-button compact" disabled={running} onClick={startBenchmark}>{running ? "Running suite…" : "Run full suite"}<span>↗</span></button></div>
          <div className="stats-grid"><Metric label="PASS RATE" value={`${latest?.pass_rate?.toFixed(0) || 0}%`} detail={`${passCount}/${latest?.total_cases || suite.length || 5} validations`} /><Metric label="AVG LATENCY" value={`${latest?.average_latency_ms?.toFixed(0) || 0} ms`} detail="end-to-end" /><Metric label="THROUGHPUT" value={`${latest?.average_tokens_per_second?.toFixed(1) || 0}`} detail="tokens / second" /><Metric label="LAST RUN" value={latest ? new Date(latest.started_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"} detail={latest?.status || "not started"} /></div>
          <div className="benchmark-layout"><div className="panel case-panel"><div className="panel-heading"><div><p className="eyebrow">SUITE MANIFEST</p><h2>Test scenarios</h2></div><span className="panel-index">{suite.length || 5} TESTS</span></div><div className="case-list">{suite.map((item, index) => <div className="case-row" key={item.id}><span className="case-number">0{index + 1}</span><div><strong>{item.name}</strong><span>{item.description}</span></div><span className="category-tag">{item.category}</span></div>)}</div></div>
            <div className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">LATENCY PROFILE</p><h2>Response time</h2></div><span className="panel-index">MS</span></div><div className="bars">{latest?.cases.length ? latest.cases.map((item) => <div className="bar-item" key={item.case_id}><div className="bar-track"><div className={`bar-fill ${item.metrics.validation_passed ? "pass" : "fail"}`} style={{ height: `${Math.max(8, item.metrics.total_latency_ms / maxLatency * 100)}%` }} /></div><strong>{item.metrics.total_latency_ms.toFixed(0)}</strong><span>{item.case_id}</span></div>) : <div className="chart-empty">Run the suite to populate the latency profile.</div>}</div></div></div>
          {latest && <ResultTable run={latest} />}
        </section>}

        {tab === "history" && <section><div className="section-heading"><div><p className="eyebrow">LOCAL RUN ARCHIVE</p><h2>History & exports</h2><p>Durable SQLite records for repeatable comparisons.</p></div><div className="export-actions"><a href="/api/export/json">Export JSON</a><a href="/api/export/csv">Export CSV</a></div></div><div className="panel history-panel"><div className="history-header"><span>RUN</span><span>STATUS</span><span>CASES</span><span>PASS RATE</span><span>LATENCY</span><span>STARTED</span></div>{runs.length ? runs.map((run) => <button className="history-row" key={run.run_id} onClick={() => { setActiveRun(run); setTab("benchmarks"); }}><span className="mono">{run.run_id.slice(0, 8)}…</span><span><i className={`status-pill ${run.status}`}>{run.status}</i></span><span>{run.completed_cases}/{run.total_cases}</span><span>{run.pass_rate.toFixed(0)}%</span><span>{run.average_latency_ms.toFixed(0)} ms</span><span>{new Date(run.started_at).toLocaleString()}</span></button>) : <div className="history-empty">No benchmark runs yet. Start a suite to create your first record.</div>}</div></section>}
      </main>
      <footer><span>MODEL BENCHMARK LAB</span><span>Local-first · reproducible · inspectable</span></footer>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong>{detail && <small>{detail}</small>}</div>; }
function ResultTable({ run }: { run: Run }) { return <div className="panel results-panel"><div className="panel-heading"><div><p className="eyebrow">VALIDATION DETAIL</p><h2>Case results</h2></div><span className="panel-index">{run.completed_cases}/{run.total_cases} COMPLETE</span></div><div className="result-table"><div className="result-header"><span>CASE</span><span>TTFT</span><span>TOTAL</span><span>SPEED</span><span>CHECK</span></div>{run.cases.map((item) => <div className="result-row" key={item.case_id}><span><strong>{item.case_name}</strong><small>{item.category}</small></span><span>{item.metrics.ttft_ms?.toFixed(0) || "—"} ms</span><span>{item.metrics.total_latency_ms.toFixed(0)} ms</span><span>{item.metrics.tokens_per_second.toFixed(1)} t/s</span><span className={item.metrics.validation_passed ? "check-pass" : "check-fail"}>{item.metrics.validation_passed ? "PASS" : "FAIL"}<small>{item.metrics.validation_message}</small></span></div>)}</div></div>; }

export default App;

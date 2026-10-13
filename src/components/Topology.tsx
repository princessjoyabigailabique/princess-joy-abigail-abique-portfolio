"use client";
import { useMemo, useState } from "react";
import { SimBanner } from "./ui";

type Dev = { id: string; label: string; kind: "router" | "switch" | "pc"; x: number; y: number; ip?: string; subnet?: 1 | 2; gw?: string };
const DEVS: Dev[] = [
  { id: "R1", label: "R1", kind: "router", x: 300, y: 50 },
  { id: "SW1", label: "SW1", kind: "switch", x: 150, y: 150 },
  { id: "SW2", label: "SW2", kind: "switch", x: 450, y: 150 },
  { id: "PC1", label: "PC1", kind: "pc", x: 90, y: 250, ip: "192.168.1.10", subnet: 1, gw: "192.168.1.1" },
  { id: "PC2", label: "PC2", kind: "pc", x: 210, y: 250, ip: "192.168.1.11", subnet: 1, gw: "192.168.1.1" },
  { id: "PC3", label: "PC3", kind: "pc", x: 390, y: 250, ip: "192.168.2.10", subnet: 2, gw: "192.168.2.1" },
  { id: "PC4", label: "PC4", kind: "pc", x: 510, y: 250, ip: "192.168.2.11", subnet: 2, gw: "192.168.2.1" },
];
const LINKS: [string, string][] = [["R1", "SW1"], ["R1", "SW2"], ["SW1", "PC1"], ["SW1", "PC2"], ["SW2", "PC3"], ["SW2", "PC4"]];
const pos = (id: string) => DEVS.find((d) => d.id === id)!;

function config(d: Dev, g1Down: boolean) {
  if (d.kind === "router") return `R1# show running-config (example)\nhostname R1\n!\ninterface g0/0\n ip address 192.168.1.1 255.255.255.0\n no shutdown\n!\ninterface g0/1\n ip address 192.168.2.1 255.255.255.0\n ${g1Down ? "shutdown   ! (simulated fault)" : "no shutdown"}\n!`;
  if (d.kind === "switch") return `${d.id}# show vlan brief (example)\nVLAN Name     Ports\n1    default  Fa0/1-Fa0/24\n\nLayer-2 only: forwards frames within one subnet.`;
  return `${d.id}> ipconfig (example)\nIPv4 Address. . . : ${d.ip}\nSubnet Mask . . . : 255.255.255.0\nDefault Gateway . : ${d.gw}`;
}

function ping(src: Dev, dst: Dev, g1Down: boolean): { ok: boolean; lines: string[] } {
  const head = `ping ${dst.ip} from ${src.id} (simulation)`;
  if (src.subnet === dst.subnet) return { ok: true, lines: [head, `Reply from ${dst.ip}: bytes=32 time<1ms (same subnet, switched directly)`] };
  if (g1Down) return { ok: false, lines: [head, `Request timed out. R1 interface g0/1 is down, so ${dst.id}'s subnet is unreachable.`] };
  return { ok: true, lines: [head, `Reply from ${dst.ip}: bytes=32 time=1ms (routed via R1: ${src.gw} → ${dst.gw})`] };
}

export default function Topology() {
  const [sel, setSel] = useState("R1");
  const [src, setSrc] = useState("PC1");
  const [dst, setDst] = useState("PC3");
  const [down, setDown] = useState(false);
  const [out, setOut] = useState<{ ok: boolean; lines: string[] } | null>(null);
  const d = pos(sel);
  const pcs = useMemo(() => DEVS.filter((x) => x.kind === "pc"), []);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 text-sm">
        <span className="font-semibold">Network topology (interactive)</span>
        <span className="badge border-warn/50 text-warn">EXAMPLE TOPOLOGY · SIMULATED</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="overflow-x-auto p-3">
          <svg viewBox="0 0 600 310" className="w-full min-w-[520px]" role="group" aria-label="Network topology: one router, two switches, four PCs">
            {LINKS.map(([a, b]) => {
              const A = pos(a), B = pos(b);
              const bad = down && ((a === "R1" && b === "SW2"));
              return <line key={a + b} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={bad ? "rgb(var(--bad))" : "rgb(var(--accent))"} strokeWidth="2" className={bad ? "" : "flow-line"} />;
            })}
            {DEVS.map((v) => {
              const active = v.id === sel;
              return (
                <g key={v.id} tabIndex={0} role="button" aria-label={`${v.label}${v.ip ? ", " + v.ip : ""}`} aria-pressed={active}
                  onClick={() => setSel(v.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSel(v.id))}
                  className="cursor-pointer">
                  <rect x={v.x - 34} y={v.y - 20} width="68" height="40" rx="10" fill="rgb(var(--surface-2))" stroke={active ? "rgb(var(--accent))" : "rgb(var(--line))"} strokeWidth={active ? 3 : 1.5} />
                  <text x={v.x} y={v.y + 5} textAnchor="middle" fill="rgb(var(--ink))" fontSize="14" fontWeight="600">{v.label}</text>
                  {v.ip && <text x={v.x} y={v.y + 38} textAnchor="middle" fill="rgb(var(--muted))" fontSize="11">{v.ip}</text>}
                </g>
              );
            })}
          </svg>
        </div>
        <div className="min-w-0 space-y-4 border-t border-line p-4 lg:border-l lg:border-t-0">
          <div>
            <p className="text-sm font-semibold">Device details — {d.id}</p>
            <pre className="mt-2 overflow-x-auto rounded-xl border border-line bg-bg p-3 font-mono text-xs leading-relaxed" tabIndex={0}>{config(d, down)}</pre>
            <p className="mt-1 text-xs text-muted">Sample configuration for illustration; not exported from a real device.</p>
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="text-sm font-semibold">Connectivity test (simulation)</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <label className="sr-only" htmlFor="src">Source</label>
              <select id="src" value={src} onChange={(e) => setSrc(e.target.value)} className="rounded-lg border border-line bg-bg px-2 py-1">{pcs.map((p) => <option key={p.id}>{p.id}</option>)}</select>
              <span aria-hidden>→</span>
              <label className="sr-only" htmlFor="dst">Destination</label>
              <select id="dst" value={dst} onChange={(e) => setDst(e.target.value)} className="rounded-lg border border-line bg-bg px-2 py-1">{pcs.map((p) => <option key={p.id}>{p.id}</option>)}</select>
              <button className="btn-primary !px-3 !py-1.5" disabled={src === dst} onClick={() => setOut(ping(pos(src), pos(dst), down))}>Ping</button>
            </div>
            <label className="mt-3 flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={down} onChange={(e) => { setDown(e.target.checked); setOut(null); }} className="accent-purple-500" /> Simulate fault: R1 g0/1 shut down</label>
            <div aria-live="polite" className="mt-2">
              {out && <pre tabIndex={0} aria-label="Ping result (simulated)" className={`overflow-x-auto rounded-lg border p-2 font-mono text-xs ${out.ok ? "border-good/50" : "border-bad/60"}`}>{out.lines.join("\n")}</pre>}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-line p-3"><SimBanner>Illustrative topology rebuilt in code. It is not connected to a real network, and no commands were run on physical devices. It is not my Packet Tracer lab file.</SimBanner></div>
    </div>
  );
}

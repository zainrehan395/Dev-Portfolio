import { useState, useEffect, useRef, FormEvent, useCallback, ReactNode } from "react";
import { X, Copy, Check, Terminal as TerminalIcon, Volume2, VolumeX, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SITE_CONFIG, PROJECTS } from "@/lib/config";
import { getLenis } from "@/lib/lenis";

interface TerminalProps {
    onClose: () => void;
    initialCommand?: string;
}

type LogType = "input" | "output" | "error" | "system";

interface Log {
    id: string;
    type: LogType;
    segments: Segment[];
    node?: ReactNode;
    isDmCommand?: boolean;
}

interface Segment {
    text: string;
    color?: string;
    bold?: boolean;
    dim?: boolean;
    href?: string;
}

// ─── Theme system ─────────────────────────────────────────────────────────────
type ThemeName = "onedark" | "matrix" | "dracula" | "nord" | "monokai";

interface ThemeColors {
    blue: string; purple: string; green: string; yellow: string;
    orange: string; red: string; cyan: string; white: string;
    dim: string; bright: string; bg: string; headerBg: string; border: string;
}

const THEMES: Record<ThemeName, ThemeColors> = {
    onedark: {
        blue: "#61afef", purple: "#c678dd", green: "#98c379", yellow: "#e5c07b",
        orange: "#d19a66", red: "#e06c75", cyan: "#56b6c2", white: "#abb2bf",
        dim: "#5c6370", bright: "#ffffff", bg: "#0c0c0e", headerBg: "#131316",
        border: "255,255,255",
    },
    matrix: {
        blue: "#00ff41", purple: "#00ff41", green: "#00ff41", yellow: "#00ff41",
        orange: "#00ff41", red: "#00ff41", cyan: "#00ff41", white: "#00cc33",
        dim: "#006622", bright: "#00ff41", bg: "#0a0a0a", headerBg: "#0d0d0d",
        border: "0,255,65",
    },
    dracula: {
        blue: "#bd93f9", purple: "#ff79c6", green: "#50fa7b", yellow: "#f1fa8c",
        orange: "#ffb86c", red: "#ff5555", cyan: "#8be9fd", white: "#f8f8f2",
        dim: "#6272a4", bright: "#ffffff", bg: "#1e1f29", headerBg: "#21222c",
        border: "189,147,249",
    },
    nord: {
        blue: "#81a1c1", purple: "#b48ead", green: "#a3be8c", yellow: "#ebcb8b",
        orange: "#d08770", red: "#bf616a", cyan: "#88c0d0", white: "#d8dee9",
        dim: "#4c566a", bright: "#eceff4", bg: "#242933", headerBg: "#2e3440",
        border: "136,192,208",
    },
    monokai: {
        blue: "#66d9ef", purple: "#ae81ff", green: "#a6e22e", yellow: "#e6db74",
        orange: "#fd971f", red: "#f92672", cyan: "#a1efe4", white: "#cfcfc2",
        dim: "#75715e", bright: "#f8f8f2", bg: "#1e1e1e", headerBg: "#252526",
        border: "166,226,46",
    },
};

const s = (text: string, color?: string, bold?: boolean, href?: string): Segment => ({ text, color, bold, href });

let C = THEMES.onedark;

// ─── Sound engine ─────────────────────────────────────────────────────────────
let audioCtx: AudioContext | null = null;
let soundEnabled = true;

function getAudioCtx(): AudioContext | null {
    if (!soundEnabled) return null;
    if (!audioCtx) {
        try { audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); }
        catch { return null; }
    }
    return audioCtx;
}

function playTick() {
    const ctx = getAudioCtx(); if (!ctx) return;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sine"; osc.frequency.value = 600 + Math.random() * 300;
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.04);
}

function playReturn() {
    const ctx = getAudioCtx(); if (!ctx) return;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "triangle"; osc.frequency.value = 120;
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
}

// ─── Commands ─────────────────────────────────────────────────────────────────
const COMMANDS = [
    "help", "about", "contact", "stack", "clear", "exit",
    "projects", "whoami", "neofetch", "date", "echo", "ls",
    "theme", "matrix", "sound", "sudo", "cat", "resume", "dm",
];

function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
            dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    return dp[m][n];
}

function findSuggestions(input: string): string[] {
    if (!input || input.length < 2) return [];
    const lower = input.toLowerCase();
    return COMMANDS
        .filter((c) => levenshtein(lower, c) <= 3 && c !== lower)
        .sort((a, b) => levenshtein(lower, a) - levenshtein(lower, b))
        .slice(0, 3);
}

// ─── ASCII art ────────────────────────────────────────────────────────────────
const NEOFETCH_ASCII = [
    "      :---------------:      ",
    "     :------------------:     ",
    "    :--------------------:    ",
    "   :-------.  .----------:   ",
    "  :-------    :----------:   ",
    " :-------      ----------:   ",
    ":--------    :----------:    ",
    ":--------  :----------:      ",
    ":-------------------:        ",
    " :-----------------:         ",
    "  :-------------:            ",
];

// ─── Response builders ────────────────────────────────────────────────────────
function buildHelp(): Segment[][] {
    const cmds: [string, string][] = [
        ["about", "System bio and mission parameters"],
        ["contact", "Initialize communication protocols"],
        ["dm", "Send a direct message to the developer"],
        ["stack", "Core engineering technologies"],
        ["projects", "List portfolio projects"],
        ["neofetch", "Display system information"],
        ["whoami", "Current user identity"],
        ["date", "Print system date/time"],
        ["echo <txt>", "Echo text back"],
        ["ls", "List directory contents"],
        ["theme <name>", "Switch color scheme"],
        ["matrix", "Toggle Matrix rain"],
        ["sound", "Toggle keyboard sounds"],
        ["clear", "Wipe terminal history"],
        ["exit", "Terminate session"],
    ];
    return [
        [s("AVAILABLE COMMANDS", C.yellow, true)],
        ...cmds.map(([cmd, desc]) => [
            s("  "), s(cmd.padEnd(14), C.green, true),
            s("─ ", C.dim), s(desc, C.white),
        ]),
    ];
}

function buildAbout(): Segment[][] {
    return [
        [s("┌─ ", C.dim), s("SYSTEM INFO", C.cyan, true)],
        [s("│ ", C.dim), s("TARGET   ", C.blue), s("Zain-ul-Abideen", C.bright, true)],
        [s("│ ", C.dim), s("ROLE     ", C.blue), s("Software Engineer", C.purple)],
        [s("│ ", C.dim), s("STATUS   ", C.blue), s("Building scalable React, Next.js, and Node.js products", C.white)],
        [s("└─ ", C.dim), s("LOCATION ", C.blue), s("Lahore, Pakistan", C.yellow)],
    ];
}

function buildContact(): Segment[][] {
    return [
        [s("CONTACT", C.cyan, true), s(" ···", C.dim)],
        [s("  ✉  ", C.green), s("Email     ", C.dim), s(SITE_CONFIG.email, C.green)],
        [s("  ☎  ", C.blue), s("Phone     ", C.dim), s(SITE_CONFIG.phone, C.blue)],
        [s("  ⌂  ", C.purple), s("Location  ", C.dim), s(SITE_CONFIG.location, C.purple)],
        [s("")],
        [s("  💬 ", C.cyan), s("Type ", C.dim), s("dm", C.cyan, true), s(" to send a message from this terminal.", C.dim)],
    ];
}

function buildStack(): Segment[][] {
    return [
        [s("CORE ARCHITECTURE", C.yellow, true)],
        [s("  ► ", C.orange), s("Frontend  ", C.blue), s("Next.js · React · TypeScript · Tailwind CSS", C.white)],
        [s("  ► ", C.orange), s("Backend   ", C.blue), s("Node.js · Express · tRPC · REST · GraphQL", C.white)],
        [s("  ► ", C.orange), s("Cloud     ", C.blue), s("AWS S3 · Lambda · CloudFront · Vercel", C.white)],
        [s("  ► ", C.orange), s("Tooling   ", C.blue), s("Git · GitHub Actions · Jira · Figma", C.white)],
    ];
}

function buildProjects(): Segment[][] {
    const projects = PROJECTS.map((p) => ({
        name: p.title,
        tech: p.tech.slice(0, 4).join(" · "),
        desc: p.hook ?? p.desc,
    }));
    return [
        [s("SELECTED WORK", C.yellow, true)],
        [s("=".repeat(40), C.dim)],
        ...projects.flatMap((p) => [
            [s("  ◆ ", C.orange), s(p.name, C.cyan, true)],
            [s("    "), s("Stack  ", C.dim), s(p.tech, C.white)],
            [s("    "), s("About  ", C.dim), s(p.desc, C.white)],
            [s("")],
        ]),
    ];
}

function buildWhoami(): Segment[][] {
    return [[s("zain_engine", C.green, true)]];
}

function buildNeofetch(): Segment[][] {
    const rows: Segment[][] = [];
    const info: [string, string][] = [
        ["OS", "ZainOS 18.04 LTS"],
        ["Host", "Dev workstation · Windows"],
        ["Kernel", "18.5.4-generic"],
        ["Shell", "bash 5.2.15"],
        ["Uptime", `${Math.floor(Math.random() * 168) + 1} hours`],
        ["Packages", `${Math.floor(Math.random() * 2000) + 500} (npm)`],
        ["Resolution", "1728x1117 @ 120Hz"],
        ["Terminal", "Zain_Engine v3.2.1"],
    ];
    const colors = [C.red, C.orange, C.yellow, C.green, C.cyan, C.blue, C.purple, C.red, C.orange];
    const maxLen = Math.max(NEOFETCH_ASCII.length, info.length);
    for (let i = 0; i < maxLen; i++) {
        const ascii = NEOFETCH_ASCII[i] ?? "";
        const [label, value] = info[i] ?? ["", ""];
        const asciiColored = [...ascii].map((ch, j) =>
            ch === " " ? s(" ") : s(ch, colors[j % colors.length], true)
        );
        const infoPart = label
            ? [s("  "), s(label.padEnd(12), C.blue), s(value, C.white)]
            : [s("")];
        rows.push([...asciiColored, ...infoPart]);
    }
    return rows;
}

function buildDate(): Segment[][] {
    return [[s(new Date().toLocaleString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short",
    }), C.green)]];
}

function buildLs(): Segment[][] {
    const dirs = ["projects/", "about.txt", "contact.txt", "resume.pdf", "stack.json", ".secret/"];
    return [
        [s("total "), s(String(dirs.length), C.yellow)],
        ...dirs.map((d) => [
            s(d.endsWith("/") ? "drwxr-xr-x  " : "-rw-r--r--  ", C.dim),
            s(d, d.endsWith("/") ? C.blue : C.white, d.endsWith("pdf")),
        ]),
    ];
}

function buildCat(args: string): Segment[][] {
    const file = args.trim().toLowerCase();
    switch (file) {
        case "about.txt": return [[s("Zain-ul-Abideen - Software Engineer", C.bright, true)], [s("Based in Lahore, Pakistan.", C.white)], [s("Building scalable React, Next.js, and Node.js products.", C.white)]];
        case "resume.pdf": return [[s("⚠  Binary file. Use ", C.yellow), s("resume", C.green, true), s(" command to download.", C.yellow)]];
        case "stack.json": return [[s("{", C.dim)], [s('  "frontend": ["Next.js","React","TypeScript","Tailwind"],', C.white)], [s('  "backend":  ["Node.js","Express","tRPC","REST"],', C.white)], [s('  "cloud":    ["AWS","Vercel","GitHub Actions"],', C.white)], [s('  "design":   ["Figma","Illustrator"]', C.white)], [s("}", C.dim)]];
        default: return [[s(`cat: ${file}: No such file or directory`, C.red)]];
    }
}

function buildEcho(args: string): Segment[][] {
    return args.trim() ? [[s(args.trim(), C.green)]] : [[s("")]];
}

function buildResumeDownload(): Segment[][] {
    if (typeof window !== "undefined") {
        window.open(SITE_CONFIG.resumePath, "_blank", "noopener,noreferrer");
    }
    return [
        [s("📄 ", C.yellow), s("Opening resume PDF...", C.white)],
        [s("   "), s(SITE_CONFIG.resumePath, C.green)],
    ];
}

function buildThemeList(): Segment[][] {
    const themes: [ThemeName, string][] = [
        ["onedark", "One Dark (default)"],
        ["matrix", "Matrix"],
        ["dracula", "Dracula"],
        ["nord", "Nord"],
        ["monokai", "Monokai"],
    ];
    return [
        [s("AVAILABLE THEMES", C.yellow, true)],
        [s("Usage: "), s("theme <name>", C.green)],
        ...themes.map(([name, desc]) => [
            s("  ◆ ", C.orange), s(name.padEnd(12), C.cyan, true), s(desc, C.white),
        ]),
    ];
}

function buildError(cmd: string): Segment[][] {
    const suggestions = findSuggestions(cmd);
    const rows: Segment[][] = [[s("✗ ", C.red), s("Command not found: ", C.red), s(cmd, C.white, true)]];
    if (suggestions.length > 0) {
        rows.push([
            s("  "), s("Did you mean: ", C.dim),
            ...suggestions.flatMap((sug, i) => [
                s(sug, C.green, true),
                s(i < suggestions.length - 1 ? ", " : "", C.dim),
            ]),
            s(" ?", C.dim),
        ]);
    }
    rows.push([s("  Type ", C.dim), s("help", C.green), s(" for valid commands.", C.dim)]);
    return rows;
}

function buildSudo(): Segment[][] {
    return [[s("⚠  Access denied.", C.red, true), s("  This incident will be reported.", C.dim)]];
}

function buildThemeApplied(name: ThemeName): Segment[][] {
    return [[s("✓ ", C.green), s("Theme switched to ", C.white), s(name, C.green, true)]];
}

function buildSoundToggled(enabled: boolean): Segment[][] {
    return [[s(enabled ? "🔊 Sound ON" : "🔇 Sound OFF", enabled ? C.green : C.red, true)]];
}

// The mono face is loaded with the "latin" subset only, which has no box-drawing
// glyphs (U+2500-257F). Those fall back to another font at a different advance
// width, so an ASCII-art frame can never line up here — draw it with CSS instead.
function DmIntroBox({ theme }: { theme: ThemeName }) {
    const c = THEMES[theme];
    return (
        <div className="relative my-2 mr-auto inline-block max-w-full">
            <div
                className="rounded-sm px-4 py-2.5 font-mono text-sm"
                style={{ border: `1px solid ${c.cyan}`, color: c.white }}
            >
                Send a message directly to Zain&apos;s inbox.
            </div>
            <span
                className="absolute -top-2 left-3 px-1.5 font-mono text-[11px] font-bold tracking-wider"
                style={{ background: c.bg, color: c.cyan }}
            >
                DIRECT MESSAGE
            </span>
        </div>
    );
}

function buildDmOutro(): Segment[][] {
    return [
        [s("  Fill in the form below and hit ", C.dim), s("Send", C.green, true), s(".", C.dim)],
    ];
}

// ─── Matrix Rain ──────────────────────────────────────────────────────────────
function MatrixRain({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d"); if (!ctx) return;
        const resize = () => { canvas.width = canvas.parentElement!.clientWidth; canvas.height = canvas.parentElement!.clientHeight; };
        resize(); window.addEventListener("resize", resize);
        const fontSize = 14;
        const cols = Math.floor(canvas.width / fontSize);
        const drops: number[] = Array(cols).fill(0).map(() => Math.random() * -100);
        const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
        const draw = () => {
            ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize; const y = drops[i] * fontSize;
                ctx.fillStyle = "#00ff41"; ctx.globalAlpha = 0.8; ctx.fillText(char, x, y);
                ctx.fillStyle = "#ccffcc"; ctx.globalAlpha = 1; ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            ctx.globalAlpha = 1;
            rafRef.current = requestAnimationFrame(draw);
        };
        rafRef.current = requestAnimationFrame(draw);
        return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
    }, [active]);

    if (!active) return null;
    return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none opacity-20" />;
}

// ─── Segment row ──────────────────────────────────────────────────────────────
function SegmentRow({ segments }: { segments: Segment[] }) {
    return (
        <span className="font-mono break-words whitespace-pre-wrap">
            {segments.map((seg, i) => {
                const style = { color: seg.color ?? C.white, fontWeight: seg.bold ? 700 : 400 };
                if (seg.href) return (
                    <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer"
                        style={{ ...style, textDecoration: "underline", cursor: "pointer" }}
                        onClick={(e) => e.stopPropagation()} className="hover:opacity-80 transition-opacity">
                        {seg.text}
                    </a>
                );
                return <span key={i} style={style}>{seg.text}</span>;
            })}
        </span>
    );
}

// ─── DM Form ──────────────────────────────────────────────────────────────────
interface DmFormProps {
    theme: ThemeName;
    onSent: (success: boolean) => void;
    onCancel: () => void;
}

function DmForm({ theme, onSent, onCancel }: DmFormProps) {
    const T = THEMES[theme];
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
    const [error, setError] = useState("");
    const nameRef = useRef<HTMLInputElement>(null);
    const NAME_MAX = 80;
    const EMAIL_MAX = 254;
    const MESSAGE_MIN = 2;
    const MESSAGE_MAX = 500;

    useEffect(() => { nameRef.current?.focus(); }, []);

    const fieldStyle = {
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(${T.border},0.15)`,
        color: T.bright,
        caretColor: T.green,
        outline: "none",
    };

    const labelStyle = { color: T.blue, fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.08em" };
    const inputClass = "w-full rounded px-3 py-2 text-sm font-mono placeholder:opacity-30 focus:ring-0 transition-colors";

    const validate = () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName) return "Name is required.";
        if (trimmedName.length > NAME_MAX) return `Name must be ${NAME_MAX} characters or fewer.`;
        if (!trimmedEmail) return "Email is required.";
        if (trimmedEmail.length > EMAIL_MAX) return `Email must be ${EMAIL_MAX} characters or fewer.`;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return "Enter a valid email address.";
        if (trimmedMessage.length < MESSAGE_MIN) return `Message must be at least ${MESSAGE_MIN} characters.`;
        if (trimmedMessage.length > MESSAGE_MAX) return `Message must be ${MESSAGE_MAX} characters or fewer.`;
        return "";
    };

    const handleSend = async (e: FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const err = validate();
        if (err) { setError(err); return; }
        setError(""); setStatus("sending");

        try {
            const res = await fetch(`https://formspree.io/f/mgavbdvr`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim(),
                    _subject: `Portfolio DM from ${name.trim()}`,
                    _gotcha: honeypot,
                }),
            });

            if (res.ok) {
                setStatus("done");
                setTimeout(() => onSent(true), 1200);
                return;
            }

            if (res.status === 429) {
                setError("Too many messages sent recently. Please try again in a bit.");
            } else {
                let message = "Something went wrong. Please try emailing directly.";
                try {
                    const data = await res.json();
                    if (data?.errors?.length) message = data.errors.map((fe: { message: string }) => fe.message).join(" ");
                    else if (data?.error) message = data.error;
                } catch { /* response wasn't JSON, fall back to default message */ }
                setError(message);
            }
            setStatus("idle");
        } catch {
            setError("Network error. Check your connection and try again, or email me directly.");
            setStatus("idle");
        }
    };

    return (
        <AnimatePresence>
            <motion.form
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSend}
                onClick={(e) => e.stopPropagation()}
                className="ml-1 mt-2 mb-1 rounded-lg p-4 space-y-3"
                style={{
                    background: `rgba(255,255,255,0.025)`,
                    border: `1px solid rgba(${T.border},0.12)`,
                    maxWidth: "480px",
                }}
            >
                {/* Name */}
                <div className="space-y-1">
                    <label style={labelStyle}>NAME</label>
                    <input
                        ref={nameRef}
                        type="text" value={name}
                        onChange={(e) => { setName(e.target.value); setError(""); }}
                        placeholder="Your name"
                        maxLength={NAME_MAX}
                        style={fieldStyle} className={inputClass}
                        disabled={status !== "idle"}
                    />
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label style={labelStyle}>EMAIL</label>
                    <input
                        type="email" value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(""); }}
                        placeholder="your@email.com"
                        maxLength={EMAIL_MAX}
                        style={fieldStyle} className={inputClass}
                        disabled={status !== "idle"}
                    />
                </div>

                {/* Message */}
                <div className="space-y-1">
                    <label style={labelStyle}>MESSAGE</label>
                    <textarea
                        value={message}
                        onChange={(e) => { setMessage(e.target.value); setError(""); }}
                        placeholder="What's on your mind?"
                        rows={4}
                        maxLength={MESSAGE_MAX}
                        style={{ ...fieldStyle, resize: "vertical" }}
                        className={inputClass}
                        disabled={status !== "idle"}
                    />
                    <div className="text-right font-mono" style={{ color: T.dim, fontSize: "10px" }}>
                        {message.length} / {MESSAGE_MAX}
                    </div>
                </div>

                {/* Honeypot — hidden from real users, silently discarded by Formspree if filled by a bot */}
                <input
                    type="text"
                    name="_gotcha"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: "absolute", width: 0, height: 0, opacity: 0, overflow: "hidden", pointerEvents: "none" }}
                />

                {/* Error */}
                {error && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-xs font-mono" style={{ color: T.red }}>
                        ✗  {error}
                    </motion.p>
                )}

                {/* Success */}
                {status === "done" && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-xs font-mono" style={{ color: T.green }}>
                        ✓  Message sent! I'll get back to you soon.
                    </motion.p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                    <button
                        type="submit"
                        disabled={status !== "idle"}
                        className="flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold tracking-wider transition-all disabled:opacity-50"
                        style={{ background: T.green, color: T.bg }}
                    >
                        {status === "sending"
                            ? <><Loader2 className="w-3 h-3 animate-spin" /> SENDING…</>
                            : status === "done"
                                ? <><Check className="w-3 h-3" /> SENT</>
                                : <><Send className="w-3 h-3" /> SEND MESSAGE</>
                        }
                    </button>

                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onCancel(); }}
                        disabled={status === "sending"}
                        className="px-3 py-2 rounded text-xs font-mono tracking-wider transition-colors hover:bg-white/10 disabled:opacity-40"
                        style={{ color: T.dim }}
                    >
                        CANCEL
                    </button>

                    <span className="text-[10px] font-mono ml-auto" style={{ color: T.dim }}>
                        ESC to cancel
                    </span>
                </div>
            </motion.form>
        </AnimatePresence>
    );
}

// ─── Main Terminal ────────────────────────────────────────────────────────────
export default function Terminal({ onClose, initialCommand }: TerminalProps) {
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [copied, setCopied] = useState(false);
    const [theme, setTheme] = useState<ThemeName>("onedark");
    const [matrixActive, setMatrixActive] = useState(false);
    const [soundOn, setSoundOn] = useState(true);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showDmForm, setShowDmForm] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const lastDmRef = useRef<HTMLDivElement>(null);
    const commandHistoryRef = useRef<string[]>([]);
    const inputBeforeHistoryRef = useRef<string>("");
    const [historyIndex, setHistoryIndex] = useState(-1);
    const initialCommandExecuted = useRef(false);

    C = THEMES[theme];

    const makeLog = useCallback((type: LogType, rows: Segment[][]): Log[] =>
        rows.map((segments, i) => ({
            id: `${Date.now()}-${i}-${Math.random()}`,
            type, segments,
        })), []);

    const [history, setHistory] = useState<Log[]>(() => [
        ...makeLog("system", [
            [s("Zain_ul_Abideen ", C.cyan, true), s("[Version 18.0.4]", C.dim)],
            [{ text: `(c) ${new Date().getFullYear()} Zain-ul-Abideen. All rights reserved.`, color: C.dim, dim: true }],
            [s(" ")],
        ]),
        ...makeLog("output", [
            [s("Welcome! Type ", C.white), s("help", C.green, true), s(" to see commands, ", C.white), s("exit", C.red), s(" to close.", C.white)],
            [s(" ")],
        ]),
    ]);

    // Persist / restore theme
    useEffect(() => { try { localStorage.setItem("terminal-theme", theme); } catch { /**/ } }, [theme]);
    useEffect(() => {
        try {
            const saved = localStorage.getItem("terminal-theme") as ThemeName | null;
            if (saved && THEMES[saved]) setTheme(saved);
        } catch { /**/ }
    }, []);

    // Escape → cancel DM form first, then close terminal
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (showDmForm) { setShowDmForm(false); inputRef.current?.focus(); }
                else onClose();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose, showDmForm]);

    // Lock body + Lenis scroll while the overlay is open
    useEffect(() => {
        const lenis = getLenis();
        lenis?.stop();
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
            lenis?.start();
        };
    }, []);

    // Auto-scroll — always scroll to the very bottom
    useEffect(() => {
        if (showDmForm && lastDmRef.current) {
            lastDmRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [history, isTyping, showDmForm, suggestions]);

    useEffect(() => { soundEnabled = soundOn; }, [soundOn]);

    const getPrompt = () => (
        <span className="font-mono shrink-0 select-none">
            <span style={{ color: C.blue }}>~/portfolio</span>
            <span style={{ color: C.purple }}> ❯ </span>
        </span>
    );

    // `spacer` adds a blank trailing line so the next prompt breathes. Skip it when
    // something with its own top margin follows immediately (e.g. the DM form).
    const appendOutput = async (rows: Segment[][], type: LogType, spacer = true) => {
        for (let i = 0; i < rows.length; i++) {
            await new Promise((r) => setTimeout(r, 80));
            setHistory((prev) => [...prev, { id: `out-${Date.now()}-${i}`, type, segments: rows[i] }]);
        }
        if (spacer) setHistory((prev) => [...prev, { id: `spacer-${Date.now()}`, type: "system", segments: [s(" ")] }]);
    };

    const processCommand = useCallback(async (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        const parts = trimmed.split(/\s+/);
        const baseCmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(" ");

        commandHistoryRef.current = [trimmed, ...commandHistoryRef.current.filter((c) => c !== trimmed)].slice(0, 100);
        setHistoryIndex(-1);

        const inputLog: Log = { 
            id: `inp-${Date.now()}`, 
            type: "input", 
            segments: [s(trimmed, C.bright)],
            isDmCommand: baseCmd === "dm"
        };
        setHistory((prev) => [...prev, inputLog]);
        setInput(""); setIsTyping(true); setSuggestions([]);
        playReturn();
        await new Promise((r) => setTimeout(r, 350));

        let rows: Segment[][] = [];
        let type: LogType = "output";

        switch (baseCmd) {
            case "help": rows = buildHelp(); break;
            case "about": rows = buildAbout(); break;
            case "contact": rows = buildContact(); break;
            case "stack": rows = buildStack(); break;
            case "projects": rows = buildProjects(); break;
            case "whoami": rows = buildWhoami(); break;
            case "neofetch": rows = buildNeofetch(); break;
            case "date": rows = buildDate(); break;
            case "ls": rows = buildLs(); break;
            case "cat": rows = buildCat(args); break;
            case "echo": rows = buildEcho(args); break;
            case "resume": rows = buildResumeDownload(); break;
            case "theme":
                if (args && THEMES[args as ThemeName]) {
                    setTheme(args as ThemeName); rows = buildThemeApplied(args as ThemeName);
                } else { rows = buildThemeList(); }
                break;
            case "matrix":
                setMatrixActive((p) => !p);
                rows = [[s(matrixActive ? "☐ Matrix rain deactivated" : "☑ Matrix rain activated", C.green, true)]];
                break;
            case "sound":
                setSoundOn((p) => !p); rows = buildSoundToggled(!soundOn); break;
            case "sudo": case "sudo su":
                rows = buildSudo(); type = "error"; break;
            case "dm":
                setHistory((prev) => [...prev, {
                    id: `dmbox-${Date.now()}`, type, segments: [],
                    node: <DmIntroBox theme={theme} />,
                }]);
                await appendOutput(buildDmOutro(), type, false);
                setIsTyping(false);
                setShowDmForm(true);
                return;
            case "clear":
                setHistory([]); setShowDmForm(false); setIsTyping(false); return;
            case "exit":
                onClose(); return;
            default:
                rows = buildError(baseCmd); type = "error";
        }

        await appendOutput(rows, type);
        setIsTyping(false);
        setTimeout(() => inputRef.current?.focus(), 10);
    }, [matrixActive, soundOn, onClose, theme]);

    useEffect(() => {
        // RESET the ref when the component mounts or initialCommand changes
        initialCommandExecuted.current = false;
    }, []); // This ensures the command can run again every time the terminal is opened


    // ─── Auto-type and execute initialCommand ─────────────────────────────────
    useEffect(() => {
        if (!initialCommand || initialCommandExecuted.current) return;
        initialCommandExecuted.current = true;

        const command = initialCommand;
        let currentIndex = 0;

        // Start typing after a short delay to let the terminal mount
        const startDelay = setTimeout(() => {
            const typeInterval = setInterval(() => {
                currentIndex++;
                setInput(command.slice(0, currentIndex));
                playTick();

                if (currentIndex >= command.length) {
                    clearInterval(typeInterval);
                    // After finishing typing, wait a beat then "submit"
                    setTimeout(() => {
                        setInput("");
                        processCommand(command);
                    }, 400);
                }
            }, 80); // 80ms per character for a nice typing effect
        }, 600);

        return () => {
            clearTimeout(startDelay);
        };
    }, [initialCommand, processCommand]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!isTyping && !showDmForm && input.trim()) processCommand(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab") {
            e.preventDefault();
            if (!input.trim()) return;
            const partial = input.trim().toLowerCase();
            const matches = COMMANDS.filter((c) => c.startsWith(partial));
            if (matches.length === 1) { setInput(matches[0] + " "); playTick(); }
            else if (matches.length > 1) {
                const commonPrefix = matches.reduce((prefix, cmd) => {
                    let i = 0;
                    while (i < prefix.length && i < cmd.length && prefix[i] === cmd[i]) i++;
                    return prefix.slice(0, i);
                }, matches[0]);
                if (commonPrefix.length > partial.length) { setInput(commonPrefix); playTick(); }
                else {
                    setHistory((prev) => [...prev, { id: `tab-${Date.now()}`, type: "system", segments: [s(matches.join("  "), C.dim)] }]);
                }
            }
            return;
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            const hist = commandHistoryRef.current; if (!hist.length) return;
            if (historyIndex === -1) inputBeforeHistoryRef.current = input;
            const newIdx = Math.min(historyIndex + 1, hist.length - 1);
            setHistoryIndex(newIdx); setInput(hist[newIdx]);
            setTimeout(() => { if (inputRef.current) { inputRef.current.selectionStart = inputRef.current.selectionEnd = hist[newIdx].length; } }, 0);
            playTick(); return;
        }
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex <= 0) { setHistoryIndex(-1); setInput(inputBeforeHistoryRef.current); return; }
            const newIdx = historyIndex - 1;
            setHistoryIndex(newIdx); setInput(commandHistoryRef.current[newIdx]);
            setTimeout(() => { if (inputRef.current) { inputRef.current.selectionStart = inputRef.current.selectionEnd = commandHistoryRef.current[newIdx].length; } }, 0);
            playTick(); return;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value; setInput(val);
        const parts = val.trim().split(/\s+/);
        if (parts.length === 1 && parts[0] && !COMMANDS.includes(parts[0].toLowerCase()))
            setSuggestions(findSuggestions(parts[0]));
        else setSuggestions([]);
        if (val.length > 0) playTick();
    };

    const handleDmSent = (success: boolean) => {
        setShowDmForm(false);
        const rows: Segment[][] = success
            ? [
                [s("✓ ", C.green), s("Message delivered successfully!", C.green, true)],
                [s("  I'll get back to you soon. ", C.dim), s("- Zain", C.cyan)],
            ]
            : [[s("✗ ", C.red), s("Delivery failed. Please email directly.", C.red)]];
        setHistory((prev) => [...prev, ...rows.map((segments, i) => ({ id: `dm-res-${i}`, type: "output" as LogType, segments }))]);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleDmCancel = () => {
        setShowDmForm(false);
        setHistory((prev) => [...prev, { id: `dm-cancel-${Date.now()}`, type: "system", segments: [s("  DM cancelled.", C.dim)] }]);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText(SITE_CONFIG.email);
        setCopied(true); setTimeout(() => setCopied(false), 2000);
    };

    const suggestionVisible = suggestions.length > 0 && input && !showDmForm;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm cursor-pointer"
            style={{ background: `${THEMES[theme].bg}cc` }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-3xl h-[100dvh] sm:h-[65vh] sm:min-h-105 rounded-none sm:rounded-xl shadow-2xl flex flex-col overflow-hidden will-change-transform cursor-default pb-[env(safe-area-inset-bottom)]"
                style={{
                    background: THEMES[theme].bg,
                    borderColor: `rgba(${THEMES[theme].border},0.1)`,
                    borderWidth: 1,
                }}
                onClick={(e) => { e.stopPropagation(); if (!isTyping && !showDmForm) inputRef.current?.focus(); }}
            >
                <MatrixRain active={matrixActive} />

                {/* CRT overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-20"
                    style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0) 50%, rgba(0,0,0,0.25) 50%), linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))",
                        backgroundSize: "100% 4px, 3px 100%",
                    }}
                />

                {/* ── Header ── */}
                <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b select-none relative z-30"
                    style={{ background: THEMES[theme].headerBg, borderColor: `rgba(${THEMES[theme].border},0.05)` }}>
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <TerminalIcon className="w-4 h-4" style={{ color: C.dim }} />
                        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-wider truncate">
                            <span style={{ color: C.blue }}>root</span>
                            <span style={{ color: C.dim }}>@</span>
                            <span style={{ color: C.green }}>zain_engine</span>
                            <span style={{ color: C.dim }}>:~</span>
                        </span>
                        {matrixActive && <span className="text-[10px] font-mono animate-pulse" style={{ color: C.green }}>⬡ MATRIX</span>}
                        {showDmForm && <span className="text-[10px] font-mono animate-pulse" style={{ color: C.cyan }}>✉ DM MODE</span>}
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); setSoundOn((p) => !p); }}
                            className="p-1.5 cursor-pointer rounded hover:bg-white/10 transition-colors" style={{ color: C.dim }}>
                            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleCopyEmail(); }}
                            className="group cursor-pointer flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded hover:bg-white/10 transition-colors border"
                            style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.05)" }}>
                            {copied ? <Check className="w-3.5 h-3.5" style={{ color: C.green }} /> : <Copy className="w-3.5 h-3.5" style={{ color: C.dim }} />}
                            <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest transition-colors" style={{ color: C.dim }}>
                                {copied ? "Copied" : "Copy Email"}
                            </span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="p-1.5 cursor-pointer rounded hover:bg-red-500/20 transition-colors" style={{ color: C.dim }}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Scrollable output area ── */}
                <div
                    ref={scrollRef}
                    onWheel={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    className="flex-1 overflow-y-auto relative z-30"
                    style={{ scrollbarWidth: "thin", scrollbarColor: `${C.dim} transparent` }}
                >
                    <div className="px-3 sm:px-5 py-4 space-y-0.75 text-sm">
                        {/* History logs */}
                        {history.map((log) =>
                            log.type === "input" ? (
                                <div key={log.id} 
                                     ref={log.isDmCommand ? lastDmRef : null}
                                     className="flex items-center gap-1 mt-2">
                                    {getPrompt()}
                                    <SegmentRow segments={log.segments} />
                                </div>
                            ) : (
                                <div key={log.id} className="pl-1">
                                    {log.node ?? <SegmentRow segments={log.segments} />}
                                </div>
                            )
                        )}

                        {/* Inline DM form */}
                        {showDmForm && (
                            <DmForm theme={theme} onSent={handleDmSent} onCancel={handleDmCancel} />
                        )}

                        {/* Input row — always rendered so it anchors the scroll */}
                        {!showDmForm && (
                            <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-2">
                                {getPrompt()}
                                <input
                                    ref={inputRef}
                                    type="text" value={input}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    disabled={isTyping}
                                    autoFocus autoComplete="off" spellCheck={false}
                                    className="flex-1 bg-transparent outline-none border-none shadow-none focus:ring-0 p-0 disabled:opacity-40 font-mono text-sm"
                                    style={{ color: C.bright, caretColor: C.green }}
                                />
                                {isTyping && (
                                    <span className="text-xs font-mono animate-pulse shrink-0" style={{ color: C.dim }}>
                                        processing…
                                    </span>
                                )}
                            </form>
                        )}

                        {/* ── Suggestions ── */}
                        <AnimatePresence>
                            {suggestionVisible && (
                                <motion.div
                                    key="suggestions"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.15 }}
                                    className="pl-0 sm:pl-30 mt-1 text-[11px] font-mono flex items-center gap-1 flex-wrap"
                                    style={{ color: C.dim }}
                                >
                                    <span>Did you mean:</span>
                                    {suggestions.map((sug, i) => (
                                        <span key={sug} className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => { setInput(sug + " "); setSuggestions([]); inputRef.current?.focus(); }}
                                                className="hover:underline cursor-pointer"
                                                style={{ color: C.green }}
                                            >
                                                {sug}
                                            </button>
                                            {i < suggestions.length - 1 && <span style={{ color: C.dim }}>,</span>}
                                        </span>
                                    ))}
                                    <span>?</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div
                            ref={bottomRef}
                            style={{ height: suggestionVisible ? "5rem" : "3rem" }}
                            aria-hidden
                        />
                    </div>
                </div>

                {/* ── Footer ── */}
                <div
                    className="terminal-footer flex items-center justify-between gap-2 px-3 sm:px-4 py-1.5 border-t text-[10px] font-mono relative z-30 select-none"
                    style={{ background: THEMES[theme].headerBg, borderColor: `rgba(${THEMES[theme].border},0.05)`, color: C.dim }}
                >
                    <span><span style={{ color: C.green }}>●</span> {theme.toUpperCase()}</span>
                    <span>{soundOn ? "🔊" : "🔇"} SOUND {soundOn ? "ON" : "OFF"}</span>
                    <span>TAB: complete · ↑↓: history · <span style={{ color: C.cyan }}>dm</span>: message me</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

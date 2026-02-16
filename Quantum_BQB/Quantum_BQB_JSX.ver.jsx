import { useState, useMemo, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   📚 학습 앱 런처 v4 — Quantum Cyber Edition
   
   ✅ 앱 추가: 하단에 컴포넌트 → appRegistry에 등록 → 끝
   ✅ 카테고리 추가: CATEGORIES에 새 항목 추가
   ═══════════════════════════════════════════════════════════ */

const CATEGORIES = {
  all:      { label: "전체",     icon: "📚", color: "#8888a0" },
  quantum:  { label: "양자",     icon: "⚛️", color: "#38bdf8" },
  semi:     { label: "반도체",   icon: "🔬", color: "#a78bfa" },
  physics:  { label: "물리",     icon: "🌀", color: "#f472b6" },
  math:     { label: "수학",     icon: "📐", color: "#fb923c" },
  cs:       { label: "컴퓨터",   icon: "💻", color: "#34d399" },
  etc:      { label: "기타",     icon: "📦", color: "#fbbf24" },
};

const appRegistry = [
  {
    id: "bqb-beginner",
    title: "BQB 초보자 가이드",
    desc: "반도체 큐비트 대규모 배열의 핵심 기술을 비유로 이해하기",
    icon: "⚛️",
    color: "#38bdf8",
    category: "quantum",
    tags: ["BQB", "큐비트", "배열", "초보", "입문"],
    component: BQBBeginnerGuide,
  },
  {
    id: "bqb-intermediate",
    title: "BQB 중급 가이드",
    desc: "공정창·Triple-Wall·폐루프의 정량적 이해",
    icon: "🔬",
    color: "#6366f1",
    category: "quantum",
    tags: ["BQB", "공정창", "Triple-Wall", "폐루프", "중급"],
    component: BQBIntermediateGuide,
  },
  {
    id: "quantum-world",
    title: "Quantum World Explorer",
    desc: "양자역학 핵심 개념을 인터랙티브 시각화로 탐험",
    icon: "🌌",
    color: "#06b6d4",
    category: "quantum",
    tags: ["양자역학", "중첩", "얽힘", "터널링", "측정", "불확정성"],
    component: QuantumWorldExplorer,
  },
  {
    id: "bqb-advanced",
    title: "BQB 고급 가이드",
    desc: "설계 규칙·회로 아키텍처·열설계·KPI — 엔지니어링 레퍼런스",
    icon: "🔧",
    color: "#58a6ff",
    category: "quantum",
    tags: ["BQB", "고급", "PDK", "DD-IC", "Triple-Wall", "열설계", "KPI", "설계규칙"],
    component: BQBAdvancedGuide,
  },
];

const T = {
  bg: "#030712", bgSub: "#0a0e1a", card: "#0d1321", cardHover: "#131b2e",
  surface: "#1a2236", accent: "#6366f1", accentCyan: "#22d3ee", accentPink: "#e879f9",
  text: "#e2e8f0", textDim: "#94a3b8", textMuted: "#475569",
  border: "#1e293b", borderLight: "#334155",
  glow: "#6366f1",
};

/* ─── 런처 배경 파티클 ─── */
function LauncherBG() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes lFloat { 0%,100%{transform:translateY(0) scale(1);opacity:0.2} 50%{transform:translateY(-25px) scale(1.4);opacity:0.5} }
        @keyframes lScan { 0%{top:-2px;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes lPulse { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
        @keyframes lOrbit { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes lShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes lFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lGlowPulse { 0%,100%{box-shadow:0 0 20px #6366f115;border-color:#6366f120} 50%{box-shadow:0 0 40px #6366f125;border-color:#6366f140} }
        @keyframes lCardEnter { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
      `}</style>
      {/* Grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${T.glow}06 1px, transparent 1px), linear-gradient(90deg, ${T.glow}06 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        animation: "lPulse 10s ease-in-out infinite",
      }} />
      {/* Ambient glow orbs */}
      <div style={{ position: "absolute", top: -200, left: "20%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${T.accentCyan}06, transparent 70%)`, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: -200, right: "10%", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${T.accentPink}05, transparent 70%)`, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", top: "40%", left: "60%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${T.glow}04, transparent 70%)`, filter: "blur(30px)" }} />
      {/* Particles */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 41 + 7) % 100}%`,
          top: `${(i * 59 + 13) % 100}%`,
          width: i % 4 === 0 ? 3 : 2,
          height: i % 4 === 0 ? 3 : 2,
          borderRadius: "50%",
          background: [T.accentCyan, T.glow, T.accentPink, "#4ade80"][i % 4],
          animation: `lFloat ${4 + (i % 5) * 1.5}s ease-in-out ${i * 0.4}s infinite`,
        }} />
      ))}
      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, transparent, ${T.accentCyan}15, transparent)`,
        animation: "lScan 15s linear infinite",
      }} />
    </div>
  );
}

/* ─── 로고 아톰 애니메이션 ─── */
function LogoAtom() {
  const orbitColors = [T.accentCyan, T.glow, T.accentPink];
  return (
    <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
      {/* Orbital rings */}
      {[0, 60, -60].map((rot, i) => (
        <div key={i} style={{
          position: "absolute", inset: 4,
          borderRadius: "50%",
          border: `1.5px solid ${orbitColors[i]}20`,
          transform: `rotate(${rot}deg)`,
        }} />
      ))}
      {/* Electrons */}
      {orbitColors.map((c, i) => (
        <div key={`e${i}`} style={{
          position: "absolute", top: "50%", left: "50%",
          width: 5, height: 5, marginLeft: -2.5, marginTop: -2.5,
          borderRadius: "50%", background: c,
          boxShadow: `0 0 8px ${c}80`,
          animation: `lOrbit ${3 + i * 1.5}s linear infinite`,
          transformOrigin: `0 ${20 + i * 4}px`,
        }} />
      ))}
      {/* Core */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: 14, height: 14, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.glow}, ${T.accentCyan}80)`,
        boxShadow: `0 0 16px ${T.glow}50, 0 0 32px ${T.accentCyan}20`,
      }} />
    </div>
  );
}

export default function App() {
  const [activeApp, setActiveApp] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showHelp, setShowHelp] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const filtered = useMemo(() => {
    let list = appRegistry;
    if (category !== "all") list = list.filter(a => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  }, [search, category]);

  const catCounts = useMemo(() => {
    const c = { all: appRegistry.length };
    appRegistry.forEach(a => { c[a.category] = (c[a.category] || 0) + 1; });
    return c;
  }, []);

  const font = "'Noto Sans KR', system-ui, -apple-system, sans-serif";

  /* ═══ 앱 실행 뷰 ═══ */
  if (activeApp) {
    const app = appRegistry.find(a => a.id === activeApp);
    const Comp = app.component;
    const catColor = CATEGORIES[app.category]?.color || T.accent;
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: font }}>
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: `${T.bg}e8`, backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${T.border}`, padding: "0 16px",
        }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, height: 52 }}>
            <button onClick={() => setActiveApp(null)} style={{
              background: `${T.accent}10`, border: `1px solid ${T.accent}30`,
              color: T.accent, borderRadius: 10, padding: "7px 16px",
              cursor: "pointer", fontSize: 13, fontWeight: 700,
              transition: "all 0.2s",
            }}>← 목록</button>
            <div style={{ width: 1, height: 24, background: T.border }} />
            <span style={{ fontSize: 18 }}>{app.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{app.title}</span>
            <span style={{
              fontSize: 10, color: catColor,
              background: `${catColor}12`, padding: "3px 10px",
              borderRadius: 20, fontWeight: 600, border: `1px solid ${catColor}20`,
            }}>{CATEGORIES[app.category]?.label}</span>
          </div>
        </div>
        <Comp />
      </div>
    );
  }

  /* ═══ 사용 가이드 ═══ */
  if (showHelp) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: font, color: T.text, position: "relative" }}>
        <LauncherBG />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "24px 20px 80px" }}>
          <button onClick={() => setShowHelp(false)} style={{
            background: `${T.accent}10`, border: `1px solid ${T.accent}30`,
            color: T.accent, borderRadius: 10, padding: "7px 16px",
            cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: 32,
          }}>← 돌아가기</button>
          <div style={{ fontSize: 10, fontWeight: 800, color: T.accentCyan, letterSpacing: 4, marginBottom: 8 }}>USER MANUAL</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, background: `linear-gradient(135deg, ${T.text}, ${T.accentCyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>사용 가이드</h1>
          <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.8, marginBottom: 40 }}>이 런처의 모든 것을 설명합니다.</p>
          {[
            { num: "1", title: "실행하는 법", color: "#4ade80", content: ["이 파일(Launcher.jsx)을 Claude 채팅에서 열면 바로 실행됩니다.", "홈 화면에서 원하는 앱 카드를 클릭하면 해당 앱이 실행됩니다.", "상단의 ← 목록 버튼을 누르면 홈으로 돌아옵니다."] },
            { num: "2", title: "앱 찾는 법", color: "#22d3ee", content: ["검색창에 키워드를 입력하면 제목, 설명, 태그에서 검색됩니다.", "카테고리 탭을 눌러 분야별로 필터링할 수 있습니다.", "예: '큐비트' 검색 → BQB 관련 앱만 표시"] },
            { num: "3", title: "새 앱 추가하는 법", color: "#a78bfa", content: ["Claude에게 \"○○ 앱 만들어서 런처에 추가해줘\"라고 말하면 됩니다.", "Claude가 앱 코드를 작성하고, 이 런처 파일에 자동으로 등록합니다.", "새로 만든 앱은 홈 화면에 바로 나타납니다."] },
            { num: "4", title: "수정/개선하는 법", color: "#fb923c", content: ["\"○○ 앱에서 △△ 부분 수정해줘\"라고 말하면 됩니다.", "Claude가 해당 부분을 찾아서 수정한 후 업데이트된 런처를 제공합니다.", "디자인, 내용, 인터랙션 모두 수정 가능합니다."] },
            { num: "5", title: "카테고리 확장하는 법", color: "#f472b6", content: ["현재: 양자, 반도체, 물리, 수학, 컴퓨터, 기타", "\"○○ 카테고리 추가해줘\"라고 하면 Claude가 추가합니다.", "카테고리는 무제한 확장 가능합니다."] },
          ].map(s => (
            <div key={s.num} style={{
              background: `${s.color}06`, borderRadius: 14,
              border: `1px solid ${s.color}18`, padding: 24, marginBottom: 14,
              borderLeft: `3px solid ${s.color}60`,
              animation: "lFadeUp 0.4s ease forwards",
              animationDelay: `${parseInt(s.num) * 0.08}s`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${s.color}15`, color: s.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 900, border: `1px solid ${s.color}25`,
                }}>{s.num}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.title}</div>
              </div>
              {s.content.map((line, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < s.content.length - 1 ? 8 : 0 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: `${s.color}50`, marginTop: 9, flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.7 }}>{line}</div>
                </div>
              ))}
            </div>
          ))}
          <div style={{
            background: `${T.glow}06`, borderRadius: 14,
            border: `1px dashed ${T.glow}25`, padding: 24, textAlign: "center", marginTop: 8,
          }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>💬</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.8 }}>
              요약: <strong style={{ color: T.accentCyan }}>Claude에게 말하면 다 됩니다.</strong><br />
              만들기, 수정, 삭제, 카테고리 추가 전부 대화로 해결.
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ 홈 화면 ═══ */
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: font, color: T.text, position: "relative" }}>
      <LauncherBG />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ─── HEADER ─── */}
        <div style={{ padding: "52px 20px 0" }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <LogoAtom />
                <div>
                  <div style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: 5,
                    color: T.accentCyan, marginBottom: 6,
                  }}>STUDY HUB</div>
                  <h1 style={{
                    fontSize: 30, fontWeight: 900, margin: 0, lineHeight: 1.2,
                    background: `linear-gradient(135deg, ${T.text} 0%, ${T.accentCyan} 50%, ${T.accentPink} 100%)`,
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundSize: "200% auto",
                    animation: "lShimmer 6s linear infinite",
                  }}>학습 앱 런처</h1>
                </div>
              </div>
              <button onClick={() => setShowHelp(true)} style={{
                background: `${T.glow}08`, border: `1px solid ${T.glow}20`,
                borderRadius: 10, padding: "8px 14px", cursor: "pointer",
                fontSize: 12, fontWeight: 700, color: T.textDim,
                display: "flex", alignItems: "center", gap: 5,
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: 14, color: T.glow }}>?</span> 가이드
              </button>
            </div>

            {/* ─── Stats bar ─── */}
            <div style={{
              display: "flex", gap: 16, marginTop: 20, padding: "12px 0",
              borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`,
            }}>
              {[
                { label: "등록 앱", value: appRegistry.length, color: T.accentCyan },
                { label: "카테고리", value: Object.keys(catCounts).filter(k => k !== "all" && catCounts[k] > 0).length, color: T.glow },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 20, fontWeight: 900, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</span>
                  <span style={{ fontSize: 11, color: T.textMuted, fontWeight: 600 }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* ─── SEARCH ─── */}
            <div style={{ marginTop: 20, position: "relative" }}>
              <div style={{
                position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
                fontSize: 15, color: T.textMuted, pointerEvents: "none", opacity: 0.6,
              }}>⌕</div>
              <input
                type="text" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="앱 이름, 키워드, 태그로 검색..."
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: `${T.card}cc`,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12, padding: "13px 16px 13px 42px",
                  fontSize: 14, color: T.text, outline: "none",
                  backdropFilter: "blur(8px)",
                  transition: "all 0.3s",
                  animation: "lGlowPulse 4s ease-in-out infinite",
                }}
                onFocus={e => {
                  e.target.style.borderColor = `${T.accentCyan}50`;
                  e.target.style.boxShadow = `0 0 24px ${T.accentCyan}15`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = T.border;
                  e.target.style.boxShadow = `0 0 20px ${T.glow}15`;
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: `${T.textMuted}20`, border: "none", borderRadius: 6,
                  width: 24, height: 24, cursor: "pointer", color: T.textDim, fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              )}
            </div>

            {/* ─── CATEGORY TABS ─── */}
            <div style={{ display: "flex", gap: 6, marginTop: 14, paddingBottom: 20, overflowX: "auto" }}>
              {Object.entries(CATEGORIES).map(([id, cat]) => {
                const count = catCounts[id] || 0;
                const active = category === id;
                if (id !== "all" && count === 0) return null;
                return (
                  <button key={id} onClick={() => setCategory(id)} style={{
                    background: active ? `${cat.color}12` : `${T.card}80`,
                    border: `1px solid ${active ? `${cat.color}35` : T.border}`,
                    borderRadius: 20, padding: "7px 14px",
                    cursor: "pointer", whiteSpace: "nowrap",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.25s",
                    boxShadow: active ? `0 0 16px ${cat.color}12` : "none",
                  }}>
                    <span style={{ fontSize: 13 }}>{cat.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? cat.color : T.textDim }}>{cat.label}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700,
                      color: active ? cat.color : T.textMuted,
                      background: active ? `${cat.color}18` : `${T.textMuted}12`,
                      borderRadius: 10, padding: "1px 6px",
                      minWidth: 16, textAlign: "center",
                    }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 20px 80px" }}>
          {filtered.length === 0 ? (
            /* 빈 검색 결과 */
            <div style={{ textAlign: "center", padding: "60px 20px", color: T.textMuted }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⌕</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: T.textDim }}>검색 결과가 없습니다</div>
              <div style={{ fontSize: 13 }}>다른 키워드로 검색해보세요</div>
            </div>
          ) : (
            /* 앱 카드 그리드 */
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 12,
            }}>
              {filtered.map((app, idx) => {
                const isHovered = hoveredCard === app.id;
                const catColor = CATEGORIES[app.category]?.color || T.accent;
                return (
                  <div
                    key={app.id}
                    onClick={() => setActiveApp(app.id)}
                    onMouseEnter={() => setHoveredCard(app.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      position: "relative",
                      background: isHovered ? T.cardHover : T.card,
                      border: `1px solid ${isHovered ? `${app.color}30` : T.border}`,
                      borderRadius: 16, padding: 22,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      transform: isHovered ? "translateY(-3px)" : "none",
                      boxShadow: isHovered
                        ? `0 8px 32px ${app.color}12, 0 0 0 1px ${app.color}15, inset 0 1px 0 ${app.color}08`
                        : "none",
                      animation: "lCardEnter 0.4s ease forwards",
                      animationDelay: `${idx * 0.06}s`,
                      opacity: 0,
                      overflow: "hidden",
                    }}
                  >
                    {/* Card glow orb */}
                    <div style={{
                      position: "absolute", top: -40, right: -40,
                      width: 120, height: 120, borderRadius: "50%",
                      background: `radial-gradient(circle, ${app.color}${isHovered ? "10" : "04"}, transparent 70%)`,
                      transition: "all 0.3s", pointerEvents: "none",
                    }} />
                    {/* Bottom accent line */}
                    <div style={{
                      position: "absolute", bottom: 0, left: 20, right: 20, height: 1,
                      background: `linear-gradient(90deg, transparent, ${app.color}${isHovered ? "40" : "10"}, transparent)`,
                      transition: "all 0.3s",
                    }} />

                    <div style={{ position: "relative", zIndex: 1 }}>
                      {/* Top: icon + category */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 12,
                          background: `${app.color}10`, border: `1px solid ${app.color}20`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 22, transition: "all 0.3s",
                          boxShadow: isHovered ? `0 0 20px ${app.color}18` : "none",
                        }}>{app.icon}</div>
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: catColor,
                          background: `${catColor}10`, padding: "3px 8px",
                          borderRadius: 6, border: `1px solid ${catColor}15`,
                          letterSpacing: 0.5,
                        }}>{CATEGORIES[app.category]?.label}</span>
                      </div>

                      {/* Title */}
                      <div style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 6, lineHeight: 1.3 }}>
                        {app.title}
                      </div>

                      {/* Description */}
                      <div style={{
                        fontSize: 12, color: T.textDim, lineHeight: 1.6,
                        marginBottom: 12,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>{app.desc}</div>

                      {/* Tags */}
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {app.tags.slice(0, 4).map(tag => (
                          <span key={tag} style={{
                            fontSize: 9, color: T.textMuted,
                            background: `${T.textMuted}0a`, padding: "2px 7px",
                            borderRadius: 4, border: `1px solid ${T.textMuted}10`,
                          }}>#{tag}</span>
                        ))}
                        {app.tags.length > 4 && (
                          <span style={{ fontSize: 9, color: T.textMuted, padding: "2px 4px" }}>
                            +{app.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          <div style={{
            marginTop: 24, padding: "20px",
            background: `${T.glow}04`, borderRadius: 14,
            border: `1px dashed ${T.glow}15`, textAlign: "center",
          }}>
            <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.8 }}>
              <span style={{ color: T.accentCyan, fontWeight: 700 }}>+</span> Claude에게 <strong style={{ color: T.textDim }}>"○○ 앱 만들어줘"</strong>
              <span style={{ margin: "0 10px", color: T.border }}>│</span>
              <span style={{ color: T.accentPink, fontWeight: 700 }}>✎</span> <strong style={{ color: T.textDim }}>"○○ 수정해줘"</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ╔═══════════════════════════════════════════════════════════╗
   ║   앱 코드 영역 — 새 앱은 아래에 추가                     ║
   ╚═══════════════════════════════════════════════════════════╝ */

/* ═══════ APP: BQB 초보자 가이드 ═══════ */
function BQBBeginnerGuide() {


const C = {
  bg: "#0f172a",
  card: "#1e293b",
  surface: "#334155",
  accent: "#38bdf8",
  accentDim: "#0c4a6e",
  red: "#f87171",
  orange: "#fb923c",
  yellow: "#fbbf24",
  green: "#34d399",
  purple: "#a78bfa",
  pink: "#f472b6",
  text: "#f1f5f9",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  border: "#334155",
};

/* ───────── 0. 인트로: 큐비트란? ───────── */
function IntroSection() {
  const [showArray, setShowArray] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <StepCard
        num="먼저"
        title="큐비트가 뭔지부터 알아봅시다"
        color={C.purple}
      >
        <p style={ps}>
          일반 컴퓨터는 <B>비트(bit)</B> — 0 또는 1 — 로 계산합니다.
          <br />
          양자컴퓨터는 <B c={C.purple}>큐비트(qubit)</B>를 씁니다. 큐비트는 0과
          1을 <B c={C.purple}>동시에</B> 가질 수 있어서, 특정 문제를 훨씬 빨리
          풀 수 있습니다.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", margin: "20px 0" }}>
          <Chip label="일반 비트" emoji="🔘" sub="0 또는 1" color={C.textMuted} />
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: C.textMuted }}>→</div>
          <Chip label="큐비트" emoji="⚛️" sub="0과 1 동시 (중첩)" color={C.purple} />
        </div>
        <p style={ps}>
          이 과제에서 큐비트는 <B>실리콘 안에 심은 인(³¹P) 원자 하나</B>의
          스핀(자전 방향)입니다. 원자 하나가 곧 큐비트 하나입니다.
        </p>
      </StepCard>

      <StepCard
        num="그런데"
        title="큐비트 하나로는 쓸모가 없습니다"
        color={C.orange}
      >
        <p style={ps}>
          양자컴퓨터가 되려면 큐비트가 <B c={C.orange}>수백~수천 개</B> 필요합니다.
          그것도 격자처럼 <B c={C.orange}>가지런히 배열</B>돼야 합니다.
        </p>
        <div style={{ textAlign: "center", margin: "16px 0" }}>
          <button
            onClick={() => setShowArray(!showArray)}
            style={{
              background: `${C.orange}22`,
              border: `1px solid ${C.orange}`,
              color: C.orange,
              borderRadius: 8,
              padding: "10px 24px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {showArray ? "접기" : "배열이 뭔지 보기 →"}
          </button>
        </div>
        {showArray && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <QubitDot /> <span style={{ color: C.textDim, fontSize: 13 }}>← 큐비트 1개</span>
            </div>
            <div style={{ fontSize: 20, color: C.textMuted }}>↓ 이걸 격자로 배열하면</div>
            <QubitGrid size={4} />
            <div style={{ fontSize: 13, color: C.textDim }}>4×4 = 16개 배열 (이 과제 최종 목표: 16×16 = 256개)</div>
          </div>
        )}
      </StepCard>

      <Callout color={C.red} emoji="❗">
        하나 만드는 건 됩니다. 문제는 <B c={C.red}>수백 개를 동시에, 같은 품질로</B> 만드는
        겁니다. 이게 왜 어려운지 다음 장에서 봅시다.
      </Callout>
    </div>
  );
}

/* ───────── 1. 문제: 왜 어려운가 ───────── */
function ProblemSection() {
  const [step, setStep] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <StepCard num="비유" title='"과녁에 다트 던지기"로 이해하기' color={C.accent}>
        <p style={ps}>
          실리콘 안에 인(P) 원자를 심는 걸 <B>"이온 주입"</B>이라 합니다.
          <br />
          이걸 비유하면 <B c={C.accent}>어두운 방에서 다트를 던지는 것</B>과
          같습니다.
        </p>
      </StepCard>

      {/* Interactive dart analogy */}
      <div style={{
        background: C.card, borderRadius: 16, padding: 28,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["1개 던지기", "100개 던지기", "100개 + 환경 문제"].map((label, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                background: step === i ? `${C.accent}30` : "transparent",
                border: `1px solid ${step === i ? C.accent : C.border}`,
                color: step === i ? C.accent : C.textDim,
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {step === 0 && (
          <div style={{ textAlign: "center" }}>
            <DartBoard darts={[{ x: 48, y: 50, ok: true }]} />
            <p style={{ ...ps, marginTop: 16 }}>
              다트 <B c={C.green}>1개</B>는 과녁 근처에 꽂을 수 있습니다.
              <br />→ 큐비트 1개는 만들 수 있다는 뜻입니다.
            </p>
          </div>
        )}
        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <DartBoard
              darts={[
                { x: 48, y: 50, ok: true }, { x: 52, y: 47, ok: true },
                { x: 45, y: 53, ok: true }, { x: 55, y: 45, ok: false },
                { x: 40, y: 58, ok: false }, { x: 60, y: 40, ok: false },
                { x: 35, y: 55, ok: false }, { x: 58, y: 60, ok: false },
                { x: 30, y: 65, ok: false }, { x: 65, y: 35, ok: false },
              ]}
            />
            <p style={{ ...ps, marginTop: 16 }}>
              100개를 던지면? 일부는 과녁에 맞지만,{" "}
              <B c={C.red}>대부분은 흩어집니다.</B>
              <br />
              이걸 <B>"산란(straggle)"</B>이라 합니다 — 원자가 정확한 자리에 안
              가고 흩어지는 현상.
            </p>
          </div>
        )}
        {step === 2 && (
          <div style={{ textAlign: "center" }}>
            <DartBoard
              darts={[
                { x: 30, y: 70, ok: false }, { x: 65, y: 30, ok: false },
                { x: 25, y: 40, ok: false }, { x: 70, y: 65, ok: false },
                { x: 55, y: 75, ok: false }, { x: 20, y: 55, ok: false },
                { x: 75, y: 45, ok: false }, { x: 40, y: 25, ok: false },
              ]}
              shaking
            />
            <p style={{ ...ps, marginTop: 16 }}>
              게다가 과녁 자체가 <B c={C.red}>흔들리고</B>(전하 잡음),{" "}
              <B c={C.red}>바람이 불고</B>(열 간섭),{" "}
              <B c={C.red}>옆 과녁과 부딪히면</B>(크로스토크)?
              <br />→ 이것이 <B>대규모 배열이 실패하는 이유</B>입니다.
            </p>
          </div>
        )}
      </div>

      <Callout color={C.yellow} emoji="💡">
        기존 연구는 "다트를 더 잘 던지는 법"에 집중했습니다.
        <br />
        BQB는 발상을 바꿉니다: <B c={C.yellow}>"과녁과 환경 자체를 고정하자."</B>
      </Callout>
    </div>
  );
}

/* ───────── 2. BQB 핵심 아이디어 ───────── */
function BQBIdeaSection() {
  const [phase, setPhase] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <StepCard num="핵심" title="BQB = 과녁판을 미리 만들어 두는 것" color={C.green}>
        <p style={ps}>
          BQB는 <B c={C.green}>Buried Quantum Barrier</B>, 즉{" "}
          <B c={C.green}>"매립된 양자 장벽"</B>입니다.
          <br /><br />
          실리콘 웨이퍼 안에 <B>보이지 않는 울타리(장벽)</B>를 미리 매립해서,
          <br />
          원자가 심어질 수 있는 <B>3차원 공간을 물리적으로 제한</B>합니다.
        </p>
      </StepCard>

      {/* Before / After visual */}
      <div style={{
        background: C.card, borderRadius: 16, padding: 28,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["기존 방식", "BQB 방식"].map((label, i) => (
            <button
              key={i}
              onClick={() => setPhase(i)}
              style={{
                flex: 1,
                background: phase === i ? (i === 0 ? `${C.red}20` : `${C.green}20`) : "transparent",
                border: `1px solid ${phase === i ? (i === 0 ? C.red : C.green) : C.border}`,
                color: phase === i ? (i === 0 ? C.red : C.green) : C.textDim,
                borderRadius: 8,
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {phase === 0 ? (
          <div style={{ textAlign: "center" }}>
            <BeforeAfterDiagram type="before" />
            <div style={{ marginTop: 16 }}>
              <p style={ps}>
                실리콘 안 <B c={C.red}>아무 데나</B> 이온을 쏩니다.
                <br />
                원자가 어디에 멈출지 <B c={C.red}>예측 불가</B>.
                <br />
                주변 전하 환경도 <B c={C.red}>제어 불가</B>.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <BeforeAfterDiagram type="after" />
            <div style={{ marginTop: 16 }}>
              <p style={ps}>
                미리 만든 <B c={C.green}>장벽(BQB)</B>이 "여기까지만!" 하고 막아줍니다.
                <br />
                원자가 흩어져도 <B c={C.green}>허용 범위 안</B>에 머뭅니다.
                <br />
                주변 환경도 <B c={C.green}>장벽이 차폐</B>합니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── 3. 공정창 ───────── */
function ProcessWindowSection() {
  const [active, setActive] = useState(null);
  const wins = [
    {
      id: "geo",
      icon: "📍",
      name: "위치 허용 범위",
      eng: "Geometric Window",
      color: C.red,
      analogy: "과녁판의 크기",
      explain: "원자가 심어질 수 있는 3D 공간의 크기를 정합니다. BQB 장벽이 이 공간의 '벽'이 되어, 산란된 원자가 벽 밖으로 나가면 그냥 무시됩니다.",
      visual: "wall",
    },
    {
      id: "elec",
      icon: "⚡",
      name: "전기 환경 허용 범위",
      eng: "Electrostatic Window",
      color: C.yellow,
      analogy: "과녁 주변 바람의 세기",
      explain: "큐비트 주변의 전하 잡음, 전기장 기울기 등 '전기적 환경'이 얼마나 흔들려도 괜찮은지의 범위를 정합니다. 범위를 벗어나면 큐비트 품질이 떨어집니다.",
      visual: "wind",
    },
    {
      id: "align",
      icon: "🎯",
      name: "정렬 허용 범위",
      eng: "Alignment Window",
      color: C.green,
      analogy: "과녁판이 벽에 얼마나 정확히 붙어있는지",
      explain: "큐비트 위치와 그 위에 올라가는 배선/패키징의 좌표가 얼마나 어긋나도 되는지를 정합니다. nm 단위로 관리합니다.",
      visual: "align",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <StepCard num="개념" title='"공정창" = 허용 오차의 규격서' color={C.accent}>
        <p style={ps}>
          BQB의 진짜 힘은 <B c={C.accent}>"공정창(Process Window)"</B>이라는 개념입니다.
          <br /><br />
          공정창이란: <B>"이 범위 안에만 들어오면 OK"</B>라는{" "}
          <B c={C.accent}>허용 오차 규격</B>을 미리 정의하는 것입니다.
          <br /><br />
          BQB는 이 규격을 <B>세 가지 차원</B>에서 동시에 정의합니다:
        </p>
      </StepCard>

      {/* Three windows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {wins.map((w) => (
          <div
            key={w.id}
            onClick={() => setActive(active === w.id ? null : w.id)}
            style={{
              background: active === w.id ? `${w.color}12` : C.card,
              borderRadius: 14,
              padding: active === w.id ? "24px" : "18px 24px",
              border: `2px solid ${active === w.id ? w.color : C.border}`,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{w.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: w.color }}>{w.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{w.eng}</div>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>
                {active === w.id ? "▲" : "▼"}
              </div>
            </div>

            {active === w.id && (
              <div style={{ marginTop: 16 }}>
                <div style={{
                  background: `${w.color}10`,
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 14,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: w.color, marginBottom: 4 }}>
                    비유
                  </div>
                  <div style={{ fontSize: 15, color: C.text, fontWeight: 600 }}>
                    {w.analogy}
                  </div>
                </div>
                <p style={{ ...ps, margin: 0 }}>{w.explain}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Callout color={C.accent} emoji="🔑">
        핵심: 이 세 가지 범위가 <B c={C.accent}>동시에</B> 정의돼야 합니다.
        <br />
        하나라도 빠지면, 배열이 커질수록 오차가 눈덩이처럼 불어나 전체가 무너집니다.
      </Callout>
    </div>
  );
}

/* ───────── 4. Triple Wall ───────── */
function TripleWallSection() {
  const [activeWall, setActiveWall] = useState(0);
  const walls = [
    {
      num: 1,
      name: "외곽 격리벽 (Wall-1)",
      color: C.red,
      analogy: "🏠 집의 외벽",
      explain: "STI(얕은 트렌치)라는 도랑을 파서 옆 칸과 물리적으로 분리합니다. 옆 큐비트의 전기 신호가 넘어오지 못하게 차단합니다.",
      blocks: "옆 큐비트의 간섭 (크로스토크)",
    },
    {
      num: 2,
      name: "전기 차폐벽 (Wall-2)",
      color: C.yellow,
      analogy: "🛡️ 방의 차음벽",
      explain: "T3(Triple Well) 구조로 전기적 실드를 형성합니다. 외부 전기 잡음이 큐비트까지 도달하지 못하게 막고, 각 큐비트를 독립적으로 미세 조정할 수 있게 합니다.",
      blocks: "전기 잡음, 전하 흔들림",
    },
    {
      num: 3,
      name: "매립 장벽 (Wall-3: BQB-B)",
      color: C.green,
      analogy: "🎯 과녁의 테두리",
      explain: "실리콘 내부에 매립된 장벽으로, 이온 주입 시 원자가 너무 깊이 들어가거나 옆으로 퍼지는 것을 물리적으로 막습니다. 큐비트가 정확한 깊이에 형성되도록 합니다.",
      blocks: "원자의 산란, 채널링",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <StepCard num="구조" title="Triple-Wall = 큐비트를 감싸는 3중 보호벽" color={C.purple}>
        <p style={ps}>
          BQB는 각 큐비트를 <B c={C.purple}>세 겹의 벽</B>으로 둘러쌉니다.
          <br />
          각 벽은 서로 다른 종류의 위협을 막는 역할을 합니다.
        </p>
      </StepCard>

      {/* Nested box visual */}
      <div style={{
        background: C.card, borderRadius: 16, padding: 28,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 380, margin: "0 auto", aspectRatio: "1/1" }}>
          {/* Wall 1 - outermost */}
          <div
            onClick={() => setActiveWall(0)}
            style={{
              position: "absolute", inset: 0,
              borderRadius: 20,
              border: `4px ${activeWall === 0 ? "solid" : "dashed"} ${C.red}`,
              background: activeWall === 0 ? `${C.red}15` : `${C.red}05`,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            <div style={{ position: "absolute", top: 10, left: 14, fontSize: 12, fontWeight: 800, color: C.red }}>
              Wall-1: 외곽 격리
            </div>
          </div>

          {/* Wall 2 */}
          <div
            onClick={(e) => { e.stopPropagation(); setActiveWall(1); }}
            style={{
              position: "absolute",
              top: "14%", left: "14%", right: "14%", bottom: "14%",
              borderRadius: 16,
              border: `4px ${activeWall === 1 ? "solid" : "dashed"} ${C.yellow}`,
              background: activeWall === 1 ? `${C.yellow}15` : `${C.yellow}05`,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            <div style={{ position: "absolute", top: 10, left: 14, fontSize: 12, fontWeight: 800, color: C.yellow }}>
              Wall-2: 전기 차폐
            </div>
          </div>

          {/* Wall 3 */}
          <div
            onClick={(e) => { e.stopPropagation(); setActiveWall(2); }}
            style={{
              position: "absolute",
              top: "28%", left: "28%", right: "28%", bottom: "28%",
              borderRadius: 12,
              border: `4px ${activeWall === 2 ? "solid" : "dashed"} ${C.green}`,
              background: activeWall === 2 ? `${C.green}15` : `${C.green}05`,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            <div style={{ position: "absolute", top: 8, left: 10, fontSize: 11, fontWeight: 800, color: C.green }}>
              Wall-3: 매립 장벽
            </div>
          </div>

          {/* Qubit center */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 56, height: 56,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.purple}50, ${C.purple}15)`,
            border: `3px solid ${C.purple}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column",
            boxShadow: `0 0 40px ${C.purple}30`,
          }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: C.purple }}>큐비트</div>
            <div style={{ fontSize: 8, color: C.purple }}>³¹P</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center", margin: "14px 0 4px" }}>
          ↑ 각 벽을 클릭해 보세요
        </div>

        {/* Wall detail */}
        <div style={{
          marginTop: 16,
          background: `${walls[activeWall].color}10`,
          borderRadius: 12,
          padding: 20,
          borderLeft: `4px solid ${walls[activeWall].color}`,
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: walls[activeWall].color, marginBottom: 4 }}>
            {walls[activeWall].name}
          </div>
          <div style={{ fontSize: 24, marginBottom: 8 }}>{walls[activeWall].analogy}</div>
          <p style={{ ...ps, margin: "0 0 12px" }}>{walls[activeWall].explain}</p>
          <div style={{
            display: "inline-block",
            background: `${walls[activeWall].color}20`,
            borderRadius: 6,
            padding: "6px 12px",
            fontSize: 13,
            fontWeight: 600,
            color: walls[activeWall].color,
          }}>
            차단 대상: {walls[activeWall].blocks}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── 5. 폐루프 공정 ───────── */
function ClosedLoopSection() {
  const [loopStep, setLoopStep] = useState(0);
  const steps = [
    {
      icon: "⚒️",
      title: "만들기 (생성)",
      color: C.red,
      desc: "BQB 템플릿이 정해 놓은 자리에 이온을 주입하여 큐비트를 만듭니다.",
      analogy: "과녁판에 다트를 던짐",
    },
    {
      icon: "🔬",
      title: "확인하기 (검증)",
      color: C.yellow,
      desc: "3D 촬영(nano-CT 등)으로 원자가 정확한 위치에 갔는지, 전기 환경은 괜찮은지 확인합니다.",
      analogy: "다트가 어디 꽂혔는지 카메라로 촬영",
    },
    {
      icon: "🔧",
      title: "고치기 (보정)",
      color: C.green,
      desc: "어긋난 부분이 있으면 다음 번에 더 정확하도록 주입 조건을 수정합니다.",
      analogy: "조준점을 조정해서 다시 던짐",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <StepCard num="방법" title="폐루프 = 만들고 → 확인하고 → 고치고 → 반복" color={C.accent}>
        <p style={ps}>
          한 번에 완벽하게 만들 필요 없습니다.
          <br />
          <B c={C.accent}>빠르게 반복해서 점점 정확하게</B> 수렴시키는 게 핵심입니다.
        </p>
      </StepCard>

      {/* Loop visual */}
      <div style={{
        background: C.card, borderRadius: 16, padding: 28,
        border: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={() => setLoopStep(i)}
                style={{
                  width: 64, height: 64,
                  borderRadius: "50%",
                  border: `3px solid ${loopStep === i ? s.color : C.border}`,
                  background: loopStep === i ? `${s.color}20` : "transparent",
                  cursor: "pointer",
                  fontSize: 28,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                }}
              >
                {s.icon}
              </button>
              {i < 2 && (
                <div style={{ fontSize: 20, color: C.textMuted }}>→</div>
              )}
            </div>
          ))}
        </div>

        {/* Repeat arrow */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{
            display: "inline-block",
            background: `${C.accent}15`,
            borderRadius: 20,
            padding: "6px 20px",
            fontSize: 13,
            color: C.accent,
            fontWeight: 600,
          }}>
            🔄 3단계를 반복할수록 정밀도가 올라감
          </div>
        </div>

        {/* Current step detail */}
        <div style={{
          background: `${steps[loopStep].color}10`,
          borderRadius: 12,
          padding: 20,
          borderLeft: `4px solid ${steps[loopStep].color}`,
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: steps[loopStep].color, marginBottom: 8 }}>
            {steps[loopStep].icon} {steps[loopStep].title}
          </div>
          <p style={{ ...ps, margin: "0 0 12px" }}>{steps[loopStep].desc}</p>
          <div style={{
            background: `${steps[loopStep].color}15`,
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            color: C.textDim,
          }}>
            비유: {steps[loopStep].analogy}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── 6. 전체 요약 ───────── */
function SummarySection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <StepCard num="요약" title="BQB 전체 그림 한눈에 보기" color={C.accent}>
        <p style={ps}>
          지금까지 배운 것을 하나로 연결하면 이렇습니다:
        </p>
      </StepCard>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          { num: "1", icon: "❓", title: "문제", desc: "큐비트 수백 개를 같은 품질로 동시에 만들 수 없다", color: C.red },
          { num: "2", icon: "🔍", title: "원인", desc: "위치·전기환경·정렬의 허용 오차를 동시에 정의한 적이 없다", color: C.orange },
          { num: "3", icon: "🎯", title: "해법: BQB", desc: "매립 장벽으로 3D 허용 범위(공정창)를 물리적으로 강제", color: C.green },
          { num: "4", icon: "🛡️", title: "보호: Triple-Wall", desc: "3중 벽(격리/차폐/매립)으로 각 큐비트를 독립적으로 보호", color: C.purple },
          { num: "5", icon: "🔄", title: "수렴: 폐루프", desc: "만들고→확인하고→고치고를 반복하여 점점 정확하게", color: C.accent },
        ].map((item) => (
          <div
            key={item.num}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: C.card,
              borderRadius: 12,
              padding: "18px 20px",
              border: `1px solid ${C.border}`,
              borderLeft: `4px solid ${item.color}`,
            }}
          >
            <div style={{
              width: 48, height: 48,
              borderRadius: "50%",
              background: `${item.color}15`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{item.title}</div>
              <div style={{ fontSize: 14, color: C.textDim, lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <Callout color={C.green} emoji="✅">
        결론: BQB는 "더 좋은 큐비트"를 만드는 기술이 아닙니다.
        <br />
        <B c={C.green}>"수백 개를 동시에 만들 수 있는 규격과 구조"</B>를 정의하는 프레임워크입니다.
      </Callout>
    </div>
  );
}

/* ═══════ Shared Components ═══════ */

function B({ children, c }) {
  return <strong style={{ color: c || C.text }}>{children}</strong>;
}

const ps = { fontSize: 15, color: C.textDim, lineHeight: 1.9, margin: "0" };

function StepCard({ num, title, color, children }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}08, ${C.card})`,
      borderRadius: 16, padding: 28,
      border: `1px solid ${color}30`,
    }}>
      <div style={{ fontSize: 12, fontWeight: 800, color, letterSpacing: 2, marginBottom: 6 }}>
        {num.toUpperCase()}
      </div>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 16 }}>{title}</div>
      {children}
    </div>
  );
}

function Callout({ children, color, emoji }) {
  return (
    <div style={{
      background: `${color}10`,
      borderRadius: 12,
      padding: 20,
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>{emoji}</span>
        <div style={{ fontSize: 15, color: C.textDim, lineHeight: 1.8 }}>{children}</div>
      </div>
    </div>
  );
}

function Chip({ label, emoji, sub, color }) {
  return (
    <div style={{
      background: `${color}15`,
      borderRadius: 12,
      padding: "14px 20px",
      textAlign: "center",
      border: `1px solid ${color}30`,
      minWidth: 120,
    }}>
      <div style={{ fontSize: 28, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color }}>{label}</div>
      <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function QubitDot() {
  return (
    <div style={{
      width: 20, height: 20,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${C.purple}, ${C.purple}60)`,
      boxShadow: `0 0 8px ${C.purple}50`,
    }} />
  );
}

function QubitGrid({ size }) {
  return (
    <div style={{
      display: "inline-grid",
      gridTemplateColumns: `repeat(${size}, 24px)`,
      gap: 6,
      padding: 16,
      background: `${C.purple}08`,
      borderRadius: 12,
      border: `1px dashed ${C.purple}30`,
    }}>
      {Array.from({ length: size * size }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 20, height: 20,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${C.purple}90, ${C.purple}40)`,
            boxShadow: `0 0 4px ${C.purple}30`,
          }}
        />
      ))}
    </div>
  );
}

function DartBoard({ darts, shaking }) {
  return (
    <div style={{
      position: "relative",
      width: 220, height: 220,
      margin: "0 auto",
      borderRadius: "50%",
      background: `radial-gradient(circle, ${C.green}15 20%, ${C.yellow}10 40%, ${C.red}08 60%, ${C.card} 80%)`,
      border: `2px solid ${C.border}`,
      animation: shaking ? "shake 0.3s infinite" : "none",
    }}>
      {/* Target rings */}
      {[80, 55, 30].map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${50 - s / 2}%`, left: `${50 - s / 2}%`,
          width: `${s}%`, height: `${s}%`,
          borderRadius: "50%",
          border: `1px dashed ${[C.red, C.yellow, C.green][i]}40`,
        }} />
      ))}
      {/* Darts */}
      {darts.map((d, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${d.x}%`, top: `${d.y}%`,
          transform: "translate(-50%, -50%)",
          width: 10, height: 10,
          borderRadius: "50%",
          background: d.ok ? C.green : C.red,
          boxShadow: `0 0 6px ${d.ok ? C.green : C.red}80`,
        }} />
      ))}
      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }`}</style>
    </div>
  );
}

function BeforeAfterDiagram({ type }) {
  const w = 280;
  const h = 180;
  if (type === "before") {
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", margin: "0 auto" }}>
        {/* Silicon block */}
        <rect x={20} y={20} width={w - 40} height={h - 40} rx={8} fill={`${C.surface}80`} stroke={C.border} />
        <text x={w / 2} y={h - 14} textAnchor="middle" fill={C.textMuted} fontSize={11}>실리콘</text>
        {/* Scattered atoms */}
        {[
          [60, 50], [120, 90], [80, 120], [180, 60], [200, 110],
          [150, 45], [100, 70], [220, 85], [65, 95], [170, 130],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={5} fill={C.red} opacity={0.7}>
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {/* Arrow */}
        <line x1={w / 2} y1={10} x2={w / 2 - 5} y2={45} stroke={C.textMuted} strokeWidth={1.5} strokeDasharray="4,3" />
        <text x={w / 2 + 10} y={16} fill={C.textMuted} fontSize={10}>이온 주입</text>
        <text x={w / 2} y={h / 2 + 4} textAnchor="middle" fill={C.red} fontSize={12} fontWeight="bold">흩어짐!</text>
      </svg>
    );
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", margin: "0 auto" }}>
      {/* Silicon block */}
      <rect x={20} y={20} width={w - 40} height={h - 40} rx={8} fill={`${C.surface}80`} stroke={C.border} />
      <text x={w / 2} y={h - 14} textAnchor="middle" fill={C.textMuted} fontSize={11}>실리콘</text>
      {/* BQB barriers */}
      {[85, 155, 225].map((cx, i) => (
        <g key={i}>
          <rect x={cx - 22} y={50} width={44} height={70} rx={4}
            fill="none" stroke={C.green} strokeWidth={2.5} strokeDasharray={i === 1 ? "none" : "none"} />
          <circle cx={cx} cy={85} r={6} fill={C.green}>
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
          </circle>
          <text x={cx} y={42} textAnchor="middle" fill={C.green} fontSize={9} fontWeight="bold">BQB</text>
        </g>
      ))}
      {/* Arrow */}
      <line x1={155} y1={10} x2={155} y2={55} stroke={C.textMuted} strokeWidth={1.5} strokeDasharray="4,3" />
      <text x={170} y={16} fill={C.textMuted} fontSize={10}>이온 주입</text>
      <text x={w / 2} y={h / 2 + 4} textAnchor="middle" fill={C.green} fontSize={12} fontWeight="bold">정위치!</text>
    </svg>
  );
}

/* ═══════ TABS & MAIN ═══════ */
const tabs = [
  { id: "intro", label: "큐비트란?", icon: "⚛️" },
  { id: "problem", label: "왜 어려운가", icon: "💥" },
  { id: "bqb", label: "BQB 아이디어", icon: "🧱" },
  { id: "pw", label: "공정창", icon: "📐" },
  { id: "wall", label: "3중 보호벽", icon: "🛡️" },
  { id: "loop", label: "폐루프", icon: "🔄" },
  { id: "summary", label: "전체 요약", icon: "📋" },
];

const sectionMap = {
  intro: IntroSection,
  problem: ProblemSection,
  bqb: BQBIdeaSection,
  pw: ProcessWindowSection,
  wall: TripleWallSection,
  loop: ClosedLoopSection,
  summary: SummarySection,
};


function __BQBBeginnerRender__() {
  const [tab, setTab] = useState("intro");
  const Comp = sectionMap[tab];
  const idx = tabs.findIndex((t) => t.id === tab);

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif",
      color: C.text,
    }}>
      {/* Header */}
      <div style={{
        padding: "28px 20px 16px",
        background: `linear-gradient(180deg, ${C.accentDim}50, ${C.bg})`,
      }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: 3 }}>
            초보자를 위한 BQB 가이드
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: "6px 0 0", lineHeight: 1.3 }}>
            BQB가 뭔데? 🤔
          </h1>
          <p style={{ fontSize: 13, color: C.textMuted, margin: "4px 0 0" }}>
            반도체 큐비트 대규모 배열의 핵심 기술을 비유로 이해하기
          </p>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{
        position: "sticky", top: 52, zIndex: 9,
        background: `${C.bg}ee`,
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${C.border}`,
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}>
        <div style={{
          maxWidth: 640, margin: "0 auto",
          display: "flex", gap: 0,
          padding: "0 12px",
        }}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none", border: "none",
                borderBottom: tab === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
                padding: "12px 12px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 4,
                opacity: tab === t.id ? 1 : 0.5,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 14 }}>{t.icon}</span>
              <span style={{ fontSize: 12, fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? C.accent : C.textMuted }}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "28px 16px 80px" }}>
        <Comp />

        {/* Nav buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
          <button
            onClick={() => idx > 0 && setTab(tabs[idx - 1].id)}
            disabled={idx === 0}
            style={{
              background: idx > 0 ? `${C.accent}15` : "transparent",
              border: `1px solid ${idx > 0 ? C.accent : C.border}`,
              color: idx > 0 ? C.accent : C.textMuted,
              borderRadius: 8, padding: "10px 20px",
              cursor: idx > 0 ? "pointer" : "default",
              fontSize: 13, fontWeight: 600,
              opacity: idx > 0 ? 1 : 0.3,
            }}
          >
            ← 이전
          </button>
          <button
            onClick={() => idx < tabs.length - 1 && setTab(tabs[idx + 1].id)}
            disabled={idx === tabs.length - 1}
            style={{
              background: idx < tabs.length - 1 ? `${C.accent}15` : "transparent",
              border: `1px solid ${idx < tabs.length - 1 ? C.accent : C.border}`,
              color: idx < tabs.length - 1 ? C.accent : C.textMuted,
              borderRadius: 8, padding: "10px 20px",
              cursor: idx < tabs.length - 1 ? "pointer" : "default",
              fontSize: 13, fontWeight: 600,
              opacity: idx < tabs.length - 1 ? 1 : 0.3,
            }}
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
}


  return <__BQBBeginnerRender__ />;
}

/* ═══════ APP: BQB 중급 가이드 ═══════ */
function BQBIntermediateGuide() {


/* ═══════════════════════════════════════════
   BQB 중급 가이드 — 양자 테마 인터랙티브
   ═══════════════════════════════════════════ */

const Q = {
  void: "#030712",
  deep: "#0a0e1a",
  surface: "#111827",
  card: "#1a1f35",
  border: "#1e2847",
  glow: "#6366f1",
  glowDim: "#4f46e5",
  cyan: "#22d3ee",
  cyanDim: "#0891b2",
  magenta: "#e879f9",
  magentaDim: "#a21caf",
  red: "#fb7185",
  orange: "#fb923c",
  yellow: "#fde047",
  green: "#4ade80",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
};

const font = "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace";

/* ─── Quantum Background Particles ─── */
function QuantumBG() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes qFloat { 0%,100%{transform:translateY(0) scale(1);opacity:0.3} 50%{transform:translateY(-30px) scale(1.5);opacity:0.7} }
        @keyframes qPulse { 0%,100%{box-shadow:0 0 4px ${Q.glow}40;} 50%{box-shadow:0 0 20px ${Q.glow}80;} }
        @keyframes qOrbit { 0%{transform:rotate(0deg) translateX(40px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(40px) rotate(-360deg)} }
        @keyframes qWave { 0%{d:path('M0,50 Q25,30 50,50 T100,50')} 50%{d:path('M0,50 Q25,70 50,50 T100,50')} 100%{d:path('M0,50 Q25,30 50,50 T100,50')} }
        @keyframes gridPulse { 0%,100%{opacity:0.03} 50%{opacity:0.08} }
        @keyframes scanLine { 0%{top:-2px} 100%{top:100%} }
      `}</style>
      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${Q.glow}08 1px, transparent 1px), linear-gradient(90deg, ${Q.glow}08 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        animation: "gridPulse 8s ease-in-out infinite",
      }} />
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 37 + 13) % 100}%`,
          top: `${(i * 53 + 7) % 100}%`,
          width: i % 3 === 0 ? 3 : 2,
          height: i % 3 === 0 ? 3 : 2,
          borderRadius: "50%",
          background: [Q.glow, Q.cyan, Q.magenta][i % 3],
          animation: `qFloat ${3 + (i % 5) * 1.5}s ease-in-out ${i * 0.3}s infinite`,
        }} />
      ))}
      {/* Scan line */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${Q.glow}20, transparent)`,
        animation: "scanLine 12s linear infinite",
      }} />
    </div>
  );
}

/* ─── Quantum Atom Visual ─── */
function QuantumAtom({ size = 80, color = Q.glow }) {
  return (
    <div style={{ position: "relative", width: size, height: size, margin: "0 auto" }}>
      <style>{`
        @keyframes orbit1 { 0%{transform:rotate(0deg) translateX(${size*0.4}px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(${size*0.4}px) rotate(-360deg)} }
        @keyframes orbit2 { 0%{transform:rotate(120deg) translateX(${size*0.35}px) rotate(-120deg)} 100%{transform:rotate(480deg) translateX(${size*0.35}px) rotate(-480deg)} }
        @keyframes orbit3 { 0%{transform:rotate(240deg) translateX(${size*0.3}px) rotate(-240deg)} 100%{transform:rotate(600deg) translateX(${size*0.3}px) rotate(-600deg)} }
        @keyframes corePulse { 0%,100%{transform:scale(1);box-shadow:0 0 ${size*0.15}px ${color}60} 50%{transform:scale(1.15);box-shadow:0 0 ${size*0.3}px ${color}90} }
      `}</style>
      {/* Orbital rings */}
      {[0, 60, -60].map((rot, i) => (
        <div key={i} style={{
          position: "absolute", inset: `${size*0.1}px`,
          borderRadius: "50%",
          border: `1px solid ${color}25`,
          transform: `rotateX(${rot}deg) rotateY(${i*20}deg)`,
        }} />
      ))}
      {/* Electrons */}
      {[
        { anim: "orbit1", dur: "3s", c: Q.cyan },
        { anim: "orbit2", dur: "4s", c: Q.magenta },
        { anim: "orbit3", dur: "5s", c: Q.green },
      ].map((e, i) => (
        <div key={i} style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 6, height: 6,
          marginLeft: -3, marginTop: -3,
          borderRadius: "50%",
          background: e.c,
          boxShadow: `0 0 8px ${e.c}`,
          animation: `${e.anim} ${e.dur} linear infinite`,
        }} />
      ))}
      {/* Core */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: size * 0.22, height: size * 0.22,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color}, ${color}40)`,
        animation: "corePulse 2s ease-in-out infinite",
      }} />
    </div>
  );
}

/* ─── Energy Level Diagram ─── */
function EnergyLevel({ levels, activeIdx, onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "16px 0" }}>
      {levels.map((lv, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 16px",
            background: activeIdx === i ? `${lv.color}12` : "transparent",
            borderLeft: `3px solid ${activeIdx === i ? lv.color : "transparent"}`,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          <div style={{
            width: "60%", height: 3,
            background: `linear-gradient(90deg, ${lv.color}${activeIdx === i ? "" : "40"}, transparent)`,
            borderRadius: 2,
            boxShadow: activeIdx === i ? `0 0 10px ${lv.color}50` : "none",
            transition: "all 0.3s",
          }} />
          <span style={{
            fontSize: 12, fontFamily: font,
            color: activeIdx === i ? lv.color : Q.textMuted,
            fontWeight: activeIdx === i ? 700 : 400,
          }}>
            {lv.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Depth Profile Visualization (Gaussian / Channeling) ─── */
function DepthProfile({ type = "gaussian", color = Q.cyan, label, sigma = 0.08, peak = 0.4, tailStrength = 0 }) {
  // type: "gaussian" | "channeling" | "combined"
  // Renders physically correct ion implantation depth profiles:
  //   gaussian → bell curve (straggle distribution)
  //   channeling → gaussian + exponential tail (deep penetration)
  //   combined → gaussian + channeling tail + surface loss

  const W = 200, H = 70;
  const baseline = H - 8;

  const gaussian = (x, mu, sig) => Math.exp(-0.5 * ((x - mu) / sig) ** 2);

  const buildPts = () => {
    const pts = [];
    for (let px = 0; px <= W; px += 1) {
      const x = px / W; // 0~1 normalized depth
      let y = 0;

      if (type === "gaussian") {
        y = gaussian(x, peak, sigma);
      } else if (type === "channeling") {
        // Gaussian peak + exponential tail beyond peak
        const g = gaussian(x, peak, sigma);
        const tail = x > peak ? tailStrength * Math.exp(-(x - peak) * 4) : 0;
        y = Math.max(g, tail);
      } else if (type === "combined") {
        // Main gaussian
        const g = gaussian(x, peak, sigma);
        // Channeling tail (deep penetration beyond Rp)
        const tail = x > peak ? 0.5 * Math.exp(-(x - peak) * 3.5) : 0;
        // Surface depletion: backscattered ions exit the sample,
        // so near-surface concentration is REDUCED (not increased).
        // Model as suppression factor approaching x=0
        const surfDepletion = x < peak ? Math.min(1, (x / (peak * 0.4)) ** 1.5) : 1;
        y = (g + tail) * surfDepletion;
      }

      const plotY = baseline - y * (baseline - 10);
      pts.push(`${px},${Math.max(10, plotY)}`);
    }
    return pts;
  };

  const pts = buildPts();
  // Fill area
  const fillPts = [`0,${baseline}`, ...pts, `${W},${baseline}`].join(" ");

  // Unique id for gradient
  const gid = `dp-${label}-${type}`.replace(/[^a-zA-Z0-9]/g, "");

  return (
    <div style={{ position: "relative", marginBottom: 4 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id={`${gid}-fill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Axis */}
        <line x1="0" y1={baseline} x2={W} y2={baseline} stroke={Q.border} strokeWidth="0.5" />
        {/* Rp marker (peak depth) */}
        <line x1={peak * W} y1={8} x2={peak * W} y2={baseline} stroke={`${color}30`} strokeWidth="0.5" strokeDasharray="3,3" />
        <text x={peak * W} y={6} textAnchor="middle" fill={`${color}80`} fontSize={7} fontFamily={font}>Rp</text>
        {/* Fill */}
        <polygon points={fillPts} fill={`url(#${gid}-fill)`} />
        {/* Line */}
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" opacity="0.9" />
        {/* Axis labels */}
        <text x={W - 4} y={baseline + 7} textAnchor="end" fill={Q.textMuted} fontSize={6} fontFamily={font}>깊이 →</text>
        <text x={4} y={14} fill={Q.textMuted} fontSize={6} fontFamily={font}>농도 ↑</text>
        {/* Channeling tail annotation */}
        {(type === "channeling" || type === "combined") && (
          <text x={W * 0.75} y={baseline - 12} textAnchor="middle" fill={Q.magenta} fontSize={7} fontFamily={font} fontWeight="bold">
            channeling tail →
          </text>
        )}
        {type === "combined" && (
          <text x={W * 0.06} y={baseline - 8} textAnchor="middle" fill={Q.red} fontSize={7} fontFamily={font}>
            ← 후방산란 손실
          </text>
        )}
      </svg>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
          <span style={{ fontSize: 10, color, fontFamily: font, fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 9, color: Q.textMuted, fontFamily: font }}>
            {type === "gaussian" ? "가우시안 분포" : type === "channeling" ? "가우시안 + 지수 tail" : "복합 분포"}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Lateral (횡방향) Profile: Gaussian centered at beam axis ─── */
function LateralProfile({ color = Q.cyan, label, sigma = 0.1 }) {
  const W = 200, H = 60;
  const baseline = H - 8;
  const center = W / 2;

  const pts = [];
  const fillPts = [];
  for (let px = 0; px <= W; px += 1) {
    const x = (px - center) / W; // normalized lateral position (-0.5 ~ +0.5)
    const y = Math.exp(-0.5 * (x / sigma) ** 2);
    const plotY = baseline - y * (baseline - 10);
    pts.push(`${px},${Math.max(10, plotY)}`);
  }
  const fillStr = [`0,${baseline}`, ...pts, `${W},${baseline}`].join(" ");

  return (
    <div style={{ position: "relative", marginBottom: 4 }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id={`lp-${sigma}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Axis */}
        <line x1="0" y1={baseline} x2={W} y2={baseline} stroke={Q.border} strokeWidth="0.5" />
        {/* Center line (beam axis) */}
        <line x1={center} y1={8} x2={center} y2={baseline} stroke={`${color}30`} strokeWidth="0.5" strokeDasharray="3,3" />
        <text x={center} y={6} textAnchor="middle" fill={`${color}80`} fontSize={7} fontFamily={font}>빔 축</text>
        {/* σ markers */}
        {[-1, 1].map(sign => {
          const sx = center + sign * sigma * W;
          return sx > 0 && sx < W ? (
            <g key={sign}>
              <line x1={sx} y1={baseline - 5} x2={sx} y2={baseline + 2} stroke={`${color}50`} strokeWidth="0.5" />
              <text x={sx} y={baseline + 8} textAnchor="middle" fill={`${color}60`} fontSize={6} fontFamily={font}>
                {sign > 0 ? "+σ" : "-σ"}
              </text>
            </g>
          ) : null;
        })}
        {/* Fill */}
        <polygon points={fillStr} fill={`url(#lp-${sigma})`} />
        {/* Line */}
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="1.5" opacity="0.9" />
        {/* Axis labels */}
        <text x={W - 4} y={baseline + 7} textAnchor="end" fill={Q.textMuted} fontSize={6} fontFamily={font}>← 횡방향 위치 →</text>
        <text x={4} y={14} fill={Q.textMuted} fontSize={6} fontFamily={font}>농도 ↑</text>
      </svg>
      {label && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
          <span style={{ fontSize: 10, color, fontFamily: font, fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 9, color: Q.textMuted, fontFamily: font }}>빔 축 중심 가우시안</span>
        </div>
      )}
    </div>
  );
}
function ProcessWindowBox({ activeWindow }) {
  const colors = [Q.red, Q.yellow, Q.green];
  const c = colors[activeWindow] || Q.glow;
  return (
    <div style={{ perspective: 600, margin: "20px auto", width: 200, height: 200 }}>
      <div style={{
        width: 160, height: 160, margin: "20px auto",
        position: "relative",
        transformStyle: "preserve-3d",
        transform: "rotateX(-15deg) rotateY(25deg)",
        animation: "slowSpin 20s linear infinite",
      }}>
        <style>{`@keyframes slowSpin { 0%{transform:rotateX(-15deg) rotateY(25deg)} 100%{transform:rotateX(-15deg) rotateY(385deg)} }`}</style>
        {/* 6 faces of the box */}
        {[
          { t: "rotateY(0deg) translateZ(80px)", label: "σ_xy" },
          { t: "rotateY(180deg) translateZ(80px)", label: "" },
          { t: "rotateY(90deg) translateZ(80px)", label: "σ_z" },
          { t: "rotateY(-90deg) translateZ(80px)", label: "" },
          { t: "rotateX(90deg) translateZ(80px)", label: "" },
          { t: "rotateX(-90deg) translateZ(80px)", label: "D_it" },
        ].map((face, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 160, height: 160,
            background: `${c}08`,
            border: `1px solid ${c}30`,
            transform: face.t,
            backfaceVisibility: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {face.label && (
              <span style={{ color: `${c}80`, fontSize: 14, fontFamily: font, fontWeight: 700 }}>
                {face.label}
              </span>
            )}
          </div>
        ))}
        {/* Center qubit */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 12, height: 12,
          borderRadius: "50%",
          background: Q.glow,
          boxShadow: `0 0 20px ${Q.glow}80`,
        }} />
      </div>
    </div>
  );
}

/* ─── Straggle Simulation ─── */
function StraggleSim({ withBQB }) {
  const [dots, setDots] = useState([]);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const run = () => {
    setDots([]);
    setRunning(true);
    let count = 0;
    timerRef.current = setInterval(() => {
      count++;
      const cx = 100, cy = 100;
      const angle = Math.random() * Math.PI * 2;
      const spreadX = withBQB ? 12 : 35;
      const spreadY = withBQB ? 8 : 40;
      let dx = (Math.random() - 0.5) * spreadX * 2;
      let dy = (Math.random() - 0.5) * spreadY * 2;
      // channeling tail for non-BQB
      if (!withBQB && Math.random() < 0.15) dy = -(Math.random() * 60 + 20);
      const x = cx + dx;
      const y = cy + dy;
      const inWindow = withBQB
        ? Math.abs(dx) <= 15 && Math.abs(dy) <= 10
        : Math.abs(dx) <= 10 && Math.abs(dy) <= 8;
      setDots(prev => [...prev, { x, y, ok: inWindow }]);
      if (count >= 60) {
        clearInterval(timerRef.current);
        setRunning(false);
      }
    }, 50);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const okCount = dots.filter(d => d.ok).length;
  const yieldPct = dots.length > 0 ? Math.round(okCount / dots.length * 100) : 0;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ background: `${Q.void}`, borderRadius: 12, border: `1px solid ${Q.border}` }}>
        {/* BQB walls */}
        {withBQB && (
          <rect x={85} y={90} width={30} height={20} rx={2}
            fill="none" stroke={Q.green} strokeWidth={2} strokeDasharray="4,2" opacity={0.6}>
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </rect>
        )}
        {/* Target zone */}
        <rect x={90} y={92} width={20} height={16} rx={1}
          fill={`${Q.glow}10`} stroke={`${Q.glow}20`} strokeWidth={0.5} />
        {/* Dots */}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={2}
            fill={d.ok ? Q.green : Q.red} opacity={0.8}>
            <animate attributeName="r" from="4" to="2" dur="0.3s" fill="freeze" />
          </circle>
        ))}
        {/* Label */}
        <text x={100} y={16} textAnchor="middle" fill={Q.textMuted} fontSize={9} fontFamily={font}>
          {withBQB ? "BQB 구속 주입" : "자유 주입 (conventional)"}
        </text>
        {dots.length > 0 && (
          <text x={100} y={190} textAnchor="middle" fill={yieldPct > 70 ? Q.green : Q.red} fontSize={11} fontFamily={font} fontWeight="bold">
            수율: {yieldPct}% ({okCount}/{dots.length})
          </text>
        )}
      </svg>
      <button
        onClick={run}
        disabled={running}
        style={{
          marginTop: 12,
          background: running ? Q.surface : `${Q.glow}20`,
          border: `1px solid ${running ? Q.border : Q.glow}`,
          color: running ? Q.textMuted : Q.glow,
          borderRadius: 6, padding: "8px 20px",
          cursor: running ? "default" : "pointer",
          fontSize: 12, fontFamily: font, fontWeight: 600,
        }}
      >
        {running ? "시뮬레이션 중..." : "▶ 이온 주입 시뮬레이션"}
      </button>
    </div>
  );
}

/* ════════════════════════════════════════════
   SECTIONS
   ════════════════════════════════════════════ */

/* ─── SEC 1: 이온 주입과 산란 물리 ─── */
function IonPhysicsSection() {
  const [mode, setMode] = useState("straggle");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GlowCard title="이온 주입의 물리적 한계" icon="⚛️" color={Q.cyan}>
        <p style={ps}>
          반도체 큐비트 배열의 출발점은 <M>이온 주입(ion implantation)</M>입니다.
          가속된 ³¹P⁺ 이온이 Si 격자에 진입하면 <M>핵 충돌(nuclear stopping)</M>과{" "}
          <M>전자 제동(electronic stopping)</M>을 겪으며 감속됩니다.
        </p>
        <p style={ps}>
          문제는 이 과정이 <Em c={Q.red}>확률적</Em>이라는 점입니다. 동일 에너지로 주입해도
          최종 정지 위치는 <M>통계적 분포(straggle)</M>를 따르며,
          특히 결정 축과 정렬되면 <M>채널링(channeling)</M>으로 예측 불가한 깊이까지 관통합니다.
        </p>
      </GlowCard>

      <div style={{ display: "flex", gap: 8 }}>
        {[
          { id: "straggle", label: "종/횡 산란", color: Q.cyan },
          { id: "channeling", label: "채널링 tail", color: Q.magenta },
          { id: "combined", label: "복합 분포", color: Q.red },
        ].map(t => (
          <TabBtn key={t.id} active={mode === t.id} color={t.color}
            onClick={() => setMode(t.id)}>{t.label}</TabBtn>
        ))}
      </div>

      <div style={{ background: Q.card, borderRadius: 12, padding: 20, border: `1px solid ${Q.border}` }}>
        {mode === "straggle" && (
          <>
            {/* 종방향: 깊이 방향 가우시안 분포 */}
            <DepthProfile type="gaussian" color={Q.glow} label="종방향 깊이 분포 (σ_z)" sigma={0.06} peak={0.35} />
            {/* 횡방향: 빔 중심 기준 좌우 가우시안 분포 */}
            <LateralProfile color={Q.cyan} label="횡방향 위치 분포 (σ_xy)" sigma={0.12} />
            <p style={{ ...ps, marginTop: 12 }}>
              <M>종방향 산란(longitudinal straggle, σ_z)</M>: 깊이 방향 정지 위치의 분산.
              이온이 평균 정지 깊이(Rp) 주변에 <Em c={Q.glow}>가우시안 분포</Em>로 분포합니다.
              주입 에너지에 비례하여 분산이 증가합니다.
            </p>
            <p style={ps}>
              <M>횡방향 산란(lateral straggle, σ_xy)</M>: 빔 입사점 기준 좌우 확산.
              핵 충돌에 의한 무작위 방향 전환이 원인이며,
              keV급 에너지에서 수~수십 nm 범위의 <Em c={Q.cyan}>가우시안 분포</Em>를 따릅니다.
            </p>
            <ParamBox params={[
              { name: "목표", value: "σ_xy: ≤20 nm(1차) → ≤10 nm(5차), σ_z: ≤10 nm(1차) → ≤5 nm(5차)", color: Q.green },
              { name: "현실", value: "비구속 주입 시 σ_xy ~ 20-50 nm", color: Q.red },
            ]} />
          </>
        )}
        {mode === "channeling" && (
          <>
            {/* 가우시안 + 지수감쇠 tail */}
            <DepthProfile type="channeling" color={Q.magenta} label="채널링 깊이 분포" sigma={0.06} peak={0.25} tailStrength={0.6} />
            <p style={{ ...ps, marginTop: 12 }}>
              Si 결정의 <M>&lt;100&gt; 축</M>으로 이온이 진입하면 격자 원자 사이 채널을 따라
              수백 nm까지 관통할 수 있습니다. 깊이 분포에서 가우시안 피크 이후
              <Em c={Q.magenta}> 지수적으로 감쇠하는 긴 tail</Em>이 나타나며,
              이 비가우시안 tail이 공정창 이탈의 주요 원인입니다.
            </p>
            <p style={ps}>
              BQB-B 장벽은 이 채널링 tail을 <Em c={Q.green}>물리적으로 절단</Em>합니다.
              장벽 깊이(80~300 nm)가 이온 침투의 물리적 상한을 강제하여,
              tail 영역의 이온이 전기적으로 비활성화됩니다.
            </p>
          </>
        )}
        {mode === "combined" && (
          <>
            {/* 단일 그래프에 세 성분을 합성 */}
            <DepthProfile type="combined" color={Q.red} label="실제 깊이 분포 (3성분 합성)" sigma={0.06} peak={0.3} />
            <p style={{ ...ps, marginTop: 12 }}>
              실제 분포는 세 가지 효과가 중첩됩니다:
              (1) <Em c={Q.glow}>가우시안 산란</Em> — Rp 주변의 주 분포,
              (2) <Em c={Q.magenta}>채널링 tail</Em> — 깊은 방향으로의 지수적 침투,
              (3) <Em c={Q.red}>후방산란 손실</Em> — 표면 부근 이온이 시료 밖으로 빠져나가
              표면 근처 농도가 <Em c={Q.red}>감소</Em>합니다.
            </p>
            <p style={ps}>
              단일 큐비트에서는 후선별로 대응 가능하나,
              <Em c={Q.red}> 배열에서는 모든 사이트가 동시에 허용 범위 안에 들어와야</Em> 하므로
              확률적 접근이 근본적으로 불가합니다.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── SEC 2: 공정창 정량 규격 ─── */
function ProcessWindowSection() {
  const [activeW, setActiveW] = useState(0);
  const windows = [
    {
      label: "기하학적 창",
      eng: "Geometric Window",
      color: Q.red,
      icon: "📍",
      params: [
        { name: "정의", value: "유효 3D 영역 제한 — straggle/channeling tail을 물리적으로 배제" },
        { name: "BQB 개구", value: "CD 40~120 nm (유효 주입 영역)" },
        { name: "장벽 깊이", value: "80~300 nm (채널링 상한 절단)" },
        { name: "σ_xy 목표", value: "≤ 20 nm (1차년도) → ≤ 10 nm (5차년도)" },
        { name: "σ_z 목표", value: "≤ 10 nm (1차년도) → ≤ 5 nm (5차년도)" },
      ],
      detail: "BQB 템플릿의 개구(aperture)가 횡방향 산란을 구속하고, 매립 장벽(BQB-B)이 종방향으로 채널링 tail을 절단합니다. 이 두 가지가 결합되어 유효 3D 영역(effective capture volume)을 정의하며, 이 영역 밖의 이온은 전기적으로 비활성화됩니다.",
    },
    {
      label: "전기적 창",
      eng: "Electrostatic Window",
      color: Q.yellow,
      icon: "⚡",
      params: [
        { name: "정의", value: "큐비트 주변 전하 환경의 허용 변동 범위 정량화" },
        { name: "D_it", value: "≤ 10¹⁰ cm⁻²eV⁻¹ (계면 트랩 밀도)" },
        { name: "Q_f", value: "≤ 5 × 10¹⁰ cm⁻² (고정 전하)" },
        { name: "|∇E|", value: "~ 1-10 kV/cm (국부 전계 기울기)" },
        { name: "S_Q(1Hz)", value: "≈ 10⁻³ e/√Hz (1/f 전하 잡음)" },
      ],
      detail: "계면 트랩(D_it)은 게이트-실리콘 계면에 존재하는 결함으로, 큐비트 주파수를 무작위로 흔듭니다. 고정 전하(Q_f)는 산화막에 갇힌 전하로 전계 환경을 왜곡합니다. BQB의 패시베이션 공정과 Triple-Wall의 T3 guard ring이 이 두 가지를 동시에 억제합니다.",
    },
    {
      label: "정렬 창",
      eng: "Alignment Window",
      color: Q.green,
      icon: "🎯",
      params: [
        { name: "정의", value: "Q 좌표계 ↔ 배선/패키징 좌표계 간 오차 예산 사전 규격화" },
        { name: "Q-게이트", value: "overlay ≤ 15 nm (큐비트-게이트 정렬)" },
        { name: "Q-패키징", value: "overlay ≤ 30 nm (칩-패키지 정렬)" },
        { name: "검증", value: "ΔR/R 저항 변화, 누설전류, 열 사이클 테스트" },
      ],
      detail: "큐비트의 물리적 위치와 그 위에 형성되는 게이트 전극, BEOL 배선, 그리고 DD-IC 패키징의 좌표계가 각각 독립적으로 존재합니다. 배열이 커질수록 이 좌표계 간 누적 오차가 급증하므로, BQB는 공정 초기에 정렬 오차 예산(tolerance budget)을 규격화합니다.",
    },
  ];
  const w = windows[activeW];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GlowCard title='공정창(Process Window): 동시 허용 오차 규격' icon="📐" color={Q.glow}>
        <p style={ps}>
          공정창이란 <Em c={Q.glow}>큐비트가 정상 동작하기 위한 다차원 허용 오차 공간</Em>의
          정량적 정의입니다. BQB는 세 가지 독립 축의 공정창을 <Em c={Q.cyan}>동시에</Em> 정의하고,
          이를 물리적 구조로 강제합니다.
        </p>
      </GlowCard>

      {/* 3D Box + Energy Level selector */}
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 200px", minWidth: 200 }}>
          <ProcessWindowBox activeWindow={activeW} />
        </div>
        <div style={{ flex: "1 1 200px" }}>
          <EnergyLevel
            levels={windows.map(ww => ({ label: ww.label, color: ww.color }))}
            activeIdx={activeW}
            onSelect={setActiveW}
          />
        </div>
      </div>

      {/* Detail card */}
      <div style={{
        background: `${w.color}08`,
        borderRadius: 12, padding: 24,
        border: `1px solid ${w.color}25`,
        transition: "all 0.4s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>{w.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: w.color }}>{w.label}</div>
            <div style={{ fontSize: 11, color: Q.textMuted, fontFamily: font }}>{w.eng}</div>
          </div>
        </div>
        <p style={{ ...ps, marginBottom: 16 }}>{w.detail}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {w.params.map((p, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "baseline",
              padding: "6px 12px",
              background: `${Q.void}80`,
              borderRadius: 6,
              borderLeft: `2px solid ${w.color}40`,
            }}>
              <span style={{ fontSize: 11, color: w.color, fontFamily: font, fontWeight: 700, minWidth: 80 }}>
                {p.name}
              </span>
              <span style={{ fontSize: 12, color: Q.textDim, fontFamily: font }}>
                {p.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SEC 3: Triple-Wall 구조 물리 ─── */
function TripleWallSection() {
  const [depth, setDepth] = useState(0);
  const walls = [
    {
      name: "Wall-1: STI 격리 moat",
      color: Q.red,
      physics: "Shallow Trench Isolation",
      mech: "타일 경계에 SiO₂ 충전 트렌치를 형성하여 인접 큐비트 간 기판 커플링과 표면 누설 전류 경로를 물리적으로 절단합니다.",
      effect: "기판 커플링 크로스토크 차단, 표면 누설 전류 억제, overlay 기준 경계 확보",
      kpi: "moat 폭/간격, 타일 pitch, 금속/비아 keep-out 설계 변수로 제어",
    },
    {
      name: "Wall-2: T3 Triple Well + Guard Ring",
      color: Q.yellow,
      physics: "True Triple Well isolation",
      mech: "deep n-well / p-well / n-well 의 3중 우물 구조로 back-gate와 웰 도메인을 전기적으로 분리합니다. 외곽 quiet guard ring이 잔여 전계 침투를 추가 감쇠합니다.",
      effect: "|∇E| 민감도 저감, 1/f 전하잡음 내성 향상, 77K DD-IC 스위칭 노이즈 차폐",
      kpi: "전계 구배 |∇E| < 10 kV/cm, S_Q(1Hz) < 10⁻³ e/√Hz",
    },
    {
      name: "Wall-3: BQB-B 매립 장벽",
      color: Q.green,
      physics: "Buried barrier/template layer",
      mech: "Si 기판 내부에 형성된 고농도 도핑/산화 장벽(깊이 80~300nm, 개구 CD 40~120nm)이 이온 주입 시 종방향 침투를 물리적으로 절단하고, 횡방향 확산을 개구로 제한합니다.",
      effect: "채널링 tail 절단, 확산 차단, 기하학적 공정창 강제",
      kpi: "장벽 깊이 80~300 nm, 개구 CD 40~120 nm (설계 변수로 조정). σ_xy/σ_z 공정창 강제",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GlowCard title="Triple-Wall QBQ: 다층 방어 물리" icon="🛡️" color={Q.magenta}>
        <p style={ps}>
          Triple-Wall은 <Em c={Q.magenta}>상이한 물리적 메커니즘</Em>으로 동작하는 세 겹의 격리층입니다.
          각 벽은 독립적 위협 벡터를 차단하며, 직렬 구조로 잔여 간섭을 단계적으로 감쇠시킵니다.
        </p>
      </GlowCard>

      {/* Cross-section visual */}
      <div style={{
        background: Q.card, borderRadius: 12, padding: 24,
        border: `1px solid ${Q.border}`,
      }}>
        <div style={{ position: "relative", width: "100%", maxWidth: 400, margin: "0 auto", aspectRatio: "1.2/1" }}>
          {/* Walls as nested rects with glow */}
          {walls.map((w, i) => {
            const inset = i * 18 + 2;
            return (
              <div
                key={i}
                onClick={() => setDepth(i)}
                style={{
                  position: "absolute",
                  top: `${inset}%`, left: `${inset}%`,
                  right: `${inset}%`, bottom: `${inset}%`,
                  borderRadius: 12 - i * 2,
                  border: `2px solid ${depth === i ? w.color : `${w.color}30`}`,
                  background: depth === i ? `${w.color}10` : "transparent",
                  cursor: "pointer",
                  transition: "all 0.4s",
                  boxShadow: depth === i ? `0 0 30px ${w.color}20, inset 0 0 30px ${w.color}08` : "none",
                }}
              >
                <div style={{
                  position: "absolute", top: 6, left: 10,
                  fontSize: 10, fontWeight: 800, color: w.color,
                  fontFamily: font, letterSpacing: 1,
                  opacity: depth === i ? 1 : 0.5,
                }}>
                  W{i + 1}
                </div>
              </div>
            );
          })}

          {/* Core qubit */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
          }}>
            <QuantumAtom size={60} color={Q.glow} />
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "12px 0 0", fontSize: 11, color: Q.textMuted }}>
          각 벽을 클릭하여 물리적 메커니즘 확인
        </div>
      </div>

      {/* Wall detail */}
      <div style={{
        background: `${walls[depth].color}06`,
        borderRadius: 12, padding: 24,
        border: `1px solid ${walls[depth].color}20`,
        transition: "all 0.4s",
      }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: walls[depth].color, marginBottom: 4, fontFamily: font }}>
          {walls[depth].name}
        </div>
        <div style={{ fontSize: 11, color: Q.textMuted, fontFamily: font, marginBottom: 16 }}>
          {walls[depth].physics}
        </div>

        {[
          { label: "메커니즘", value: walls[depth].mech },
          { label: "효과", value: walls[depth].effect },
          { label: "정량 지표", value: walls[depth].kpi },
        ].map((item, i) => (
          <div key={i} style={{
            padding: "10px 14px", marginBottom: 8,
            background: `${Q.void}60`,
            borderRadius: 8,
            borderLeft: `3px solid ${walls[depth].color}40`,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: walls[depth].color, fontFamily: font, marginBottom: 4, letterSpacing: 1 }}>
              {item.label.toUpperCase()}
            </div>
            <div style={{ fontSize: 13, color: Q.textDim, lineHeight: 1.7 }}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SEC 4: 이온 주입 시뮬레이션 ─── */
function SimulationSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GlowCard title="이온 주입 시뮬레이션: 비구속 vs BQB 구속" icon="🔬" color={Q.cyan}>
        <p style={ps}>
          동일한 60개 이온을 주입했을 때, BQB 장벽 유무에 따른 수율 차이를 시각적으로 비교합니다.
          <Em c={Q.cyan}> 녹색 점</Em>은 공정창 내 정착, <Em c={Q.red}> 적색 점</Em>은 공정창 이탈입니다.
        </p>
      </GlowCard>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <div style={{
          background: Q.card, borderRadius: 12, padding: 20,
          border: `1px solid ${Q.red}20`,
          flex: "1 1 220px", maxWidth: 260,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: Q.red, fontFamily: font, marginBottom: 12, textAlign: "center" }}>
            ❌ 비구속 주입 (Conventional)
          </div>
          <StraggleSim withBQB={false} />
        </div>
        <div style={{
          background: Q.card, borderRadius: 12, padding: 20,
          border: `1px solid ${Q.green}20`,
          flex: "1 1 220px", maxWidth: 260,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: Q.green, fontFamily: font, marginBottom: 12, textAlign: "center" }}>
            ✅ BQB 구속 주입
          </div>
          <StraggleSim withBQB />
        </div>
      </div>

      <Callout color={Q.glow} icon="📊">
        배열 수율은 개별 사이트 수율의 <M>거듭제곱</M>입니다.
        사이트 수율 95%로 256개 배열을 만들면 전체 수율은 0.95²⁵⁶ ≈ <Em c={Q.red}>0.0002%</Em>.
        사이트 수율을 99.5%로 올리면 0.995²⁵⁶ ≈ <Em c={Q.green}>28%</Em>.
        이것이 공정창 관리가 필수인 정량적 근거입니다.
      </Callout>
    </div>
  );
}

/* ─── SEC 5: 폐루프 공정 체계 ─── */
function ClosedLoopSection() {
  const [phase, setPhase] = useState(0);
  const phases = [
    {
      icon: "⚒️", title: "생성 (Generate)", color: Q.red,
      tools: "BQB 템플릿 + 단일 이온 주입 + 저열예산 활성화(low thermal budget activation)",
      detail: "BQB 개구가 정의한 좌표에 단일 ³¹P⁺ 이온을 주입합니다. 활성화 어닐은 도너 확산을 최소화하기 위해 RTA(rapid thermal anneal) 또는 레이저 어닐로 열예산을 엄격히 제한합니다.",
      output: "Q 생성 웨이퍼 (도너 위치 미확인 상태)",
    },
    {
      icon: "🔬", title: "검증 (Verify)", color: Q.yellow,
      tools: "nano-CT/XRD-CT + APT + SIMS + TEM + 저온 전기·광학 맵",
      detail: "3D 단층촬영(nano-CT)으로 도너 위치를 비파괴 매핑하고, APT/SIMS/TEM 교차검증으로 조성과 tail 깊이를 확인합니다. 웨이퍼 검사 장비로 전기적/광학적 맵을 저온에서 취득합니다.",
      output: "3D 좌표 맵 + 전기환경 맵 + 공정창 준수 여부 판정",
    },
    {
      icon: "🔧", title: "보정 (Correct)", color: Q.green,
      tools: "파라미터 갱신 + DD-IC 캘리브레이션 업데이트",
      detail: "주입 에너지·각도·선량, 개구 형상, 패시베이션 조건, 어닐 파형을 갱신합니다. 동시에 77K DD-IC의 게이트 전압 보정 테이블도 실측 기반으로 업데이트합니다.",
      output: "① 공정창 허용치 ② outlier 모델 ③ die-map 재매핑 ④ 보정 테이블",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GlowCard title="Generate → Verify → Correct 폐루프" icon="🔄" color={Q.green}>
        <p style={ps}>
          BQB 공정은 <Em c={Q.green}>단방향 제작이 아닌 반복 수렴 체계</Em>입니다.
          매 회전(iteration)마다 공정창 내 수율이 측정되고,
          이탈 원인이 분류되어 다음 회전의 공정 조건에 반영됩니다.
        </p>
      </GlowCard>

      {/* Loop visual */}
      <div style={{
        background: Q.card, borderRadius: 12, padding: 24,
        border: `1px solid ${Q.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
          {phases.map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <button
                onClick={() => setPhase(i)}
                style={{
                  width: 56, height: 56,
                  borderRadius: "50%",
                  border: `2px solid ${phase === i ? p.color : Q.border}`,
                  background: phase === i ? `${p.color}15` : "transparent",
                  boxShadow: phase === i ? `0 0 20px ${p.color}30` : "none",
                  cursor: "pointer",
                  fontSize: 24,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s",
                }}
              >
                {p.icon}
              </button>
              {i < 2 && <span style={{ color: Q.textMuted, fontSize: 16 }}>→</span>}
            </div>
          ))}
          <span style={{ color: Q.green, fontSize: 14, fontFamily: font, marginLeft: 8 }}>↻ 반복</span>
        </div>

        <div style={{
          background: `${phases[phase].color}08`,
          borderRadius: 10, padding: 20,
          border: `1px solid ${phases[phase].color}20`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: phases[phase].color, marginBottom: 12, fontFamily: font }}>
            {phases[phase].icon} {phases[phase].title}
          </div>
          {[
            { label: "도구/방법", value: phases[phase].tools },
            { label: "상세", value: phases[phase].detail },
            { label: "산출물", value: phases[phase].output },
          ].map((item, i) => (
            <div key={i} style={{
              padding: "8px 12px", marginBottom: 6,
              background: `${Q.void}50`, borderRadius: 6,
              borderLeft: `2px solid ${phases[phase].color}30`,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: phases[phase].color, fontFamily: font, marginBottom: 2, letterSpacing: 1 }}>
                {item.label.toUpperCase()}
              </div>
              <div style={{ fontSize: 12, color: Q.textDim, lineHeight: 1.7 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SEC 6: 통합 아키텍처 ─── */
function IntegrationSection() {
  const [showPhase, setShowPhase] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <GlowCard title='"공정 분리형 통합 전략"과 77K 근접 제어' icon="🏗️" color={Q.orange}>
        <p style={ps}>
          22nm FD-SOI 파운더리에서 <M>BQB-B + DD-IC + 게이트/센서/배선</M>을
          <Em c={Q.orange}> 동시 제작</Em>한 뒤,
          큐비트 생성(Q)은 <Em c={Q.orange}>후공정으로 분리</Em>합니다.
        </p>
      </GlowCard>

      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Phase 1: 파운더리", color: Q.orange },
          { label: "Phase 2: 후공정 Q 생성", color: Q.cyan },
          { label: "분리 이유", color: Q.magenta },
        ].map((t, i) => (
          <TabBtn key={i} active={showPhase === i} color={t.color}
            onClick={() => setShowPhase(i)}>{t.label}</TabBtn>
        ))}
      </div>

      <div style={{
        background: Q.card, borderRadius: 12, padding: 24,
        border: `1px solid ${Q.border}`,
      }}>
        {showPhase === 0 && (
          <div>
            <SectionLabel color={Q.orange}>Phase 1 — 22nm FD-SOI 파운더리 공정</SectionLabel>
            <p style={ps}>
              상용 파운더리 PDK/DRC 룰을 준수하며 다음을 동시 구현합니다:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
              {[
                { name: "BQB-B", desc: "매립 장벽 + 개구 템플릿 (종·횡 공정창 물리적 강제)" },
                { name: "Triple-Wall", desc: "STI + T3 + guard ring (다층 격리 구조)" },
                { name: "DD-IC", desc: "77K 동작 DD Pulse Generator IC (근접 제어 회로)" },
                { name: "게이트/센서/BEOL", desc: "큐비트 제어 게이트, 판독 센서, 배선/전원망" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, padding: "8px 12px",
                  background: `${Q.orange}08`, borderRadius: 6,
                  borderLeft: `3px solid ${Q.orange}30`,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: Q.orange, fontFamily: font, minWidth: 90 }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: 12, color: Q.textDim }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {showPhase === 1 && (
          <div>
            <SectionLabel color={Q.cyan}>Phase 2 — 후공정 큐비트 생성</SectionLabel>
            <p style={ps}>
              파운더리 칩을 수령한 뒤, <M>큐비트 생성만 독립적으로 반복</M>합니다.
              폐루프(Generate → Verify → Correct)를 통해 공정창 내 수율을 점진적으로 수렴시킵니다.
            </p>
            <p style={ps}>
              이 분리 덕분에 큐비트 생성 조건(에너지, 각도, 선량)을 자유롭게 변경하면서
              반복 실험할 수 있으며, 파운더리 제작 비용을 다시 지불할 필요가 없습니다.
            </p>
          </div>
        )}
        {showPhase === 2 && (
          <div>
            <SectionLabel color={Q.magenta}>공정 분리의 세 가지 이유</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
              {[
                { title: "오염/열예산 격리", desc: "이온 주입 및 활성화 과정의 오염·열예산 리스크를 파운더리 공정으로부터 완전히 격리합니다." },
                { title: "반복 최적화", desc: "Q 생성을 후공정으로 분리하면 폐루프 반복이 가능해져 공정창 수렴 속도가 비약적으로 향상됩니다." },
                { title: "스케일 확장", desc: "파운더리에서 BQB 타일 + DD-IC를 동일 PDK 룰로 검증해, 배열 면적 확대 시에도 DRC/EM/IR 리스크를 최소화합니다." },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: "12px 16px",
                  background: `${Q.magenta}08`, borderRadius: 8,
                  borderLeft: `3px solid ${Q.magenta}30`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: Q.magenta, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: Q.textDim, lineHeight: 1.7 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════ SHARED COMPONENTS ═══════ */

const ps = { fontSize: 14, color: Q.textDim, lineHeight: 1.9, margin: "0 0 8px" };

function M({ children }) {
  return <code style={{ color: Q.cyan, background: `${Q.cyan}10`, padding: "1px 5px", borderRadius: 3, fontSize: 13, fontFamily: font }}>{children}</code>;
}
function Em({ children, c }) {
  return <strong style={{ color: c || Q.text }}>{children}</strong>;
}

function GlowCard({ title, icon, color, children }) {
  return (
    <div style={{
      position: "relative",
      background: `linear-gradient(135deg, ${color}06, ${Q.card})`,
      borderRadius: 14, padding: 24,
      border: `1px solid ${color}20`,
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${color}12, transparent)`,
        filter: "blur(20px)",
      }} />
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: Q.text, margin: 0 }}>{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function TabBtn({ children, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1,
      background: active ? `${color}15` : "transparent",
      border: `1px solid ${active ? color : Q.border}`,
      color: active ? color : Q.textMuted,
      borderRadius: 8, padding: "8px 12px",
      cursor: "pointer", fontSize: 12,
      fontWeight: active ? 700 : 400,
      fontFamily: font,
      transition: "all 0.3s",
    }}>
      {children}
    </button>
  );
}

function Callout({ children, color, icon }) {
  return (
    <div style={{
      background: `${color}08`, borderRadius: 10, padding: "16px 20px",
      border: `1px solid ${color}15`,
      borderLeft: `3px solid ${color}`,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
        <div style={{ fontSize: 13, color: Q.textDim, lineHeight: 1.8 }}>{children}</div>
      </div>
    </div>
  );
}

function ParamBox({ params }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 12 }}>
      {params.map((p, i) => (
        <div key={i} style={{
          display: "flex", gap: 12, padding: "6px 10px",
          background: `${Q.void}60`, borderRadius: 6,
        }}>
          <span style={{ fontSize: 11, color: p.color || Q.textMuted, fontFamily: font, fontWeight: 700, minWidth: 50 }}>{p.name}</span>
          <span style={{ fontSize: 12, color: Q.textDim, fontFamily: font }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children, color }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 800, color, fontFamily: font, marginBottom: 8, letterSpacing: 1 }}>
      {children}
    </div>
  );
}

/* ═══════ MAIN APP ═══════ */

const sections = [
  { id: "physics", label: "이온 주입 물리", icon: "⚛️" },
  { id: "pw", label: "공정창 규격", icon: "📐" },
  { id: "wall", label: "Triple-Wall", icon: "🛡️" },
  { id: "sim", label: "시뮬레이션", icon: "🔬" },
  { id: "loop", label: "폐루프 공정", icon: "🔄" },
  { id: "arch", label: "통합 아키텍처", icon: "🏗️" },
];

const sectionComps = {
  physics: IonPhysicsSection,
  pw: ProcessWindowSection,
  wall: TripleWallSection,
  sim: SimulationSection,
  loop: ClosedLoopSection,
  arch: IntegrationSection,
};


function __BQBIntermediateRender__() {
  const [tab, setTab] = useState("physics");
  const Comp = sectionComps[tab];
  const idx = sections.findIndex(s => s.id === tab);

  return (
    <div style={{
      minHeight: "100vh",
      background: Q.void,
      fontFamily: "'Noto Sans KR', -apple-system, sans-serif",
      color: Q.text,
      position: "relative",
    }}>
      <QuantumBG />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{
          padding: "36px 20px 20px",
          background: `linear-gradient(180deg, ${Q.glow}08, transparent)`,
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <QuantumAtom size={44} color={Q.glow} />
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: Q.glow, letterSpacing: 4, fontFamily: font }}>
                  INTERMEDIATE GUIDE
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, lineHeight: 1.3,
                  background: `linear-gradient(135deg, ${Q.text}, ${Q.cyan})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  BQB 공정 물리와 설계 원리
                </h1>
              </div>
            </div>
            <p style={{ fontSize: 12, color: Q.textMuted, margin: 0, fontFamily: font }}>
              반도체 큐비트 대규모 배열 — 공정창·Triple-Wall·폐루프의 정량적 이해
            </p>
          </div>
        </div>

        {/* Nav */}
        <div style={{
          position: "sticky", top: 52, zIndex: 9,
          background: `${Q.void}ee`,
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${Q.border}`,
          overflowX: "auto",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", padding: "0 8px" }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setTab(s.id)}
                style={{
                  background: "none", border: "none",
                  borderBottom: tab === s.id ? `2px solid ${Q.glow}` : "2px solid transparent",
                  padding: "10px 10px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", gap: 4,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 13 }}>{s.icon}</span>
                <span style={{
                  fontSize: 11, fontFamily: font,
                  fontWeight: tab === s.id ? 700 : 400,
                  color: tab === s.id ? Q.glow : Q.textMuted,
                }}>
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "28px 16px 80px" }}>
          <Comp />

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 36 }}>
            <NavBtn
              disabled={idx === 0}
              onClick={() => idx > 0 && setTab(sections[idx - 1].id)}
              color={Q.glow}
            >
              ← 이전
            </NavBtn>
            <NavBtn
              disabled={idx === sections.length - 1}
              onClick={() => idx < sections.length - 1 && setTab(sections[idx + 1].id)}
              color={Q.glow}
            >
              다음 →
            </NavBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBtn({ children, disabled, onClick, color }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: disabled ? "transparent" : `${color}10`,
      border: `1px solid ${disabled ? Q.border : color}`,
      color: disabled ? Q.textMuted : color,
      borderRadius: 8, padding: "10px 20px",
      cursor: disabled ? "default" : "pointer",
      fontSize: 12, fontFamily: font, fontWeight: 600,
      opacity: disabled ? 0.3 : 1,
      transition: "all 0.3s",
    }}>
      {children}
    </button>
  );
}


  return <__BQBIntermediateRender__ />;
}

/* ═══════ APP: Quantum World Explorer ═══════ */
function QuantumWorldExplorer() {


/*
  ═══════════════════════════════════════════
  ⚛️ Quantum World Explorer
  양자 세계의 핵심 개념을 인터랙티브 시각화로 탐험
  카테고리: quantum
  ═══════════════════════════════════════════
*/


function __QWERender__() {
  return <_QWECore />;
}

function _QWECore() {
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredCard, setHoveredCard] = useState(null);

  const Q = {
    bg: "#030712",
    bgGlow: "#0a0f1e",
    card: "#0d1320",
    cardHover: "#111827",
    surface: "#141c2e",
    accent: "#06b6d4",
    accentAlt: "#8b5cf6",
    accentPink: "#ec4899",
    accentGreen: "#10b981",
    accentAmber: "#f59e0b",
    text: "#e2e8f0",
    textDim: "#94a3b8",
    textMuted: "#475569",
    border: "#1e293b",
    glow: "0 0 40px #06b6d420, 0 0 80px #8b5cf610",
  };

  const concepts = [
    {
      id: "why-quantum",
      icon: "🔧",
      title: "왜 양자를 공부하는가?",
      subtitle: "From Theory to Engineering",
      color: "#58a6ff",
      gradient: "linear-gradient(135deg, #58a6ff, #1f6feb)",
      desc: "양자역학이 실제 양자컴퓨터 기술로 이어지는 여정 — BQB 플랫폼",
      visual: WhyQuantumVisual,
      featured: true,
    },
    {
      id: "superposition",
      icon: "◉",
      title: "중첩",
      subtitle: "Superposition",
      color: Q.accent,
      gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
      desc: "하나의 양자가 동시에 여러 상태에 존재하는 현상",
      visual: SuperpositionVisual,
    },
    {
      id: "entanglement",
      icon: "⫘",
      title: "얽힘",
      subtitle: "Entanglement",
      color: Q.accentAlt,
      gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
      desc: "떨어진 두 입자가 즉시 연결되는 기묘한 상관관계",
      visual: EntanglementVisual,
    },
    {
      id: "tunneling",
      icon: "⇥",
      title: "터널링",
      subtitle: "Quantum Tunneling",
      color: Q.accentGreen,
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      desc: "장벽을 뚫고 넘어가는 양자의 확률적 투과",
      visual: TunnelingVisual,
    },
    {
      id: "measurement",
      icon: "◎",
      title: "측정",
      subtitle: "Measurement Problem",
      color: Q.accentPink,
      gradient: "linear-gradient(135deg, #ec4899, #db2777)",
      desc: "관찰하는 순간 상태가 결정되는 양자의 수수께끼",
      visual: MeasurementVisual,
    },
    {
      id: "wave",
      icon: "∿",
      title: "파동-입자 이중성",
      subtitle: "Wave-Particle Duality",
      color: Q.accentAmber,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      desc: "빛과 물질이 파동이면서 동시에 입자인 세계",
      visual: WaveDualityVisual,
    },
    {
      id: "uncertainty",
      icon: "Δ",
      title: "불확정성 원리",
      subtitle: "Uncertainty Principle",
      color: "#f43f5e",
      gradient: "linear-gradient(135deg, #f43f5e, #e11d48)",
      desc: "위치와 운동량을 동시에 정확히 알 수 없는 근본적 한계",
      visual: UncertaintyVisual,
    },
  ];

  const activeConcept = concepts.find((c) => c.id === activeSection);

  if (activeSection !== "home" && activeConcept) {
    const Visual = activeConcept.visual;
    return (
      <div style={{ minHeight: "100vh", background: Q.bg, fontFamily: "'Noto Sans KR', system-ui, sans-serif", color: Q.text }}>
        {/* Ambient glow */}
        <div style={{ position: "fixed", top: -200, left: "50%", transform: "translateX(-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${activeConcept.color}08, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Top bar */}
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${Q.border}` }}>
            <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => setActiveSection("home")}
                style={{
                  background: `${activeConcept.color}10`,
                  border: `1px solid ${activeConcept.color}30`,
                  color: activeConcept.color,
                  borderRadius: 10,
                  padding: "8px 18px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                ← 돌아가기
              </button>
              <div style={{ width: 1, height: 24, background: Q.border }} />
              <span style={{ fontSize: 22, fontWeight: 900, color: activeConcept.color }}>{activeConcept.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{activeConcept.title}</span>
              <span style={{ fontSize: 11, color: Q.textMuted, fontStyle: "italic" }}>{activeConcept.subtitle}</span>
            </div>
          </div>

          {/* Content */}
          <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 80px" }}>
            <Visual Q={Q} color={activeConcept.color} />
          </div>
        </div>
      </div>
    );
  }

  // ─── HOME ───
  return (
    <div style={{ minHeight: "100vh", background: Q.bg, fontFamily: "'Noto Sans KR', system-ui, sans-serif", color: Q.text, overflow: "hidden" }}>
      {/* Ambient background glows */}
      <div style={{ position: "fixed", top: -300, right: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, #06b6d406, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -300, left: -200, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, #8b5cf606, transparent 70%)", pointerEvents: "none" }} />

      {/* Floating particles */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 3 === 0 ? 3 : 2,
              height: i % 3 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: [Q.accent, Q.accentAlt, Q.accentPink, Q.accentGreen][i % 4],
              opacity: 0.15 + (i % 5) * 0.06,
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animation: `floatParticle ${6 + (i % 4) * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; }
          25% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
          50% { transform: translateY(-8px) translateX(-8px); opacity: 0.2; }
          75% { transform: translateY(-25px) translateX(5px); opacity: 0.35; }
        }
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.15); opacity: 0.8; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes orbitalSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: "48px 20px 40px", textAlign: "center" }}>
          {/* Atom icon */}
          <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 24px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid ${Q.accent}20`, animation: "pulseRing 3s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: `1.5px solid ${Q.accentAlt}25`, animation: "orbitalSpin 8s linear infinite" }} />
            <div style={{ position: "absolute", inset: 16, borderRadius: "50%", border: `1px dashed ${Q.accentPink}20`, animation: "orbitalSpin 12s linear infinite reverse" }} />
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 16, height: 16, borderRadius: "50%", background: `radial-gradient(circle, ${Q.accent}, ${Q.accentAlt})`, boxShadow: `0 0 20px ${Q.accent}40, 0 0 40px ${Q.accentAlt}20` }} />
            {/* Orbital dots */}
            {[0, 120, 240].map((deg, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: [Q.accent, Q.accentAlt, Q.accentPink][i],
                  transform: `rotate(${deg}deg) translateX(32px) translateY(-50%)`,
                  boxShadow: `0 0 8px ${[Q.accent, Q.accentAlt, Q.accentPink][i]}60`,
                  animation: `orbitalSpin ${6 + i * 2}s linear infinite`,
                  transformOrigin: "50% 50%",
                }}
              />
            ))}
          </div>

          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 6, color: Q.accent, marginBottom: 12, textTransform: "uppercase" }}>
            Quantum World
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              margin: "0 0 12px",
              lineHeight: 1.2,
              background: `linear-gradient(135deg, ${Q.accent}, ${Q.accentAlt}, ${Q.accentPink})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% auto",
              animation: "shimmer 4s linear infinite",
            }}
          >
            양자 세계 탐험
          </h1>
          <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.7, maxWidth: 400, margin: "0 auto" }}>
            눈에 보이지 않는 양자의 세계를<br />
            인터랙티브 시각화로 직접 체험하세요
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 80px" }}>

          {/* ─── Featured Card: 왜 양자인가? ─── */}
          {(() => {
            const feat = concepts.find(c => c.featured);
            if (!feat) return null;
            const isH = hoveredCard === feat.id;
            return (
              <div
                onClick={() => setActiveSection(feat.id)}
                onMouseEnter={() => setHoveredCard(feat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: "relative", marginBottom: 20,
                  background: isH ? `${feat.color}08` : Q.card,
                  borderRadius: 18, padding: "28px 28px 24px",
                  border: `1px solid ${isH ? `${feat.color}40` : Q.border}`,
                  cursor: "pointer", transition: "all 0.3s ease",
                  transform: isH ? "translateY(-3px)" : "none",
                  boxShadow: isH ? `0 8px 40px ${feat.color}12, 0 0 0 1px ${feat.color}15` : "none",
                  animation: "fadeSlideUp 0.5s ease forwards", opacity: 0,
                  overflow: "hidden",
                }}
              >
                {/* Glow */}
                <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${feat.color}${isH ? "10" : "04"}, transparent 70%)`, pointerEvents: "none", transition: "all 0.3s" }} />
                <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${Q.accentAlt}06, transparent 70%)`, pointerEvents: "none" }} />

                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: feat.color, letterSpacing: 3, textTransform: "uppercase" }}>Featured</span>
                    <div style={{ flex: 1, height: 1, background: `${feat.color}20` }} />
                    <span style={{ fontSize: 16 }}>→</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: `linear-gradient(135deg, ${feat.color}15, ${Q.accentAlt}10)`,
                      border: `1px solid ${feat.color}25`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28, flexShrink: 0,
                      boxShadow: isH ? `0 0 20px ${feat.color}20` : "none",
                      transition: "all 0.3s",
                    }}>{feat.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: Q.text, marginBottom: 4, lineHeight: 1.3 }}>{feat.title}</div>
                      <div style={{ fontSize: 12, color: Q.textDim, lineHeight: 1.6 }}>{feat.desc}</div>
                    </div>
                  </div>
                  {/* Mini pipeline preview */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18, padding: "10px 0", borderTop: `1px solid ${Q.border}` }}>
                    {[
                      { label: "양자 이론", icon: "⚛️", c: Q.accent },
                      { label: "→", c: Q.textMuted },
                      { label: "BQB 설계", icon: "🔬", c: "#3fb950" },
                      { label: "→", c: Q.textMuted },
                      { label: "양자컴퓨터", icon: "💻", c: "#58a6ff" },
                    ].map((s, i) => s.icon ? (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 14 }}>{s.icon}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: s.c }}>{s.label}</span>
                      </div>
                    ) : (
                      <span key={i} style={{ fontSize: 11, color: s.c, opacity: 0.5 }}>{s.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ─── Section Label ─── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "0 4px" }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: Q.accent, letterSpacing: 3, textTransform: "uppercase" }}>Core Concepts</span>
            <div style={{ flex: 1, height: 1, background: `${Q.accent}15` }} />
            <span style={{ fontSize: 10, color: Q.textMuted }}>{concepts.filter(c => !c.featured).length}개 주제</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {concepts.filter(c => !c.featured).map((c, idx) => (
              <div
                key={c.id}
                onClick={() => setActiveSection(c.id)}
                onMouseEnter={() => setHoveredCard(c.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  position: "relative",
                  background: hoveredCard === c.id ? Q.cardHover : Q.card,
                  borderRadius: 16,
                  padding: 24,
                  border: `1px solid ${hoveredCard === c.id ? c.color + "40" : Q.border}`,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: hoveredCard === c.id ? "translateY(-4px)" : "none",
                  boxShadow: hoveredCard === c.id ? `0 8px 32px ${c.color}15, 0 0 0 1px ${c.color}20` : "none",
                  animation: "fadeSlideUp 0.5s ease forwards",
                  animationDelay: `${idx * 0.08}s`,
                  opacity: 0,
                  animationFillMode: "forwards",
                  overflow: "hidden",
                }}
              >
                {/* Card glow orb */}
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${c.color}${hoveredCard === c.id ? "12" : "06"}, transparent 70%)`,
                    transition: "all 0.3s",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${c.color}12`,
                      border: `1px solid ${c.color}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 900,
                      color: c.color,
                      marginBottom: 16,
                      transition: "all 0.3s",
                      boxShadow: hoveredCard === c.id ? `0 0 16px ${c.color}20` : "none",
                    }}
                  >
                    {c.icon}
                  </div>

                  <div style={{ fontSize: 16, fontWeight: 800, color: Q.text, marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: c.color, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                    {c.subtitle}
                  </div>
                  <div style={{ fontSize: 12, color: Q.textMuted, lineHeight: 1.6 }}>{c.desc}</div>

                  {/* Bottom accent line */}
                  <div
                    style={{
                      marginTop: 16,
                      height: 2,
                      borderRadius: 1,
                      background: `linear-gradient(90deg, ${c.color}${hoveredCard === c.id ? "60" : "20"}, transparent)`,
                      transition: "all 0.3s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom quote */}
          <div style={{ textAlign: "center", marginTop: 48, padding: "24px 0" }}>
            <div style={{ fontSize: 12, color: Q.textMuted, fontStyle: "italic", lineHeight: 1.8 }}>
              "양자역학을 이해했다고 생각한다면,<br />
              양자역학을 이해하지 못한 것이다."
            </div>
            <div style={{ fontSize: 11, color: Q.textMuted, marginTop: 8, opacity: 0.6 }}>— Richard Feynman</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   📦 각 개념별 시각화 컴포넌트
   ═══════════════════════════════════════════ */

function SectionBlock({ Q, color, title, children }) {
  return (
    <div style={{ background: Q.card, borderRadius: 16, border: `1px solid ${Q.border}`, padding: 28, marginBottom: 16 }}>
      {title && <div style={{ fontSize: 16, fontWeight: 800, color: color, marginBottom: 16 }}>{title}</div>}
      {children}
    </div>
  );
}

function Insight({ Q, color, emoji, children }) {
  return (
    <div style={{ background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 12, padding: "16px 20px", marginTop: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>{emoji}</span>
      <div style={{ fontSize: 13, color: Q.textDim, lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

/* ─── 중첩 Superposition ─── */
function SuperpositionVisual({ Q, color }) {
  const [observed, setObserved] = useState(false);
  const [result, setResult] = useState(null);

  function observe() {
    setObserved(true);
    setResult(Math.random() > 0.5 ? "up" : "down");
  }
  function reset() {
    setObserved(false);
    setResult(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBlock Q={Q} color={color} title="양자 중첩이란?">
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.8, margin: 0 }}>
          공중에 던진 동전은 실제로는 매 순간 앞면 또는 뒷면 중 하나입니다 — 우리가 <em>모를 뿐</em>이죠.
          하지만 양자 세계의 입자는 다릅니다. 측정 전에는 <span style={{ color, fontWeight: 700 }}>두 상태가 물리적으로 동시에 존재</span>합니다.
          이것은 "모른다"가 아니라, 자연이 <span style={{ color, fontWeight: 700 }}>정말로 겹쳐 있는 상태</span>입니다.
        </p>
        <Insight Q={Q} color={color} emoji="🌡️">
          <strong style={{ color }}>디코히어런스:</strong> 중첩 상태는 주변 환경과 상호작용하면 급격히 무너집니다.
          이것이 거시 세계에서 고양이가 "살아 있으면서 동시에 죽어 있는" 상태를 볼 수 없는 이유입니다.
          양자컴퓨터가 극저온 환경을 필요로 하는 것도 중첩을 유지하기 위해서입니다.
        </Insight>
      </SectionBlock>

      <SectionBlock Q={Q} color={color} title="직접 체험하기">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          {/* Quantum coin */}
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: observed ? 40 : 28,
              fontWeight: 900,
              color: observed ? (result === "up" ? "#10b981" : "#f43f5e") : color,
              background: observed ? `${result === "up" ? "#10b981" : "#f43f5e"}12` : `linear-gradient(135deg, ${color}15, ${Q.accentAlt}15)`,
              border: `3px solid ${observed ? (result === "up" ? "#10b981" : "#f43f5e") : color}40`,
              boxShadow: observed ? `0 0 30px ${result === "up" ? "#10b981" : "#f43f5e"}20` : `0 0 30px ${color}15, 0 0 60px ${Q.accentAlt}10`,
              transition: "all 0.5s ease",
              animation: observed ? "none" : "pulseRing 2s ease-in-out infinite",
            }}
          >
            {observed ? (result === "up" ? "↑" : "↓") : "↑↓"}
          </div>

          <div style={{ fontSize: 14, color: Q.textDim, marginBottom: 20 }}>
            {observed ? (
              <span>
                측정 결과: <strong style={{ color: result === "up" ? "#10b981" : "#f43f5e" }}>{result === "up" ? "스핀 업 ↑" : "스핀 다운 ↓"}</strong>
              </span>
            ) : (
              <span>
                현재 상태: <strong style={{ color }}>↑ + ↓ 중첩</strong>
              </span>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {!observed ? (
              <button
                onClick={observe}
                style={{
                  background: `${color}15`,
                  border: `2px solid ${color}40`,
                  color: color,
                  borderRadius: 12,
                  padding: "12px 32px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  transition: "all 0.2s",
                }}
              >
                👁️ 측정하기
              </button>
            ) : (
              <button
                onClick={reset}
                style={{
                  background: `${Q.accentAlt}15`,
                  border: `2px solid ${Q.accentAlt}40`,
                  color: Q.accentAlt,
                  borderRadius: 12,
                  padding: "12px 32px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                🔄 다시 중첩시키기
              </button>
            )}
          </div>
        </div>

        <Insight Q={Q} color={color} emoji="💡">
          <strong style={{ color }}>핵심:</strong> 양자 중첩은 "모른다"가 아닙니다.
          측정 전에는 <em>정말로</em> 두 상태가 동시에 존재하며, 측정하는 순간 하나로 '붕괴'합니다.
        </Insight>
      </SectionBlock>

      {/* Math representation */}
      <SectionBlock Q={Q} color={color} title="수학적 표현">
        <div style={{ textAlign: "center", padding: 20, background: `${color}06`, borderRadius: 12 }}>
          <div style={{ fontFamily: "serif", fontSize: 20, color: Q.text, letterSpacing: 2 }}>
            |ψ⟩ = α|↑⟩ + β|↓⟩
          </div>
          <div style={{ fontSize: 12, color: Q.textMuted, marginTop: 12, lineHeight: 1.7 }}>
            |α|² + |β|² = 1 (각 상태를 측정할 확률의 합은 항상 1)
          </div>
          <div style={{ fontSize: 11, color: Q.textMuted, marginTop: 8, lineHeight: 1.7, fontStyle: "italic" }}>
            α, β는 복소수 — |α|²는 ↑을 측정할 확률, |β|²는 ↓을 측정할 확률
          </div>
        </div>
      </SectionBlock>
    </div>
  );
}

/* ─── 얽힘 Entanglement ─── */
function EntanglementVisual({ Q, color }) {
  const [entangled, setEntangled] = useState(false);
  const [results, setResults] = useState(null);

  function measure() {
    const r = Math.random() > 0.5 ? "up" : "down";
    setEntangled(true);
    setResults({ a: r, b: r === "up" ? "down" : "up" });
  }
  function reset() {
    setEntangled(false);
    setResults(null);
  }

  const ParticleOrb = ({ label, state, particleColor, side }) => (
    <div style={{ textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: Q.textMuted, marginBottom: 8, letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          margin: "0 auto 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: state ? 32 : 20,
          fontWeight: 900,
          color: state ? (state === "up" ? "#10b981" : "#f43f5e") : color,
          background: state ? `${state === "up" ? "#10b981" : "#f43f5e"}12` : `${color}10`,
          border: `2px solid ${state ? (state === "up" ? "#10b981" : "#f43f5e") : color}40`,
          boxShadow: `0 0 24px ${state ? (state === "up" ? "#10b981" : "#f43f5e") : color}15`,
          transition: "all 0.4s",
        }}
      >
        {state ? (state === "up" ? "↑" : "↓") : "?"}
      </div>
      <div style={{ fontSize: 13, color: state ? (state === "up" ? "#10b981" : "#f43f5e") : Q.textMuted, fontWeight: 600 }}>
        {state ? (state === "up" ? "스핀 업" : "스핀 다운") : "미확정"}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBlock Q={Q} color={color} title="양자 얽힘이란?">
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.8, margin: 0 }}>
          두 입자가 <span style={{ color, fontWeight: 700 }}>얽히면</span>, 아무리 멀리 떨어져 있어도
          한쪽을 측정하면 <span style={{ color, fontWeight: 700 }}>다른 쪽의 상태가 즉시 결정</span>됩니다.
          아인슈타인은 이를 "으스스한 원격 작용(spooky action at a distance)"이라 불렀습니다.
        </p>
        <p style={{ fontSize: 13, color: Q.textDim, lineHeight: 1.8, margin: "12px 0 0" }}>
          아래는 <span style={{ color, fontWeight: 600 }}>싱글렛 상태(singlet state)</span>의 얽힘입니다.
          총 스핀이 0이므로, 한 쪽이 ↑이면 다른 쪽은 반드시 ↓이 됩니다.
        </p>
      </SectionBlock>

      <SectionBlock Q={Q} color={color} title="얽힌 입자 쌍 실험">
        <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "20px 0" }}>
          <ParticleOrb label="입자 A" state={results?.a} particleColor={color} side="left" />

          {/* Connection */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "0 8px" }}>
            <div style={{ width: 60, height: 2, background: entangled ? `${color}60` : `${color}20`, transition: "all 0.4s", boxShadow: entangled ? `0 0 10px ${color}40` : "none" }} />
            <div style={{ fontSize: 16, opacity: 0.5 }}>⫘</div>
            <div style={{ width: 60, height: 2, background: entangled ? `${color}60` : `${color}20`, transition: "all 0.4s" }} />
          </div>

          <ParticleOrb label="입자 B" state={results?.b} particleColor={color} side="right" />
        </div>

        <div style={{ textAlign: "center", marginBottom: 16, fontSize: 13, color: Q.textMuted }}>
          {entangled ? "A를 측정하니 → B도 즉시 결정!" : "두 입자가 얽힌 상태입니다"}
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {!entangled ? (
            <button onClick={measure} style={{ background: `${color}15`, border: `2px solid ${color}40`, color, borderRadius: 12, padding: "12px 32px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
              🔬 입자 A 측정
            </button>
          ) : (
            <button onClick={reset} style={{ background: `${Q.accentPink}15`, border: `2px solid ${Q.accentPink}40`, color: Q.accentPink, borderRadius: 12, padding: "12px 32px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
              🔄 다시 얽기
            </button>
          )}
        </div>

        <Insight Q={Q} color={color} emoji="🌌">
          "결과가 미리 정해져 있는 것 아냐?" — 아인슈타인도 그렇게 생각했습니다(숨은 변수 가설).
          하지만 1964년 <strong style={{ color }}>벨의 정리</strong>가, 그리고 이후의 실험들이 이를 부정했습니다.
          양자 얽힘의 상관관계는 어떤 고전적 메커니즘으로도 설명할 수 없는, <strong style={{ color }}>순수하게 양자적인 현상</strong>입니다.
        </Insight>
        <Insight Q={Q} color={color} emoji="🚫">
          <strong style={{ color }}>중요:</strong> 얽힘으로 정보를 초광속 전송할 수는 없습니다.
          측정 결과는 무작위이므로, 상대방의 결과를 알려면 결국 고전적 통신이 필요합니다.
          이것이 <strong style={{ color }}>비신호 정리(no-signaling theorem)</strong>입니다.
        </Insight>
      </SectionBlock>
    </div>
  );
}

/* ─── 터널링 Tunneling ─── */
function TunnelingVisual({ Q, color }) {
  const [attempts, setAttempts] = useState([]);
  const [shooting, setShooting] = useState(false);

  function shoot() {
    if (shooting) return;
    setShooting(true);
    const passed = Math.random() < 0.3;
    setTimeout(() => {
      setAttempts((p) => [...p, passed]);
      setShooting(false);
    }, 600);
  }

  const total = attempts.length;
  const passed = attempts.filter(Boolean).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBlock Q={Q} color={color} title="양자 터널링이란?">
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.8, margin: 0 }}>
          고전 물리에서 공이 벽을 넘으려면 충분한 에너지가 필요합니다.
          하지만 양자 세계에서 입자는 에너지가 부족해도 <span style={{ color, fontWeight: 700 }}>확률적으로 장벽을 투과</span>합니다.
          이것은 입자의 파동함수가 장벽 내부에서 완전히 0이 되지 않기 때문입니다.
        </p>
        <div style={{ textAlign: "center", padding: "16px 0 8px", margin: "16px 0 0", borderTop: `1px solid ${Q.border}` }}>
          <div style={{ fontFamily: "serif", fontSize: 18, color: Q.text, letterSpacing: 2 }}>
            T ∝ e<sup>−2κL</sup>
          </div>
          <div style={{ fontSize: 11, color: Q.textMuted, marginTop: 10, lineHeight: 1.7 }}>
            κ = √(2m(V−E)) / ℏ · L = 장벽 두께
          </div>
          <div style={{ fontSize: 11, color: Q.textMuted, lineHeight: 1.7, fontStyle: "italic" }}>
            장벽이 높거나(V↑) 두꺼울수록(L↑) 투과 확률은 지수적으로 감소
          </div>
        </div>
      </SectionBlock>

      <SectionBlock Q={Q} color={color} title="터널링 시뮬레이션">
        {/* Barrier visualization */}
        <div style={{ position: "relative", height: 160, background: `${Q.bg}`, borderRadius: 12, overflow: "hidden", border: `1px solid ${Q.border}`, marginBottom: 20 }}>
          {/* Barrier */}
          <div style={{ position: "absolute", left: "45%", top: 0, bottom: 0, width: 30, background: `linear-gradient(180deg, #f43f5e15, #f43f5e08)`, borderLeft: `2px solid #f43f5e40`, borderRight: `2px solid #f43f5e40` }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-90deg)", fontSize: 10, fontWeight: 700, color: "#f43f5e", whiteSpace: "nowrap", letterSpacing: 2 }}>BARRIER</div>
          </div>

          {/* Particle */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: shooting ? "75%" : "15%",
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 12px ${color}60, 0 0 24px ${color}30`,
              transition: shooting ? "left 0.6s ease-in-out" : "left 0.3s ease",
              opacity: shooting && attempts.length > 0 && !attempts[attempts.length] ? 1 : 1,
            }}
          />

          {/* Labels */}
          <div style={{ position: "absolute", bottom: 8, left: 16, fontSize: 10, color: Q.textMuted }}>입자 →</div>
          <div style={{ position: "absolute", bottom: 8, right: 16, fontSize: 10, color: Q.textMuted }}>통과!</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 16 }}>
          <button onClick={shoot} disabled={shooting} style={{ background: `${color}15`, border: `2px solid ${color}40`, color, borderRadius: 12, padding: "12px 32px", cursor: shooting ? "wait" : "pointer", fontSize: 14, fontWeight: 700, opacity: shooting ? 0.5 : 1 }}>
            ⚡ 입자 발사
          </button>
          <button onClick={() => setAttempts([])} style={{ background: `${Q.border}`, border: `1px solid ${Q.border}`, color: Q.textMuted, borderRadius: 12, padding: "12px 20px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            초기화
          </button>
        </div>

        {total > 0 && (
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color }}>{total}</div>
              <div style={{ fontSize: 11, color: Q.textMuted }}>시도</div>
            </div>
            <div style={{ width: 1, background: Q.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#10b981" }}>{passed}</div>
              <div style={{ fontSize: 11, color: Q.textMuted }}>통과</div>
            </div>
            <div style={{ width: 1, background: Q.border }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#f43f5e" }}>{total - passed}</div>
              <div style={{ fontSize: 11, color: Q.textMuted }}>반사</div>
            </div>
          </div>
        )}

        {/* Attempt history */}
        {total > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
            {attempts.map((p, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 3, background: p ? "#10b981" : "#f43f5e", opacity: 0.7 }} />
            ))}
          </div>
        )}

        <Insight Q={Q} color={color} emoji="⚡">
          터널링은 현실 세계에서 <strong style={{ color }}>실제로 일어나는 현상</strong>입니다.
          <strong style={{ color }}>STM(주사터널링현미경)</strong>은 터널링 전류로 원자를 하나씩 볼 수 있고,
          <strong style={{ color }}>플래시 메모리</strong>는 전자의 터널링으로 데이터를 저장·삭제합니다.
          태양의 핵융합도 양성자가 쿨롱 장벽을 터널링해야 가능하며,
          <strong style={{ color }}>알파 붕괴</strong>는 알파 입자가 핵의 퍼텐셜 장벽을 투과하는 터널링 현상입니다.
        </Insight>
      </SectionBlock>
    </div>
  );
}

/* ─── 측정 Measurement ─── */
function MeasurementVisual({ Q, color }) {
  const [mode, setMode] = useState("cloud");
  const [dots, setDots] = useState([]);

  function addDot() {
    const x = 50 + (Math.random() - 0.5) * 60 * Math.exp(-Math.pow(Math.random() - 0.5, 2) * 4);
    const y = 50 + (Math.random() - 0.5) * 60 * Math.exp(-Math.pow(Math.random() - 0.5, 2) * 4);
    setDots((p) => [...p, { x, y, id: Date.now() + Math.random() }]);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBlock Q={Q} color={color} title="측정 문제란?">
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.8, margin: 0 }}>
          양자 입자는 측정 전에 <span style={{ color, fontWeight: 700 }}>확률의 구름(파동함수)</span>으로 퍼져 있습니다.
          측정하면 구름이 사라지고 <span style={{ color, fontWeight: 700 }}>한 점</span>에 나타납니다.
          이 "파동함수 붕괴"가 왜, 어떻게 일어나는지는 양자역학 최대의 미해결 문제입니다.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          {[
            { label: "코펜하겐 해석", desc: "측정이 파동함수를 붕괴시킨다. 붕괴 전의 상태는 물리적 실재가 아니다.", color: "#ec4899" },
            { label: "다세계 해석", desc: "붕괴는 없다. 모든 가능한 결과가 각각의 평행 우주에서 실현된다.", color: "#8b5cf6" },
          ].map((interp, i) => (
            <div key={i} style={{ flex: 1, background: `${interp.color}06`, border: `1px solid ${interp.color}15`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: interp.color, marginBottom: 6 }}>{interp.label}</div>
              <div style={{ fontSize: 11, color: Q.textDim, lineHeight: 1.6 }}>{interp.desc}</div>
            </div>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock Q={Q} color={color} title="확률 구름 → 측정">
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[{ id: "cloud", label: "확률 구름" }, { id: "detect", label: "입자 검출" }].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id);
                if (m.id === "cloud") setDots([]);
              }}
              style={{
                flex: 1,
                background: mode === m.id ? `${color}15` : "transparent",
                border: `1px solid ${mode === m.id ? color : Q.border}`,
                color: mode === m.id ? color : Q.textMuted,
                borderRadius: 10,
                padding: "10px 16px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div
          onClick={mode === "detect" ? addDot : undefined}
          style={{
            position: "relative",
            height: 240,
            background: Q.bg,
            borderRadius: 12,
            border: `1px solid ${Q.border}`,
            overflow: "hidden",
            cursor: mode === "detect" ? "crosshair" : "default",
          }}
        >
          {mode === "cloud" ? (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${color}25, ${color}08, transparent)`,
                  animation: "pulseRing 3s ease-in-out infinite",
                }}
              />
              <div style={{ position: "absolute", fontSize: 11, fontWeight: 700, color: Q.textMuted }}>|ψ|² 확률 밀도</div>
            </div>
          ) : (
            <>
              {/* Gaussian guide */}
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 120, height: 120, borderRadius: "50%", border: `1px dashed ${color}15` }} />
              {dots.map((d) => (
                <div
                  key={d.id}
                  style={{
                    position: "absolute",
                    left: `${d.x}%`,
                    top: `${d.y}%`,
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 4px ${color}80`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
              <div style={{ position: "absolute", bottom: 10, left: 0, right: 0, textAlign: "center", fontSize: 11, color: Q.textMuted }}>
                클릭하여 입자 검출 ({dots.length}회)
              </div>
            </>
          )}
        </div>

        <Insight Q={Q} color={color} emoji="🎲">
          많이 검출할수록 확률 분포가 드러납니다. 이것이 <strong style={{ color }}>양자역학의 통계적 본질</strong>입니다.
          개별 결과는 예측 불가능하지만, 패턴은 정확히 예측됩니다.
        </Insight>
      </SectionBlock>
    </div>
  );
}

/* ─── 파동-입자 이중성 ─── */
function WaveDualityVisual({ Q, color }) {
  const [mode, setMode] = useState("wave");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBlock Q={Q} color={color} title="이중성이란?">
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.8, margin: 0 }}>
          빛은 <span style={{ color, fontWeight: 700 }}>파동</span>일까, <span style={{ color, fontWeight: 700 }}>입자(광자)</span>일까?
          답: <span style={{ color, fontWeight: 700 }}>둘 다</span>. 실험 방식에 따라 다르게 보입니다.
          이것은 빛만이 아니라 전자, 중성자, 심지어 C₆₀(풀러렌) 분자에도 적용됩니다.
        </p>
        <div style={{ textAlign: "center", padding: "16px 0 8px", margin: "16px 0 0", borderTop: `1px solid ${Q.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 2, marginBottom: 8 }}>드브로이 물질파</div>
          <div style={{ fontFamily: "serif", fontSize: 20, color: Q.text, letterSpacing: 2 }}>
            λ = h / p
          </div>
          <div style={{ fontSize: 11, color: Q.textMuted, marginTop: 10, lineHeight: 1.7 }}>
            모든 물질은 운동량 p에 반비례하는 파장 λ를 갖는다
          </div>
          <div style={{ fontSize: 11, color: Q.textMuted, lineHeight: 1.7, fontStyle: "italic" }}>
            무거운 물체일수록 파장이 극도로 짧아져 파동 성질이 관측되지 않음
          </div>
        </div>
      </SectionBlock>

      <SectionBlock Q={Q} color={color} title="이중 슬릿 실험">
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[{ id: "wave", label: "🌊 관측 없이 (파동)" }, { id: "particle", label: "🔬 슬릿에 관측기 부착" }].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                flex: 1,
                background: mode === m.id ? `${color}15` : "transparent",
                border: `1px solid ${mode === m.id ? color : Q.border}`,
                color: mode === m.id ? color : Q.textMuted,
                borderRadius: 10,
                padding: "12px 16px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                transition: "all 0.2s",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", height: 200, background: Q.bg, borderRadius: 12, border: `1px solid ${Q.border}`, overflow: "hidden" }}>
          {/* Source */}
          <div style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, borderRadius: "50%", background: color, boxShadow: `0 0 12px ${color}60` }} />

          {/* Barrier with slits */}
          <div style={{ position: "absolute", left: "35%", top: 0, bottom: 0, width: 6, background: `${Q.textMuted}40` }}>
            <div style={{ position: "absolute", top: "32%", width: "100%", height: 16, background: Q.bg }} />
            <div style={{ position: "absolute", top: "58%", width: "100%", height: 16, background: Q.bg }} />
          </div>

          {/* Screen / Result */}
          <div style={{ position: "absolute", right: 20, top: "10%", bottom: "10%", width: 40, borderRadius: 4, overflow: "hidden" }}>
            {mode === "wave" ? (
              // Interference pattern
              <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
                {Array.from({ length: 20 }).map((_, i) => {
                  const intensity = Math.pow(Math.cos((i / 20) * Math.PI * 3), 2);
                  return <div key={i} style={{ flex: 1, background: color, opacity: intensity * 0.7 + 0.05 }} />;
                })}
              </div>
            ) : (
              // Two blobs
              <div style={{ width: "100%", height: "100%", position: "relative" }}>
                <div style={{ position: "absolute", top: "28%", left: 0, right: 0, height: "16%", background: `${color}50`, borderRadius: 4 }} />
                <div style={{ position: "absolute", top: "56%", left: 0, right: 0, height: "16%", background: `${color}50`, borderRadius: 4 }} />
              </div>
            )}
          </div>

          {/* Rays */}
          {mode === "wave" && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
              <line x1="10%" y1="50%" x2="35%" y2="38%" stroke={color} strokeWidth="1" />
              <line x1="10%" y1="50%" x2="35%" y2="62%" stroke={color} strokeWidth="1" />
              <line x1="38%" y1="38%" x2="80%" y2="20%" stroke={color} strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="38%" y1="38%" x2="80%" y2="50%" stroke={color} strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="38%" y1="62%" x2="80%" y2="50%" stroke={color} strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="38%" y1="62%" x2="80%" y2="80%" stroke={color} strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>
          )}

          {/* Labels */}
          <div style={{ position: "absolute", bottom: 6, left: 12, fontSize: 9, color: Q.textMuted }}>광원</div>
          <div style={{ position: "absolute", bottom: 6, left: "34%", fontSize: 9, color: Q.textMuted }}>이중 슬릿</div>
          <div style={{ position: "absolute", bottom: 6, right: 12, fontSize: 9, color: Q.textMuted }}>스크린</div>
        </div>

        <Insight Q={Q} color={color} emoji="🌊">
          {mode === "wave" ? (
            <>
              관측기 없이 실험하면 <strong style={{ color }}>간섭 무늬</strong>가 나타납니다.
              입자를 하나씩 보내도 간섭 무늬가 형성됩니다 — 입자 하나가 두 슬릿을 <strong style={{ color }}>동시에</strong> 통과하는 것입니다.
            </>
          ) : (
            <>
              슬릿에 관측기를 달아 "어느 슬릿을 통과했는지" 확인하면
              간섭 무늬가 <strong style={{ color }}>사라지고</strong> 입자처럼 두 줄만 나타납니다.
              <strong style={{ color }}>"어느 경로?" 정보를 얻는 행위</strong> 자체가 파동 행동을 파괴합니다.
            </>
          )}
        </Insight>
      </SectionBlock>
    </div>
  );
}

/* ─── 왜 양자를 공부하는가 — BQB 플랫폼 ─── */
function WhyQuantumVisual({ Q, color }) {
  const [expandedMap, setExpandedMap] = useState(null);

  const bqbColor = "#58a6ff";
  const greenColor = "#3fb950";
  const orangeColor = "#f0883e";
  const cyanColor = "#39d9f0";
  const purpleColor = "#bc8cff";

  const pipeline = [
    { key: "phys", label: "N_phys", sub: "물리적 배열", value: "큐비트 사이트 생성", color: cyanColor, loss: "위치 오차, 비활성, 채널링 tail", solution: "BQB 템플릿 self-alignment" },
    { key: "op", label: "N_op", sub: "운용 가능", value: "전기적으로 동작하는 큐비트", color: greenColor, loss: "outlier, 전하 불안정, T2 미달", solution: "Triple-Wall QBQ + 폐루프 보정" },
    { key: "link", label: "N_link", sub: "얽힘 연결", value: "2-qubit 게이트 가능한 쌍", color: bqbColor, loss: "제어 비동기, 커플링 불균일", solution: "77K DD-IC 동기 펄스 + 스큐 보정" },
  ];

  const conceptMap = [
    { concept: "중첩", icon: "◉", cColor: Q.accent, tech: "큐비트 상태 |0⟩+|1⟩", detail: "BQB는 31P 도너 전자의 스핀 중첩을 큐비트로 활용합니다. 중첩을 오래 유지하는 것(T2 ≥ 1s)이 핵심 도전이며, 28Si 동위원소 순도와 Triple-Wall 격리가 이를 가능하게 합니다.", kpi: "F1q ≥ 0.999 (5차)" },
    { concept: "얽힘", icon: "⫘", cColor: Q.accentAlt, tech: "2-qubit 게이트 (N_link)", detail: "인접 큐비트 간 교환 상호작용(J-coupling)으로 얽힘을 생성합니다. N_phys에서 N_link로의 전환율이 시스템 성능을 결정하며, 5차 목표는 ≥16쌍의 CHSH 위반 검증입니다.", kpi: "F2q ≥ 0.99, ≥16쌍" },
    { concept: "터널링", icon: "⇥", cColor: Q.accentGreen, tech: "이온 주입 + 장벽 설계", detail: "FIB 단일 이온 주입 시 31P 이온이 BQB-B 매립 장벽을 투과하는 확률이 곧 implant window를 결정합니다. 장벽 두께·높이의 정밀 제어가 σ_z 공정창을 확보합니다.", kpi: "overlay ≤ 15nm (5차)" },
    { concept: "측정", icon: "◎", cColor: Q.accentPink, tech: "단일 전자 읽기(SET/RF)", detail: "큐비트 상태를 single-shot으로 읽어내는 것이 측정입니다. 단일전자트랜지스터(SET) 또는 RF 반사측정으로 스핀 상태를 비파괴적으로 검출하며, 검출 충실도 ≥99%가 목표입니다.", kpi: "단일이온 검출 ≥ 99%" },
    { concept: "파동-입자 이중성", icon: "∿", cColor: Q.accentAmber, tech: "물질파 · 나노구조 내 전자", detail: "나노미터 스케일의 게이트 구조에서 전자는 명확한 물질파 성질을 보입니다. 드브로이 파장에 기반한 양자 간섭이 게이트 설계(A-gate Stark shift, FDM 주파수 분리)의 물리적 기초입니다.", kpi: "FDM ≥ 5MHz 간격" },
    { concept: "불확정성 원리", icon: "Δ", cColor: "#f43f5e", tech: "디코히어런스 · 노이즈 한계", detail: "에너지-시간 불확정성(ΔE·Δt ≥ ℏ/2)은 큐비트의 코히어런스 시간 T2에 근본적 제약을 겁니다. 1/f 전하잡음, 자기장 요동 등 환경 노이즈가 DD(동적 디커플링) 시퀀스로 억제됩니다.", kpi: "T2 ≥ 1s (CPMG)" },
  ];

  const milestones = [
    { yr: "1차", label: "'26", size: "단일~소수", trl: "3→3+", color: Q.textDim, highlight: "플랫폼 확정" },
    { yr: "2차", label: "'27", size: "2×2", trl: "3+→4", color: cyanColor, highlight: "자가정렬 정밀화" },
    { yr: "3차", label: "'28", size: "4×4", trl: "4", color: greenColor, highlight: "2-qubit 연결" },
    { yr: "4차", label: "'29", size: "8×8", trl: "4→5-", color: orangeColor, highlight: "256-class 확장" },
    { yr: "5차", label: "'30", size: "16×16", trl: "5", color: bqbColor, highlight: "TRL5 통합 시연" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ─── 인트로 ─── */}
      <SectionBlock Q={Q} color={color} title="이론에서 기술로">
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.9, margin: 0 }}>
          앞서 탐험한 6가지 양자 개념 — 중첩, 얽힘, 터널링, 측정, 이중성, 불확정성 —
          이것들은 교과서 속 추상이 아닙니다.
        </p>
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.9, margin: "12px 0 0" }}>
          <span style={{ color: bqbColor, fontWeight: 700 }}>BQB(Barrier-defined Qubit in Buried template)</span> 플랫폼은
          이 원리들을 <span style={{ color: greenColor, fontWeight: 700 }}>22nm FD-SOI 반도체 공정 위에서</span> 실현하여,
          대규모 양자컴퓨터를 만들기 위한 5개년 엔지니어링 프로젝트입니다.
        </p>
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.9, margin: "12px 0 0" }}>
          실리콘 속 <span style={{ color: purpleColor, fontWeight: 700 }}>31P(인) 도너 원자</span>의 전자 스핀을 큐비트로 쓰고,
          매립 장벽으로 3차원 위치를 나노미터 단위로 제어하며,
          극저온(4K)에서 양자 상태를 유지합니다.
        </p>
      </SectionBlock>

      {/* ─── 핵심 도전: N_phys → N_op → N_link ─── */}
      <SectionBlock Q={Q} color={color} title="핵심 도전: 전환 파이프라인">
        <p style={{ fontSize: 13, color: Q.textDim, lineHeight: 1.8, margin: "0 0 20px" }}>
          물리적으로 큐비트를 만드는 것만으로는 부족합니다.
          진정한 병목은 <span style={{ color: bqbColor, fontWeight: 700 }}>만든 큐비트를 실제로 사용할 수 있게 만드는 전환율</span>입니다.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {pipeline.map((p, i) => (
            <div key={p.key}>
              <div style={{
                background: `${p.color}06`, border: `1px solid ${p.color}15`,
                borderRadius: 12, padding: "16px 18px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${p.color}12`, border: `1px solid ${p.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 900, color: p.color, fontFamily: "monospace",
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: p.color, fontFamily: "monospace" }}>{p.label}</div>
                    <div style={{ fontSize: 11, color: Q.textMuted }}>{p.sub}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, fontSize: 11, lineHeight: 1.6, marginLeft: 48 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#f43f5e", fontWeight: 700, fontSize: 10, marginBottom: 3 }}>손실 원인</div>
                    <div style={{ color: Q.textDim }}>{p.loss}</div>
                  </div>
                  <div style={{ width: 1, background: Q.border }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: greenColor, fontWeight: 700, fontSize: 10, marginBottom: 3 }}>BQB 해법</div>
                    <div style={{ color: Q.textDim }}>{p.solution}</div>
                  </div>
                </div>
              </div>
              {i < pipeline.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                  <div style={{ width: 2, height: 16, background: `linear-gradient(${pipeline[i].color}40, ${pipeline[i+1].color}40)` }} />
                </div>
              )}
            </div>
          ))}
        </div>
        <Insight Q={Q} color={color} emoji="📐">
          5차 목표: 16×16 배열(256 사이트)에서 사이트 수율 <strong style={{ color: greenColor }}>≥99%</strong>,
          어레이 수율 <strong style={{ color: greenColor }}>≥70%</strong>,
          얽힘 링크 <strong style={{ color: bqbColor }}>≥16쌍</strong>.
        </Insight>
      </SectionBlock>

      {/* ─── 6개 개념 × BQB 기술 매핑 ─── */}
      <SectionBlock Q={Q} color={color} title="6개 양자 개념이 만나는 기술">
        <p style={{ fontSize: 13, color: Q.textDim, lineHeight: 1.8, margin: "0 0 16px" }}>
          각 개념을 클릭하면 BQB 엔지니어링에서 어떤 역할을 하는지 확인할 수 있습니다.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {conceptMap.map((cm, idx) => {
            const isOpen = expandedMap === idx;
            return (
              <div key={idx}
                onClick={() => setExpandedMap(isOpen ? null : idx)}
                style={{
                  background: isOpen ? `${cm.cColor}06` : Q.bg,
                  border: `1px solid ${isOpen ? `${cm.cColor}25` : Q.border}`,
                  borderRadius: 12, padding: isOpen ? "16px 16px 14px" : "12px 16px",
                  cursor: "pointer", transition: "all 0.25s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: cm.cColor, width: 24, textAlign: "center" }}>{cm.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: Q.text }}>{cm.concept}</span>
                      <span style={{ fontSize: 11, color: cm.cColor }}>→</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: cm.cColor }}>{cm.tech}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: Q.textMuted, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                </div>
                {isOpen && (
                  <div style={{ marginTop: 12, marginLeft: 36 }}>
                    <div style={{ fontSize: 12, color: Q.textDim, lineHeight: 1.8, marginBottom: 10 }}>{cm.detail}</div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${cm.cColor}10`, border: `1px solid ${cm.cColor}20`, borderRadius: 6, padding: "4px 10px" }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: cm.cColor, letterSpacing: 1 }}>KPI</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: cm.cColor }}>{cm.kpi}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SectionBlock>

      {/* ─── BQB 4대 핵심 기술 ─── */}
      <SectionBlock Q={Q} color={color} title="BQB 4대 핵심 기술 스택">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {[
            { icon: "🛡️", name: "Triple-Wall QBQ", desc: "3중 격리벽으로 큐비트를 외부 노이즈로부터 보호", c: greenColor, detail: "STI moat + T3 실드웰 + BQB-B 매립 장벽" },
            { icon: "⚡", name: "77K DD-IC", desc: "극저온 근접 제어칩으로 동기 펄스 생성", c: orangeColor, detail: "22nm FD-SOI · Broadcast+선택 · O(√N) 스케일링" },
            { icon: "❄️", name: "Split-Stage 패키징", desc: "77K(제어)와 4K(큐비트) 열적 분리", c: cyanColor, detail: "2-Deck 지그 · G10 스페이서 · NbTi 동축" },
            { icon: "🔄", name: "폐루프 수렴", desc: "Generate→Verify→Correct 반복으로 수율 수렴", c: purpleColor, detail: "nano-CT 검증 · die-map 재매핑 · 캘리브레이션" },
          ].map((t, i) => (
            <div key={i} style={{
              background: `${t.c}04`, border: `1px solid ${t.c}12`,
              borderRadius: 12, padding: 14,
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: t.c, marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: Q.textDim, lineHeight: 1.5, marginBottom: 6 }}>{t.desc}</div>
              <div style={{ fontSize: 10, color: Q.textMuted, lineHeight: 1.5, fontStyle: "italic" }}>{t.detail}</div>
            </div>
          ))}
        </div>
      </SectionBlock>

      {/* ─── 5개년 로드맵 ─── */}
      <SectionBlock Q={Q} color={color} title="5개년 로드맵: TRL 3 → 5">
        <div style={{ position: "relative", padding: "0 0 8px" }}>
          {/* Timeline line */}
          <div style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 2, background: `linear-gradient(${Q.textMuted}20, ${bqbColor}40, ${bqbColor}20)` }} />

          {milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: i < milestones.length - 1 ? 16 : 0, position: "relative" }}>
              {/* Dot */}
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: `${m.color}10`, border: `1px solid ${m.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, color: m.color, fontFamily: "monospace",
                zIndex: 1,
              }}>{m.yr}</div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: m.color }}>{m.highlight}</span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: Q.textMuted, background: `${Q.textMuted}12`, padding: "2px 6px", borderRadius: 4 }}>TRL {m.trl}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: Q.textDim }}>배열: <strong style={{ color: m.color }}>{m.size}</strong></span>
                  <span style={{ fontSize: 9, color: Q.textMuted }}>{m.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Insight Q={Q} color={color} emoji="🎯">
          최종 목표: <strong style={{ color: bqbColor }}>16×16 (256 큐비트)</strong> 배열에서
          F1q ≥ 0.999, F2q ≥ 0.99, T2 ≥ 1s, 얽힘 ≥ 16쌍을 달성하여
          <strong style={{ color: greenColor }}> 기술 성숙도 TRL 5</strong>를 시연하는 것입니다.
        </Insight>
      </SectionBlock>

      {/* ─── 수율 거듭제곱의 무서움 ─── */}
      <SectionBlock Q={Q} color={color} title="수율의 거듭제곱 법칙">
        <p style={{ fontSize: 13, color: Q.textDim, lineHeight: 1.8, margin: "0 0 16px" }}>
          배열 수율은 개별 사이트 수율의 <span style={{ color: "#f43f5e", fontWeight: 700 }}>거듭제곱</span>으로 감쇠합니다.
          사이트 수율 1%의 차이가 시스템 수준에서 극적인 결과를 만듭니다.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {[
            { p: "99.0%", y: "7.6%", bar: 7.6, c: "#f43f5e" },
            { p: "99.5%", y: "27.7%", bar: 27.7, c: orangeColor },
            { p: "99.9%", y: "77.4%", bar: 77.4, c: greenColor },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 60, fontSize: 12, fontWeight: 700, color: Q.textDim, textAlign: "right", fontFamily: "monospace" }}>p={r.p}</div>
              <div style={{ flex: 1, height: 20, background: Q.bg, borderRadius: 4, overflow: "hidden", border: `1px solid ${Q.border}` }}>
                <div style={{ width: `${r.bar}%`, height: "100%", background: `${r.c}40`, borderRadius: 3, transition: "width 0.5s ease" }} />
              </div>
              <div style={{ width: 44, fontSize: 12, fontWeight: 800, color: r.c, fontFamily: "monospace" }}>{r.y}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: Q.textMuted, textAlign: "center", fontFamily: "serif", letterSpacing: 1 }}>
          Y_array = p_site<sup>N</sup> (N = 256 사이트 기준)
        </div>
      </SectionBlock>

      {/* ─── 마무리 ─── */}
      <div style={{
        background: `linear-gradient(135deg, ${bqbColor}08, ${purpleColor}06, ${greenColor}04)`,
        border: `1px solid ${bqbColor}15`, borderRadius: 16, padding: "28px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 24, marginBottom: 12 }}>⚛️ → 🔧 → 💻</div>
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.9, maxWidth: 500, margin: "0 auto" }}>
          양자역학의 원리를 이해하는 것은
          <span style={{ color: bqbColor, fontWeight: 700 }}> 양자컴퓨터를 설계하는 엔지니어의 첫걸음</span>입니다.
        </p>
        <p style={{ fontSize: 13, color: Q.textMuted, lineHeight: 1.8, maxWidth: 500, margin: "12px auto 0" }}>
          중첩이 큐비트를, 얽힘이 게이트를, 터널링이 공정을,
          측정이 읽기를, 불확정성이 한계를 정의합니다.
          이 모든 것을 실리콘 위에 구현하는 것이 BQB의 도전입니다.
        </p>
      </div>
    </div>
  );
}

/* ─── 불확정성 원리 ─── */
function UncertaintyVisual({ Q, color }) {
  const [focus, setFocus] = useState(50);

  const positionSpread = 100 - focus;
  const momentumSpread = focus;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionBlock Q={Q} color={color} title="불확정성 원리란?">
        <p style={{ fontSize: 14, color: Q.textDim, lineHeight: 1.8, margin: 0 }}>
          하이젠베르크의 원리: 입자의 <span style={{ color, fontWeight: 700 }}>위치</span>를 정확히 알수록
          <span style={{ color: "#06b6d4", fontWeight: 700 }}> 운동량</span>은 더 불확실해지고, 그 반대도 마찬가지입니다.
          이것은 <span style={{ color, fontWeight: 700 }}>측정 기술의 한계가 아니라 자연의 근본적 성질</span>입니다.
        </p>
      </SectionBlock>

      <SectionBlock Q={Q} color={color} title="직접 조절해 보기">
        <div style={{ textAlign: "center", padding: "0 0 8px" }}>
          <div style={{ fontSize: 22, fontFamily: "serif", color: Q.text, marginBottom: 20, letterSpacing: 2 }}>
            Δx · Δp ≥ ℏ/2
          </div>

          {/* Position visualization */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 8 }}>위치 (Δx)</div>
              <div style={{ position: "relative", height: 80, background: Q.bg, borderRadius: 8, border: `1px solid ${Q.border}`, overflow: "hidden" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: `${Math.max(10, positionSpread)}%`,
                    height: `${Math.max(10, positionSpread)}%`,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${color}40, ${color}10, transparent)`,
                    transition: "all 0.3s",
                  }}
                />
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}60` }} />
              </div>
              <div style={{ fontSize: 11, color: Q.textMuted, marginTop: 6 }}>불확실성: {positionSpread}%</div>
            </div>

            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#06b6d4", marginBottom: 8 }}>운동량 (Δp)</div>
              <div style={{ position: "relative", height: 80, background: Q.bg, borderRadius: 8, border: `1px solid ${Q.border}`, overflow: "hidden" }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: `${50 + (Math.random() - 0.5) * momentumSpread * 0.8}%`,
                      transform: "translateY(-50%)",
                      width: `${2 + momentumSpread * 0.3}px`,
                      height: 2,
                      background: "#06b6d4",
                      opacity: 0.4 + Math.random() * 0.4,
                      borderRadius: 1,
                    }}
                  />
                ))}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 16, color: "#06b6d4" }}>→</div>
              </div>
              <div style={{ fontSize: 11, color: Q.textMuted, marginTop: 6 }}>불확실성: {momentumSpread}%</div>
            </div>
          </div>

          {/* Slider */}
          <div style={{ padding: "0 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: Q.textMuted, marginBottom: 6 }}>
              <span>← 운동량 정확</span>
              <span>위치 정확 →</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={focus}
              onChange={(e) => setFocus(Number(e.target.value))}
              style={{ width: "100%", accentColor: color }}
            />
          </div>
        </div>

        <Insight Q={Q} color={color} emoji="⚖️">
          슬라이더를 움직여 보세요. 한쪽을 줄이면 다른 쪽이 반드시 커집니다.
          이것이 <strong style={{ color }}>자연이 정한 절대적 한계</strong>입니다.
        </Insight>
      </SectionBlock>

      <SectionBlock Q={Q} color={color} title="에너지-시간 불확정성">
        <div style={{ textAlign: "center", padding: 16, background: `${color}06`, borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontFamily: "serif", fontSize: 20, color: Q.text, letterSpacing: 2 }}>
            ΔE · Δt ≥ ℏ/2
          </div>
          <div style={{ fontSize: 12, color: Q.textMuted, marginTop: 10, lineHeight: 1.7 }}>
            에너지를 정확히 측정하려면 충분한 시간이 필요하고, 짧은 시간에는 에너지가 크게 요동칠 수 있다
          </div>
        </div>
        <p style={{ fontSize: 13, color: Q.textDim, lineHeight: 1.8, margin: 0 }}>
          이 원리 덕분에 <span style={{ color, fontWeight: 700 }}>진공에서도 에너지가 0이 될 수 없습니다(영점에너지)</span>.
          양자장론에서 진공은 "아무것도 없는 것"이 아니라, 입자-반입자 쌍이 순간적으로 생겼다가 사라지는
          <span style={{ color, fontWeight: 700 }}> 양자 요동</span>으로 끊임없이 들끓는 공간입니다.
          이 효과는 <span style={{ color, fontWeight: 700 }}>카시미르 효과</span>로 실험적으로 검증되었습니다.
        </p>
      </SectionBlock>
    </div>
  );
}


  return <_QWECore />;
}

/* ═══════ APP: BQB 고급 가이드 ═══════ */
function BQBAdvancedGuide() {

const B = {
  bg: "#060a14", bgSub: "#0a0f1e", card: "#0d1525", cardHover: "#111d32",
  surface: "#162038", accent: "#58a6ff", accentDim: "#1f6feb",
  green: "#3fb950", greenDim: "#238636",
  orange: "#f0883e", orangeDim: "#bd561d",
  cyan: "#39d9f0", cyanDim: "#0e7490",
  purple: "#bc8cff", purpleDim: "#8b5cf6",
  red: "#f85149", redDim: "#da3633",
  yellow: "#fde047",
  text: "#e6edf3", textDim: "#8b949e", textMuted: "#484f58",
  border: "#21262d", borderLight: "#30363d",
};

const sections = [
  { id: "overview", label: "개요", icon: "📐", color: B.accent },
  { id: "error-budget", label: "오차 예산", icon: "📐", color: B.accent },
  { id: "triple-wall", label: "Triple-Wall", icon: "🛡️", color: B.green },
  { id: "dd-ic", label: "DD-IC", icon: "⚡", color: B.orange },
  { id: "thermal", label: "열설계", icon: "❄️", color: B.cyan },
  { id: "closed-loop", label: "폐루프", icon: "🔄", color: B.purple },
  { id: "kpi", label: "KPI", icon: "📊", color: B.orange },
  { id: "risk", label: "리스크", icon: "⚠️", color: B.red },
];

const [activeSection, setActiveSection] = useState("overview");

const font = "'Noto Sans KR', system-ui, sans-serif";
const mono = "'JetBrains Mono', 'SF Mono', monospace";

/* ─── 공통 컴포넌트 ─── */
function Card({ children, style, glow }) {
  return (
    <div style={{
      background: B.card, borderRadius: 14, border: `1px solid ${B.border}`,
      padding: 24, marginBottom: 14,
      boxShadow: glow ? `0 0 20px ${glow}08` : "none",
      ...style,
    }}>{children}</div>
  );
}

function STitle({ color, children, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1.3 }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: B.textDim, marginTop: 6, lineHeight: 1.6 }}>{sub}</div>}
    </div>
  );
}

function Badge({ color, children }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, color,
      background: `${color}12`, border: `1px solid ${color}20`,
      borderRadius: 4, padding: "2px 7px", letterSpacing: 0.5,
    }}>{children}</span>
  );
}

function Spec({ label, value, color, unit }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 20, fontWeight: 900, color: color || B.accent, fontFamily: mono }}>{value}</div>
      {unit && <div style={{ fontSize: 10, color: color || B.accent, fontWeight: 600 }}>{unit}</div>}
      <div style={{ fontSize: 10, color: B.textMuted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function DataRow({ cells, header, color }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: cells.map(c => c.w || "1fr").join(" "),
      gap: 1, marginBottom: 1,
    }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          padding: "8px 10px", fontSize: header ? 10 : 11,
          fontWeight: header ? 800 : 400,
          color: header ? (color || B.accent) : (c.highlight ? c.highlight : B.textDim),
          background: header ? `${color || B.accent}08` : B.bg,
          fontFamily: c.mono ? mono : "inherit",
          letterSpacing: header ? 1 : 0,
          lineHeight: 1.5,
        }}>{c.text || c}</div>
      ))}
    </div>
  );
}

/* ═══ 개요 섹션 ═══ */
function OverviewSection() {
  return (
    <div>
      <Card>
        <STitle color={B.accent}>BQB 고급 가이드</STitle>
        <p style={{ fontSize: 13, color: B.textDim, lineHeight: 1.9, margin: 0 }}>
          본 가이드는 BQB 플랫폼의 <span style={{ color: B.accent, fontWeight: 700 }}>설계 결정 근거와 정량적 스펙</span>을
          엔지니어링 레퍼런스 수준으로 정리한 문서입니다.
        </p>
        <p style={{ fontSize: 13, color: B.textDim, lineHeight: 1.9, margin: "12px 0 0" }}>
          <span style={{ color: B.orange, fontWeight: 700 }}>대상 독자:</span> 반도체 공정/회로 설계 경험이 있고,
          TCAD 시뮬레이션·PDK 설계 규칙·크라이오 패키징·RF 회로에 대한 배경지식을 보유한 엔지니어·연구자.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
          {[
            { label: "22nm FD-SOI", c: B.cyan },
            { label: "28Si / 31P Donor", c: B.purple },
            { label: "TRL 3→5", c: B.green },
            { label: "5개년 KPI", c: B.orange },
          ].map((b, i) => <Badge key={i} color={b.c}>{b.label}</Badge>)}
        </div>
      </Card>

      <Card>
        <STitle color={B.textDim} sub="각 섹션을 클릭하여 상세 내용을 확인하세요">목차</STitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {sections.filter(s => s.id !== "overview").map((s, i) => (
            <div key={s.id} onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                background: B.bg, border: `1px solid ${B.border}`,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}30`; e.currentTarget.style.background = `${s.color}06`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.background = B.bg; }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</div>
              </div>
              <span style={{ fontSize: 11, color: B.textMuted }}>→</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══ 1. 오차 예산 분해 ═══ */
function ErrorBudgetSection() {
  const [showDetail, setShowDetail] = useState(null);

  const stages = [
    { key: "phys", label: "N_phys", sub: "물리적 배열", color: B.cyan,
      loss: "위치 오차, 비활성 사이트, 채널링 tail",
      solution: "BQB 템플릿 self-alignment으로 억제",
      detail: "FIB 단일 이온 주입 시 BQB-B 매립 장벽이 3D 좌표를 정의. 채널링 tail은 장벽 두께/에너지로 제어." },
    { key: "op", label: "N_op", sub: "운용 가능", color: B.green,
      loss: "outlier, 전하 불안정, T2 미달",
      solution: "Triple-Wall QBQ + 폐루프 보정으로 억제",
      detail: "Wall-1(STI moat) + Wall-2(T3 실드웰) + Wall-3(BQB-B)의 3중 격리로 전하잡음 및 크로스토크 감소." },
    { key: "link", label: "N_link", sub: "얽힘 연결", color: B.accent,
      loss: "제어 비동기, 커플링 불균일",
      solution: "77K DD-IC 동기 펄스 + 스큐 보정으로 억제",
      detail: "온칩 TDC로 스큐 측정 → Delay-trim 보정. Broadcast+선택 구동으로 O(√N) 스케일링 달성." },
  ];

  const kpiData = [
    { label: "배열 규모", vals: ["단일~소수", "2×2", "4×4", "8×8", "16×16"] },
    { label: "overlay (nm)", vals: ["≤50", "≤35", "≤25", "≤20", "≤15"], highlight: true },
    { label: "outlier (%)", vals: ["기준정의", "≤5", "≤3", "≤2", "≤1"], highlight: true },
    { label: "F1q", vals: ["기준확립", "≥0.99", "0.95~0.99", "≥0.99", "≥0.999"] },
    { label: "F2q", vals: ["기준확립", "≥0.90", "≥0.95", "≥0.98", "≥0.99"] },
    { label: "얽힘 링크 (쌍)", vals: ["0", "≥1", "≥4", "≥8", "≥16"] },
    { label: "사이트 수율", vals: ["—", "분리보고", "≥95%", "≥97%", "≥99%"] },
    { label: "T2 (CPMG)", vals: ["기준선", "개선", "개선", "개선", "≥1 s"] },
    { label: "ΔR/R", vals: ["≤10%", "≤7%", "≤5%", "≤3%", "≤2%"] },
  ];

  return (
    <div>
      <Card glow={B.accent}>
        <STitle color={B.accent} sub="대규모 배열 확장의 실질적 병목: 물리적 사이트 → 운용 → 얽힘 전환율">
          전환 구조: N_phys → N_op → N_link
        </STitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {stages.map((s, i) => (
            <div key={s.key}>
              <div
                onClick={() => setShowDetail(showDetail === s.key ? null : s.key)}
                style={{
                  background: showDetail === s.key ? `${s.color}08` : B.bg,
                  border: `1px solid ${showDetail === s.key ? `${s.color}25` : B.border}`,
                  borderRadius: 12, padding: "16px 18px", cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: `${s.color}10`, border: `1px solid ${s.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 900, color: s.color, fontFamily: mono,
                  }}>{s.label.split("_")[1]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: s.color, fontFamily: mono }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: B.textMuted }}>{s.sub}</div>
                  </div>
                  <span style={{ fontSize: 11, color: B.textMuted, transition: "transform 0.2s", transform: showDetail === s.key ? "rotate(180deg)" : "none" }}>▾</span>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12, marginLeft: 52 }}>
                  <div style={{ flex: 1, fontSize: 11, color: B.textDim, lineHeight: 1.6 }}>
                    <div style={{ color: B.red, fontWeight: 700, fontSize: 9, marginBottom: 3, letterSpacing: 1 }}>LOSS</div>
                    {s.loss}
                  </div>
                  <div style={{ width: 1, background: B.border }} />
                  <div style={{ flex: 1, fontSize: 11, color: B.textDim, lineHeight: 1.6 }}>
                    <div style={{ color: B.green, fontWeight: 700, fontSize: 9, marginBottom: 3, letterSpacing: 1 }}>SOLUTION</div>
                    {s.solution}
                  </div>
                </div>

                {showDetail === s.key && (
                  <div style={{
                    marginTop: 12, marginLeft: 52, padding: "10px 14px",
                    background: `${s.color}06`, borderRadius: 8, border: `1px solid ${s.color}12`,
                    fontSize: 11, color: B.textDim, lineHeight: 1.7,
                  }}>
                    💡 {s.detail}
                  </div>
                )}
              </div>
              {i < stages.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                  <div style={{ width: 2, height: 20, background: `linear-gradient(${stages[i].color}30, ${stages[i+1].color}30)` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <STitle color={B.accent} sub="5개년 연차별 핵심 수치 목표">KPI 매트릭스</STitle>
        <div style={{ overflowX: "auto", borderRadius: 8, border: `1px solid ${B.border}` }}>
          <DataRow header color={B.accent} cells={[
            { text: "지표", w: "120px" },
            { text: "1차" }, { text: "2차" }, { text: "3차" }, { text: "4차" }, { text: "5차" },
          ]} />
          {kpiData.map((row, i) => (
            <DataRow key={i} cells={[
              { text: row.label, w: "120px" },
              ...row.vals.map((v, j) => ({
                text: v, mono: true,
                highlight: row.highlight && j === 4 ? B.green : undefined,
              })),
            ]} />
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══ 2. Triple-Wall QBQ 설계 규칙 ═══ */
function TripleWallSection() {
  const [activeWall, setActiveWall] = useState(1);

  const walls = [
    {
      num: 1, name: "외곽 격리벽", color: B.cyan,
      pdk: "STI 기반 isolation moat(타일 경계) 및 keep-out 구조",
      knobs: "moat 폭/간격, 타일 pitch, 금속/비아 keep-out",
      kpi: "타일 간 기판 커플링/크로스토크 감소, overlay 기준 경계 확보",
    },
    {
      num: 2, name: "전기적 실드웰", color: B.green,
      pdk: "T3(True Triple Well) isolation으로 back-gate/웰 도메인 분리 + quiet guard ring + 전용 리턴/실드",
      knobs: "V_BG_i(타일 back-gate), V_well_shield, guard ring bias(V_SSQ), 라인 RC 필터/차폐",
      kpi: "|∇E| 및 1/f 전하잡음 민감도 저감, detune/tune-in 안정, 77K DD-IC 근접 노이즈 내성 향상",
    },
    {
      num: 3, name: "BQB-B 매립 장벽", color: B.purple,
      pdk: "BQB-B(매립 장벽/템플릿 층)로 확산 차단 및 깊이 창 정의, implant window self-alignment",
      knobs: "장벽 깊이/두께, 개구 CD/형상, 저열예산 활성화 파형",
      kpi: "채널링 tail/outlier 억제, σ_xy/σ_z 공정창 확대, BEOL/금속 열예산 안전성 강화",
    },
  ];

  const w = walls[activeWall - 1];

  return (
    <div>
      <Card glow={B.green}>
        <STitle color={B.green} sub="STI moat + T3 실드웰 + BQB-B 매립 장벽의 3중 격리">
          Triple-Wall QBQ 구조
        </STitle>

        {/* Wall diagram */}
        <div style={{ position: "relative", height: 140, background: B.bg, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden", marginBottom: 16 }}>
          {/* Wall-1: outermost */}
          <div style={{
            position: "absolute", inset: "10px 12px",
            border: `2px solid ${B.cyan}${activeWall===1?"60":"20"}`,
            borderRadius: 12, transition: "all 0.3s",
            boxShadow: activeWall===1 ? `0 0 16px ${B.cyan}15` : "none",
          }}>
            <div style={{ position: "absolute", top: 4, left: 8, fontSize: 9, color: B.cyan, fontWeight: 700, fontFamily: mono }}>W1: STI Moat</div>
          </div>
          {/* Wall-2: middle */}
          <div style={{
            position: "absolute", inset: "28px 32px",
            border: `2px solid ${B.green}${activeWall===2?"60":"20"}`,
            borderRadius: 10, transition: "all 0.3s",
            boxShadow: activeWall===2 ? `0 0 16px ${B.green}15` : "none",
          }}>
            <div style={{ position: "absolute", top: 4, left: 8, fontSize: 9, color: B.green, fontWeight: 700, fontFamily: mono }}>W2: T3 Shield</div>
          </div>
          {/* Wall-3: innermost */}
          <div style={{
            position: "absolute", inset: "46px 52px",
            border: `2px solid ${B.purple}${activeWall===3?"60":"20"}`,
            borderRadius: 8, transition: "all 0.3s",
            background: `${B.purple}${activeWall===3?"08":"03"}`,
            boxShadow: activeWall===3 ? `0 0 16px ${B.purple}15` : "none",
          }}>
            <div style={{ position: "absolute", top: 4, left: 8, fontSize: 9, color: B.purple, fontWeight: 700, fontFamily: mono }}>W3: BQB-B</div>
          </div>
          {/* Qubit core */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: 24, height: 24, borderRadius: "50%",
            background: `radial-gradient(circle, ${B.accent}60, ${B.accent}20)`,
            boxShadow: `0 0 12px ${B.accent}40`,
          }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, calc(-50% + 18px))", fontSize: 8, fontWeight: 700, color: B.accent, fontFamily: mono }}>QUBIT</div>
        </div>

        {/* Wall selector */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {walls.map(wl => (
            <button key={wl.num} onClick={() => setActiveWall(wl.num)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, cursor: "pointer",
              background: activeWall === wl.num ? `${wl.color}10` : "transparent",
              border: `1px solid ${activeWall === wl.num ? wl.color : B.border}`,
              color: activeWall === wl.num ? wl.color : B.textMuted,
              fontSize: 11, fontWeight: 700, transition: "all 0.2s",
            }}>
              Wall-{wl.num}: {wl.name}
            </button>
          ))}
        </div>

        {/* Detail */}
        <div style={{
          background: `${w.color}04`, borderRadius: 12, border: `1px solid ${w.color}15`,
          padding: 18, transition: "all 0.3s",
        }}>
          {[
            { label: "PDK 구현", value: w.pdk, badge: "PDK" },
            { label: "설계 노브", value: w.knobs, badge: "KNOB" },
            { label: "KPI 기여", value: w.kpi, badge: "KPI" },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 14 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Badge color={w.color}>{item.badge}</Badge>
                <span style={{ fontSize: 11, fontWeight: 700, color: w.color }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 12, color: B.textDim, lineHeight: 1.7, marginLeft: 4 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <STitle color={B.green} sub="DC 바이어스, 리턴 경로, 캘리브레이션">바이어스 운용 규칙</STitle>
        {[
          { label: "V_BG_i (타일 back-gate)", rules: ["DC로 천천히 스윕/고정 (동적 스위칭 지양)", "77K 스테이지에서 RC 저역통과 필터로 노이즈 유입 차단"], color: B.cyan },
          { label: "T3 실드웰 + guard ring", rules: ["quiet reference(V_SSQ)에 연결", "DD-IC 스위칭 전류 리턴이 Q 주변으로 흐르지 않도록 격리"], color: B.green },
          { label: "타일 단위 V_BG_i 분할", rules: ["detune/tune-in 선택성 및 전하환경 트림을 공통모드화", "배열 확장 시 캘리브레이션 테이블 재사용성 향상"], color: B.purple },
        ].map((b, i) => (
          <div key={i} style={{
            background: `${b.color}04`, borderRadius: 10, border: `1px solid ${b.color}12`,
            padding: "12px 14px", marginBottom: i < 2 ? 8 : 0,
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: b.color, fontFamily: mono, marginBottom: 6 }}>{b.label}</div>
            {b.rules.map((r, j) => (
              <div key={j} style={{ display: "flex", gap: 8, marginBottom: j < b.rules.length - 1 ? 4 : 0 }}>
                <span style={{ color: b.color, fontSize: 8, marginTop: 5 }}>●</span>
                <span style={{ fontSize: 11, color: B.textDim, lineHeight: 1.6 }}>{r}</span>
              </div>
            ))}
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ═══ 3. DD-IC 회로 블록 아키텍처 ═══ */
function DDICSection() {
  const [activeBlock, setActiveBlock] = useState(null);

  const blocks = [
    { id: "pll", label: "LO-PLL", sub: "기준 클럭 25-200MHz", color: B.orange, detail: "위상잡음 ≤-100 dBc/Hz @1MHz offset. 온도 변동에 대한 주파수 안정성 확보가 핵심." },
    { id: "dco", label: "DCO", sub: "캐리어 생성", color: B.cyan, detail: "디지털 제어 발진기. I/Q 업컨버전으로 ESR 대역(28-42 GHz) 커버. DRAG/가우시안 파형 지원." },
    { id: "seq", label: "이벤트 시퀀서", sub: "루프/분기 제어", color: B.green, detail: "DD 시퀀스(CPMG/XY) 패턴을 메모리에서 읽어 라이브러리 실행. 조건부 분기 가능." },
    { id: "tdc", label: "온칩 TDC", sub: "스큐 측정/보정", color: B.purple, detail: "채널 간 스큐를 피코초 정밀도로 측정하고 Delay-trim으로 실시간 보정." },
    { id: "broadcast", label: "Broadcast+선택", sub: "O(√N) 스케일링", color: B.accent, detail: "공유 펄스 버스로 전체 배열에 DD 시퀀스 동시 분배. BQB의 detune/tune-in으로 선택적 구동." },
  ];

  const specData = [
    { label: "채널 수", vals: ["≤32", "≥64", "≥128", "256-class", "256-class"] },
    { label: "스큐 (RMS)", vals: ["≤50ps", "≤20ps", "≤10ps", "≤5ps", "≤5ps"] },
    { label: "전력", vals: ["—", "—", "—", "≤5mW/ch", "≤0.8W/chip"] },
  ];

  return (
    <div>
      <Card glow={B.orange}>
        <STitle color={B.orange} sub="22nm FD-SOI 기반 77K DD Pulse Generator IC">
          회로 블록 아키텍처
        </STitle>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
          {blocks.map(b => (
            <div key={b.id}
              onClick={() => setActiveBlock(activeBlock === b.id ? null : b.id)}
              style={{
                background: activeBlock === b.id ? `${b.color}08` : B.bg,
                border: `1px solid ${activeBlock === b.id ? `${b.color}25` : B.border}`,
                borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: b.color, boxShadow: `0 0 6px ${b.color}50`,
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: b.color, fontFamily: mono }}>{b.label}</span>
                  <span style={{ fontSize: 11, color: B.textMuted, marginLeft: 8 }}>{b.sub}</span>
                </div>
                <span style={{ fontSize: 10, color: B.textMuted, transition: "transform 0.2s", transform: activeBlock === b.id ? "rotate(180deg)" : "none" }}>▾</span>
              </div>
              {activeBlock === b.id && (
                <div style={{ marginTop: 10, marginLeft: 18, fontSize: 12, color: B.textDim, lineHeight: 1.7, padding: "8px 12px", background: `${b.color}06`, borderRadius: 8 }}>
                  {b.detail}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <STitle color={B.orange} sub="연차별 채널·스큐·전력 목표">DD-IC 핵심 스펙</STitle>
        <div style={{ borderRadius: 8, border: `1px solid ${B.border}`, overflow: "hidden" }}>
          <DataRow header color={B.orange} cells={[
            { text: "스펙", w: "100px" },
            { text: "1차" }, { text: "2차" }, { text: "3차" }, { text: "4차" }, { text: "5차" },
          ]} />
          {specData.map((row, i) => (
            <DataRow key={i} cells={[
              { text: row.label, w: "100px" },
              ...row.vals.map(v => ({ text: v, mono: true })),
            ]} />
          ))}
        </div>
      </Card>

      <Card>
        <STitle color={B.orange}>제어 파형 스펙</STitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[
            { label: "ESR 대역", value: "28–42 GHz", color: B.orange },
            { label: "NMR 대역", value: "35–84 MHz", color: B.cyan },
            { label: "FDM 간격", value: "≥5 MHz", color: B.green },
            { label: "TDM 스위칭", value: "≤1 μs", color: B.purple },
            { label: "채널 격리도", value: "≥40 dB", color: B.accent },
            { label: "파형", value: "DRAG/가우시안", color: B.textDim },
          ].map((s, i) => (
            <div key={i} style={{ background: B.bg, borderRadius: 8, border: `1px solid ${B.border}`, padding: "10px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: s.color, fontFamily: mono }}>{s.value}</div>
              <div style={{ fontSize: 9, color: B.textMuted, marginTop: 4, fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══ 4. Split-Stage 패키징 열설계 ═══ */
function ThermalSection() {
  return (
    <div>
      <Card glow={B.cyan}>
        <STitle color={B.cyan} sub="1st Stage(50-80K) ↔ 2nd Stage(4K) 열적 분리">
          2-Deck Split-Jig 구조
        </STitle>

        {/* 77K Deck */}
        <div style={{
          background: `${B.orange}06`, borderRadius: 12, border: `1px solid ${B.orange}20`,
          padding: 16, marginBottom: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Badge color={B.orange}>77K DECK</Badge>
            <span style={{ fontSize: 11, fontWeight: 700, color: B.orange }}>1st Stage (50-80K)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11, color: B.textDim, lineHeight: 1.6 }}>
            <div>⚡ DD-IC Module</div>
            <div>🌡️ 온도센서 + 히터</div>
            <div>📐 Heat Spreader</div>
            <div>⚡ ≤ 0.8W/chip</div>
          </div>
        </div>

        {/* Connector */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "6px 0" }}>
          <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, transparent, ${B.textMuted}30, transparent)` }} />
          <div style={{ fontSize: 9, color: B.textMuted, fontFamily: mono, textAlign: "center", lineHeight: 1.4 }}>
            Cryo-Flex Cable<br/>G10 Frame (≤0.3 W/m·K)
          </div>
          <div style={{ height: 2, flex: 1, background: `linear-gradient(90deg, transparent, ${B.textMuted}30, transparent)` }} />
        </div>

        {/* 4K Deck */}
        <div style={{
          background: `${B.cyan}06`, borderRadius: 12, border: `1px solid ${B.cyan}20`,
          padding: 16, marginTop: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Badge color={B.cyan}>4K DECK</Badge>
            <span style={{ fontSize: 11, fontWeight: 700, color: B.cyan }}>2nd Stage (4K)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11, color: B.textDim, lineHeight: 1.6 }}>
            <div>⚛️ QPU Module</div>
            <div>🌡️ PID 히터 (mK 제어)</div>
            <div>📐 OFHC Cu Base</div>
            <div>📡 NbTi 동축 케이블</div>
          </div>
        </div>

        <div style={{
          marginTop: 16, padding: "12px 14px",
          background: `${B.accent}06`, borderRadius: 10, border: `1px solid ${B.accent}12`,
          fontSize: 12, color: B.textDim, lineHeight: 1.7,
        }}>
          💡 <strong style={{ color: B.accent }}>핵심:</strong> Broadcast+선택 구동으로 라인 수 O(√N) → 케이블 전도열↓ → 4K 유지 용이
        </div>
      </Card>

      <Card>
        <STitle color={B.cyan} sub="300K → 4K 전체 경로">신호 무결성(SI) 스펙</STitle>
        <div style={{ borderRadius: 8, border: `1px solid ${B.border}`, overflow: "hidden" }}>
          <DataRow header color={B.cyan} cells={[
            { text: "SI 항목", w: "130px" }, { text: "3차" }, { text: "4차" }, { text: "5차" },
          ]} />
          {[
            { label: "S11 (반사손실)", vals: ["체계 구축", "≤-20dB @1GHz", "규격 동결"] },
            { label: "크로스토크", vals: ["—", "≤-30dB @1GHz", "규격 동결"] },
            { label: "임피던스", vals: ["50Ω ±10%", "검증", "300K→4K 안정"] },
            { label: "열사이클", vals: ["—", "—", "≥10회 합격"] },
          ].map((row, i) => (
            <DataRow key={i} cells={[
              { text: row.label, w: "130px" },
              ...row.vals.map(v => ({ text: v, mono: true })),
            ]} />
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══ 5. 폐루프 수렴 ═══ */
function ClosedLoopSection() {
  return (
    <div>
      <Card glow={B.purple}>
        <STitle color={B.purple} sub="사이트 수율의 거듭제곱이 배열 수율을 결정한다">
          수율 거듭제곱 관계
        </STitle>

        <div style={{ textAlign: "center", padding: "8px 0 16px", fontFamily: "serif", fontSize: 18, color: B.text, letterSpacing: 2 }}>
          Y<sub>array</sub> = p<sub>site</sub><sup style={{ color: B.red }}>N</sup>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {[
            { p: "0.990", y: "7.6%", bar: 7.6, c: B.red },
            { p: "0.995", y: "27.7%", bar: 27.7, c: B.orange },
            { p: "0.999", y: "77.4%", bar: 77.4, c: B.green },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 65, fontSize: 11, fontWeight: 700, color: B.textDim, textAlign: "right", fontFamily: mono }}>p={r.p}</div>
              <div style={{ flex: 1, height: 18, background: B.bg, borderRadius: 4, overflow: "hidden", border: `1px solid ${B.border}` }}>
                <div style={{ width: `${r.bar}%`, height: "100%", background: `${r.c}35`, borderRadius: 3 }} />
              </div>
              <div style={{ width: 50, fontSize: 12, fontWeight: 800, color: r.c, fontFamily: mono }}>{r.y}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: B.textMuted, textAlign: "center" }}>N = 256 (16×16 배열) 기준 · die-map 재매핑으로 실효 수율 추가 상승 가능</div>
      </Card>

      <Card>
        <STitle color={B.purple} sub="3단계 반복으로 수율 수렴">Generate → Verify → Correct</STitle>
        {[
          { step: "Generate", icon: "⚛️", desc: "BQB 템플릿 기반 3D 좌표에 큐비트 생성", tools: "FIB 단일 이온 주입, 저열예산 활성화, ALD/수소 패시베이션", color: B.cyan },
          { step: "Verify", icon: "🔬", desc: "3D 단층촬영 + 전기/광학 맵으로 검증", tools: "nano-CT, XRD-CT, SIMS/TEM, 77K-4K 전기 맵", color: B.green },
          { step: "Correct", icon: "🔧", desc: "공정 레시피 및 DD-IC 캘리브레이션 보정", tools: "보정 테이블 갱신, split-lot 최적화, die-map 재매핑", color: B.orange },
        ].map((s, i) => (
          <div key={i}>
            <div style={{
              background: `${s.color}04`, borderRadius: 10, border: `1px solid ${s.color}12`,
              padding: "14px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: s.color, fontFamily: mono }}>{s.step}</div>
                  <div style={{ fontSize: 11, color: B.textDim }}>{s.desc}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: B.textMuted, marginLeft: 28, lineHeight: 1.6, fontStyle: "italic" }}>{s.tools}</div>
            </div>
            {i < 2 && (
              <div style={{ display: "flex", justifyContent: "center", padding: "3px 0" }}>
                <span style={{ fontSize: 12, color: B.textMuted }}>↓</span>
              </div>
            )}
          </div>
        ))}
        <div style={{
          display: "flex", justifyContent: "center", marginTop: 12,
          padding: "8px 0", borderTop: `1px dashed ${B.purple}20`,
        }}>
          <span style={{ fontSize: 10, color: B.purple, fontWeight: 700, letterSpacing: 2 }}>↻ LOOP UNTIL CONVERGE</span>
        </div>
      </Card>

      <Card>
        <STitle color={B.purple}>후공정 Q 형성 플로우</STitle>
        {[
          "파운더리 산출물: BQB-B + 제어 게이트/센서 + DD-IC 동시 제작",
          "후공정 마스크: BQB implant window/접근창 (EBL/DUV)",
          "단일 이온/결함 생성: FIB direct-write counted implantation",
          "저열예산 활성화: ms급 플래시/레이저/스파이크 어닐 (BEOL 이하)",
          "패시베이션/캘리브레이션: ALD/수소 처리 → 저온 bring-up → die-map",
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              background: `${B.purple}10`, border: `1px solid ${B.purple}20`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 900, color: B.purple, fontFamily: mono,
            }}>{i + 1}</div>
            <div style={{ fontSize: 11, color: B.textDim, lineHeight: 1.6, paddingTop: 3 }}>{step}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ═══ 6. 연차별 KPI ═══ */
function KPISection() {
  const [activeYear, setActiveYear] = useState(4);

  const years = [
    { yr: 1, trl: "3→3+", period: "'26.04~'26.12", title: "플랫폼 확정 · 기준선 확보", color: B.textDim,
      items: ["BQB 3D 위치: ≤20nm (v0.5)", "Q 후공정(FIB): ≤50nm (1σ), 활성≥32", "저열예산: ΔR/R≤10%", "DD-IC: spec v0.1, 채널≤32, 스큐≤50ps"] },
    { yr: 2, trl: "3+→4", period: "'27.01~'27.12", title: "자가정렬 정밀화 · 동일성 저감", color: B.cyan,
      items: ["BQB 3D 위치: ≤10nm (2σ)", "Q 후공정: ≤35nm (1σ), 활성≥64, outlier≤5%", "저열예산: ΔR/R≤7%, 누설≤1.5×", "DD-IC: MPW 테이프아웃, 채널≥64"] },
    { yr: 3, trl: "4", period: "'28.01~'28.12", title: "2-qubit 연결 · 패키징 PoC", color: B.green,
      items: ["패키징/정렬: ≤100nm (PoC)", "Q 후공정: ≤25nm (1σ), 활성≥128, outlier≤3%", "저열예산: ΔR/R≤5%, 77K 1h 안정", "DD-IC: bring-up, 채널≥128, 스큐≤10ps"] },
    { yr: 4, trl: "4→5-", period: "'29.01~'29.12", title: "256-class 확장 · 3D 패키징", color: B.orange,
      items: ["패키징/정렬: ≤50nm", "Q 후공정: ≤20nm (1σ), 활성≥256, outlier≤2%", "저열예산: ΔR/R≤3%, 열사이클 10회", "DD-IC: broadcast+선택, 256-class, 스큐≤5ps"] },
    { yr: 5, trl: "5", period: "'30.01~'30.12", title: "TRL5 통합 시연 · 규격 동결", color: B.accent,
      items: ["배열: 16×16 (256) / 도전: 32×32 (1024)", "outlier ≤1%, 사이트수율 ≥99%, 어레이수율 ≥70%", "F1q ≥0.999, F2q ≥0.99, T2 ≥1s", "DD-IC: 256-class, 24h 자동 캘리브레이션"] },
  ];

  const y = years[activeYear - 1];

  return (
    <div>
      <Card glow={B.orange}>
        <STitle color={B.orange} sub="31P 도너 기본형 마일스톤">5개년 KPI 진화</STitle>

        {/* Year selector */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {years.map(yr => (
            <button key={yr.yr} onClick={() => setActiveYear(yr.yr)} style={{
              flex: 1, padding: "10px 4px", borderRadius: 8, cursor: "pointer",
              background: activeYear === yr.yr ? `${yr.color}12` : B.bg,
              border: `1px solid ${activeYear === yr.yr ? yr.color : B.border}`,
              color: activeYear === yr.yr ? yr.color : B.textMuted,
              fontSize: 12, fontWeight: 800, fontFamily: mono,
              transition: "all 0.2s",
            }}>
              {yr.yr}차
            </button>
          ))}
        </div>

        {/* Active year detail */}
        <div style={{
          background: `${y.color}06`, borderRadius: 12, border: `1px solid ${y.color}18`,
          padding: 18,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Badge color={y.color}>TRL {y.trl}</Badge>
            <span style={{ fontSize: 10, color: B.textMuted, fontFamily: mono }}>{y.period}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: y.color, marginBottom: 14 }}>{y.title}</div>
          {y.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < y.items.length - 1 ? 8 : 0 }}>
              <span style={{ color: y.color, fontSize: 7, marginTop: 6 }}>◆</span>
              <span style={{ fontSize: 12, color: B.textDim, lineHeight: 1.6, fontFamily: mono }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Timeline bar */}
        <div style={{ display: "flex", gap: 2, marginTop: 16 }}>
          {years.map((yr, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i < activeYear ? yr.color : `${B.textMuted}20`,
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══ 7. 위험관리 ═══ */
function RiskSection() {
  const [expandedRisk, setExpandedRisk] = useState(null);

  const risks = [
    { id: 0, title: "위치 정밀도 미달", severity: "HIGH", color: B.red,
      response: "BQB 구조/열처리 창 재설계 + 다중 계측 교차검증으로 원인 분해" },
    { id: 1, title: "동일성/스펙트럴 안정성 부족", severity: "HIGH", color: B.red,
      response: "전하트랩 저감(계면/패시베이션) 및 응력 관리 공정 도입" },
    { id: 2, title: "T3 + Triple-Wall 셀 리스크", severity: "MED", color: B.orange,
      response: "test vehicle A/B 비교(단일벽 vs Triple Wall)로 Dit/잡음/드리프트 정량화, 공정창 항목으로 포함해 조기 수렴" },
    { id: 3, title: "패키징 정렬 오차", severity: "MED", color: B.orange,
      response: "얼라인 마크/공정 보정 루프 + X-ray 기반 정렬 피드백" },
    { id: 4, title: "웨이퍼 본딩/적층 리스크", severity: "MED", color: B.orange,
      response: "본딩 test vehicle 기반 공정창 설정, IR/X-ray/초음파 검사, 300K-77K 열사이클 신뢰성 평가" },
    { id: 5, title: "77K DD-IC 성능/안정성", severity: "MED", color: B.orange,
      response: "PVT/온도 sweep 성적서 및 자동 보정 로그로 관리" },
    { id: 6, title: "얽힘/연결 데모 지연", severity: "LOW", color: B.yellow,
      response: "커플링 메커니즘(전기/광/공진기) 다중 옵션 병렬 추진" },
    { id: 7, title: "예산/일정 변동", severity: "LOW", color: B.yellow,
      response: "연차별 필수 산출물 최소 세트 정의 및 단계 게이팅(Gate) 운영" },
  ];

  return (
    <div>
      <Card glow={B.red}>
        <STitle color={B.red} sub="8대 기술 리스크 + 조기 검증 전략">위험관리 및 대응전략</STitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {risks.map(r => (
            <div key={r.id}
              onClick={() => setExpandedRisk(expandedRisk === r.id ? null : r.id)}
              style={{
                background: expandedRisk === r.id ? `${r.color}06` : B.bg,
                border: `1px solid ${expandedRisk === r.id ? `${r.color}20` : B.border}`,
                borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Badge color={r.color}>{r.severity}</Badge>
                <span style={{ fontSize: 12, fontWeight: 700, color: B.text, flex: 1 }}>{r.title}</span>
                <span style={{ fontSize: 10, color: B.textMuted, transition: "transform 0.2s", transform: expandedRisk === r.id ? "rotate(180deg)" : "none" }}>▾</span>
              </div>
              {expandedRisk === r.id && (
                <div style={{
                  marginTop: 10, padding: "10px 12px",
                  background: `${B.green}06`, borderRadius: 8, border: `1px solid ${B.green}12`,
                  fontSize: 12, color: B.textDim, lineHeight: 1.7,
                }}>
                  <span style={{ color: B.green, fontWeight: 700 }}>대응:</span> {r.response}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ═══ 메인 렌더 ═══ */
const currentSection = sections.find(s => s.id === activeSection) || sections[0];

const renderSection = () => {
  switch (activeSection) {
    case "overview": return <OverviewSection />;
    case "error-budget": return <ErrorBudgetSection />;
    case "triple-wall": return <TripleWallSection />;
    case "dd-ic": return <DDICSection />;
    case "thermal": return <ThermalSection />;
    case "closed-loop": return <ClosedLoopSection />;
    case "kpi": return <KPISection />;
    case "risk": return <RiskSection />;
    default: return <OverviewSection />;
  }
};

return (
  <div style={{ minHeight: "100vh", background: B.bg, fontFamily: font, color: B.text }}>
    {/* Background */}
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${B.accent}04 1px, transparent 1px), linear-gradient(90deg, ${B.accent}04 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />
      <div style={{ position: "absolute", top: -200, left: "30%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${B.accent}04, transparent 70%)`, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", bottom: -200, right: "20%", width: 400, height: 400, borderRadius: "50%", background: `radial-gradient(circle, ${B.green}03, transparent 70%)`, filter: "blur(40px)" }} />
    </div>

    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Header */}
      <div style={{ padding: "24px 16px 0", borderBottom: `1px solid ${B.border}` }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: B.accent, letterSpacing: 4, marginBottom: 6 }}>ENGINEERING REFERENCE</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: B.text, marginBottom: 12 }}>BQB 고급 가이드</div>

          {/* Section tabs */}
          <div style={{ display: "flex", gap: 2, overflowX: "auto", paddingBottom: 0 }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                style={{
                  padding: "8px 12px", cursor: "pointer", whiteSpace: "nowrap",
                  background: "transparent",
                  border: "none",
                  borderBottom: `2px solid ${activeSection === s.id ? s.color : "transparent"}`,
                  color: activeSection === s.id ? s.color : B.textMuted,
                  fontSize: 11, fontWeight: activeSection === s.id ? 800 : 500,
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                <span style={{ fontSize: 12 }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px 80px" }}>
        {renderSection()}
      </div>
    </div>
  </div>
);

}

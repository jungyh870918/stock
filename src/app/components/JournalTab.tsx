"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme, THEME, type Lang } from "@/app/context/ThemeContext";

function useC() {
  const { theme, lang } = useTheme();
  return { c: THEME[theme], theme, lang };
}

/* ── 타입 ── */
interface JournalEntry {
  id: string;
  date: string;
  symbol: string;
  price: number;
  qty: number;
  type: "buy" | "sell";
  thesis: string;
  tags: string[];
  createdAt: number;
}

/* ── i18n ── */
type T2 = { ko: string; en: string };
const L = (obj: T2, lang: Lang) => obj[lang];

const I18N = {
  title:        { ko: "투자 일지",            en: "Investment Journal" },
  desc:         { ko: "매수·매도 기록을 남기고, 투자 논리를 되짚어보세요", en: "Log your trades and revisit your investment thesis" },
  newEntry:     { ko: "새 기록 추가",          en: "New Entry" },
  close:        { ko: "닫기",                  en: "Close" },
  save:         { ko: "저장",                  en: "Save" },
  date:         { ko: "날짜",                  en: "Date" },
  symbol:       { ko: "종목 코드",             en: "Ticker" },
  price:        { ko: "가격 (USD)",            en: "Price (USD)" },
  qty:          { ko: "수량",                  en: "Quantity" },
  type:         { ko: "유형",                  en: "Type" },
  buy:          { ko: "매수",                  en: "Buy" },
  sell:         { ko: "매도",                  en: "Sell" },
  thesis:       { ko: "투자 논리",             en: "Investment Thesis" },
  thesisHint:   { ko: "왜 지금 이 종목인가? 어떤 논리로 판단했는가?", en: "Why this stock now? What's your reasoning?" },
  tags:         { ko: "태그 (쉼표로 구분)",    en: "Tags (comma separated)" },
  tagsHint:     { ko: "예: AI, 저점매수, 계층형", en: "e.g. AI, dip-buy, layered" },
  noEntries:    { ko: "아직 기록이 없습니다",   en: "No entries yet" },
  noEntriesDesc:{ ko: "첫 투자 기록을 남겨보세요", en: "Add your first trade entry" },
  delete:       { ko: "삭제",                  en: "Delete" },
  edit:         { ko: "수정",                  en: "Edit" },
  totalEntries: { ko: "건",                    en: "entries" },
  filterAll:    { ko: "전체",                  en: "All" },
  filterBuy:    { ko: "매수",                  en: "Buy" },
  filterSell:   { ko: "매도",                  en: "Sell" },
  sort:         { ko: "최신순",                en: "Newest" },
  totalCost:    { ko: "총 투자금",             en: "Total invested" },
  avgPrice:     { ko: "평균 단가",             en: "Avg price" },
  shares:       { ko: "주",                    en: "shares" },
  searchHint:   { ko: "종목 또는 태그 검색…",  en: "Search symbol or tag…" },
  required:     { ko: "필수 항목을 입력해주세요", en: "Please fill in required fields" },
  confirmDel:   { ko: "이 기록을 삭제할까요?",  en: "Delete this entry?" },
  update:       { ko: "수정 완료",             en: "Update" },
};

const EMPTY: Omit<JournalEntry, "id" | "createdAt"> = {
  date: new Date().toISOString().slice(0, 10),
  symbol: "",
  price: 0,
  qty: 0,
  type: "buy",
  thesis: "",
  tags: [],
};

/* ── 유틸 ── */
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtDate(d: string, lang: Lang) {
  const dt = new Date(d + "T00:00:00");
  return lang === "ko"
    ? `${dt.getFullYear()}. ${dt.getMonth() + 1}. ${dt.getDate()}.`
    : dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ── 통계 계산 ── */
function calcStats(entries: JournalEntry[], symbol?: string) {
  const list = symbol ? entries.filter(e => e.symbol === symbol) : entries;
  const buys = list.filter(e => e.type === "buy");
  const totalQty   = buys.reduce((s, e) => s + e.qty, 0);
  const totalCost  = buys.reduce((s, e) => s + e.price * e.qty, 0);
  const avgPrice   = totalQty > 0 ? totalCost / totalQty : 0;
  return { totalQty, totalCost, avgPrice };
}

/* ── 폼 모달 ── */
function EntryForm({ initial, onSave, onClose, lang }: {
  initial: Partial<JournalEntry>;
  onSave: (e: Omit<JournalEntry, "id" | "createdAt">) => void;
  onClose: () => void;
  lang: Lang;
}) {
  const { c } = useC();
  const [form, setForm] = useState({
    date:   initial.date   ?? EMPTY.date,
    symbol: initial.symbol ?? "",
    price:  initial.price  ?? 0,
    qty:    initial.qty    ?? 0,
    type:   (initial.type  ?? "buy") as "buy" | "sell",
    thesis: initial.thesis ?? "",
    tags:   (initial.tags  ?? []).join(", "),
  });
  const [error, setError] = useState(false);
  const inp = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));
  const isEdit = !!initial.id;

  const submit = () => {
    if (!form.symbol.trim() || form.price <= 0 || form.qty <= 0) { setError(true); return; }
    onSave({ date: form.date, symbol: form.symbol.toUpperCase().trim(), price: Number(form.price), qty: Number(form.qty), type: form.type, thesis: form.thesis.trim(), tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) });
  };

  const field = (label: string, children: React.ReactNode) => (
    <div style={{ marginBottom: "14px" }}>
      <p style={{ fontSize: "12px", fontWeight: 500, color: c.textFaint, marginBottom: "6px", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{label}</p>
      {children}
    </div>
  );

  const inputSt: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", background: c.panel2,
    border: `1px solid ${error && !form.symbol ? c.red : c.line}`,
    borderRadius: "8px", padding: "9px 12px", fontSize: "13px",
    color: c.text, fontFamily: "inherit", outline: "none",
  };

  return (
    <div style={{ position: "fixed" as const, inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: c.panel, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: "560px", maxHeight: "92vh", overflowY: "auto" as const, padding: "24px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <p style={{ fontSize: "16px", fontWeight: 700, color: c.accentText, margin: 0 }}>{isEdit ? L(I18N.edit, lang) : L(I18N.newEntry, lang)}</p>
          <button onClick={onClose} style={{ background: "none", border: "none", color: c.textDim, cursor: "pointer", fontSize: "20px", padding: "0 4px" }}>×</button>
        </div>

        {error && <p style={{ fontSize: "12px", color: c.red, marginBottom: "12px" }}>{L(I18N.required, lang)}</p>}

        {/* 유형 토글 */}
        {field(L(I18N.type, lang),
          <div style={{ display: "flex", gap: "8px" }}>
            {(["buy", "sell"] as const).map(t => (
              <button key={t} onClick={() => inp("type", t)} style={{
                flex: 1, padding: "9px", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
                background: form.type === t ? (t === "buy" ? c.green + "22" : c.red + "22") : c.panel2,
                border: `1.5px solid ${form.type === t ? (t === "buy" ? c.green : c.red) : c.line}`,
                color: form.type === t ? (t === "buy" ? c.green : c.red) : c.textDim,
              }}>{L(t === "buy" ? I18N.buy : I18N.sell, lang)}</button>
            ))}
          </div>
        )}

        {/* 날짜 + 종목 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {field(L(I18N.date, lang),
            <input type="date" value={form.date} onChange={e => inp("date", e.target.value)} style={inputSt} />
          )}
          {field(L(I18N.symbol, lang),
            <input type="text" value={form.symbol} onChange={e => inp("symbol", e.target.value.toUpperCase())} placeholder="NVDA" style={{ ...inputSt, border: `1px solid ${error && !form.symbol ? c.red : c.line}`, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700, letterSpacing: "0.05em" }} />
          )}
        </div>

        {/* 가격 + 수량 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {field(L(I18N.price, lang),
            <input type="number" min="0" step="0.01" value={form.price || ""} onChange={e => inp("price", e.target.value)} placeholder="0.00" style={{ ...inputSt, border: `1px solid ${error && form.price <= 0 ? c.red : c.line}` }} />
          )}
          {field(L(I18N.qty, lang),
            <input type="number" min="0" step="0.01" value={form.qty || ""} onChange={e => inp("qty", e.target.value)} placeholder="0" style={{ ...inputSt, border: `1px solid ${error && form.qty <= 0 ? c.red : c.line}` }} />
          )}
        </div>

        {/* 합계 미리보기 */}
        {form.price > 0 && form.qty > 0 && (
          <div style={{ background: c.panel2, borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: "12px", color: c.textDim }}>{lang === "ko" ? "합계" : "Total"}</span>
            <span style={{ fontSize: "13px", fontWeight: 700, color: form.type === "buy" ? c.green : c.red, fontFamily: "'IBM Plex Mono',monospace" }}>
              {form.type === "sell" ? "+" : "-"}${fmt(form.price * form.qty)}
            </span>
          </div>
        )}

        {/* 투자 논리 */}
        {field(L(I18N.thesis, lang),
          <textarea value={form.thesis} onChange={e => inp("thesis", e.target.value)} placeholder={L(I18N.thesisHint, lang)} rows={4}
            style={{ ...inputSt, resize: "vertical" as const, lineHeight: 1.7 }} />
        )}

        {/* 태그 */}
        {field(L(I18N.tags, lang),
          <input type="text" value={form.tags} onChange={e => inp("tags", e.target.value)} placeholder={L(I18N.tagsHint, lang)} style={inputSt} />
        )}

        <button onClick={submit} style={{
          width: "100%", padding: "13px", borderRadius: "10px", fontSize: "14px", fontWeight: 700,
          background: c.accent, color: c.bg, border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: "4px",
        }}>{isEdit ? L(I18N.update, lang) : L(I18N.save, lang)}</button>
      </div>
    </div>
  );
}

/* ── 엔트리 카드 ── */
function EntryCard({ entry, onEdit, onDelete, lang }: { entry: JournalEntry; onEdit: () => void; onDelete: () => void; lang: Lang }) {
  const { c } = useC();
  const [expanded, setExpanded] = useState(false);
  const isBuy = entry.type === "buy";
  const typeColor = isBuy ? c.green : c.red;

  return (
    <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "14px", overflow: "hidden", marginBottom: "10px" }}>
      {/* 상단 줄 */}
      <div onClick={() => setExpanded(e => !e)} style={{ padding: "14px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px" }}>
        {/* 유형 배지 */}
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, background: typeColor + "1a", color: typeColor, border: `1px solid ${typeColor}44` }}>
          {isBuy ? "BUY" : "SELL"}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "2px" }}>
            <span style={{ fontSize: "15px", fontWeight: 700, color: c.accentText, fontFamily: "'IBM Plex Mono',monospace" }}>{entry.symbol}</span>
            <span style={{ fontSize: "12px", color: c.textDim }}>{fmtDate(entry.date, lang)}</span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ fontSize: "13px", color: typeColor, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 600 }}>${fmt(entry.price)}</span>
            <span style={{ fontSize: "12px", color: c.textDim }}>× {entry.qty} {L(I18N.shares, lang)}</span>
            <span style={{ fontSize: "12px", color: c.textFaint, marginLeft: "auto" }}>${fmt(entry.price * entry.qty)}</span>
          </div>
        </div>

        <span style={{ color: c.textFaint, fontSize: "12px", flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {/* 태그 줄 */}
      {entry.tags.length > 0 && (
        <div style={{ paddingLeft: "16px", paddingBottom: "10px", paddingRight: "16px", display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
          {entry.tags.map(tag => (
            <span key={tag} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: c.panel2, border: `1px solid ${c.line}`, color: c.textDim }}>{tag}</span>
          ))}
        </div>
      )}

      {/* 펼쳤을 때 */}
      {expanded && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${c.line}`, marginTop: "0", paddingTop: "14px" }}>
          {entry.thesis ? (
            <>
              <p style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.1em", color: c.textFaint, marginBottom: "8px" }}>
                {L(I18N.thesis, lang)}
              </p>
              <p style={{ fontSize: "13px", color: c.textSub, lineHeight: 1.8, margin: "0 0 14px", whiteSpace: "pre-wrap" as const }}>{entry.thesis}</p>
            </>
          ) : (
            <p style={{ fontSize: "13px", color: c.textFaint, fontStyle: "italic", marginBottom: "14px" }}>
              {lang === "ko" ? "투자 논리가 기록되지 않았습니다." : "No thesis recorded."}
            </p>
          )}
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onEdit} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, cursor: "pointer", background: c.panel2, border: `1px solid ${c.line}`, color: c.textSub, fontFamily: "inherit" }}>{L(I18N.edit, lang)}</button>
            <button onClick={onDelete} style={{ padding: "6px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 500, cursor: "pointer", background: "transparent", border: `1px solid ${c.red}55`, color: c.red, fontFamily: "inherit" }}>{L(I18N.delete, lang)}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 종목별 요약 카드 ── */
function SymbolSummary({ symbol, entries, lang }: { symbol: string; entries: JournalEntry[]; lang: Lang }) {
  const { c } = useC();
  const { totalQty, totalCost, avgPrice } = calcStats(entries, symbol);
  const sells = entries.filter(e => e.symbol === symbol && e.type === "sell");
  const sellQty = sells.reduce((s, e) => s + e.qty, 0);
  const netQty = totalQty - sellQty;

  return (
    <div style={{ background: c.panel, border: `1px solid ${c.line}`, borderRadius: "10px", padding: "12px 14px" }}>
      <p style={{ fontSize: "13px", fontWeight: 700, color: c.accentText, fontFamily: "'IBM Plex Mono',monospace", margin: "0 0 8px" }}>{symbol}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
        {[
          { label: L(I18N.totalCost, lang), val: `$${fmt(totalCost)}` },
          { label: L(I18N.avgPrice, lang),  val: `$${fmt(avgPrice)}` },
          { label: lang === "ko" ? "보유" : "Held", val: `${netQty}${lang === "ko" ? "주" : " sh"}` },
        ].map(item => (
          <div key={item.label} style={{ textAlign: "center" as const }}>
            <p style={{ fontSize: "10px", color: c.textFaint, margin: "0 0 2px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{item.label}</p>
            <p style={{ fontSize: "13px", fontWeight: 600, color: c.text, margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>{item.val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   메인 컴포넌트
════════════════════════════════════════ */
const STORAGE_KEY = "investment_journal_v1";

export default function JournalTab() {
  const { c, lang } = useC();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null);
  const [filter, setFilter] = useState<"all" | "buy" | "sell">("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "summary">("list");
  const loaded = useRef(false);

  /* localStorage 로드 */
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, []);

  /* localStorage 저장 */
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch {}
  }, [entries]);

  const saveEntry = (data: Omit<JournalEntry, "id" | "createdAt">) => {
    if (editEntry) {
      setEntries(es => es.map(e => e.id === editEntry.id ? { ...editEntry, ...data } : e));
      setEditEntry(null);
    } else {
      setEntries(es => [{ id: genId(), createdAt: Date.now(), ...data }, ...es]);
    }
    setShowForm(false);
  };

  const deleteEntry = (id: string) => {
    if (window.confirm(L(I18N.confirmDel, lang))) {
      setEntries(es => es.filter(e => e.id !== id));
    }
  };

  const openEdit = (entry: JournalEntry) => { setEditEntry(entry); setShowForm(true); };
  const openNew  = () => { setEditEntry(null); setShowForm(true); };

  /* 필터 + 검색 */
  const filtered = entries
    .filter(e => filter === "all" || e.type === filter)
    .filter(e => !search || e.symbol.includes(search.toUpperCase()) || e.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

  /* 종목 목록 */
  const symbols = Array.from(new Set(entries.map(e => e.symbol)));

  /* 전체 통계 */
  const totalInvested = entries.filter(e => e.type === "buy").reduce((s, e) => s + e.price * e.qty, 0);

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>

      {/* 헤더 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" as const, color: c.accent, marginBottom: "5px" }}>Trade Journal</p>
          <h1 style={{ fontSize: "22px", fontWeight: 700, color: c.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{L(I18N.title, lang)}</h1>
          <p style={{ fontSize: "13px", color: c.textFaint, margin: 0 }}>{L(I18N.desc, lang)}</p>
        </div>
        <button onClick={openNew} style={{
          padding: "10px 18px", borderRadius: "10px", background: c.accent, color: c.bg,
          border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 700,
          fontFamily: "inherit", flexShrink: 0, marginTop: "4px",
        }}>+ {lang === "ko" ? "기록" : "Log"}</button>
      </div>

      {/* 요약 바 */}
      {entries.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {[
            { label: lang === "ko" ? "전체 기록" : "Total",    val: `${entries.length}${lang === "ko" ? "건" : " trades"}` },
            { label: lang === "ko" ? "총 투자금" : "Invested",  val: `$${fmt(totalInvested)}` },
            { label: lang === "ko" ? "종목 수" : "Symbols",     val: `${symbols.length}${lang === "ko" ? "개" : ""}` },
          ].map(s => (
            <div key={s.label} style={{ background: c.panel2, border: `1px solid ${c.line}`, borderRadius: "10px", padding: "12px 14px", textAlign: "center" as const }}>
              <p style={{ fontSize: "11px", color: c.textFaint, margin: "0 0 4px", fontFamily: "'IBM Plex Mono',monospace", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{s.label}</p>
              <p style={{ fontSize: "15px", fontWeight: 700, color: c.accentText, margin: 0, fontFamily: "'IBM Plex Mono',monospace" }}>{s.val}</p>
            </div>
          ))}
        </div>
      )}

      {/* 뷰 전환 + 필터 */}
      {entries.length > 0 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" as const, alignItems: "center" }}>
          {/* 뷰 토글 */}
          <div style={{ display: "flex", background: c.panel2, borderRadius: "8px", padding: "3px", border: `1px solid ${c.line}` }}>
            {[{ id: "list", label: lang === "ko" ? "목록" : "List" }, { id: "summary", label: lang === "ko" ? "종목별" : "By Symbol" }].map(v => (
              <button key={v.id} onClick={() => setView(v.id as "list" | "summary")} style={{
                padding: "5px 12px", borderRadius: "6px", fontSize: "12px", cursor: "pointer",
                border: "none", fontFamily: "inherit",
                background: view === v.id ? c.panel : "transparent",
                color: view === v.id ? c.accentText : c.textDim,
                fontWeight: view === v.id ? 600 : 400,
              }}>{v.label}</button>
            ))}
          </div>

          {/* 유형 필터 */}
          {view === "list" && (["all", "buy", "sell"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "5px 12px", borderRadius: "20px", fontSize: "12px", cursor: "pointer",
              border: `1px solid ${filter === f ? c.accent : c.line}`,
              background: filter === f ? c.accent + "22" : "transparent",
              color: filter === f ? c.accent : c.textDim, fontFamily: "inherit",
            }}>
              {f === "all" ? L(I18N.filterAll, lang) : f === "buy" ? L(I18N.filterBuy, lang) : L(I18N.filterSell, lang)}
            </button>
          ))}

          {/* 검색 */}
          {view === "list" && (
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={L(I18N.searchHint, lang)}
              style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: "8px", background: c.panel2, border: `1px solid ${c.line}`, color: c.text, fontSize: "12px", outline: "none", fontFamily: "inherit", width: "160px" }} />
          )}
        </div>
      )}

      {/* 목록 뷰 */}
      {view === "list" && (
        entries.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: "64px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>📒</p>
            <p style={{ fontSize: "15px", fontWeight: 500, color: c.textSub, marginBottom: "6px" }}>{L(I18N.noEntries, lang)}</p>
            <p style={{ fontSize: "13px", color: c.textFaint }}>{L(I18N.noEntriesDesc, lang)}</p>
          </div>
        ) : filtered.length === 0 ? (
          <p style={{ textAlign: "center" as const, color: c.textFaint, padding: "40px 0", fontSize: "13px" }}>
            {lang === "ko" ? "검색 결과가 없습니다." : "No results found."}
          </p>
        ) : (
          filtered.map(e => (
            <EntryCard key={e.id} entry={e} lang={lang} onEdit={() => openEdit(e)} onDelete={() => deleteEntry(e.id)} />
          ))
        )
      )}

      {/* 종목별 뷰 */}
      {view === "summary" && (
        symbols.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: "64px 0" }}>
            <p style={{ fontSize: "32px", marginBottom: "12px" }}>📒</p>
            <p style={{ fontSize: "13px", color: c.textFaint }}>{L(I18N.noEntries, lang)}</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {symbols.map(sym => <SymbolSummary key={sym} symbol={sym} entries={entries} lang={lang} />)}
          </div>
        )
      )}

      {/* 폼 모달 */}
      {showForm && (
        <EntryForm
          initial={editEntry ?? {}}
          onSave={saveEntry}
          onClose={() => { setShowForm(false); setEditEntry(null); }}
          lang={lang}
        />
      )}

      <div style={{ height: "40px" }} />
    </div>
  );
}

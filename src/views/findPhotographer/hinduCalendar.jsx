// npm install @ishubhamx/panchangam-js

import { useState, useEffect, useMemo } from "react";
import { getPanchangam, Observer } from "@ishubhamx/panchangam-js";

const LAT = 21.6033;
const LNG = 71.2211;
const ELEVATION = 10;
const TZ_OFFSET = 5.5;

const TITHI_NAMES = [
  "Pratipada","Dwitiya","Tritiya","Chaturthi","Panchami",
  "Shashthi","Saptami","Ashtami","Navami","Dashami",
  "Ekadashi","Dwadashi","Trayodashi","Chaturdashi","Purnima/Amavasya",
];

const NAKSHATRA_NAMES = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashira","Ardra","Punarvasu",
  "Pushya","Ashlesha","Magha","Purva Phalguni","Uttara Phalguni","Hasta",
  "Chitra","Swati","Vishakha","Anuradha","Jyeshtha","Mula","Purva Ashadha",
  "Uttara Ashadha","Shravana","Dhanishtha","Shatabhisha","Purva Bhadrapada",
  "Uttara Bhadrapada","Revati",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const formatTime = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const isFestival = (p) => p?.festivals && p.festivals.length > 0;
const isAuspicious = (p) => {
  if (!p) return false;
  const t = typeof p.tithi === "number" ? p.tithi : -1;
  // Ekadashi (10,25), Purnima (14,29), Amavasya — simplified
  return [10, 25, 14, 29].includes(t);
};

export default function HinduCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(null);
  const [observer] = useState(() => new Observer(LAT, LNG, ELEVATION));

  // Build month panchang data
  const monthData = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d, 6, 0, 0); // 6am for sunrise calc
      try {
        const p = getPanchangam(date, observer, { timezoneOffset: TZ_OFFSET });
        result.push({ day: d, date, panchang: p });
      } catch {
        result.push({ day: d, date, panchang: null });
      }
    }
    return result;
  }, [year, month, observer]);

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const selectedData = selected !== null ? monthData.find(d => d.day === selected) : null;

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  };

  const getTithiName = (p) => {
    if (!p) return "";
    if (typeof p.tithi === "number") return TITHI_NAMES[p.tithi % 15] || "";
    if (p.tithi?.name) return p.tithi.name;
    return String(p.tithi || "");
  };

  const getNakshatraName = (p) => {
    if (!p) return "";
    if (typeof p.nakshatra === "number") return NAKSHATRA_NAMES[p.nakshatra % 27] || "";
    if (p.nakshatra?.name) return p.nakshatra.name;
    return String(p.nakshatra || "");
  };

  const getPaksha = (p) => {
    if (!p) return "";
    if (p.paksha) return p.paksha;
    if (typeof p.tithi === "number") return p.tithi < 15 ? "Shukla" : "Krishna";
    return "";
  };

  return (
    <section style={{
      padding: "56px 32px 80px",
      background: "#f5f4f0",
      minHeight: "100vh",
      fontFamily: "Georgia, serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.3em", color: "#E8A317", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: "8px" }}>
          🕉 Hindu Calendar
        </div>
        <h2 style={{   fontSize: '60px',
                            fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>
          Monthly Panchang
        </h2>
        <p style={{ color: "#999", fontSize: "13px", margin: 0, fontFamily: "sans-serif" }}>
          Click any date to see full details
        </p>
      </div>

      {/* Month nav */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "20px", marginBottom: "28px",
      }}>
        <button onClick={prevMonth} style={navBtnStyle}>‹</button>
        <div style={{ textAlign: "center", minWidth: "180px" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a" }}>
            {MONTHS[month]}
          </div>
          <div style={{ fontSize: "14px", color: "#888", fontFamily: "sans-serif" }}>{year}</div>
        </div>
        <button onClick={nextMonth} style={navBtnStyle}>›</button>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", gap: "16px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap",
      }}>
        {[
          { color: "#fff3cd", border: "#E8A317", label: "Auspicious / Ekadashi" },
          { color: "#ffe4e4", border: "#e05050", label: "Festival" },
          { color: "#eef6ff", border: "#5a8fc9", label: "Today" },
        ].map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "sans-serif", fontSize: "11px", color: "#777" }}>
            <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: l.color, border: `1.5px solid ${l.border}` }} />
            {l.label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", marginBottom: "6px" }}>
          {DAYS.map(d => (
            <div key={d} style={{
              textAlign: "center", fontSize: "12px", fontWeight: 600,
              color: d === "Sun" ? "#e05050" : "#888",
              fontFamily: "sans-serif", letterSpacing: "0.08em", padding: "4px 0",
            }}>{d}</div>
          ))}
        </div>

        {/* Cells */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
          {/* Empty cells before first day */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {/* Day cells */}
          {monthData.map(({ day, date, panchang: p }) => {
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSel = selected === day;
            const hasFestival = isFestival(p);
            const auspicious = isAuspicious(p);
            const isSun = date.getDay() === 0;

            let bg = "#fff";
            let borderColor = "#e8e0c8";
            if (hasFestival) { bg = "#ffe4e4"; borderColor = "#e05050"; }
            else if (auspicious) { bg = "#fff3cd"; borderColor = "#E8A317"; }
            if (isToday) { bg = "#eef6ff"; borderColor = "#5a8fc9"; }
            if (isSel) { borderColor = "#1a1a1a"; }

            return (
              <div
                key={day}
                onClick={() => setSelected(isSel ? null : day)}
                style={{
                  background: bg,
                  border: `${isSel ? "2.5px" : "1.5px"} solid ${borderColor}`,
                  borderRadius: "10px",
                  padding: "8px 8px 6px",
                  cursor: "pointer",
                  minHeight: "88px",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  boxShadow: isSel ? "0 6px 20px rgba(0,0,0,0.12)" : "0 2px 6px rgba(0,0,0,0.04)",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {/* Date number */}
                <div style={{
                  fontSize: "16px", fontWeight: 700,
                  color: isSun ? "#e05050" : "#1a1a1a",
                  fontFamily: "Georgia, serif", lineHeight: 1,
                  marginBottom: "5px",
                }}>
                  {day}
                  {isToday && (
                    <span style={{
                      marginLeft: "4px", fontSize: "8px", background: "#5a8fc9",
                      color: "#fff", borderRadius: "4px", padding: "1px 4px",
                      fontFamily: "sans-serif", verticalAlign: "middle",
                    }}>TODAY</span>
                  )}
                </div>

                {/* Tithi */}
                {p && (
                  <div style={{ fontSize: "10px", color: "#c8780a", fontWeight: 600, fontFamily: "sans-serif", marginBottom: "2px", lineHeight: 1.2 }}>
                    {getTithiName(p)}
                  </div>
                )}

                {/* Nakshatra */}
                {p && (
                  <div style={{ fontSize: "9.5px", color: "#555", fontFamily: "sans-serif", lineHeight: 1.2, marginBottom: "2px" }}>
                    {getNakshatraName(p)}
                  </div>
                )}

                {/* Festival tag */}
                {hasFestival && p.festivals[0] && (
                  <div style={{
                    fontSize: "8.5px", color: "#c00", fontFamily: "sans-serif",
                    fontWeight: 600, lineHeight: 1.2, marginTop: "2px",
                  }}>
                    🎉 {String(p.festivals[0]).slice(0, 18)}
                  </div>
                )}

                {/* Paksha dot */}
                {p && (
                  <div style={{
                    position: "absolute", top: "6px", right: "7px",
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: getPaksha(p) === "Shukla" ? "#E8A317" : "#555",
                    opacity: 0.7,
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selectedData && (
        <div style={{
          maxWidth: "980px", margin: "28px auto 0",
          background: "#fff",
          border: "2px solid #E8A317",
          borderRadius: "16px",
          padding: "28px 32px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          animation: "slideDown 0.3s ease",
        }}>
          <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }`}</style>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: "#1a1a1a" }}>
                {MONTHS[month]} {selectedData.day}, {year}
              </h3>
              <div style={{ fontSize: "12px", color: "#888", fontFamily: "sans-serif" }}>
                {selectedData.date.toLocaleDateString("en-IN", { weekday: "long" })}
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{
              background: "transparent", border: "1.5px solid #ccc", borderRadius: "50%",
              width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", color: "#888",
            }}>×</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "14px", marginTop: "20px" }}>
            {[
              { label: "Tithi", value: getTithiName(selectedData.panchang), icon: "🌙" },
              { label: "Paksha", value: getPaksha(selectedData.panchang), icon: "☯️" },
              { label: "Nakshatra", value: getNakshatraName(selectedData.panchang), icon: "⭐" },
              { label: "Yoga", value: selectedData.panchang?.yoga?.name || String(selectedData.panchang?.yoga ?? ""), icon: "🪷" },
              { label: "Karana", value: selectedData.panchang?.karana?.name || String(selectedData.panchang?.karana ?? ""), icon: "☀️" },
              { label: "Vara", value: selectedData.panchang?.vara?.name || String(selectedData.panchang?.vara ?? ""), icon: "📅" },
              { label: "Sunrise", value: formatTime(selectedData.panchang?.sunrise), icon: "🌅" },
              { label: "Sunset", value: formatTime(selectedData.panchang?.sunset), icon: "🌇" },
              { label: "Rahu Kalam", value: selectedData.panchang?.rahuKalamStart ? `${formatTime(selectedData.panchang.rahuKalamStart)} – ${formatTime(selectedData.panchang.rahuKalamEnd)}` : "—", icon: "🚫" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#fafaf8", borderRadius: "10px", padding: "12px 14px",
                border: "1px solid #ece8d8",
              }}>
                <div style={{ fontSize: "10px", color: "#aaa", fontFamily: "sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "4px" }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a1a1a", fontFamily: "Georgia, serif" }}>
                  {item.value || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Festival */}
          {isFestival(selectedData.panchang) && (
            <div style={{
              marginTop: "16px", background: "#fff3e0",
              border: "1.5px solid #E8A317", borderRadius: "10px",
              padding: "12px 16px", fontFamily: "sans-serif", fontSize: "14px",
              color: "#c8780a", fontWeight: 600,
            }}>
              🎉 Festival: {selectedData.panchang.festivals.join(" · ")}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

const navBtnStyle = {
  background: "transparent", border: "2px solid #E8A317",
  borderRadius: "50%", color: "#E8A317", fontSize: "22px",
  width: "44px", height: "44px", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "all 0.2s ease",
};
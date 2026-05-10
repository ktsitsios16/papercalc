import { useState, useEffect } from "react";
import "./App.css";

/* ============================
   SIZE GROUPS (Unified Keys)
============================ */
const SIZE_GROUPS = {
  standard: [
    { label: "50 x 70", w: 50, h: 70 },
    { label: "70 x 100", w: 70, h: 100 },
    { label: "72 x 102", w: 72, h: 102 },
    { label: "43 x 61", w: 43, h: 61 },
    { label: "61 x 86", w: 61, h: 86 },
    { label: "64 x 88", w: 64, h: 88 }
  ],
  A: [
    { label: "A0 (84.1×118.9)", w: 84.1, h: 118.9 },
    { label: "A1 (59.4×84.1)", w: 59.4, h: 84.1 },
    { label: "A2 (42×59.4)", w: 42, h: 59.4 },
    { label: "A3 (29.7×42)", w: 29.7, h: 42 },
    { label: "A4 (21×29.7)", w: 21, h: 29.7 },
    { label: "A5 (14.8×21)", w: 14.8, h: 21 }
  ],
  B: [
    { label: "B0 (100×141.4)", w: 100, h: 141.4 },
    { label: "B1 (70.7×100)", w: 70.7, h: 100 },
    { label: "B2 (50×70.7)", w: 50, h: 70.7 },
    { label: "B3 (35.3×50)", w: 35.3, h: 50 },
    { label: "B4 (25×35.3)", w: 25, h: 35.3 },
    { label: "B5 (17.6×25)", w: 17.6, h: 25 }
  ]
};

const GSM_OPTIONS = [70, 80, 90, 100, 115, 130, 150, 170, 200, 250, 300, 350];

/* ============================
   CALCULATIONS
============================ */
function calcSheetWeight(gsm, w, h) {
  if (!gsm || !w || !h) return 0;
  return (w * h * gsm) / 10000;
}

function calcSheets(weightKg, gsm, w, h) {
  const sw = calcSheetWeight(gsm, w, h);
  if (!sw) return 0;
  return Math.round((weightKg * 1000) / sw);
}

function calcTotalWeight(sheets, gsm, w, h) {
  const sw = calcSheetWeight(gsm, w, h);
  return (sw * sheets) / 1000;
}

function calcPricePerSheet(priceKg, gsm, w, h) {
  const sw = calcSheetWeight(gsm, w, h);
  return priceKg * (sw / 1000);
}

function calcPricePerKg(priceSheet, gsm, w, h) {
  const sw = calcSheetWeight(gsm, w, h);
  return (priceSheet * 1000) / sw;
}

/* ============================
   MAIN APP
============================ */
export default function App() {
  const [lang, setLang] = useState("gr");
  const [theme, setTheme] = useState("system");

  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && systemPrefersDark);

  /* Load theme */
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  /* Save theme */
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ============================
     TRANSLATIONS
  ============================ */
  const t = {
    gr: {
      sheets: "Φύλλα",
      price: "Κόστος",
      weight: "Βάρος Χαρτιών (kg)",
      gsm: "Γραμμάρια Χαρτιού (GSM)",
      customGsm: "Βάρος Χαρτιού (GSM)",
      size: "Διάσταση Χαρτιού (cm)",
      width: "Μήκος (cm)",
      height: "Ύψος (cm)",
      priceKg: "Τιμή Κιλού €",
      priceSheet: "Τιμή Φύλλου €",
      sheetsResult: "φύλλα",
      sheetWeightLabel: "Βάρος φύλλου",
      perSheet: "€/φύλλο",
      sizeGroups: {
        standard: "Πρότυπες Διαστάσεις",
        A: "A",
        B: "B"
      }
    },
    en: {
      sheets: "Sheets",
      price: "Price",
      weight: "Weight (kg)",
      gsm: "Paper GSM",
      customGsm: "Paper GSM",
      size: "Size (cm)",
      width: "Width (cm)",
      height: "Height (cm)",
      priceKg: "Price per Kg €",
      priceSheet: "Price per Sheet €",
      sheetsResult: "sheets",
      sheetWeightLabel: "Sheet weight",
      perSheet: "€/sheet",
      sizeGroups: {
        standard: "Standard Sizes",
        A: "A",
        B: "B"
      }
    }
  };

  const tr = t[lang];

  /* ============================
     STATES
  ============================ */
  const [tab, setTab] = useState("sheets");

  const [customGsm, setCustomGsm] = useState("");
  const activeGsm = Number(customGsm);

  const [customSize, setCustomSize] = useState({ w: "", h: "" });
  const [activeSizeLabel, setActiveSizeLabel] = useState(null);

  const w = Number(customSize.w);
  const h = Number(customSize.h);

  const sheetWeight = calcSheetWeight(activeGsm, w, h);

  const [weight, setWeight] = useState(0);
  const [activeWeightPreset, setActiveWeightPreset] = useState(null);

  const sheets = calcSheets(weight, activeGsm, w, h);

  const [sheetCount, setSheetCount] = useState(0);
  const totalWeightFromSheets = calcTotalWeight(sheetCount, activeGsm, w, h);

  const [price, setPrice] = useState(0);
  const priceSheet = calcPricePerSheet(price, activeGsm, w, h);
  const priceKg = calcPricePerKg(price, activeGsm, w, h);

  const [openSheetsMode, setOpenSheetsMode] = useState({
    fromWeight: false,
    fromSheets: false
  });

  const [openPriceMode, setOpenPriceMode] = useState({
    kgToSheet: false,
    sheetToKg: false
  });

  const [activeSheetsMode, setActiveSheetsMode] = useState(null);
  const [activePriceMode, setActivePriceMode] = useState(null);

  const accordionClass = (isOpen) =>
    isOpen ? "accordion-content open" : "accordion-content";

  /* ============================
     RENDER SIZE BUTTONS
  ============================ */
  const renderSizeButtons = (groupKey) => (
    <div className="size-group">
      <h4>{tr.sizeGroups[groupKey]}</h4>
      <div className="size-grid">
        {SIZE_GROUPS[groupKey].map((s) => (
          <button
            key={s.label}
            className={activeSizeLabel === s.label ? "preset-button active" : "preset-button"}
            onClick={() => {
              setCustomSize({ w: s.w, h: s.h });
              setActiveSizeLabel(s.label);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );

  /* ============================
     UI
  ============================ */
  return (
    <div className={isDark ? "container dark" : "container"}>
      <div className="header">
        <h1>PaperCalc PRO</h1>

        <div className="top-controls">
          <button
            onClick={() => setLang("gr")}
            className={lang === "gr" ? "preset-button active" : "preset-button"}
          >
            ΕΛ
          </button>

          <button
            onClick={() => setLang("en")}
            className={lang === "en" ? "preset-button active" : "preset-button"}
          >
            EN
          </button>

          <button
            className="dark-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* ============================
          TABS
      ============================ */}
      <div className="tabs" style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button
          onClick={() => setTab("sheets")}
          className={tab === "sheets" ? "main-button active" : "main-button"}
        >
          {tr.sheets}
        </button>

        <button
          onClick={() => setTab("price")}
          className={tab === "price" ? "main-button active" : "main-button"}
        >
          {tr.price}
        </button>
      </div>

      {/* ============================
          TAB: SHEETS
      ============================ */}
      {tab === "sheets" && (
        <>
          <label>{tr.gsm}</label>
          <input
            type="number"
            placeholder={tr.customGsm}
            value={customGsm}
            onChange={(e) => setCustomGsm(Math.max(0, Number(e.target.value)))}
          />

          <div className="gsm-grid">
            {GSM_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => setCustomGsm(String(g))}
                className={activeGsm === g ? "preset-button active" : "preset-button"}
              >
                {g}
              </button>
            ))}
          </div>

          <label>{tr.size}</label>
          <div className="size-inputs">
            <input
              type="number"
              placeholder={tr.width}
              value={customSize.w}
              onChange={(e) => setCustomSize({ ...customSize, w: Math.max(0, Number(e.target.value)) })}
            />
            <input
              type="number"
              placeholder={tr.height}
              value={customSize.h}
              onChange={(e) => setCustomSize({ ...customSize, h: Math.max(0, Number(e.target.value)) })}
            />
          </div>

          {renderSizeButtons("standard")}
          {renderSizeButtons("A")}
          {renderSizeButtons("B")}

          {/* ===== SHEETS FROM WEIGHT ===== */}
          <button
            className={activeSheetsMode === "fromWeight" ? "main-button active" : "main-button"}
            onClick={() => {
              setOpenSheetsMode({ ...openSheetsMode, fromWeight: true });
              setActiveSheetsMode("fromWeight");
            }}
          >
            {lang === "gr" ? "Ποσότητα Φύλλων" : "Sheets from Weight"}
          </button>

          <div className={accordionClass(openSheetsMode.fromWeight)}>
            <label>{tr.weight}</label>

            <input
              type="number"
              placeholder="0"
              value={weight === 0 ? "" : weight}
              onChange={(e) => {
                setWeight(Math.max(0, Number(e.target.value)));
                setActiveWeightPreset(null);
              }}
            />

            <div className="weight-grid">
              {[350, 500, 750, 1000, 1250, 1500].map((w) => (
                <button
                  key={w}
                  className={activeWeightPreset === w ? "preset-button active" : "preset-button"}
                  onClick={() => {
                    setWeight(w);
                    setActiveWeightPreset(w);
                  }}
                >
                  {w}
                </button>
              ))}
            </div>

            <div className="result-box">
              <div className="big">{sheets.toLocaleString()} {tr.sheetsResult}</div>
              <div className="small">{tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g</div>
            </div>
          </div>

          {/* ===== WEIGHT FROM SHEETS ===== */}
          <button
            className={activeSheetsMode === "fromSheets" ? "main-button active" : "main-button"}
            onClick={() => {
              setOpenSheetsMode({ ...openSheetsMode, fromSheets: true });
              setActiveSheetsMode("fromSheets");
            }}
          >
            {lang === "gr" ? "Βάρος Συσκευασίας" : "Weight from Sheets"}
          </button>

          <div className={accordionClass(openSheetsMode.fromSheets)}>
            <label>{lang === "gr" ? "Αριθμός Φύλλων" : "Number of Sheets"}</label>

            <input
              type="number"
              placeholder="0"
              value={sheetCount === 0 ? "" : sheetCount}
              onChange={(e) => setSheetCount(Math.max(0, Number(e.target.value)))}
            />

            <div className="result-box">
              <div className="big">
                {totalWeightFromSheets < 1
                  ? `${Math.round(totalWeightFromSheets * 1000)} g`
                  : `${totalWeightFromSheets.toFixed(2)} kg`}
              </div>
              <div className="small">{tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g</div>
            </div>
          </div>
        </>
      )}

      {/* ============================
          TAB: PRICE
      ============================ */}
      {tab === "price" && (
        <>
          <label>{tr.gsm}</label>
          <input
            type="number"
            placeholder={tr.customGsm}
            value={customGsm}
            onChange={(e) => setCustomGsm(Math.max(0, Number(e.target.value)))}
          />

          <div className="gsm-grid">
            {GSM_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => setCustomGsm(String(g))}
                className={activeGsm === g ? "preset-button active" : "preset-button"}
              >
                {g}
              </button>
            ))}
          </div>

          <label>{tr.size}</label>
          <div className="size-inputs">
            <input
              type="number"
              placeholder={tr.width}
              value={customSize.w}
              onChange={(e) => setCustomSize({ ...customSize, w: Math.max(0, Number(e.target.value)) })}
            />
            <input
              type="number"
              placeholder={tr.height}
              value={customSize.h}
              onChange={(e) => setCustomSize({ ...customSize, h: Math.max(0, Number(e.target.value)) })}
            />
          </div>

          {renderSizeButtons("standard")}
          {renderSizeButtons("A")}
          {renderSizeButtons("B")}

          {/* ===== PRICE PER SHEET ===== */}
          <button
            className={activePriceMode === "kgToSheet" ? "main-button active" : "main-button"}
            onClick={() => {
              setOpenPriceMode({ ...openPriceMode, kgToSheet: true });
              setActivePriceMode("kgToSheet");
            }}
          >
            {tr.priceSheet}
          </button>

          <div className={accordionClass(openPriceMode.kgToSheet)}>
            <label>{tr.priceKg}</label>

            <input
              type="number"
              placeholder="0"
              value={price === 0 ? "" : price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
            />

            <div className="result-box">
              <div className="big">{priceSheet.toFixed(3)} {tr.perSheet}</div>
            </div>
          </div>

          {/* ===== PRICE PER KG ===== */}
          <button
            className={activePriceMode === "sheetToKg" ? "main-button active" : "main-button"}
            onClick={() => {
              setOpenPriceMode({ ...openPriceMode, sheetToKg: true });
              setActivePriceMode("sheetToKg");
            }}
          >
            {tr.priceKg}
          </button>

          <div className={accordionClass(openPriceMode.sheetToKg)}>
            <label>{tr.priceSheet}</label>

            <input
              type="number"
              placeholder="0"
              value={price === 0 ? "" : price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
            />

            <div className="result-box">
              <div className="big">{priceKg.toFixed(2)} €/kg</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

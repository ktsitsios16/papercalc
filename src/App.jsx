import { useState, useEffect } from "react";
import "./App.css";

/* ============================
   SIZE GROUPS
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
const WEIGHT_OPTIONS = [350, 500, 750, 1000, 1250, 1500];

/* ============================
   CALCULATIONS
============================ */
const calcSheetWeight = (gsm, w, h) =>
  gsm && w && h ? (w * h * gsm) / 10000 : 0;

const calcSheets = (kg, gsm, w, h) => {
  const sw = calcSheetWeight(gsm, w, h);
  return sw ? Math.round((kg * 1000) / sw) : 0;
};

const calcTotalWeight = (sheets, gsm, w, h) => {
  const sw = calcSheetWeight(gsm, w, h);
  return sw ? (sw * sheets) / 1000 : 0;
};

const calcPricePerSheet = (priceKg, gsm, w, h) => {
  const sw = calcSheetWeight(gsm, w, h);
  return sw ? priceKg * (sw / 1000) : 0;
};

const calcPricePerKg = (priceSheet, gsm, w, h) => {
  const sw = calcSheetWeight(gsm, w, h);
  return sw ? (priceSheet * 1000) / sw : 0;
};

/* ============================
   MAIN APP
============================ */
export default function App() {
  const [lang, setLang] = useState("gr");
  const [theme, setTheme] = useState("system");

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && systemDark);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

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
      sizeGroups: { standard: "Πρότυπες Διαστάσεις", A: "A", B: "B" },
      sub: {
        fromWeight: "Ποσότητα Φύλλων",
        fromSheets: "Βάρος Συσκευασίας",
        kgToSheet: "Τιμή Φύλλου",
        sheetToKg: "Τιμή Κιλού"
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
      sizeGroups: { standard: "Standard Sizes", A: "A", B: "B" },
      sub: {
        fromWeight: "Sheets from Weight",
        fromSheets: "Weight from Sheets",
        kgToSheet: "Price per Sheet",
        sheetToKg: "Price per Kg"
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

  const [priceInput, setPriceInput] = useState("");
  const parsedPrice = Number(priceInput.replace(",", "."));

  const priceSheet = calcPricePerSheet(parsedPrice, activeGsm, w, h);
  const priceKg = calcPricePerKg(parsedPrice, activeGsm, w, h);

  const [openSheetsMode, setOpenSheetsMode] = useState(null);
  const [openPriceMode, setOpenPriceMode] = useState(null);

  const accordionClass = (isOpen) =>
    isOpen ? "accordion-content open" : "accordion-content";

  /* ============================
     SIZE BUTTONS
  ============================ */
  const renderSizeButtons = (groupKey) => (
    <div className="size-group">
      <h4>{tr.sizeGroups[groupKey]}</h4>
      <div className="size-grid">
        {SIZE_GROUPS[groupKey].map((s) => (
          <button
  key={s.label}
  className={
    activeSizeLabel === s.label ? "preset-button active" : "preset-button"
  }
  onClick={() => {
    setCustomSize({ w: s.w, h: s.h });
    setActiveSizeLabel(s.label);
  }}
>
  {(() => {
    const parts = s.label.split("(");
    const main = parts[0].trim();
    const dims = parts[1] ? "(" + parts[1] : "";
    return (
      <>
        <span className="size-label">{main}</span>
        {dims && <span className="size-dims">{dims}</span>}
      </>
    );
  })()}
</button>
        ))}
      </div>
    </div>
  );

  /* ============================
     UI START
  ============================ */
  return (
    <div className={isDark ? "container dark" : "container"}>
      {/* HEADER */}
      <div className="header">
        <h1>PaperCalc PRO</h1>

        <div className="top-controls">

  {/* 1η σειρά — Theme toggle */}
  <div className="theme-row">
    <button
      className="dark-toggle"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  </div>

  {/* 2η σειρά — Language buttons */}
  <div className="lang-row">
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
  </div>

</div>
      </div>

      {/* MAIN TABS */}
      <div className="tabs" style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
        <button
          onClick={() => {
            setTab("sheets");
            setOpenSheetsMode(null);
            setOpenPriceMode(null);
          }}
          className={tab === "sheets" ? "main-button active" : "main-button"}
        >
          {tr.sheets}
        </button>

        <button
          onClick={() => {
            setTab("price");
            setOpenSheetsMode(null);
            setOpenPriceMode(null);
          }}
          className={tab === "price" ? "main-button active" : "main-button"}
        >
          {tr.price}
        </button>
      </div>

      {/* SUBCATEGORY BUTTONS — 50/50 */}
      {tab === "sheets" && (
        <div className="sub-grid">
          <button
            className={openSheetsMode === "fromWeight" ? "sub-button active" : "sub-button"}
            onClick={() =>
              setOpenSheetsMode(openSheetsMode === "fromWeight" ? null : "fromWeight")
            }
          >
            {tr.sub.fromWeight}
          </button>

          <button
            className={openSheetsMode === "fromSheets" ? "sub-button active" : "sub-button"}
            onClick={() =>
              setOpenSheetsMode(openSheetsMode === "fromSheets" ? null : "fromSheets")
            }
          >
            {tr.sub.fromSheets}
          </button>
        </div>
      )}

      {tab === "price" && (
        <div className="sub-grid">
          <button
            className={openPriceMode === "kgToSheet" ? "sub-button active" : "sub-button"}
            onClick={() =>
              setOpenPriceMode(openPriceMode === "kgToSheet" ? null : "kgToSheet")
            }
          >
            {tr.sub.kgToSheet}
          </button>

          <button
            className={openPriceMode === "sheetToKg" ? "sub-button active" : "sub-button"}
            onClick={() =>
              setOpenPriceMode(openPriceMode === "sheetToKg" ? null : "sheetToKg")
            }
          >
            {tr.sub.sheetToKg}
          </button>
        </div>
      )}

      {/* ============================
          SHEETS TAB — ACCORDIONS
      ============================ */}
      {tab === "sheets" && (
        <>
          {/* ===== FROM WEIGHT ===== */}
          <div className={accordionClass(openSheetsMode === "fromWeight")}>
            {openSheetsMode === "fromWeight" && (
              <div className="accordion-inner">
                {/* WEIGHT INPUT */}
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

                {/* WEIGHT PRESETS */}
                <div className="weight-grid">
                  {WEIGHT_OPTIONS.map((wOpt) => (
                    <button
                      key={wOpt}
                      className={
                        activeWeightPreset === wOpt
                          ? "preset-button active"
                          : "preset-button"
                      }
                      onClick={() => {
                        setWeight(wOpt);
                        setActiveWeightPreset(wOpt);
                      }}
                    >
                      {wOpt}
                    </button>
                  ))}
                </div>

                {/* GSM INPUT */}
                <label>{tr.gsm}</label>
                <input
                  type="number"
                  placeholder={tr.customGsm}
                  value={customGsm}
                  onChange={(e) => setCustomGsm(Math.max(0, Number(e.target.value)))}
                />

                {/* GSM PRESETS */}
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

                {/* SIZE INPUTS */}
                <label>{tr.size}</label>
                <div className="size-inputs">
                  <input
                    type="number"
                    placeholder={tr.width}
                    value={customSize.w}
                    onChange={(e) =>
                      setCustomSize({
                        ...customSize,
                        w: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder={tr.height}
                    value={customSize.h}
                    onChange={(e) =>
                      setCustomSize({
                        ...customSize,
                        h: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                </div>

                {/* SIZE PRESETS */}
                {renderSizeButtons("standard")}
                {renderSizeButtons("A")}
                {renderSizeButtons("B")}

                {/* RESULT */}
                <div className="result-box">
                  <div className="big">
                    {sheets.toLocaleString()} {tr.sheetsResult}
                  </div>
                  <div className="small">
                    {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== FROM SHEETS ===== */}
          <div className={accordionClass(openSheetsMode === "fromSheets")}>
            {openSheetsMode === "fromSheets" && (
              <div className="accordion-inner">
                {/* SHEET COUNT */}
                <label>{lang === "gr" ? "Αριθμός Φύλλων" : "Number of Sheets"}</label>
                <input
                  type="number"
                  placeholder="0"
                  value={sheetCount === 0 ? "" : sheetCount}
                  onChange={(e) => setSheetCount(Math.max(0, Number(e.target.value)))}
                />

                {/* GSM INPUT */}
                <label>{tr.gsm}</label>
                <input
                  type="number"
                  placeholder={tr.customGsm}
                  value={customGsm}
                  onChange={(e) => setCustomGsm(Math.max(0, Number(e.target.value)))}
                />

                {/* GSM PRESETS */}
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

                {/* SIZE INPUTS */}
                <label>{tr.size}</label>
                <div className="size-inputs">
                  <input
                    type="number"
                    placeholder={tr.width}
                    value={customSize.w}
                    onChange={(e) =>
                      setCustomSize({
                        ...customSize,
                        w: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder={tr.height}
                    value={customSize.h}
                    onChange={(e) =>
                      setCustomSize({
                        ...customSize,
                        h: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                </div>

                {/* SIZE PRESETS */}
                {renderSizeButtons("standard")}
                {renderSizeButtons("A")}
                {renderSizeButtons("B")}

                {/* RESULT */}
                <div className="result-box">
                  <div className="big">
                    {totalWeightFromSheets < 1
                      ? `${Math.round(totalWeightFromSheets * 1000)} g`
                      : `${totalWeightFromSheets.toFixed(2)} kg`}
                  </div>
                  <div className="small">
                    {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ============================
          PRICE TAB — ACCORDIONS
      ============================ */}
      {tab === "price" && (
        <>
          {/* ===== PRICE PER SHEET ===== */}
          <div className={accordionClass(openPriceMode === "kgToSheet")}>
            {openPriceMode === "kgToSheet" && (
              <div className="accordion-inner">
                {/* PRICE INPUT (keeps user format) */}
                <label>{tr.priceKg}</label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={priceInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[0-9.,]*$/.test(v)) setPriceInput(v);
                  }}
                />

                {/* GSM INPUT */}
                <label>{tr.gsm}</label>
                <input
                  type="number"
                  placeholder={tr.customGsm}
                  value={customGsm}
                  onChange={(e) => setCustomGsm(Math.max(0, Number(e.target.value)))}
                />

                {/* GSM PRESETS */}
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

                {/* SIZE INPUTS */}
                <label>{tr.size}</label>
                <div className="size-inputs">
                  <input
                    type="number"
                    placeholder={tr.width}
                    value={customSize.w}
                    onChange={(e) =>
                      setCustomSize({
                        ...customSize,
                        w: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder={tr.height}
                    value={customSize.h}
                    onChange={(e) =>
                      setCustomSize({
                        ...customSize,
                        h: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                </div>

                {/* SIZE PRESETS */}
                {renderSizeButtons("standard")}
                {renderSizeButtons("A")}
                {renderSizeButtons("B")}

                {/* RESULT */}
                <div className="result-box">
                  <div className="big">
                    {priceSheet ? priceSheet.toFixed(4) + " " + tr.perSheet : "-"}
                  </div>
                  <div className="small">
                    {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== PRICE PER KG ===== */}
          <div className={accordionClass(openPriceMode === "sheetToKg")}>
            {openPriceMode === "sheetToKg" && (
              <div className="accordion-inner">
                {/* PRICE INPUT */}
                <label>{tr.priceSheet}</label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={priceInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^[0-9.,]*$/.test(v)) setPriceInput(v);
                  }}
                />

                {/* GSM INPUT */}
                <label>{tr.gsm}</label>
                <input
                  type="number"
                  placeholder={tr.customGsm}
                  value={customGsm}
                  onChange={(e) => setCustomGsm(Math.max(0, Number(e.target.value)))}
                />

                {/* GSM PRESETS */}
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

                {/* SIZE INPUTS */}
                <label>{tr.size}</label>
                <div className="size-inputs">
                  <input
                    type="number"
                    placeholder={tr.width}
                    value={customSize.w}
                    onChange={(e) =>
                      setCustomSize({
                        ...customSize,
                        w: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                  <input
                    type="number"
                    placeholder={tr.height}
                    value={customSize.h}
                    onChange={(e) =>
                      setCustomSize({
                        ...customSize,
                        h: Math.max(0, Number(e.target.value))
                      })
                    }
                  />
                </div>

                {/* SIZE PRESETS */}
                {renderSizeButtons("standard")}
                {renderSizeButtons("A")}
                {renderSizeButtons("B")}

                {/* RESULT */}
                <div className="result-box">
                  <div className="big">
                    {priceKg ? priceKg.toFixed(3) + " €/kg" : "-"}
                  </div>
                  <div className="small">
                    {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

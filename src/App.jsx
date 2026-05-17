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

const GSM_OPTIONS = [
  70, 80, 90, 100, 115, 130, 150, 170, 200, 250, 300, 350
];
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
  const [activeSheetsPreset, setActiveSheetsPreset] = useState(null);
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
      width: "Ύψος (cm)",
      height: "Μήκος (cm)",
      priceKg: "Τιμή Κιλού €",
      priceSheet: "Τιμή Φύλλου €",
      sheetsResult: "φύλλα",
      sheetWeightLabel: "Βάρος φύλλου",
      perSheet: "€/φύλλο",
      sizeGroups: {
        standard: "Πρότυπες Διαστάσεις",
        A: "A",
        B: "B"
      },
      sub: {
        fromWeight: "Ποσότητα Φύλλων",
        fromSheets: "Βάρος Συσκευασίας",
        kgToSheet: "Τιμή Φύλλου",
        sheetToKg: "Τιμή Κιλού"
      },
      weightKgPlaceholder: "Κιλά (Kg)",
      sheetsPlaceholder: "Φύλλα",
      priceInputPlaceholder: "Τιμή (€)"
    },
    en: {
      sheets: "Sheets",
      price: "Price",
      weight: "Weight (kg)",
      gsm: "Paper GSM",
      customGsm: "Paper GSM",
      size: "Size (cm)",
      width: "Height (cm)",
      height: "width (cm)",
      priceKg: "Price per kg €",
      priceSheet: "Price per Sheet €",
      sheetsResult: "sheets",
      sheetWeightLabel: "Sheet weight",
      perSheet: "€/sheet",
      sizeGroups: {
        standard: "Standard Sizes",
        A: "A",
        B: "B"
      },
      sub: {
        fromWeight: "Sheets from Weight",
        fromSheets: "Weight from Sheets",
        kgToSheet: "Price per Sheet",
        sheetToKg: "Price per kg"
      },
      weightKgPlaceholder: "Weight (kg)",
      sheetsPlaceholder: "Sheets",
      priceInputPlaceholder: "Price (€)"
    }
  };

  const tr = t[lang];

  /* ============================
     STATES
  ============================ */
  const [activePanel, setActivePanel] = useState(null);

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
  const totalWeightFromSheets = calcTotalWeight(
    sheetCount,
    activeGsm,
    w,
    h
  );

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
  const renderSizeButtons = (groupKey) => {
    return (
      <div className="size-group">
        <h4>{tr.sizeGroups[groupKey]}</h4>
        <div className="size-grid">
          {SIZE_GROUPS[groupKey].map((s) => (
            <button
              key={s.label}
              className={
                activeSizeLabel === s.label
                  ? "preset-button active"
                  : "preset-button"
              }
              onClick={() => {
                setCustomSize({ h: s.h, w: s.w });
                setActiveSizeLabel(s.label);
              }}
            >
              <span className="size-label">
                {s.label.split("(")[0].trim()}
              </span>
              {s.label.includes("(") && (
                <span className="size-dims">
                  ({s.label.split("(")[1]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /* ============================
     UI START
  ============================ */
  return (
    <div className={isDark ? "dark" : "light"}>
      <div className={`container ${isDark ? "dark-mode" : "light-mode"}`}>

        {/* HEADER */}
        <div className="header">
          <h1>PaperCalc PRO</h1>

          <div className="top-controls">

            {/* THEME TOGGLE */}
            <div className="theme-row">
              <button
                className="dark-toggle"
                onClick={() =>
                  setTheme(theme === "dark" ? "light" : "dark")
                }
              >
                {isDark ? "☀️" : "🌙"}
              </button>
            </div>

            {/* LANGUAGE BUTTONS */}
            <div className="lang-row">
              <button
                onClick={() => setLang("gr")}
                className={
                  lang === "gr"
                    ? "preset-button active"
                    : "preset-button"
                }
              >
                ΕΛ
              </button>

              <button
                onClick={() => setLang("en")}
                className={
                  lang === "en"
                    ? "preset-button active"
                    : "preset-button"
                }
              >
                EN
              </button>
            </div>

          </div>
        </div>

        {/* MAIN TABS */}
        <div
          className="tabs"
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "8px"
          }}
        >
          <button
            onClick={() => {
              setTab("sheets");
              setOpenSheetsMode(null);
              setOpenPriceMode(null);
            }}
            className={
              tab === "sheets"
                ? "main-button active"
                : "main-button"
            }
          >
            {tr.sheets}
          </button>

          <button
            onClick={() => {
              setTab("price");
              setOpenSheetsMode(null);
              setOpenPriceMode(null);
            }}
            className={
              tab === "price"
                ? "main-button active"
                : "main-button"
            }
          >
            {tr.price}
          </button>
        </div>

        {/* ============================
            SHEETS TAB — SUBCATEGORIES
        ============================ */}
        {tab === "sheets" && (
          <div className="sub-grid">
            <button
              className={
                openSheetsMode === "fromWeight"
                  ? "sub-button active"
                  : "sub-button"
              }
              onClick={() =>
                setOpenSheetsMode(
                  openSheetsMode === "fromWeight" ? null : "fromWeight"
                )
              }
            >
              {tr.sub.fromWeight}
            </button>

            <button
              className={
                openSheetsMode === "fromSheets"
                  ? "sub-button active"
                  : "sub-button"
              }
              onClick={() =>
                setOpenSheetsMode(
                  openSheetsMode === "fromSheets" ? null : "fromSheets"
                )
              }
            >
              {tr.sub.fromSheets}
            </button>
          </div>
        )}

        {/* ============================
            SHEETS TAB — ACCORDIONS
        ============================ */}
        {tab === "sheets" && (
          <>

            {/* ===== FROM WEIGHT → SHEETS ===== */}
            <div className={`accordion-content sheets-content ${openSheetsMode === "fromWeight" ? "open" : ""}`}>
              {openSheetsMode === "fromWeight" && (
                <div className="accordion-inner">

                  {/* WEIGHT PANEL */}
                  <div
  className={`category-panel ${
    openSheetsMode === "fromWeight" ? "active-panel-sheets" : ""
  }`}
>
  <label>{tr.weight}</label>
  <div className="input-row">
    <input
      type="number"
      placeholder={tr.weightKgPlaceholder}
      value={weight === 0 ? "" : weight}
      onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
    />
  </div>

  <div className="preset-buttons">
    {[300, 500, 750, 1000, 1250, 1500, 1750, 2000, 2500].map((wVal) => (
      <button
        key={wVal}
        onClick={() => setWeight(wVal)}
        className={weight === wVal ? "preset-button active" : "preset-button"}
      >
        {wVal}
      </button>
    ))}
  </div>
</div>



                  {/* GSM PANEL */}
                 
                 <div
  className={`category-panel ${
    openSheetsMode === "fromWeight" ? "active-panel" : ""
  }`}
>
                    <label>{tr.gsm}</label>
                    <div className="input-row">
                      <input
                        type="number"
                        placeholder={tr.customGsm}
                        value={customGsm}
                        onChange={(e) => setCustomGsm(e.target.value)}
                      />
                    </div>
                    <div className="preset-buttons">
                      {GSM_OPTIONS.map((g) => (
                        <button
                          key={g}
                          onClick={() => setCustomGsm(String(g))}
                          className={
                            activeGsm === g
                              ? "preset-button active"
                              : "preset-button"
                          }
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SIZE PANEL */}
                  <div
  className={`category-panel ${
    openSheetsMode === "fromWeight" ? "active-panel-sheets" : ""
  }`}
>

  <label>{tr.size}</label>

  {/* SIZE INPUTS — 1 ROW / 2 COLUMNS */}
  <div className="input-row size-inputs">
    <input
      type="number"
      placeholder={tr.width}
      value={customSize.w === 0 ? "" : customSize.w}
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
      value={customSize.h === 0 ? "" : customSize.h}
      onChange={(e) =>
        setCustomSize({
          ...customSize,
          h: Math.max(0, Number(e.target.value))
        })
      }
    />
  </div>

  {/* STANDARD SIZES */}
  <h4>{tr.sizeGroups.standard}</h4>
  <div className="size-row">
    {SIZE_GROUPS.standard.map((s) => (
      <button
        key={s.label}
        className={
          activeSizeLabel === s.label
            ? "preset-button active"
            : "preset-button"
        }
        onClick={() => {
          setCustomSize({ h: s.h, w: s.w });
          setActiveSizeLabel(s.label);
        }}
      >
        {s.label}
      </button>
    ))}
  </div>

  {/* A SERIES */}
  <h4>A</h4>
  <div className="size-row">
    {SIZE_GROUPS.A.map((s) => (
      <button
  key={s.label}
  className={
    activeSizeLabel === s.label
      ? "preset-button active"
      : "preset-button"
  }
  onClick={() => {
    setCustomSize({ h: s.h, w: s.w });
    setActiveSizeLabel(s.label);
  }}
>
  <span className="size-main">{s.label.split("(")[0].trim()}</span>
  {s.label.includes("(") && (
    <span className="size-sub">({s.label.split("(")[1].replace(")", "")})</span>
  )}
</button>
    ))}
  </div>

  {/* B SERIES */}
  <h4>B</h4>
  <div className="size-row">
    {SIZE_GROUPS.B.map((s) => (
      <button
  key={s.label}
  className={
    activeSizeLabel === s.label
      ? "preset-button active"
      : "preset-button"
  }
  onClick={() => {
    setCustomSize({ h: s.h, w: s.w });
    setActiveSizeLabel(s.label);
  }}
>
  <span className="size-main">{s.label.split("(")[0].trim()}</span>
  {s.label.includes("(") && (
    <span className="size-sub">({s.label.split("(")[1].replace(")", "")})</span>
  )}
</button>
    ))}
  </div>

</div>


                  {/* RESULT */}
                  {openSheetsMode === "fromWeight" && (
  <div
    className={`result-box ${
      openSheetsMode === "fromWeight" ? "result-box-sheets" : ""
    }`}
  >
    <div className="big">
      {sheets ? sheets + " " + tr.sheetsResult : "0"}
    </div>

    <div className="small">
      {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
    </div>
  </div>
)}
                </div>
              )}
            </div>

            {/* ===== FROM SHEETS → WEIGHT ===== */}
            <div className={`accordion-content sheets-content ${openSheetsMode === "fromSheets" ? "open" : ""}`}>
              {openSheetsMode === "fromSheets" && (
                <div className="accordion-inner">

                  {/* SHEET COUNT PANEL */}
                  <div className={`category-panel ${
  openSheetsMode === "fromSheets" ? "active-panel-package" : ""
}`}>
                    <label>{tr.sheets}</label>
                    <div className="input-row">
                      <input
                        type="number"
                        placeholder={tr.sheetsPlaceholder}
                        value={sheetCount === 0 ? "" : sheetCount}
                        onChange={(e) =>
                          setSheetCount(Math.max(0, Number(e.target.value)))
                        }
                      />
                    </div>
                    <div className="preset-buttons">
                      {[500, 1000, 1500, 2000, 2500, 2800, 3000, 5000, 10000].map((n) => (
                        <button
                          key={n}
                          onClick={() => setSheetCount(n)}
                          className={
                            sheetCount === n
                              ? "preset-button active"
                              : "preset-button"
                          }
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* GSM PANEL */}
                  <div className={`category-panel ${
  openSheetsMode === "fromSheets" ? "active-panel-package" : ""
}`}>
                    <label>{tr.gsm}</label>
                    <div className="input-row">
                      <input
                        type="number"
                        placeholder={tr.customGsm}
                        value={customGsm}
                        onChange={(e) => setCustomGsm(e.target.value)}
                      />
                    </div>
                    <div className="preset-buttons">
                      {GSM_OPTIONS.map((g) => (
                        <button
                          key={g}
                          onClick={() => setCustomGsm(String(g))}
                          className={
                            activeGsm === g
                              ? "preset-button active"
                              : "preset-button"
                          }
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SIZE PANEL */}
<div className={`category-panel ${
  openSheetsMode === "fromSheets" ? "active-panel-package" : ""
}`}>

  <label>{tr.size}</label>

  {/* SIZE INPUTS — 1 ROW / 2 COLUMNS */}
  <div className="input-row size-inputs">
    <input
      type="number"
      placeholder={tr.width}
      value={customSize.w === 0 ? "" : customSize.w}
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
      value={customSize.h === 0 ? "" : customSize.h}
      onChange={(e) =>
        setCustomSize({
          ...customSize,
          h: Math.max(0, Number(e.target.value))
        })
      }
    />
  </div>

  {/* STANDARD SIZES */}
  <h4>{tr.sizeGroups.standard}</h4>
  <div className="size-row">
    {SIZE_GROUPS.standard.map((s) => (
      <button
        key={s.label}
        className={
          activeSizeLabel === s.label
            ? "preset-button active"
            : "preset-button"
        }
        onClick={() => {
          setCustomSize({ h: s.h, w: s.w });
          setActiveSizeLabel(s.label);
        }}
      >
        {s.label}
      </button>
    ))}
  </div>

  {/* A SERIES */}
  <h4>A</h4>
  <div className="size-row">
    {SIZE_GROUPS.A.map((s) => (
      <button
  key={s.label}
  className={
    activeSizeLabel === s.label
      ? "preset-button active"
      : "preset-button"
  }
  onClick={() => {
    setCustomSize({ h: s.h, w: s.w });
    setActiveSizeLabel(s.label);
  }}
>
  <span className="size-main">{s.label.split("(")[0].trim()}</span>
  {s.label.includes("(") && (
    <span className="size-sub">({s.label.split("(")[1].replace(")", "")})</span>
  )}
</button>
    ))}
  </div>

  {/* B SERIES */}
  <h4>B</h4>
  <div className="size-row">
    {SIZE_GROUPS.B.map((s) => (
      <button
  key={s.label}
  className={
    activeSizeLabel === s.label
      ? "preset-button active"
      : "preset-button"
  }
  onClick={() => {
    setCustomSize({ h: s.h, w: s.w });
    setActiveSizeLabel(s.label);
  }}
>
  <span className="size-main">{s.label.split("(")[0].trim()}</span>
  {s.label.includes("(") && (
    <span className="size-sub">({s.label.split("(")[1].replace(")", "")})</span>
  )}
</button>
    ))}
  </div>

</div>


                  {/* RESULT */}
                  {openSheetsMode === "fromSheets" && (
  <div
    className={`result-box ${
      openSheetsMode === "fromSheets" ? "result-box-package" : ""
    }`}
  >
    <div className="big">
      {totalWeightFromSheets
        ? totalWeightFromSheets.toFixed(2) + " kg"
        : "0 kg"}
    </div>

    <div className="small">
      {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
    </div>
  </div>
)}

                </div>
              )}
            </div>

          </>
        )}

        {/* ============================
            PRICE TAB
        ============================ */}
        {tab === "price" && (
          <>

            {/* SUBCATEGORY BUTTONS */}
            <div className="sub-grid">
              <button
                className={
                  openPriceMode === "kgToSheet"
                    ? "sub-button active"
                    : "sub-button"
                }
                onClick={() =>
                  setOpenPriceMode(
                    openPriceMode === "kgToSheet" ? null : "kgToSheet"
                  )
                }
              >
                {tr.sub.kgToSheet}
              </button>

              <button
                className={
                  openPriceMode === "sheetToKg"
                    ? "sub-button active"
                    : "sub-button"
                }
                onClick={() =>
                  setOpenPriceMode(
                    openPriceMode === "sheetToKg" ? null : "sheetToKg"
                  )
                }
              >
                {tr.sub.sheetToKg}
              </button>
            </div>

            {/* ===== PRICE PER SHEET (from kg) ===== */}
            <div className={accordionClass(openPriceMode === "kgToSheet")}>
              {openPriceMode === "kgToSheet" && (
                <div className="accordion-inner">

                  <div className="price-panel">

                    {/* PRICE PER KG */}
        <div
          className={`category-panel ${
            openPriceMode === "kgToSheet" ? "active-panel-price-sheet" : ""
          }`}
        >
          <label>{tr.priceKg}</label>
          <div className="input-row">
            <input
              type="text"
              placeholder={tr.priceInputPlaceholder}
              value={priceInput}
              onChange={(e) => {
                const v = e.target.value;
                if (/^[0-9.,]*$/.test(v)) setPriceInput(v);
              }}
            />
          </div>

          <div className="preset-buttons">
            {["0.001", "0.05", "0.10", "1.20", "2.50", "3.00"].map((p) => (
              <button
                key={p}
                onClick={() => setPriceInput(p)}
                className={
                  priceInput === p
                    ? "preset-button active"
                    : "preset-button"
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>

                    {/* GSM */}
        <div
          className={`category-panel ${
            openPriceMode === "kgToSheet" ? "active-panel-price-sheet" : ""
          }`}
        >
          <label>{tr.gsm}</label>

          <div className="input-row">
            <input
              type="number"
              placeholder={tr.customGsm}
              value={customGsm}
              onChange={(e) => setCustomGsm(e.target.value)}
            />
          </div>

          <div className="preset-buttons">
            {GSM_OPTIONS.map((g) => (
              <button
                key={g}
                onClick={() => setCustomGsm(String(g))}
                className={
                  activeGsm === g
                    ? "preset-button active"
                    : "preset-button"
                }
              >
                {g}
              </button>
            ))}
          </div>
        </div>
                    {/* SIZE PANEL */}
        <div
          className={`category-panel ${
            openPriceMode === "kgToSheet" ? "active-panel-price-sheet" : ""
          }`}
        >
          <label>{tr.size}</label>

          <div className="input-row size-inputs">
            <input
              type="number"
              placeholder={tr.width}
              value={customSize.w === 0 ? "" : customSize.w}
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
              value={customSize.h === 0 ? "" : customSize.h}
              onChange={(e) =>
                setCustomSize({
                  ...customSize,
                  h: Math.max(0, Number(e.target.value))
                })
              }
            />
          </div>
  <h4>{tr.sizeGroups.standard}</h4>
  <div className="size-row">
    {SIZE_GROUPS.standard.map((s) => (
      <button
        key={s.label}
        className={
          activeSizeLabel === s.label
            ? "preset-button active"
            : "preset-button"
        }
        onClick={() => {
          setCustomSize({ h: s.h, w: s.w });
          setActiveSizeLabel(s.label);
        }}
      >
        {s.label}
      </button>
    ))}
  </div>

  <h4>A</h4>
  <div className="size-row">
    {SIZE_GROUPS.A.map((s) => (
      <button
  key={s.label}
  className={
    activeSizeLabel === s.label
      ? "preset-button active"
      : "preset-button"
  }
  onClick={() => {
    setCustomSize({ h: s.h, w: s.w });
    setActiveSizeLabel(s.label);
  }}
>
  <span className="size-main">{s.label.split("(")[0].trim()}</span>
  {s.label.includes("(") && (
    <span className="size-sub">({s.label.split("(")[1].replace(")", "")})</span>
  )}
</button>
    ))}
  </div>

  <h4>B</h4>
  <div className="size-row">
    {SIZE_GROUPS.B.map((s) => (
      <button
  key={s.label}
  className={
    activeSizeLabel === s.label
      ? "preset-button active"
      : "preset-button"
  }
  onClick={() => {
    setCustomSize({ h: s.h, w: s.w });
    setActiveSizeLabel(s.label);
  }}
>
  <span className="size-main">{s.label.split("(")[0].trim()}</span>
  {s.label.includes("(") && (
    <span className="size-sub">({s.label.split("(")[1].replace(")", "")})</span>
  )}
</button>
    ))}
  </div>

</div>


                    {/* RESULT */}
                    {openPriceMode === "kgToSheet" && (
  <div
    className={`result-box ${
      openPriceMode === "kgToSheet" ? "result-box-price-sheet" : ""
    }`}
  >
    <div className="big">
      {priceSheet
        ? priceSheet.toFixed(4) + " " + tr.perSheet
        : "0,00 €"}
    </div>

    <div className="small">
      {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
    </div>
  </div>
)}

                  </div>

                </div>
              )}
            </div>

            {/* ===== PRICE PER KG (from sheet price) ===== */}
            <div className={accordionClass(openPriceMode === "sheetToKg")}>
              {openPriceMode === "sheetToKg" && (
                <div className="accordion-inner">

                  <div className="price-panel">

                    {/* PRICE PER SHEET */}
        <div
          className={`category-panel ${
            openPriceMode === "sheetToKg" ? "active-panel-price-kg" : ""
          }`}
        >
          <label>{tr.priceSheet}</label>

          <div className="input-row">
            <input
              type="text"
              placeholder={tr.priceInputPlaceholder}
              value={priceInput}
              onChange={(e) => {
                const v = e.target.value;
                if (/^[0-9.,]*$/.test(v)) setPriceInput(v);
              }}
            />
          </div>
                      <div className="preset-buttons">
                        {["1.00", "2.00", "2.50", "3.00", "5.00", "8.00"].map((p) => (
                          <button
                            key={p}
                            onClick={() => setPriceInput(p)}
                            className={
                              priceInput === p
                                ? "preset-button active"
                                : "preset-button"
                            }
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* GSM */}
        <div
          className={`category-panel ${
            openPriceMode === "sheetToKg" ? "active-panel-price-kg" : ""
          }`}
        >
          <label>{tr.gsm}</label>

          <div className="input-row">
            <input
              type="number"
              placeholder={tr.customGsm}
              value={customGsm}
              onChange={(e) => setCustomGsm(e.target.value)}
            />
          </div>
                      <div className="preset-buttons">
                        {GSM_OPTIONS.map((g) => (
                          <button
                            key={g}
                            onClick={() => setCustomGsm(String(g))}
                            className={
                              activeGsm === g
                                ? "preset-button active"
                                : "preset-button"
                            }
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SIZE PANEL */}
        <div
          className={`category-panel ${
            openPriceMode === "sheetToKg" ? "active-panel-price-kg" : ""
          }`}
        >
          <label>{tr.size}</label>

          <div className="input-row size-inputs">
            <input
              type="number"
              placeholder={tr.width}
              value={customSize.w === 0 ? "" : customSize.w}
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
      value={customSize.h === 0 ? "" : customSize.h}
      onChange={(e) =>
        setCustomSize({
          ...customSize,
          h: Math.max(0, Number(e.target.value))
        })
      }
    />
  </div>

  <h4>{tr.sizeGroups.standard}</h4>
  <div className="size-row">
    {SIZE_GROUPS.standard.map((s) => (
      <button
        key={s.label}
        className={
          activeSizeLabel === s.label
            ? "preset-button active"
            : "preset-button"
        }
        onClick={() => {
          setCustomSize({ h: s.h, w: s.w });
          setActiveSizeLabel(s.label);
        }}
      >
        {s.label}
      </button>
    ))}
  </div>

  <h4>A</h4>
  <div className="size-row">
    {SIZE_GROUPS.A.map((s) => (
      <button
  key={s.label}
  className={
    activeSizeLabel === s.label
      ? "preset-button active"
      : "preset-button"
  }
  onClick={() => {
    setCustomSize({ h: s.h, w: s.w });
    setActiveSizeLabel(s.label);
  }}
>
  <span className="size-main">{s.label.split("(")[0].trim()}</span>
  {s.label.includes("(") && (
    <span className="size-sub">({s.label.split("(")[1].replace(")", "")})</span>
  )}
</button>
    ))}
  </div>

  <h4>B</h4>
  <div className="size-row">
    {SIZE_GROUPS.B.map((s) => (
      <button
  key={s.label}
  className={
    activeSizeLabel === s.label
      ? "preset-button active"
      : "preset-button"
  }
  onClick={() => {
    setCustomSize({ h: s.h, w: s.w });
    setActiveSizeLabel(s.label);
  }}
>
  <span className="size-main">{s.label.split("(")[0].trim()}</span>
  {s.label.includes("(") && (
    <span className="size-sub">({s.label.split("(")[1].replace(")", "")})</span>
  )}
</button>
    ))}
  </div>

</div>


                    {/* RESULT */}
                    {openPriceMode === "sheetToKg" && (
  <div
    className={`result-box ${
      openPriceMode === "sheetToKg" ? "result-box-price-kg" : ""
    }`}
  >
    <div className="big">
      {priceKg
        ? priceKg.toFixed(3) + " €/kg"
        : "0,00 €/kg"}
    </div>

    <div className="small">
      {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
    </div>
  </div>
)}

                  </div>

                </div>
              )}
            </div>

          </>
        )}

      </div>
    </div>
  );
}

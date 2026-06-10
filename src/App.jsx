import { useState, useEffect, useRef } from "react";
import "./App.css";
import HomeScreen from "./HomeScreen";
import { paginateCutList } from "./utils/paginateCutList";
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

// PRESETS ΓΙΑ PACKAGING TAB


export const PRESETS_PRINTS = [
  50000, 100000, 200000, 500000, 750000, 1000000
];

export const PRESETS_TOPICS = [
  4, 6, 8, 12, 16, 24, 32, 40, 64
];

export const PRESETS_PACKQTY = [
  500, 1000, 2500, 2800, 3000, 5000
];

export const PRESETS_CUTS = [
  100, 250, 500, 700, 1000, 1250
];


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
      sheetToKg: "Τιμή Κιλού",

      printPieces: "Φύλλα Εκτύπωσης",
      printPiecesA: "Κανονική Συσκευασία",
      printPiecesB: "Μερική Συσκευασία"
    },

    weightKgPlaceholder: "Κιλά (Kg)",
    sheetsPlaceholder: "Φύλλα",
    priceInputPlaceholder: "Τιμή (€)",

    /* --- NEW KEYS FOR PACKAGING TAB --- */
    printsQty: "Ποσότητα Εντύπων",
    topics: "Θέματα Φύλλου",
    packQty: "Ποσότητα Συσκευασίας",
    cuts: "Χωρίσματα Κοπής",

    packPieces: "Τεμάχια συσκευασίας",

    showCutList: "Προβολή λίστας κοπής",
    hideCutList: "Απόκρυψη λίστας κοπής",
     
    printPreview: "Προεπισκόπηση Εκτύπωσης",
    printCutList: "Εκτύπωση λίστας",
    packQtyNormal: "Κανονική Ποσότητα",
    packQtyPartial: "Μερική Ποσότητα",
    partialSheets: "Φύλλα Εκτύπωσης (Μερική)"
  },

  en: {
    sheets: "Sheets",
    price: "Cost",

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
    },

    sub: {
      fromWeight: "Sheets from Weight",
      fromSheets: "Weight from Sheets",
      kgToSheet: "Price per Sheet",
      sheetToKg: "Price per Kg",

      printPieces: "Print Sheets",
      printPiecesA: "Regular Packaging",
      printPiecesB: "Partial Packaging"
    },

    weightKgPlaceholder: "Weight (kg)",
    sheetsPlaceholder: "Sheets",
    priceInputPlaceholder: "Price (€)",

    /* --- NEW KEYS FOR PACKAGING TAB --- */
    printsQty: "Print Quantity",
    topics: "Sheet Topics",
    packQty: "Packaging Quantity",
    cuts: "Cut Divisions",

    packPieces: "Packaging Pieces",

    showCutList: "Show Cut List",
    hideCutList: "Hide Cut List",

    printPreview: "Print Preview",
    printCutList: "Print List",
    packQtyNormal: "Normal Quantity",
    packQtyPartial: "Partial Quantity",
    partialSheets: "Print Sheets (Partial)"
  }
};




const tr = t[lang];
/* ============================
   CATEGORY TITLES MAPPING
============================ */
const categoryTitles = {
  // MAIN TABS
  sheets: tr.sheets,
  price: tr.price,

  // SHEETS TAB
  fromWeight: lang === "gr"
  ? "Υπολογισμός Ποσότητας Φύλλων"
  : "Sheet Quantity Calculator",
  fromSheets: lang === "gr"
  ? "Υπολογισμός Βάρους Συσκευασίας"
  : "Package Weight Calculator",

  // PRINT PIECES (ΒΑΣΙΚΗ + ΥΠΟΚΑΤΗΓΟΡΙΕΣ)
  printPieces: lang === "gr"
  ? "Υπολογισμός Φύλλων Εκτύπωσης"
  : "Print Sheets Calculator",    // Φύλλα Εκτύπωσης (σταθερό)
  printPiecesA: tr.sub.printPiecesA,   // Κανονική Συσκευασία
  printPiecesB: tr.sub.printPiecesB,   // Μερική Συσκευασία

  // PRICE TAB
  kgToSheet: lang === "gr"
  ? "Υπολογισμός Τιμής Φύλλου"
  : "Sheet Price Calculator",
  sheetToKg: lang === "gr"
  ? "Υπολογισμός Τιμής Κιλού"
  : "Price per Kilo Calculator",
  
};
  
  /* ============================
     STATES
  ============================ */
  const [currentMode, setCurrentMode] = useState(null);
  
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
  
  const weightRef = useRef(null);
  const gsmRef = useRef(null);
  const priceRef = useRef(null);
  const sheetRef = useRef(null);
  const widthRef = useRef(null);
  const heightRef = useRef(null);
  
  // --- PRESETS ---
  const PRESETS_PACKQTY = [500, 1000, 2500, 2800, 3000, 5000];
  
  const [packData, setPackData] = useState({
  prints: 0,
  topics: 0,
  cuts: 0,
  packQtyNormal: 0,
  packQtyPartial: 0
});

// ΥΠΟΛΟΓΙΣΜΟΣ ΚΑΝΟΝΙΚΩΝ ΦΥΛΛΩΝ
const printSheetsNormal =
  packData.topics > 0 ? packData.prints / packData.topics : 0;

// ΥΠΟΛΟΓΙΣΜΟΣ ΜΕΡΙΚΗΣ ΣΥΣΚΕΥΑΣΙΑΣ
const printSheetsPartial =
  packData.packQtyNormal > 0
    ? Math.ceil(printSheetsNormal * (packData.packQtyPartial / packData.packQtyNormal))
    : 0;

// Ποιο accordion είναι ανοιχτό
const [openPackagingMode, setOpenPackagingMode] = useState("fromData");



// REFS
const printsRef = useRef(null);
const topicsRef = useRef(null);
const packQtyRef = useRef(null);
const cutsRef = useRef(null);
  const handleCalculate = () => {
  weightRef.current?.blur();
  gsmRef.current?.blur();
  priceRef.current?.blur();
  sheetRef.current?.blur();
  widthRef.current?.blur();
  heightRef.current?.blur();
  
};

const [showCutList, setShowCutList] = useState(false);
const printSheets = packData.topics > 0 
  ? packData.prints / packData.topics 
  : 0;

const packPieces = packData.packQty > 0
  ? packData.prints / packData.packQty
  : 0;

// ΛΙΣΤΑ ΚΟΠΗΣ
const cutList = [];
if (packData.cuts > 0 && printSheets > 0) {
  for (let i = packData.cuts; i <= printSheets; i += packData.cuts) {
    cutList.push(i);
  }
}
 // ΠΡΩΤΗ ΣΕΛΙΔΑ – ΛΙΓΟΤΕΡΑ ITEMS
const firstPageCount = 40;

// ΕΠΟΜΕΝΕΣ ΣΕΛΙΔΕΣ – ΠΕΡΙΣΣΟΤΕΡΑ ITEMS
const otherPageCount = 60;

// ΚΑΝΟΥΜΕ PAGINATION
const pages = paginateCutList(cutList, firstPageCount, otherPageCount);


const handleEnterExit = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    document.activeElement.blur();

    setTimeout(() => {
      e.target.blur();
    }, 10);
  }
};




/* ============================
   SAFE CURRENT MODE
============================ */
const safeMode =
  (openSheetsMode === "printPiecesA" || openSheetsMode === "printPiecesB")
    ? "printPieces"
    : openSheetsMode || openPriceMode || tab;

  const accordionClass = (isOpen) =>
    isOpen ? "accordion-content open" : "accordion-content";

  const [flash, setFlash] = useState(false);

useEffect(() => {
  setFlash(true);
  const t = setTimeout(() => setFlash(false), 350);
  return () => clearTimeout(t);
}, [currentMode]);





  /* ============================
     SIZE BUTTONS
  ============================ */
  const renderSizeButtons = (groupKey) => {
  return (
    <div className="size-group">
      <h4>{tr.sizeGroups[groupKey]}</h4>
      <div className="size-grid">
        {SIZE_GROUPS[groupKey].map((s) => (
          <div
            key={s.label}
            className={
              activeSizeLabel === s.label
                ? "size-item active"
                : "size-item"
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
          </div>
        ))}
      </div>
    </div>
  );
};

  /* ============================
     UI START
  ============================ */
  const [screen, setScreen] = useState("home");
  const [startMode, setStartMode] = useState(null);
   // 🔥 ΕΔΩ ΒΑΖΕΙΣ ΤΟ LOG
console.log("screen:", screen);
  
  useEffect(() => {
  if (!startMode) return;

  // ΦΥΛΛΑ
  if (
    startMode === "fromWeight" ||
    startMode === "fromSheets" ||
    startMode === "printPieces"
  ) {
    setTab("sheets");
    setOpenSheetsMode(
      startMode === "printPieces" ? "printPieces" : startMode
    );
    setOpenPriceMode(null);
  }

  // ===== ΚΟΣΤΟΣ =====
  if (startMode === "fromSheetPrice") {
    setTab("price");
    setOpenPriceMode("kgToSheet");
    setOpenSheetsMode(null);
  }

  if (startMode === "fromKgPrice") {
    setTab("price");
    setOpenPriceMode("sheetToKg");
    setOpenSheetsMode(null);
  }
}, [startMode]);

  if (screen === "home") return (
  <HomeScreen
  onSelect={setCurrentMode}
  onStartMode={setStartMode}
  setOpenSheetsMode={setOpenSheetsMode}
  setScreen={setScreen}   // ⭐ ΝΕΟ
/>
);
 
  return (
    <div className={isDark ? "dark" : "light"}>
      <div className={`container ${isDark ? "dark-mode" : "light-mode"}`}>

      {/* HEADER */} 
      <div className="calc-top-icons">

  <button className="calc-home" onClick={() => setScreen("home")}>🏠</button>


    {/* TITLE */}
  <div className="calc-title">
    PaperCalc PRO
  </div>

 {/* THEME TOGGLE */}
<button 
  className="calc-theme"
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
>
  {isDark ? "☀️" : "🌙"}
</button>

<button 
  className={`calc-lang-el ${lang === "gr" ? "active" : ""}`}
  onClick={() => setLang("gr")}
>
  ΕΛ
</button>

<button 
  className={`calc-lang-en ${lang === "en" ? "active" : ""}`}
  onClick={() => setLang("en")}
>
  EN
</button>

</div>

{/* TITLE BOX */}
<div className={`category-title-box mode-${safeMode} ${flash ? "flash" : ""}`}>
  {categoryTitles[safeMode]}
</div>

{/* PRINT PIECES SUBCATEGORIES — ONLY WHEN printPieces IS ACTIVE */}
{["printPieces", "printPiecesA", "printPiecesB"].includes(openSheetsMode) && (
  <div className="sub-grid print-pieces-visible">

    {/* ΚΑΝΟΝΙΚΗ ΣΥΣΚΕΥΑΣΙΑ */}
    <button
      className={`sub-button ${openSheetsMode === "printPiecesA" ? "active" : ""}`}
      onClick={() => setOpenSheetsMode("printPiecesA")}
    >
      {tr.sub.printPiecesA}
    </button>

    {/* ΜΕΡΙΚΗ ΣΥΣΚΕΥΑΣΙΑ */}
    <button
      className={`sub-button ${openSheetsMode === "printPiecesB" ? "active" : ""}`}
      onClick={() => setOpenSheetsMode("printPiecesB")}
    >
      {tr.sub.printPiecesB}
    </button>

  </div>
)}

        {/* SCROLL AREA */}
        <div className="calc-scroll-area">
          
       {/* MAIN TABS — OUTSIDE SCROLL AREA */}
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
      setOpenSheetsMode("fromWeight");
      setOpenPriceMode(null);
    }}
    className={tab === "sheets" ? "main-button active" : "main-button"}
  >
    {tr.sheets}
  </button>

  <button
    onClick={() => {
      setTab("price");
      setOpenPriceMode("kgToSheet");   // ✔ σωστό mapping
      setOpenSheetsMode(null);
    }}
    className={tab === "price" ? "main-button active" : "main-button"}
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
  ref={weightRef}
  type="number"
  placeholder={tr.weightKgPlaceholder}
  value={weight === 0 ? "" : weight}
  onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      weightRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
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
    openSheetsMode === "fromWeight" ? "active-panel-sheets" : ""
  }`}
>
  <label>{tr.gsm}</label>

  <div className="input-row">
    <input
  ref={gsmRef}
  type="number"
  placeholder={tr.customGsm}
  value={customGsm}
  onChange={(e) => setCustomGsm(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      gsmRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
/>
  </div>

  <div className="preset-buttons">
    {GSM_OPTIONS.map((g) => (
      <button
        key={g}
        onClick={() => setCustomGsm(String(g))}
        className={
          activeGsm === g ? "preset-button active" : "preset-button"
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

  {/* SIZE INPUTS */}
  <div className="input-row size-inputs">
    <input
  ref={widthRef}
  type="number"
  placeholder={tr.width}
  value={customSize.w === 0 ? "" : customSize.w}
  onChange={(e) =>
    setCustomSize({
      ...customSize,
      w: Math.max(0, Number(e.target.value))
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      widthRef.current?.blur();   // 🔥 Κλείνει το keyboard
    }
  }}
/>

    <input
  ref={heightRef}
  type="number"
  placeholder={tr.height}
  value={customSize.h === 0 ? "" : customSize.h}
  onChange={(e) =>
    setCustomSize({
      ...customSize,
      h: Math.max(0, Number(e.target.value))
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      heightRef.current?.blur();   // 🔥 Κλείνει το keyboard
    }
  }}
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
          <span className="size-sub">
            ({s.label.split("(")[1].replace(")", "")})
          </span>
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
          <span className="size-sub">
            ({s.label.split("(")[1].replace(")", "")})
          </span>
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
      {sheets ? sheets + " " + tr.sheetsResult : "0" }

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
<div
  className={`accordion-content sheets-content ${
    openSheetsMode === "fromSheets" ? "open" : ""
  }`}
>
  {openSheetsMode === "fromSheets" && (
    <div className="accordion-inner">

      {/* SHEET COUNT PANEL */}
      <div
        className={`category-panel ${
          openSheetsMode === "fromSheets" ? "active-panel-package" : ""
        }`}
      >
        <label>{tr.sheets}</label>

        <div className="input-row">
          <input
  ref={sheetRef}
  type="number"
  placeholder={tr.sheetsPlaceholder}
  value={sheetCount === 0 ? "" : sheetCount}
  onChange={(e) =>
    setSheetCount(Math.max(0, Number(e.target.value)))
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sheetRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
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
      <div
        className={`category-panel ${
          openSheetsMode === "fromSheets" ? "active-panel-package" : ""
        }`}
      >
        <label>{tr.gsm}</label>

        <div className="input-row">
          <input
  ref={gsmRef}
  type="number"
  placeholder={tr.customGsm}
  value={customGsm}
  onChange={(e) => setCustomGsm(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      gsmRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
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
          openSheetsMode === "fromSheets" ? "active-panel-package" : ""
        }`}
      >
        <label>{tr.size}</label>

        <div className="input-row size-inputs">
          <input
  ref={widthRef}
  type="number"
  placeholder={tr.width}
  value={customSize.w === 0 ? "" : customSize.w}
  onChange={(e) =>
    setCustomSize({
      ...customSize,
      w: Math.max(0, Number(e.target.value))
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      widthRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
/>
<input
  ref={heightRef}
  type="number"
  placeholder={tr.height}
  value={customSize.h === 0 ? "" : customSize.h}
  onChange={(e) =>
    setCustomSize({
      ...customSize,
      h: Math.max(0, Number(e.target.value))
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      heightRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
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
              <span className="size-main">
                {s.label.split("(")[0].trim()}
              </span>
              {s.label.includes("(") && (
                <span className="size-sub">
                  ({s.label.split("(")[1].replace(")", "")})
                </span>
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
              <span className="size-main">
                {s.label.split("(")[0].trim()}
              </span>
              {s.label.includes("(") && (
                <span className="size-sub">
                  ({s.label.split("(")[1].replace(")", "")})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

 
                 {/* RESULT */}
{openSheetsMode === "fromSheets" && (
  <div className="result-box result-box-package">

    {/* TOTAL WEIGHT */}
    <div className="big">
      {totalWeightFromSheets
        ? totalWeightFromSheets.toFixed(2) + " kg"
        : "0 kg"}
    </div>

    {/* SHEET WEIGHT */}
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
    PRINT PIECES A — ΚΑΝΟΝΙΚΗ ΣΥΣΚΕΥΑΣΙΑ
============================ */}
{openSheetsMode === "printPiecesA" && (
  <div className="accordion-content printpieces-content open">
    <div className="accordion-inner">

      {/* ΠΛΑΙΣΙΟ ΚΑΡΤΕΛΑΣ */}
      <div className="panel-box"> 

        {/* A. ΠΟΣΟΤΗΤΑ ΕΝΤΥΠΩΝ */}
        <div className="category-panel active-panel-print-sheets">
          <label>{tr.printsQty}</label>

          <div className="input-row">
            <input
              ref={printsRef}
              type="text"
              inputMode="numeric"
              enterKeyHint="done"
              placeholder={tr.sheetsPlaceholder}
              value={packData.prints === 0 ? "" : packData.prints}
              onChange={(e) =>
                setPackData({
                  ...packData,
                  prints: Math.max(0, Number(e.target.value))
                })
              }
              onKeyDownCapture={handleEnterExit}
            />
          </div>

          {/* PRESET BUTTONS */}
          <div className="preset-buttons">
            {PRESETS_PRINTS.map((v) => (
              <button
                key={v}
                className="preset-btn"
                onClick={() =>
                  setPackData({
                    ...packData,
                    prints: v
                  })
                }
              >
                {v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* B. ΘΕΜΑΤΑ ΦΥΛΛΟΥ */}
        <div className="category-panel active-panel-print-sheets">
          <label>{tr.topics}</label>

          <div className="input-row">
            <input
              ref={topicsRef}
              type="text"
              inputMode="numeric"
              enterKeyHint="done"
              placeholder={tr.topics}
              value={packData.topics === 0 ? "" : packData.topics}
              onChange={(e) =>
                setPackData({
                  ...packData,
                  topics: Math.max(0, Number(e.target.value))
                })
              }
              onKeyDownCapture={handleEnterExit}
            />
          </div>

          {/* PRESET BUTTONS */}
          <div className="preset-buttons">
            {PRESETS_TOPICS.map((v) => (
              <button
                key={v}
                className="preset-btn"
                onClick={() =>
                  setPackData({
                    ...packData,
                    topics: v
                  })
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Γ. ΠΟΣΟΤΗΤΑ ΣΥΣΚΕΥΑΣΙΑΣ */}
        <div className="category-panel active-panel-print-sheets">
          <label>{tr.packQty}</label>

          <div className="pack-row">
         


            <input
              ref={packQtyRef}
              type="text"
              inputMode="numeric"
              enterKeyHint="done"
              placeholder={tr.packPieces}
              value={packData.packQty === 0 ? "" : packData.packQty}
              onChange={(e) =>
                setPackData({
                  ...packData,
                  packQty: Math.max(0, Number(e.target.value))
                })
              }
              onKeyDownCapture={handleEnterExit}
            />
          </div>

          {/* PRESET BUTTONS */}
          <div className="preset-buttons">
            {PRESETS_PACKQTY.map((v) => (
              <button
                key={v}
                className="preset-btn"
                onClick={() =>
                  setPackData({
                    ...packData,
                    packQty: v
                  })
                }
              >
                {v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Δ. ΧΩΡΙΣΜΑΤΑ ΚΟΠΗΣ */}
        <div className="category-panel active-panel-print-sheets">
          <label>{tr.cuts}</label>

          <div className="input-row">
            <input
              ref={cutsRef}
              type="text"
              inputMode="numeric"
              enterKeyHint="done"
              placeholder={tr.packPieces}
              value={packData.cuts === 0 ? "" : packData.cuts}
              onChange={(e) =>
                setPackData({
                  ...packData,
                  cuts: Math.max(0, Number(e.target.value))
                })
              }
              onKeyDownCapture={handleEnterExit}
            />
          </div>

          {/* PRESET BUTTONS */}
          <div className="preset-buttons">
            {PRESETS_CUTS.map((v) => (
              <button
                key={v}
                className="preset-btn"
                onClick={() =>
                  setPackData({
                    ...packData,
                    cuts: v
                  })
                }
              >
                {v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* ============================
            ΑΠΟΤΕΛΕΣΜΑΤΑ — ΚΑΝΟΝΙΚΗ ΣΥΣΚΕΥΑΣΙΑ
        ============================ */}
        <div className="category-panel active-panel-print-sheets results-panel-packaging">

          {/* ΚΥΡΙΟ ΑΠΟΤΕΛΕΣΜΑ */}
          <div className="result-main">
            <div className="result-value-big-blue">
              {printSheets > 0 ? printSheets.toLocaleString() : "0"} 
              <span className="unit">{tr.sheets}</span>
            </div>
          </div>

          {/* ΔΕΥΤΕΡΕΥΟΝ */}
          <div className="result-secondary-row">
            <label>{tr.packPieces}:</label>
            <span className="result-secondary-value">
              {packPieces > 0 ? packPieces.toLocaleString() : "0"}
            </span>
          </div>

          {/* ΚΟΥΜΠΙ ΛΙΣΤΑΣ ΚΟΠΗΣ */}
          <button
            className="toggle-cutlist"
            onClick={() => setShowCutList(!showCutList)}
          >
            {showCutList ? tr.hideCutList : tr.showCutList}
          </button>

          {/* PRINT PREVIEW */}
          <button className="print-preview-btn" onClick={() => window.print()}>
            {tr.printPreview}
          </button>

          {/* ΛΙΣΤΑ ΚΟΠΗΣ */}
          {showCutList && (
            <div className="cut-list-panel">

              {cutList.length === 0 && (
                <div className="cut-empty">-</div>
              )}

              {cutList.length > 0 && (
                <div className="cut-list">
                  {cutList.map((v, i) => (
                    <div key={i} className="cut-item">
                      {v.toLocaleString()}
                    </div>
                  ))}
                </div>
              )}

              <button className="print-cutlist">
  {tr.printCutList}
</button>

            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}


{/* ============================
    PRINT PIECES B — ΜΕΡΙΚΗ ΣΥΣΚΕΥΑΣΙΑ
============================ */}
{openSheetsMode === "printPiecesB" && (
  <div className="accordion-content printpieces-content open">
    <div className="accordion-inner">

      {/* ΠΛΑΙΣΙΟ ΚΑΡΤΕΛΑΣ */}
      <div className="panel-box"> 

        {/* A. ΠΟΣΟΤΗΤΑ ΕΝΤΥΠΩΝ */}
        <div className="category-panel active-panel-print-sheets">
          <label>{tr.printsQty}</label>

          <div className="input-row">
            <input
              type="text"
              inputMode="numeric"
              placeholder={tr.sheetsPlaceholder}
              value={packData.prints === 0 ? "" : packData.prints}
              onChange={(e) =>
                setPackData({
                  ...packData,
                  prints: Math.max(0, Number(e.target.value))
                })
              }
              onKeyDownCapture={handleEnterExit}
            />
          </div>

          {/* PRESET BUTTONS */}
          <div className="preset-buttons">
            {PRESETS_PRINTS.map((v) => (
              <button
                key={v}
                className="preset-btn"
                onClick={() =>
                  setPackData({
                    ...packData,
                    prints: v
                  })
                }
              >
                {v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* B. ΘΕΜΑΤΑ ΦΥΛΛΟΥ */}
        <div className="category-panel active-panel-print-sheets">
          <label>{tr.topics}</label>

          <div className="input-row">
            <input
              type="text"
              inputMode="numeric"
              placeholder={tr.topics}
              value={packData.topics === 0 ? "" : packData.topics}
              onChange={(e) =>
                setPackData({
                  ...packData,
                  topics: Math.max(0, Number(e.target.value))
                })
              }
              onKeyDownCapture={handleEnterExit}
            />
          </div>

          {/* PRESET BUTTONS */}
          <div className="preset-buttons">
            {PRESETS_TOPICS.map((v) => (
              <button
                key={v}
                className="preset-btn"
                onClick={() =>
                  setPackData({
                    ...packData,
                    topics: v
                  })
                }
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Γ. ΠΟΣΟΤΗΤΑ ΣΥΣΚΕΥΑΣΙΑΣ — ΚΑΝΟΝΙΚΗ & ΜΕΡΙΚΗ */}
<div className="category-panel active-panel-print-sheets">
  <label>{tr.packQty}</label>

  <div className="pack-row">

    {/* ΚΑΝΟΝΙΚΗ ΣΥΣΚΕΥΑΣΙΑ */}
    <div className="pack-box">
      <label className="sub-label">{tr.packQtyNormal}</label>

      <div className="input-row">
        <input
          type="number"
          value={packData.packQtyNormal === 0 ? "" : packData.packQtyNormal}
          onChange={(e) =>
            setPackData({
              ...packData,
              packQtyNormal: Math.max(0, Number(e.target.value))
            })
          }
        />
      </div>

      {/* PRESET BUTTONS */}
      <div className="preset-buttons">
        {PRESETS_PACKQTY.map((v) => (
          <button
            key={v}
            className="preset-btn"
            onClick={() =>
              setPackData({
                ...packData,
                packQtyNormal: v
              })
            }
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>
    </div>

    {/* ΜΕΡΙΚΗ ΣΥΣΚΕΥΑΣΙΑ */}
    <div className="pack-box">
      <label className="sub-label">{tr.packQtyPartial}</label>

      <div className="input-row">
        <input
          type="number"
          value={packData.packQtyPartial === 0 ? "" : packData.packQtyPartial}
          onChange={(e) =>
            setPackData({
              ...packData,
              packQtyPartial: Math.max(0, Number(e.target.value))
            })
          }
        />
      </div>

      {/* PRESET BUTTONS */}
      <div className="preset-buttons">
        {PRESETS_PACKQTY.map((v) => (
          <button
            key={v}
            className="preset-btn"
            onClick={() =>
              setPackData({
                ...packData,
                packQtyPartial: v
              })
            }
          >
            {v.toLocaleString()}
          </button>
        ))}
      </div>
    </div>

  </div>
</div>


        {/* Δ. ΧΩΡΙΣΜΑΤΑ ΚΟΠΗΣ */}
        <div className="category-panel active-panel-print-sheets">
          <label>{tr.cuts}</label>

          <div className="input-row">
            <input
              type="text"
              inputMode="numeric"
              placeholder={tr.packPieces}
              value={packData.cuts === 0 ? "" : packData.cuts}
              onChange={(e) =>
                setPackData({
                  ...packData,
                  cuts: Math.max(0, Number(e.target.value))
                })
              }
              onKeyDownCapture={handleEnterExit}
            />
          </div>

          {/* PRESET BUTTONS */}
          <div className="preset-buttons">
            {PRESETS_CUTS.map((v) => (
              <button
                key={v}
                className="preset-btn"
                onClick={() =>
                  setPackData({
                    ...packData,
                    cuts: v
                  })
                }
              >
                {v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* ============================
            ΑΠΟΤΕΛΕΣΜΑΤΑ — ΜΕΡΙΚΗ ΣΥΣΚΕΥΑΣΙΑ
        ============================ */}
        <div className="category-panel active-panel-print-sheets results-panel-packaging">

          {/* ΚΥΡΙΟ ΑΠΟΤΕΛΕΣΜΑ */}
          <div className="result-main">
            <div className="result-value-big-blue">
              {printSheetsPartial > 0 ? printSheetsPartial.toLocaleString() : "0"} 
              <span className="unit">{tr.sheets}</span>
            </div>
          </div>

          {/* ΔΕΥΤΕΡΕΥΟΝ */}
          <div className="result-secondary-row">
            <label>{tr.packPieces}:</label>
            <span className="result-secondary-value">
              {packPieces > 0 ? packPieces.toLocaleString() : "0"}
            </span>
          </div>

          {/* ΚΟΥΜΠΙ ΛΙΣΤΑΣ ΚΟΠΗΣ */}
          <button
            className="toggle-cutlist"
            onClick={() => setShowCutList(!showCutList)}
          >
            {showCutList ? tr.hideCutList : tr.showCutList}
          </button>

          {/* PRINT PREVIEW */}
          <button className="print-preview-btn" onClick={() => window.print()}>
            {tr.printPreview}
          </button>

          {/* ΛΙΣΤΑ ΚΟΠΗΣ */}
          {showCutList && (
            <div className="cut-list-panel">

              {cutList.length === 0 && (
                <div className="cut-empty">-</div>
              )}

              {cutList.length > 0 && (
                <div className="cut-list">
                  {cutList.map((v, i) => (
                    <div key={i} className="cut-item">
                      {v.toLocaleString()}
                    </div>
                  ))}
                </div>
              )}

              <button className="print-cutlist">
                {tr.printCutList}
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  </div>
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
  ref={priceRef}
  type="text"
  inputMode="decimal"
  placeholder={tr.priceInputPlaceholder}
  value={priceInput}
  onChange={(e) => {
    const v = e.target.value;
    if (/^[0-9.,]*$/.test(v)) setPriceInput(v);
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      priceRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
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
  ref={gsmRef}
  type="number"
  placeholder={tr.customGsm}
  value={customGsm}
  onChange={(e) => setCustomGsm(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      gsmRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
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
  ref={widthRef}
  type="number"
  placeholder={tr.width}
  value={customSize.w === 0 ? "" : customSize.w}
  onChange={(e) =>
    setCustomSize({
      ...customSize,
      w: Math.max(0, Number(e.target.value))
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      widthRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
/>

            <input
  ref={heightRef}
  type="number"
  placeholder={tr.height}
  value={customSize.h === 0 ? "" : customSize.h}
  onChange={(e) =>
    setCustomSize({
      ...customSize,
      h: Math.max(0, Number(e.target.value))
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      heightRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
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
        <div className="category-panel active-panel-price-kg">
          <label>{tr.priceSheet}</label>

          <div className="input-row">
            <input
  ref={priceRef}
  type="text"
  inputMode="decimal"
  placeholder={tr.priceInputPlaceholder}
  value={priceInput}
  onChange={(e) => {
    const v = e.target.value;
    if (/^[0-9.,]*$/.test(v)) setPriceInput(v);
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      priceRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
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
        <div className="category-panel active-panel-price-kg">
          <label>{tr.gsm}</label>

          <div className="input-row">
            <input
  ref={gsmRef}
  type="number"
  placeholder={tr.customGsm}
  value={customGsm}
  onChange={(e) => setCustomGsm(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      gsmRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
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
        <div className="category-panel active-panel-price-kg">
          <label>{tr.size}</label>

          <div className="input-row size-inputs">
            <input
  ref={widthRef}
  type="number"
  placeholder={tr.width}
  value={customSize.w === 0 ? "" : customSize.w}
  onChange={(e) =>
    setCustomSize({
      ...customSize,
      w: Math.max(0, Number(e.target.value))
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      widthRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
/>

            <input
  ref={heightRef}
  type="number"
  placeholder={tr.height}
  value={customSize.h === 0 ? "" : customSize.h}
  onChange={(e) =>
    setCustomSize({
      ...customSize,
      h: Math.max(0, Number(e.target.value))
    })
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      heightRef.current?.blur();   // 🔥 Κλείνει το keyboard όταν πατήσεις Μετάβαση
    }
  }}
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
                  <span className="size-sub">
                    ({s.label.split("(")[1].replace(")", "")})
                  </span>
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
                  <span className="size-sub">
                    ({s.label.split("(")[1].replace(")", "")})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>


                    {/* RESULT */}
        <div className="result-box result-box-price-kg">
          <div className="big">
            {priceKg
              ? priceKg.toFixed(3) + " €/kg"
              : "0.000 €/kg"}
          </div>

    <div className="small">
      {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
    </div>
  </div>


                  </div>

                </div>
              )}
            </div>

          </>
        )}
</div>
      </div>
    </div>
  );
}

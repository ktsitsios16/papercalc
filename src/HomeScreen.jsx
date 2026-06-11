import { useState } from "react";
import "./HomeScreen.css";
export default function HomeScreen({ onSelect, onStartMode, setOpenSheetsMode, setScreen }) {


  const [btnTop, setBtnTop] = useState(50);
  const [btnLeft, setBtnLeft] = useState(50);
  const [btnWidth, setBtnWidth] = useState(120);
  const [btnHeight, setBtnHeight] = useState(120);
  const [lang, setLang] = useState("EL");
  const [theme, setTheme] = useState("light");
  
  return (
    <div className={`home-screen ${theme}`}>

      {/* TOP ICONS */}
      <div className="top-icons">

        <button className="icon-home">🏠</button>

        <div className="icon-title">PaperCalc PRO</div>

        <button 
       className="icon-theme"
       onClick={() => setTheme(theme === "light" ? "dark" : "light")}
       >
       {theme === "light" ? "🌙" : "☀️"}
  </button>

        <button 
          className={`icon-lang-el ${lang === "EL" ? "active" : ""}`}
          onClick={() => setLang("EL")}
        >
          ΕΛ
        </button>

        <button 
          className={`icon-lang-en ${lang === "EN" ? "active" : ""}`}
          onClick={() => setLang("EN")}
        >
          EN
        </button>

      </div>

{/* SECTION 1 */}
<div className="section">
  
  <div className="category-block sheets-block">
  <img src="/blocks/sheets-block.png" className="block-bg" alt="" />

  {/* ΤΙΤΛΟΣ */}
  <div className="block-title-sheets">
    {lang === "EL" ? "Υπολογισμός Φύλλων" : "Sheet Calculation"}
  </div>

  {/* GRID ΜΕ 3 ΚΟΥΜΠΙΑ */}
<div className="grid-sheets">

  {/* 1 — Ποσότητα Φύλλων */}
<div className="icon-btn" onClick={() => {
  onStartMode("fromWeight");
  onSelect("fromWeight");
  setScreen("calculator");   // ⭐ ΝΕΟ
}}>
    <img src="/icons/sheets.png" alt="" />
    <div className="btn-title">
      {lang === "EL" ? "Ποσότητα Φύλλων" : "Sheets Quantity"}
    </div>
  </div>

  {/* 2 — Βάρος → Φύλλα */}
<div className="icon-btn" onClick={() => {
  onStartMode("fromSheets");
  onSelect("fromSheets");
  setScreen("calculator");   // ⭐ ΝΕΟ
}}>
    <img src="/icons/weight.png" alt="" />
    <div className="btn-title">
      {lang === "EL" ? "Βάρος Συσκευασίας" : "Package Weight"}
    </div>
  </div>

  {/* 3 — Τεμάχια Εκτύπωσης */}
<div className="icon-btn" onClick={() => {
  onStartMode("printPieces");
  onSelect("printPieces");
  setScreen("calculator");   // ⭐ ΝΕΟ
}}>
  <img src="/icons/print.png" alt="" />
  <div className="btn-title">
    {lang === "EL" ? "Φύλλα Εκτύπωσης" : "Printing Sheets"}
  </div>
</div>

</div>

</div>


<div className="category-block cost-block">
  <img src="/blocks/cost-block.png" className="block-bg" alt="" />

  {/* ΤΙΤΛΟΣ ΠΑΝΩ ΑΠΟ ΤΗΝ ΕΙΚΟΝΑ */}
  <div className="block-title-cost">
    {lang === "EL" ? "Υπολογισμός Κόστους" : "Cost Calculation"}
  </div>

  <div className="grid-cost">

  {/* 1 — Κόστος ανά Φύλλο */}
<div className="icon-btn" onClick={() => {
  onStartMode("fromSheetPrice");
  onSelect("fromSheetPrice");
  setScreen("calculator");   // ⭐ ΝΕΟ
}}>
    <img src="/icons/price-sheet.png" alt="" />
    <div className="btn-title">
      {lang === "EL" ? "Κόστος Φύλλου" : "Sheet Cost"}
    </div>
  </div>

  {/* 2 — Κόστος ανά Κιλό */}
<div className="icon-btn" onClick={() => {
  onStartMode("fromKgPrice");
  onSelect("fromKgPrice");
  setScreen("calculator");   // ⭐ ΝΕΟ
}}>
    <img src="/icons/price-kg.png" alt="" />
    <div className="btn-title">
      {lang === "EL" ? "Τιμή Κιλού" : "Price per Kilo"}
    </div>
  </div>

</div>
</div>

</div>

    </div>
  );
}

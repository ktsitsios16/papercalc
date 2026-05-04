import React, { useState, useEffect } from "react";

const GSM_OPTIONS = [70,80,90,100,115,130,150,170,200,250,300,350];
const WEIGHTS = [500,1000,1200,1500,2000];

const SIZE_GROUPS = {
  Δημοφιλής Διαστάσεις: [
    {label:"50 x 70", w:50, h:70},
    {label:"70 x 100", w:70, h:100},
    {label:"72 x 102", w:72, h:102},
    {label:"43 x 61", w:43, h:61},
    {label:"61 x 86", w:61, h:86},
    {label:"64 x 88", w:64, h:88},
  ],
  A: [
    {label:"A0 (84.1×118.9)", w:84.1, h:118.9},
    {label:"A1 (59.4×84.1)", w:59.4, h:84.1},
    {label:"A2 (42×59.4)", w:42, h:59.4},
    {label:"A3 (29.7×42)", w:29.7, h:42},
    {label:"A4 (21×29.7)", w:21, h:29.7},
    {label:"A5 (14.8×21)", w:14.8, h:21},
  ],
  B: [
    {label:"B0 (100×141.4)", w:100, h:141.4},
    {label:"B1 (70.7×100)", w:70.7, h:100},
    {label:"B2 (50×70.7)", w:50, h:70.7},
    {label:"B3 (35.3×50)", w:35.3, h:50},
    {label:"B4 (25×35.3)", w:25, h:35.3},
    {label:"B5 (17.6×25)", w:17.6, h:25},
  ]
};

function calcSheets(weightKg, gsm, w, h){
  if(!weightKg || !gsm || !w || !h) return 0;
  const area = (w*h)/10000;
  const sheetWeight = area * gsm;
  return Math.round((weightKg*1000)/sheetWeight);
}

function calcSheetWeight(gsm, w, h){
  if(!gsm || !w || !h) return 0;
  const area = (w*h)/10000;
  return area * gsm; // grams per sheet
}

function calcTotalWeight(sheets, gsm, w, h){
  if(!sheets || !gsm || !w || !h) return 0;
  const sheetWeight = calcSheetWeight(gsm,w,h);
  return (sheetWeight * sheets)/1000; // kg
}

function calcPricePerSheet(priceKg, gsm, w, h){
  if(!priceKg || !gsm || !w || !h) return 0;
  const area = (w*h)/10000;
  const sheetWeight = area * gsm;
  return priceKg * (sheetWeight/1000);
}

function calcPricePerKg(priceSheet, gsm, w, h){
  if(!priceSheet || !gsm || !w || !h) return 0;
  const area = (w*h)/10000;
  const sheetWeight = area * gsm;
  return (priceSheet*1000)/sheetWeight;
}

export default function App(){
  const [lang,setLang] = useState("gr");

  const t = {
    gr: {
      sheets:"Φύλλα",
      price:"Τιμή",
      weight:"Βάρος (kg)",
      gsm:"GSM",
      customGsm:"Άλλο βάρος (GSM)",
      size:"Διάσταση (cm)",
      width:"Μήκος (cm)",
      height:"Ύψος (cm)",
      priceKg:"Τιμή κιλού",
      priceSheet:"Τιμή φύλλου",
      sheetsResult: "φύλλα",
      sheetWeightLabel: "Βάρος φύλλου",
      totalWeightLabel: "Συνολικό βάρος"
    },
    en: {
      sheets:"Sheets",
      price:"Price",
      weight:"Weight (kg)",
      gsm:"GSM",
      customGsm:"Custom weight (GSM)",
      size:"Size (cm)",
      width:"Width (cm)",
      height:"Height (cm)",
      priceKg:"Price per kg",
      priceSheet:"Price per sheet",
      sheetsResult: "sheets",
      sheetWeightLabel: "Sheet weight",
      totalWeightLabel: "Total weight"
    }
  };

  const tr = t[lang];
  const [tab,setTab] = useState("sheets");
  const [gsm,setGsm] = useState(115);
  const [customGsm,setCustomGsm] = useState("");
  const [size,setSize] = useState(SIZE_GROUPS.commercial[1]);
  const [customSize,setCustomSize] = useState({w:"",h:""});
  const [weight,setWeight] = useState(1000);
  const [selectedWeight, setSelectedWeight] = useState(1000);
  useEffect(() => {
  const match = WEIGHTS.find(w => w === weight);
  setSelectedWeight(match || null);
}, [weight]);
  const [price,setPrice] = useState(1.2);
  const [mode,setMode] = useState("kgToSheet");

  const activeGsm = customGsm ? Number(customGsm) : gsm;
  const activeW = customSize.w ? Number(customSize.w) : size.w;
  const activeH = customSize.h ? Number(customSize.h) : size.h;

  const sheets = calcSheets(weight,activeGsm,activeW,activeH);
  const sheetWeight = calcSheetWeight(activeGsm,activeW,activeH);
  const totalWeightFromSheets = calcTotalWeight(sheets,activeGsm,activeW,activeH);
  const priceSheet = calcPricePerSheet(price,activeGsm,activeW,activeH);
  const priceKg = calcPricePerKg(price,activeGsm,activeW,activeH);

  const isKgMode = mode === "kgToSheet";

  const inputBase = "w-full p-3 border-2 rounded-xl text-lg font-semibold shadow-sm focus:outline-none";

  const renderSizeButtons = (group) => (
    <div className="mb-2">
      <div className="text-xs font-semibold text-gray-500 mb-1">{group}</div>
      <div className="grid grid-cols-3 gap-1">
        {SIZE_GROUPS[group].map(s => (
          <button
            key={s.label}
            onClick={()=>{setSize(s); setCustomSize({w:String(s.w),h:String(s.h)});}}
            className={`p-1 text-xs rounded ${activeW===s.w && activeH===s.h ? "bg-gray-800 text-white" : "bg-gray-200"}`}
          >
            {(() => { const parts = s.label.split("("); return (<><span className="font-bold">{parts[0].trim()}</span>{parts[1] ? ` (${parts[1]}` : ""} cm</>); })()}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">PaperCalc PRO</h1>
        <div className="flex bg-gray-200 rounded-lg overflow-hidden text-sm">
          <button onClick={()=>setLang("gr")} className={`px-3 py-1 ${lang==="gr"?"bg-gray-800 text-white":""}`}>GR</button>
          <button onClick={()=>setLang("en")} className={`px-3 py-1 ${lang==="en"?"bg-gray-800 text-white":""}`}>EN</button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={()=>setTab("sheets")} className={`flex-1 p-2 rounded font-semibold ${tab === "sheets" ? "bg-gray-800 text-white" : "bg-gray-200"}`}>{tr.sheets}</button>
        <button onClick={()=>setTab("price")} className={`flex-1 p-2 rounded font-semibold ${tab === "price" ? "bg-gray-800 text-white" : "bg-gray-200"}`}>{tr.price}</button>
      </div>

      {tab === "sheets" && (
        <>
          <div className="mb-3">
            <label className="block text-lg font-semibold text-gray-700 mb-1">{tr.weight}</label>
            <input type="number" value={weight} onChange={e=>setWeight(Number(e.target.value))} className={`${inputBase} bg-green-50 border-green-400 focus:ring-green-300`} />
            <div className="flex gap-2 mt-1">
              {WEIGHTS.map(v => (
                <button
                  key={v}
                  onClick={()=>{ setWeight(v); setSelectedWeight(v); }}
                  className={`flex-1 rounded p-1 text-sm ${selectedWeight===v ? "bg-gray-800 text-white" : "bg-gray-200"}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-lg font-semibold text-gray-700 mb-1">{tr.gsm}</label>
            <input placeholder={tr.customGsm} type="number" value={customGsm} onChange={e=>setCustomGsm(e.target.value)} className={`${inputBase} bg-blue-50 border-blue-400 focus:ring-blue-300`} />
            <div className="grid grid-cols-4 gap-1 mt-1">
              {GSM_OPTIONS.map(g => (
                <button key={g} onClick={()=>{setGsm(g); setCustomGsm(String(g));}} className={`p-1 text-sm rounded ${activeGsm===g ? "bg-gray-800 text-white" : "bg-gray-200"}`}>{g}</button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-lg font-semibold text-gray-700 mb-1">{tr.size}</label>
            <div className="flex gap-2 mb-1">
              <input placeholder={tr.width} type="number" value={customSize.w} onChange={e=>setCustomSize({...customSize,w:e.target.value})} className={`${inputBase} bg-purple-50 border-purple-400 focus:ring-purple-300`} />
              <input placeholder={tr.height} type="number" value={customSize.h} onChange={e=>setCustomSize({...customSize,h:e.target.value})} className={`${inputBase} bg-purple-50 border-purple-400 focus:ring-purple-300`} />
            </div>
            {renderSizeButtons('commercial')}
            {renderSizeButtons('A')}
            {renderSizeButtons('B')}
          </div>
          <div className="mt-4 p-4 text-center font-semibold bg-gray-100 text-gray-900 rounded-2xl border border-gray-300">
            <div className="text-2xl font-bold">
              {sheets.toLocaleString()} {tr.sheetsResult}
              <div className="text-[11px] opacity-70 mt-1">
                {tr.sheetWeightLabel}: {sheetWeight.toFixed(2)} g
              </div>
              <div className="text-[11px] opacity-70">
                {tr.totalWeightLabel}: {totalWeightFromSheets.toFixed(2)} kg
              </div>
              <div className="text-[11px] opacity-60 mt-1">
                ({activeW} × {activeH} cm • {activeGsm} gsm)
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "price" && (
        <>
          <div className="flex gap-2 mb-2">
            <button onClick={()=>setMode("kgToSheet")} className={`flex-1 p-2 rounded font-semibold ${isKgMode ? "bg-blue-500 text-white" : "bg-gray-200"}`}>€/kg → sheet</button>
            <button onClick={()=>setMode("sheetToKg")} className={`flex-1 p-2 rounded font-semibold ${!isKgMode ? "bg-purple-500 text-white" : "bg-gray-200"}`}>sheet → €/kg</button>
          </div>

          <div className="mb-3">
            <label className="block text-lg font-semibold text-gray-700 mb-1">{isKgMode ? tr.priceKg : tr.priceSheet}</label>
            <input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} className={`${inputBase} bg-orange-50 border-orange-400 focus:ring-orange-300`} />
          </div>

          <div className="mb-3">
            <label className="block text-lg font-semibold text-gray-700 mb-1">{tr.gsm}</label>
            <input placeholder={tr.customGsm} type="number" value={customGsm} onChange={e=>setCustomGsm(e.target.value)} className={`${inputBase} bg-blue-50 border-blue-400 focus:ring-blue-300`} />
            <div className="grid grid-cols-4 gap-1 mt-1">
              {GSM_OPTIONS.map(g => (
                <button key={g} onClick={()=>{setGsm(g); setCustomGsm(String(g));}} className={`p-1 text-sm rounded ${activeGsm===g ? "bg-gray-800 text-white" : "bg-gray-200"}`}>{g}</button>
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-lg font-semibold text-gray-700 mb-1">{tr.size}</label>
            <div className="flex gap-2 mb-1">
              <input placeholder={tr.width} type="number" value={customSize.w} onChange={e=>setCustomSize({...customSize,w:e.target.value})} className={`${inputBase} bg-purple-50 border-purple-400 focus:ring-purple-300`} />
              <input placeholder={tr.height} type="number" value={customSize.h} onChange={e=>setCustomSize({...customSize,h:e.target.value})} className={`${inputBase} bg-purple-50 border-purple-400 focus:ring-purple-300`} />
            </div>
            {renderSizeButtons('commercial')}
            {renderSizeButtons('A')}
            {renderSizeButtons('B')}
          </div>
<div className="mt-4 p-4 text-center font-semibold bg-gray-100 text-gray-900 rounded-2xl border border-gray-300">
             <div className="text-2xl font-bold">{isKgMode ? `${priceSheet.toFixed(3)} €/${tr.sheetsResult}` : `${priceKg.toFixed(2)} €/kg`}
            <div className="text-xs opacity-60 mt-1">({activeW} × {activeH} cm • {activeGsm} gsm)</div></div>
          </div>
        </>
      )}
    </div>
  );
}
 
            
          
          

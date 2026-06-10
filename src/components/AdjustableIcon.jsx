import { useState } from "react";

export default function AdjustableIcon({
  src,
  label,
  onClick,
  defaultTop = 50,
  defaultLeft = 50,
  defaultWidth = 100,
  defaultHeight = 100
}) {
  const [top, setTop] = useState(defaultTop);
  const [left, setLeft] = useState(defaultLeft);
  const [width, setWidth] = useState(defaultWidth);
  const [height, setHeight] = useState(defaultHeight);

  return (
    <>
      {/* Το εικονίδιο */}
      <div
        className="adjustable-icon"
        onClick={onClick}
        style={{
          position: "absolute",
          top,
          left,
          width,
          height,
          cursor: "pointer"
        }}
      >
        <img
          src={src}
          alt=""
          style={{ width: "100%", height: "100%" }}
        />
        <div className="btn-title">{label}</div>
      </div>

      {/* Controls για ρύθμιση */}
      <div className="adjust-controls">
        <label>Top</label>
        <input type="number" value={top} onChange={e => setTop(Number(e.target.value))} />

        <label>Left</label>
        <input type="number" value={left} onChange={e => setLeft(Number(e.target.value))} />

        <label>Width</label>
        <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} />

        <label>Height</label>
        <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} />
      </div>
    </>
  );
}
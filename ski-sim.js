const canvas = document.getElementById("ski-sim");
const ctx = canvas.getContext("2d");

const edgeSlider = document.getElementById("edge-angle");
const radiusSlider = document.getElementById("turn-radius");

function drawSim() {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background snow / slope indicator
  ctx.fillStyle = "#e5f0ff";
  ctx.fillRect(0, 0, w, h * 0.55);
  ctx.fillStyle = "#f4f4f5";
  ctx.fillRect(0, h * 0.55, w, h * 0.45);

  // Draw "fall line"
  ctx.strokeStyle = "#cbd5f5";
  ctx.setLineDash([4, 5]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w * 0.5, 10);
  ctx.lineTo(w * 0.5, h - 10);
  ctx.stroke();
  ctx.setLineDash([]);

  const edgeAngleDeg = parseFloat(edgeSlider.value);
  const turnRadius = parseFloat(radiusSlider.value);

  // Map values for display
  const edgeAngleRad = (edgeAngleDeg * Math.PI) / 180;

  // Skier position (center)
  const cx = w * 0.5;
  const cy = h * 0.65;

  // Draw turn arc (simplified)
  ctx.strokeStyle = "#818cf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const arcRadius = turnRadius * 0.9;
  const arcStart = Math.PI * 1.05;
  const arcEnd = Math.PI * 1.9;
  ctx.arc(cx - arcRadius * 0.4, cy + 40, arcRadius, arcStart, arcEnd);
  ctx.stroke();

  // Skis
  const skiLength = 90;
  const skiWidth = 7;
  const skiAngle = -Math.PI / 2 + edgeAngleRad * 0.65;

  function drawSki(offset) {
    ctx.save();
    ctx.translate(cx + offset, cy);
    ctx.rotate(skiAngle);
    const gradient = ctx.createLinearGradient(-skiLength / 2, 0, skiLength / 2, 0);
    gradient.addColorStop(0, "#1e40af");
    gradient.addColorStop(1, "#38bdf8");
    ctx.fillStyle = gradient;
    ctx.fillRect(-skiLength / 2, -skiWidth / 2, skiLength, skiWidth);
    ctx.restore();
  }

  drawSki(-8);
  drawSki(8);

  // Skier body (simplified figure)
  ctx.save();
  ctx.translate(cx, cy - 24);

  // Torso lean proportional to edge angle
  const lean = edgeAngleRad * 0.6;
  ctx.rotate(lean);

  // Torso
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.lineTo(0, 12);
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(0, -22, 6, 0, Math.PI * 2);
  ctx.fillStyle = "#111827";
  ctx.fill();

  // Arms
  ctx.beginPath();
  ctx.moveTo(0, -6);
  ctx.lineTo(-14, 4);
  ctx.moveTo(0, -6);
  ctx.lineTo(14, 4);
  ctx.stroke();

  ctx.restore();

  // Simple labels
  ctx.fillStyle = "#111827";
  ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillText(`Edge angle: ${edgeAngleDeg}°`, 12, h - 35);
  ctx.fillText(`Turn radius: ${Math.round(turnRadius)} (relative)`, 12, h - 18);
}

edgeSlider.addEventListener("input", drawSim);
radiusSlider.addEventListener("input", drawSim);

drawSim();


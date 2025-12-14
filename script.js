// ===== CANVAS SETUP =====
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1080;
canvas.height = 1080;

// ===== LOAD TEMPLATE =====
const template = new Image();
template.src = "template.png";

// ===== HELPER LOAD IMAGE =====
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// ===== DRAW HEXAGON PATH =====
function drawHexagon(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 3 * i; // flat-top hexagon
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// ===== DRAW IMAGE INSIDE HEXAGON =====
function drawImageInHexagon(ctx, img, cx, cy, r) {
  ctx.save();

  // clip hexagon
  drawHexagon(ctx, cx, cy, r);
  ctx.clip();

  // auto cover (center crop)
  const scale = Math.max(
    (r * 2) / img.width,
    (r * 2) / img.height
  );

  const w = img.width * scale;
  const h = img.height * scale;

  ctx.drawImage(
    img,
    cx - w / 2,
    cy - h / 2,
    w,
    h
  );

  ctx.restore();
}

// ===== MAIN GENERATE FUNCTION =====
async function generate() {
  const f1 = document.getElementById("foto1").files[0];
  const f2 = document.getElementById("foto2").files[0];
  const f3 = document.getElementById("foto3").files[0];

  if (!f1 || !f2 || !f3) {
    alert("Harap upload 3 foto terlebih dahulu");
    return;
  }

  const img1 = await loadImage(f1);
  const img2 = await loadImage(f2);
  const img3 = await loadImage(f3);

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // === DRAW PHOTOS FIRST ===
  drawImageInHexagon(ctx, img1, 318, 539, 215);
  drawImageInHexagon(ctx, img2, 676, 325, 215);
  drawImageInHexagon(ctx, img3, 676, 752, 215);

  // === DRAW TEMPLATE LAST ===
  ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

  // enable download
  const link = document.getElementById("download");
  link.href = canvas.toDataURL("image/png");
  link.style.display = "inline-block";
}

//download
/*
document.getElementById("download").addEventListener("click", function(e) {
  let canvasUrl = canvas.toDataURL("image/jpeg", 1);
  console.log(canvasUrl);
  const createEl = document.createElement("a");
  createEl.href = canvasUrl;
  createEl.download = "download-this-canvas";
  createEl.click();
  createEl.remove();
});
*/
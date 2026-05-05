export function getBresenhamPoints(x0, y0, x1, y1) {
  x0 = Math.round(x0);
  y0 = Math.round(y0);
  x1 = Math.round(x1);
  y1 = Math.round(y1);

  let points = [];
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1;
  let sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    points.push({ x: x0, y: y0 }); // Simpan koordinat ke array
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }
  return points;
}

// Algoritma Midpoint Lingkaran murni
export function getCircleMidpointPoints(xc, yc, r) {
  xc = Math.round(xc);
  yc = Math.round(yc);
  r = Math.round(r);
  let points = [];
  let x = 0;
  let y = r;
  let p = 1 - r;

  function addSymmetricPoints(cx, cy, x, y) {
    points.push(
      { x: cx + x, y: cy + y },
      { x: cx - x, y: cy + y },
      { x: cx + x, y: cy - y },
      { x: cx - x, y: cy - y },
      { x: cx + y, y: cy + x },
      { x: cx - y, y: cy + x },
      { x: cx + y, y: cy - x },
      { x: cx - y, y: cy - x },
    );
  }

  addSymmetricPoints(xc, yc, x, y);
  while (x < y) {
    x++;
    if (p < 0) {
      p += 2 * x + 1;
    } else {
      y--;
      p += 2 * (x - y) + 1;
    }
    addSymmetricPoints(xc, yc, x, y);
  }
  return points;
}

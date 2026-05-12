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

// Algoritma Midpoint Elips murni
export function getEllipseMidpointPoints(xc, yc, rx, ry) {
  xc = Math.round(xc); yc = Math.round(yc);
  rx = Math.round(rx); ry = Math.round(ry);
  let points = [];
  let dx, dy, d1, d2, x, y;
  
  x = 0; y = ry;
  d1 = (ry * ry) - (rx * rx * ry) + (0.25 * rx * rx);
  dx = 2 * ry * ry * x;
  dy = 2 * rx * rx * y;

  function addSymmetricPoints(cx, cy, x, y) {
    points.push({ x: cx + x, y: cy + y });
    points.push({ x: cx - x, y: cy + y });
    points.push({ x: cx + x, y: cy - y });
    points.push({ x: cx - x, y: cy - y });
  }

  while (dx < dy) {
    addSymmetricPoints(xc, yc, x, y);
    if (d1 < 0) {
      x++;
      dx = dx + (2 * ry * ry);
      d1 = d1 + dx + (ry * ry);
    } else {
      x++; y--;
      dx = dx + (2 * ry * ry);
      dy = dy - (2 * rx * rx);
      d1 = d1 + dx - dy + (ry * ry);
    }
  }
  
  d2 = ((ry * ry) * ((x + 0.5) * (x + 0.5))) + ((rx * rx) * ((y - 1) * (y - 1))) - (rx * rx * ry * ry);
  while (y >= 0) {
    addSymmetricPoints(xc, yc, x, y);
    if (d2 > 0) {
      y--;
      dy = dy - (2 * rx * rx);
      d2 = d2 + (rx * rx) - dy;
    } else {
      y--; x++;
      dx = dx + (2 * ry * ry);
      dy = dy - (2 * rx * rx);
      d2 = d2 + dx - dy + (rx * rx);
    }
  }
  return points;
}

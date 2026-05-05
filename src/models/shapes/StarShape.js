import { PolygonShape } from "./PolygonShape.js";

export class StarShape extends PolygonShape {
  constructor(x0, y0, x1, y1, points, color) {
    super(color);
    this.type = `BINTANG_${points}`;

    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    const xc = minX + (maxX - minX) / 2;
    const yc = minY + (maxY - minY) / 2;
    const outerRadius = Math.min(maxX - minX, maxY - minY) / 2;
    const innerRadius = outerRadius / 2.5; // Rasio ketajaman bintang

    const sides = points * 2;
    const angleStep = Math.PI / points;

    for (let i = 0; i < sides; i++) {
      let r = i % 2 === 0 ? outerRadius : innerRadius;
      this.pts.push({
        x: Math.round(xc + r * Math.cos(i * angleStep - Math.PI / 2)),
        y: Math.round(yc + r * Math.sin(i * angleStep - Math.PI / 2)),
      });
    }
  }
}
// Cara memanggil Bintang-5: new StarShape(x0, y0, x1, y1, 5, warna)

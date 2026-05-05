import { PolygonShape } from "./PolygonShape.js";

export class RegularPolygonShape extends PolygonShape {
  constructor(x0, y0, x1, y1, sides, color) {
    super(color);
    this.type = `SEGI_${sides}`;

    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    const xc = minX + (maxX - minX) / 2;
    const yc = minY + (maxY - minY) / 2;
    const radius = Math.min(maxX - minX, maxY - minY) / 2;

    const angleStep = (Math.PI * 2) / sides;
    for (let i = 0; i < sides; i++) {
      this.pts.push({
        x: Math.round(xc + radius * Math.cos(i * angleStep - Math.PI / 2)),
        y: Math.round(yc + radius * Math.sin(i * angleStep - Math.PI / 2)),
      });
    }
  }
}
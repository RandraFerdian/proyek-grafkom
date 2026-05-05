import { PolygonShape } from "./PolygonShape.js";

export class TriangleShape extends PolygonShape {
  constructor(x0, y0, x1, y1, color) {
    super(color);
    this.type = "SEGITIGA";
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    this.pts = [
      { x: Math.round(minX + (maxX - minX) / 2), y: minY }, // Puncak tengah
      { x: maxX, y: maxY }, // Sudut kanan bawah
      { x: minX, y: maxY }, // Sudut kiri bawah
    ];
  }
}

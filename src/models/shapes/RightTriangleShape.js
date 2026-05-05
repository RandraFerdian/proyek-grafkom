import { PolygonShape } from "./PolygonShape.js";

export class RightTriangleShape extends PolygonShape {
  constructor(x0, y0, x1, y1, color) {
    super(color);
    this.type = "SEGITIGA_SIKU";
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    this.pts = [
      { x: minX, y: minY }, // Sudut kiri atas (siku)
      { x: maxX, y: maxY }, // Sudut kanan bawah
      { x: minX, y: maxY }, // Sudut kiri bawah
    ];
  }
}

import { PolygonShape } from "./PolygonShape.js";

export class ArrowShape extends PolygonShape {
  constructor(x0, y0, x1, y1, color) {
    super(color);
    this.type = "PANAH";
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    const w = maxX - minX;
    const h = maxY - minY;

    this.pts = [
      { x: minX, y: Math.round(minY + h * 0.3) }, // Ekor atas
      { x: Math.round(minX + w * 0.5), y: Math.round(minY + h * 0.3) }, // Leher atas
      { x: Math.round(minX + w * 0.5), y: minY }, // Kepala panah atas
      { x: maxX, y: Math.round(minY + h * 0.5) }, // Ujung panah
      { x: Math.round(minX + w * 0.5), y: maxY }, // Kepala panah bawah
      { x: Math.round(minX + w * 0.5), y: Math.round(minY + h * 0.7) }, // Leher bawah
      { x: minX, y: Math.round(minY + h * 0.7) }, // Ekor bawah
    ];
  }
}

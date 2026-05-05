import { PolygonShape } from "./PolygonShape.js";

export class DiamondShape extends PolygonShape {
  constructor(x0, y0, x1, y1, color) {
    super(color);
    this.type = "DIAMOND";
    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);
    const midX = Math.round(minX + (maxX - minX) / 2);
    const midY = Math.round(minY + (maxY - minY) / 2);

    this.pts = [
      { x: midX, y: minY }, // Puncak atas
      { x: maxX, y: midY }, // Puncak kanan
      { x: midX, y: maxY }, // Puncak bawah
      { x: minX, y: midY }, // Puncak kiri
    ];
  }
}

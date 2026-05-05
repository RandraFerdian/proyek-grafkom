import { PolygonShape } from "./PolygonShape.js";

export class RectShape extends PolygonShape {
  constructor(x0, y0, x1, y1, color) {
    super(color);
    this.type = "KOTAK";
    this.pts = [
      { x: x0, y: y0 }, // Kiri atas
      { x: x1, y: y0 }, // Kanan atas
      { x: x1, y: y1 }, // Kanan bawah
      { x: x0, y: y1 }, // Kiri bawah
    ];
  }
}

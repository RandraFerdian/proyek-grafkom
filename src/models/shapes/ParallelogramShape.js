import { PolygonShape } from "./PolygonShape.js";

export class ParallelogramShape extends PolygonShape {
  constructor(x0, y0, x1, y1, color) {
    super(color);
    this.type = "JAJAR_GENJANG";

    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);
    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    const w = maxX - minX;
    // Kemiringan sekitar 25% dari lebarnya
    const offset = Math.round(w * 0.25);

    this.pts = [
      { x: minX + offset, y: minY }, // Sudut Kiri Atas
      { x: maxX, y: minY }, // Sudut Kanan Atas
      { x: maxX - offset, y: maxY }, // Sudut Kanan Bawah
      { x: minX, y: maxY }, // Sudut Kiri Bawah
    ];
  }
}

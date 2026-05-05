import { Shape } from "./Shape.js";
import { applyMatrixToPoint } from "../math/matrix.js";

export class PointShape extends Shape {
  constructor(x, y, color) {
    super(color);
    this.type = "TITIK";
    // Kita masukkan ke array pts agar Bounding Box bawaan Shape.js otomatis bekerja
    this.pts = [{ x: x, y: y }];
  }

  draw(view) {
    // Titik biasanya tidak pakai pola putus-putus, jadi index bisa 0[cite: 1]
    view.putPixel(
      this.pts[0].x,
      this.pts[0].y,
      this.color,
      this.width,
      "solid",
      0,
    );
  }

  applyMatrix(matrix) {
    this.pts[0] = applyMatrixToPoint(matrix, this.pts[0].x, this.pts[0].y);
  }
}

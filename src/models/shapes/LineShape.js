import { Shape } from "./Shape.js";
import { getBresenhamPoints } from "../math/algorithms.js";
import { applyMatrixToPoint } from "../math/matrix.js";

export class LineShape extends Shape {
  constructor(x0, y0, x1, y1, color) {
    super(color);
    this.type = "GARIS";
    this.p0 = { x: x0, y: y0 };
    this.p1 = { x: x1, y: y1 };
  }

  draw(view) {
    const points = getBresenhamPoints(
      this.p0.x,
      this.p0.y,
      this.p1.x,
      this.p1.y,
    );
    points.forEach((p, index) =>
      view.putPixel(p.x, p.y, this.color, this.width, this.style, index),
    );
  }

  applyMatrix(matrix) {
    // Objek garis memperbarui koordinatnya sendiri jika dikenakan matriks
    this.p0 = applyMatrixToPoint(matrix, this.p0.x, this.p0.y);
    this.p1 = applyMatrixToPoint(matrix, this.p1.x, this.p1.y);
  }
}

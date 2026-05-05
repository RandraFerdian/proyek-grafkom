import { Shape } from "./Shape.js";
import { getBresenhamPoints } from "../math/algorithms.js";
import { applyMatrixToPoint } from "../math/matrix.js";

export class CurveShape extends Shape {
  constructor(x0, y0, x1, y1, color) {
    super(color);
    this.type = "KURVA";
    this.p0 = { x: x0, y: y0 };
    this.p2 = { x: x1, y: y1 };
    this.p1 = {
      x: x0 + (x1 - x0) / 2,
      y: y0 - 100, 
    };
  }

  draw(view) {
    const segments = 20;
    let prevPoint = this.p0;
    let globalIndex = 0; 

    for (let i = 1; i <= segments; i++) {
      let t = i / segments;
      let nextX = Math.round(
        Math.pow(1 - t, 2) * this.p0.x +
          2 * (1 - t) * t * this.p1.x +
          Math.pow(t, 2) * this.p2.x,
      );
      let nextY = Math.round(
        Math.pow(1 - t, 2) * this.p0.y +
          2 * (1 - t) * t * this.p1.y +
          Math.pow(t, 2) * this.p2.y,
      );
      let points = getBresenhamPoints(prevPoint.x, prevPoint.y, nextX, nextY);

      points.forEach((p) => {
        view.putPixel(
          p.x,
          p.y,
          this.color,
          this.width,
          this.style,
          globalIndex,
        );
        globalIndex++;
      });
      prevPoint = { x: nextX, y: nextY };
    }
  }

  applyMatrix(matrix) {
    this.p0 = applyMatrixToPoint(matrix, this.p0.x, this.p0.y);
    this.p1 = applyMatrixToPoint(matrix, this.p1.x, this.p1.y);
    this.p2 = applyMatrixToPoint(matrix, this.p2.x, this.p2.y);
  }
}

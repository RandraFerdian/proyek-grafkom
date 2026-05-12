import { Shape } from "./Shape.js";
import { getEllipseMidpointPoints } from "../math/algorithms.js";
import { applyMatrixToPoint } from "../math/matrix.js";

export class EllipseShape extends Shape {
  constructor(xc, yc, rx, ry, color) {
    super(color);
    this.type = "ELIPS";
    this.center = { x: xc, y: yc };
    this.rx = rx; // Radius Horizontal
    this.ry = ry; // Radius Vertikal
  }

  draw(view) {
    if (this.useFill) {
      view.ctx.fillStyle = this.fillColor;
      view.ctx.beginPath();
      view.ctx.ellipse(
        this.center.x,
        this.center.y,
        this.rx,
        this.ry,
        0,
        0,
        Math.PI * 2,
      );
      view.ctx.fill();
    }

    const points = getEllipseMidpointPoints(
      this.center.x,
      this.center.y,
      this.rx,
      this.ry,
    );
    points.forEach((p, index) =>
      view.putPixel(p.x, p.y, this.color, this.width, this.style, index),
    );
  }

  applyMatrix(matrix) {
    this.center = applyMatrixToPoint(matrix, this.center.x, this.center.y);
  }

  getBoundingBox() {
    return {
      minX: this.center.x - this.rx,
      maxX: this.center.x + this.rx,
      minY: this.center.y - this.ry,
      maxY: this.center.y + this.ry,
    };
  }
}

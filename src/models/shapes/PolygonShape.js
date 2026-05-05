import { Shape } from "./Shape.js";
import { getBresenhamPoints } from "../math/algorithms.js";
import { applyMatrixToPoint } from "../math/matrix.js";

export class PolygonShape extends Shape {
  constructor(color) {
    super(color);
    this.pts = [];
  }

  draw(view) {
    if (this.pts.length < 2) return;

    // FUNGSI BARU: Mewarnai bagian dalam menggunakan Canvas API
    if (this.useFill) {
      view.ctx.fillStyle = this.fillColor;
      view.ctx.beginPath();
      view.ctx.moveTo(this.pts[0].x, this.pts[0].y);
      for (let i = 1; i < this.pts.length; i++) {
        view.ctx.lineTo(this.pts[i].x, this.pts[i].y);
      }
      view.ctx.closePath();
      view.ctx.fill();
    }

    // Menggambar garis pinggir (Outline) dengan Bresenham
    let globalIndex = 0;
    for (let i = 0; i < this.pts.length; i++) {
      let next = (i + 1) % this.pts.length;
      let points = getBresenhamPoints(
        this.pts[i].x,
        this.pts[i].y,
        this.pts[next].x,
        this.pts[next].y,
      );
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
    }
  }

  applyMatrix(matrix) {
    // Otomatis menggeser/memutar/menskala semua titik sudut
    this.pts = this.pts.map((p) => applyMatrixToPoint(matrix, p.x, p.y));
  }
}

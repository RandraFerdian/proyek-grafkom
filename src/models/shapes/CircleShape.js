import { Shape } from "./Shape.js";
import { getCircleMidpointPoints } from "../math/algorithms.js";
import { applyMatrixToPoint } from "../math/matrix.js";

export class CircleShape extends Shape {
  constructor(xc, yc, r, color) {
    super(color);
    this.type = "LINGKARAN";
    this.center = { x: xc, y: yc };
    this.r = r;
  }

  draw(view) {
    // FUNGSI BARU: Mewarnai bagian dalam lingkaran
    if (this.useFill) {
      view.ctx.fillStyle = this.fillColor;
      view.ctx.beginPath();
      view.ctx.arc(this.center.x, this.center.y, this.r, 0, Math.PI * 2);
      view.ctx.fill();
    }

    // Menggambar garis luar dengan Midpoint
    const points = getCircleMidpointPoints(
      this.center.x,
      this.center.y,
      this.r,
    );
    points.forEach((p, index) =>
      view.putPixel(p.x, p.y, this.color, this.width, this.style, index),
    );
  }

  applyMatrix(matrix) {
    this.center = applyMatrixToPoint(matrix, this.center.x, this.center.y);

    // Catatan: Jika ada skala (scale), radius (r) juga harus dikalikan di sini.
    // Tapi untuk translasi dan rotasi, cukup titik pusatnya saja.
  }
}

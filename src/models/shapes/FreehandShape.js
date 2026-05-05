import { Shape } from "./Shape.js";
import { getBresenhamPoints } from "../math/algorithms.js";
import { applyMatrixToPoint } from "../math/matrix.js";

export class FreehandShape extends Shape {
  constructor(color) {
    super(color);
    this.type = "FREEHAND";
    this.pts = []; // Menyimpan ratusan titik coretan
  }

  draw(view) {
    if (this.pts.length < 2) return;
    let globalIndex = 0;

    // Menyambungkan semua titik coretan dengan Bresenham
    for (let i = 0; i < this.pts.length - 1; i++) {
      let points = getBresenhamPoints(
        this.pts[i].x,
        this.pts[i].y,
        this.pts[i + 1].x,
        this.pts[i + 1].y,
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
    // Coretan bebas juga bisa digeser dan diskala!
    this.pts = this.pts.map((p) => applyMatrixToPoint(matrix, p.x, p.y));
  }
}

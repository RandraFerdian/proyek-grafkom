export class Shape {
  constructor(color = "#000000") {
    this.color = color;
    this.width = 2;
    this.style = "solid";
    this.fillColor = "#cccccc";
    this.useFill = false;
    this.type = "SHAPE";
  }

  draw(view) {
    throw new Error("Method draw() harus di-override oleh kelas anak!");
  }
  applyMatrix(matrix) {
    throw new Error("Method applyMatrix() harus di-override!");
  }

  // RUMUS SAKTI 1: Membuat Bounding Box otomatis untuk semua bangun
  getBoundingBox() {
    let xs = [],
      ys = [];

    // Mengecek apakah bangun ini punya properti 'pts' (Polygon, Kotak, Bintang, dll)
    if (this.pts && this.pts.length > 0) {
      xs = this.pts.map((p) => p.x);
      ys = this.pts.map((p) => p.y);
    }
    // Mengecek apakah ini Garis (punya p0 dan p1)
    else if (this.p0 && this.p1 && !this.p2) {
      xs = [this.p0.x, this.p1.x];
      ys = [this.p0.y, this.p1.y];
    }
    // Mengecek apakah ini Lingkaran (punya center dan radius)
    else if (this.center && this.r !== undefined) {
      return {
        minX: this.center.x - this.r,
        maxX: this.center.x + this.r,
        minY: this.center.y - this.r,
        maxY: this.center.y + this.r,
      };
    } else {
      return null; // Jika bentuk tidak dikenali
    }

    // Mencari nilai titik paling ujung
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }

  // RUMUS SAKTI 2: Mendeteksi apakah klik mouse berada di dalam Bounding Box
  isPointInside(x, y) {
    const bbox = this.getBoundingBox();
    if (!bbox) return false;

    const tolerance = 5; // Area toleransi 5 piksel agar mudah diklik
    return (
      x >= bbox.minX - tolerance &&
      x <= bbox.maxX + tolerance &&
      y >= bbox.minY - tolerance &&
      y <= bbox.maxY + tolerance
    );
  }
}

// #fungsi untuk memproduksi objek bangun datar berdasarkan jenis alat (tool)
import { AppState } from "../models/AppState.js";
import { PointShape } from "../models/shapes/PointShape.js";
import { LineShape } from "../models/shapes/LineShape.js";
import { RectShape } from "../models/shapes/RectShape.js";
import { TriangleShape } from "../models/shapes/TriangleShape.js";
import { RightTriangleShape } from "../models/shapes/RightTriangleShape.js";
import { DiamondShape } from "../models/shapes/DiamondShape.js";
import { ArrowShape } from "../models/shapes/ArrowShape.js";
import { RegularPolygonShape } from "../models/shapes/RegularPolygonShape.js";
import { StarShape } from "../models/shapes/StarShape.js";
import { CurveShape } from "../models/shapes/CurveShape.js";
import { CircleShape } from "../models/shapes/CircleShape.js";
import { FreehandShape } from "../models/shapes/FreehandShape.js";
import { EllipseShape } from "../models/shapes/EllipseShape.js";
import { ParallelogramShape } from "../models/shapes/ParallelogramShape.js";

export class ShapeFactory {
  static createShape(tool, x0, y0, x1, y1, color) {
    let shape = null;
    switch (tool) {
      case "TITIK":
        shape = new PointShape(x1, y1, color);
        break;
      case "GARIS":
        shape = new LineShape(x0, y0, x1, y1, color);
        break;
      case "KOTAK":
        shape = new RectShape(x0, y0, x1, y1, color);
        break;
      case "SEGITIGA":
        shape = new TriangleShape(x0, y0, x1, y1, color);
        break;
      case "SEGITIGA_SIKU":
        shape = new RightTriangleShape(x0, y0, x1, y1, color);
        break;
      case "DIAMOND":
        shape = new DiamondShape(x0, y0, x1, y1, color);
        break;
      case "PANAH":
        shape = new ArrowShape(x0, y0, x1, y1, color);
        break;
      case "SEGI5":
        shape = new RegularPolygonShape(x0, y0, x1, y1, 5, color);
        break;
      case "SEGI6":
        shape = new RegularPolygonShape(x0, y0, x1, y1, 6, color);
        break;
      case "BINTANG":
        shape = new StarShape(x0, y0, x1, y1, 5, color);
        break;
      case "KURVA":
        shape = new CurveShape(x0, y0, x1, y1, color);
        break;
      case "LINGKARAN": {
        const r = Math.round(
          Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2)),
        );
        shape = new CircleShape(x0, y0, r, color);
        break;
      }
      case "ELIPS": {
        const rx = Math.round(Math.abs(x1 - x0) / 2);
        const ry = Math.round(Math.abs(y1 - y0) / 2);
        const cx = Math.min(x0, x1) + rx;
        const cy = Math.min(y0, y1) + ry;
        shape = new EllipseShape(cx, cy, rx, ry, color);
        break;
      }
      case "JAJAR_GENJANG":
        shape = new ParallelogramShape(x0, y0, x1, y1, color);
        break;
    }
    // Pasang atribut ketebalan dan gaya bawaan
    if (shape) {
      shape.width = AppState.lineWidth;
      shape.style = AppState.lineStyle;
      shape.fillColor = AppState.fillColor;
      shape.useFill = AppState.useFill;
    }
    return shape;
  }
}

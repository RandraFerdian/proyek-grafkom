// #fungsi untuk mendengarkan perubahan slider transformasi dan menerapkan matriks
import { AppState } from "../models/AppState.js";
import { HistoryManager } from "../utils/HistoryManager.js";
import {
  getShearMatrix,
  getReflectMatrix,
  getRotateMatrix,
  getScaleMatrix,
  applyCompositeMatrix,
} from "../models/math/matrix.js";

export class TransformController {
  constructor(canvasView) {
    this.canvasView = canvasView;
    this.init();
  }

  init() {
    const getPivot = () => {
      if (!AppState.selectedShape) return null;
      const bbox = AppState.selectedShape.getBoundingBox();
      return {
        x: bbox.minX + (bbox.maxX - bbox.minX) / 2,
        y: bbox.minY + (bbox.maxY - bbox.minY) / 2,
      };
    };

    const cloneShape = (shape) => {
      const clone = Object.assign(
        Object.create(Object.getPrototypeOf(shape)),
        shape,
      );
      if (clone.pts) clone.pts = clone.pts.map((p) => ({ ...p }));
      if (clone.p0) clone.p0 = { ...clone.p0 };
      if (clone.p1) clone.p1 = { ...clone.p1 };
      if (clone.p2) clone.p2 = { ...clone.p2 };
      if (clone.center) clone.center = { ...clone.center };
      return clone;
    };

    let tempShape = null;

    const setupSlider = (
      sliderId,
      labelId,
      formatValue,
      getMatrix,
      applySpecifics = null,
    ) => {
      const slider = document.getElementById(sliderId);
      const label = document.getElementById(labelId);
      if (!slider) return;

      slider.addEventListener("mousedown", () => {
        if (AppState.selectedShape)
          tempShape = cloneShape(AppState.selectedShape);
      });

      slider.addEventListener("input", (e) => {
        if (!tempShape || !AppState.selectedShape) return;
        const val = parseFloat(e.target.value);
        const actualVal =
          sliderId === "sl-skala" || sliderId === "sl-shear" ? val / 10 : val;
        label.textContent = formatValue(actualVal);

        if (tempShape.pts)
          AppState.selectedShape.pts = tempShape.pts.map((p) => ({ ...p }));
        if (tempShape.p0) AppState.selectedShape.p0 = { ...tempShape.p0 };
        if (tempShape.p1) AppState.selectedShape.p1 = { ...tempShape.p1 };
        if (tempShape.center)
          AppState.selectedShape.center = { ...tempShape.center };
        if (tempShape.r) AppState.selectedShape.r = tempShape.r;

        const pivot = getPivot();
        applyCompositeMatrix(
          AppState.selectedShape,
          getMatrix(actualVal),
          pivot.x,
          pivot.y,
        );
        if (applySpecifics) applySpecifics(actualVal, tempShape);

        this.canvasView.renderAll(
          AppState.shapes,
          AppState.selectedShape,
          AppState.bgImage,
        );
      });

      slider.addEventListener("change", (e) => {
        if (tempShape) {
          HistoryManager.saveState();
          tempShape = null;
          const defaultValue = sliderId === "sl-skala" ? 10 : 0;
          e.target.value = defaultValue;
          label.textContent = formatValue(sliderId === "sl-skala" ? 1 : 0);
        }
      });
    };

    setupSlider(
      "sl-rotasi",
      "lbl-rotasi",
      (v) => Math.round(v) + "°",
      (v) => getRotateMatrix(v),
    );
    setupSlider(
      "sl-skala",
      "lbl-skala",
      (v) => v.toFixed(1) + "x",
      (v) => getScaleMatrix(v, v),
      (v, temp) => {
        if (AppState.selectedShape.type === "LINGKARAN")
          AppState.selectedShape.r = temp.r * v;
      },
    );
    setupSlider(
      "sl-shear",
      "lbl-shear",
      (v) => v.toFixed(1),
      (v) => getShearMatrix(v, 0),
    );

    document.getElementById("btn-refleksi")?.addEventListener("click", () => {
      const pivot = getPivot();
      if (!pivot) return;
      const axis = document.getElementById("sel-refleksi").value;
      applyCompositeMatrix(
        AppState.selectedShape,
        getReflectMatrix(axis),
        pivot.x,
        pivot.y,
      );
      this.canvasView.renderAll(
        AppState.shapes,
        AppState.selectedShape,
        AppState.bgImage,
      );
      HistoryManager.saveState();
    });
  }
}

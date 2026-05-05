// #fungsi untuk menyimpan dan mengembalikan riwayat kanvas (Undo/Redo)
import { AppState } from "../models/AppState.js";

export class HistoryManager {
  static saveState() {
    const clonedShapes = AppState.shapes.map((s) => {
      const clone = Object.assign(Object.create(Object.getPrototypeOf(s)), s);
      if (clone.pts) clone.pts = clone.pts.map((p) => ({ ...p }));
      if (clone.p0) clone.p0 = { ...clone.p0 };
      if (clone.p1) clone.p1 = { ...clone.p1 };
      if (clone.p2) clone.p2 = { ...clone.p2 };
      if (clone.center) clone.center = { ...clone.center };
      return clone;
    });

    AppState.undoStack.push({
      shapes: clonedShapes,
      bgImage: AppState.bgImage,
    });
    AppState.redoStack = [];
  }

  static restoreState(stateObj, canvasView) {
    AppState.shapes = stateObj.shapes;
    AppState.bgImage = stateObj.bgImage;
    AppState.selectedShape = null;
    canvasView.renderAll(AppState.shapes, null, AppState.bgImage);
  }
}

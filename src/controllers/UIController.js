// #fungsi untuk menghubungkan input warna, garis, serta tombol aksi ke kanvas
import { AppState } from "../models/AppState.js";
import { HistoryManager } from "../utils/HistoryManager.js";

export class UIController {
  constructor(canvasView) {
    this.canvasView = canvasView;
    this.initProperties();
    this.initActions();
  }

  initProperties() {
    const attachListener = (
      id,
      stateKey,
      updateShapeKey,
      isCheckbox = false,
    ) => {
      document
        .getElementById(id)
        ?.addEventListener(isCheckbox ? "change" : "input", (e) => {
          const val = isCheckbox ? e.target.checked : e.target.value;
          AppState[stateKey] = val;
          if (AppState.selectedShape) {
            AppState.selectedShape[updateShapeKey] = val;
            this.canvasView.renderAll(
              AppState.shapes,
              AppState.selectedShape,
              AppState.bgImage,
            );
          }
        });
      document
        .getElementById(id)
        ?.addEventListener("change", () => HistoryManager.saveState());
    };

    attachListener("color-picker", "currentColor", "color");
    attachListener("fill-color-picker", "fillColor", "fillColor");
    attachListener("use-fill-checkbox", "useFill", "useFill", true);
    attachListener("line-style", "lineStyle", "style");

    const widthSlider = document.getElementById("line-width");
    widthSlider?.addEventListener("input", (e) => {
      AppState.lineWidth = parseInt(e.target.value);
      document.getElementById("width-label").textContent =
        AppState.lineWidth + "px";
      if (AppState.selectedShape) {
        AppState.selectedShape.width = AppState.lineWidth;
        this.canvasView.renderAll(
          AppState.shapes,
          AppState.selectedShape,
          AppState.bgImage,
        );
      }
    });
    widthSlider?.addEventListener("change", () => HistoryManager.saveState());
  }

  initActions() {
    document.getElementById("btn-undo")?.addEventListener("click", () => {
      if (AppState.undoStack.length > 1) {
        AppState.redoStack.push(AppState.undoStack.pop());
        HistoryManager.restoreState(
          AppState.undoStack[AppState.undoStack.length - 1],
          this.canvasView,
        );
      }
    });

    document.getElementById("btn-redo")?.addEventListener("click", () => {
      if (AppState.redoStack.length > 0) {
        const state = AppState.redoStack.pop();
        AppState.undoStack.push(state);
        HistoryManager.restoreState(state, this.canvasView);
      }
    });

    document.getElementById("btn-delete")?.addEventListener("click", () => {
      if (AppState.selectedShape) {
        AppState.shapes = AppState.shapes.filter(
          (s) => s !== AppState.selectedShape,
        );
        AppState.selectedShape = null;
        this.canvasView.renderAll(AppState.shapes, null, AppState.bgImage);
        HistoryManager.saveState();
      }
    });

    document.getElementById("btn-clear")?.addEventListener("click", () => {
      if (confirm("Hapus semua kanvas?")) {
        AppState.shapes = [];
        AppState.bgImage = null;
        this.canvasView.renderAll([], null, null);
        HistoryManager.saveState();
      }
    });

    document
      .getElementById("btn-save")
      ?.addEventListener("click", () => this.canvasView.savePNG());

    const fileInput = document.getElementById("file-upload");
    document
      .getElementById("btn-bg")
      ?.addEventListener("click", () => fileInput.click());
    fileInput?.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            AppState.bgImage = img;
            this.canvasView.renderAll(
              AppState.shapes,
              AppState.selectedShape,
              AppState.bgImage,
            );
            HistoryManager.saveState();
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

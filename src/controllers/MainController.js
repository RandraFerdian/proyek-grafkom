// #fungsi sebagai titik masuk (entry point) yang merakit semua sub-controller
import { AppState } from "../models/AppState.js";
import { CanvasView } from "../views/CanvasView.js";
import { ToolbarView } from "../views/ToolbarView.js";
import { HistoryManager } from "../utils/HistoryManager.js";
import { TransformController } from "./TransformController.js";
import { UIController } from "./UIController.js";
import { MouseController } from "./MouseController.js";

export class MainController {
  constructor() {
    // 1. Siapkan Layar & Toolbar (Kiri)
    this.canvasView = new CanvasView("mainCanvas");
    this.toolbarView = new ToolbarView((newTool) => {
      AppState.activeTool = newTool;
      AppState.isDrawing = false;
      this.canvasView.setCursor(newTool);
    });
    this.canvasView.setCursor(AppState.activeTool);

    // 2. Aktifkan Panel Kanan (Properties, Transform, Actions)
    new UIController(this.canvasView);
    new TransformController(this.canvasView);
    // 3. Aktifkan Sensor Kanvas (Mouse)
    new MouseController(this.canvasView);
    // 4. Simpan kanvas bersih sebagai langkah #1 di memori
    HistoryManager.saveState();
  }
}

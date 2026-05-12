// #fungsi untuk mendeteksi gestur kursor (menggambar, geser, klik)
import { AppState } from "../models/AppState.js";
import { HistoryManager } from "../utils/HistoryManager.js";
import { ShapeFactory } from "../factories/ShapeFactory.js";
import { FreehandShape } from "../models/shapes/FreehandShape.js";
import {
  getRotateMatrix,
  getScaleMatrix,
  applyCompositeMatrix,
} from "../models/math/matrix.js";

export class MouseController {
  constructor(canvasView) {
    this.canvasView = canvasView;
    this.transformMode = null;
    this.currentPivot = null;
    this.init();
  }

  init() {
    const canvas = this.canvasView.canvas;

    canvas.addEventListener("mousedown", (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = Math.round(e.clientX - rect.left);
      const mouseY = Math.round(e.clientY - rect.top);
      AppState.startX = mouseX;
      AppState.startY = mouseY;
      AppState.lastX = mouseX;
      AppState.lastY = mouseY;

      if (AppState.activeTool === "FILL") {
        this.canvasView.renderAll(
          AppState.shapes,
          AppState.selectedShape,
          AppState.bgImage,
        );
        this.canvasView.floodFill(mouseX, mouseY, AppState.fillColor);
        const snapshot = new Image();
        snapshot.onload = () => {
          AppState.bgImage = snapshot;
          HistoryManager.saveState();
        };
        snapshot.src = canvas.toDataURL();
        return;
      }

      if (AppState.activeTool === "DRAW") {
        AppState.selectedShape = null;
        AppState.isDrawing = true;
        const freehand = new FreehandShape(AppState.currentColor);
        freehand.width = AppState.lineWidth;
        freehand.style = AppState.lineStyle;
        freehand.pts.push({ x: mouseX, y: mouseY });
        AppState.shapes.push(freehand);
        return;
      }

      if (AppState.activeTool === "SELECT") {
        AppState.isDrawing = true;
        this.transformMode = null;
        if (AppState.selectedShape) {
          const handles = this.canvasView.getSelectionHandles(
            AppState.selectedShape,
          );
          if (handles) {
            this.currentPivot = handles.pivot;
            if (
              Math.hypot(
                mouseX - handles.rotateHandle.x,
                mouseY - handles.rotateHandle.y,
              ) <= 10
            ) {
              this.transformMode = "ROTATE";
              return;
            }
            for (let pt of handles.scaleHandles) {
              if (Math.hypot(mouseX - pt.x, mouseY - pt.y) <= 10) {
                this.transformMode = "SCALE";
                return;
              }
            }
          }
        }

        let found = false;
        for (let i = AppState.shapes.length - 1; i >= 0; i--) {
          if (AppState.shapes[i].isPointInside(mouseX, mouseY)) {
            AppState.selectedShape = AppState.shapes[i];
            this.transformMode = "TRANSLATE";

            document.getElementById("color-picker").value =
              AppState.selectedShape.color;
            document.getElementById("line-width").value =
              AppState.selectedShape.width || 2;
            document.getElementById("width-label").textContent =
              (AppState.selectedShape.width || 2) + "px";
            document.getElementById("line-style").value =
              AppState.selectedShape.style || "solid";
            document.getElementById("fill-color-picker").value =
              AppState.selectedShape.fillColor || "#cccccc";
            document.getElementById("use-fill-checkbox").checked =
              AppState.selectedShape.useFill || false;

            AppState.currentColor = AppState.selectedShape.color;
            AppState.lineWidth = AppState.selectedShape.width;
            AppState.lineStyle = AppState.selectedShape.style;
            AppState.fillColor = AppState.selectedShape.fillColor;
            AppState.useFill = AppState.selectedShape.useFill;
            found = true;
            break;
          }
        }
        if (!found) AppState.selectedShape = null;
        this.canvasView.renderAll(
          AppState.shapes,
          AppState.selectedShape,
          AppState.bgImage,
        );
      } else {
        AppState.selectedShape = null;
        AppState.isDrawing = true;
        if (AppState.activeTool === "TITIK") {
          const point = ShapeFactory.createShape(
            "TITIK",
            mouseX,
            mouseY,
            mouseX,
            mouseY,
            AppState.currentColor,
          );
          AppState.shapes.push(point);
          this.canvasView.renderAll(AppState.shapes, null, AppState.bgImage);
          HistoryManager.saveState();
        }
      }
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!AppState.isDrawing) return;
      const currentX = Math.round(
        e.clientX - canvas.getBoundingClientRect().left,
      );
      const currentY = Math.round(
        e.clientY - canvas.getBoundingClientRect().top,
      );

      if (AppState.activeTool === "DRAW") {
        const currentShape = AppState.shapes[AppState.shapes.length - 1];
        if (currentShape && currentShape.type === "FREEHAND") {
          currentShape.pts.push({ x: currentX, y: currentY });
          this.canvasView.renderAll(
            AppState.shapes,
            AppState.selectedShape,
            AppState.bgImage,
          );
        }
        return;
      }

      if (
        AppState.activeTool === "SELECT" &&
        AppState.selectedShape &&
        this.transformMode
      ) {
        if (this.transformMode === "TRANSLATE") {
          const deltaX = currentX - AppState.lastX;
          const deltaY = currentY - AppState.lastY;
          if (AppState.selectedShape.applyMatrix) {
            AppState.selectedShape.applyMatrix([
              [1, 0, deltaX],
              [0, 1, deltaY],
              [0, 0, 1],
            ]);
          }
        } else if (this.transformMode === "ROTATE") {
          const pivot = this.currentPivot;
          const startAngle = Math.atan2(
            AppState.lastY - pivot.y,
            AppState.lastX - pivot.x,
          );
          const currentAngle = Math.atan2(
            currentY - pivot.y,
            currentX - pivot.x,
          );
          const deltaAngleDeg = (currentAngle - startAngle) * (180 / Math.PI);
          applyCompositeMatrix(
            AppState.selectedShape,
            getRotateMatrix(deltaAngleDeg),
            pivot.x,
            pivot.y,
          );
        } else if (this.transformMode === "SCALE") {
          const pivot = this.currentPivot;
          const startDist = Math.hypot(
            AppState.lastX - pivot.x,
            AppState.lastY - pivot.y,
          );
          const currentDist = Math.hypot(
            currentX - pivot.x,
            currentY - pivot.y,
          );

          if (startDist > 0) {
            const scaleFactor = currentDist / startDist;
            applyCompositeMatrix(
              AppState.selectedShape,
              getScaleMatrix(scaleFactor, scaleFactor),
              pivot.x,
              pivot.y,
            );

            if (AppState.selectedShape.type === "LINGKARAN") {
              AppState.selectedShape.r *= scaleFactor;
            } else if (AppState.selectedShape.type === "ELIPS") {
              AppState.selectedShape.rx *= scaleFactor;
              AppState.selectedShape.ry *= scaleFactor;
            }
          }
        }
        AppState.lastX = currentX;
        AppState.lastY = currentY;
        this.canvasView.renderAll(
          AppState.shapes,
          AppState.selectedShape,
          AppState.bgImage,
        );
      } else if (
        AppState.activeTool !== "SELECT" &&
        AppState.activeTool !== "TITIK" &&
        AppState.activeTool !== "FILL"
      ) {
        this.canvasView.renderAll(
          AppState.shapes,
          AppState.selectedShape,
          AppState.bgImage,
        );
        const previewShape = ShapeFactory.createShape(
          AppState.activeTool,
          AppState.startX,
          AppState.startY,
          currentX,
          currentY,
          AppState.currentColor,
        );
        if (previewShape) previewShape.draw(this.canvasView);
      }
    });

    canvas.addEventListener("mouseup", (e) => {
      if (!AppState.isDrawing) return;
      AppState.isDrawing = false;
      const endX = Math.round(e.clientX - canvas.getBoundingClientRect().left);
      const endY = Math.round(e.clientY - canvas.getBoundingClientRect().top);

      if (AppState.activeTool === "SELECT" && AppState.selectedShape) {
        if (AppState.startX !== endX || AppState.startY !== endY)
          HistoryManager.saveState();
        this.transformMode = null;
      } else if (AppState.activeTool === "DRAW") {
        HistoryManager.saveState();
      } else if (
        AppState.activeTool !== "SELECT" &&
        AppState.activeTool !== "TITIK" &&
        AppState.activeTool !== "FILL" &&
        AppState.activeTool !== "DRAW" &&
        (AppState.startX !== endX || AppState.startY !== endY)
      ) {
        const finalShape = ShapeFactory.createShape(
          AppState.activeTool,
          AppState.startX,
          AppState.startY,
          endX,
          endY,
          AppState.currentColor,
        );
        if (finalShape) {
          AppState.shapes.push(finalShape);
          AppState.selectedShape = finalShape;
          HistoryManager.saveState();
        }
      }
      this.canvasView.renderAll(
        AppState.shapes,
        AppState.selectedShape,
        AppState.bgImage,
      );
    });
  }
}

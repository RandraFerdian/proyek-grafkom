export class CanvasView {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.canvas.width = window.innerWidth - 256 - 300 - 80;
    this.canvas.height = window.innerHeight - 80;
    this.clear();
  }

  clear(bgImage = null) {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    if (bgImage) {
      this.ctx.drawImage(bgImage, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  putPixel(x, y, color = "#000000", width = 2, style = "solid", index = 0) {
    if (width === 0) return;
    const scale = Math.max(1, width);
    if (style === "dashed") {
      if (index % (15 * scale) > 7 * scale) return;
    } else if (style === "dotted") {
      if (index % (6 * scale) > 1.5 * scale) return;
    } else if (style === "dash-dotted") {
      const pos = index % (20 * scale);
      if (pos > 10 * scale && pos <= 13 * scale) return;
      if (pos > 15 * scale) return;
    }

    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      Math.round(x - width / 2),
      Math.round(y - width / 2),
      width,
      width,
    );
  }
  floodFill(startX, startY, hexColor) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const imgData = this.ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Convert Hex ke RGB
    const hex = hexColor.replace(/^#/, "");
    const targetR = parseInt(hex.substring(0, 2), 16) || 0;
    const targetG = parseInt(hex.substring(2, 4), 16) || 0;
    const targetB = parseInt(hex.substring(4, 6), 16) || 0;

    const startPos = (Math.round(startY) * width + Math.round(startX)) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    const tolerance = 40; // Toleransi untuk pinggiran garis yang nge-blur

    // CEK PENTING: Cegah Infinite Loop (Browser Freeze) jika warna sudah sama
    if (
      Math.abs(targetR - startR) <= tolerance &&
      Math.abs(targetG - startG) <= tolerance &&
      Math.abs(targetB - startB) <= tolerance
    ) {
      return;
    }

    function matchStartColor(pos) {
      return (
        Math.abs(data[pos] - startR) <= tolerance &&
        Math.abs(data[pos + 1] - startG) <= tolerance &&
        Math.abs(data[pos + 2] - startB) <= tolerance
      );
    }

    const stack = [[Math.round(startX), Math.round(startY)]];

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      let currentY = y;
      let pos = (currentY * width + x) * 4;

      while (currentY >= 0 && matchStartColor(pos)) {
        currentY--;
        pos -= width * 4;
      }
      currentY++;
      pos += width * 4;

      let reachLeft = false,
        reachRight = false;

      while (currentY < height && matchStartColor(pos)) {
        data[pos] = targetR;
        data[pos + 1] = targetG;
        data[pos + 2] = targetB;
        data[pos + 3] = 255;

        if (x > 0) {
          if (matchStartColor(pos - 4)) {
            if (!reachLeft) {
              stack.push([x - 1, currentY]);
              reachLeft = true;
            }
          } else {
            reachLeft = false;
          }
        }
        if (x < width - 1) {
          if (matchStartColor(pos + 4)) {
            if (!reachRight) {
              stack.push([x + 1, currentY]);
              reachRight = true;
            }
          } else {
            reachRight = false;
          }
        }
        currentY++;
        pos += width * 4;
      }
    }
    this.ctx.putImageData(imgData, 0, 0);
  }

  drawSelectionBox(shape) {
    const handles = this.getSelectionHandles(shape);
    if (!handles) return;
    const { bbox, rotateHandle, scaleHandles } = handles;

    // 1. Gambar Kotak Putus-Putus
    this.ctx.strokeStyle = "#3b82f6";
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeRect(
      bbox.minX,
      bbox.minY,
      bbox.maxX - bbox.minX,
      bbox.maxY - bbox.minY,
    );
    this.ctx.setLineDash([]);

    // 2. Gambar Garis dan Lingkaran untuk Rotasi (Atas Tengah)
    this.ctx.beginPath();
    this.ctx.moveTo(handles.pivot.x, bbox.minY);
    this.ctx.lineTo(rotateHandle.x, rotateHandle.y);
    this.ctx.stroke();

    this.ctx.fillStyle = "#ffffff";
    this.ctx.beginPath();
    this.ctx.arc(rotateHandle.x, rotateHandle.y, 5, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    // 3. Gambar Kotak Kecil di Keempat Sudut untuk Skala
    scaleHandles.forEach((pt) => {
      this.ctx.fillStyle = "#ffffff";
      this.ctx.fillRect(pt.x - 4, pt.y - 4, 8, 8);
      this.ctx.strokeRect(pt.x - 4, pt.y - 4, 8, 8);
    });
  }

  renderAll(shapes, selectedShape = null, bgImage = null) {
    this.clear(bgImage);
    shapes.forEach((shape) => shape.draw(this));
    if (selectedShape) this.drawSelectionBox(selectedShape);
  }

  getSelectionHandles(shape) {
    const bbox = shape.getBoundingBox();
    if (!bbox) return null;

    // Pivot (Titik Tengah)
    const pivot = {
      x: bbox.minX + (bbox.maxX - bbox.minX) / 2,
      y: bbox.minY + (bbox.maxY - bbox.minY) / 2,
    };

    return {
      bbox,
      pivot,
      rotateHandle: { x: pivot.x, y: bbox.minY - 30 }, // Gagang rotasi melayang di atas
      scaleHandles: [
        { x: bbox.minX, y: bbox.minY }, // Kiri Atas
        { x: bbox.maxX, y: bbox.minY }, // Kanan Atas
        { x: bbox.minX, y: bbox.maxY }, // Kiri Bawah
        { x: bbox.maxX, y: bbox.maxY }, // Kanan Bawah
      ],
    };
  }

  savePNG() {
    const link = document.createElement("a");
    link.download = "GrafikaApp_Export.png";
    link.href = this.canvas.toDataURL("image/png");
    link.click();
  }

  setCursor(tool) {
    if (tool === "SELECT") {
      this.canvas.style.cursor = "default";
    } else if (tool === "FILL") {
      this.canvas.style.cursor = "cell";
    } else {
      this.canvas.style.cursor = "crosshair"; // Kursor membidik saat menggambar
    }
  }
}

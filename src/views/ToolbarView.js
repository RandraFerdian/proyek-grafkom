import { AppState } from "../models/AppState.js";

export class ToolbarView {
  constructor(onToolChangeCallback) {
    this.buttons = {
      SELECT: document.getElementById("btn-select"),
      DRAW: document.getElementById("btn-draw"),
      TITIK: document.getElementById("btn-titik"),
      FILL: document.getElementById("btn-fill"),
      GARIS: document.getElementById("btn-garis"),
      KOTAK: document.getElementById("btn-kotak"),
      SEGITIGA: document.getElementById("btn-segitiga"),
      SEGITIGA_SIKU: document.getElementById("btn-segitiga-siku"),
      DIAMOND: document.getElementById("btn-diamond"),
      SEGI5: document.getElementById("btn-segi5"),
      SEGI6: document.getElementById("btn-segi6"),
      BINTANG: document.getElementById("btn-bintang"),
      PANAH: document.getElementById("btn-panah"),
      KURVA: document.getElementById("btn-kurva"),
      LINGKARAN: document.getElementById("btn-lingkaran"),
    };

    this.colorPicker = document.getElementById("color-picker");
    this.bindEvents(onToolChangeCallback);
  }

  bindEvents(callback) {
    // Event untuk tombol alat
    for (const [toolName, btnElement] of Object.entries(this.buttons)) {
      if (!btnElement) continue;

      btnElement.addEventListener("click", () => {
        Object.values(this.buttons).forEach((btn) =>
          btn?.classList.remove("active"),
        );
        btnElement.classList.add("active");
        callback(toolName);
      });
    }

    // Event untuk mengganti warna langsung dari Color Picker
    if (this.colorPicker) {
      this.colorPicker.addEventListener("input", (e) => {
        AppState.currentColor = e.target.value;
      });
    }
  }
}

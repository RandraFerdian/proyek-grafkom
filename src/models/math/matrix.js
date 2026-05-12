// Mengalikan matriks transformasi 3x3 dengan titik (x, y)
export function applyMatrixToPoint(matrix, x, y) {
  const point = [x, y, 1];
  let result = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    result[i] =
      matrix[i][0] * point[0] +
      matrix[i][1] * point[1] +
      matrix[i][2] * point[2];
  }
  return {
    x: result[0],
    y: result[1],
  };
}

export function getShearMatrix(shx, shy) {
  return [
    [1, shx, 0],
    [shy, 1, 0],
    [0, 0, 1],
  ];
}

export function getReflectMatrix(axis) {
  if (axis === "x")
    return [
      [1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];
  if (axis === "y")
    return [
      [-1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
  if (axis === "origin")
    return [
      [-1, 0, 0],
      [0, -1, 0],
      [0, 0, 1],
    ];
  if (axis === "y=x")
    return [
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 1],
    ];
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
}

export function getRotateMatrix(angleDegree) {
  const rad = angleDegree * (Math.PI / 180);
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  return [
    [c, -s, 0],
    [s, c, 0],
    [0, 0, 1],
  ];
}

export function getScaleMatrix(sx, sy) {
  return [
    [sx, 0, 0],
    [0, sy, 0],
    [0, 0, 1],
  ];
}

// Matriks Translasi yang letaknya sudah dikeluarkan agar sejajar
export function getTranslateMatrix(tx, ty) {
  return [
    [1, 0, tx],
    [0, 1, ty],
    [0, 0, 1],
  ];
}

export function applyCompositeMatrix(shape, matrix, pivotX, pivotY) {
  const tToOrigin = [
    [1, 0, -pivotX],
    [0, 1, -pivotY],
    [0, 0, 1],
  ];
  const tBack = [
    [1, 0, pivotX],
    [0, 1, pivotY],
    [0, 0, 1],
  ];

  // Secara sederhana untuk tugas ini, kita aplikasikan 3 langkah matriks:
  shape.applyMatrix(tToOrigin);
  shape.applyMatrix(matrix);
  shape.applyMatrix(tBack);
}

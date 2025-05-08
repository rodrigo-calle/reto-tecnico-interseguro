import * as mathjs from "mathjs";

export type Matrix = number[][];
type MathJsMatrix = mathjs.Matrix;

const matrixEquals = (a: Matrix, b: Matrix, tolerance = 1e-10): boolean => {
  if (a.length !== b.length || a[0].length !== b[0].length) return false;

  return a.every((row, i) =>
    row.every((val, j) => Math.abs(val - b[i][j]) <= tolerance)
  );
};

const validateQR = (original: Matrix, Q: Matrix, R: Matrix): void => {
  const mathQ = mathjs.matrix(Q, "dense") as MathJsMatrix;
  const mathR = mathjs.matrix(R, "dense") as MathJsMatrix;

  const qt = mathjs.transpose(mathQ);
  const qtq = mathjs.multiply(qt, mathQ);
  const identity = mathjs.identity(Q.length, "dense") as MathJsMatrix;

  if (!mathjs.deepEqual(qtq, identity)) {
    throw new Error("La matriz Q no es ortogonal");
  }

  const isUpperTriangular = R.every((row, i) =>
    row.every((val, j) => (i > j ? Math.abs(val) <= 1e-10 : true))
  );

  if (!isUpperTriangular) {
    throw new Error("La matriz R no es triangular superior");
  }

  const qrProduct = mathjs.multiply(mathQ, mathR).valueOf() as Matrix;
  if (!matrixEquals(qrProduct, original)) {
    throw new Error("La factorización QR no reproduce la matriz original");
  }
};

const toDenseMatrix = (matrix: Matrix): MathJsMatrix => {
  return mathjs.matrix(matrix, "dense") as MathJsMatrix;
};

const householderQR = (matrix: Matrix): { Q: Matrix; R: Matrix } => {
  const m = matrix.length;
  const n = matrix[0].length;

  const Q = Array.from({ length: m }, (_, i) =>
    Array.from({ length: m }, (__, j) => (i === j ? 1 : 0))
  );

  const R = matrix.map((row) => [...row]);

  for (let j = 0; j < Math.min(m, n); j++) {
    const column = R.slice(j).map((row) => row[j]);

    const norm = Math.sqrt(column.reduce((sum, x) => sum + x * x, 0));
    const sign = column[0] >= 0 ? 1 : -1;
    const u1 = column[0] + sign * norm;

    const w = column.map((x, i) => (i === 0 ? u1 : x));
    const normW = Math.sqrt(w.reduce((sum, x) => sum + x * x, 0));
    const v = w.map((x) => x / normW);

    for (let k = j; k < n; k++) {
      const columnK = R.slice(j).map((row) => row[k]);
      const dot = v.reduce((sum, vi, i) => sum + vi * columnK[i], 0);
      for (let i = j; i < m; i++) {
        R[i][k] -= 2 * v[i - j] * dot;
      }
    }

    for (let k = 0; k < m; k++) {
      const rowQ = Q[k].slice(j);
      const dot = v.reduce((sum, vi, i) => sum + vi * rowQ[i], 0);
      for (let i = j; i < m; i++) {
        Q[k][i] -= 2 * v[i - j] * dot;
      }
    }
  }

  return { Q, R };
};

export const factorize = (matrix: Matrix): { Q: Matrix; R: Matrix } => {
  if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
    throw new Error("La matriz no puede estar vacía");
  }

  const cols = matrix[0].length;
  if (!matrix.every((row) => row.length === cols)) {
    throw new Error("Todas las filas deben tener el mismo número de columnas");
  }

  try {
    const mathMatrix = toDenseMatrix(matrix);
    const qrResult = mathjs.qr(mathMatrix) as {
      Q: MathJsMatrix;
      R: MathJsMatrix;
    };

    const Q = qrResult.Q.valueOf() as Matrix;
    const R = qrResult.R.valueOf() as Matrix;

    validateQR(matrix, Q, R);
    return { Q, R };
  } catch (error) {
    console.warn("MathJS QR falló, usando implementación alternativa:", error);
    const result = householderQR(matrix);
    validateQR(matrix, result.Q, result.R);
    return result;
  }
};

export const createMatrix = (
  rows: number,
  cols: number,
  fill: (i: number, j: number) => number
): Matrix => {
  return Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (__, j) => fill(i, j))
  );
};

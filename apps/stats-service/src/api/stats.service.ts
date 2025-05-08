import * as mathjs from "mathjs";

export type MatrixStats = {
  max: number;
  min: number;
  average: number;
  sum: number;
  isDiagonal: boolean;
};

type Matrix = number[][];

export const analyzeMatrices = (matrices: Matrix[]): MatrixStats => {
  if (!matrices || matrices.length === 0) {
    throw new Error("Se requiere al menos una matriz");
  }

  const allValues = matrices.flatMap((matrix) => matrix.flat());

  const hasDiagonal = matrices.some((matrix) => isDiagonal(matrix));

  return {
    max: mathjs.max(allValues) as number,
    min: mathjs.min(allValues) as number,
    average: mathjs.mean(allValues) as number,
    sum: mathjs.sum(allValues) as number,
    isDiagonal: hasDiagonal,
  };
};

const isDiagonal = (matrix: Matrix): boolean => {
  return matrix.every((row, i) =>
    row.every((value, j) => {
      return i === j || Math.abs(value) < 1e-10;
    })
  );
};

export const analyzeSingleMatrix = (matrix: Matrix) => {
  const flat = matrix.flat();
  return {
    max: mathjs.max(flat) as number,
    min: mathjs.min(flat) as number,
    average: mathjs.mean(flat) as number,
    sum: mathjs.sum(flat) as number,
    isDiagonal: isDiagonal(matrix),
  };
};

import { Coordinate } from './Interface/Coordinate'

export const knightMoveVectors: Array<Coordinate> = [
  { i: 1, j: 2 },
  { i: -1, j: 2 },
  { i: 1, j: -2 },
  { i: -1, j: -2 },
  { i: 2, j: 1 },
  { i: -2, j: 1 },
  { i: 2, j: -1 },
  { i: -2, j: -1 },
]

export interface PieceAndMoves {
  piece: string[]
  depth: number
  directions: Array<Coordinate>
}

export const KNIGHT: PieceAndMoves = {
  piece: ['N'],
  depth: 1,
  directions: [
    { i: 1, j: 2 },
    { i: -1, j: 2 },
    { i: 1, j: -2 },
    { i: -1, j: -2 },
    { i: 2, j: 1 },
    { i: -2, j: 1 },
    { i: 2, j: -1 },
    { i: -2, j: -1 },
  ],
}
export const BISHOP: PieceAndMoves = {
  piece: ['B', 'Q'],
  depth: 8,
  directions: [
    { i: 1, j: 1 },
    { i: -1, j: 1 },
    { i: 1, j: -1 },
    { i: -1, j: -1 },
  ],
}
export const ROOK: PieceAndMoves = {
  piece: ['R', 'Q'],
  depth: 8,
  directions: [
    { i: 0, j: 1 },
    { i: -1, j: 0 },
    { i: 0, j: -1 },
    { i: 1, j: 0 },
  ],
}
export const KING: PieceAndMoves = {
  piece: ['K'],
  depth: 1,
  directions: [
    { i: 0, j: 1 },
    { i: -1, j: 0 },
    { i: 0, j: -1 },
    { i: 1, j: 0 },
    { i: 1, j: 1 },
    { i: -1, j: 1 },
    { i: 1, j: -1 },
    { i: -1, j: -1 },
  ],
}

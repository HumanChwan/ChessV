import { CastleRights } from './Interface/CastlingRights'
import { conditionalCoordinate, Coordinate } from './Interface/Coordinate'
import { PieceAndMoves } from './MoveFormation/direction'

const aCode: number = 'a'.charCodeAt(0)
const alphaToNumber = (file: string): number => file.charCodeAt(0) - aCode

export function formCastlingRights(asString: string): CastleRights {
  const castlingRightsAsArray: CastleRights = {
    K: false,
    Q: false,
    k: false,
    q: false,
  }

  for (let i = 0; i < asString.length; ++i) {
    castlingRightsAsArray[asString[i]] = true
  }

  return castlingRightsAsArray
}

export function setBooleanMove(moveasString: string): boolean {
  if (!'wb'.includes(moveasString)) {
    throw new Error("AssertionFailed: move not 'w' or 'b'")
  }

  return moveasString === 'w'
}

export function formCoordinatefromChessCoordinate(
  chessCoordinate: string
): conditionalCoordinate {
  if (chessCoordinate === '-') {
    return false
  }

  try {
    const coordinate: Coordinate = {
      i: 8 - Number(chessCoordinate[1]),
      j: alphaToNumber(chessCoordinate[0]),
    }

    return coordinate
  } catch (e) {
    throw new Error('Assertion Failed: Not Valid chessCoordinate')
  }
}

export function formChessCoordinatefromCoordinate(
  coordinate: Coordinate
): string {
  let chessCoordinate: string = ''

  chessCoordinate += String.fromCharCode(coordinate.j + 'a'.charCodeAt(0))
  chessCoordinate += 8 - coordinate.i

  return chessCoordinate
}

export const isPieceWhite = (piece: string): boolean => piece <= 'Z'

export function changeCase(piece: string, moved: boolean): string {
  return moved ? piece : piece.toLowerCase()
}

export function readCastlingRights(castleRights: CastleRights): string {
  let castleRightsAsString: string = ''

  if (castleRights.K) {
    castleRightsAsString += 'K'
  }
  if (castleRights.Q) {
    castleRightsAsString += 'Q'
  }
  if (castleRights.k) {
    castleRightsAsString += 'k'
  }
  if (castleRights.q) {
    castleRightsAsString += 'q'
  }

  return castleRightsAsString
}

export function readenPassant(enPassantSquare: conditionalCoordinate): string {
  if (!enPassantSquare) {
    return '-'
  }

  return formChessCoordinatefromCoordinate(enPassantSquare)
}

export const pawnAtBaseRank = (rank: number, move: boolean): boolean =>
  move ? rank === 6 : rank === 1

export const isValidCoordinateR = (rank: number): boolean =>
  0 <= rank && rank < 8

export const isValidCoordinateF = (file: number): boolean =>
  0 <= file && file < 8

export const isValidCoordinateRF = (rank: number, file: number): boolean =>
  0 <= rank && rank < 8 && 0 <= file && file < 8

export function isValidCoordinate(coordinate: Coordinate): boolean {
  return (
    0 <= coordinate.i &&
    coordinate.i < 8 &&
    0 <= coordinate.j &&
    coordinate.j < 8
  )
}

export function CompareCoordinates(A: Coordinate, B: Coordinate): boolean {
  return A.i === B.i && A.j === B.j
}

export function inValidQRBattackConfiguration(
  deltaI: number,
  deltaJ: number
): boolean {
  return deltaI * deltaJ !== 0 && Math.abs(deltaI) !== Math.abs(deltaJ)
}

export function pawnAtEnemyBaseRank(rank: number, toMove: boolean): boolean {
  return toMove ? rank === 0 : rank === 7
}

export function changeDirectionCase(
  PaM: PieceAndMoves,
  toMove: boolean
): PieceAndMoves {
  if (toMove) {
    return PaM
  }

  PaM = { ...PaM, piece: PaM.piece.map((piece) => piece.toLowerCase()) }

  return PaM
}

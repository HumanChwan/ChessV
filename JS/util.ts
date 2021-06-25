import { CastleRights } from './Interface/CastlingRights'
import { conditionalCoordinate, Coordinate } from './Interface/Coordinate'

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

export const isPieceWhite = (piece: string): boolean => piece >= 'A'

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

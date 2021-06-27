import { BISHOP, KING, PieceAndMoves, ROOK } from './direction'
import { atCoordinate } from './formulateMoves'
import { Coordinate } from '../Interface/Coordinate'
import {
  changeDirectionCase,
  isValidCoordinate,
  isValidCoordinateRF,
} from '../util'

let toMove: boolean

function unsafe(location: Coordinate, MoveDirection: PieceAndMoves): boolean {
  const homeKing: string = toMove ? 'K' : 'k'

  for (let x: number = 0; x < MoveDirection.directions.length; ++x) {
    let depth: number = MoveDirection.depth
    const unitDirection: Coordinate = MoveDirection.directions[x]
    let iterativeCoordinate: Coordinate = {
      i: location.i + unitDirection.i,
      j: location.j + unitDirection.j,
    }

    while (depth-- && isValidCoordinate(iterativeCoordinate)) {
      const spaceOccupation: string = atCoordinate(iterativeCoordinate)
      if (spaceOccupation !== ' ' && spaceOccupation !== homeKing) {
        if (MoveDirection.piece.includes(spaceOccupation)) {
          return true
        }
        break
      }
      iterativeCoordinate.i += unitDirection.i
      iterativeCoordinate.j += unitDirection.j
    }
  }

  return false
}

export function safeSquare(location: Coordinate, newToMove: boolean): boolean {
  // START: bishops and queen(s)
  if (unsafe(location, changeDirectionCase(BISHOP, !toMove))) return false
  // END: bishops and queen(s)

  // START: rooks and queen(s)
  if (unsafe(location, changeDirectionCase(ROOK, !toMove))) return false
  // END: rooks and queen(s)

  // START: King
  if (unsafe(location, changeDirectionCase(KING, !toMove))) return false
  // END: King

  // START: Pawn
  const moveDirection: number = toMove ? -1 : 1
  const pawn: string = toMove ? 'p' : 'P'

  if (
    isValidCoordinateRF(location.i + moveDirection, location.j - 1) &&
    atCoordinate({ i: location.i + moveDirection, j: location.j - 1 }) === pawn
  ) {
    return false
  }

  if (
    isValidCoordinateRF(location.i + moveDirection, location.j + 1) &&
    atCoordinate({ i: location.i + moveDirection, j: location.j + 1 }) === pawn
  ) {
    return false
  }
  // END: Pawns

  return true
}

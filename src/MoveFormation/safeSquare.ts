import { BISHOP, KING, KNIGHT, PieceAndMoves, ROOK } from './direction'
import { atCoordinate, getMove } from './formulateMoves'
import { Coordinate } from '../Interface/Coordinate'
import {
  changeDirectionCase,
  isValidCoordinate,
  isValidCoordinateRF,
} from '../util'

function unsafe(location: Coordinate, MoveDirection: PieceAndMoves): boolean {
  const homeKing: string = getMove() ? 'K' : 'k'

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

export default function safeSquare(
  location: Coordinate,
  newToMove: boolean
): boolean {
  // START: bishops and queen(s)
  if (unsafe(location, changeDirectionCase(BISHOP, !newToMove))) return false
  // END: bishops and queen(s)

  // START: rooks and queen(s)
  if (unsafe(location, changeDirectionCase(ROOK, !newToMove))) return false
  // END: rooks and queen(s)

  // START: King
  if (unsafe(location, changeDirectionCase(KING, !newToMove))) return false
  // END: King

  // START: Knight
  if (unsafe(location, changeDirectionCase(KNIGHT, !newToMove))) return false
  // END: Knight

  // START: Pawn
  const moveDirection: number = newToMove ? -1 : 1
  const pawn: string = newToMove ? 'p' : 'P'

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

import { conditionalCoordinate, Coordinate } from '../../Interface/Coordinate'
import { PIECEMOVE } from '../../Interface/general'
import { isPieceWhite, isValidCoordinate } from '../../util'
import { knightMoveVectors } from '../direction'
import {
  atCoordinate,
  getDiscoveryData,
  getMove,
  originDisplace,
} from '../formulateMoves'

export default function knightMove(origin: Coordinate): PIECEMOVE {
  const allowedDirections = originDisplace(origin)

  const knightMoves: PIECEMOVE = {
    origin: origin,
    moves: [],
  }

  for (const direction in allowedDirections) {
    if (!allowedDirections[direction]) {
      return knightMoves
    }
  }

  const possibleDiscoveredCheck: conditionalCoordinate =
    getDiscoveryData(origin)

  knightMoveVectors.forEach((direction) => {
    const iterativeCoordinate: Coordinate = {
      i: origin.i + direction.i,
      j: origin.j + direction.j,
    }

    if (!isValidCoordinate(iterativeCoordinate)) {
      return
    }

    const squareOccupation = atCoordinate(iterativeCoordinate)

    if (squareOccupation === ' ') {
      // move
      knightMoves.moves.push({
        target: iterativeCoordinate,
        discoverCheckData: possibleDiscoveredCheck,
      })
    } else if (isPieceWhite(squareOccupation) !== getMove()) {
      // capture
      knightMoves.moves.push({
        target: { ...iterativeCoordinate },
        isCapture: true,
        discoverCheckData: possibleDiscoveredCheck,
      })
    }
  })

  return knightMoves
}

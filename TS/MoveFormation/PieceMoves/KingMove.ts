import { King } from '../../Classes/King'
import { conditionalCoordinate, Coordinate } from '../../Interface/Coordinate'
import { PIECEMOVE } from '../../Interface/general'
import {
  addCoordinates,
  CompareCoordinates,
  isPieceWhite,
  isValidCoordinate,
  subtractCoordinates,
} from '../../util'
import { KingMoveVectors } from '../direction'
import {
  atCoordinate,
  getDiscoveryData,
  getMove,
  getUnitDelta,
} from '../formulateMoves'
import safeSquare from '../safeSquare'

export default function kingMove(origin: Coordinate, KingObj: King): PIECEMOVE {
  const kingMoves: PIECEMOVE = {
    origin: origin,
    moves: [],
  }

  const unitDirectiontoAttack = getUnitDelta(origin)
  const possibleDiscoveredCheck: conditionalCoordinate =
    getDiscoveryData(origin)

  KingMoveVectors.forEach((unitVector) => {
    const newOrigin: Coordinate = addCoordinates(origin, unitVector)

    if (!isValidCoordinate(newOrigin)) {
      return
    }

    const squareOccupation: string = atCoordinate(newOrigin)
    const discoveryData: conditionalCoordinate = CompareCoordinates(
      unitVector,
      unitDirectiontoAttack
    )
      ? false
      : possibleDiscoveredCheck

    if (
      squareOccupation !== ' ' &&
      isPieceWhite(squareOccupation) === getMove()
    ) {
      return
    }

    if (safeSquare(newOrigin, getMove())) {
      kingMoves.moves.push({
        target: newOrigin,
        isCapture: squareOccupation !== ' ',
        discoverCheckData: discoveryData,
      })
    }
  })

  if (KingObj.isChecked) {
    return kingMoves
  }

  if (KingObj.castleRights.KingSide) {
    let canCastle: boolean = true
    for (let i = 1; i < 2; ++i) {
      const newOrigin: Coordinate = addCoordinates(origin, { i: 0, j: i })
      if (
        atCoordinate(newOrigin) !== ' ' ||
        !safeSquare(newOrigin, getMove())
      ) {
        canCastle = false
        break
      }
    }
    if (canCastle) {
      kingMoves.moves.push({
        target: addCoordinates(origin, { i: 0, j: 2 }),
        castlingMove: {
          origin: addCoordinates(origin, { i: 0, j: 3 }),
          target: addCoordinates(origin, { i: 0, j: 1 }),
        },
      })
    }
  }

  if (KingObj.castleRights.QueenSide) {
    let canCastle: boolean = true
    for (let i = 1; i < 3; ++i) {
      const newOrigin: Coordinate = addCoordinates(origin, { i: 0, j: -i })
      if (
        atCoordinate(newOrigin) !== ' ' ||
        !safeSquare(newOrigin, getMove())
      ) {
        canCastle = false
        break
      }
    }
    if (canCastle) {
      kingMoves.moves.push({
        target: addCoordinates(origin, { i: 0, j: -2 }),
        castlingMove: {
          origin: addCoordinates(origin, { i: 0, j: -4 }),
          target: addCoordinates(origin, { i: 0, j: -1 }),
        },
      })
    }
  }

  return kingMoves
}

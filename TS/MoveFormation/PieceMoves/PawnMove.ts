import { conditionalCoordinate, Coordinate } from '../../Interface/Coordinate'
import { DirectionAvailable, PIECEMOVE } from '../../Interface/general'
import {
  isPieceWhite,
  isValidCoordinateRF,
  pawnAtBaseRank,
  pawnAtEnemyBaseRank,
} from '../../util'
import {
  atCoordinate,
  getDeltaJ,
  getDiscoveryData,
  getMove,
  originDisplace,
} from '../formulateMoves'

export default function pawnMove(
  origin: Coordinate,
  enPassantSquare: conditionalCoordinate
): PIECEMOVE {
  const moveDirection = getMove() ? -1 : 1
  let pawnMoves: PIECEMOVE = {
    origin: origin,
    moves: [],
  }
  const forwardRank: number = origin.i + moveDirection

  const allowedDirections: DirectionAvailable = originDisplace(origin)

  function compareEnPassantSquare(capture: Coordinate): conditionalCoordinate {
    if (!enPassantSquare) {
      return false
    }

    if (capture.i === enPassantSquare.i && capture.j === enPassantSquare.j) {
      return { i: capture.i - moveDirection, j: capture.j }
    } else {
      return false
    }
  }
  const deltaJ: number = getDeltaJ(origin.j)
  const possibleDiscoveredCheck: conditionalCoordinate =
    getDiscoveryData(origin)

  // straight moves
  if (
    allowedDirections.inFile &&
    atCoordinate({ i: forwardRank, j: origin.j }) === ' '
  ) {
    const discoveryData = deltaJ === 0 ? false : possibleDiscoveredCheck

    // basic pawnPUSH
    pawnMoves.moves.push({
      target: { i: forwardRank, j: origin.j },
      isPawnMove: true,
      discoverCheckData: discoveryData ? { ...discoveryData } : false,
      isPromotion: pawnAtEnemyBaseRank(forwardRank, getMove()) ? 'Y' : false,
    })

    // intial available double push of pawn
    if (pawnAtBaseRank(origin.i, getMove())) {
      if (
        atCoordinate({ i: forwardRank + moveDirection, j: origin.j }) === ' '
      ) {
        pawnMoves.moves.push({
          target: { i: forwardRank + moveDirection, j: origin.j },
          isPawnMove: true,
          enPassantSquare: { i: forwardRank, j: origin.j },
          discoverCheckData: discoveryData ? { ...discoveryData } : false,
        })
      }
    }
  }

  // capture Moves
  // on the maxDiagonal : /
  let spaceOccupation: string = atCoordinate({
    i: origin.i + moveDirection,
    j: origin.j - moveDirection,
  })
  if (
    allowedDirections.inMaxDiagonal &&
    isValidCoordinateRF(origin.i + moveDirection, origin.j - moveDirection) &&
    spaceOccupation !== ' ' &&
    isPieceWhite(spaceOccupation) !== getMove()
  ) {
    const discoveryData =
      deltaJ === -moveDirection ? false : possibleDiscoveredCheck

    pawnMoves.moves.push({
      target: { i: origin.i + moveDirection, j: origin.j - moveDirection },
      isCapture: true,
      isPawnMove: true,
      attacksenPassantSquare: compareEnPassantSquare({
        i: origin.i + moveDirection,
        j: origin.j - moveDirection,
      }),
      discoverCheckData: discoveryData ? { ...discoveryData } : false,
      isPromotion: pawnAtEnemyBaseRank(forwardRank, getMove()) ? 'Y' : false,
    })
  }

  // on the minDiagonal : \
  spaceOccupation = atCoordinate({
    i: origin.i + moveDirection,
    j: origin.j + moveDirection,
  })
  if (
    allowedDirections.inMinDiagonal &&
    isValidCoordinateRF(origin.i + moveDirection, origin.j + moveDirection) &&
    spaceOccupation !== ' ' &&
    isPieceWhite(spaceOccupation) !== getMove()
  ) {
    const discoveryData =
      deltaJ === moveDirection ? false : possibleDiscoveredCheck

    pawnMoves.moves.push({
      target: { i: origin.i + moveDirection, j: origin.j + moveDirection },
      isCapture: true,
      isPawnMove: true,
      attacksenPassantSquare: compareEnPassantSquare({
        i: origin.i + moveDirection,
        j: origin.j + moveDirection,
      }),
      discoverCheckData: discoveryData ? { ...discoveryData } : false,
      isPromotion: pawnAtEnemyBaseRank(forwardRank, getMove()) ? 'Y' : false,
    })
  }

  return pawnMoves
}

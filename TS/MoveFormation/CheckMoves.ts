import { Coordinate } from '../Interface/Coordinate'
import { PIECEMOVE } from '../Interface/general'
import { Move } from '../Interface/Move'
import {
  addCoordinates,
  changeDirectionCase,
  CompareCoordinates,
  isValidCoordinate,
  isValidCoordinateRF,
  subtractCoordinates,
  unitify,
} from '../util'
import { BISHOP, KING, PieceAndMoves, ROOK } from './direction'
import {
  atCoordinate,
  getDiscoveryData,
  getMove,
  getUnitDelta,
} from './formulateMoves'

function appendToLegalMoves(
  LegalMoves: Array<PIECEMOVE>,
  MoveObj: Move,
  origin: Coordinate
) {
  for (let x = 0; x < LegalMoves.length; ++x) {
    if (CompareCoordinates(LegalMoves[x].origin, origin)) {
      LegalMoves[x].moves.push(MoveObj)
      return
    }
  }

  LegalMoves.push({
    origin: origin,
    moves: [MoveObj],
  })
}

function defend(
  origin: Coordinate,
  MoveDirection: PieceAndMoves,
  LegalMoves: Array<PIECEMOVE>,
  isCapture: boolean
): boolean {
  const homeKing: string = getMove() ? 'K' : 'k'

  for (let x: number = 0; x < MoveDirection.directions.length; ++x) {
    let depth: number = MoveDirection.depth
    const unitDirection: Coordinate = MoveDirection.directions[x]
    let iterativeCoordinate: Coordinate = addCoordinates(origin, unitDirection)

    while (depth-- && isValidCoordinate(iterativeCoordinate)) {
      const spaceOccupation: string = atCoordinate(iterativeCoordinate)
      if (spaceOccupation !== ' ' && spaceOccupation !== homeKing) {
        if (MoveDirection.piece.includes(spaceOccupation)) {
          appendToLegalMoves(
            LegalMoves,
            {
              target: origin,
              discoverCheckData: CompareCoordinates(
                getUnitDelta(iterativeCoordinate),
                unitify(subtractCoordinates(iterativeCoordinate, origin))
              )
                ? false
                : getDiscoveryData(iterativeCoordinate),
              isCapture: isCapture,
            },
            iterativeCoordinate
          )
        }
        break
      }
      iterativeCoordinate = addCoordinates(iterativeCoordinate, unitDirection)
    }
  }

  return false
}

export function defendAbleCoordinate(
  origin: Coordinate,
  LegalMoves: Array<PIECEMOVE>,
  isCapture: boolean
) {
  // START: bishops and queen(s)
  defend(origin, changeDirectionCase(BISHOP, getMove()), LegalMoves, isCapture)
  // END: bishops and queen(s)

  // START: rooks and queen(s)
  defend(origin, changeDirectionCase(ROOK, getMove()), LegalMoves, isCapture)
  // END: rooks and queen(s)

  // START: King
  defend(origin, changeDirectionCase(KING, getMove()), LegalMoves, isCapture)
  // END: King

  // START: Pawn
  const moveDirection: number = getMove() ? 1 : -1
  const pawn: string = getMove() ? 'P' : 'p'

  if (isCapture) {
    for (let i = -1; i <= 1; i += 2) {
      if (
        isValidCoordinateRF(origin.i + moveDirection, origin.j + i) &&
        atCoordinate({ i: origin.i + moveDirection, j: origin.j + i }) === pawn
      ) {
        LegalMoves.push({
          origin: { i: origin.i + moveDirection, j: origin.j + i },
          moves: [
            {
              target: origin,
              isCapture: true,
              discoverCheckData: CompareCoordinates(
                getUnitDelta({ i: origin.i + moveDirection, j: origin.j + i }),
                { i: -moveDirection, j: -i }
              )
                ? false
                : getDiscoveryData({
                    i: origin.i + moveDirection,
                    j: origin.j + i,
                  }),
            },
          ],
        })
      }
    }
  } else {
    if (
      isValidCoordinateRF(origin.i + moveDirection, origin.j) &&
      atCoordinate({ i: origin.i + moveDirection, j: origin.j }) === pawn
    ) {
      LegalMoves.push({
        origin: { i: origin.i + moveDirection, j: origin.j },
        moves: [
          {
            target: origin,
            discoverCheckData: CompareCoordinates(
              getUnitDelta({ i: origin.i + moveDirection, j: origin.j }),
              { i: -moveDirection, j: 0 }
            )
              ? false
              : getDiscoveryData({
                  i: origin.i + moveDirection,
                  j: origin.j,
                }),
          },
        ],
      })
    }
  }

  // END: Pawns
}

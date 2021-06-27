import { King } from '../Classes/King'
import { Move } from '../Interface/Move'
import { conditionalCoordinate, Coordinate } from '../Interface/Coordinate'
import { DirectionAvailable, KINGS, PIECEMOVE } from '../Interface/general'
import {
  addCoordinates,
  CompareCoordinates,
  customisedPawnMove,
  extendedDirection,
  inValidQRBattackConfiguration,
  isPieceWhite,
  isValidCoordinate,
  subtractCoordinates,
  unitify,
} from '../util'
import pawnMove from './PieceMoves/PawnMove'
import bishopMove from './PieceMoves/BishopMove'
import rookMove from './PieceMoves/RookMove'
import queenMove from './PieceMoves/QueenMove'
import knightMove from './PieceMoves/KnightMove'
import kingMove from './PieceMoves/KingMove'
import { defendAbleCoordinate } from './CheckMoves'
import { BISHOP, KNIGHT, PAWN, PieceAndMoves, ROOK } from './direction'
let HomeKing: King
let AwayKing: King
let Board: Array<Array<string>>
let toMove: boolean
let enPassantSquare: conditionalCoordinate

export const atCoordinate = (Coordinate: Coordinate): string =>
  Board[Coordinate.i][Coordinate.j]

export const getMove = (): boolean => toMove

export default function formulateLegalMoves(
  updatedBoard: Array<Array<string>>,
  Kings: KINGS,
  newtoMove: boolean,
  possibleenPassantSquare: conditionalCoordinate
): Array<PIECEMOVE> {
  toMove = newtoMove
  HomeKing = toMove ? Kings.white : Kings.black
  AwayKing = !toMove ? Kings.white : Kings.black
  Board = updatedBoard
  enPassantSquare = possibleenPassantSquare

  return HomeKing.isChecked
    ? formMovesCheckedConfiguration()
    : formMovesUnCheckedConfiguration()
}

function formMovesUnCheckedConfiguration(): Array<PIECEMOVE> {
  let LegalMoves: Array<PIECEMOVE> = []
  if (HomeKing.isChecked) {
  } else {
    for (let i: number = 0; i < 8; ++i) {
      for (let j: number = 0; j < 8; ++j) {
        if (Board[i][j] === ' ') {
          continue
        }
        if (isPieceWhite(Board[i][j]) === toMove) {
          LegalMoves.push(getSpecificMove({ i, j }))
        }
      }
    }
  }
  return LegalMoves
}

function formMovesCheckedConfiguration(): Array<PIECEMOVE> {
  // added king moves
  let LegalMoves: Array<PIECEMOVE> = [getSpecificMove(HomeKing.residence)]

  // if two checks, then no other can defend, only king can
  if (HomeKing.checkOrigin.length == 2) {
    return LegalMoves
  }

  // some other piece can potentially defend the king by coming in between them
  // but have to consider the case when the check is being given by knight

  // pawn's check can be treated as zero space bishop check
  const vector: Coordinate = subtractCoordinates(
    HomeKing.checkOrigin[0],
    HomeKing.residence
  )
  if (inValidQRBattackConfiguration(vector.i, vector.j)) {
    // checkOriginated by knight
    defendAbleCoordinate(HomeKing.checkOrigin[0], LegalMoves, true)
  } else {
    // checkOriginated by rook, pawn, queen, bishop
    const unitVector = unitify(vector)
    let iterativeCoordinate: Coordinate = addCoordinates(
      HomeKing.residence,
      unitVector
    )

    while (isValidCoordinate(iterativeCoordinate)) {
      defendAbleCoordinate(
        iterativeCoordinate,
        LegalMoves,
        atCoordinate(iterativeCoordinate) !== ' '
      )

      iterativeCoordinate = addCoordinates(iterativeCoordinate, unitVector)
    }
  }

  return LegalMoves
}

function getSpecificMove(origin: Coordinate): PIECEMOVE {
  switch (atCoordinate(origin).toLowerCase()) {
    case 'r':
      return rookMove(origin)
    case 'b':
      return bishopMove(origin)
    case 'n':
      return knightMove(origin)
    case 'q':
      return queenMove(origin)
    case 'k':
      return kingMove(origin, HomeKing)
    case 'p':
      return pawnMove(origin, enPassantSquare)
    default:
      console.log('FATAL ERROR!')
      break
  }
}

/*

START OF LOCALISED DIRECTIONAL MOVES

*/
export function formDirectionalMoves(
  origin: Coordinate,
  direction: Array<Coordinate>
): Array<Move> {
  let movesLegible: Array<Move> = []
  const deltaI = origin.i - AwayKing.residence.i
  const deltaJ = origin.j - AwayKing.residence.j
  const unitDirection: Coordinate = {
    i: Math.sign(deltaI),
    j: Math.sign(deltaJ),
  }

  const possibleDiscoveredCheck: conditionalCoordinate =
    inValidQRBattackConfiguration(deltaI, deltaJ)
      ? false
      : foundAttacker(unitDirection, origin, AwayKing)

  for (let x: number = 0; x < direction.length; ++x) {
    let iterativeCoordinate: Coordinate = {
      i: origin.i + direction[x].i,
      j: origin.j + direction[x].j,
    }
    let discoveryData: conditionalCoordinate = possibleDiscoveredCheck
    if (CompareCoordinates(unitDirection, direction[x])) {
      discoveryData = false
    }

    while (isValidCoordinate(iterativeCoordinate)) {
      const at: string = atCoordinate(iterativeCoordinate)
      if (at !== ' ') {
        if (isPieceWhite(at) !== toMove) {
          movesLegible.push({
            target: { ...iterativeCoordinate },
            isCapture: true,
            discoverCheckData: discoveryData ? { ...discoveryData } : false,
          })
        }
        break
      } else {
        movesLegible.push({
          target: { ...iterativeCoordinate },
          discoverCheckData: discoveryData ? { ...discoveryData } : false,
        })
      }
      iterativeCoordinate.i += direction[x].i
      iterativeCoordinate.j += direction[x].j
    }
  }
  return movesLegible
}
/*

END OF LOCALISED DIRECTIONAL MOVES

*/

/*

START OF DISPLACED ORIGIN POSSILE DIRECTIONS

*/
export function originDisplace(
  originCoordinate: Coordinate
): DirectionAvailable {
  const deltaI = originCoordinate.i - HomeKing.residence.i
  const deltaJ = originCoordinate.j - HomeKing.residence.j

  const directionsAvailable: DirectionAvailable = {
    inFile: true,
    inRank: true,
    inMaxDiagonal: true,
    inMinDiagonal: true,
  }

  if (inValidQRBattackConfiguration(deltaI, deltaJ)) {
    return directionsAvailable
  }

  const unitDirection: Coordinate = {
    i: Math.sign(deltaI),
    j: Math.sign(deltaJ),
  }

  if (foundAttacker(unitDirection, originCoordinate, HomeKing)) {
    for (const direction in directionsAvailable) {
      directionsAvailable[direction] = false
    }

    if (unitDirection.i === 0) {
      directionsAvailable.inRank = true
    } else if (unitDirection.j === 0) {
      directionsAvailable.inFile = true
    } else if (unitDirection.i === unitDirection.j) {
      directionsAvailable.inMinDiagonal = true
    } else {
      directionsAvailable.inMaxDiagonal = true
    }
  }

  return directionsAvailable
}
/*

END OF DISPLACED ORIGIN POSSILE DIRECTIONS

*/

/*

START OF ATTACKER FOR A PARTICULAR DIRECTION

*/
function foundAttacker(
  unitDirection: Coordinate,
  originCoordinate: Coordinate,
  King: King
): conditionalCoordinate {
  let possibleAttacker = ['Q']
  possibleAttacker.push(unitDirection.i * unitDirection.j === 0 ? 'R' : 'B')

  if (CompareCoordinates(HomeKing.residence, King.residence)) {
    if (toMove) {
      possibleAttacker = possibleAttacker.map((piece) => piece.toLowerCase())
    }
  } else {
    if (!toMove) {
      possibleAttacker = possibleAttacker.map((piece) => piece.toLowerCase())
    }
  }

  let iterativeCoordinate: Coordinate = {
    i: King.residence.i + unitDirection.i,
    j: King.residence.j + unitDirection.j,
  }

  while (isValidCoordinate(iterativeCoordinate)) {
    const at: string = atCoordinate(iterativeCoordinate)
    if (
      at !== ' ' &&
      !CompareCoordinates(iterativeCoordinate, originCoordinate)
    ) {
      if (possibleAttacker.includes(at)) {
        return { ...iterativeCoordinate }
      }
    }
    iterativeCoordinate.i += unitDirection.i
    iterativeCoordinate.j += unitDirection.j
  }

  return false
}
/*

END OF ATTACKER FOR A PARTICULAR DIRECTION

*/

export function getDiscoveryData(origin: Coordinate) {
  const deltaI = origin.i - AwayKing.residence.i
  const deltaJ = origin.j - AwayKing.residence.j
  const unitDirection: Coordinate = {
    i: Math.sign(deltaI),
    j: Math.sign(deltaJ),
  }

  return inValidQRBattackConfiguration(deltaI, deltaJ)
    ? false
    : foundAttacker(unitDirection, origin, AwayKing)
}

export function getDeltaJ(j: number) {
  return Math.sign(j - AwayKing.residence.j)
}

export function getUnitDelta(origin: Coordinate) {
  return unitify(subtractCoordinates(origin, AwayKing.residence))
}

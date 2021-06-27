import { King } from '../Classes/King'
import { Move } from '../Interface/Move'
import {
  BISHOP,
  KING,
  knightMoveVectors,
  PieceAndMoves,
  ROOK,
} from './direction'
import { CastleRights } from '../Interface/CastlingRights'
import { conditionalCoordinate, Coordinate } from '../Interface/Coordinate'
import { DirectionAvailable, KINGS, PIECEMOVE } from '../Interface/general'
import {
  changeCase,
  changeDirectionCase,
  CompareCoordinates,
  inValidQRBattackConfiguration,
  isPieceWhite,
  isValidCoordinate,
} from '../util'
import pawnMove from './PieceMoves/PawnMove'
import bishopMove from './PieceMoves/BishopMove'
import rookMove from './PieceMoves/RookMove'
import queenMove from './PieceMoves/QueenMove'
import knightMove from './PieceMoves/KnightMove'
let HomeKing: King
let AwayKing: King
let Board: Array<Array<string>>
let toMove: boolean
let enPassantSquare: conditionalCoordinate
let castlingRights: CastleRights

export const atCoordinate = (Coordinate: Coordinate): string =>
  Board[Coordinate.i][Coordinate.j]

export const getMove = (): boolean => toMove

export default function formulateLegalMoves(
  updatedBoard: Array<Array<string>>,
  Kings: KINGS,
  newtoMove: boolean,
  possibleenPassantSquare: conditionalCoordinate,
  updatedCastlingRights: CastleRights
): Array<PIECEMOVE> {
  toMove = newtoMove
  HomeKing = toMove ? Kings.white : Kings.black
  AwayKing = !toMove ? Kings.white : Kings.black
  Board = updatedBoard
  enPassantSquare = possibleenPassantSquare
  castlingRights = updatedCastlingRights

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
      return kingMove(origin)
    case 'p':
      return pawnMove(origin, enPassantSquare)
    default:
      console.log('FATAL ERROR!')
      break
  }
}
/*

START OF KING MOVES

*/
function kingMove(origin: Coordinate): PIECEMOVE {
  const kingMoves: PIECEMOVE = {
    origin: origin,
    moves: [],
  }

  return kingMoves
}
/*

END OF KING MOVES

*/

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
  return j - AwayKing.residence.j
}

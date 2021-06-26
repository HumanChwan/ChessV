import { King } from './Classes/King'
import { Move } from './Interface/Move'
import {
  BISHOP,
  KING,
  knightMoveVectors,
  PieceAndMoves,
  ROOK,
} from './direction'
import { CastleRights } from './Interface/CastlingRights'
import { conditionalCoordinate, Coordinate } from './Interface/Coordinate'
import { DirectionAvailable, KINGS, PIECEMOVE } from './Interface/general'
import {
  changeCase,
  changeDirectionCase,
  CompareCoordinates,
  inValidQRBattackConfiguration,
  isPieceWhite,
  isValidCoordinate,
  isValidCoordinateRF,
  pawnAtBaseRank,
  pawnAtEnemyBaseRank,
} from './util'
let HomeKing: King
let AwayKing: King
let Board: Array<Array<string>>
let toMove: boolean
let enPassantSquare: conditionalCoordinate
let castlingRights: CastleRights

const atCoordinate = (Coordinate: Coordinate): string =>
  Board[Coordinate.i][Coordinate.j]

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
      return pawnMove(origin)
    default:
      console.log('FATAL ERROR!')
      break
  }
}

/*

START OF PAWN MOVES

*/
function pawnMove(origin: Coordinate): PIECEMOVE {
  const moveDirection = toMove ? -1 : 1
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

  // straight moves
  if (allowedDirections.inFile && Board[forwardRank][origin.j] === ' ') {
    const discoveryData = deltaJ === 0 ? false : possibleDiscoveredCheck

    // basic pawnPUSH
    pawnMoves.moves.push({
      target: { i: forwardRank, j: origin.j },
      isPawnMove: true,
      discoverCheckData: discoveryData ? { ...discoveryData } : false,
      isPromotion: pawnAtEnemyBaseRank(forwardRank, toMove) ? 'Y' : false,
    })

    // intial available double push of pawn
    if (pawnAtBaseRank(origin.i, toMove)) {
      if (Board[forwardRank + moveDirection][origin.j] === ' ') {
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
  if (
    allowedDirections.inMaxDiagonal &&
    isValidCoordinateRF(origin.i + moveDirection, origin.j - moveDirection) &&
    Board[origin.i + moveDirection][origin.j - moveDirection] !== ' ' &&
    isPieceWhite(Board[origin.i + moveDirection][origin.j - moveDirection]) !==
      toMove
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
      isPromotion: pawnAtEnemyBaseRank(forwardRank, toMove) ? 'Y' : false,
    })
  }

  // on the minDiagonal : \
  if (
    allowedDirections.inMinDiagonal &&
    isValidCoordinateRF(origin.i + moveDirection, origin.j + moveDirection) &&
    Board[origin.i + moveDirection][origin.j + moveDirection] !== ' ' &&
    isPieceWhite(Board[origin.i + moveDirection][origin.j + moveDirection]) !==
      toMove
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
      isPromotion: pawnAtEnemyBaseRank(forwardRank, toMove) ? 'Y' : false,
    })
  }

  return pawnMoves
}
/*

END OF PAWN MOVES

*/

/*

START OF BISHOP MOVES

*/
function bishopMove(origin: Coordinate): PIECEMOVE {
  const allowedDirections = originDisplace(origin)

  let direction: Array<Coordinate> = []
  if (allowedDirections.inMinDiagonal) {
    direction.push({ i: 1, j: 1 })
    direction.push({ i: -1, j: -1 })
  }

  if (allowedDirections.inMaxDiagonal) {
    direction.push({ i: 1, j: -1 })
    direction.push({ i: -1, j: 1 })
  }

  const bishopMoves: PIECEMOVE = {
    origin: origin,
    moves: formDirectionalMoves(origin, direction),
  }

  return bishopMoves
}
/*

END OF BISHOP MOVES

*/

/*

START OF ROOK MOVES

*/
function rookMove(origin: Coordinate): PIECEMOVE {
  const allowedDirections = originDisplace(origin)

  let direction: Array<Coordinate> = []
  if (allowedDirections.inFile) {
    direction.push({ i: 0, j: 1 })
    direction.push({ i: 0, j: -1 })
  }

  if (allowedDirections.inRank) {
    direction.push({ i: 1, j: 0 })
    direction.push({ i: -1, j: 0 })
  }

  const rookMoves: PIECEMOVE = {
    origin: origin,
    moves: formDirectionalMoves(origin, direction),
  }

  return rookMoves
}
/*

END OF ROOK MOVES

*/

/*

START OF QUEEN MOVES

*/
function queenMove(origin: Coordinate) {
  const allowedDirections = originDisplace(origin)

  let direction: Array<Coordinate> = []
  if (allowedDirections.inFile) {
    direction.push({ i: 1, j: 0 })
    direction.push({ i: -1, j: 0 })
  }

  if (allowedDirections.inRank) {
    direction.push({ i: 0, j: 1 })
    direction.push({ i: 0, j: -1 })
  }

  if (allowedDirections.inMinDiagonal) {
    direction.push({ i: 1, j: 1 })
    direction.push({ i: -1, j: -1 })
  }

  if (allowedDirections.inMaxDiagonal) {
    direction.push({ i: 1, j: -1 })
    direction.push({ i: -1, j: 1 })
  }

  const queenMoves: PIECEMOVE = {
    origin: origin,
    moves: formDirectionalMoves(origin, direction),
  }

  return queenMoves
}
/*

END OF QUEEN MOVES

*/

/*

START OF KNIGHT MOVES

*/
function knightMove(origin: Coordinate): PIECEMOVE {
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
    } else if (isPieceWhite(squareOccupation) !== toMove) {
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
/*

END OF KNIGHT MOVES

*/

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
function formDirectionalMoves(
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
function originDisplace(originCoordinate: Coordinate): DirectionAvailable {
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

function safeSquare(location: Coordinate): boolean {
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
    Board[location.i + moveDirection][location.j - 1] === pawn
  ) {
    return false
  }

  if (
    isValidCoordinateRF(location.i + moveDirection, location.j + 1) &&
    Board[location.i + moveDirection][location.j + 1] === pawn
  ) {
    return false
  }
  // END: Pawns

  return true
}

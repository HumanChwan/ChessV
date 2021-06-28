import formulateLegalMoves from '../MoveFormation/formulateMoves'
import { CastleRights } from '../Interface/CastlingRights'
import {
  conditionalCoordinate,
  Coordinate,
  OriginToTarget,
} from '../Interface/Coordinate'
import { KINGS, PIECEMOVE } from '../Interface/general'
import {
  addCoordinates,
  changeCase,
  CompareCoordinates,
  customisedPawnMove,
  extendedDirection,
  formCastlingRights,
  formCoordinatefromChessCoordinate,
  isValidCoordinate,
  readCastlingRights,
  readenPassant,
  setBooleanMove,
  subtractCoordinates,
} from '../util'
import { King } from './King'
import { Move } from '../Interface/Move'
import { BISHOP, KNIGHT, PieceAndMoves, ROOK } from '../MoveFormation/direction'

export class Chess {
  FEN: string
  FENAsList: Array<string>
  BoardAsFEN: string
  toMove: boolean
  castlingRights: CastleRights
  enPassantSquare: conditionalCoordinate
  fiftyCountRule: number
  MoveCount: number
  Kings: KINGS
  Board: Array<Array<string>>
  Moves: Array<PIECEMOVE>

  // FEN : rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR   w    KQkq     -     0        1
  //              BOARD                                  M     CR     En   Fifty  MoveCount

  constructor(FEN: string) {
    this.FEN = FEN

    this.FENAsList = FEN.split(' ')

    this.BoardAsFEN = this.FENAsList[0]

    this.toMove = setBooleanMove(this.FENAsList[1])

    this.castlingRights = formCastlingRights(this.FENAsList[2])

    this.enPassantSquare = formCoordinatefromChessCoordinate(this.FENAsList[3])

    this.fiftyCountRule = Number(this.FENAsList[4])

    this.MoveCount = Number(this.FENAsList[5])

    this.formulateBoard()

    this.Kings = {
      white: new King(true, this.findKing(true), {
        KingSide: this.castlingRights.K,
        QueenSide: this.castlingRights.Q,
      }),
      black: new King(false, this.findKing(false), {
        KingSide: this.castlingRights.k,
        QueenSide: this.castlingRights.q,
      }),
    }

    this.processMoves()
  }

  formulateBoard(): void {
    this.Board = this.BoardAsFEN.split('/').map((row) => {
      const rowAssigned: Array<string> = Array(8).fill(' ')
      let k: number = 0
      for (let i: number = 0; i < row.length; ++i) {
        if ('1' <= row[i] && row[i] <= '8') {
          k += Number(row[i])
        } else {
          rowAssigned[k] = row[i]
          k++
        }
      }
      return rowAssigned
    })
  }

  processMoves(): void {
    // call functions probably lol
    this.Moves = formulateLegalMoves(
      this.Board,
      this.Kings,
      this.toMove,
      this.enPassantSquare
    )
  }

  invertMoves(originCoordinate: Coordinate, move: Move): void {
    this.toMove = !this.toMove

    this.updateProperties(originCoordinate, move)
    this.processMoves()
  }

  updateProperties(originCoordinate: Coordinate, move: Move) {
    const piecePlayed: string =
      this.Board[originCoordinate.i][originCoordinate.j]
    this.Board[originCoordinate.i][originCoordinate.j] = ' '
    const possibleCapturedPiece = this.Board[move.target.i][move.target.j]
    this.Board[move.target.i][move.target.j] = piecePlayed

    if (move.castlingMove) {
      this.handleCastleMove(move.castlingMove)
    } else if (move.attacksenPassantSquare) {
      this.handleEnPassantCapture(move.attacksenPassantSquare)
    } else if (move.isPromotion) {
      this.handlePromotion(move.isPromotion, move.target)
    }

    if (move.isPawnMove || move.isCapture) {
      this.fiftyCountRule = 0
    } else {
      this.fiftyCountRule++
    }

    if (this.toMove) {
      this.MoveCount++
    }

    if (move.enPassantSquare) {
      this.enPassantSquare = move.enPassantSquare
    }

    if (['k', 'K'].includes(piecePlayed)) {
      this.removeAllCastlingRights(!this.toMove)
    }

    if (['r', 'R'].includes(piecePlayed)) {
      this.removeCastlingRightsbyRookMove(!this.toMove, originCoordinate)
    }

    if (move.isCapture && ['r', 'R'].includes(possibleCapturedPiece)) {
      this.removeCastlingRightscausedByRookCaptue(!this.toMove, move.target)
    }

    if (move.discoverCheckData) {
      this.Kings[this.toMove ? 'white' : 'black'].newCheckOrigin(
        move.discoverCheckData
      )
    }

    if (this.canCheck(move.target)) {
      this.Kings[this.toMove ? 'white' : 'black'].newCheckOrigin(move.target)
    }
    this.updateBoardAsFEN(originCoordinate.i, move.target.i)
    this.updateFEN()
  }

  atCoordinate(coordinate: Coordinate): string {
    return this.Board[coordinate.i][coordinate.j]
  }

  handleCastleMove(rookMove: OriginToTarget) {
    const piece: string = this.Board[rookMove.origin.i][rookMove.origin.j]
    this.Board[rookMove.origin.i][rookMove.origin.j] = ' '
    this.Board[rookMove.target.i][rookMove.target.j] = piece

    this.removeAllCastlingRights(!this.toMove)
  }

  removeAllCastlingRights(ofWhite: boolean) {
    if (!ofWhite) {
      if (this.Kings.black.hasMoved) {
        return
      }
      // black has lost its castling rights
      this.Kings.black.nullifyCastleRights()
      this.castlingRights.k = false
      this.castlingRights.q = false
    } else {
      if (this.Kings.white.hasMoved) {
        return
      }
      // white has lost its castling rights
      this.Kings.white.nullifyCastleRights()
      this.castlingRights.K = false
      this.castlingRights.Q = false
    }
  }

  removeCastlingRightsbyRookMove(
    ofWhite: boolean,
    originCoordinates: Coordinate
  ) {
    if (ofWhite) {
      if (originCoordinates.i !== 7) {
        return
      }
      if (originCoordinates.j === 7) {
        this.Kings.white.removeKingSideCastle()
        this.castlingRights.K = false
      } else if (originCoordinates.j === 0) {
        this.Kings.white.removeQueenSideCastle()
        this.castlingRights.Q = false
      }
    } else {
      if (originCoordinates.i !== 0) {
        return
      }
      if (originCoordinates.j === 7) {
        this.Kings.black.removeKingSideCastle()
        this.castlingRights.k = false
      } else if (originCoordinates.j === 0) {
        this.Kings.black.removeQueenSideCastle()
        this.castlingRights.q = false
      }
    }
  }

  removeCastlingRightscausedByRookCaptue(
    ofWhite: boolean,
    rookCoordinate: Coordinate
  ) {
    if (ofWhite) {
      if (this.castlingRights.K) {
        if (rookCoordinate.i === 7 && rookCoordinate.j === 7) {
          this.castlingRights.K = false
        }
      } else if (this.castlingRights.Q) {
        if (rookCoordinate.i === 7 && rookCoordinate.j === 0) {
          this.castlingRights.Q = false
        }
      }
    } else {
      if (this.castlingRights.k) {
        if (rookCoordinate.i === 0 && rookCoordinate.j === 7) {
          this.castlingRights.k = false
        }
      } else if (this.castlingRights.q) {
        if (rookCoordinate.i === 0 && rookCoordinate.j === 0) {
          this.castlingRights.q = false
        }
      }
    }
  }

  handleEnPassantCapture(pawnCaptured: Coordinate) {
    this.Board[pawnCaptured.i][pawnCaptured.j] = ' '
  }

  handlePromotion(promotedToPiece: string, target: Coordinate) {
    this.Board[target.i][target.j] = changeCase(promotedToPiece, !this.toMove)
  }

  updateBoardAsFEN(destructedRow: number, constructedRow: number) {
    this.BoardAsFEN = this.BoardAsFEN.split('/')
      .map((r, i) => {
        if ([destructedRow, constructedRow].includes(i)) {
          // return fresh
          let space: number = 0
          let newRow: string = ''

          for (let j: number = 0; j < 8; ++j) {
            if (this.Board[i][j] == ' ') {
              space++
            } else {
              if (space) newRow += space.toString()
              space = 0
              newRow += this.Board[i][j]
            }
          }
          if (space) newRow += space.toString()

          return newRow
        }
        return r
      })
      .join('/')
  }

  updateFEN() {
    this.FEN = [
      this.BoardAsFEN,
      this.toMove,
      readCastlingRights(this.castlingRights),
      readenPassant(this.enPassantSquare),
      this.fiftyCountRule,
      this.MoveCount,
    ].join(' ')
  }

  findKing(kingSide: boolean): Coordinate {
    const King = kingSide ? 'K' : 'k'

    for (let i = 0; i < 8; ++i) {
      for (let j = 0; j < 8; ++j) {
        if (this.Board[i][j] === King) {
          return { i, j }
        }
      }
    }
  }

  getCheckData(origin: Coordinate, pieceMove: PieceAndMoves): boolean {
    const vector: Coordinate = subtractCoordinates(
      origin,
      this.Kings[this.toMove ? 'white' : 'black'].residence
    )

    for (let x = 0; x < pieceMove.directions.length; ++x) {
      if (!extendedDirection(pieceMove.directions[x], vector)) {
        continue
      }
      let iterativeCoordinate: Coordinate = addCoordinates(
        origin,
        pieceMove.directions[x]
      )
      let depth = pieceMove.depth
      while (depth-- && isValidCoordinate(iterativeCoordinate)) {
        if (
          CompareCoordinates(
            this.Kings[this.toMove ? 'white' : 'black'].residence,
            iterativeCoordinate
          )
        ) {
          return true
        }

        iterativeCoordinate = addCoordinates(
          iterativeCoordinate,
          pieceMove.directions[x]
        )
      }
    }

    return false
  }

  canCheck(shiftedOrigin: Coordinate): boolean {
    switch (this.atCoordinate(shiftedOrigin).toLowerCase()) {
      case 'r':
        return this.getCheckData(shiftedOrigin, ROOK)
      case 'n':
        return this.getCheckData(shiftedOrigin, KNIGHT)
      case 'b':
        return this.getCheckData(shiftedOrigin, BISHOP)
      case 'k':
        return false
      case 'q':
        return (
          this.getCheckData(shiftedOrigin, BISHOP) ||
          this.getCheckData(shiftedOrigin, ROOK)
        )
      case 'p':
        return this.getCheckData(shiftedOrigin, customisedPawnMove(this.toMove))
    }
  }
}

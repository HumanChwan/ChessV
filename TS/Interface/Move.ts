import {
  conditionalCoordinate,
  conditionalMoveReference,
  Coordinate,
} from './Coordinate'

export interface Move {
  // Coordinate to which piece moves
  target: Coordinate

  // if the piece Captures Opponent piece
  isCapture?: boolean

  // if the piece moved is a PAWN
  isPawnMove?: boolean

  // if the move results in formation of an enPassantSquare
  // the Coordinate of the enPassantSquare, if applicable
  enPassantSquare?: conditionalCoordinate

  // if the piece moved, results in Capturing the enPassantSquare
  // Captured Pawn's Coordinate
  attacksenPassantSquare?: conditionalCoordinate

  // if the move is a CastleMove, then the MoveReference of the Rook.
  castlingMove?: conditionalMoveReference

  // if the move is such that the Pawn moved ends up on the oppponent's base Rank.
  // is changed at the interaction to a string
  isPromotion?: string | false

  // if isDiscoveredCheck, then the coordinate of that particular piece
  discoverCheckData?: conditionalCoordinate

  // if a the particular move gives Check to the Away King
  checks?: conditionalCoordinate
}

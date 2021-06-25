import {
	Coordinate,
	conditionalCoordinate,
	conditionalMoveReference,
} from '../Interface/Coordinate'

export class Move {
	target: Coordinate
	isCapture: boolean
	isPawnMove: boolean
	enPassantSquareFormation: conditionalCoordinate
	attacksenPassantSquare: conditionalCoordinate
	castlingMove: conditionalMoveReference
	isPromotion: string | false

	constructor(
		target: Coordinate,
		isCapture: boolean = false,
		isPawnMove: boolean = false,
		enPassantSquareFormation: conditionalCoordinate = false,
		attacksenPassantSquare: conditionalCoordinate = false,
		castlingMove: conditionalMoveReference = false
	) {
		// Coordinate to which piece moves
		this.target = target

		// if the piece Captures Opponent piece
		this.isCapture = isCapture

		// if the piece moved is a PAWN
		this.isPawnMove = isPawnMove

		// if the move results in formation of an enPassantSquare
		// the Coordinate of the enPassantSquare, if applicable
		this.enPassantSquareFormation = enPassantSquareFormation

		// if the piece moved, results in Capturing the enPassantSquare
		// Captured Pawn's Coordinate
		this.attacksenPassantSquare = attacksenPassantSquare

		// if the move is a CastleMove, then the MoveReference of the Rook.
		this.castlingMove = castlingMove

		// if the move is such that the Pawn moved ends up on the oppponent's base Rank.
		// is changed at the interaction to a string
		this.isPromotion = [0, 7].includes(target[0]) && isPawnMove ? 'Q' : false
	}
}

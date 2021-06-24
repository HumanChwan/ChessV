export class Move {
	constructor(
		target,
		isCapture = false,
		isPawnMove = false,
		enPassantSquareFormation = false,
		attacksenPassantSquare = false,
		castlingMove = false
	) {
		this.target = target;
		this.isCapture = isCapture;
		this.isPawnMove = isPawnMove;
		this.enPassantSquareFormation = enPassantSquareFormation;
		this.attacksenPassantSquare = attacksenPassantSquare;
		this.castlingMove = castlingMove;
		this.isPromotion = [0, 7].includes(target[0]) && isPawnMove;
	}
}

import { Move } from './Classes/Move.js';
import { dirBishop, dirKing, dirKnight, dirRook } from './MoveDirections.js';
import {
	isWhite,
	matchCoordinates,
	notationToCoordinates,
	isValid,
} from './util.js';

let Board;
let whiteToMove;
let enPassantSquare;

export default function getAvailableMoves(
	newBoard,
	inWhiteToMove,
	specific = false,
	newenPassantSquare = '-'
) {
	Board = newBoard;
	whiteToMove = inWhiteToMove;
	let moveAvailable = {};
	enPassantSquare = notationToCoordinates(newenPassantSquare);

	function MovesAppend(i, j) {
		switch (Board[i][j].toLowerCase()) {
			case 'p':
				return pawnMove(i, j);
			case 'r':
				return rookMove(i, j);
			case 'n':
				return knightMove(i, j);
			case 'b':
				return bishopMove(i, j);
			case 'q':
				return queenMove(i, j);
			case 'k':
				return kingMove(i, j);
		}
	}

	if (specific) {
		return MovesAppend(specific[0], specific[1]);
	}

	for (let i = 0; i < 8; ++i) {
		for (let j = 0; j < 8; ++j) {
			if (Board[i][j] !== ' ' && whiteToMove === isWhite(Board[i][j])) {
				// do stuff
				moveAvailable[`${i}${j}`] = MovesAppend(i, j);
			}
		}
	}
	return moveAvailable;
}

function moveOntoDirection(i, j, dir, depth) {
	let movesCategorized = [];

	for (let x = 0; x < dir.length; ++x) {
		let depthIn = depth;
		let pI = i,
			pJ = j;
		while (depthIn--) {
			if (!isValid(pI + dir[x][0], pJ + dir[x][1])) break;
			let atIJ = Board[pI + dir[x][0]][pJ + dir[x][1]];
			if (atIJ === ' ') {
				movesCategorized.push(
					new Move([pI + dir[x][0], pJ + dir[x][1]])
				);
			} else if (whiteToMove === isWhite(atIJ)) {
				break;
			} else {
				movesCategorized.push(
					new Move([pI + dir[x][0], pJ + dir[x][1]], true)
				);
				break;
			}
			pI += dir[x][0];
			pJ += dir[x][1];
		}
	}
	return movesCategorized;
}

function pawnMove(i, j) {
	const moveDirection = whiteToMove ? -1 : 1;
	const pawnBase = whiteToMove ? 6 : 1;
	let movesCategorized = [];
	// left and right
	const LnR = [-1, 1];
	for (let d = 0; d < 2; ++d) {
		if (isValid(i + moveDirection, j + LnR[d])) {
			// Normal Capture
			if (
				Board[i + moveDirection][j + LnR[d]] !== ' ' &&
				isWhite(Board[i + moveDirection][j + LnR[d]]) !== whiteToMove
			) {
				movesCategorized.push(
					new Move([i + moveDirection, j + LnR[d]], true, true)
				);
			}

			// Enpassant Capture
			if (
				enPassantSquare &&
				matchCoordinates(
					[i + moveDirection, j + LnR[d]],
					enPassantSquare
				)
			) {
				movesCategorized.push(
					new Move(
						[i + moveDirection, j + LnR[d]],
						true,
						true,
						false,
						[i, j + LnR[d]]
					)
				);
			}
		}
	}
	// straight move
	// outOfBound Condition will never be met, bcz no pawn can exist at the opponent base rank
	if (Board[i + moveDirection][j] === ' ') {
		// singleforwardMove
		movesCategorized.push(new Move([i + moveDirection, j], false, true));

		if (i === pawnBase && Board[i + 2 * moveDirection][j] === ' ') {
			// formation of the enPassantSquare
			movesCategorized.push(
				new Move([i + 2 * moveDirection, j], false, true, [
					i + moveDirection,
					j,
				])
			);
		}
	}
	return movesCategorized;
}

function rookMove(i, j) {
	return moveOntoDirection(i, j, dirRook, 8);
}

function knightMove(i, j) {
	return moveOntoDirection(i, j, dirKnight, 1);
}

function bishopMove(i, j) {
	return moveOntoDirection(i, j, dirBishop, 8);
}

function queenMove(i, j) {
	return [...bishopMove(i, j), ...rookMove(i, j)];
}

function kingMove(i, j) {
	return moveOntoDirection(i, j, dirKing, 1);
}

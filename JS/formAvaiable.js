import { dirBishop, dirKing, dirKnight, dirRook } from './MoveDirections.js';
import { isWhite, ok } from './util.js';

let Board;
let whiteToMove;

export default function getAvailableMoves(
	newBoard,
	inWhiteToMove,
	specific = false
) {
	Board = newBoard;
	whiteToMove = inWhiteToMove;
	let moveAvailable = {};
	// console.log(Board);

	function MoveAppend(i, j) {
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
		return MoveAppend(specific[0], specific[1]);
	}

	for (let i = 0; i < 8; ++i) {
		for (let j = 0; j < 8; ++j) {
			if (Board[i][j] !== ' ' && whiteToMove === isWhite(Board[i][j])) {
				// do stuff
				moveAvailable[`${i}${j}`] = MoveAppend(i, j);
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
			if (!ok(pI + dir[x][0], pJ + dir[x][1])) break;
			let atIJ = Board[pI + dir[x][0]][pJ + dir[x][1]];
			if (atIJ === ' ') {
				movesCategorized.push([pI + dir[x][0], pJ + dir[x][1]]);
			} else if (whiteToMove === isWhite(atIJ)) {
				break;
			} else {
				movesCategorized.push([pI + dir[x][0], pJ + dir[x][1]]);
				break;
			}
			pI += dir[x][0];
			pJ += dir[x][1];
		}
	}
	return movesCategorized;
}

function pawnMove(i, j) {
	// do stuff
	let attackDir = whiteToMove ? -1 : 1;
	let movesCategorized = [];
	// left and right
	const LnR = [-1, 1];
	for (let d = 0; d < 2; ++d) {
		if (ok(i + attackDir, j + LnR[d])) {
			if (
				Board[i + attackDir][j + LnR[d]] !== ' ' &&
				isWhite(Board[i + attackDir][j + LnR[d]]) !== whiteToMove
			) {
				movesCategorized.push([i + attackDir, j + LnR[d]]);
			}
		}
	}
	// straight move
	// outOfBound Condition will never be met, bcz no pawn can exist at the opponent base rank
	if (Board[i + attackDir][j] === ' ') {
		movesCategorized.push([i + attackDir, j]);
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

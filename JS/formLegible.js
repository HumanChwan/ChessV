import getAvailableMoves from './formAvailable.js';
import { dirBishop, dirKing, dirKnight, dirRook } from './MoveDirections.js';
import { isValid, signum } from './util.js';
let Board;
let whiteToMove;
let possibleMoves;
let KingData;
let kI, kJ;

export default function getLegibleMoves(
	newBoard,
	newKingData,
	enPassantSquare
) {
	Board = newBoard;
	KingData = newKingData;

	whiteToMove = KingData.isWhite;
	possibleMoves = getAvailableMoves(
		Board,
		whiteToMove,
		false,
		enPassantSquare
	);
	kI = KingData.i;
	kJ = KingData.j;

	KingData.isChecked ? Protecc() : checkForPin();
	return possibleMoves;
}

function Protecc() {
	for (const Coor in possibleMoves) {
		const [i, j] = [parseInt(Coor[0]), parseInt(Coor[1])];
		const piece = Board[i][j];
		possibleMoves[Coor] = possibleMoves[Coor].filter((toCoor) => {
			return piece.toLowerCase() !== 'k'
				? defenderMmnt(toCoor)
				: selfProtecc(toCoor);
		});
	}
}

function defenderMmnt(toCoor) {
	const [i, j] = toCoor;
	for (let iter = 0; iter < KingData.CheckedBy.length; ++iter) {
		const [nI, nJ] = KingData.CheckedBy[iter];
		if (i === nI && j === nJ) continue;

		const piece = Board[nI][nJ].toLowerCase();
		if (['n', 'p'].includes(piece)) {
			return false;
		}

		if (
			signum(j - kJ) * signum(nJ - j) < 0 ||
			signum(i - kI) * signum(nI - i) < 0 ||
			(j - kJ) * (nI - i) !== (nJ - j) * (i - kI)
		) {
			return false;
		}
	}
	return true;
}

function foundEnemy(enemies, dir, Tdepth, atPos) {
	for (let x = 0; x < dir.length; ++x) {
		let [nI, nJ] = [atPos[0] + dir[x][0], atPos[1] + dir[x][1]];
		let depth = Tdepth;
		while (depth-- && isValid(nI, nJ)) {
			if (Board[nI][nJ] !== ' ') {
				if (enemies.includes(Board[nI][nJ])) return true;
				else break;
			}
			nI += dir[x][0];
			nJ += dir[x][1];
		}
	}
	return false;
}

function selfProtecc(toCoor) {
	let EnemyLine = ['N', 'Q', 'B', 'R', 'P', 'K'];

	if (whiteToMove) EnemyLine = EnemyLine.map((piece) => piece.toLowerCase());

	if (foundEnemy([EnemyLine[0]], dirKnight, 1, toCoor)) return false;

	if (foundEnemy([EnemyLine[5]], dirKing, 1, toCoor)) return false;

	if (foundEnemy([EnemyLine[1], EnemyLine[2]], dirBishop, 8, toCoor))
		return false;

	if (foundEnemy([EnemyLine[1], EnemyLine[3]], dirRook, 8, toCoor))
		return false;

	const moveDirection = whiteToMove ? -1 : 1;
	const dirP = [
		[moveDirection, -1],
		[moveDirection, 1],
	];
	if (foundEnemy([EnemyLine[4]], dirP, 1, toCoor)) return false;

	return true;
}

function checkForPin() {
	for (const Coor in possibleMoves) {
		const [fI, fJ] = [parseInt(Coor[0]), parseInt(Coor[1])];
		possibleMoves[Coor] = possibleMoves[Coor].filter((toCoor) => {
			return Board[fI][fJ].toLowerCase() === 'k'
				? selfProtecc(toCoor)
				: notKing(toCoor, fI, fJ);
		});
	}
}

function notKing(toCoor, fI, fJ) {
	const [i, j] = toCoor;
	const rawVector = [fI - kI, fJ - kJ];
	if (
		Math.abs(rawVector[0]) !== Math.abs(rawVector[1]) &&
		rawVector[0] * rawVector[1] !== 0
	) {
		return true;
	}

	const unitVector = rawVector.map((cosine) => signum(cosine));

	let PossibleAttacker = ['Q'];
	PossibleAttacker.push(unitVector[0] * unitVector[1] ? 'B' : 'R');

	if (whiteToMove)
		PossibleAttacker = PossibleAttacker.map((enemy) => enemy.toLowerCase());

	let [nI, nJ] = [kI + unitVector[0], kJ + unitVector[1]];
	while (isValid(nI, nJ)) {
		if (nI === i && nJ === j) return true;
		if (nI === fI && nJ === fJ) {
			nI += unitVector[0];
			nJ += unitVector[1];
			continue;
		}
		if (Board[nI][nJ] !== ' ') {
			if (PossibleAttacker.includes(Board[nI][nJ])) return false;
			else break;
		}
		nI += unitVector[0];
		nJ += unitVector[1];
	}
	return true;
}

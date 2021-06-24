import { isWhite, isValid, signum } from './util.js';

let Board;
let whiteToMove;

export default function isDiscoveredCheck(newBoard, freeCoor, kingCoor) {
	Board = newBoard;
	whiteToMove = isWhite(Board[kingCoor[0]][kingCoor[1]]);
	const rawDirection = [freeCoor[0] - kingCoor[0], freeCoor[1] - kingCoor[1]];

	if (
		Math.abs(rawDirection[0]) !== Math.abs(rawDirection[1]) &&
		rawDirection[0] * rawDirection[1] !== 0
	)
		return null;

	const BeelineDir = [signum(rawDirection[0]), signum(rawDirection[1])];

	return findKingAttacker(BeelineDir, kingCoor);
}

function findKingAttacker(BeelineDir, kingCoor) {
	let PossibleAttacker = ['Q'];
	PossibleAttacker.push(BeelineDir[0] * BeelineDir[1] ? 'B' : 'R');

	if (whiteToMove)
		PossibleAttacker = PossibleAttacker.map((enemy) => enemy.toLowerCase());

	let [sI, sJ] = kingCoor;
	sI += BeelineDir[0];
	sJ += BeelineDir[1];
	let depth = 8;
	while (depth-- && isValid(sI, sJ)) {
		if (Board[sI][sJ] === ' ') {
			sI += BeelineDir[0];
			sJ += BeelineDir[1];
			continue;
		} else {
			if (PossibleAttacker.includes(Board[sI][sJ])) {
				return [sI, sJ];
			} else {
				return null;
			}
		}
	}
	return null;
}

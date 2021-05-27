// import getAvailableMoves from './formAvaiable.js';
import getAvailableMoves from './formAvaiable.js';
import getLegibleMoves from './formLegible.js';
import isDiscoveredCheck from './isDiscoveredCheck.js';
import { isWhite } from './util.js';

export class King {
	constructor(isWhite, I, J) {
		this.i = I;
		this.j = J;
		this.isWhite = isWhite;
		this.isChecked = false;
		this.CheckedBy = [];
	}

	setNewCoordinates(i, j) {
		this.i = i;
		this.j = j;
	}

	setNull() {
		this.isChecked = false;
		this.CheckedBy = [];
	}

	checkAppend(i, j) {
		this.isChecked = true;
		this.CheckedBy.push([i, j]);
	}
}

export class Chess {
	constructor(FEN) {
		this.FEN = FEN;
		this.whiteToMove = true;

		this.Kings = [new King(true, 7, 4), new King(false, 0, 4)];

		this.formBoardAsArray();
		this.formulateMoves();
	}

	FENUpdate(formerRow, newRow) {
		this.FEN = this.FEN.split('/')
			.map((r, i) => {
				if ([formerRow, newRow].includes(i)) {
					// return fresh
					let space = 0;
					let newRow = '';

					for (let j = 0; j < 8; ++j) {
						if (this.Board[i][j] == ' ') {
							space++;
						} else {
							if (space) newRow += space.toString();
							space = 0;
							newRow += this.Board[i][j];
						}
					}
					if (space) newRow += space.toString();

					return newRow;
				}
				return r;
			})
			.join('/');
		// console.log(this.FEN);
	}

	formBoardAsArray() {
		this.Board = this.FEN.split('/').map((row) => {
			let rowAssigned = Array(8).fill(' ');
			let k = 0;
			for (let i = 0; i < row.length; ++i) {
				if ('1' <= row[i] && row[i] <= '8') {
					k += parseInt(row[i]);
				} else {
					rowAssigned[k] = row[i];
					k++;
				}
			}
			return rowAssigned;
		});
	}

	setBoard(formerCoordinate, newCoordinates) {
		const [fI, fJ] = formerCoordinate;
		const [nI, nJ] = newCoordinates;
		const piece = this.Board[fI][fJ];
		const Index = isWhite(piece) ? 0 : 1;

		this.Board[nI][nJ] = piece;
		this.Board[fI][fJ] = ' ';

		if (piece.toLowerCase() === 'k') {
			this.Kings[Index].setNewCoordinates(nI, nJ);
		}

		const dCheck = isDiscoveredCheck(this.Board, formerCoordinate, [
			this.Kings[1 - Index].i,
			this.Kings[1 - Index].j,
		]);
		if (dCheck) this.checked(dCheck[0], dCheck[1]);
		if (
			getAvailableMoves(this.Board, this.whiteToMove, [nI, nJ]).some(
				(coor) =>
					coor[0] === this.Kings[1 - Index].i &&
					coor[1] === this.Kings[1 - Index].j
			)
		) {
			this.checked(nI, nJ);
		}
	}

	formulateMoves() {
		const Index = this.whiteToMove ? 0 : 1;
		this.legalMoves = getLegibleMoves(this.Board, this.Kings[Index]);
		// console.log(this.legalMoves);
	}

	toggleMove() {
		const Index = this.whiteToMove ? 0 : 1;
		this.Kings[Index].setNull();
		this.whiteToMove = !this.whiteToMove;
		this.formulateMoves();
	}

	checked(i, j) {
		const Index = this.whiteToMove ? 1 : 0;
		this.Kings[Index].checkAppend(i, j);
	}
}

const alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function getPiece(piece) {
	let src = '';
	switch (piece.toLowerCase()) {
		case 'p':
			src += 'pawn';
			break;
		case 'r':
			src += 'rook';
			break;
		case 'n':
			src += 'knight';
			break;
		case 'b':
			src += 'bishop';
			break;
		case 'q':
			src += 'queen';
			break;
		case 'k':
			src += 'king';
			break;
	}
	src += '-' + (piece > 'Z' ? 'black' : 'white');
	return src;
}

export const signum = (number) => Math.sign(number);
export const isWhite = (piece) => piece < 'Z';
export const isValid = (i, j) => 0 <= i && i < 8 && 0 <= j && j < 8;

export const notationToCoordinates = (notation) => {
	if (notation === '-') return null;

	const i = 8 - parseInt(notation[1]);
	const j = notation.charCodeAt(0) - 'a'.charCodeAt(0);

	return [i, j];
};

export const coordinatesToChessCoordinates = (coordinate) => {
	try {
		return alpha[coordinate[1]] + coordinate[0];
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const matchCoordinates = (coor1, coor2) => {
	return coor1[0] === coor2[0] && coor1[1] === coor2[1];
};

export const toggleWB = (colorToMove) => {
	if (colorToMove === 'w') {
		return 'b';
	} else {
		return 'w';
	}
};

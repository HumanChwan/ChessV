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
export const ok = (i, j) => 0 <= i && i < 8 && 0 <= j && j < 8;

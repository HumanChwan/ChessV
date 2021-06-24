export class King {
	constructor(isWhite, I, J) {
		this.i = I
		this.j = J
		this.isWhite = isWhite
		this.isChecked = false
		this.CheckedBy = []
	}

	setNewCoordinates(i, j) {
		this.i = i
		this.j = j
	}

	setNull() {
		this.isChecked = false
		this.CheckedBy = []
	}

	checkAppend(i, j) {
		this.isChecked = true
		this.CheckedBy.push([i, j])
	}
}

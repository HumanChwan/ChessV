import { Coordinate } from '../Interface/Coordinate'

export class King {
  residence: Coordinate
  isWhite: boolean
  isChecked: boolean
  checkOrigin: Array<Coordinate>
  hasMoved: boolean

  constructor(isWhite: boolean, residence: Coordinate) {
    this.residence = residence
    this.isWhite = isWhite
    this.isChecked = false
    this.checkOrigin = []
  }

  setNewCoordinates(i: number, j: number) {
    this.residence = { i, j }
    this.hasMoved = true
  }

  removeChecks() {
    this.isChecked = false
    this.checkOrigin = []
  }

  newCheckOrigin(i: number, j: number) {
    this.isChecked = true
    this.checkOrigin.push({ i, j })
  }
}

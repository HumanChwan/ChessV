import { KingsCastleRights } from '../Interface/CastlingRights'
import { Coordinate } from '../Interface/Coordinate'

export class King {
  residence: Coordinate
  isWhite: boolean
  isChecked: boolean
  checkOrigin: Array<Coordinate>
  hasMoved: boolean
  castleRights: KingsCastleRights

  constructor(
    isWhite: boolean,
    residence: Coordinate,
    castleRights: KingsCastleRights
  ) {
    this.residence = residence
    this.isWhite = isWhite
    this.isChecked = false
    this.checkOrigin = []
    this.castleRights = castleRights
  }

  setNewCoordinates(i: number, j: number) {
    this.residence = { i, j }
    this.hasMoved = true
  }

  removeChecks() {
    this.isChecked = false
    this.checkOrigin = []
  }

  newCheckOrigin(checkOrigin: Coordinate) {
    this.isChecked = true
    this.checkOrigin.push({ ...checkOrigin })
  }

  nullifyCastleRights() {
    this.removeKingSideCastle()
    this.removeQueenSideCastle()
  }

  removeKingSideCastle() {
    this.castleRights.KingSide = false
  }

  removeQueenSideCastle() {
    this.castleRights.QueenSide = false
  }
}

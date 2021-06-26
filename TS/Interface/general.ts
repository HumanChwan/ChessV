import { King } from '../Classes/King'
import { Move } from '../Interface/Move'
import { Coordinate } from './Coordinate'

export type KINGS = { white: King; black: King }

export interface PIECEMOVE {
  origin: Coordinate
  moves: Array<Move>
}

export interface DirectionAvailable {
  inFile: boolean
  inRank: boolean
  inMaxDiagonal: boolean
  inMinDiagonal: boolean
}

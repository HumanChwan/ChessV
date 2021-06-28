import { Coordinate } from '../../Interface/Coordinate'
import { PIECEMOVE } from '../../Interface/general'
import { formDirectionalMoves, originDisplace } from '../formulateMoves'

export default function rookMove(origin: Coordinate): PIECEMOVE {
  const allowedDirections = originDisplace(origin)

  let direction: Array<Coordinate> = []
  if (allowedDirections.inFile) {
    direction.push({ i: 0, j: 1 })
    direction.push({ i: 0, j: -1 })
  }

  if (allowedDirections.inRank) {
    direction.push({ i: 1, j: 0 })
    direction.push({ i: -1, j: 0 })
  }

  const rookMoves: PIECEMOVE = {
    origin: origin,
    moves: formDirectionalMoves(origin, direction),
  }

  return rookMoves
}

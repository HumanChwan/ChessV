import { Coordinate } from '../../Interface/Coordinate'
import { PIECEMOVE } from '../../Interface/general'
import { formDirectionalMoves, originDisplace } from '../formulateMoves'

export default function queenMove(origin: Coordinate): PIECEMOVE {
  const allowedDirections = originDisplace(origin)

  let direction: Array<Coordinate> = []
  if (allowedDirections.inFile) {
    direction.push({ i: 1, j: 0 })
    direction.push({ i: -1, j: 0 })
  }

  if (allowedDirections.inRank) {
    direction.push({ i: 0, j: 1 })
    direction.push({ i: 0, j: -1 })
  }

  if (allowedDirections.inMinDiagonal) {
    direction.push({ i: 1, j: 1 })
    direction.push({ i: -1, j: -1 })
  }

  if (allowedDirections.inMaxDiagonal) {
    direction.push({ i: 1, j: -1 })
    direction.push({ i: -1, j: 1 })
  }

  const queenMoves: PIECEMOVE = {
    origin: origin,
    moves: formDirectionalMoves(origin, direction),
  }

  return queenMoves
}

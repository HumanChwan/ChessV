import { Coordinate } from '../../Interface/Coordinate'
import { PIECEMOVE } from '../../Interface/general'
import { formDirectionalMoves, originDisplace } from '../formulateMoves'

export default function bishopMove(origin: Coordinate): PIECEMOVE {
  const allowedDirections = originDisplace(origin)

  let direction: Array<Coordinate> = []
  if (allowedDirections.inMinDiagonal) {
    direction.push({ i: 1, j: 1 })
    direction.push({ i: -1, j: -1 })
  }

  if (allowedDirections.inMaxDiagonal) {
    direction.push({ i: 1, j: -1 })
    direction.push({ i: -1, j: 1 })
  }

  const bishopMoves: PIECEMOVE = {
    origin: origin,
    moves: formDirectionalMoves(origin, direction),
  }

  return bishopMoves
}

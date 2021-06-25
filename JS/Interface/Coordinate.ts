export type conditionalCoordinate = Coordinate | false
export type conditionalMoveReference = OriginToTarget | false

export interface Coordinate {
	i: number
	j: number
}

export interface OriginToTarget {
	origin: Coordinate
	target: Coordinate
}

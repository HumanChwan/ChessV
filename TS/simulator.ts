import { Chess } from './Classes/Chess'

const CookieChess: Chess = new Chess(
  '1n3bnr/r1P1kppp/p3p3/1Q2P3/6b1/1P6/P1P1BPPP/RNBK2NR w - - 1 15'
)

console.log(CookieChess.Moves)

declare var require: any
var fs = require('fs')

const data = JSON.stringify(CookieChess.Moves)

// write JSON string to a file
fs.writeFile('moves.json', data, (err) => {
  if (err) {
    throw err
  }
  console.log('JSON data is saved.')
})

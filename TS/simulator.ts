import { Chess } from './Classes/Chess'

const CookieChess: Chess = new Chess(
  'rnbqkbnr/p3pppp/8/2pp2B1/p1PP4/N7/PP2PPPP/R3KBNR w KQkq - 0 6'
)

console.log(CookieChess.Moves)

declare var require: any
var fs = require('fs')

/* CookieChess.invertMoves(
  {
    i: 7,
    j: 4,
  },
  {
    target: {
      i: 7,
      j: 2,
    },
    castlingMove: {
      origin: {
        i: 7,
        j: 0,
      },
      target: {
        i: 7,
        j: 3,
      },
    },
  }
)

console.log(CookieChess.Board)
 */
const data = JSON.stringify(CookieChess.Moves)

// write JSON string to a file
fs.writeFile('moves.json', data, (err) => {
  if (err) {
    throw err
  }
  console.log('JSON data is saved.')
})

/*
{
  "origin":{
    "i":7,
    "j":4
  },
  "moves":[
    {
      "target":{
        "i":6,
        "j":3
      },
      "isCapture":false,
      "discoverCheckData":false
    },
    {
      "target":{
        "i":7,
        "j":3
      },
      "isCapture":false,
      "discoverCheckData":false
    }
    ,{
      "target":{
        "i":7,
        "j":2
      },
      "castlingMove":{
        "origin":{
          "i":7,
          "j":0
        },
        "target":{
          "i":7,
          "j":3
        }
      }
    }
  ]
}
*/

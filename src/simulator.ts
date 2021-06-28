import { Chess } from './Classes/Chess'

const CookieChess: Chess = new Chess('5k2/8/8/8/8/8/8/4K2R w K - 0 1')

// console.log(CookieChess.Moves)

declare var require: any
var fs = require('fs')

console.log(CookieChess.Moves)

CookieChess.invertMoves(
  {
    i: 7,
    j: 4,
  },
  {
    target: { i: 7, j: 6 },
    castlingMove: {
      origin: { i: 7, j: 7 },
      target: { i: 7, j: 5 },
    },
  }
)
console.log(CookieChess.Kings)
console.log(CookieChess.Moves)

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
// CookieChess.invertMoves(
//   {
//     i: 7,
//     j: 5,
//   },
//   { target: { i: 3, j: 1 }, discoverCheckData: false }
// )
// console.log(CookieChess.Kings.black, CookieChess.Kings.white)

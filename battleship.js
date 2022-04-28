
// set grid rows and columns and the size of each square
var rows = 8;
var cols = 8;
var squareSize = 65;

let currentBoard = "blue";
let defendingBoard = "red"

// get the container element
let gameBoardContainer = document.getElementById("gameboard");
let defendingBoardContainer =  document.getElementById("defendingGameboard");

let gameBoards = {
    "red": [
        ["0","0","0","0","a0","a0","a0","a0"],
        ["0","0","b0","0","0","0","0","0"],
        ["0","0","b0","0","c0","c0","0","0"],
         ["0","0","b1","0","0","0","0","0"],
         ["0","0","b1","0","0","0","0","0"],
         ["0","e0","0","0","0","0","00","0"],
         ["0","e0","0","0","d0","d0","d0","0"],
         ["0","e0","0","0","0","0","0","0"],
        ],
    "blue": [
        ["0","b0","b0","b0","b0","0","0","0"],
           ["0","0","0","0","00","0","0","0"],
           ["0","00","0","0","0","0","0","0"],
           ["0","0","0","0",'a0',"a0","a0","a0"],
           ["0","0","0","0","c1","0","0","0"],
           ["e0",'e0',"e0","0","c1","0","d0","0"],
           ["0","0","0","0","0","0","d0","0"],
           ["0","0","0","0","0","0","d0","0"],
        ]
    }

let iconKey = {
    "0": "🟦",
    "00": "💦",
    "a0": "🚢",
    "b0": "🛳",
    "c0": "🛥",
    "d0": "🛶",
    "e0": "🚤",
    "a1": "💥",
    "b1": "💥",
    "c1": "💥",
    "d1": "💥",
    "e1": "💥",
}

const drawBoard = () => {

    //trash it and redraw
    gameBoardContainer.innerHTML = '';
    // make the grid columns and rows
    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            
            // create a new div HTML element for each grid square and make it the right size
            let square = document.createElement("div");
            gameBoardContainer.appendChild(square);
            
            // give each div element a unique id based on its row and column, like "s00"
            square.id = 'a' + j + i;
            
            const currentTargetValue = gameBoards[currentBoard][j][i];

            if (currentTargetValue && currentTargetValue.match(/[a-z]0/)){
                square.innerHTML = iconKey["0"];
            }else {
               
                square.innerHTML = iconKey[gameBoards[currentBoard][j][i]]
            }
            
            // set each grid square's coordinates: multiples of the current row or column number
            var topPosition = j * squareSize;
            var leftPosition = i * squareSize;			
            
            // use CSS absolute positioning to place each grid square on the page
            square.style.top = topPosition + 'px';
            square.style.left = leftPosition + 'px';						
        }
    }

    for (i = 0; i < cols; i++) {
        for (j = 0; j < rows; j++) {
            
            // create a new div HTML element for each grid square and make it the right size
            let square = document.createElement("div");
            defendingBoardContainer.appendChild(square);
            
        // give each div element a unique id based on its row and column, like "s00"
            square.id = 'd' + j + i; 
            square.innerHTML = iconKey[gameBoards[defendingBoard][j][i]]
            
            // set each grid square's coordinates: multiples of the current row or column number
            var topPosition = j * squareSize;
            var leftPosition = i * squareSize;			
            
            // use CSS absolute positioning to place each grid square on the page
            square.style.top = topPosition + 'px';
            square.style.left = leftPosition + 'px';						
        }
    }
    
}

/* lazy way of tracking when the game is won: just increment hitCount on every hit
   in this version, and according to the official Hasbro rules (http://www.hasbro.com/common/instruct/BattleShip_(2002).PDF)
   there are 17 hits to be made in order to win the game:
      Carrier     - 5 hits
      Battleship  - 4 hits
      Destroyer   - 3 hits
      Submarine   - 3 hits
      Patrol Boat - 2 hits
*/
var hitCount = 0;

/* create the 2d array that will contain the status of each square on the board
   and place ships on the board (later, create function for random placement!)
   0 = empty, 1 = part of a ship, 2 = a sunken part of a ship, 3 = a missed shot
*/


const getTargetCoordinates = () => {
    const target = document.getElementById('target').value;

    const coordinates = Array.from(target);
    if (coordinates.length != 2){
        alert('not a valid coordinate');
        return
    }
    return coordinates
}

const swapboards = (board = currentBoard) => {
    if (currentBoard == "blue") {
        currentBoard = "red";
        defendingBoard = "blue";
    }else {
        currentBoard = "blue";
        defendingBoard = "red";
    }

    drawBoard();
}

// initial code via http://www.kirupa.com/html5/handling_events_for_many_elements.htm:
function fireTorpedo(coordinates) {
    let err = false
	if  (coordinates) {

        //convert alphabetical row to numeric row
        let row = coordinates[0].toLowerCase().charCodeAt(0) - 97;

        let col = coordinates[1];

        if (!gameBoards[currentBoard][row][col]) {
            alert('not a valid coordinate');
            return;
        }
        if (gameBoards[currentBoard][row][col] == "00" || gameBoards[currentBoard][row][col].indexOf("1") > -1) {
			alert("Stop wasting your torpedos! You already fired at this location.");
            return;
        }

        // if player clicks a square with no ship, change the color and change square's value
		if (gameBoards[currentBoard][row][col] == "0") {
			gameBoards[currentBoard][row][col] = "00";
            drawBoard();

            setTimeout(() => {
                alert('Miss!')
                swapboards();
            });
        
			
		// if player clicks a square with a ship, change the color and change square's value
		} else if (gameBoards[currentBoard][row][col] !== "0") {

            let currentShip = gameBoards[currentBoard][row][col];

            gameBoards[currentBoard][row][col] = currentShip.replace('0','1');
            hitCount++;
            drawBoard();

            setTimeout(() => {
                alert('Hit!')
                swapboards();
            });
    
			
		// if player clicks a square that's been previously hit, let them know
		} else if (gameBoards[currentBoard][row][col] > 1) {
			alert("Stop wasting your torpedos! You already fired at this location.");
		}		
    }
}


drawBoard();
document.getElementById('fire').addEventListener("click", () => fireTorpedo(getTargetCoordinates()));

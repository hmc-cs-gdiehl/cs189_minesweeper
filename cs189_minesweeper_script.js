// Minesweeper script
// Author: Grace Diehl

var HEIGHT = 10;        //Height of the Board
var WIDTH = 10;         //Width of the Board
var NUMMINES = 20;      //The number of mines
var UNCLICKED = " ";    //Display character for cells that have not been clicked
var MINE = "X";         //Display character for revealed cells with mines
var NUMFLAGS = 20;      //Number mines - number of flags on board
var NUMUNCLICKED = 80;  //Number of non-mine cells left to reveal



/*
    Returns a random integer between min and max (includes min)
*/
function getRandomInt(min, max) {
  return Math.floor(Math.random()*(max - min)) + min;
}

/*
    Constructor for Cell
*/
function Cell(row, col) {
  this.mine = 0;
  this.neighbors = 0;   //Number of neighbors that are mines
  this.clicked = 0;
  this.flag = 0;
  this.row = row;
  this.col = col;
}

/*
    Takes in a Board object. Sets NUMMINES mines in random cells on the Board.
*/
function setMines(gameBoard) {
    for (i=0; i<NUMMINES; ++i) {
        // Get a random cell
        var row = getRandomInt(0, HEIGHT);
        var col = getRandomInt(0, WIDTH);

        //Keep choosing random cells until we get one that is not a mine
        while (gameBoard.boardData[row][col].mine) {
            row = getRandomInt(0, HEIGHT);
            col = getRandomInt(0, WIDTH);
        }

        // Set the cell to be a mine
        gameBoard.boardData[row][col].mine = 1;
        gameBoard.boardData[row][col].neighbors = 100;
        
        // Increase each neighboring cells neighbor count by one
        if (row != HEIGHT - 1) {
            ++(gameBoard.boardData[row+1][col].neighbors);
            if (col != 0) {
                ++(gameBoard.boardData[row+1][col-1].neighbors);
            }
            if (col != WIDTH -1) {
                ++(gameBoard.boardData[row+1][col+1].neighbors);
            }
        }
        if (row != 0) {
            ++(gameBoard.boardData[row-1][col].neighbors);
            if (col != 0) {
                ++(gameBoard.boardData[row-1][col-1].neighbors);
            }
            if (col != WIDTH -1) {
                ++(gameBoard.boardData[row-1][col+1].neighbors);
            }
        }
        if (col != 0) {
           ++(gameBoard.boardData[row][col-1].neighbors);
        }
        if (col != WIDTH -1) {
            ++(gameBoard.boardData[row][col+1].neighbors);
        }
    }

}

/*
    Constructor for a Board object. Takes in the HTML display table.
*/
function Board(gameBoard) {
    this.boardDisplay =gameBoard;
    this.boardData = [];
    
    for (row=0; row<HEIGHT; ++row){
      var currentRow = [];


      var currentDisplay = this.boardDisplay.insertRow(row);
      for (col=0; col<WIDTH; ++col) {
        var cell1=currentDisplay.insertCell(col);
        cell1.innerHTML = UNCLICKED;
        var newCell = new Cell(row, col);
        currentRow.push(newCell);
      }
      this.boardData.push(currentRow);
  }
  setMines(this);
}

/*
    Resets the input Board and places new mines.
*/
function resetBoard (board) {
    for (row=0; row<HEIGHT; ++row){
      for (col=0; col<WIDTH; ++col) {
        // Reset cell data
        board.boardData[row][col].mine = 0;
        board.boardData[row][col].neighbors = 0;
        board.boardData[row][col].clicked = 0;
        board.boardData[row][col].flag = 0;

        // Reset display
        board.boardDisplay.rows[row].cells.item(col).innerHTML = UNCLICKED;
        board.boardDisplay.rows[row].cells.item(col).style.backgroundColor = "#b3d1ff";
      }
  }
  setMines(board);
}

/*
    Reveals cell that was clicked on. If cell had no neighboring mines, reveals all
    surrounding cells. In the revealed block, all edge cells have neighboring mines.

    gameBoard is type Board. Start is the cell that was clicked on.
*/
function showCells(gameBoard, start){
    
    // Use a queue to keep track of cells that need to be revealed
    var cellsQueue = [];
    cellsQueue.push(start);
    
    while (cellsQueue.length != 0) {
        // Reveal first cell in queue
        var current = cellsQueue.shift();
        row = current.row;
        col = current.col;
        
        if (current.clicked==0 & current.flag == 0){
            --NUMUNCLICKED;
        }
        gameBoard.boardDisplay.rows[row].cells.item(col).innerHTML = gameBoard.boardData[row][col].neighbors;
        gameBoard.boardDisplay.rows[row].cells.item(col).style.backgroundColor = "#e6ffff";
        current.clicked = 1;
        
        // If the current cells has no neighbors, add all neigboring unclicked cells to the queue
        if (current.neighbors == 0) {

            // Set current cell contents to be blank
            gameBoard.boardDisplay.rows[row].cells.item(col).innerHTML = UNCLICKED; 
            

            if (col != 0) {
                var nextCell = gameBoard.boardData[row][col-1];
                if (nextCell.clicked == 0 && nextCell.flag == 0) {
                    cellsQueue.push(nextCell);
                }
             }
            if (col != WIDTH -1) {
                nextCell = gameBoard.boardData[row][col+1];
                if (nextCell.clicked == 0 && nextCell.flag == 0) {
                    cellsQueue.push(nextCell);
                }
            }
            if (row != HEIGHT - 1) {
                nextCell = gameBoard.boardData[row + 1][col];
                if (nextCell.clicked == 0 && nextCell.flag == 0) {
                    cellsQueue.push(nextCell);
                }
                if (col != 0) {
                    nextCell = gameBoard.boardData[row+1][col-1];
                    if (nextCell.clicked == 0 && nextCell.flag == 0) {
                        cellsQueue.push(nextCell);
                    }
                }
                if (col != WIDTH -1) {
                    nextCell = gameBoard.boardData[row+1][col+1];
                    if (nextCell.clicked == 0 && nextCell.flag == 0) {
                        cellsQueue.push(nextCell);
                    }
                }
            }
            if (row != 0) {
                nextCell = gameBoard.boardData[row-1][col];
                if (nextCell.clicked == 0 && nextCell.flag == 0) {
                    cellsQueue.push(nextCell);
                }
                if (col != 0) {
                    nextCell = gameBoard.boardData[row-1][col-1];
                    if (nextCell.clicked == 0 && nextCell.flag == 0) {
                        cellsQueue.push(nextCell);
                    }
                }
                if (col != WIDTH -1 ) {
                   nextCell = gameBoard.boardData[row-1][col+1];
                    if (nextCell.clicked == 0 && nextCell.flag == 0) {
                        cellsQueue.push(nextCell);
                    }
                }
            }
        }
    }
  
}


$(document).ready(function(){
    // Set up the initial game
    var currentDisplay =document.getElementById("gameBoard");
    var score = document.getElementById("minescore");
    score.innerHTML = "Remaining mines: " + NUMFLAGS;
    var board = new Board(currentDisplay);
    var gameover = 0;
    var endgame = document.getElementById("endgame");

    // New Game: Reset the starting variables for a new game, reset the board
    $("#newGame").click(function() {
        NUMFLAGS = 20;
        NUMUNCLICKED = 80;
        gameover = 0;
        score.innerHTML = "Remaining mines: " + NUMFLAGS;
        FIRSTTURN = 1;
        endgame.innerHTML = "";
        resetBoard(board);
        
    });
   
    // Click on the display table
    $("#gameBoard td").click(function() {
       
        var col = parseInt($(this).index());
        var row = parseInt($(this).parent().index());

       
        // If game is in progress, allow click
        if (gameover == 0){

        // Flag or unflag cell if alt key is pressed during click
        if (event.altKey) {
            if (board.boardData[row][col].clicked != 1){
            if (board.boardData[row][col].flag == 0) {
                this.style.backgroundColor = "#9999ff";
                board.boardData[row][col].flag = 1;
                --NUMFLAGS;
                score.innerHTML = "Remaining mines: " + NUMFLAGS;
            }
            else {
                this.style.backgroundColor = "#b3d1ff";
                board.boardData[row][col].flag = 0;
                ++NUMFLAGS;
                score.innerHTML = "Remaining mines: " + NUMFLAGS;
            }
        }
        }
        // Reveal the cell if it is not a mine (with possiblity of winning)
        else if (board.boardData[row][col].mine == 0 && board.boardData[row][col].flag == 0) {
            showCells(board, board.boardData[row][col]);
            if (NUMUNCLICKED == 0) {
                gameover = 1;
                endgame.innerHTML = "You win.";
            }
        }
        // Reveal the cell if it is a mine and end game
        else if (board.boardData[row][col].flag == 0){
            this.innerHTML = MINE;
            this.style.backgroundColor = "red";
            gameover = 1;
            endgame.innerHTML = "You lose.";
        }
        }    
     });
});

import React, {
  Component
} from 'react';
import './App.css';
import Board from "./components/Board";
import Controls from "./components/Controls";
import NumSelector from "./components/NumSelector"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: emptyGrid(),
      givenValues: emptyGrid(),
      selectedValue: null
    };
  }

  render() {
    return (
      <div className="App">
        <Board
          grid={this.state.grid}
          givenValues={this.state.givenValues}
          selectedValue={this.state.selectedValue}
          onClickCell={this.onClickCell.bind(this)}
        />
        <NumSelector
          selectedValue={this.state.selectedValue}
          onClickCell={this.onClickCell.bind(this)}
        />
        <Controls
          startGame={this.startGame.bind(this)}
          solveGrid={this.solveGrid.bind(this, this.state.grid)}
          onClickCell={this.onClickCell.bind(this)}
        />
      </div>
    );
  }

  /**
   * [startGame description]
   * @return {[type]} [description]
   */
  startGame(difficulty) {
    let grid = emptyGrid();

    // Generate solvable grid
    while (!checkGrid(grid)) {
      grid = emptyGrid();
      fillGrid(grid)
    }
    // Remove digits
    if (difficulty === "easy") {
      grid = this.removeDigits(grid, 37)
    } else if (difficulty === "medium") {
      grid = this.removeDigits(grid, 48)
    } else if (difficulty === "hard") {
      grid = this.removeDigits(grid, 55)
    }
    console.log(printGrid(grid, "-"))
    this.setState({
      grid,
      givenValues: [...grid]
    });
  }

  removeDigits(grid, num) {
    for (var i = 0; i < num; i++) {
      grid = removeDigit(grid, 5);
    }
    return grid
  }

  solveGrid() {
    let grid = this.state.grid;
    grid = solveGrid(grid);
    if (grid) {
      this.setState({
        grid
      });
    }
  }

  onClickCell(cell) {
    const {
      row,
      col,
      value
    } = cell;
    if (!row && !col) {
      // Clicked on NumSelector
      if (this.state.selectedValue !== value) {
        this.setState({
          selectedValue: value
        });
      } else {
        this.setState({
          selectedValue: null
        })
      }

    } else {
      // Clicked on Cell in Board
      this.updateCell(row, col, this.state.selectedValue)
    }
  }

  updateCell(row, col, value) {
    let grid = this.state.grid;
    let givenValues = this.state.givenValues;
    let cell = grid[row - 1][col - 1];
    if (givenValues[row][col] === null) {
      if (cell === value) {
        grid[row - 1][col - 1] = null;
      } else {
        grid[row - 1][col - 1] = value;
      }
    }
    this.setState({
      grid
    });
  }

} // end of App

// Functions

/**
 * Prints contents of grid to string.
 * @param  {[type]} grid   [description]
 * @param  {String} spacer String to be placed in empty cells
 * @return {String}        String representation of the grid
 */
function printGrid(grid, spacer) {
  let string = "";
  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        if (spacer) {
          string += spacer;
        } else {
          string += " ";
        }
      } else {
        string += grid[row][col];
      }
    }
  }
  return string
}

/**
 * Checks if the grid is full
 * @return {[type]} [description]
 */
function checkGrid(grid) {
  for (var row = 0; row < 9; row++) {
    for (var col = 0; col < 9; col++) {
      if (grid[row][col] == null) return false;
    }
  }
  return true;
}

/**
 * Recursive function to check all possible combinations of numbers until
 * a solution is found
 * @return {[type]} [description]
 */
function fillGrid(grid) {
  const numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Find next empty cell
  for (var i = 0; i < 81; i++) {
    let row = Math.floor(i / 9);
    let col = i % 9;
    if (grid[row][col] == null) {
      shuffle(numberList)
      for (var index in numberList) {
        let value = numberList[index];
        // Check that this value hasn't been used in this row
        if (!grid[row].includes(value)) {
          // Check that this value hasn't been used in this column
          let thisColumn = column(grid, col);
          if (!thisColumn.includes(value)) {
            // Identify which square we're looking at
            let thisSquare = square(grid, row, col);
            // Check that this value hasn't been used in this square
            if (!thisSquare.includes(value)) {
              grid[row][col] = value;
              if (checkGrid(grid)) return true
              else if (fillGrid(grid)) return true;
            }
          }
        }
      }
      break;
    }
  }
}

/**
 * Attempts to solve the given sudoku grid.
 * @param  {[type]} grid [description]
 * @return {Bool}        [description]
 */
function solvable(grid) {
  let solutionsCount = 0;
  // Find next empty cell
  let row;
  let col;
  for (var i = 0; i < 81; i++) {
    row = Math.floor(i / 9);
    col = i % 9;
    if (grid[row][col] == null) {
      for (var value = 1; value < 10; value++) {
        // Check that this value hasn't been used in this row
        if (!grid[row].includes(value)) {
          // Check that this value hasn't been used in this column
          let thisColumn = column(grid, col);
          if (!thisColumn.includes(value)) {
            // Identify which square we're looking at
            let thisSquare = square(grid, row, col);
            // Check that this value hasn't been used in this square
            if (!thisSquare.includes(value)) {
              grid[row][col] = value;
              if (checkGrid(grid)) {
                solutionsCount++
                break;
              } else {
                if (solvable(grid)) {
                  return true
                };
              }
            }
          }
        }
      }
      break;
    }
  }
  if (solutionsCount === 1) {
    return true;
  } else {
    if (solutionsCount > 1) console.log(solutionsCount, "possible solutions");
    return false
  };
}

/**
 * Attempts to solve the given sudoku grid, and returns the grid.
 * @param  {[type]} grid [description]
 * @return {Grid}        [description]
 */
function solveGrid(grid) {
  let solutionsCount = 0;
  // Find next empty cell
  let row;
  let col;
  for (var i = 0; i < 81; i++) {
    row = Math.floor(i / 9);
    col = i % 9;
    if (grid[row][col] == null) {
      for (var value = 1; value < 10; value++) {
        // Check that this value hasn't been used in this row
        if (!grid[row].includes(value)) {
          // Check that this value hasn't been used in this column
          let thisColumn = column(grid, col);
          if (!thisColumn.includes(value)) {
            // Identify which square we're looking at
            let thisSquare = square(grid, row, col);
            // Check that this value hasn't been used in this square
            if (!thisSquare.includes(value)) {
              grid[row][col] = value;
              if (checkGrid(grid)) {
                solutionsCount++
                break;
              } else {
                if (solveGrid(grid)) {
                  return grid
                };
              }
            }
          }
        }
      }
      break;
    }
  }
  if (solutionsCount === 1) {
    return grid;
  } else if (solutionsCount > 1) {
    console.log(solutionsCount, "possible solutions");
    return solutionsCount
  };
  return false
}

/**
 * Removes a digit from the grid if possible
 * @param  {[type]} grid [description]
 * @return {[type]}      [description]
 */
function removeDigit(grid, attempts) {
  if (attempts <= 0) return grid;
  // Select a random filled cell
  let row = Math.floor(Math.random() * 9)
  let col = Math.floor(Math.random() * 9)
  while (grid[row][col] == null) {
    row = Math.floor(Math.random() * 9)
    col = Math.floor(Math.random() * 9)
  }
  // Copy grid
  const gridCopy = [];
  for (var i = 0; i < 9; i++) {
    gridCopy[i] = [...grid[i]];
  }
  // Remove cell and test for solvability
  gridCopy[row][col] = null;
  if (solvable(gridCopy)) {
    grid[row][col] = null;
    return grid;
  } else {
    attempts--;
    removeDigit(grid, attempts)
  }
  return grid;
}

/**
 * Returns an array containing the contents of the column in the grid
 * @param  {[type]} grid [description]
 * @param  {[type]} col  [description]
 * @return {[Array]}     [9-length array of digits or null]
 */
function column(grid, col) {
  return [
    grid[0][col],
    grid[1][col],
    grid[2][col],
    grid[3][col],
    grid[4][col],
    grid[5][col],
    grid[6][col],
    grid[7][col],
    grid[8][col]
  ];
}

/**
 * Returns an array containing the contents of the square containing the
 * digit at row x col in the grid
 * @param  {[type]} grid [description]
 * @param  {[type]} row  [description]
 * @param  {[type]} col  [description]
 * @return {[Array]}     [9-length array of digits or null]
 */
function square(grid, row, col) {
  let square = [];
  if (row < 3) {
    if (col < 3) {
      square = [
        grid[0][0],
        grid[0][1],
        grid[0][2],
        grid[1][0],
        grid[1][1],
        grid[1][2],
        grid[2][0],
        grid[2][1],
        grid[2][2],
      ]
    } else if (col < 6) {
      square = [
        grid[0][3],
        grid[0][4],
        grid[0][5],
        grid[1][3],
        grid[1][4],
        grid[1][5],
        grid[2][3],
        grid[2][4],
        grid[2][5],
      ]
    } else {
      square = [
        grid[0][6],
        grid[0][7],
        grid[0][8],
        grid[1][6],
        grid[1][7],
        grid[1][8],
        grid[2][6],
        grid[2][7],
        grid[2][8],
      ]
    }
  } else if (row < 6) {
    if (col < 3) {
      square = [
        grid[3][0],
        grid[3][1],
        grid[3][2],
        grid[4][0],
        grid[4][1],
        grid[4][2],
        grid[5][0],
        grid[5][1],
        grid[5][2],
      ]
    } else if (col < 6) {
      square = [
        grid[3][3],
        grid[3][4],
        grid[3][5],
        grid[4][3],
        grid[4][4],
        grid[4][5],
        grid[5][3],
        grid[5][4],
        grid[5][5],
      ]
    } else {
      square = [
        grid[3][6],
        grid[3][7],
        grid[3][8],
        grid[4][6],
        grid[4][7],
        grid[4][8],
        grid[5][6],
        grid[5][7],
        grid[5][8],
      ]
    }
  } else {
    if (col < 3) {
      square = [
        grid[6][0],
        grid[6][1],
        grid[6][2],
        grid[7][0],
        grid[7][1],
        grid[7][2],
        grid[8][0],
        grid[8][1],
        grid[8][2],
      ]
    } else if (col < 6) {
      square = [
        grid[6][3],
        grid[6][4],
        grid[6][5],
        grid[7][3],
        grid[7][4],
        grid[7][5],
        grid[8][3],
        grid[8][4],
        grid[8][5],
      ]
    } else {
      square = [
        grid[6][6],
        grid[6][7],
        grid[6][8],
        grid[7][6],
        grid[7][7],
        grid[7][8],
        grid[8][6],
        grid[8][7],
        grid[8][8],
      ]
    }
  }
  return square
}


/**
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param  {[type]} array [description]
 * @return {[type]}       [description]
 */
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function emptyGrid() {
  const grid = [];
  for (var i = 0; i < 9; i++) {
    grid[i] = [...EMPTY_ROW];
  }
  return grid;
}

const EMPTY_ROW = [null, null, null, null, null, null, null, null, null];

export default App;
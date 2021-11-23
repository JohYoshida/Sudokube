import React, {
  Component
} from 'react';
import {
  Helmet
} from "react-helmet";
import './App.css';
import Board from "./components/Board";
import Controls from "./components/Controls";
import NumSelector from "./components/NumSelector"
const Isomer = require("isomer");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: emptyGrid(),
      selectedValue: null,
      mode: "pen"
    };
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <title>Sudokube</title>
        </Helmet>
        <div className="column">
          <div className="row">
            <div className="column">
              <Board
                grid={this.state.grid}
                selectedValue={this.state.selectedValue}
                onClickCell={this.onClickCell.bind(this)}
              />
              <NumSelector
                selectedValue={this.state.selectedValue}
                mode={this.state.mode}
                onClickCell={this.onClickCell.bind(this)}
                changeMode={this.changeMode.bind(this)}
              />
              <Controls
                startGame={this.startGame.bind(this)}
                solveGrid={this.solveGrid.bind(this, this.state.grid)}
              />
            </div>
            <canvas width="1600" height="1600" id="ThreeD"></canvas>
          </div>
        </div>
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
    this.makeCube(grid, this.state.selectedValue);
    this.setState({
      grid
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
        this.makeCube(this.state.grid, value);
      } else {
        this.setState({
          selectedValue: null
        })
        this.makeCube(this.state.grid, null);
      }

    } else {
      // Clicked on Cell in Board
      this.updateCell(row, col, this.state.selectedValue)
      this.makeCube(this.state.grid, this.state.selectedValue);
    }
  }

  changeMode() {
    let mode = this.state.mode;
    if (mode === "pen") {
      mode = "pencil";
    } else if (mode === "pencil") {
      mode = "pen";
    }
    this.setState({
      mode
    });
  }

  updateCell(row, col, value) {
    let grid = this.state.grid;
    let mode = this.state.mode;
    let cell = grid[row - 1][col - 1];

    if (cell === null) {
      if (mode === "pen") {
        grid[row - 1][col - 1] = {
          value,
          given: false
        };
      } else if (mode === "pencil") {
        grid[row - 1][col - 1] = {
          value: [value],
          given: false
        };
      }
    } else {
      if (!cell.given) {
        if (mode === "pen") {
          if (typeof cell.value === "number") {
            if (cell.value === value) {
              grid[row - 1][col - 1] = null;
            } else {
              grid[row - 1][col - 1] = {
                value,
                given: false
              };
            }
          } else {
            grid[row - 1][col - 1] = {
              value,
              given: false
            }
          }
        } else if (mode === "pencil") {
          if (typeof cell.value !== "number") {
            if (cell.value.includes(value)) {
              console.log("includes");
              grid[row - 1][col - 1].value = cell.value.filter(e => {
                return e !== value
              });
            } else {
              grid[row - 1][col - 1].value.push(value);
              grid[row - 1][col - 1].value.sort();
            }
          }
        }

      }
    }
    this.setState({
      grid
    });
  }

  makeCube(grid, selectedValue) {
    const iso = new Isomer(document.getElementById("ThreeD"));
    const Shape = Isomer.Shape
    const Point = Isomer.Point
    const Path = Isomer.Path
    const Color = Isomer.Color

    iso.canvas.clear();
    // Make grid
    for (var z = 0; z <= 9; z++) {
      for (var x = 0; x <= 9; x++) {
        iso.add(new Path([
          new Point(x, 0, z),
          new Point(x, 9, z),
          new Point(x, 0, z)
        ]), new Color(0, 0, 0, 0.1));
        for (var y = 0; y <= 9; y++) {
          iso.add(new Path([
            new Point(x, y, 0),
            new Point(x, y, 9),
            new Point(x, y, 0)
          ]), new Color(0, 0, 0, 0.1));
          iso.add(new Path([
            new Point(0, y, z),
            new Point(9, y, z),
            new Point(0, y, z)
          ]), new Color(0, 0, 0, 0.1));
        }
      }
    }

    // Add cubes
    for (var row = 0; row < 9; row++) {
      for (var col = 0; col < 9; col++) {
        let cell = grid[row][col];
        if (cell !== null) {
          let color;
          if (cell.given) color = new Color(150, 176, 152, 0.3);
          else color = new Color(129, 199, 132, 0.3)
          if (typeof cell.value === "number") {
            if (cell.value === selectedValue) {
              iso.add(Shape.Prism(new Point(row - 1, col - 1, cell.value), .9, .9, .9), color)
            } else if (selectedValue === null) {
              iso.add(Shape.Prism(new Point(row - 1, col - 1, cell.value), .9, .9, .9), color)
            }
          } else {
            cell.value.forEach((value, i) => {
              iso.add(Shape.Prism(new Point(row - 1, col - 1, value), .5, .5, .5), color)
            });

          }
        }

      }
    }
    //
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
        if (typeof grid[row][col].value === "number") {
          string += grid[row][col].value;
        } else {
          if (spacer) {
            string += spacer;
          } else {
            string += " ";
          }
        }
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
      if (grid[row][col] === null) return false;
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
    if (grid[row][col] === null) {
      shuffle(numberList)
      for (var index in numberList) {
        let value = numberList[index];
        // Check that this value hasn't been used in this row
        let thisRow = rowValues(grid, row);
        if (!thisRow.includes(value)) {
          // if (!grid[row].includes(value)) {
          // Check that this value hasn't been used in this column
          let thisColumn = column(grid, col);
          if (!thisColumn.includes(value)) {
            // Identify which square we're looking at
            let thisSquare = square(grid, row, col);
            // Check that this value hasn't been used in this square
            if (!thisSquare.includes(value)) {
              grid[row][col] = {
                value,
                given: true
              };
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
        let thisRow = rowValues(grid, row);
        if (!thisRow.includes(value)) {
          // Check that this value hasn't been used in this column
          let thisColumn = column(grid, col);
          if (!thisColumn.includes(value)) {
            // Identify which square we're looking at
            let thisSquare = square(grid, row, col);
            // Check that this value hasn't been used in this square
            if (!thisSquare.includes(value)) {
              grid[row][col] = {
                value,
                given: false
              };
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
    if (typeof grid[row][col] === "object" && grid[row][col] !== null && typeof grid[row][col].value !== "number") {
      grid[row][col] = null
    }
    if (grid[row][col] === null) {
      for (var value = 1; value < 10; value++) {
        // Check that this value hasn't been used in this row
        let thisRow = rowValues(grid, row);
        if (!thisRow.includes(value)) {
          // if (!grid[row].includes(value)) {
          // Check that this value hasn't been used in this column
          let thisColumn = column(grid, col);
          if (!thisColumn.includes(value)) {
            // Identify which square we're looking at
            let thisSquare = square(grid, row, col);
            // Check that this value hasn't been used in this square
            if (!thisSquare.includes(value)) {
              grid[row][col] = {
                value,
                given: false
              };
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
  const gridCopy = copyGrid(grid)
  // const gridCopy = [];
  // for (var i = 0; i < 9; i++) {
  //   gridCopy[i] = [...grid[i]];
  // }
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

function getValue(grid, row, col) {
  if (grid[row][col] !== null) {
    if (typeof grid[row][col].value === "number") {
      return grid[row][col].value
    }
  }
  return null
}

/**
 * [rowValues description]
 * @param  {[type]} grid [description]
 * @param  {[type]} row  [description]
 * @return {[type]}      [description]
 */
function rowValues(grid, row) {
  return [
    getValue(grid, row, 0),
    getValue(grid, row, 1),
    getValue(grid, row, 2),
    getValue(grid, row, 3),
    getValue(grid, row, 4),
    getValue(grid, row, 5),
    getValue(grid, row, 6),
    getValue(grid, row, 7),
    getValue(grid, row, 8)
  ];
}

/**
 * Returns an array containing the contents of the column in the grid
 * @param  {[type]} grid [description]
 * @param  {[type]} col  [description]
 * @return {[Array]}     [9-length array of digits or null]
 */
function column(grid, col) {
  return [
    getValue(grid, 0, col),
    getValue(grid, 1, col),
    getValue(grid, 2, col),
    getValue(grid, 3, col),
    getValue(grid, 4, col),
    getValue(grid, 5, col),
    getValue(grid, 6, col),
    getValue(grid, 7, col),
    getValue(grid, 8, col)
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
        getValue(grid, 0, 0),
        getValue(grid, 0, 1),
        getValue(grid, 0, 2),
        getValue(grid, 1, 0),
        getValue(grid, 1, 1),
        getValue(grid, 1, 2),
        getValue(grid, 2, 0),
        getValue(grid, 2, 1),
        getValue(grid, 2, 2)
      ]
    } else if (col < 6) {
      square = [
        getValue(grid, 0, 3),
        getValue(grid, 0, 4),
        getValue(grid, 0, 5),
        getValue(grid, 1, 3),
        getValue(grid, 1, 4),
        getValue(grid, 1, 5),
        getValue(grid, 2, 3),
        getValue(grid, 2, 4),
        getValue(grid, 2, 5)
      ]
    } else {
      square = [
        getValue(grid, 0, 6),
        getValue(grid, 0, 7),
        getValue(grid, 0, 8),
        getValue(grid, 1, 6),
        getValue(grid, 1, 7),
        getValue(grid, 1, 8),
        getValue(grid, 2, 6),
        getValue(grid, 2, 7),
        getValue(grid, 2, 8)
      ]
    }
  } else if (row < 6) {
    if (col < 3) {
      square = [
        getValue(grid, 3, 0),
        getValue(grid, 3, 1),
        getValue(grid, 3, 2),
        getValue(grid, 4, 0),
        getValue(grid, 4, 1),
        getValue(grid, 4, 2),
        getValue(grid, 5, 0),
        getValue(grid, 5, 1),
        getValue(grid, 5, 2)
      ]
    } else if (col < 6) {
      square = [
        getValue(grid, 3, 3),
        getValue(grid, 3, 4),
        getValue(grid, 3, 5),
        getValue(grid, 4, 3),
        getValue(grid, 4, 4),
        getValue(grid, 4, 5),
        getValue(grid, 5, 3),
        getValue(grid, 5, 4),
        getValue(grid, 5, 5)
      ]
    } else {
      square = [
        getValue(grid, 3, 6),
        getValue(grid, 3, 7),
        getValue(grid, 3, 8),
        getValue(grid, 4, 6),
        getValue(grid, 4, 7),
        getValue(grid, 4, 8),
        getValue(grid, 5, 6),
        getValue(grid, 5, 7),
        getValue(grid, 5, 8)
      ]
    }
  } else {
    if (col < 3) {
      square = [
        getValue(grid, 6, 0),
        getValue(grid, 6, 1),
        getValue(grid, 6, 2),
        getValue(grid, 7, 0),
        getValue(grid, 7, 1),
        getValue(grid, 7, 2),
        getValue(grid, 8, 0),
        getValue(grid, 8, 1),
        getValue(grid, 8, 2)
      ]
    } else if (col < 6) {
      square = [
        getValue(grid, 6, 3),
        getValue(grid, 6, 4),
        getValue(grid, 6, 5),
        getValue(grid, 7, 3),
        getValue(grid, 7, 4),
        getValue(grid, 7, 5),
        getValue(grid, 8, 3),
        getValue(grid, 8, 4),
        getValue(grid, 8, 5)
      ]
    } else {
      square = [
        getValue(grid, 6, 6),
        getValue(grid, 6, 7),
        getValue(grid, 6, 8),
        getValue(grid, 7, 6),
        getValue(grid, 7, 7),
        getValue(grid, 7, 8),
        getValue(grid, 8, 6),
        getValue(grid, 8, 7),
        getValue(grid, 8, 8)
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

/**
 * Returns a 9x9 grid full of null values
 * @return {[type]} [description]
 */
function emptyGrid() {
  const EMPTY_ROW = [null, null, null, null, null, null, null, null, null];
  const grid = [];
  for (var i = 0; i < 9; i++) {
    grid[i] = [...EMPTY_ROW];
  }
  return grid;
}

/**
 * [copyGrid description]
 * @param  {[type]} grid [description]
 * @return {[type]}      [description]
 */
function copyGrid(grid) {
  let copy = JSON.parse(JSON.stringify(grid));
  return copy
}


export default App;
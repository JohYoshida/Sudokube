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
  return string;
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
 * Checks if value is legal at given position
 * @param  {[type]} grid  [description]
 * @param  {[type]} row   [description]
 * @param  {[type]} col   [description]
 * @param  {[type]} value [description]
 * @return {[Boolean]}    Returns true iff value is legal, else false
 */
function checkValue(grid, row, col, value) {
  let thisRow = rowValues(grid, row);
  if (!thisRow.includes(value)) {
    // Check that this value hasn't been used in this column
    let thisColumn = columnValues(grid, col);
    if (!thisColumn.includes(value)) {
      // Identify which square we're looking at
      let thisSquare = squareValues(grid, row, col);
      // Check that this value hasn't been used in this square
      if (!thisSquare.includes(value)) {
        // Check that this value conforms to 3D rules
        if (checkValue3D(grid, row, col, value)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Checks if the value violates the 3D sudoku condition and returns true iff the
 * value is legal, else false
 * @param  {[type]} grid  [description]
 * @param  {[type]} row   [description]
 * @param  {[type]} col   [description]
 * @param  {[type]} value [description]
 * @return {[Boolean]}    [description]
 */
function checkValue3D(grid, row, col, value) {
  const sets = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
  // Find set that row, col, and value are in
  const rowSet = sets[Math.ceil((row + 1) / 3) - 1];
  const colSet = sets[Math.ceil((col + 1) / 3) - 1];
  const valueSet = sets[Math.ceil(value / 3) - 1];
  let flag = true;
  // check row set for values in valueSet
  rowSet.forEach(item => {
    let val = getValue(grid, item - 1, col);
    if (valueSet.includes(val)) {
      flag = false;
    }
  });
  // check col set for values in valueSet
  colSet.forEach(item => {
    let val = getValue(grid, row, item - 1);
    if (valueSet.includes(val)) {
      flag = false;
    }
  });
  return flag;
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
      shuffle(numberList);
      for (var index in numberList) {
        let value = numberList[index];
        // Check that this value is legal
        if (checkValue(grid, row, col, value)) {
          grid[row][col] = {
            value,
            given: true
          };
          if (checkGrid(grid)) return true;
          else if (fillGrid(grid)) return true;
        }
      }
      break;
    }
  }
}

/**
 * Attempts to solve the given sudoku grid, and returns true if it's solveGrid
 * @param  {[type]} grid [description]
 * @return {Boolean}     [description]
 */
function solveGrid(grid) {
  let row;
  let col;
  for (var i = 0; i < 81; i++) {
    row = Math.floor(i / 9);
    col = i % 9;
    if (grid[row][col] == null) {
      for (var value = 1; value < 10; value++) {
        // Check that this value is legal
        if (checkValue(grid, row, col, value)) {
          grid[row][col] = {
            value,
            given: false
          };
          if (checkGrid(grid)) {
            window.count++;
            if (window.count > 1) return false;
            break;
          } else {
            if (solveGrid(grid)) {
              return true;
            }
          }
        }
      }
      break;
    }
  }
  // Backtrace
  grid[row][col] = null;
}

/**
 * Get value at row/col in grid
 * @param  {[type]} grid [description]
 * @param  {[type]} row  [description]
 * @param  {[type]} col  [description]
 * @return {[type]}      [description]
 */
function getValue(grid, row, col) {
  if (grid[row][col] !== null) {
    if (typeof grid[row][col].value === "number") {
      return grid[row][col].value;
    }
  }
  return null;
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
function columnValues(grid, col) {
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
function squareValues(grid, row, col) {
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
      ];
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
      ];
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
      ];
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
      ];
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
      ];
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
      ];
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
      ];
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
      ];
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
      ];
    }
  }
  return square;
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
      array[randomIndex],
      array[currentIndex]
    ];
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
 * Returns a copy of the given grid
 * @param  {[type]} grid [description]
 * @return {[type]}      [description]
 */
function copyGrid(grid) {
  let copy = JSON.parse(JSON.stringify(grid));
  return copy;
}

export {checkGrid, emptyGrid, fillGrid, copyGrid, printGrid, solveGrid};

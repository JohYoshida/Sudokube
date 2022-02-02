class Sudokube {
  constructor() {
    this.puzzle = "";
    this.solution = "";
    this.space = {};
    this.history = [];
    this.historyIndex = -1;
  }

  /**
   * Initialize Sudokube given puzzle and solution
   * @param  {String} puzzle    81-character string representation of puzzle
   * @param  {String} solution  81-character string representation of solution
   */
  init(puzzle, solution) {
    this.puzzle = puzzle;
    this.solution = solution;
    this.space = this.stringToSpace(puzzle);
    this.history = [];
    this.historyIndex = -1;
  }

  /**
  * Solve the Sudokube, overwriting any pencil marks or incorrect digits
   */
  solve() {
    for (var x = 1; x <= 9; x++) {
      for (var y = 1; y <= 9; y++) {
        let index = (x - 1) * 9 + (y - 1);
        if (this.solution[index] !== this.puzzle[index]) {
          this.do({
            action: "write",
            mode: "pen",
            x,
            y,
            z: this.solution[index]
          });
        }
      }
    }
  }

  /**
   * Reset Sudokube to beginning of puzzle
   */
  reset() {
    this.space = this.stringToSpace(this.puzzle);
    this.history = [];
    this.historyIndex = -1;
  }

  /**
   * Fill space from puzzle string
   * @param {String}    81-character string representing valid Sudokube xy-face
   * @return {Object}   space filled with given xyz values
   */
  stringToSpace(puzzle) {
    const space = {};
    for (var x = 1; x <= 9; x++) {
      for (var y = 1; y <= 9; y++) {
        let index = (x - 1) * 9 + (y - 1);
        let z = Number(puzzle[index]);
        if (z) {
          space[`${x}${y}${z}`] = "given";
        }
      }
    }
    return space;
  } // end of stringToSpace

  /**
   * Returs string representation of Sudokube space as xy-face
   * @param  {String} spacer    Optional spacer string for null z-values
   * @return {String}           81-character string representation
   */
  spaceToString(spacer) {
    let string = "";
    for (var x = 1; x <= 9; x++) {
      for (var y = 1; y <= 9; y++) {
        let value = spacer ? spacer : " ";
        for (var z = 1; z <= 9; z++) {
          let point = this.space[`${x}${y}${z}`];
          if (point === "pen" || point === "given") {
            value = z;
            break;
          }
        }
        string += value;
      }
    }
    return string;
  } // end of spaceToString

  /**
   * Returns specified face of reduced Sudokube as a grid
   * @param  {String} face    Direction of Sudokube reduction. Recognizes "xy", "yz", "xz"
   * @return {Array}          2D array representation of Sudokube from direction of face
   */
  spaceToGrid(face) {
    let grid = emptyGrid();
    for (var x = 1; x <= 9; x++) {
      for (var y = 1; y <= 9; y++) {
        for (var z = 1; z <= 9; z++) {
          let pattern;
          if (face === "xy") pattern = `${x}${y}${z}`;
          else if (face === "yz") pattern = `${y}${z}${x}`;
          else if (face === "xz") pattern = `${x}${z}${y}`;
          else return false;
          let value = this.space[pattern];
          if (value && value !== null) {
            if (value === "given") {
              grid[x - 1][y - 1] = {given: true, value: z};
            } else if (value === "pen") {
              grid[x - 1][y - 1] = {given: false, value: z};
            } else if (value === "pencil") {
              if (grid[x - 1][y - 1]) {
                grid[x - 1][y - 1].value.push(z);
              } else {
                grid[x - 1][y - 1] = {given: false, value: [z]};
              }
            }
          }
        }
      }
    }
    return grid;
  } // end of spaceToGrid

  /**
   * Compares the space with the solution with spaceToString
   * @return {String} Count of missing and incorrect values
   */
  compare() {
    let string = this.spaceToString("-");
    let missing = 0;
    let incorrect = 0;
    if (string === this.solution) {
      return "Perfect!";
    } else {
      for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
          let index = (x - 1) * 9 + (y - 1);
          if (string[index] !== this.solution[index]) {
            if (string[index] === "-") missing++;
            else {
              incorrect++;
              this.space[`${x}${y}${Number(string[index])}`] = "invalid";
              console.log("Invalid value at", x, y, Number(string[index]));
            }
          }
        }
      }
      return missing + " missing and " + incorrect + " incorrect values.";
    }
  }

  /**
   * Commit alteration and any resulting impacts to space as a single block of history
   * @param  {Object} alteration  Contains strings action, mode; and integers x, y, z
   * @return {Boolean}            True iff alteration is successful, else false
   */
  do(alteration) {
    const {action, mode, x, y, z} = alteration;
    const commit = [];
    if (action && mode && x && y && z) {
      if (action === "write") {
        if (mode === "pen") {
          // remove marks
          for (var i = 1; i <= 9; i++) {
            // remove any other marks at xy
            if (
              this.space[`${x}${y}${i}`] === "pen" ||
              this.space[`${x}${y}${i}`] === "pencil"
            ) {
              commit.push({
                action: "erase",
                mode: this.space[`${x}${y}${i}`],
                x,
                y,
                z: i
              });
              this.space[`${x}${y}${i}`] = null;
            }
            // remove pencil marks from row
            if (this.space[`${x}${i}${z}`] === "pencil") {
              this.space[`${x}${i}${z}`] = null;
              commit.push({action: "erase", mode: "pencil", x, y: i, z});
            }
            // remove pencil marks from column
            if (this.space[`${i}${y}${z}`] === "pencil") {
              this.space[`${i}${y}${z}`] = null;
              commit.push({action: "erase", mode: "pencil", x: i, y, z});
            }
          }
          // remove pencil marks from square
          for (i = 0; i <= 2; i++) {
            for (var j = 0; j <= 2; j++) {
              let rowStart = x - ((x - 1) % 3);
              let colStart = y - ((y - 1) % 3);
              if (
                this.space[`${rowStart + i}${colStart + j}${z}`] === "pencil"
              ) {
                this.space[`${rowStart + i}${colStart + j}${z}`] = null;
                commit.push({
                  action: "erase",
                  mode: "pencil",
                  x: rowStart + i,
                  y: colStart + j,
                  z
                });
              }
            }
          }
        }
        // make new mark
        this.space[`${x}${y}${z}`] = mode;
        commit.push(alteration);
      } else if (action === "erase") {
        this.space[`${x}${y}${z}`] = null;
        commit.push(alteration);
      }
      this.commitBlock(commit);
      return true;
    }
    console.log("Error: Failed to alter space. Failed on:", alteration);
    return false;
  }

  /**
   * Undo the  block of history at the historyIndex
   * @return {Boolean} True iff history exists to undo, else false
   */
  undo() {
    if (this.historyIndex >= 0) {
      let block = this.history[this.historyIndex];
      block.reverse();
      block.forEach((alteration, i) => {
        const {action, mode, x, y, z} = alteration;
        if (action === "write") {
          // erase
          this.space[`${x}${y}${z}`] = null;
        } else if (action === "erase") {
          // write
          this.space[`${x}${y}${z}`] = mode;
        }
      });
      this.historyIndex--;
      return true;
    }
    console.log("Nothing to undo");
    return false;
  }

  /**
   * Redo the next block of history from the historyIndex
   * @return {Boolean} True iff history to redo, else false
   */
  redo() {
    if (this.historyIndex + 1 < this.history.length) {
      this.historyIndex++;
      let block = this.history[this.historyIndex];
      block.forEach((alteration, i) => {
        const {action, mode, x, y, z} = alteration;
        if (action === "write") {
          this.space[`${x}${y}${z}`] = mode;
        } else if (action === "erase") {
          this.space[`${x}${y}${z}`] = null;
        }
      });
      return true;
    }
    console.log("Nothing to redo");
    return false;
  }

  /**
   * Commits block of alterations to history, replacing everything after index
   * @param  {[Array]} block list of alteration objects containing: action, mode, x, y, z
   */
  commitBlock(block) {
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(block);
    this.historyIndex = this.history.length - 1;
  }


  /**
   * Stringify the Sudokube space with respect to the viewing face, flattening
   * space to a single sudoku grid
   * @param  {String} face      Recognizes "xy", "yz", "xz"
   * @param  {String} spacer    Optional character to print when value not resolved
   * @return {String}           81-character string representation of Sudoku grid
   */
  stringify(face, spacer) {
    if (face === "yz") {
      let grid = this.spaceToGrid("yz");
      return gridToString(grid, spacer);
    } else if (face === "xz") {
      let grid = this.spaceToGrid("xz");
      return gridToString(grid, spacer);
    } else {
      let grid = this.spaceToGrid("xy");
      return gridToString(grid, spacer);
    }
  }

  /**
   * Helper method to print stringified Sudokube from viewing face
   * @param  {String} face      Recognizes "xy", "yz", "xz"
   * @param  {String} spacer    Optional character to print when value not resolved
   */
  print(face, spacer) {
    console.log(this.stringify(face, spacer));
  }
} // end of Sudokube

/**
 * Helper function to generate a 9x9 grid full of null values
 * @return {Array} 2D array full of null
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
  * Convert a Sudoku grid to its string representation
  * @param  {Array} grid       2d array representing Sudoku grid
  * @param  {String} spacer    Optional character to print when value not resolved
  * @return {String}           81-character string representation of grid
 */
function gridToString(grid, spacer) {
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

export default Sudokube;

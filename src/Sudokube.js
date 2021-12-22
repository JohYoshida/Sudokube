class Sudokube {
  constructor() {
    this.puzzle = "";
    this.solution = "";
    this.space = {};
    this.history = [];
    this.historyIndex = -1;
  }

  init(puzzle, solution) {
    this.puzzle = puzzle;
    this.solution = solution;
    this.space = this.stringToSpace(puzzle);
    this.history = [];
    this.historyIndex = -1;
  }

  /**
   * Fill space from puzzle string
   * @param {[String]}81-character string representing valid Sudokube xy-face
   * @return {[object]} space filled with given xyz values
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
   * @param  {[String]} spacer Optional spacer string for null z-values
   * @return {[String]}        81-character string representation
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
   * @param  {[type]} face direction of Sudokube reduction
   * @return {[Array]}     2D array representation of Sudokube from direction of face
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
    console.log(face, printGrid(grid, "-"));
    return grid;
  } // end of spaceToGrid

  /**
   * Compares the space with the solution with spaceToString
   * @return {Boolean} Also logs count of missing and incorrect values
   */
  compare() {
    let string = this.spaceToString("-");
    let missing = 0;
    let incorrect = 0;
    if (string === this.solution) {
      console.log("Perfect!");
      return true;
    } else {
      for (var x = 1; x <= 9; x++) {
        for (var y = 1; y <= 9; y++) {
          let index = (x - 1) * 9 + (y - 1);
          if (string[index] !== this.solution[index]) {
            if (string[index] === "-") missing++;
            else {
              incorrect++;
              console.log("Incorrect value at", x, y);
            }
          }
        }
      }
      console.log(missing, "missing and", incorrect, "incorrect values.");
      return false;
    }
  }

  /**
   * Alter space and commit to history
   * @param  {[type]} alteration [description]
   * @return {[Boolean]}[description]
   */
  do(alteration) {
    let a = this.alterSpace(alteration);
    // let b = this.commitHistory(alteration);
    if (a) {
      return true;
    }
    return false;
  }

  /**
   * Undo the  block of history at the historyIndex
   * @return {Boolean} [description]
   */
  undo() {
    if (this.historyIndex >= 0) {
      let block = this.history[this.historyIndex];
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
   * @return {Boolean} [description]
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
   * Writes and erases from the space, creating and committing a block of history
   * @param  {[object]} alteration contains: action, mode, x, y, z
   * @return {[Boolean]} signals successful alteration
   */
  alterSpace(alteration) {
    const {action, mode, x, y, z} = alteration;
    const commit = [];
    if (action && mode && x && y && z) {
      if (action === "write") {
        // remove any other pen marks at xy
        for (var i = 1; i <= 9; i++) {
          if (this.space[`${x}${y}${i}`] === "pen") {
            this.space[`${x}${y}${i}`] = null;
            commit.push({action: "erase", mode, x, y, z: i});
          }
        }
        // make new pen mark
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
  } // end of alterSpace
}

function emptyGrid() {
  const EMPTY_ROW = [null, null, null, null, null, null, null, null, null];
  const grid = [];
  for (var i = 0; i < 9; i++) {
    grid[i] = [...EMPTY_ROW];
  }
  return grid;
}

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

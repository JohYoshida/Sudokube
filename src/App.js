import React, {
  Component
} from 'react';
import {
  Helmet
} from "react-helmet";
import {
  checkGrid,
  emptyGrid,
  fillGrid,
  printGrid,
  removeDigits
} from "./gridFunctions";
import './App.css';
import Sudokube from "./Sudokube";
import Board from "./components/Board";
import Controls from "./components/Controls";
import NumSelector from "./components/NumSelector"
const Isomer = require("isomer");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sudokube: new Sudokube(),
      selectedValue: null,
      hover: null,
      mode: "pen",
      showColors: true,
      message: null
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
              <div className="row">
                <div className="column">
                  <h2>xy</h2>
                  <Board
                    space={this.state.sudokube.space}
                    selectedValue={this.state.selectedValue}
                    onClickCell={this.onClickCell.bind(this)}
                    onHover={this.onHover.bind(this)}
                    hover={this.state.hover}
                    face={"xy"}
                    showColors={this.state.showColors}
                    />
                </div>
                <div className="column">
                  <h2>yz</h2>
                  <Board
                    space={this.state.sudokube.space}
                    selectedValue={this.state.selectedValue}
                    onClickCell={this.onClickCell.bind(this)}
                    onHover={this.onHover.bind(this)}
                    hover={this.state.hover}
                    face={"yz"}
                    showColors={this.state.showColors}
                    />
                </div>
                <div className="column">
                  <h2>xz</h2>
                  <Board
                    space={this.state.sudokube.space}
                    selectedValue={this.state.selectedValue}
                    onClickCell={this.onClickCell.bind(this)}
                    onHover={this.onHover.bind(this)}
                    hover={this.state.hover}
                    face={"xz"}
                    showColors={this.state.showColors}
                    />
                </div>
              </div>
              <NumSelector
                selectedValue={this.state.selectedValue}
                onClickCell={this.onClickCell.bind(this)}
              />
              <Controls
                startGame={this.startGame.bind(this)}
                restartGame={this.restartGame.bind(this)}
                solve={this.solve.bind(this)}
                compare={this.compare.bind(this)}
                mode={this.state.mode}
                changeMode={this.changeMode.bind(this)}
                showColors={this.state.showColors}
                toggleColors={this.toggleColors.bind(this)}
                undo={this.undo.bind(this)}
                redo={this.redo.bind(this)}
              />
            <div>{this.state.message}</div>
            </div>
            <canvas width="1600" height="1600" id="ThreeD"></canvas>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Generate and initialize sudokube
   * @param  {string} difficulty  Recognizes "easy", "medium", "hard"
   */
  startGame(difficulty) {
    // Generate solvable grid
    let grid = emptyGrid();
    while (!checkGrid(grid)) {
      grid = emptyGrid();
      fillGrid(grid)
    }
    // Remove digits
    let solution = printGrid(grid, "-");
    // Initialize sudokube with grid
    if (difficulty === "easy") {
      grid = removeDigits(grid, 5)
    } else if (difficulty === "medium") {
      grid = removeDigits(grid, 10)
    } else if (difficulty === "hard") {
      grid = removeDigits(grid, 75)
    }
    // Initialize sudokube with grid
    let puzzle = printGrid(grid);
    console.log(puzzle);
    let sdk = this.state.sudokube;
    sdk.init(puzzle, solution);
    this.renderSudokube(sdk.space, this.state.selectedValue);
    this.setState({
      sudokube: sdk,
      message: null
    });
  }

  /**
   * Reset Sudokube to start state of puzzle
   */
  restartGame() {
    let sdk = this.state.sudokube;
    sdk.reset();
    this.renderSudokube(sdk.space, this.state.selectedValue);
    this.setState({
      message: null
    });
  }

  /**
   * Solve the current Sudokube, overwriting any pencil marks or incorrect digits
   */
  solve() {
    let sdk = this.state.sudokube;
    sdk.solve();
    this.renderSudokube(sdk.space, this.state.selectedValue);
    this.setState({
      sudokube: sdk,
      message: null
    });
  }

  /**
   * Compare current Sudokube state to the solution, and set this.state.message
   */
  compare() {
    let sdk = this.state.sudokube;
    let message = sdk.compare();
    this.setState({
      message
    });
  }

  /**
   * Handle clicks for cells in grid or NumSelector
   * @param  {Object} cell  Contains integers row, col, value; and string face
   */
  onClickCell(cell) {
    const {
      row,
      col,
      value,
      face
    } = cell;
    if (!row && !col) {
      // Clicked on NumSelector
      if (this.state.selectedValue !== value) {
        this.setState({
          selectedValue: value
        });
        this.renderSudokube(this.state.sudokube.space, value);
      } else {
        this.setState({
          selectedValue: null
        })
        this.renderSudokube(this.state.sudokube.space, null);
      }
    } else {
      // Clicked on Cell in Board
      this.updateSudokube(row, col, this.state.selectedValue, face)
      this.renderSudokube(this.state.sudokube.space, this.state.selectedValue);
      if (value === this.state.selectedValue) {
        this.onHover({
          row,
          col,
          value: null,
          face
        });
      } else {
        this.onHover({
          row,
          col,
          value: this.state.selectedValue,
          face
        });
      }
    }
  }

  /**
   * Set hover flag on cell under mouse
   * @param  {Object} cell  Contains integers row, col, value; and string face
   */
  onHover(cell) {
    const {
      row,
      col,
      value,
      face
    } = cell;
    let x, y, z;
    if (face === "xy") {
      x = row;
      y = col;
      z = value;
    } else if (face === "yz") {
      y = row;
      z = col;
      x = value;

    } else if (face === "xz") {
      x = row;
      z = col;
      y = value;
    }
    this.setState({
      hover: `${x}-${y}-${z}`
    })
  }

  /**
   * Change from pen to pencil mode and vice versa
   */
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

  /**
   * Toggle coloring for number sets [1,2,3], [4,5,6], [7,8,9]
   */
  toggleColors() {
    let show = this.state.showColors;
    this.setState({
      showColors: !show
    });
  }

  /**
   * Update Sudokube based on the row, column, and value with respect to the
   * given cube face
   * @param  {Number} row    Integer between 1 and 9
   * @param  {Number} col    Integer between 1 and 9
   * @param  {Number} value  Integer between 1 and 9
   * @param  {[type]} face   Recognizes "xy", "yz", and "xz"
   */
  updateSudokube(row, col, value, face) {
    let x, y, z;
    if (face === "xy") {
      x = row;
      y = col;
      z = value;
    } else if (face === "yz") {
      y = row;
      z = col;
      x = value;
    } else if (face === "xz") {
      x = row;
      z = col;
      y = value;
    }
    let point = this.state.sudokube.space[`${x}${y}${z}`];
    let mode = this.state.mode;
    if (point) {
      if (point === mode || point === "invalid") {
        // erase pen mark
        this.state.sudokube.do({
          action: "erase",
          mode: mode,
          x,
          y,
          z
        });
      } else if (point === "pencil" && mode === "pen") {
        // overwrite pencil mark with pen
        this.state.sudokube.do({
          action: "write",
          mode: mode,
          x,
          y,
          z
        });
      }
    } else { // no marks at point
      // write mark
      this.state.sudokube.do({
        action: "write",
        mode: mode,
        x,
        y,
        z
      });
    }
    this.setState({})
    this.renderSudokube(this.state.sudokube.space);
  }

  /**
   * Undo previous action
   */
  undo() {
    let sdk = this.state.sudokube;
    sdk.undo();
    this.setState({
      sudokube: sdk
    });
  }

  /**
   * Redo previous action
   */
  redo() {
    let sdk = this.state.sudokube;
    sdk.redo();
    this.setState({
      sudokube: sdk
    });
  }

  /**
   * Render isometric 3D Sudokube using Isomer.js
   * @param  {Object} space           Contains key-value pairs in the form
   *                                  "xyz": "value", where x,y,z are integers
   *                                  between 1 and 9, and value is one of
   *                                  ["pen", "pencil", "given"]
   * @param  {Number} selectedValue  Integer between 1 and 9
   */
  renderSudokube(space, selectedValue) {
    if (!space) space = this.state.sudokube.space;
    const iso = new Isomer(document.getElementById("ThreeD"));
    const Shape = Isomer.Shape
    const Point = Isomer.Point
    const Path = Isomer.Path
    const Color = Isomer.Color

    iso.canvas.clear();
    iso.canvas.ctx.canvas.style.backgroundColor = "white"
    // Make grid
    for (var z = 1; z <= 10; z++) {
      for (var x = 1; x <= 10; x++) {
        for (var y = 1; y <= 10; y++) {
          iso.add(new Path([
            new Point(x, y, 1),
            new Point(x, y, 10),
            new Point(x, y, 1)
          ]), new Color(x * 28, y * 28, 255));
          iso.add(new Path([
            new Point(x, 1, z),
            new Point(x, 10, z),
            new Point(x, 1, z)
          ]), new Color(x * 28, y, x * 28));
          iso.add(new Path([
            new Point(1, y, z),
            new Point(10, y, z),
            new Point(1, y, z)
          ]), new Color(255, y * 28, z * 28));
        }
      }
    }
    // Add points
    Object.entries(space).forEach(([key, value]) => {
      let x = Number(key[0]),
        y = Number(key[1]),
        z = Number(key[2]);
      let color = new Color(129, 199, 132, 0.3) // light green
      if (value === "given") {
        color = new Color(150, 176, 152, 0.3); // grey
        if (x === selectedValue) color = new Color(47, 61, 187); // blue
        iso.add(Shape.Prism(new Point(x, y, z + 0.1), .9, .9, .9), color)
      } else if (value === "pen") {
        if (x === selectedValue) color = new Color(47, 61, 187); // blue
        iso.add(Shape.Prism(new Point(x, y, z + 0.1), .9, .9, .9), color)
      } else if (value === "pencil") {
        if (value === selectedValue) color = new Color(47, 61, 187); // blue
        iso.add(Shape.Prism(new Point(x, y, z + 0.5), .5, .5, .5), color)
      }
    });
  }
} // end of App

export default App;

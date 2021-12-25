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
  removeDigits,
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
                mode={this.state.mode}
                onClickCell={this.onClickCell.bind(this)}
                changeMode={this.changeMode.bind(this)}
                showColors={this.state.showColors}
                toggleColors={this.toggleColors.bind(this)}
                undo={this.undo.bind(this)}
                redo={this.redo.bind(this)}
              />
              <Controls
                startGame={this.startGame.bind(this)}
                restartGame={this.restartGame.bind(this)}
                solve={this.solve.bind(this)}
                compare={this.compare.bind(this)}
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
    // Generate solvable grid
    let grid = emptyGrid();
    while (!checkGrid(grid)) {
      grid = emptyGrid();
      fillGrid(grid)
    }
    // Remove digits
    let solution = printGrid(grid, "-");
    if (difficulty === "easy") {
      grid = removeDigits(grid, 55)
    } else if (difficulty === "medium") {
      grid = removeDigits(grid, 65)
    } else if (difficulty === "hard") {
      grid = removeDigits(grid, 75)
    }
    // Initialize sudokube with grid
    let puzzle = printGrid(grid, "-");
    let sdk = this.state.sudokube;
    sdk.init(puzzle, solution);
    this.renderSudokube(sdk.space, this.state.selectedValue);
    this.setState({
      sudokube: sdk
    });
  }

  restartGame() {
    let sdk = this.state.sudokube;
    sdk.reset();
    this.renderSudokube(sdk.space, this.state.selectedValue);
    this.setState({});
  }

  solve() {
    let sdk = this.state.sudokube;
    sdk.solve();
    this.renderSudokube(sdk.space, this.state.selectedValue);
    this.setState({
      sudokube: sdk
    });
  }

  compare() {
    let sdk = this.state.sudokube;
    sdk.compare();
    this.setState({});
  }

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

  toggleColors() {
    let show = this.state.showColors;
    this.setState({
      showColors: !show
    });
  }

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

  undo() {
    let sdk = this.state.sudokube;
    sdk.undo();
    this.setState({
      sudokube: sdk
    });
  }

  redo() {
    let sdk = this.state.sudokube;
    sdk.redo();
    this.setState({
      sudokube: sdk
    });
  }

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
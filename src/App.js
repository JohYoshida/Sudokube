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
  makeSpace,
  erase,
  removeDigits,
  solveGrid,
  removePencilMarks
} from "./gridFunctions";
import './App.css';
import Board from "./components/Board";
import Controls from "./components/Controls";
import NumSelector from "./components/NumSelector"
const Isomer = require("isomer");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      space: {},
      grid: emptyGrid(),
      selectedValue: null,
      mode: "pen"
      showColors: false
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
                    grid={this.state.grid}
                    space={this.state.space}
                    selectedValue={this.state.selectedValue}
                    onClickCell={this.onClickCell.bind(this)}
                    face={"xy"}
                    showColors={this.state.showColors}
                    />
                </div>
                <div className="column">
                  <h2>yz</h2>
                  <Board
                    grid={this.state.grid}
                    space={this.state.space}
                    selectedValue={this.state.selectedValue}
                    onClickCell={this.onClickCell.bind(this)}
                    face={"yz"}
                    showColors={this.state.showColors}
                    />
                </div>
                <div className="column">
                  <h2>xz</h2>
                  <Board
                    grid={this.state.grid}
                    space={this.state.space}
                    selectedValue={this.state.selectedValue}
                    onClickCell={this.onClickCell.bind(this)}
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
              />
              <Controls
                startGame={this.startGame.bind(this)}
                restartGame={this.restartGame.bind(this)}
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
      grid = removeDigits(grid, 37)
    } else if (difficulty === "medium") {
      grid = removeDigits(grid, 48)
    } else if (difficulty === "hard") {
      grid = removeDigits(grid, 55)
    }
    console.log(printGrid(grid, "-"))
    this.makeCube(grid, this.state.selectedValue);
    let space = makeSpace(grid);
    this.setState({
      grid,
      space
    });
  }

  restartGame() {
    let grid = this.state.grid;
    grid = erase(grid);
    this.makeCube(grid);
    let space = makeSpace(grid);
    this.setState({
      grid,
      space
    });
  }

  solveGrid() {
    let grid = this.state.grid;
    grid = solveGrid(grid);
    if (grid) {
      this.makeCube(grid);
      let space = makeSpace(grid);
      this.setState({
        grid,
        space
      });
    }
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
        this.makeCube(this.state.grid, value);
      } else {
        this.setState({
          selectedValue: null
        })
        this.makeCube(this.state.grid, null);
      }
    } else {
      // Clicked on Cell in Board
      this.updateCell(row, col, this.state.selectedValue, face)
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

  toggleColors() {
    let show = this.state.showColors;
    this.setState({
      showColors: !show
    });
  }

  updateCell(row, col, value, face) {
    if (face === "yz") {
      let temp = value;
      value = col
      col = row;
      row = temp;
    }
    if (face === "xz") {
      let temp = value;
      value = col
      col = temp;
    }
    let grid = this.state.grid;
    let mode = this.state.mode;
    let cell = grid[row - 1][col - 1];

    if (cell === null) {
      // Empty cell
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
      // Marked cell
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
              removePencilMarks(grid, row, col, value);
            }
          } else {
            // Write over pencil marks
            removePencilMarks(grid, row, col, value);
            grid[row - 1][col - 1] = {
              value,
              given: false
            }
          }
        } else if (mode === "pencil") {
          if (typeof cell.value !== "number") {
            if (cell.value.includes(value)) {
              // Remove pencil mark
              grid[row - 1][col - 1].value = cell.value.filter(e => {
                return e !== value
              });
            } else {
              // Write pencil mark
              grid[row - 1][col - 1].value.push(value);
              grid[row - 1][col - 1].value.sort();
            }
          }
        }

      }
    }
    let space = makeSpace(grid);
    this.setState({
      grid,
      space
    });
  }

  /**
   * [makeCube description]
   * @param  {[type]} grid          [description]
   * @param  {[type]} selectedValue [description]
   * @return {[type]}               [description]
   */
  makeCube(grid, selectedValue) {
    const iso = new Isomer(document.getElementById("ThreeD"));
    const Shape = Isomer.Shape
    const Point = Isomer.Point
    const Path = Isomer.Path
    const Color = Isomer.Color

    iso.canvas.clear();
    iso.canvas.ctx.canvas.style.backgroundColor = "white"
    // Make grid
    for (var z = 0; z <= 9; z++) {
      for (var x = 0; x <= 9; x++) {
        for (var y = 0; y <= 9; y++) {
          iso.add(new Path([
            new Point(x, y, 0),
            new Point(x, y, 9),
            new Point(x, y, 0)
          ]), new Color(x * 28, y * 28, 255));
          iso.add(new Path([
            new Point(x, 0, z),
            new Point(x, 9, z),
            new Point(x, 0, z)
          ]), new Color(x * 28, y, x * 28));
          iso.add(new Path([
            new Point(0, y, z),
            new Point(9, y, z),
            new Point(0, y, z)
          ]), new Color(255, y * 28, z * 28));
        }
      }
    }
    // Add cubes
    for (var row = 0; row < 9; row++) {
      for (var col = 0; col < 9; col++) {
        let cell = grid[row][col];
        if (cell !== null) {
          let color;
          if (cell.given) color = new Color(150, 176, 152, 0.3); // grey
          else color = new Color(129, 199, 132, 0.3) // light green
          if (typeof cell.value === "number") {
            if (cell.value === selectedValue) {
              color = new Color(47, 61, 187); // blue
              iso.add(Shape.Prism(new Point(row - 1, col - 1, cell.value + 0.1), .9, .9, .9), color)
            } else if (selectedValue === null) {
              iso.add(Shape.Prism(new Point(row - 1, col - 1, cell.value + 0.1), .9, .9, .9), color)
            } else {
              iso.add(Shape.Prism(new Point(row - 1, col - 1, cell.value + 0.1), .9, .9, .9), color)
            }
          } else { // pencil marks
            cell.value.forEach(value => {
              if (value === selectedValue) color = new Color(47, 61, 187); // blue
              iso.add(Shape.Prism(new Point(row - 1, col - 1, value + 0.5), .5, .5, .5), color)
            });
          }
        }
      }
    }
  }

} // end of App

export default App;
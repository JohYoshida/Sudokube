import React, {
  Component
} from "react";
import Cell from "./Cell";
import Divider from "./Divider";

class Board extends Component {
  render() {
    const Grid = this.makeGrid();
    return <div className="Board" key={this.props.face}>{Grid}</div>
  }

  makeBoard = () => {
    const Board = [];
    Board.push(this.makeThird(1));
    Board.push(this.makeHorizontalDivider("top_em", "em"));
    Board.push(this.makeThird(2));
    Board.push(this.makeHorizontalDivider("bottom_em", "em"));
    Board.push(this.makeThird(3));
    return Board;
  }

  makeGrid() {
    const Grid = [];
    for (var i = 0; i < 3; i++) {
      let row = [];
      for (var j = 0; j < 3; j++) {
        let square
        switch (this.props.face) {
          case "xy":
            square = this.makeSquareXY([i, j]);
            break;
          case "yz":
            square = this.makeSquareYZ([i, j]);
            break;
          case "xz":
            square = this.makeSquareXZ([i, j]);
            break;

          default:

        }
        row.push(<div className="Square" key={`${i}${j}`}>{square}</div>)
      }
      Grid.push(<div className="row" key={`${i}${j}`}>{row}</div>)
    }
    return Grid;
  }

  makeSquareXY(square) {
    const Square = [];
    let space = this.props.space;
    for (var i = 1; i <= 3; i++) {
      let row = [];
      for (var j = 1; j <= 3; j++) {
        let x = square[0] * 3 + i;
        let y = square[1] * 3 + j;
        // let z = null;
        let value = [];
        let cell;
        for (var z = 1; z <= 9; z++) {
          if (space[`${x}${y}${z}`]) {
            cell = space[`${x}${y}${z}`]
            if (cell === "given" || cell === "pen") {
              value = z;
              break
            } else if (cell === "pencil") value.push(z);
          }
        }
        if (typeof value === "object") z = null;
        if (value.length === 0) value = null;
        row.push(
          <Cell
            key={`xy:${x}${y}`}
            row={x}
            col={y}
            value={value}
            face={this.props.face}
            given={cell === "given"}
            selectedValue={this.props.selectedValue}
            onClick={this.props.onClickCell}
            />
        );
      }
      Square.push(<div className="row" key={i}>{row}</div>)
    }
    return Square;
  }

  makeSquareXZ(square) {
    const Square = [];
    let space = this.props.space;
    for (var i = 1; i <= 3; i++) {
      let row = [];
      for (var j = 1; j <= 3; j++) {
        let x = square[0] * 3 + i;
        let z = square[1] * 3 + j;
        let value = [];
        let cell;
        for (var y = 1; y <= 9; y++) {
          if (space[`${x}${y}${z}`]) {
            cell = space[`${x}${y}${z}`]
            if (cell === "given" || cell === "pen") {
              value = y;
              break
            } else if (cell === "pencil") value.push(y);
          }
        }
        if (typeof value === "object") y = null;
        if (value.length === 0) value = null;
        row.push(
          <Cell
            key={`xz:${x}${z}`}
            row={x}
            col={z}
            value={value}
            face={this.props.face}
            given={cell === "given"}
            selectedValue={this.props.selectedValue}
            onClick={this.props.onClickCell}
            />
        );
      }
      Square.push(<div className="row" key={i}>{row}</div>)
    }
    return Square;
  }

  makeSquareYZ(square) {
    const Square = [];
    let space = this.props.space;
    for (var i = 1; i <= 3; i++) {
      let row = [];
      for (var j = 1; j <= 3; j++) {
        let y = square[0] * 3 + i;
        let z = square[1] * 3 + j;
        let value = [];
        let cell;
        for (var x = 1; x <= 9; x++) {
          if (space[`${x}${y}${z}`]) {
            cell = space[`${x}${y}${z}`]
            if (cell === "given" || cell === "pen") {
              value = x;
              break
            } else if (cell === "pencil") value.push(x);
          }
        }
        if (typeof value === "object") x = null;
        if (value.length === 0) value = null;
        row.push(
          <Cell
            key={`yz:${y}${z}`}
            row={y}
            col={z}
            value={value}
            face={this.props.face}
            given={cell === "given"}
            selectedValue={this.props.selectedValue}
            onClick={this.props.onClickCell}
            />
        );
      }
      Square.push(<div className="row" key={i}>{row}</div>)
    }
    return Square;
  }
}

export default Board;
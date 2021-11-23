import React, {
  Component
} from "react";
import Cell from "./Cell";
import Divider from "./Divider";

class Board extends Component {
  render() {
    const Board = this.makeBoard();
    return <div className="Board">{Board}</div>;
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

  makeThird = (val) => {
    const Third = [];
    let row = [];
    let count = 3 * val;
    for (var i = count - 2; i <= count; i++) {
      for (var j = 1; j <= 9; j++) {
        row.push(
          <Cell
            key={j}
            row={i}
            col={j}
            value={this.props.grid[i-1][j-1]}
            given={this.props.givenValues[i-1][j-1] ? true : false}
            selectedValue={this.props.selectedValue}
            onClick={this.props.onClickCell}
          />);
        // add vertical dividers
        if (j === 3 || j === 6) {
          row.push(<Divider key={`${j}_divider`} type="vertical_em"/>);
        } else if (j !== 9) {
          row.push(<Divider key={`${j}_divider`} type="vertical"/>);
        }
      }
      Third.push(<div className="row" key={i}>{ row }</div>);
      row = [];
      // add horizontal divider
      if (i % 3 !== 0) {
        Third.push(this.makeHorizontalDivider(`${i}_row`));
      }
    }
    return Third;
  }

  makeHorizontalDivider = (key, modifier) => {
    let row = [];
    let type = "horizontal";
    if (modifier === "em") {
      type += "_em";
    }
    for (var i = 0; i < 9; i++) {
      row.push(<Divider key={i} type={type}/>);
    }
    return (<div className="row" key={key}>{ row }</div>);
  }
}

export default Board;
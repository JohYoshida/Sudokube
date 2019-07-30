import React, { Component } from "react";
import Cell from "./Cell";
import Divider from "./Divider";

class Board extends Component {
  render() {
    const Board = this.makeBoard();
    return <div className="Board">{Board}</div>;
  }

  makeBoard = () => {
    const Board = [];
    let Third = this.makeThird(1);
    let div = this.makeHorizontalDivider("em");
    Board.push(Third);
    Board.push(div);
    Third = this.makeThird(2);
    Board.push(Third);
    Board.push(div);
    Third = this.makeThird(3);
    Board.push(Third);
    return Board;
  }

  makeThird = (val) => {
    const Third = [];
    let row = [];
    let count = 3 * val;
    for (var i = count - 3; i <= count; i++) {
      for (var j = 1; j <= 9; j++) {
        row.push(<Cell key={j} i={i} j={j}/>);
        if (j === 3 || j === 6) {
          row.push(<Divider key={j} type="vertical_em"/>);
        } else if (j !== 9) {
          row.push(<Divider key={j} type="vertical"/>);
        }
      }
      row = [];
      Third.push(<div className="row" key={`${i}-row`}>{ row }</div>);
      if (i === 0 || i === 1) {
        Third.push(this.makeHorizontalDivider());
      }
    }
    return Third;
  }

  makeHorizontalDivider = (modifier) => {
    let row = [];
    let type = "horizontal";
    if (modifier === "em") {
      type += "_em";
    }
    for (var i = 0; i < 9; i++) {
      row.push(<Divider key={i} type={type}/>);
    }
    return (<div className="row" key="a">{ row }</div>);
  }
}

export default Board;

import React, { Component } from "react";

class Cell extends Component {
  render() {
    return(
      <div className="Cell">
        {this.props.i}
        {this.props.j}
      </div>
    );
  }
}

export default Cell;

import React, {
  Component
} from 'react';
import Cell from "./Cell";

class NumSelector extends Component {

  render() {
    let numbers = [];
    for (var i = 1; i <= 9; i++) {
      numbers.push(
        <Cell
          key={i}
          value={i}
          onClick={this.props.onClickCell}
          selectedValue={this.props.selectedValue}
        />
      );
    }
    return (
      <div className="NumSelector">
        <div className="row">
          {numbers}
        </div>
      </div>
    );
  }
}

export default NumSelector;
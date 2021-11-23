import React, {
  Component
} from 'react';
import Cell from "./Cell";
import ModeSelector from "./ModeSelector";

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
    // Add mode selector
    numbers.push(
      <ModeSelector
        key="mode"
        value="e"
        onClick={this.props.changeMode}
        selectedValue={this.props.mode}
      />
    );
    return (
      <div className="NumSelector">
        {numbers}
      </div>
    );
  }
}

export default NumSelector;
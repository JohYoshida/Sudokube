import React, {
  Component
} from 'react';
import Cell from "./Cell";
import ModeSelector from "./ModeSelector";
import ColorToggler from "./ColorToggler";
import UndoButton from "./UndoButton";
import RedoButton from "./RedoButton";

class NumSelector extends Component {

  render() {
    let numbers = [];
    let controls = []
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
    controls.push(
      <ModeSelector
        onClick={this.props.changeMode}
        selectedValue={this.props.mode}
      />
    );
    // Add show color toggle
    controls.push(
      <ColorToggler
        showColors={this.props.showColors}
        onClick={this.props.toggleColors}
      />
    );
    // Add undo button
    controls.push(
      <UndoButton
        onClick={this.props.undo}
      />
    );
    // Add redo button
    controls.push(
      <RedoButton
        onClick={this.props.redo}
      />
    );
    return (
      <div className="NumSelector">
        <div className="col">
          <div className="row">
            {numbers}
          </div>
          <div className="row">
            {controls}
          </div>
        </div>
      </div>
    );
  }
}

export default NumSelector;
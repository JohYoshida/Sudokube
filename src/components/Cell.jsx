import React, {
  Component
} from "react";

class Cell extends Component {
  render() {
    const {
      row,
      col,
      value,
      selectedValue,
      given
    } = this.props;
    let className = "Cell";
    if (given) className = "Cell given"
    if (value === selectedValue && value !== null) className = "Cell selected"
    return (
      <div className={className} onClick={this.props.onClick.bind(this, {row, col, value})}>
        {value}
      </div>
    );
  }
}

export default Cell;
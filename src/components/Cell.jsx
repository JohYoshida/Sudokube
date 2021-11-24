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
      given,
      face
    } = this.props;
    let className = "Cell";
    if (given) className = "Cell given"
    if (value !== null) {
      if (value === selectedValue) className = "Cell selected"
      if (typeof value === "object" && value.includes(selectedValue)) className = "Cell selected"
    }
    if (typeof value === "object" && value !== null) {
      return (
        <div className={className} onClick={this.props.onClick.bind(this, {row, col, value, face})}>
          <div className="row">
            <div className="subcell">
              {value.includes(1) ? 1 : null}
            </div>
            <div className="subcell">
              {value.includes(2) ? 2 : null}
            </div>
            <div className="subcell">
              {value.includes(3) ? 3 : null}
            </div>
          </div>
          <div className="row">
            <div className="subcell">
              {value.includes(4) ? 4 : null}
            </div>
            <div className="subcell">
              {value.includes(5) ? 5 : null}
            </div>
            <div className="subcell">
              {value.includes(6) ? 6 : null}
            </div>
          </div>
          <div className="row">
            <div className="subcell">
              {value.includes(7) ? 7 : null}
            </div>
            <div className="subcell">
              {value.includes(8) ? 8 : null}
            </div>
            <div className="subcell">
              {value.includes(9) ? 9 : null}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className={className} onClick={this.props.onClick.bind(this, {row, col, value, face})}>
          {value}
        </div>
      );
    }

  }
}

export default Cell;
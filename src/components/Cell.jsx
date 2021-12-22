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
      mode,
      face,
      showColors
    } = this.props;
    let className = "Cell";
    // Handle cell coloring
    if (mode === "given") className = "Cell given"
    if (value !== null) {
      if (typeof value === "object" && value.includes(selectedValue)) {
        className = "Cell selected"
      } else {
        if (showColors) {
          if ([1, 2, 3].includes(value)) {
            className = "Cell A"
          } else if ([4, 5, 6].includes(value)) {
            className = "Cell B"
          } else if ([7, 8, 9].includes(value)) {
            className = "Cell C"
          }
        }
      }
      if (value === selectedValue) className = "Cell selected"
      if (mode === "invalid") className = "Cell invalid"
    }
    // Handle hover highlighting
    if (this.props.hover) {
      let coords = this.props.hover.split("-");
      if (!coords.includes("null")) {
        if (row === Number(coords[0]) && col === Number(coords[1]) && value === Number(coords[2])) {
          className += " hover"
        } else if (row === Number(coords[1]) && col === Number(coords[2]) && value === Number(coords[0])) {
          className += " hover"
        } else if (row === Number(coords[0]) && col === Number(coords[2]) && value === Number(coords[1])) {
          className += " hover"
        }
      } else {
        if (coords[0] === "null") {
          if (face === "xy" && col === Number(coords[1])) {
            className += " hover"
          } else if (face === "xz" && col === Number(coords[2])) {
            className += " hover"
          } else if (face === "yz" && row === Number(coords[1]) && col === Number(coords[2])) {
            className += " hover"
          }
        }
        if (coords[1] === "null") {
          if (face === "xy" && row === Number(coords[0])) {
            className += " hover"
          } else if (face === "yz" && col === Number(coords[2])) {
            className += " hover"
          } else if (face === "xz" && row === Number(coords[0]) && col === Number(coords[2])) {
            className += " hover"
          }
        }
        if (coords[2] === "null") {
          if (face === "xz" && row === Number(coords[0])) {
            className += " hover"
          } else if (face === "yz" && row === Number(coords[1])) {
            className += " hover"
          } else if (face === "xy" && row === Number(coords[0]) && col === Number(coords[1])) {
            className += " hover"
          }
        }
      }
    }
    if (typeof value === "object" && value !== null) {
      return (
        <div className={className}
          onClick={this.props.onClick.bind(this, {row, col, value, face})}
          onMouseOver={this.props.onHover.bind(this, {row, col, value, face})}
          >
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
        <div className={className}
          onClick={this.props.onClick.bind(this, {row, col, value, face})}
          onMouseOver={this.props.onHover ? this.props.onHover.bind(this, {row, col, value, face}) : null}
          >
          {value}
        </div>
      );
    }

  }
}

export default Cell;
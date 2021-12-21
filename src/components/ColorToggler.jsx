import React, {
  Component
} from "react";

class ColorToggler extends Component {
  render() {
    const {
      value,
      showColors
    } = this.props;
    let className = "Cell";
    if (showColors) className = "Cell selected"
    return (
      <div className={className} onClick={this.props.onClick.bind(this)}>
        {value}
      </div>
    );

  }
}

export default ColorToggler;
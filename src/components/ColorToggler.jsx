import React, {
  Component
} from "react";
import {
  IoColorPaletteOutline
} from "react-icons/io5";

class ColorToggler extends Component {
  render() {
    const {
      showColors
    } = this.props;
    let className = "Cell";
    if (showColors) className = "Cell selected"
    return (
      <div className={className} onClick={this.props.onClick.bind(this)}>
        <IoColorPaletteOutline size={25}/>
      </div>
    );

  }
}

export default ColorToggler;
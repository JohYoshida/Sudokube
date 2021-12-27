import React, {
  Component
} from "react";
import {
  IoPencil
} from "react-icons/io5";

class ModeSelector extends Component {
  render() {
    const {
      selectedValue,
    } = this.props;
    let className = "Cell";
    if (selectedValue === "pencil") className = "Cell selected"
    return (
      <div className={className} onClick={this.props.onClick.bind(this)}>
        <IoPencil size={25}/>
      </div>
    );

  }
}

export default ModeSelector;
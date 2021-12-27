import React, {
  Component
} from "react";
import {
  IoArrowUndoOutline
} from "react-icons/io5";

class UndoButton extends Component {
  render() {
    let className = "Cell";
    return (
      <div className={className} onClick={this.props.onClick.bind(this)}>
        <IoArrowUndoOutline size={25}/>
      </div>
    );

  }
}

export default UndoButton;
import React, {
  Component
} from "react";
import {
  IoArrowRedoOutline
} from "react-icons/io5";

class UndoButton extends Component {
  render() {
    let className = "Cell";
    return (
      <div className={className} onClick={this.props.onClick.bind(this)}>
        <IoArrowRedoOutline size={25}/>
      </div>
    );

  }
}

export default UndoButton;
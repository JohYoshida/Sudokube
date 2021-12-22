import React, {
  Component
} from "react";

class UndoButton extends Component {
  render() {
    const {
      value,
    } = this.props;
    let className = "Cell";
    // if (showColors) className = "Cell selected"
    return (
      <div className={className} onClick={this.props.onClick.bind(this)}>
        {value}
      </div>
    );

  }
}

export default UndoButton;
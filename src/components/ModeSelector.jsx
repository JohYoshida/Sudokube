import React, {
  Component
} from "react";

class ModeSelector extends Component {
  render() {
    const {
      value,
      selectedValue,
    } = this.props;
    let className = "Cell";
    if (selectedValue === "pencil") className = "Cell selected"
    return (
      <div className={className} onClick={this.props.onClick.bind(this)}>
        {value}
      </div>
    );

  }
}

export default ModeSelector;
import React, { Component } from "react";

class Divider extends Component {
  render() {
    const className = "Divider " + this.props.type;
    return(
      <div className={className}>

      </div>
    );
  }
}

export default Divider;

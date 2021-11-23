import React, {
  Component
} from 'react';


class Controls extends Component {

  render() {
    return (
      <div className="Controls">
        <button onClick={this.props.startGame.bind(this,"easy")} >Easy</button>
        <button onClick={this.props.startGame.bind(this,"medium")} >Medium</button>
        <button onClick={this.props.startGame.bind(this,"hard")} >Hard</button>
        <button onClick={this.props.solveGrid} >Solve Grid</button>
      </div>
    );
  }
}

export default Controls;
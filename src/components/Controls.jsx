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
        <button onClick={this.props.solve} >Solve Grid</button>
        <button onClick={this.props.restartGame} >Restart Game</button>
        <button onClick={this.props.compare} >Compare Grid</button>
      </div>
    );
  }
}

export default Controls;
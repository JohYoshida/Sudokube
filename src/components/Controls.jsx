import React, {
  Component
} from 'react';
import {
  IoPlayOutline,
  IoHappyOutline,
  IoSadOutline,
  IoSkullOutline,
  IoColorWandOutline,
  IoRefresh,
  IoCheckmark
} from "react-icons/io5";
import ModeSelector from "./ModeSelector";
import ColorToggler from "./ColorToggler";
import UndoButton from "./UndoButton";
import RedoButton from "./RedoButton";

class Controls extends Component {

  render() {
    // Disabled medium and hard difficulties until I can find a better implementation
    // <div className={"Cell"} title="Difficult" onClick={this.props.startGame.bind(this,"medium")} ><IoSadOutline size={25} /></div>
    // <div className={"Cell"} title="Deadly" onClick={this.props.startGame.bind(this,"hard")} ><IoSkullOutline size={25} /></div>
    return (
      <div className="Controls row">
        <div className={"Cell"} title="Play" onClick={this.props.startGame.bind(this,"easy")} ><IoPlayOutline size={25} /></div>
        <div className={"Cell"} title="Restart" onClick={this.props.restartGame} ><IoRefresh size={25} /></div>
        <div className={"Cell"} title="Solve" onClick={this.props.solve} ><IoColorWandOutline size={25} /></div>
        <div className={"Cell"} title="Check against solution" onClick={this.props.compare} ><IoCheckmark size={25} /></div>
        <div title={this.props.mode === "pen" ? "Switch to pencil" : "Switch to pen"}>
          <ModeSelector
            onClick={this.props.changeMode}
            selectedValue={this.props.mode}
            />
        </div>
        <div title="Toggle set coloring">
          <ColorToggler
            showColors={this.props.showColors}
            onClick={this.props.toggleColors}
            />
        </div>
        <div title="Undo">
          <UndoButton
            onClick={this.props.undo}
            />
        </div>
        <div title="Redo">
          <RedoButton
            onClick={this.props.redo}
            />
        </div>
      </div>
    );
  }
}

export default Controls;

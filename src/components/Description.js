import React, { Component } from "react";
import {
  IoPlayOutline,
  IoCheckmark
} from "react-icons/io5";

class Description extends Component {
  render() {
    return(
      <div className="Description">
        <div className="welcome">
          <h1>
          Welcome to Sudokube, the (world's first?) truly 3D sudoku puzzle.
          </h1>
          <h2>
          Press <span className="Cell"><IoPlayOutline size={20} /></span> to get started
          </h2>
        </div>
        <div className="about">
          <div>
            A Sudokube is composed of six interrelated sudoku grids, each
            representing a face of a 9x9x9 cube. Above are the xy-, yz-, and xz-faces.
            Every digit in a grid is mapped to a location in 3D space
            (represented isometrically to the right of the grids).
          </div>
          <div>
            For example, a point at the xyz-coordinate (1,2,3) appears in the
            xy-grid at row 1, column 2, with value 3. Simultaneously, it appears
            in the yz-grid at row 2, column 3, with value 1; it also appears in the
            xz-grid at row 1, column 3, with value 2. Since any given digit in one grid
            maps to some digit on all the other grids, a digit must follow an extra
            restriction on top of the normal sudoku restrictions to be considered valid.
          </div>
          <div>
            Can you discover the restriction? Hint: observe what happens if you place
            a 1 at row 1 column 1 and a 2 at row 1 column 2. The three differently
            colored sets [1,2,3], [4,5,6], [7,8,9] might provide some insight.
          </div>
          <div>
            These puzzles are computer generated, so - while every puzzle is guaranteed
            to have a unique solution - some puzzles may require extensive bifurcation
            to solve, making them unfeasible for for a human to solve. If you're
            stuck, try inserting a possible value and then pressing Check Against
            Solution <span className="Cell"><IoCheckmark size={20} /></span> to
            see if that value is correct, or just start a new game.
          </div>
          <div>
            This project is a proof of concept. A full release in Unity3D is in
            development, which will include a rotate-able Sudokube instead of the
            isometric projection, several difficulty levels, and curated puzzles.
          </div>
          <div>
            Happy Solving!
          </div>
          <div>
            Joh Yoshida
          </div>
        </div>
      </div>
    );
  }
}

export default Description;

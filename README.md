## Welcome to Sudokube, the (world's first?) truly 3D sudoku puzzle.

A Sudokube is composed of six interrelated sudoku grids, each
representing a face of a 9x9x9 cube. Every digit in a grid is mapped to a location in 3D space.

For example, a point at the xyz-coordinate (1,2,3) appears in the xy-grid at row 1, column 2, with value 3. Simultaneously, it appears in the yz-grid at row 2, column 3, with value 1; it also appears in the xz-grid at row 1, column 3, with value 2. Since any given digit in one grid maps to some digit on all the other grids, a digit must follow an extra restriction on top of the normal sudoku restrictions to be considered valid.

Can you discover the restriction? Hint: observe what happens if you place a 1 at row 1 column 1 and a 2 at row 1 column 2. The three differently colored sets [1,2,3], [4,5,6], [7,8,9] might provide some insight.

These puzzles are computer generated, so - while every puzzle is guaranteed to have a unique solution - some puzzles may require extensive bifurcation to solve, making them unfeasible for for a human to solve. If you're stuck, try inserting a possible value and then pressing Check Against Solution to see if that value is correct, or just start a new game.

## Online Web App

Visit https://sudokube.herokuapp.com/ to play now. This project is hosted using free dynos, so please allow the server a moment to warm up :)

## Local Web App
You can clone this repo and run it on your own machine. Make sure you have `npm` installed, then navigate to the project directory and run:

### `npm install`


Then in the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Stack
This project was made with ReactJS. It uses HTML Canvas and IsomerJS to render the Sudokube.

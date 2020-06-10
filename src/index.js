import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const Square = ({ value, onClick, className }) => (
  <button className={`square ${className}`} onClick={onClick}>
    {value}
  </button>
);

const Board = ({ squares, onClick, winningSquares }) => (
  <>
    {[...Array(3)].map((_, rowIndex) => (
      <div key={rowIndex} className="board-row">
        {[...Array(3)].map((_, colIndex) => {
          let value = 3 * rowIndex + colIndex;
          return (
            <Square
              key={colIndex}
              value={squares[value]}
              onClick={() => onClick(value)}
              className={
                winningSquares?.includes(value) ? "square-winning" : undefined
              }
            />
          );
        })}
      </div>
    ))}
  </>
);

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares: squares }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  moveTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, winningSquares] = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((_, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button
            onClick={() => this.moveTo(move)}
            className={this.state.stepNumber === move ? "bold" : undefined}
          >
            {desc}
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }

  return [null, null];
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

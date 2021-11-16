import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={'square ' + (props.isWinnerSquare ? 'square-winner' : '')}
                onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        const isWinnerSquare = this.props.winner && this.props.winner.winnerSquares.includes(i) ? true : false;

        return <Square isWinnerSquare={isWinnerSquare}
                       value={this.props.squares[i]}
                       onClick={() => this.props.onClick(i)} />;
    }

    renderRows() {
        let rows = [];

        for (let r = 0; r < 3; r++) {
            let row = [];

            for (let c = 0; c < 3; c++) {
                let index = r*3 + c;
                row.push(<span key={c}>{this.renderSquare(index)}</span>);
            }

            rows.push(
                <div key={r}
                    className="board-row">{row}</div>
            );
        }

        return rows;
    }

    render() {
        return (
            <div>
                {this.renderRows()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: null,
                col: null
            }],
            stepNumber: 0,
            xIsNext: true,
            sorting: 'asc'
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                row: getRow(i),
                col: getCol(i)
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    sortMoves() {
        const sorting = this.state.sorting === 'asc' ? 'desc' : 'asc';

        this.setState({
            sorting: sorting,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const stepNumber = this.state.stepNumber;
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' (row: ' + step.row + ' col: ' + step.col + ')':
                'Go to game start';
            const className = stepNumber === move ? 'text-bold' : '';
            return (
                <li className={className}
                    key={move}>
                    <button onClick={() => this.jumpTo(move)}>{move}: {desc}</button>
                </li>
            );
        });
        const sorting = this.state.sorting;

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else {
            status = stepNumber === 9 ? 'Draw' : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winner={winner}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <div><button onClick={() => this.sortMoves()}>Sort moves ({ sorting })</button></div>
                    <ol>{ sorting === 'asc' ? moves : moves.reverse() }</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
            return {
                winner: squares[a],
                winnerSquares: lines[i]
            };
        }
    }
    return null;
}

function getRow(i) {
    return Math.ceil((i + 1)/3);
}

function getCol(i) {
    return (i % 3) + 1;
}

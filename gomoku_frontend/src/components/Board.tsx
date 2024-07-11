import React from 'react';
import Cell from './Cell';

interface BoardProps {
	board: string[][];
	onClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick }) => {
	return (
		<div className="board">
		{board.map((row, i) =>
			row.map((cell, j) => <Cell key={`${i}-${j}`} value={cell} onClick={() => onClick(i, j)} />)
		)}
		</div>
	);
};

export default Board;

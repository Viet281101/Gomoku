import React, { useState, useEffect } from 'react';
import Board from './Board';
import axios from 'axios';

const Game: React.FC = () => {
	const [board, setBoard] = useState(Array(15).fill(Array(15).fill(null)));
	const [currentTurn, setCurrentTurn] = useState('X');
	const [winner, setWinner] = useState<string | null>(null);

	const fetchData = async () => {
		try {
		const result = await axios.get('http://localhost:8000/api/games/');
		setBoard(result.data.board);
		setCurrentTurn(result.data.currentTurn);
		setWinner(result.data.winner);
		} catch (error) {
		console.error('Error fetching data:', error);
		}
	};

	useEffect(() => {
		fetchData();
		const intervalId = setInterval(fetchData, 2000);
		return () => clearInterval(intervalId);
	}, []);

	const handleClick = (row: number, col: number) => {
		if (board[row][col] || winner) return;

		const newBoard = board.map((r, i) =>
		r.map((cell: string | null, j: number) => (i === row && j === col ? currentTurn : cell))
		);

		setBoard(newBoard);
		setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
		axios.post('http://localhost:8000/api/games/', { board: newBoard, currentTurn });
		const newWinner = calculateWinner(newBoard);
		if (newWinner) setWinner(newWinner);
	};

	const calculateWinner = (board: string[][]): string | null => {
		const lines: number[][][] = [
			[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
			[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
			[[0, 0], [1, 1], [2, 2], [3, 3], [4, 4]],
		];

		for (let i = 0; i < lines.length; i++) {
			const [a, b, c, d, e] = lines[i];
			if (
				board[a[0]][a[1]] &&
				board[a[0]][a[1]] === board[b[0]][b[1]] &&
				board[a[0]][a[1]] === board[c[0]][c[1]] &&
				board[a[0]][a[1]] === board[d[0]][d[1]] &&
				board[a[0]][a[1]] === board[e[0]][e[1]]
			) {
				return board[a[0]][a[1]];
			}
		}
		return null;
	};

	return (
		<div className="game">
		<Board board={board} onClick={handleClick} />
		<div className="info">
			{winner ? <h2>Winner: {winner}</h2> : <h2>Next player: {currentTurn}</h2>}
		</div>
		</div>
	);
};

export default Game;

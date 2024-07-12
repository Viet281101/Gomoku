import React, { useState, useEffect } from 'react';
import Board from './Board';
import axios from 'axios';

const Game: React.FC = () => {
	const initialBoard = Array.from({ length: 15 }, () => Array(15).fill(null));
	const [board, setBoard] = useState<string[][]>(initialBoard);
	const [currentTurn, setCurrentTurn] = useState('X');
	const [winner, setWinner] = useState<string | null>(null);

	const fetchData = async () => {
		try {
			const result = await axios.get('http://localhost:8000/api/games/');
			setBoard(result.data.board || initialBoard);
			setCurrentTurn(result.data.currentTurn || 'X');
			setWinner(result.data.winner || null);
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
			r.map((cell, j) => (i === row && j === col ? currentTurn : cell))
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

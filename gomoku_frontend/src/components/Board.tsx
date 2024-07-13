import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

interface BoardProps {
	boardSize: number;
	player1: string;
	player2: string;
	gameId: number;
}

const Board: React.FC<BoardProps> = ({ boardSize, player1, player2, gameId }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [board, setBoard] = useState<string[][]>(Array(boardSize).fill(null).map(() => Array(boardSize).fill('')));
	const [currentTurn, setCurrentTurn] = useState<'black' | 'white'>('black');
	const [winner, setWinner] = useState<string | null>(null);
	const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

	useEffect(() => {
		axios.get(`/api/games/${gameId}/`).then(response => {
			const gameData = response.data;
			setBoard(gameData.board);
			setCurrentTurn(gameData.current_turn === 'X' ? 'black' : 'white');
			setWinner(gameData.winner ? (gameData.winner === 'X' ? 'black' : 'white') : null);
		});
	}, [gameId]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const cellSize = canvas.width / (boardSize + 1);

				const drawBoard = () => {
					ctx.fillStyle = '#D2B48C';
					ctx.fillRect(0, 0, canvas.width, canvas.height);

					ctx.strokeStyle = '#000000';
					for (let i = 1; i <= boardSize; i++) {
						ctx.beginPath();
						ctx.moveTo(cellSize, i * cellSize);
						ctx.lineTo(boardSize * cellSize, i * cellSize);
						ctx.stroke();

						ctx.beginPath();
						ctx.moveTo(i * cellSize, cellSize);
						ctx.lineTo(i * cellSize, boardSize * cellSize);
						ctx.stroke();
					}
				};

				const drawPieces = () => {
					board.forEach((row, y) => {
						row.forEach((cell, x) => {
							if (cell !== '') {
								ctx.beginPath();
								ctx.arc((x + 1) * cellSize, (y + 1) * cellSize, cellSize / 3, 0, 2 * Math.PI);
								ctx.fillStyle = cell;
								ctx.fill();
								ctx.stroke();
							}
						});
					});
				};

				const drawHoverPiece = () => {
					if (hoveredCell && !winner && board[hoveredCell.y][hoveredCell.x] === '') {
						ctx.beginPath();
						ctx.arc(
							(hoveredCell.x + 1) * cellSize,
							(hoveredCell.y + 1) * cellSize,
							cellSize / 3,
							0,
							2 * Math.PI
						);
						ctx.fillStyle = currentTurn === 'black' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
						ctx.fill();
						ctx.stroke();
					}
				};

				drawBoard();
				drawPieces();
				drawHoverPiece();
			}
		}
	}, [board, boardSize, hoveredCell, currentTurn, winner]);

	const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (winner) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const cellSize = canvas.width / (boardSize + 1);
		const col = Math.floor(x / cellSize) - 1;
		const row = Math.floor(y / cellSize) - 1;

		if (col >= 0 && col < boardSize && row >= 0 && row < boardSize && board[row][col] === '') {
			const newBoard = board.map((r, rowIndex) =>
				r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? currentTurn : cell))
			);
			setBoard(newBoard);
			if (checkWinner(newBoard, currentTurn, row, col)) {
				setWinner(currentTurn);
			} else {
				setCurrentTurn(currentTurn === 'black' ? 'white' : 'black');
			}

			axios.post(`/api/games/${gameId}/move/`, {
				move: { x: col, y: row },
				player: currentTurn === 'black' ? 'X' : 'O'
			});
		}
	};

	const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const cellSize = canvas.width / (boardSize + 1);
		const col = Math.floor(x / cellSize) - 1;
		const row = Math.floor(y / cellSize) - 1;

		if (col >= 0 && col < boardSize && row >= 0 && row < boardSize) {
			setHoveredCell({ x: col, y: row });
		} else {
			setHoveredCell(null);
		}
	};

	const handleMouseOut = () => {
		setHoveredCell(null);
	};

	const checkWinner = (board: string[][], player: string, row: number, col: number): boolean => {
		const directions = [
			{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: -1 }
		];

		const countConsecutive = (dx: number, dy: number): number => {
			let count = 0;
			for (let i = -4; i <= 4; i++) {
				const x = col + i * dx;
				const y = row + i * dy;
				if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[y][x] === player) {
					count++;
					if (count === 5) return count;
				} else {
					count = 0;
				}
			}
			return count;
		};

		for (const { x, y } of directions) {
			if (countConsecutive(x, y) >= 5) return true;
		}
		return false;
	};

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={600}
				height={600}
				onClick={handleCanvasClick}
				onMouseMove={handleMouseMove}
				onMouseOut={handleMouseOut}
			></canvas>
			{winner && <p>{winner} wins!</p>}
		</div>
	);
};

export default Board;

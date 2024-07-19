import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface BoardProps {
	boardSize: number;
	playerColor: string;
	gameId: number;
	gameData: any;
}

const Board: React.FC<BoardProps> = ({ boardSize, playerColor, gameId, gameData }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [board, setBoard] = useState<string[][]>(Array(boardSize).fill(null).map(() => Array(boardSize).fill('')));
	const [currentTurn, setCurrentTurn] = useState<'black' | 'white'>('black');
	const [winner, setWinner] = useState<string | null>(null);
	const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
	const [moveHistory, setMoveHistory] = useState<{ x: number, y: number, player: string }[]>([]);
	const [canvasSize, setCanvasSize] = useState(600);
	const navigate = useNavigate();
	const backendUrl = "https://gomoku-3tty.onrender.com";

	useEffect(() => {
		const updateCanvasSize = () => {
			const screenWidth = window.innerWidth;
			const screenHeight = window.innerHeight;
			const size = Math.min(screenWidth, screenHeight) * (screenWidth < 768 ? 1 : 0.8);
			setCanvasSize(size);
		};

		updateCanvasSize();
		window.addEventListener('resize', updateCanvasSize);
		return () => window.removeEventListener('resize', updateCanvasSize);
	}, []);

	useEffect(() => {
		if (gameData) {
			setBoard(gameData.board);
			setCurrentTurn(gameData.current_turn === 'X' ? 'black' : 'white');
			setWinner(gameData.winner ? (gameData.winner === 'X' ? 'black' : 'white') : null);
			setMoveHistory(gameData.move_history);
		}
	}, [gameData]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) {
				const cellSize = canvasSize / (boardSize + 1);

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
								ctx.arc((x + 1) * cellSize, (y + 1) * cellSize, cellSize / 2, 0, 2 * Math.PI);
								ctx.fillStyle = cell === 'X' ? 'black' : 'white';
								ctx.fill();
								ctx.stroke();

								const moveIndex = moveHistory.findIndex(move => move.x === x && move.y === y);
								if (moveIndex !== -1) {
									ctx.fillStyle = cell === 'X' ? 'white' : 'black';
									ctx.font = `${cellSize / 2.5}px Arial`;
									ctx.textAlign = 'center';
									ctx.textBaseline = 'middle';
									ctx.fillText((moveIndex + 1).toString(), (x + 1) * cellSize, (y + 1) * cellSize);
								}
							}
						});
					});
				};

				const drawHoverPiece = () => {
					if (hoveredCell && !winner) {
						ctx.beginPath();
						ctx.arc(
							(hoveredCell.x + 1) * cellSize,
							(hoveredCell.y + 1) * cellSize,
							cellSize / 2,
							0,
							2 * Math.PI
						);
						if (board[hoveredCell.y][hoveredCell.x] === '' && currentTurn === playerColor) {
							ctx.fillStyle = currentTurn === 'black' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)';
						} else {
							ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
							ctx.strokeStyle = 'red';
						}
						ctx.fill();
						ctx.stroke();
					}
				};

				drawBoard();
				drawPieces();
				drawHoverPiece();
			}
		}
	}, [board, boardSize, hoveredCell, currentTurn, winner, moveHistory, canvasSize]);

	const handleCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (winner || currentTurn !== playerColor) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const cellSize = canvasSize / (boardSize + 1);
		const col = Math.floor(x / cellSize) - 1;
		const row = Math.floor(y / cellSize) - 1;

		if (col >= 0 && col < boardSize && row >= 0 && row < boardSize && board[row][col] === '') {
			const newBoard = board.map((r, rowIndex) =>
				r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? (currentTurn === 'black' ? 'X' : 'O') : cell))
			);
			const newMoveHistory = [...moveHistory, { x: col, y: row, player: currentTurn }];

			try {
				const response = await axios.post(`${backendUrl}/api/games/${gameId}/move/`, {
					move: { x: col, y: row, player: currentTurn === 'black' ? 'X' : 'O' }
				});
				
				if (response.status === 200) {
					setBoard(newBoard);
					setMoveHistory(newMoveHistory);
					if (checkWinner(newBoard, currentTurn, row, col)) {
						setWinner(currentTurn);
					} else {
						setCurrentTurn(currentTurn === 'black' ? 'white' : 'black');
					}
				} else {
					console.error('Move not accepted by server:', response.data);
				}
			} catch (error) {
				console.error('Error making move:', error);
			}
		}
	};

	const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		const cellSize = canvasSize / (boardSize + 1);
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

	const handleQuit = () => {
		navigate('/');
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-screen">
			<h2 className="text-2xl font-bold mb-4">
				{`You're ${playerColor.charAt(0).toUpperCase() + playerColor.slice(1)}`}
			</h2>
			<h2 className="text-2xl font-bold mb-4">
				{currentTurn === 'black' ? "Black" : "White"}'s Turn
			</h2>
			<canvas
				ref={canvasRef}
				width={canvasSize}
				height={canvasSize}
				onClick={handleCanvasClick}
				onMouseMove={handleMouseMove}
				onMouseOut={handleMouseOut}
				className="border border-black shadow-md"
			></canvas>
			{winner && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white p-8 rounded shadow-md text-center">
						<p className="text-xl font-semibold mb-4">{winner.toUpperCase()} wins!</p>
						<button
							onClick={handleQuit}
							className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
						>
							Quit
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Board;

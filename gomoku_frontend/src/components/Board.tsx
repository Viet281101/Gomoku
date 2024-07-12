import React, { useEffect, useRef } from 'react';

interface BoardProps {
	boardSize: number;
}

const Board: React.FC<BoardProps> = ({ boardSize }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

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

			const drawPiece = (x: number, y: number, color: 'black' | 'white') => {
			ctx.beginPath();
			ctx.arc(
				(x + 1) * cellSize,
				(y + 1) * cellSize,
				cellSize / 3,
				0,
				2 * Math.PI
			);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.stroke();
			};

			drawBoard();
			drawPiece(7, 7, 'black');
			drawPiece(8, 8, 'white');
		}
		}
	}, [boardSize]);

	return <canvas ref={canvasRef} width={600} height={600}></canvas>;
};

export default Board;

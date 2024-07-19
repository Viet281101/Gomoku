import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomPlay: React.FC = () => {
	const [boardSize, setBoardSize] = useState(15);
	const [player1, setPlayer1] = useState('Human');
	const [player2, setPlayer2] = useState('Human');
	const navigate = useNavigate();

	const handleBack = () => { navigate('/'); };
	const handlePlay = () => {
		navigate('/custom/game', { state: { boardSize, player1, player2 } });
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<h1 className="text-4xl font-bold mb-8">Custom Play</h1>
			<div className="mb-4 w-full max-w-md">
				<label className="block text-lg font-medium text-gray-700 mb-2">Board Size:</label>
				<select
					value={boardSize}
					onChange={(e) => setBoardSize(parseInt(e.target.value))}
					className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					<option value={15}>15x15</option>
					<option value={20}>20x20</option>
				</select>
			</div>
			<div className="mb-4 w-full max-w-md">
				<label className="block text-lg font-medium text-gray-700 mb-2">Player 1:</label>
				<select
					value={player1}
					onChange={(e) => setPlayer1(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					<option value="Human">Human</option>
					<option value="Minimax">Minimax</option>
					<option value="Minimax Alphabeta">Minimax Alphabeta</option>
					<option value="Monte Carlo Tree Search">Monte Carlo Tree Search</option>
				</select>
			</div>
			<div className="mb-8 w-full max-w-md">
				<label className="block text-lg font-medium text-gray-700 mb-2">Player 2:</label>
				<select
					value={player2}
					onChange={(e) => setPlayer2(e.target.value)}
					className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				>
					<option value="Human">Human</option>
					<option value="Minimax">Minimax</option>
					<option value="Minimax Alphabeta">Minimax Alphabeta</option>
					<option value="Monte Carlo Tree Search">Monte Carlo Tree Search</option>
				</select>
			</div>
			<div className="flex space-x-4">
				<button
					onClick={handlePlay}
					className="px-6 py-3 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
				>
					PLAY
				</button>
				<button
					onClick={handleBack}
					className="px-6 py-3 text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
				>
					Back
				</button>
			</div>
		</div>
	);
};

export default CustomPlay;

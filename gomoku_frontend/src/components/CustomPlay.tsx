import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomPlay: React.FC = () => {
	const [boardSize, setBoardSize] = useState(15);
	const [player1, setPlayer1] = useState('Human');
	const [player2, setPlayer2] = useState('Human');
	const navigate = useNavigate();

	const handlePlay = async () => {
		const response = await axios.post('/api/games/', {
			player_X: 'X',
			player_O: 'O',
			board: Array(boardSize).fill(null).map(() => Array(boardSize).fill(''))
		});

		const gameId = response.data.id;
		navigate('/custom/game', { state: { boardSize, player1, player2, gameId } });
	};

	return (
		<div>
			<h1>Custom Play</h1>
			<div>
				<label>
					Board Size:
					<select value={boardSize} onChange={(e) => setBoardSize(parseInt(e.target.value))}>
						<option value={15}>15x15</option>
						<option value={20}>20x20</option>
					</select>
				</label>
			</div>
			<div>
				<label>
					Player 1:
					<select value={player1} onChange={(e) => setPlayer1(e.target.value)}>
						<option value="Human">Human</option>
						<option value="Minimax">Minimax</option>
						<option value="Minimax Alphabeta">Minimax Alphabeta</option>
						<option value="Monte Carlo Tree Search">Monte Carlo Tree Search</option>
					</select>
				</label>
			</div>
			<div>
				<label>
					Player 2:
					<select value={player2} onChange={(e) => setPlayer2(e.target.value)}>
						<option value="Human">Human</option>
						<option value="Minimax">Minimax</option>
						<option value="Minimax Alphabeta">Minimax Alphabeta</option>
						<option value="Monte Carlo Tree Search">Monte Carlo Tree Search</option>
					</select>
				</label>
			</div>
			<button onClick={handlePlay}>PLAY</button>
		</div>
	);
};

export default CustomPlay;

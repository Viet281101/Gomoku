import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OnlinePlay: React.FC = () => {
	const [selectedColor, setSelectedColor] = useState('black');
	const navigate = useNavigate();

	const handlePlay = async () => {
		try {
			const response = await axios.post('/api/games/', {
				player_X: 1,
				player_O: 2,
				board_size: 15
			});

			const gameId = response.data.id;
			navigate('/online/game', { state: { boardSize: 15, player1: selectedColor, player2: 'Other Player', gameId } });
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div>
			<h1>Online Play</h1>
			<div>
				<label>
					Choose your color:
					<select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
						<option value="black">Black</option>
						<option value="white">White</option>
					</select>
				</label>
			</div>
			<button onClick={handlePlay}>PLAY</button>
		</div>
	);
};

export default OnlinePlay;

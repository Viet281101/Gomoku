import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OnlinePlay: React.FC = () => {
	const [selectedColor, setSelectedColor] = useState('black');
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const currentUserId = 3;

	const handlePlay = async () => {
		setSearching(true);
		setError(null);
		try {
			const response = await axios.post('/api/games/find_or_create/', {
				player: currentUserId
			});

			const gameId = response.data.id;
			navigate('/online/game', { state: { boardSize: 15, player1: selectedColor, player2: 'Other Player', gameId } });
		} catch (error: any) {
			console.error(error);
			setError(error.response?.data?.error || 'An unexpected error occurred');
			setSearching(false);
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
			{searching ? <p>Searching for opponents ...</p> : <button onClick={handlePlay}>PLAY</button>}
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
};

export default OnlinePlay;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OnlinePlay: React.FC = () => {
	const [selectedColor, setSelectedColor] = useState('black');
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const currentUserId = 3;

	const handleBack = () => { navigate('/'); };
	const handlePlay = async () => {
		setSearching(true);
		setError(null);
		try {
			const response = await axios.post('/api/games/find_or_create/', {
				player: currentUserId
			});

			const gameId = response.data.game.id;
			const playerColor = response.data.player_color;
			checkGameStatus(gameId, playerColor);
		} catch (error: any) {
			console.error(error);
			setError(error.response?.data?.error || 'An unexpected error occurred');
			setSearching(false);
		}
	};

	const checkGameStatus = async (gameId: number, playerColor: string) => {
		try {
			const response = await axios.get(`/api/games/${gameId}/check_status/`);
			if (response.data.status === 'ready') {
				navigate('/online/game', { state: { boardSize: 15, playerColor, gameId } });
			} else {
				setTimeout(() => checkGameStatus(gameId, playerColor), 2000);
			}
		} catch (error: any) {
			console.error(error);
			setError('An unexpected error occurred');
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
			{searching ? <p>Searching for opponents ...</p> : (
				<div>
					<button onClick={handlePlay}>PLAY</button>
					<button onClick={handleBack}>Back</button>
				</div>
			)}
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</div>
	);
};

export default OnlinePlay;

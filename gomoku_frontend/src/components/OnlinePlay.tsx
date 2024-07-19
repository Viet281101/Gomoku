import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OnlinePlay: React.FC = () => {
	const [selectedColor, setSelectedColor] = useState('black');
	const [searching, setSearching] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	const currentUserId = 3;
	const backendUrl = "https://gomoku-3tty.onrender.com";

	const handleBack = () => { navigate('/'); };
	const handlePlay = async () => {
		setSearching(true);
		setError(null);
		try {
			const response = await axios.post(`${backendUrl}/api/games/find_or_create/`, {
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
			const response = await axios.get(`${backendUrl}/api/games/${gameId}/check_status/`);
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
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<h1 className="text-4xl font-bold mb-8">Online Play</h1>
			<div className="mb-6">
				<label className="block mb-4 text-lg font-medium text-gray-700">
					Choose your player color:
					<select
						value={selectedColor}
						onChange={(e) => setSelectedColor(e.target.value)}
						className="mt-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					>
						<option value="black">Black</option>
						<option value="white">White</option>
					</select>
				</label>
			</div>
			{searching ? (
				<p className="text-lg text-gray-700">Searching for opponents ...</p>
			) : (
				<div className="flex space-x-4">
					<button
						onClick={handlePlay}
						className="px-6 py-2 text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
					>
						PLAY
					</button>
					<button
						onClick={handleBack}
						className="px-6 py-2 text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
					>
						Back
					</button>
				</div>
			)}
			{error && <p className="mt-4 text-red-500">{error}</p>}
		</div>
	);
};

export default OnlinePlay;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Board from './Board';
import axios from 'axios';

const Game: React.FC = () => {
	const location = useLocation();
	const { boardSize, playerColor, gameId } = location.state as { boardSize: number; playerColor: 'black' | 'white'; gameId: number };
	const [gameData, setGameData] = useState(null);

	useEffect(() => {
		const fetchGameData = async () => {
			const response = await axios.get(`/api/games/${gameId}/`);
			setGameData(response.data);
		};

		fetchGameData();
		const intervalId = setInterval(fetchGameData, 2000);

		return () => clearInterval(intervalId);
	}, [gameId]);

	return (
		<div>
			<Board boardSize={boardSize} playerColor={playerColor} gameId={gameId} gameData={gameData} />
		</div>
	);
};

export default Game;

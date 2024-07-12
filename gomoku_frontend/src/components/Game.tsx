import React from 'react';
import { useLocation } from 'react-router-dom';
import Board from './Board';

const Game: React.FC = () => {
	const location = useLocation();
	const { boardSize, player1, player2 } = location.state as { boardSize: number; player1: string; player2: string };

	return (
		<div>
			<Board boardSize={boardSize} player1={player1} player2={player2} />
		</div>
	);
};

export default Game;

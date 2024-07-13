import React from 'react';
import { useLocation } from 'react-router-dom';
import Board from './Board';

const Game: React.FC = () => {
	const location = useLocation();
	const { boardSize, player1, player2, gameId } = location.state as { boardSize: number; player1: string; player2: string; gameId: number };

	return (
		<div>
			<Board boardSize={boardSize} player1={player1} player2={player2} gameId={gameId} />
		</div>
	);
};

export default Game;

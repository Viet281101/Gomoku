import React from 'react';
import { useLocation } from 'react-router-dom';
import Board from './Board';

const Game: React.FC = () => {
	const location = useLocation();

	const { boardSize } = location.state as { boardSize: number };

	return (
		<div><Board boardSize={boardSize} /></div>
	);
};

export default Game;

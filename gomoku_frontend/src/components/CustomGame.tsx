import React from 'react';
import { useLocation } from 'react-router-dom';
import CustomBoard from './CustomBoard';

const CustomGame: React.FC = () => {
	const location = useLocation();
	const { boardSize } = location.state as { boardSize: number };

	return (
		<div>
			<CustomBoard boardSize={boardSize} />
		</div>
	);
};

export default CustomGame;

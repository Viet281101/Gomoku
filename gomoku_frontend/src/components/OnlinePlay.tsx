import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OnlinePlay: React.FC = () => {
	const [selectedColor, setSelectedColor] = useState('black');
	const navigate = useNavigate();

	const handlePlay = () => {
		navigate('/game', { state: { boardSize: 15, player1: selectedColor, player2: 'Human Online' } });
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

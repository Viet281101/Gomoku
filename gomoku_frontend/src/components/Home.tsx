import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
	const navigate = useNavigate();

	const goToOnlinePlay = () => {
		navigate('/online');
	};

	const goToCustomPlay = () => {
		navigate('/custom');
	};

	return (
		<div>
		<h1>HOME</h1>
		<button onClick={goToOnlinePlay}>Online Play</button>
		<button onClick={goToCustomPlay}>Custom Play</button>
		</div>
	);
};

export default Home;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const goToOnlinePlay = () => { navigate('/online'); };
	const goToCustomPlay = () => { navigate('/custom'); };
	const handleQuit = () => { window.close(); };

	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
			<h1>HOME</h1>
			<button onClick={goToOnlinePlay} style={{ margin: '10px' }}>Online Play</button>
			<button onClick={goToCustomPlay} style={{ margin: '10px' }}>Custom Play</button>
			<button onClick={handleQuit} style={{ margin: '10px' }}>Quit</button>
		</div>
	);
};

export default Home;

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import OnlinePlay from './components/OnlinePlay';
import CustomPlay from './components/CustomPlay';
import Game from './components/Game';
import CustomGame from './components/CustomGame';
import { Toolbar } from './Toolbar';

const AppWithToolbar: React.FC = () => {
	const navigate = useNavigate();

	useEffect(() => {
		const toolbar = new Toolbar(navigate);
		window.addEventListener('resize', () => toolbar.resizeToolbar());
		return () => window.removeEventListener('resize', () => toolbar.resizeToolbar());
	}, [navigate]);

	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/online" element={<OnlinePlay />} />
			<Route path="/custom" element={<CustomPlay />} />
			<Route path="/online/game" element={<Game />} />
			<Route path="/custom/game" element={<CustomGame />} />
		</Routes>
	);
};

const App: React.FC = () => {
	return (
		<Router>
			<AppWithToolbar />
		</Router>
	);
};

export default App;

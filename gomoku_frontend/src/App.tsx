import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import OnlinePlay from './components/OnlinePlay';
import CustomPlay from './components/CustomPlay';
import Game from './components/Game';
import CustomGame from './components/CustomGame';
import Toolbar from './Toolbar';

const App: React.FC = () => {
	return (
		<Router>
			<div id="app-container">
			<Toolbar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/online" element={<OnlinePlay />} />
				<Route path="/custom" element={<CustomPlay />} />
				<Route path="/online/game" element={<Game />} />
				<Route path="/custom/game" element={<CustomGame />} />
			</Routes>
			</div>
			<div id="popup-root"></div>
		</Router>
	);
};

export default App;

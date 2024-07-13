import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import OnlinePlay from './components/OnlinePlay';
import CustomPlay from './components/CustomPlay';
import Game from './components/Game';
import CustomGame from './components/CustomGame';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/online" element={<OnlinePlay />} />
				<Route path="/custom" element={<CustomPlay />} />
				<Route path="/online/game" element={<Game />} />
				<Route path="/custom/game" element={<CustomGame />} />
			</Routes>
		</Router>
	);
};

export default App;

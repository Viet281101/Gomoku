import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import OnlinePlay from './components/OnlinePlay';
import CustomPlay from './components/CustomPlay';
import Game from './components/Game';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/online" element={<OnlinePlay />} />
				<Route path="/custom" element={<CustomPlay />} />
				<Route path="/online/game" element={<Game />} />
				<Route path="/custom/game" element={<Game />} />
			</Routes>
		</Router>
	);
};

export default App;

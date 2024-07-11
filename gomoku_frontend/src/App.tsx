import React from 'react';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
	return (
		<div className="app">
		<h1>Gomoku</h1>
		<Link to="/game">Start Game</Link>
		</div>
	);
};

export default App;

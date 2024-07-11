import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import Game from './components/Game';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Router>
		<Routes>
			<Route path="/" element={<App />} />
			<Route path="/game" element={<Game />} />
		</Routes>
		</Router>
	</React.StrictMode>,
);


import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const goToOnlinePlay = () => { navigate('/online'); };
	const goToCustomPlay = () => { navigate('/custom'); };
	const handleQuit = () => {
		if (window.confirm('To close the tab, please use the close button on your browser.')) {
			window.close();
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<h1 className="text-6xl font-bold mb-12">GOMOKU</h1>
			<button
				onClick={goToOnlinePlay}
				className="px-6 py-3 mb-12 text-2xl text-white bg-indigo-600 rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
			>
				Online Play
			</button>
			<button
				onClick={goToCustomPlay}
				className="px-6 py-3 mb-12 text-2xl text-white bg-green-600 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
			>
				Custom Play
			</button>
			<button
				onClick={handleQuit}
				className="px-6 py-3 text-2xl text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
			>
				Quit
			</button>
		</div>
	);
};

export default Home;

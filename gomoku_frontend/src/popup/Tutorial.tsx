import React from 'react';
import ReactDOM from 'react-dom';

export const showTutorialPopup = () => {
	const popup = (
		<div id="tutorialPopup" style={popupStyle}>
		<h3 style={titleStyle}>Tutorial</h3>
		<canvas width={370} height={4000} style={canvasStyle}></canvas>
		</div>
	);

	ReactDOM.render(popup, document.getElementById('popup-root'));
};

const popupStyle: React.CSSProperties = {
	position: 'absolute',
	top: '50px',
	left: '50%',
	transform: 'translateX(-50%)',
	width: '370px',
	height: '100%',
	border: '3px solid #000',
	backgroundColor: '#a0a0a0',
	overflowY: 'auto',
	zIndex: 1000
};

const titleStyle: React.CSSProperties = {
	position: 'absolute',
	top: '-10px',
	left: '50%',
	transform: 'translateX(-50%)',
	zIndex: 1001,
	fontSize: '22px',
	color: '#00ffaa',
	backgroundColor: 'rgba(0, 0, 0, 0)'
};

const canvasStyle: React.CSSProperties = {
	display: 'block',
	margin: '0 auto'
};

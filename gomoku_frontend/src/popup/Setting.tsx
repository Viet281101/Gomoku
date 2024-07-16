import ReactDOM from 'react-dom/client';

export function showSettingsPopup() {
	const popupContainer = document.createElement('div');
	popupContainer.id = 'settingsPopup';
	popupContainer.style.position = 'fixed';
	popupContainer.style.top = '50%';
	popupContainer.style.left = '50%';
	popupContainer.style.transform = 'translate(-50%, -50%)';
	popupContainer.style.width = '300px';
	popupContainer.style.padding = '20px';
	popupContainer.style.backgroundColor = 'white';
	popupContainer.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.1)';
	popupContainer.style.zIndex = '1000';
	document.body.appendChild(popupContainer);

	const closePopup = () => {
		document.body.removeChild(popupContainer);
	};

	const root = ReactDOM.createRoot(popupContainer);
	root.render(
		<div>
			<h2>Settings</h2>
			<p>Here are the settings.</p>
			<button onClick={closePopup}>Close</button>
		</div>
	);
}

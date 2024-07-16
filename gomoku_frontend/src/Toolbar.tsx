import React, { useEffect, useRef } from 'react';
import { showSettingsPopup } from './popup/Setting';
import { showTutorialPopup } from './popup/Tutorial';

const Toolbar: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const isMobile = window.innerWidth <= 800;

	const buttons = [
		{ name: 'Tutorial', icon: '/icons/question.png', action: () => togglePopup('tutorial') },
		{ name: 'Settings', icon: '/icons/setting.png', action: () => togglePopup('settings') }
	];

	const drawToolbar = (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = '#333';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		if (isMobile) {
		drawToolbarVertical(ctx);
		} else {
		drawToolbarHorizontal(ctx);
		}
	};

	const drawToolbarVertical = (ctx: CanvasRenderingContext2D) => {
		let startX = (ctx.canvas.width - buttons.length * 60) / 2;
		buttons.forEach(button => {
		const img = new Image();
		img.src = button.icon;
		img.onload = () => {
			ctx.drawImage(img, startX - 2, 8, 36, 36);
			ctx.strokeStyle = '#fff';
			ctx.strokeRect(startX - 5, 5, 42, 42);
			startX += 60;
		};
		});
	};

	const drawToolbarHorizontal = (ctx: CanvasRenderingContext2D) => {
		let startY = (ctx.canvas.height - buttons.length * 60) / 2;
		buttons.forEach(button => {
		const img = new Image();
		img.src = button.icon;
		img.onload = () => {
			ctx.drawImage(img, 8, startY - 2, 36, 36);
			ctx.strokeStyle = '#fff';
			ctx.strokeRect(5, startY - 5, 42, 42);
			startY += 60;
		};
		});
	};

	const togglePopup = (type: string) => {
		switch (type) {
		case 'tutorial':
			showTutorialPopup();
			break;
		case 'settings':
			showSettingsPopup();
			break;
		}
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
		const ctx = canvas.getContext('2d');
		if (ctx) {
			drawToolbar(ctx);
		}
		}
	}, [canvasRef]);

	return (
		<canvas
		ref={canvasRef}
		width={isMobile ? window.innerWidth : 50}
		height={isMobile ? 50 : window.innerHeight}
		style={{
			position: 'absolute',
			left: 0,
			top: 0,
			zIndex: 999
		}}
		/>
	);
};

export default Toolbar;

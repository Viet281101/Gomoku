import React, { useEffect, useRef } from 'react';
import { showSettingsPopup } from './popup/Setting';
import { showTutorialPopup } from './popup/Tutorial';

const Toolbar: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const isMobile = window.innerWidth <= 800;

	const buttons = [
		{ name: 'Tutorial', icon: '/icons/question.png', action: () => togglePopup('tutorial'), x: 0, y: 0, width: 0, height: 0 },
		{ name: 'Settings', icon: '/icons/setting.png', action: () => togglePopup('settings'), x: 0, y: 0, width: 0, height: 0 }
	];

	const drawToolbar = (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = '#333';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		if (isMobile) { drawToolbarVertical(ctx); }
		else { drawToolbarHorizontal(ctx); }
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
				button.x = startX - 5;
				button.y = 5;
				button.width = 42;
				button.height = 42;
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
				button.x = 5;
				button.y = startY - 5;
				button.width = 42;
				button.height = 42;
				startY += 60;
			};
		});
	};

	const togglePopup = (type: string) => {
		switch (type) {
			case 'tutorial': showTutorialPopup(); break;
			case 'settings': showSettingsPopup(); break;
		}
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext('2d');
			if (ctx) { drawToolbar(ctx); }

			const handleResize = () => {
				canvas.width = window.innerWidth <= 800 ? window.innerWidth : 50;
				canvas.height = window.innerWidth <= 800 ? 50 : window.innerHeight;
				if (ctx) { drawToolbar(ctx); }
			};

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);
			};
		}
	}, [canvasRef, isMobile]);

	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		const rect = canvasRef.current?.getBoundingClientRect();
		const mouseX = 'clientX' in e ? e.clientX - (rect?.left || 0) : e.touches[0].clientX - (rect?.left || 0);
		const mouseY = 'clientY' in e ? e.clientY - (rect?.top || 0) : e.touches[0].clientY - (rect?.top || 0);

		buttons.forEach(button => {
			if (isInside(mouseX, mouseY, button)) {
				button.action();
			}
		});
	};

	const isInside = (x: number, y: number, rect: { x: number; y: number; width: number; height: number }): boolean => {
		return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
	};

	return (
		<canvas
			ref={canvasRef}
			width={isMobile ? window.innerWidth : 50}
			height={isMobile ? 50 : window.innerHeight}
			style={{ position: 'absolute', left: 0, top: 0, zIndex: 999 }}
			onClick={handleCanvasClick}
			onTouchStart={handleCanvasClick}
		/>
	);
};

export default Toolbar;

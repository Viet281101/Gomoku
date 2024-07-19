import { showSettingsPopup } from './popup/Setting';
import { showTutorialPopup } from './popup/Tutorial';

export class Toolbar {
	private canvas!: HTMLCanvasElement;
	private ctx!: CanvasRenderingContext2D;
	private isMobile: boolean;
	private buttons: { name: string, icon: string, action: () => void, x: number, y: number, width: number, height: number, description: string }[];
	private popupOpen: boolean;
	private currentPopup: HTMLElement | null;
	private currentCloseIcon: HTMLImageElement | null;
	private homeButtonRect!: { x: number, y: number, width: number, height: number };
	private tooltip: HTMLDivElement;
	private navigate: (path: string) => void;

	constructor(navigate: (path: string) => void) {
		this.navigate = navigate;
		this.isMobile = this.checkIfMobile();
		this.setupCanvas();
		this.buttons = this.createButtons();
		this.popupOpen = false;
		this.currentPopup = null;
		this.currentCloseIcon = null;
		this.tooltip = this.createTooltip();
		this.drawToolbar();
		this.addEventListeners();
		this.addHomeButton();
		this.homeButtonRect = this.isMobile ? { x: 10, y: 10, width: 40, height: 40 } : { x: 10, y: 10, width: 40, height: 40 };
	}

	private checkIfMobile(): boolean {
		return window.innerWidth <= 800;
	}

	private setupCanvas() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.canvas.width = this.isMobile ? window.innerWidth : 50;
		this.canvas.height = this.isMobile ? 50 : window.innerHeight;
		this.canvas.style.position = 'absolute';
		this.canvas.style.left = this.canvas.style.top = '0';
		this.canvas.style.zIndex = '999';
		document.body.appendChild(this.canvas);
	}

	private createButtons() {
		const baseIconPath = import.meta.env.BASE_URL + 'icons/';
		return [
			{ name: 'Tutorial', icon: baseIconPath + 'question.png', action: () => this.togglePopup('tutorial'), x: 0, y: 0, width: 0, height: 0, description: 'See How to Play & Rules' },
			{ name: 'Settings', icon: baseIconPath + 'setting.png', action: () => this.togglePopup('settings'), x: 0, y: 0, width: 0, height: 0, description: 'Open Settings' },
		];
	}

	private createTooltip() {
		const tooltip = document.createElement('div');
		tooltip.style.position = 'absolute';
		tooltip.style.backgroundColor = '#fff';
		tooltip.style.border = '1px solid #000';
		tooltip.style.padding = '5px';
		tooltip.style.display = 'none';
		tooltip.style.whiteSpace = 'pre';
		tooltip.style.zIndex = '1001';
		document.body.appendChild(tooltip);
		return tooltip;
	}

	private drawToolbar() {
		this.ctx.fillStyle = '#333';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.isMobile ? this.drawToolbarVertical() : this.drawToolbarHorizontal();
	}

	private drawToolbarVertical() {
		const totalWidth = this.buttons.length * 60;
		let startX = (this.canvas.width - totalWidth) / 2;

		this.buttons.forEach(button => {
			const img = new Image();
			img.src = button.icon;
			img.onload = () => {
				this.ctx.drawImage(img, startX - 2, 8, 36, 36);
				this.ctx.strokeStyle = '#fff';
				this.ctx.strokeRect(startX - 5, 5, 42, 42);
				button.x = startX - 5;
				button.y = 5;
				button.width = 42;
				button.height = 42;
				startX += 60;
			};
		});
	}

	private drawToolbarHorizontal() {
		const totalHeight = this.buttons.length * 60;
		let startY = (this.canvas.height - totalHeight) / 2;

		this.buttons.forEach(button => {
			const img = new Image();
			img.src = button.icon;
			img.onload = () => {
				this.ctx.drawImage(img, 8, startY - 2, 36, 36);
				this.ctx.strokeStyle = '#fff';
				this.ctx.strokeRect(5, startY - 5, 42, 42);
				button.x = 5;
				button.y = startY - 5;
				button.width = 42;
				button.height = 42;
				startY += 60;
			};
		});
	}

	private addEventListeners() {
		this.canvas.addEventListener('mousemove', (e) => {
			let cursor = 'default';
			let foundButton: { name: string, description: string } | null = null;
			this.buttons.forEach(button => {
				if (this.isInside(e.clientX, e.clientY, button)) { cursor = 'pointer'; foundButton = button; }
			});
			if (this.isInside(e.clientX, e.clientY, this.homeButtonRect)) {
				cursor = 'pointer'; foundButton = { name: 'Home', description: 'Return to Home' };
			}
			this.canvas.style.cursor = cursor;
			if (foundButton && !this.isMobile) {
				this.tooltip.innerHTML = `${foundButton.name}\n\n${foundButton.description}`;
				this.tooltip.style.left = `${e.clientX + 10}px`;
				this.tooltip.style.top = `${e.clientY + 10}px`;
				this.tooltip.style.display = 'block';
			} else { this.tooltip.style.display = 'none'; }
		});
		this.canvas.addEventListener('mouseleave', () => { this.tooltip.style.display = 'none'; });
		this.canvas.addEventListener('mousedown', (e) => this.handleCanvasClick(e));
		this.canvas.addEventListener('touchstart', (e) => this.handleCanvasClick(e));
		document.addEventListener('click', (e) => this.handleDocumentClick(e));
		document.addEventListener('touchstart', (e) => this.handleDocumentClick(e));
	}

	private handleCanvasClick(e: MouseEvent | TouchEvent) {
		const mouseX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
		const mouseY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
		this.buttons.forEach(button => {
			if (this.isInside(mouseX, mouseY, button)) { button.action(); }
		});
		if (this.isInside(mouseX, mouseY, this.homeButtonRect)) { this.navigate('/'); }
	}

	private handleDocumentClick(e: MouseEvent | TouchEvent) {
		if (this.popupOpen) {
			const popups = ['tutorialPopup', 'settingsPopup'];
			popups.forEach(popupId => {
				const popup = document.getElementById(popupId);
				if (popup && !popup.contains(e.target as Node) && !this.canvas.contains(e.target as Node)) {
					this.closeCurrentPopup();
				}
			});
		}
	}

	public resizeToolbar() {
		this.updateToolbarLayout();
		this.canvas.width = this.isMobile ? window.innerWidth : 50;
		this.canvas.height = this.isMobile ? 50 : window.innerHeight;
		this.drawToolbar();
		this.addHomeButton();
		this.addEventListeners();
	}

	private updateToolbarLayout() {
		const wasMobile = this.isMobile;
		this.isMobile = this.checkIfMobile();
		if (wasMobile !== this.isMobile) {
			this.removeCanvas();
			this.setupCanvas();
			this.drawToolbar();
			this.addHomeButton();
			this.addEventListeners();
		}
	}

	private removeCanvas() {
		if (this.canvas && this.canvas.parentNode) {
			this.canvas.parentNode.removeChild(this.canvas);
		}
	}

	private isInside(x: number, y: number, rect: { x: number; y: number; width: number; height: number; }): boolean {
		return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height;
	}

	private addHomeButton() {
		const baseIconPath = import.meta.env.BASE_URL + 'icons/';
		const img = new Image();
		img.src = baseIconPath + 'home.png';
		img.onload = () => {
			this.ctx.drawImage(img, 8, 8, 36, 36);
			this.ctx.strokeStyle = '#fff';
			this.ctx.strokeRect(5, 5, 42, 42);
		};
	}

	private togglePopup(type: string) {
		if (this.currentPopup && this.currentPopup.id === `${type}Popup`) {
			this.closePopup(type);
		} else {
			this.closeCurrentPopup();
			this.showPopup(type);
		}
	}

	private showPopup(type: string) {
		this.popupOpen = true;
		switch (type) {
			case 'tutorial': showTutorialPopup(this); break;
			case 'settings': showSettingsPopup(this); break;
		}
	}

	public createPopupContainer(id: string, title: string) {
		const popupContainer = document.createElement('div');
		popupContainer.id = id;
		popupContainer.style.position = 'absolute';
		popupContainer.style.top = this.isMobile ? '50px' : '0';
		popupContainer.style.left = this.isMobile ? '50%' : '234px';
		popupContainer.style.transform = 'translateX(-50%)';
		popupContainer.style.width = '370px';
		popupContainer.style.height = '100%';
		popupContainer.style.border = '3px solid #000';
		popupContainer.style.backgroundColor = '#a0a0a0';
		popupContainer.style.overflowY = 'auto';
		popupContainer.style.zIndex = '1000';
		document.body.appendChild(popupContainer);

		const popup = document.createElement('canvas');
		popup.width = 370;
		popup.height = 4000;
		popupContainer.appendChild(popup);

		const titleElement = document.createElement('h3');
		titleElement.style.position = 'absolute';
		titleElement.style.top = '2px';
		titleElement.style.left = '50%';
		titleElement.style.transform = 'translateX(-50%)';
		titleElement.style.zIndex = '1001';
		titleElement.style.fontSize = '22px';
		titleElement.style.color = '#00ffaa';
		titleElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
		titleElement.textContent = title;
		popupContainer.appendChild(titleElement);

		this.addCloseIcon();
		this.currentPopup = popupContainer;
		return popupContainer;
	}

	private addCloseIcon() {
		if (this.currentCloseIcon) { document.body.removeChild(this.currentCloseIcon); }
		const baseIconPath = import.meta.env.BASE_URL + 'icons/';
		const closeIcon = new Image();
		closeIcon.src = baseIconPath + 'close.png';
		closeIcon.style.position = 'fixed';
		closeIcon.style.top = this.isMobile ? '56px' : '10px';
		closeIcon.style.left = this.isMobile ? 'calc(50% + 162px)' : '400px';
		closeIcon.style.cursor = 'pointer';
		closeIcon.style.zIndex = '1001';
		closeIcon.style.transform = 'translateX(-50%)';
		closeIcon.style.backgroundColor = 'rgba(0, 0, 0, 0)';
		closeIcon.addEventListener('click', () => this.closeCurrentPopup());
		document.body.appendChild(closeIcon);
		this.currentCloseIcon = closeIcon;
	}

	public closePopup(type: string) {
		const popup = document.getElementById(`${type}Popup`);
		if (popup && popup.parentNode) {
			popup.parentNode.removeChild(popup);
		}
		if (this.currentCloseIcon && this.currentCloseIcon.parentNode) {
			this.currentCloseIcon.parentNode.removeChild(this.currentCloseIcon);
			this.currentCloseIcon = null;
		}
		const inputs = document.querySelectorAll('.popup-input');
		inputs.forEach(input => input.parentElement?.removeChild(input));
		this.popupOpen = false;
		this.currentPopup = null;
	}

	private closeCurrentPopup() {
		if (this.currentPopup && this.currentPopup.parentNode) {
			this.currentPopup.parentNode.removeChild(this.currentPopup);
			this.currentPopup = null;
		}
		if (this.currentCloseIcon && this.currentCloseIcon.parentNode) {
			this.currentCloseIcon.parentNode.removeChild(this.currentCloseIcon);
			this.currentCloseIcon = null;
		}
		this.popupOpen = false;
	}
}

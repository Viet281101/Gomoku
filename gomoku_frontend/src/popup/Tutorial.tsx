import { Toolbar } from '../Toolbar';

export function showTutorialPopup(toolbar: Toolbar) {
	const popupContainer = toolbar.createPopupContainer('tutorialPopup', 'How To Play');
	const popup = popupContainer.querySelector('canvas') as HTMLCanvasElement;
	const ctx = popup.getContext('2d');

	if (ctx) {
		ctx.fillStyle = '#a0a0a0';
		ctx.fillRect(0, 0, popup.width, popup.height);

		const text = `
Gomoku (Five in a Row) is a traditional board game that is typically played with black and white stones on a 19x19 grid.
However, it can also be played on smaller grids such as 15x15 or 13x13. The game is also known as Gobang or Five in a Row.

Objective:
The goal of Gomoku is to be the first player to get an unbroken row of five stones horizontally, vertically, or diagonally.

Rules:
1. The game is played by two players. One player uses black stones and the other player uses white stones.
2. Players take turns placing one of their stones on an empty intersection of the board.
3. The black player always goes first.
4. The first player to align five of their stones in a row (horizontally, vertically, or diagonally) wins the game.
5. If the board is filled and neither player has five in a row, the game is a draw.

How to Play:
1. Decide who will be playing with the black stones and who will be playing with the white stones.
2. The player with the black stones places the first stone on any intersection on the board.
3. Players alternate turns, placing one stone per turn.
4. Continue playing until one player gets five stones in a row or the board is full.

Strategies:
- Try to create multiple lines of four stones where you only need one more stone to win.
- Block your opponent's lines of four stones to prevent them from winning.
- Control the center of the board to have more flexibility in creating lines of five.

Enjoy playing Gomoku and have fun!
		`;

		const lines = text.split('\n');
		ctx.font = '16px Pixellari';
		ctx.fillStyle = '#000';
		ctx.textAlign = 'left';
		const maxWidth = popup.width - 20;
		let y = 30;

		const wrapText = (context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
			const words = text.split(' ');
			let line = '';
			for (let n = 0; n < words.length; n++) {
				const testLine = line + words[n] + ' ';
				const metrics = context.measureText(testLine);
				const testWidth = metrics.width;
				if (testWidth > maxWidth && n > 0) {
					context.fillText(line, x, y);
					line = words[n] + ' ';
					y += lineHeight;
				} else {
					line = testLine;
				}
			}
			context.fillText(line, x, y);
			return y + lineHeight;
		};

		lines.forEach((line) => {
			y = wrapText(ctx, line.trim(), 10, y, maxWidth, 20);
		});
	}
}

/**
 * Evaluate the board and return a score.
 * @param {string[][]} board - The game board.
 * @param {string} player - The player to evaluate for ('X' or 'O').
 * @returns {number} - The evaluation score.
 */
function evaluateBoard(board: string[][], player: string): number {
	let score = 0;
	const opponent = player === 'X' ? 'O' : 'X';

	const directions = [
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 },
		{ x: 1, y: -1 }
	];

	const checkDirection = (x: number, y: number, dx: number, dy: number) => {
		let countPlayer = 0;
		let countOpponent = 0;

		for (let i = 0; i < 5; i++) {
			const nx = x + i * dx;
			const ny = y + i * dy;

			if (nx < 0 || ny < 0 || nx >= board.length || ny >= board.length) break;

			if (board[ny][nx] === player) {
				countPlayer++;
			} else if (board[ny][nx] === opponent) {
				countOpponent++;
			}
		}

		if (countPlayer === 5) return 10000;
		if (countOpponent === 5) return -10000;

		if (countPlayer > 0 && countOpponent === 0) score += Math.pow(10, countPlayer);
		if (countOpponent > 0 && countPlayer === 0) score -= Math.pow(10, countOpponent);
	};

	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board.length; x++) {
			if (board[y][x] === player || board[y][x] === opponent) {
				directions.forEach(direction => checkDirection(x, y, direction.x, direction.y));
			}
		}
	}

	return score;
}

/**
 * The Minimax algorithm to find the best move.
 * @param {string[][]} board - The game board.
 * @param {number} depth - The depth of the search.
 * @param {boolean} isMaximizing - Whether the current move is maximizing or minimizing.
 * @param {string} player - The player making the move.
 * @returns {number} - The evaluation score of the board.
 */
export function minimax(board: string[][], depth: number, isMaximizing: boolean, player: string): number {
	const opponent = player === 'X' ? 'O' : 'X';
	const score = evaluateBoard(board, player);

	if (Math.abs(score) === 10000 || depth === 0) return score;

	if (isMaximizing) {
		let maxEval = -Infinity;
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board.length; x++) {
				if (board[y][x] === '') {
					board[y][x] = player;
					const evl = minimax(board, depth - 1, false, player);
					board[y][x] = '';
					maxEval = Math.max(maxEval, evl);
				}
			}
		}
		return maxEval;
	} else {
		let minEval = Infinity;
		for (let y = 0; y < board.length; y++) {
			for (let x = 0; x < board.length; x++) {
				if (board[y][x] === '') {
					board[y][x] = opponent;
					const evl = minimax(board, depth - 1, true, player);
					board[y][x] = '';
					minEval = Math.min(minEval, evl);
				}
			}
		}
		return minEval;
	}
}

/**
 * Find the best move using the Minimax algorithm.
 * @param {string[][]} board - The game board.
 * @param {number} depth - The depth of the search.
 * @param {string} player - The player making the move ('X' or 'O').
 * @param {Function} callback - The callback function to handle the best move.
 */
export function findBestMoveMinimax(board: string[][], depth: number, player: string, callback: (move: { x: number, y: number }) => void): void {
	let bestMove = { x: 0, y: 0 };
	let bestValue = -Infinity;

	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board[y].length; x++) {
			if (board[y][x] === '') {
				board[y][x] = player;
				const moveValue = minimax(board, depth, false, player);
				board[y][x] = '';
				if (moveValue > bestValue) {
					bestMove = { x, y };
					bestValue = moveValue;
				}
			}
		}
	}
	setTimeout(() => callback(bestMove), 0);
}

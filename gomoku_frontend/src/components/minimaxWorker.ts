import { findBestMoveMinimax } from './Minimax';

self.onmessage = (event: MessageEvent) => {
	const { board, depth, player } = event.data;
	const move = findBestMoveMinimax(board, depth, player, (bestMove) => {
		self.postMessage(bestMove);
	});
};

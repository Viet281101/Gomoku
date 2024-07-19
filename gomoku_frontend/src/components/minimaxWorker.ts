import { findBestMoveMinimax } from './Minimax';

self.onmessage = (event: MessageEvent) => {
	const { board, depth, player } = event.data;
	findBestMoveMinimax(board, depth, player, (bestMove) => {
		self.postMessage(bestMove);
	});
};

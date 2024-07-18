import { cloneDeep } from 'lodash';

const simulations = 1000;
const explorationConstant = Math.sqrt(2);

class Node {
	board: string[][];
	player: string;
	parent: Node | null;
	children: Node[];
	wins: number;
	visits: number;
	move: { x: number; y: number };

	constructor(board: string[][], player: string, move: { x: number; y: number }, parent: Node | null = null) {
		this.board = cloneDeep(board);
		this.player = player;
		this.move = move;
		this.parent = parent;
		this.children = [];
		this.wins = 0;
		this.visits = 0;
	}
}

function selectPromisingNode(node: Node): Node {
	let currentNode = node;
	while (currentNode.children.length !== 0) {
		currentNode = currentNode.children.reduce((maxChild, child) =>
			uctValue(maxChild) > uctValue(child) ? maxChild : child
		);
	}
	return currentNode;
}

function uctValue(node: Node): number {
	if (node.visits === 0) return Infinity;
	return (node.wins / node.visits) + explorationConstant * Math.sqrt(Math.log(node.parent!.visits) / node.visits);
}

function expandNode(node: Node): void {
	const possibleMoves = getPossibleMoves(node.board);
	possibleMoves.forEach((move) => {
		const newBoard = cloneDeep(node.board);
		newBoard[move.y][move.x] = node.player;
		node.children.push(new Node(newBoard, node.player === 'X' ? 'O' : 'X', move, node));
	});
}

function simulateRandomPlayout(node: Node): number {
	let board = cloneDeep(node.board);
	let player = node.player;

	while (true) {
		const winner = getWinner(board);
		if (winner) {
			return winner === 'X' ? 1 : winner === 'O' ? -1 : 0;
		}

		const possibleMoves = getPossibleMoves(board);
		if (possibleMoves.length === 0) return 0;

		const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
		board[move.y][move.x] = player;
		player = player === 'X' ? 'O' : 'X';
	}
}

function backpropagation(node: Node, result: number): void {
	let currentNode: Node | null = node;
	while (currentNode !== null) {
		currentNode.visits++;
		if ((result === 1 && currentNode.player === 'X') || (result === -1 && currentNode.player === 'O')) {
			currentNode.wins++;
		}
		currentNode = currentNode.parent;
	}
}

function getPossibleMoves(board: string[][]): { x: number; y: number }[] {
	const moves: { x: number; y: number }[] = [];
	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board[y].length; x++) {
			if (board[y][x] === '') moves.push({ x, y });
		}
	}
	return moves;
}

function getWinner(board: string[][]): string | null {
	const directions = [
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
		{ x: 1, y: 1 },
		{ x: 1, y: -1 }
	];

	const checkDirection = (x: number, y: number, dx: number, dy: number, player: string) => {
		let count = 0;
		for (let i = 0; i < 5; i++) {
			const nx = x + i * dx;
			const ny = y + i * dy;
			if (nx < 0 || ny < 0 || nx >= board.length || ny >= board.length) break;
			if (board[ny][nx] === player) {
				count++;
			} else {
				break;
			}
		}
		return count === 5;
	};

	for (let y = 0; y < board.length; y++) {
		for (let x = 0; x < board[y].length; x++) {
			if (board[y][x] !== '') {
				const player = board[y][x];
				if (directions.some(direction => checkDirection(x, y, direction.x, direction.y, player))) {
					return player;
				}
			}
		}
	}
	return null;
}

export function mcts(board: string[][]): { x: number, y: number } {
	const root = new Node(board, 'X', { x: -1, y: -1 });

	for (let i = 0; i < simulations; i++) {
		let promisingNode = selectPromisingNode(root);
		if (getWinner(promisingNode.board) === null && promisingNode.visits !== 0) {
			expandNode(promisingNode);
			promisingNode = promisingNode.children[Math.floor(Math.random() * promisingNode.children.length)];
		}
		const result = simulateRandomPlayout(promisingNode);
		backpropagation(promisingNode, result);
	}

	return root.children.reduce((bestChild, child) =>
		child.visits > bestChild.visits ? child : bestChild
	).move;
}

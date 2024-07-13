from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Game
from .serializers import GameSerializer
from django.contrib.auth.models import User

class GameViewSet(viewsets.ModelViewSet):
	queryset = Game.objects.all()
	serializer_class = GameSerializer

	def create(self, request, *args, **kwargs):
		data = request.data
		player_X = User.objects.get(id=data.get('player_X'))
		player_O = User.objects.get(id=data.get('player_O'))
		board_size = data.get('board_size', 15)
		board = [['' for _ in range(board_size)] for _ in range(board_size)]

		game = Game.objects.create(
			player_X=player_X,
			player_O=player_O,
			board=board,
		)
		return Response(GameSerializer(game).data, status=status.HTTP_201_CREATED)

	@action(detail=True, methods=['post'])
	def move(self, request, pk=None):
		game = self.get_object()
		move = request.data.get('move')
		x, y = move['x'], move['y']

		if game.board[y][x] != '':
			return Response({"error": "Invalid move"}, status=400)

		game.board[y][x] = game.current_turn

		if self.check_winner(game.board, game.current_turn):
			game.winner = game.current_turn

		game.current_turn = 'O' if game.current_turn == 'X' else 'X'
		game.save()
		return Response(GameSerializer(game).data)

	def check_winner(self, board, player):
		size = len(board)
		directions = [(1, 0), (0, 1), (1, 1), (1, -1)]

		def count_consecutive(x, y, dx, dy):
			count = 0
			while 0 <= x < size and 0 <= y < size and board[y][x] == player:
				count += 1
				x += dx
				y += dy
			return count

		for y in range(size):
			for x in range(size):
				if board[y][x] == player:
					for dx, dy in directions:
						if count_consecutive(x, y, dx, dy) >= 5:
							return True
		return False

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Game
from .serializers import GameSerializer

class GameViewSet(viewsets.ModelViewSet):
	queryset = Game.objects.all()
	serializer_class = GameSerializer

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
		return False

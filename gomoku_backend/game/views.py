import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Game
from .serializers import GameSerializer
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)

class GameViewSet(viewsets.ModelViewSet):
	queryset = Game.objects.all()
	serializer_class = GameSerializer

	@action(detail=False, methods=['post'])
	def find_or_create(self, request):
		try:
			player_id = request.data.get('player')
			logger.debug(f"Received request to find or create game for player ID: {player_id}")
			player = User.objects.get(id=player_id)
			game = Game.objects.filter(player_O__isnull=True).first()

			if game:
				game.player_O = player
				game.save()
				player_color = 'white'
				logger.debug(f"Joined existing game: {game.id}")
			else:
				game = Game.objects.create(
					player_X=player,
					current_turn='X',
					board=[['' for _ in range(15)] for _ in range(15)]
				)
				player_color = 'black'
				logger.debug(f"Created new game: {game.id}")

			return Response({"game": GameSerializer(game).data, "player_color": player_color}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			logger.error(f"User with ID {player_id} does not exist")
			return Response({"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
		except Exception as e:
			logger.error(f"An error occurred: {e}")
			return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

	@action(detail=True, methods=['post'])
	def move(self, request, pk=None):
		game = self.get_object()
		move = request.data.get('move')
		logger.debug(f"Move data received: {move}")
		x, y = move.get('x'), move.get('y')
		player = move.get('player')

		if x is None or y is None or player is None:
			return Response({"error": "Invalid move data"}, status=400)

		if game.board[y][x] != '':
			return Response({"error": "Invalid move"}, status=400)

		game.board[y][x] = player
		game.move_history.append({'x': x, 'y': y, 'player': player})
		
		if self.check_winner(game.board, player):
			game.winner = player

		game.current_turn = 'O' if player == 'X' else 'X'
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

	@action(detail=True, methods=['get'])
	def check_status(self, request, pk=None):
		game = self.get_object()
		if game.player_O:
			return Response({"status": "ready"}, status=status.HTTP_200_OK)
		return Response({"status": "waiting"}, status=status.HTTP_200_OK)

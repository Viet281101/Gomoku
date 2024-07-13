from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
	board = models.JSONField(default=list)
	current_turn = models.CharField(max_length=1, default='X')
	winner = models.CharField(max_length=1, blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
	player_X = models.ForeignKey(User, related_name='player_X', on_delete=models.CASCADE)
	player_O = models.ForeignKey(User, related_name='player_O', on_delete=models.CASCADE, null=True, blank=True)
	move_history = models.JSONField(default=list)

	def __str__(self):
		return f"Game {self.id} - Current Turn: {self.current_turn}"

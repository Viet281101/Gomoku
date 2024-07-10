from django.db import models

class Game(models.Model):
	board = models.JSONField(default=list)
	current_turn = models.CharField(max_length=1, default='X')
	winner = models.CharField(max_length=1, blank=True, null=True)

	def __str__(self):
		return f"Game {self.id} - Current Turn: {self.current_turn}"

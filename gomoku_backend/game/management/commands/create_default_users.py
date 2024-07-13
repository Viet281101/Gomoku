from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
	help = 'Create default users player_X and player_O'

	def handle(self, *args, **kwargs):
		if not User.objects.filter(username='player_X').exists():
			player_X = User.objects.create_user(username='player_X', password='password123')
			self.stdout.write(self.style.SUCCESS('Successfully created user player_X'))
		else:
			self.stdout.write(self.style.WARNING('User player_X already exists'))

		if not User.objects.filter(username='player_O').exists():
			player_O = User.objects.create_user(username='player_O', password='password123')
			self.stdout.write(self.style.SUCCESS('Successfully created user player_O'))
		else:
			self.stdout.write(self.style.WARNING('User player_O already exists'))

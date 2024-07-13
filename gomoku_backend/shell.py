from django.contrib.auth.models import User

player_X = User.objects.create_user(username='player_X', password='password123')
player_O = User.objects.create_user(username='player_O', password='password123')

#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Run migrations for built-in apps
echo "Running initial migrations..."
python manage.py migrate

# Make and run migrations for the game app
echo "Making migrations for game app..."
python manage.py makemigrations game
echo "Running migrations for game app..."
python manage.py migrate game

# Create default users
echo "Creating default users..."
python manage.py create_default_users

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build script completed successfully."

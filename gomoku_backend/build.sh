#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Run migrations
echo "Running migrations..."
python manage.py makemigrations game
python manage.py migrate

# Check if migrations ran successfully
if [ $? -ne 0 ]; then
	echo "Migrations failed. Exiting."
	exit 1
fi

# Create default users
echo "Creating default users..."
python manage.py create_default_users

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build script completed successfully."

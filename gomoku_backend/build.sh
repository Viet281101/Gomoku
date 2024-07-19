#!/bin/bash

set -e

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running migrations..."
python manage.py migrate

echo "Creating default users..."
python manage.py create_default_users

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Build completed"

#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create default users
python manage.py create_default_users

# Collect static files
python manage.py collectstatic --noinput

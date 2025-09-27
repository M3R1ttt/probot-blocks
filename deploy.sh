#!/bin/bash

echo "=== Manual Deployment Script ==="
echo "Stopping running containers..."
sudo docker compose down || { echo "Docker compose down failed"; exit 1; }
echo "Containers stopped"

echo "Pulling latest changes from origin/stable..."
git pull origin stable || { echo "Git pull failed"; exit 1; }
echo "Latest changes pulled"

echo "Building docker images with no cache..."
sudo docker compose build --no-cache || { echo "Docker build failed"; exit 1; }
echo "Docker images built"

echo "Starting containers in detached mode..."
sudo docker compose up -d || { echo "Docker compose up failed"; exit 1; }
echo "Containers started"

echo "Cleaning up unused docker data..."
sudo docker system prune -af || { echo "Docker system prune failed"; exit 1; }
echo "Docker cleanup completed"

echo "=== Deployment completed successfully ==="
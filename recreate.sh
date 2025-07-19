#!/bin/bash

echo "🔄 Stopping and removing containers..."
docker-compose down

echo "🗑️  Removing images..."
docker-compose down --rmi all

echo "🔧 Building and starting containers..."
docker-compose up --build -d

echo "📋 Container status:"
docker-compose ps

echo "📝 Development URLs:"
echo "  Client: http://localhost:5173"
echo "  Server: http://localhost:3000"

echo "📊 To view logs:"
echo "  All services: docker-compose logs -f"
echo "  Client only:  docker-compose logs -f client"
echo "  Server only:  docker-compose logs -f server"
#!/bin/bash

echo "🚀 Starting development containers..."
docker-compose up -d

echo "📋 Container status:"
docker-compose ps

echo "📝 Development URLs:"
echo "  Client: http://localhost:5173"
echo "  Server: http://localhost:3000"

echo "📊 To view logs:"
echo "  All services: docker-compose logs -f"
echo "  Client only:  docker-compose logs -f client"
echo "  Server only:  docker-compose logs -f server"
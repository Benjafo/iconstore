#!/bin/bash

echo "====================================="
echo "== Stopping and removing containers:"
echo "====================================="
docker compose down

echo "====================================="
echo "== Removing images:"
echo "====================================="
docker compose down --rmi all

echo "====================================="
echo "== Starting development containers:"
echo "====================================="
docker compose up --build -d

echo "====================================="
echo "== Container status:"
echo "====================================="
docker compose ps

echo "====================================="
echo "== Watching logs:"
echo "====================================="
docker compose logs -f
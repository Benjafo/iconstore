#!/bin/bash
echo "====================================="
echo "== Starting development containers:"
echo "====================================="
docker compose up -d

echo "====================================="
echo "== Container status:"
echo "====================================="
docker compose ps

echo "====================================="
echo "== Watching logs:"
echo "====================================="
docker compose logs -f
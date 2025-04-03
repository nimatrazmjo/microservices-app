#!/bin/bash

# Remove old containers if they exist
docker rm -f redis mongo 2>/dev/null

# Start Redis
docker run -d --name redis -p 6379:6379 -v redis-data:/data redis:latest

# Start MongoDB
docker run -d \
  --name mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=example \
  -v mongo-data:/data/db \
  mongo:latest

echo "✅ Containers started successfully!"
#!/bin/bash

# Remove old containers if they exist
docker rm -f redis mongo rabbitmq 2>/dev/null

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

docker run -d \
  --name rabbitmq \
  --health-cmd="rabbitmq-diagnostics -q ping" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

echo "✅ RabbitMQ container started successfully!"
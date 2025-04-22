#!/bin/bash

# Get the absolute path to the project root directory
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)

echo "🔹 Building auth service from: $ROOT_DIR"

# Build the Docker image for authentication
echo "🔹 Building Docker image for auth..."
docker build -t auth:dev -f "$ROOT_DIR/auth/Dockerfile.dev" "$ROOT_DIR/auth/" || {
    echo "❌ Docker build failed"
    exit 1
}

# Apply the auth db
echo "🔹 Applying auth db..."
kubectl apply -f "$ROOT_DIR/k8s/basic/auth/auth-db.yml" || {
    echo "❌ kubectl apply failed for auth db"
    exit 1
}

# Apply the auth deployment
echo "🔹 Applying auth deployment..."
kubectl apply -f "$ROOT_DIR/k8s/basic/auth/auth-deployment.yml" || {
    echo "❌ kubectl apply failed for auth deployment"
    exit 1
}

echo "✅ Auth service deployed successfully!"
#!/bin/bash

# Get the absolute path to the project root directory
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)

echo "🔹 [Frontend Service] Starting deployment"
echo "🔹 Project root: $ROOT_DIR"

# Validate required directories exist
if [[ ! -d "$ROOT_DIR/frontend" ]]; then
    echo "❌ Error: Frontend directory not found at $ROOT_DIR/frontend"
    exit 1
fi

# Build Docker image
echo "🔹 Building Docker image..."
docker build \
    -t frontend:dev \
    -f "$ROOT_DIR/frontend/Dockerfile.dev" \
    "$ROOT_DIR/frontend/" || {
    echo "❌ Docker build failed"
    exit 1
}

# Apply Kubernetes configurations
echo "🔹 Applying Kubernetes deployments..."
kubectl apply -f "$ROOT_DIR/k8s/basic/frontend/frontend-deployment.yml" || {
    echo "❌ kubectl apply failed for frontend deployment"
    exit 1
}

echo "✅ [Frontend Service] Deployment completed successfully!"
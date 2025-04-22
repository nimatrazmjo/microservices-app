#!/bin/bash

# Get the absolute path to the project root directory
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)

echo "🔹 [Profile Service] Starting deployment"
echo "🔹 Project root: $ROOT_DIR"

# Validate required directories exist
if [[ ! -d "$ROOT_DIR/profile" ]]; then
    echo "❌ Error: Profile directory not found at $ROOT_DIR/profile"
    exit 1
fi

# Build Docker image
echo "🔹 Building Docker image..."
docker build \
    -t profile:dev \
    -f "$ROOT_DIR/profile/Dockerfile.dev" \
    "$ROOT_DIR/profile/" || {
    echo "❌ Docker build failed"
    exit 1
}

# Apply Kubernetes configurations
echo "🔹 Applying Kubernetes deployments..."
kubectl apply -f "$ROOT_DIR/k8s/basic/profile/profile-deployment.yml" || {
    echo "❌ kubectl apply failed for profile deployment"
    exit 1
}

echo "✅ [Profile Service] Deployment completed successfully!"
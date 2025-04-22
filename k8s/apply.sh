#!/bin/bash

# Get the absolute path to the project root directory
ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

echo "🔹 Project root directory: $ROOT_DIR"
echo "🔹 Applying Kubernetes configurations..."

# Function to handle errors
handle_error() {
    echo "❌ Error in $1 - Deployment failed!"
    exit 1
}

# Apply shared configurations
echo "🔹 Applying shared configurations..."
kubectl apply -f "$ROOT_DIR/k8s/shared/" || handle_error "shared configurations"

# Run RabbitMQ setup
echo "🔹 Setting up RabbitMQ..."
"$ROOT_DIR/k8s/scripts/rabbitmq-setup.sh" || handle_error "RabbitMQ setup"

# Deploy services
echo "🔹 Deploying services..."
"$ROOT_DIR/k8s/basic/auth/deploy.sh" || handle_error "auth service"
"$ROOT_DIR/k8s/basic/profile/deploy.sh" || handle_error "profile service"
"$ROOT_DIR/k8s/basic/frontend/deploy.sh" || handle_error "frontend service"

# Apply ingress
echo "🔹 Applying ingress configuration..."
kubectl apply -f "$ROOT_DIR/k8s/ingress.yml" || handle_error "ingress configuration"

echo "✅ All deployments completed successfully!"
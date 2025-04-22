#!/bin/bash

# Navigate to the frontend directory (assuming this script is run from k8s/basic/frontend)
cd ../../..
pwd
# Build the Docker image for frontend
echo "Building Docker image for frontend..."
docker build -t frontend:dev -f ./frontend/Dockerfile.dev ./frontend/

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Apply the frontend deployment
echo "Applying frontend deployment..."
kubectl apply -f k8s/basic/frontend/frontend-deployment.yml

# Check if the deployment was successful
if [ $? -ne 0 ]; then
    echo " ❌ kubectl apply failed"
    exit 1
fi

echo "Frontend deployment completed successfully! "
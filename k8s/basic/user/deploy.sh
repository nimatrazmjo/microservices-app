#!/bin/bash

# Navigate to the frontend directory (assuming this script is run from k8s/basic/frontend)
cd ../../..
pwd
# Build the Docker image for profile
echo "Building Docker image for user..."
docker build -t user:dev -f ./user-service/Dockerfile.dev ./user-service/

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "❌ Docker build failed"
    exit 1
fi

# Apply the user deployment
echo "Applying user deployment..."
kubectl apply -f k8s/basic/user/user-deployment.yml

# Check if the deployment was successful
if [ $? -ne 0 ]; then
    echo "❌ kubectl apply failed"
    exit 1
fi

echo "User deployment completed successfully! "
